# Toast, Alert e Banner Implementation Plan

> **Stato:** Completato
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add three new feedback components to the Orbit design system — `OrbitToastService`/`OrbitToastComponent` (transient overlay notifications, stacked per corner), `OrbitAlertComponent` (inline card-level message), and `OrbitBannerComponent` (full-width page/section message) — plus the 3 new icons they need, and a catalog demo page per component in `orbit-lab`.

**Architecture:** Toast follows the exact CDK `Overlay` + `ComponentPortal` pattern already used by `OrbitPanelService`, but keyed by `OrbitToastPosition` so each corner gets its own lazily-created overlay container that stacks multiple toasts vertically. Alert and Banner are plain standalone presentational components (no overlay, no service) rendered directly in the caller's template via `@if`, matching `OrbitBadgeComponent`'s tone-input convention. All three share the same four semantic tones (`success | danger | warning | info`) mapped onto the existing `--orbit-status-*` tokens.

**Tech Stack:** Angular 22 standalone components, signals (`input`/`output`), `ChangeDetectionStrategy.OnPush`, Angular CDK Overlay/Portal, Vitest (via `ng test`), RxJS.

## Global Constraints

- Tones for all three components: `success | danger | warning | info`, mapped to `--orbit-status-{tone}`, `--orbit-status-{tone}-fg`, `--orbit-status-{tone}-subtle` (already defined in `projects/orbit/src/styles/tokens.css`).
- Icon per tone: `success` → `check` (existing), `danger` → `alert-circle` (new), `warning` → `alert-triangle` (new), `info` → `info` (new). New icons: 24x24 viewBox, `stroke="currentColor"`, `fill="none"`, `stroke-width="1.75"`.
- `OrbitToastConfig.duration`: ms, default `5000`; `0` = manual dismiss only; negative values are fail-soft, treated as `0` (no exception thrown).
- Toast auto-dismiss timer pauses on `mouseenter`/internal focus and resumes on `mouseleave`/blur.
- Toast markup: `role="status"` for tone `success|info|warning`, `role="alert"` for `danger`.
- `OrbitToastRef.dismiss()` is idempotent — calling it more than once is a no-op (tracked via internal `dismissed` state), and `afterDismissed$` emits exactly once.
- Alert/Banner are "controlled components": they never hide themselves. The `dismissed` output notifies the parent, which is responsible for removing them from the template (e.g. via `@if`).
- Alert: `role="status"` (or `"alert"` for `danger`). No `aria-live` needed — it's already in the DOM at render, not dynamically announced like the toast.
- Reuse the existing `close` label from `ORBIT_I18N` (`i18n.labels.close`, value `"Chiudi"`) for every dismiss/close button `aria-label` — do not add new i18n keys.
- New component files follow existing Orbit conventions exactly: `ChangeDetectionStrategy.OnPush`, `templateUrl`/`styleUrl` (not inline template unless the existing sibling component you're modeling uses inline), a barrel `index.ts` re-exporting the public symbols, and registration in `projects/orbit/src/public-api.ts`.
- Every new orbit-lab catalog page follows the `SliderPageComponent` pattern exactly: a `lab-<name>-page` standalone component with `templateUrl`, wrapped examples in `<lab-example [code]="...">` with a `data-example="..."` attribute on the demo wrapper, a lazy route in `app.routes.ts`, and an entry appended (alphabetically by `label`, matching existing ordering by Italian label text) to `CATALOG_ENTRIES` in `projects/orbit-lab/src/app/catalog/catalog.ts`.
- Test command prefix for every shell command that runs npm/ng: `source ~/.nvm/nvm.sh && nvm use v24.16.0 &&`.
- Run `orbit` library tests with `npm run test:core -- --watch=false`. Run `orbit-lab` tests with `npm run test -- --watch=false`, or when isolating from the in-progress `examples-page` directory use `npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"` — never move or delete that directory, it belongs to other work.
- Do not run any git commands (no commits, no branch changes, no staging) — this plan only writes files.

---

## File Structure

New files:
- `projects/orbit/src/lib/icons/icon-registry.ts` (modify — add 3 icons)
- `projects/orbit/src/lib/icons/icon.component.spec.ts` (modify — add 3 tests)
- `projects/orbit/src/lib/services/toast/toast-ref.ts` (new — `OrbitToastRef`)
- `projects/orbit/src/lib/services/toast/toast.service.ts` (new — `OrbitToastService`, `OrbitToastConfig`, `OrbitToastTone`, `OrbitToastPosition`, `ORBIT_TOAST_DATA`)
- `projects/orbit/src/lib/services/toast/toast.service.spec.ts` (new)
- `projects/orbit/src/lib/services/toast/index.ts` (new)
- `projects/orbit/src/lib/components/toast/toast.component.ts` / `.html` / `.css` / `.spec.ts` (new)
- `projects/orbit/src/lib/components/toast/index.ts` (new)
- `projects/orbit/src/lib/components/alert/alert.component.ts` / `.html` / `.css` / `.spec.ts` (new)
- `projects/orbit/src/lib/components/alert/index.ts` (new)
- `projects/orbit/src/lib/components/banner/banner.component.ts` / `.html` / `.css` / `.spec.ts` (new)
- `projects/orbit/src/lib/components/banner/index.ts` (new)
- `projects/orbit/src/public-api.ts` (modify — add 3 barrel exports)
- `projects/orbit-lab/src/app/pages/toast-page/toast-page.component.ts` / `.html` / `.css` / `.spec.ts` (new)
- `projects/orbit-lab/src/app/pages/alert-page/alert-page.component.ts` / `.html` / `.spec.ts` (new)
- `projects/orbit-lab/src/app/pages/banner-page/banner-page.component.ts` / `.html` / `.spec.ts` (new)
- `projects/orbit-lab/src/app/app.routes.ts` (modify — 3 routes)
- `projects/orbit-lab/src/app/catalog/catalog.ts` (modify — 3 entries)

---

### Task 1: New icons — `alert-circle`, `alert-triangle`, `info`

**Files:**
- Modify: `projects/orbit/src/lib/icons/icon-registry.ts`
- Modify: `projects/orbit/src/lib/icons/icon.component.spec.ts`

**Interfaces:**
- Produces: `OrbitIconName` union gains `'alert-circle' | 'alert-triangle' | 'info'`; `ORBIT_ICON_PATHS` gains matching entries. Later tasks (toast/alert/banner components) consume these three names directly as `OrbitIconName` values.

- [x] **Step 1: Write the failing tests**

Add these three tests to `projects/orbit/src/lib/icons/icon.component.spec.ts`, right after the existing `'renders the slider icon...'` test (before the `'uses a 24x24 viewBox...'` test):

```typescript
  it('renders the alert-circle icon with a circle and an exclamation mark', () => {
    fixture.componentRef.setInput('name', 'alert-circle');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('path').length).toBe(3);
  });

  it('renders the alert-triangle icon with a triangle and an exclamation mark', () => {
    fixture.componentRef.setInput('name', 'alert-triangle');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('path').length).toBe(3);
  });

  it('renders the info icon with a circle and an i mark', () => {
    fixture.componentRef.setInput('name', 'info');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('path').length).toBe(3);
  });
```

- [x] **Step 2: Run the tests to verify they fail**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`

Expected: FAIL — `alert-circle`/`alert-triangle`/`info` are not assignable to `OrbitIconName` (TypeScript compile error) or, if compilation is loose enough to run, the three new tests fail because `ORBIT_ICON_PATHS[undefined]` yields no paths.

- [x] **Step 3: Add the icons to the registry**

In `projects/orbit/src/lib/icons/icon-registry.ts`, extend the `OrbitIconName` union (append after `'slider'`):

```typescript
export type OrbitIconName =
  | 'close'
  | 'calendar'
  | 'chevron-down'
  | 'check'
  | 'copy'
  | 'mail'
  | 'lock'
  | 'phone'
  | 'link'
  | 'home'
  | 'layers'
  | 'settings'
  | 'user'
  | 'document'
  | 'view'
  | 'download'
  | 'remove'
  | 'retry'
  | 'search'
  | 'menu'
  | 'tag'
  | 'window'
  | 'grid'
  | 'toggle'
  | 'message-circle'
  | 'sidebar'
  | 'paperclip'
  | 'square'
  | 'slider'
  | 'alert-circle'
  | 'alert-triangle'
  | 'info';
```

Add these entries to `ORBIT_ICON_PATHS`, right after the `slider` entry (before the closing `};`):

```typescript
  'alert-circle': [
    'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z',
    'M12 8v5',
    'M12 15.75v.01',
  ],
  'alert-triangle': [
    'M10.6 4.4a1.6 1.6 0 0 1 2.8 0l7.6 13.2a1.6 1.6 0 0 1-1.4 2.4H4.4a1.6 1.6 0 0 1-1.4-2.4L10.6 4.4Z',
    'M12 9.5v4.5',
    'M12 17.25v.01',
  ],
  info: [
    'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z',
    'M12 11v5.5',
    'M12 7.75v.01',
  ],
```

- [x] **Step 4: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`

Expected: PASS — all `OrbitIconComponent` tests green, including the 3 new ones.

- [x] **Step 5: Commit**

(Skipped — this plan does not run git commands. Leave the change staged in the working tree for the user to commit.)

---

### Task 2: `OrbitToastRef` and `OrbitToastService`

**Files:**
- Create: `projects/orbit/src/lib/services/toast/toast-ref.ts`
- Create: `projects/orbit/src/lib/services/toast/toast.service.ts`
- Create: `projects/orbit/src/lib/services/toast/toast.service.spec.ts`
- Create: `projects/orbit/src/lib/services/toast/index.ts`

**Interfaces:**
- Consumes: `Overlay`, `OverlayConfig`, `OverlayRef` from `@angular/cdk/overlay`; `ComponentPortal`, `ComponentType` from `@angular/cdk/portal`; the future `OrbitToastComponent` from Task 3 (imported by type only — the service takes any `ComponentType`, but this task's own spec uses a small local test host component, so `OrbitToastComponent` is NOT a compile-time dependency of this task).
- Produces (consumed by Task 3's component, Task 5's demo pages, and `public-api.ts`):
  - `export type OrbitToastTone = 'success' | 'danger' | 'warning' | 'info';`
  - `export type OrbitToastPosition = 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';`
  - `export interface OrbitToastConfig { message: string; tone?: OrbitToastTone; position?: OrbitToastPosition; duration?: number; dismissible?: boolean; }`
  - `export const ORBIT_TOAST_DATA = new InjectionToken<OrbitToastConfig & { tone: OrbitToastTone; dismissible: boolean }>('ORBIT_TOAST_DATA');` — resolved config injected into the toast component instance (message/tone/dismissible with defaults already applied; `ref` injected separately).
  - `export const ORBIT_TOAST_REF = new InjectionToken<OrbitToastRef>('ORBIT_TOAST_REF');` — the toast component injects this to call `dismiss()` from its own close button and to pause/resume the timer on hover/focus.
  - `export class OrbitToastRef { dismiss(): void; pauseAutoDismiss(): void; resumeAutoDismiss(): void; readonly afterDismissed$: Observable<void>; }`
  - `export class OrbitToastService { show(config: OrbitToastConfig): OrbitToastRef; dismissAll(): void; }` (`providedIn: 'root'`)

- [x] **Step 1: Write `OrbitToastRef`**

Create `projects/orbit/src/lib/services/toast/toast-ref.ts`:

```typescript
import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

/**
 * Handle returned by `OrbitToastService.show()`. Lets the caller dismiss the
 * toast programmatically and observe when it has actually been removed.
 */
export class OrbitToastRef {
  private readonly afterDismissedSubject = new Subject<void>();
  readonly afterDismissed$ = this.afterDismissedSubject.asObservable();

  private dismissed = false;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private remainingMs = 0;
  private startedAt = 0;

  constructor(
    private readonly overlayRef: OverlayRef,
    private readonly duration: number,
    private readonly onDismissed: () => void,
  ) {
    this.remainingMs = duration;
    this.startTimer();
  }

  dismiss(): void {
    if (this.dismissed) return;
    this.dismissed = true;
    this.clearTimer();
    this.overlayRef.detach();
    this.onDismissed();
    this.afterDismissedSubject.next();
    this.afterDismissedSubject.complete();
  }

  pauseAutoDismiss(): void {
    if (this.dismissed || this.timeoutId === null) return;
    this.remainingMs -= Date.now() - this.startedAt;
    this.clearTimer();
  }

  resumeAutoDismiss(): void {
    if (this.dismissed || this.duration <= 0 || this.timeoutId !== null) return;
    this.startTimer();
  }

  private startTimer(): void {
    if (this.duration <= 0 || this.remainingMs <= 0) return;
    this.startedAt = Date.now();
    this.timeoutId = setTimeout(() => this.dismiss(), this.remainingMs);
  }

  private clearTimer(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
```

- [x] **Step 2: Write `OrbitToastService`**

Create `projects/orbit/src/lib/services/toast/toast.service.ts`:

```typescript
import { Injectable, InjectionToken, Injector, inject } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OrbitToastRef } from './toast-ref';

export type OrbitToastTone = 'success' | 'danger' | 'warning' | 'info';

export type OrbitToastPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end';

export interface OrbitToastConfig {
  message: string;
  tone?: OrbitToastTone;
  position?: OrbitToastPosition;
  duration?: number;
  dismissible?: boolean;
}

export interface OrbitToastData {
  message: string;
  tone: OrbitToastTone;
  dismissible: boolean;
}

export const ORBIT_TOAST_DATA = new InjectionToken<OrbitToastData>('ORBIT_TOAST_DATA');
export const ORBIT_TOAST_REF = new InjectionToken<OrbitToastRef>('ORBIT_TOAST_REF');

const DEFAULT_DURATION = 5000;

interface ToastContainer {
  overlayRef: OverlayRef;
  refs: OrbitToastRef[];
}

@Injectable({ providedIn: 'root' })
export class OrbitToastService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private containers = new Map<OrbitToastPosition, ToastContainer>();

  show(config: OrbitToastConfig): OrbitToastRef {
    const position = config.position ?? 'bottom-end';
    const tone = config.tone ?? 'info';
    const dismissible = config.dismissible ?? true;
    const rawDuration = config.duration ?? DEFAULT_DURATION;
    const duration = rawDuration < 0 ? 0 : rawDuration;

    const container = this.getOrCreateContainer(position);

    const toastInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: ORBIT_TOAST_DATA, useValue: { message: config.message, tone, dismissible } },
      ],
    });

    // Import kept lazy-free: the component class is provided by the caller's
    // module graph via `ORBIT_TOAST_COMPONENT`-free direct import below.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { OrbitToastComponent } = require('../../components/toast/toast.component') as typeof import('../../components/toast/toast.component');

    const portal = new ComponentPortal(OrbitToastComponent, null, toastInjector);
    const componentRef = container.overlayRef.attach(portal);

    const ref = new OrbitToastRef(container.overlayRef, duration, () => {
      this.removeRef(position, ref);
    });

    const refInjector = Injector.create({
      parent: this.injector,
      providers: [{ provide: ORBIT_TOAST_REF, useValue: ref }],
    });
    void refInjector; // ORBIT_TOAST_REF is provided per-portal below instead.

    componentRef.changeDetectorRef.detectChanges();

    const isTop = position.startsWith('top');
    if (isTop) container.refs.push(ref);
    else container.refs.unshift(ref);

    return ref;
  }

  dismissAll(): void {
    for (const container of this.containers.values()) {
      [...container.refs].forEach((ref) => ref.dismiss());
    }
  }

  private getOrCreateContainer(position: OrbitToastPosition): ToastContainer {
    const existing = this.containers.get(position);
    if (existing) return existing;

    const positionStrategy = this.overlay.position().global();
    if (position.startsWith('top')) positionStrategy.top('16px');
    else positionStrategy.bottom('16px');
    if (position.endsWith('start')) positionStrategy.left('16px');
    else if (position.endsWith('end')) positionStrategy.right('16px');
    else positionStrategy.centerHorizontally();

    const overlayConfig: OverlayConfig = {
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      panelClass: ['orbit-toast-container', `orbit-toast-container--${position}`],
    };

    const overlayRef = this.overlay.create(overlayConfig);
    const container: ToastContainer = { overlayRef, refs: [] };
    this.containers.set(position, container);
    return container;
  }

  private removeRef(position: OrbitToastPosition, ref: OrbitToastRef): void {
    const container = this.containers.get(position);
    if (!container) return;
    const idx = container.refs.indexOf(ref);
    if (idx > -1) container.refs.splice(idx, 1);
    if (container.refs.length === 0) {
      container.overlayRef.dispose();
      this.containers.delete(position);
    }
  }
}
```

**IMPORTANT — fix the `require()` before moving on.** The snippet above uses a CommonJS `require()` as a placeholder to avoid a forward reference to Task 3's not-yet-written component; this does **not** work in an ESM/webpack build and must not ship. Immediately replace it: since Task 3 creates `OrbitToastComponent` in `../../components/toast/toast.component`, add a normal top-of-file import once that file exists:

```typescript
import { OrbitToastComponent } from '../../components/toast/toast.component';
```

and delete the `require(...)` line and its surrounding comment, replacing the portal construction with:

```typescript
    const portal = new ComponentPortal(OrbitToastComponent, null, toastInjector);
```

Also delete the dead `refInjector`/`void refInjector` lines — they were a leftover from drafting and are not needed: the toast component gets `ORBIT_TOAST_REF` from the injector passed to the portal, so `toastInjector`'s providers array must include it too. Fix `toastInjector` construction to:

```typescript
    const ref = new OrbitToastRef(container.overlayRef, duration, () => {
      this.removeRef(position, ref);
    });

    const toastInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: ORBIT_TOAST_DATA, useValue: { message: config.message, tone, dismissible } },
        { provide: ORBIT_TOAST_REF, useValue: ref },
      ],
    });

    const portal = new ComponentPortal(OrbitToastComponent, null, toastInjector);
    const componentRef = container.overlayRef.attach(portal);
    componentRef.changeDetectorRef.detectChanges();
```

Because `ref` must exist before `toastInjector` is built (it needs `container.overlayRef`, which already exists at this point) and `container.overlayRef.attach` needs the portal built from `toastInjector`, the full corrected `show()` method (replacing the entire method body written above) is:

```typescript
  show(config: OrbitToastConfig): OrbitToastRef {
    const position = config.position ?? 'bottom-end';
    const tone = config.tone ?? 'info';
    const dismissible = config.dismissible ?? true;
    const rawDuration = config.duration ?? DEFAULT_DURATION;
    const duration = rawDuration < 0 ? 0 : rawDuration;

    const container = this.getOrCreateContainer(position);

    const ref = new OrbitToastRef(container.overlayRef, duration, () => {
      this.removeRef(position, ref);
    });

    const toastInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: ORBIT_TOAST_DATA, useValue: { message: config.message, tone, dismissible } },
        { provide: ORBIT_TOAST_REF, useValue: ref },
      ],
    });

    const portal = new ComponentPortal(OrbitToastComponent, null, toastInjector);
    const componentRef = container.overlayRef.attach(portal);
    componentRef.changeDetectorRef.detectChanges();

    const isTop = position.startsWith('top');
    if (isTop) container.refs.push(ref);
    else container.refs.unshift(ref);

    return ref;
  }
```

And the file's import list becomes:

```typescript
import { Injectable, InjectionToken, Injector, inject } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OrbitToastComponent } from '../../components/toast/toast.component';
import { OrbitToastRef } from './toast-ref';
```

This creates a real dependency from `toast.service.ts` on Task 3's `toast.component.ts`. That is intentional and mirrors how `OrbitPanelService` takes a `ComponentType` — here the type is fixed to `OrbitToastComponent` because the service owns the markup (the design spec's toast is a single reusable visual, not an arbitrary portal like the panel). **Because of this dependency, do Task 3 immediately after finishing Task 2's non-service files, and only write `toast.service.spec.ts` (Step 4 below) after Task 3's component exists** — this plan orders Task 3 next for exactly that reason; if executed by a subagent per task, tell the Task 2 implementer to stop after Step 3 (leave the spec for a follow-up once Task 3 lands), and have the Task 3 implementer finish Task 2 Steps 4-6 as part of wiring the component in.

- [x] **Step 3: Write the barrel**

Create `projects/orbit/src/lib/services/toast/index.ts`:

```typescript
export { OrbitToastService } from './toast.service';
export { OrbitToastRef } from './toast-ref';
export { ORBIT_TOAST_DATA, ORBIT_TOAST_REF } from './toast.service';
export type { OrbitToastConfig, OrbitToastData, OrbitToastTone, OrbitToastPosition } from './toast.service';
```

- [x] **Step 4: Write the failing service tests (do this only after Task 3's `OrbitToastComponent` exists)**

Create `projects/orbit/src/lib/services/toast/toast.service.spec.ts`:

```typescript
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OrbitToastService } from './toast.service';

describe('OrbitToastService', () => {
  let service: OrbitToastService;
  let overlayContainer: OverlayContainer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrbitToastService);
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('shows a toast with the given message', () => {
    service.show({ message: 'Salvato' });

    expect(overlayContainer.getContainerElement().textContent).toContain('Salvato');
  });

  it('stacks multiple toasts in the same position container, most recent nearest the edge', fakeAsync(() => {
    service.show({ message: 'Primo', position: 'bottom-end', duration: 0 });
    service.show({ message: 'Secondo', position: 'bottom-end', duration: 0 });

    const container = overlayContainer
      .getContainerElement()
      .querySelector('.orbit-toast-container--bottom-end') as HTMLElement;
    const messages = Array.from(container.querySelectorAll('.orbit-toast')).map((el) =>
      el.textContent?.trim(),
    );

    expect(messages[0]).toContain('Secondo');
    expect(messages[1]).toContain('Primo');
  }));

  it('creates a separate container per position', () => {
    service.show({ message: 'A', position: 'top-start', duration: 0 });
    service.show({ message: 'B', position: 'bottom-end', duration: 0 });

    expect(
      overlayContainer.getContainerElement().querySelectorAll('.orbit-toast-container').length,
    ).toBe(2);
  });

  it('auto-dismisses after the configured duration', fakeAsync(() => {
    service.show({ message: 'Auto', duration: 1000 });
    expect(overlayContainer.getContainerElement().textContent).toContain('Auto');

    tick(1000);

    expect(overlayContainer.getContainerElement().textContent).not.toContain('Auto');
  }));

  it('never auto-dismisses when duration is 0', fakeAsync(() => {
    service.show({ message: 'Manuale', duration: 0 });

    tick(10000);

    expect(overlayContainer.getContainerElement().textContent).toContain('Manuale');
  }));

  it('treats a negative duration as manual dismiss (fail-soft, no throw)', fakeAsync(() => {
    expect(() => service.show({ message: 'Negativo', duration: -500 })).not.toThrow();

    tick(10000);

    expect(overlayContainer.getContainerElement().textContent).toContain('Negativo');
  }));

  it('pauses the auto-dismiss timer on mouseenter and resumes on mouseleave', fakeAsync(() => {
    service.show({ message: 'Hover', duration: 1000 });
    const toastEl = overlayContainer.getContainerElement().querySelector('.orbit-toast') as HTMLElement;

    tick(800);
    toastEl.dispatchEvent(new MouseEvent('mouseenter'));
    tick(5000);
    expect(overlayContainer.getContainerElement().textContent).toContain('Hover');

    toastEl.dispatchEvent(new MouseEvent('mouseleave'));
    tick(200);
    expect(overlayContainer.getContainerElement().textContent).not.toContain('Hover');
  }));

  it('dismissAll() closes every open toast across all positions', () => {
    service.show({ message: 'A', position: 'top-start', duration: 0 });
    service.show({ message: 'B', position: 'bottom-end', duration: 0 });

    service.dismissAll();

    expect(overlayContainer.getContainerElement().textContent).not.toContain('A');
    expect(overlayContainer.getContainerElement().textContent).not.toContain('B');
  });

  it('destroys the position container once its last toast is dismissed', () => {
    const ref = service.show({ message: 'Solo', position: 'top-center', duration: 0 });

    ref.dismiss();

    expect(
      overlayContainer.getContainerElement().querySelector('.orbit-toast-container--top-center'),
    ).toBeNull();
  });

  it('ref.dismiss() is a no-op when called twice, afterDismissed$ emits once', () => {
    const ref = service.show({ message: 'Doppio', duration: 0 });
    let emitCount = 0;
    ref.afterDismissed$.subscribe(() => emitCount++);

    ref.dismiss();
    ref.dismiss();

    expect(emitCount).toBe(1);
  });
});
```

- [x] **Step 5: Run the tests to verify they fail, then pass**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`

Before Task 3 lands (component doesn't exist / import fails): expected FAIL with a module-not-found error on `../../components/toast/toast.component`. After Task 3 is complete, re-run the same command; expected PASS for every test listed above. If the stacking test's DOM order is wrong (e.g. `bottom-end` should push new items so the most recent is nearest the screen edge — i.e. first in DOM if the container is `flex-direction: column-reverse`, or you choose to keep normal order and rely on `unshift` as coded above), adjust `toast.component.html`'s container CSS in Task 3 rather than the service's `unshift`/`push` logic, since the service only controls array order and the visual "nearest the edge" requirement is a CSS concern for `bottom-*` vs `top-*` containers (see Task 3 Step 3 CSS).

- [x] **Step 6: Commit**

(Skipped — no git commands in this plan.)

---

### Task 3: `OrbitToastComponent`

**Files:**
- Create: `projects/orbit/src/lib/components/toast/toast.component.ts`
- Create: `projects/orbit/src/lib/components/toast/toast.component.html`
- Create: `projects/orbit/src/lib/components/toast/toast.component.css`
- Create: `projects/orbit/src/lib/components/toast/toast.component.spec.ts`
- Create: `projects/orbit/src/lib/components/toast/index.ts`

**Interfaces:**
- Consumes: `ORBIT_TOAST_DATA`, `ORBIT_TOAST_REF` (`InjectionToken`s from Task 2's `toast.service.ts`), `OrbitToastRef` (Task 2), `OrbitIconComponent` (existing, `projects/orbit/src/lib/icons/icon.component.ts`), `OrbitIconButtonComponent` (existing, `projects/orbit/src/lib/components/icon-button/icon-button.component.ts`), `ORBIT_I18N` (existing, `projects/orbit/src/lib/i18n/orbit-i18n.ts`), the 3 new icon names from Task 1 (`alert-circle`, `alert-triangle`, `info`) plus existing `check`.
- Produces: `OrbitToastComponent` class, consumed by Task 2's `toast.service.ts` (`ComponentPortal(OrbitToastComponent, ...)`) and re-exported from `projects/orbit/src/public-api.ts` (Task 6).

- [x] **Step 1: Write the component class**

Create `projects/orbit/src/lib/components/toast/toast.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import { OrbitIconButtonComponent } from '../icon-button/icon-button.component';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';
import { ORBIT_TOAST_DATA, ORBIT_TOAST_REF } from '../../services/toast/toast.service';
import type { OrbitToastTone } from '../../services/toast/toast.service';
import type { OrbitIconName } from '../../icons/icon-registry';

const TONE_ICON: Record<OrbitToastTone, OrbitIconName> = {
  success: 'check',
  danger: 'alert-circle',
  warning: 'alert-triangle',
  info: 'info',
};

@Component({
  selector: 'orbit-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent, OrbitIconButtonComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  host: {
    class: 'orbit-toast',
    '[class.orbit-toast--success]': "data.tone === 'success'",
    '[class.orbit-toast--danger]': "data.tone === 'danger'",
    '[class.orbit-toast--warning]': "data.tone === 'warning'",
    '[class.orbit-toast--info]': "data.tone === 'info'",
    '[attr.role]': "data.tone === 'danger' ? 'alert' : 'status'",
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onMouseEnter()',
    '(focusout)': 'onMouseLeave()',
  },
})
export class OrbitToastComponent {
  protected readonly data = inject(ORBIT_TOAST_DATA);
  protected readonly ref = inject(ORBIT_TOAST_REF);
  protected readonly i18n = inject(ORBIT_I18N);

  protected readonly icon = computed(() => TONE_ICON[this.data.tone]);

  onMouseEnter(): void {
    this.ref.pauseAutoDismiss();
  }

  onMouseLeave(): void {
    this.ref.resumeAutoDismiss();
  }

  dismiss(): void {
    this.ref.dismiss();
  }
}
```

- [x] **Step 2: Write the template**

Create `projects/orbit/src/lib/components/toast/toast.component.html`:

```html
<orbit-icon [name]="icon()" class="orbit-toast__icon" />
<p class="orbit-toast__message">{{ data.message }}</p>
@if (data.dismissible) {
  <orbit-icon-button
    class="orbit-toast__close"
    icon="close"
    [ariaLabel]="i18n.labels.close"
    (clicked)="dismiss()"
  />
}
```

- [x] **Step 3: Write the CSS**

Create `projects/orbit/src/lib/components/toast/toast.component.css`. This file also carries the position-container rules that Task 2's service applies via `panelClass` (`.orbit-toast-container`, `.orbit-toast-container--<position>`) — CDK overlay panes pick up global styles from the loaded stylesheet, so these selectors work even though the container element itself is created by the service, not this component:

```css
:host.orbit-toast {
  display: flex;
  align-items: flex-start;
  gap: var(--orbit-space-3);
  padding: var(--orbit-space-4);
  border-radius: var(--orbit-radius-surface);
  background: var(--orbit-surface-default);
  border: 1px solid var(--orbit-border-subtle);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 280px;
  max-width: 420px;
  pointer-events: auto;
}

:host.orbit-toast--success {
  border-color: var(--orbit-status-success);
}
:host.orbit-toast--success .orbit-toast__icon {
  color: var(--orbit-status-success);
}

:host.orbit-toast--danger {
  border-color: var(--orbit-status-danger);
}
:host.orbit-toast--danger .orbit-toast__icon {
  color: var(--orbit-status-danger);
}

:host.orbit-toast--warning {
  border-color: var(--orbit-status-warning);
}
:host.orbit-toast--warning .orbit-toast__icon {
  color: var(--orbit-status-warning);
}

:host.orbit-toast--info {
  border-color: var(--orbit-status-info);
}
:host.orbit-toast--info .orbit-toast__icon {
  color: var(--orbit-status-info);
}

.orbit-toast__icon {
  flex: none;
  margin-top: var(--orbit-space-1);
}

.orbit-toast__message {
  flex: 1 1 auto;
  margin: 0;
  font-family: var(--orbit-font-sans);
  font-size: var(--orbit-font-size-body);
  color: var(--orbit-ref-neutral-900, inherit);
}

.orbit-toast__close {
  flex: none;
}
```

Then, in a **global** (non-component-scoped) stylesheet reachable by the overlay pane — `projects/orbit/src/styles/tokens.css` is imported globally already, so append these rules there instead, right after the `--orbit-z-toast` token block or any convenient top-level section — add:

```css
.orbit-toast-container {
  z-index: var(--orbit-z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--orbit-space-3);
  pointer-events: none;
}
.orbit-toast-container .orbit-toast {
  pointer-events: auto;
}
.orbit-toast-container--top-start,
.orbit-toast-container--top-center,
.orbit-toast-container--top-end {
  flex-direction: column;
}
.orbit-toast-container--bottom-start,
.orbit-toast-container--bottom-center,
.orbit-toast-container--bottom-end {
  flex-direction: column-reverse;
}
```

This makes `top-*` containers stack newest-at-bottom (appended via `push` in the service) and `bottom-*` containers stack newest-at-bottom-of-DOM-but-visually-nearest-the-bottom-edge via `column-reverse` (also appended via `unshift`, so the DOM order is oldest-first but the reversed flex direction renders the most recently unshifted item, which is DOM-first, at the bottom). Verify this visually against Task 2's stacking test, which asserts `messages[0]` (first child in DOM) is the most recently shown toast for `bottom-end` — since Task 2's service `unshift`s for bottom positions, the newest toast is DOM-first, and `column-reverse` then renders DOM-first at the bottom, i.e. nearest the screen edge. This matches the spec's stacking requirement exactly.

- [x] **Step 4: Write the barrel**

Create `projects/orbit/src/lib/components/toast/index.ts`:

```typescript
export { OrbitToastComponent } from './toast.component';
```

- [x] **Step 5: Finish Task 2 — replace the `require()` placeholder and write `toast.service.spec.ts`**

Now that `OrbitToastComponent` exists, go back to `projects/orbit/src/lib/services/toast/toast.service.ts` and apply the fix described in Task 2 Step 2 ("IMPORTANT — fix the `require()` before moving on"): replace the `require(...)` line with a top-level `import { OrbitToastComponent } from '../../components/toast/toast.component';`, delete the dead `refInjector` lines, and use the corrected `show()` method body shown there. Then create `projects/orbit/src/lib/services/toast/toast.service.spec.ts` exactly as written in Task 2 Step 4.

- [x] **Step 6: Write the component spec**

Create `projects/orbit/src/lib/components/toast/toast.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { OrbitToastComponent } from './toast.component';
import { ORBIT_TOAST_DATA, ORBIT_TOAST_REF } from '../../services/toast/toast.service';
import type { OrbitToastRef } from '../../services/toast/toast-ref';

function createFixture(
  data: { message: string; tone: 'success' | 'danger' | 'warning' | 'info'; dismissible: boolean },
  ref: Partial<OrbitToastRef> = {},
): ComponentFixture<OrbitToastComponent> {
  TestBed.configureTestingModule({
    imports: [OrbitToastComponent],
    providers: [
      { provide: ORBIT_TOAST_DATA, useValue: data },
      { provide: ORBIT_TOAST_REF, useValue: ref },
    ],
  });
  const fixture = TestBed.createComponent(OrbitToastComponent);
  fixture.detectChanges();
  return fixture;
}

describe('OrbitToastComponent', () => {
  it('renders the message', () => {
    const fixture = createFixture({ message: 'Operazione completata', tone: 'info', dismissible: false });
    expect(fixture.nativeElement.textContent).toContain('Operazione completata');
  });

  it('uses role="alert" for the danger tone', () => {
    const fixture = createFixture({ message: 'Errore', tone: 'danger', dismissible: false });
    expect(fixture.nativeElement.getAttribute('role')).toBe('alert');
  });

  it.each(['success', 'warning', 'info'] as const)('uses role="status" for the %s tone', (tone) => {
    const fixture = createFixture({ message: 'Info', tone, dismissible: false });
    expect(fixture.nativeElement.getAttribute('role')).toBe('status');
  });

  it('shows the close button only when dismissible', () => {
    const dismissibleFixture = createFixture({ message: 'A', tone: 'info', dismissible: true });
    expect(dismissibleFixture.nativeElement.querySelector('.orbit-toast__close')).toBeTruthy();

    const nonDismissibleFixture = createFixture({ message: 'B', tone: 'info', dismissible: false });
    expect(nonDismissibleFixture.nativeElement.querySelector('.orbit-toast__close')).toBeNull();
  });

  it('calls ref.dismiss() when the close button is clicked', () => {
    const dismiss = vi.fn();
    const fixture = createFixture({ message: 'A', tone: 'info', dismissible: true }, { dismiss });
    (fixture.nativeElement.querySelector('.orbit-toast__close button') as HTMLButtonElement).click();
    expect(dismiss).toHaveBeenCalledOnce();
  });

  it('pauses on mouseenter and resumes on mouseleave', () => {
    const pauseAutoDismiss = vi.fn();
    const resumeAutoDismiss = vi.fn();
    const fixture = createFixture(
      { message: 'A', tone: 'info', dismissible: false },
      { pauseAutoDismiss, resumeAutoDismiss },
    );

    fixture.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    expect(pauseAutoDismiss).toHaveBeenCalledOnce();

    fixture.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
    expect(resumeAutoDismiss).toHaveBeenCalledOnce();
  });
});
```

- [x] **Step 7: Run all toast tests and verify they pass**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`

Expected: PASS for `toast.component.spec.ts` and `toast.service.spec.ts` (from Task 2 Step 5), plus all previously-passing tests still green.

- [x] **Step 8: Commit**

(Skipped — no git commands in this plan.)

---

### Task 4: `OrbitAlertComponent`

**Files:**
- Create: `projects/orbit/src/lib/components/alert/alert.component.ts`
- Create: `projects/orbit/src/lib/components/alert/alert.component.html`
- Create: `projects/orbit/src/lib/components/alert/alert.component.css`
- Create: `projects/orbit/src/lib/components/alert/alert.component.spec.ts`
- Create: `projects/orbit/src/lib/components/alert/index.ts`

**Interfaces:**
- Consumes: `OrbitIconComponent`, `OrbitIconButtonComponent`, `ORBIT_I18N` (all existing, same imports as Task 3).
- Produces: `export type OrbitAlertTone = 'success' | 'danger' | 'warning' | 'info';` and `OrbitAlertComponent` with `tone = input<OrbitAlertTone>('info')`, `dismissible = input(false, { transform: booleanAttribute })`, `dismissed = output<void>()`. Consumed by Task 7 (alert catalog page) and `public-api.ts` (Task 6).

- [x] **Step 1: Write the failing component spec**

Create `projects/orbit/src/lib/components/alert/alert.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitAlertComponent } from './alert.component';

describe('OrbitAlertComponent', () => {
  let fixture: ComponentFixture<OrbitAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitAlertComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitAlertComponent);
  });

  it('creates with the default info tone', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-alert--info')).toBe(true);
  });

  it('renders projected content', () => {
    fixture.detectChanges();
    fixture.nativeElement.innerHTML =
      '<orbit-alert></orbit-alert>'; // placeholder, real projection asserted via TestHostComponent below
  });

  it.each([
    ['success', 'check'],
    ['danger', 'alert-circle'],
    ['warning', 'alert-triangle'],
    ['info', 'info'],
  ] as const)('shows the %s icon for the %s tone', (tone, expectedIcon) => {
    fixture.componentRef.setInput('tone', tone);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('orbit-icon');
    expect(icon.getAttribute('ng-reflect-name') ?? icon.getAttribute('name')).toBeTruthy();
  });

  it('uses role="alert" for the danger tone and role="status" otherwise', () => {
    fixture.componentRef.setInput('tone', 'danger');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('alert');

    fixture.componentRef.setInput('tone', 'success');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('status');
  });

  it('shows the dismiss button only when dismissible is true', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-alert__close')).toBeNull();

    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-alert__close')).toBeTruthy();
  });

  it('emits dismissed when the close button is clicked, without hiding itself', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.dismissed.subscribe(() => (emitted = true));
    (fixture.nativeElement.querySelector('.orbit-alert__close button') as HTMLButtonElement).click();

    expect(emitted).toBe(true);
    expect(fixture.nativeElement.querySelector('.orbit-alert')).toBeTruthy();
  });
});
```

Replace the placeholder "renders projected content" test above with a real projection test using a host component, since `<ng-content>` can't be asserted by setting `innerHTML` after the fact. Use this instead:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'test-alert-host',
  standalone: true,
  imports: [OrbitAlertComponent],
  template: `<orbit-alert>Operazione riuscita</orbit-alert>`,
})
class TestAlertHostComponent {}
```

and the test body:

```typescript
  it('renders projected content', async () => {
    const hostFixture = TestBed.createComponent(TestAlertHostComponent);
    hostFixture.detectChanges();
    expect(hostFixture.nativeElement.textContent).toContain('Operazione riuscita');
  });
```

Final full file for `projects/orbit/src/lib/components/alert/alert.component.spec.ts`:

```typescript
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { OrbitAlertComponent } from './alert.component';

@Component({
  selector: 'test-alert-host',
  standalone: true,
  imports: [OrbitAlertComponent],
  template: `<orbit-alert>Operazione riuscita</orbit-alert>`,
})
class TestAlertHostComponent {}

describe('OrbitAlertComponent', () => {
  let fixture: ComponentFixture<OrbitAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitAlertComponent, TestAlertHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitAlertComponent);
  });

  it('creates with the default info tone', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-alert--info')).toBe(true);
  });

  it('renders projected content', () => {
    const hostFixture = TestBed.createComponent(TestAlertHostComponent);
    hostFixture.detectChanges();
    expect(hostFixture.nativeElement.textContent).toContain('Operazione riuscita');
  });

  it.each([
    ['success', 'check'],
    ['danger', 'alert-circle'],
    ['warning', 'alert-triangle'],
    ['info', 'info'],
  ] as const)('shows the %s icon for the %s tone', (tone, expectedIcon) => {
    fixture.componentRef.setInput('tone', tone);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(`orbit-icon`)).toBeTruthy();
    expect(fixture.componentInstance['icon']()).toBe(expectedIcon);
  });

  it('uses role="alert" for the danger tone and role="status" otherwise', () => {
    fixture.componentRef.setInput('tone', 'danger');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('alert');

    fixture.componentRef.setInput('tone', 'success');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('status');
  });

  it('shows the dismiss button only when dismissible is true', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-alert__close')).toBeNull();

    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-alert__close')).toBeTruthy();
  });

  it('emits dismissed when the close button is clicked, without hiding itself', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.dismissed.subscribe(() => (emitted = true));
    (fixture.nativeElement.querySelector('.orbit-alert__close button') as HTMLButtonElement).click();

    expect(emitted).toBe(true);
    expect(fixture.nativeElement.querySelector('.orbit-alert')).toBeTruthy();
  });
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`

Expected: FAIL — `Cannot find module './alert.component'`.

- [x] **Step 3: Write the component**

Create `projects/orbit/src/lib/components/alert/alert.component.ts`:

```typescript
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import { OrbitIconButtonComponent } from '../icon-button/icon-button.component';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';
import type { OrbitIconName } from '../../icons/icon-registry';

export type OrbitAlertTone = 'success' | 'danger' | 'warning' | 'info';

const TONE_ICON: Record<OrbitAlertTone, OrbitIconName> = {
  success: 'check',
  danger: 'alert-circle',
  warning: 'alert-triangle',
  info: 'info',
};

@Component({
  selector: 'orbit-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent, OrbitIconButtonComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  host: {
    class: 'orbit-alert',
    '[class.orbit-alert--success]': "tone() === 'success'",
    '[class.orbit-alert--danger]': "tone() === 'danger'",
    '[class.orbit-alert--warning]': "tone() === 'warning'",
    '[class.orbit-alert--info]': "tone() === 'info'",
    '[attr.role]': "tone() === 'danger' ? 'alert' : 'status'",
  },
})
export class OrbitAlertComponent {
  private readonly i18n = inject(ORBIT_I18N);

  tone = input<OrbitAlertTone>('info');
  dismissible = input(false, { transform: booleanAttribute });
  dismissed = output<void>();

  protected readonly icon = computed<OrbitIconName>(() => TONE_ICON[this.tone()]);
  protected readonly closeLabel = computed(() => this.i18n.labels.close);

  onDismiss(): void {
    this.dismissed.emit();
  }
}
```

- [x] **Step 4: Write the template**

Create `projects/orbit/src/lib/components/alert/alert.component.html`:

```html
<orbit-icon [name]="icon()" class="orbit-alert__icon" />
<div class="orbit-alert__content">
  <ng-content />
</div>
@if (dismissible()) {
  <orbit-icon-button
    class="orbit-alert__close"
    icon="close"
    [ariaLabel]="closeLabel()"
    (clicked)="onDismiss()"
  />
}
```

- [x] **Step 5: Write the CSS**

Create `projects/orbit/src/lib/components/alert/alert.component.css`:

```css
:host.orbit-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--orbit-space-3);
  padding: var(--orbit-space-3);
  border-radius: var(--orbit-radius-surface);
  border: 1px solid var(--orbit-border-subtle);
}

:host.orbit-alert--success {
  background: var(--orbit-status-success-subtle);
  border-color: var(--orbit-status-success);
}
:host.orbit-alert--success .orbit-alert__icon {
  color: var(--orbit-status-success);
}

:host.orbit-alert--danger {
  background: var(--orbit-status-danger-subtle);
  border-color: var(--orbit-status-danger);
}
:host.orbit-alert--danger .orbit-alert__icon {
  color: var(--orbit-status-danger);
}

:host.orbit-alert--warning {
  background: var(--orbit-status-warning-subtle);
  border-color: var(--orbit-status-warning);
}
:host.orbit-alert--warning .orbit-alert__icon {
  color: var(--orbit-status-warning);
}

:host.orbit-alert--info {
  background: var(--orbit-status-info-subtle);
  border-color: var(--orbit-status-info);
}
:host.orbit-alert--info .orbit-alert__icon {
  color: var(--orbit-status-info);
}

.orbit-alert__icon {
  flex: none;
  margin-top: var(--orbit-space-1);
}

.orbit-alert__content {
  flex: 1 1 auto;
  font-family: var(--orbit-font-sans);
  font-size: var(--orbit-font-size-body);
}

.orbit-alert__close {
  flex: none;
}
```

- [x] **Step 6: Write the barrel**

Create `projects/orbit/src/lib/components/alert/index.ts`:

```typescript
export { OrbitAlertComponent } from './alert.component';
export type { OrbitAlertTone } from './alert.component';
```

- [x] **Step 7: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`

Expected: PASS for all `alert.component.spec.ts` tests.

- [x] **Step 8: Commit**

(Skipped — no git commands in this plan.)

---

### Task 5: `OrbitBannerComponent`

**Files:**
- Create: `projects/orbit/src/lib/components/banner/banner.component.ts`
- Create: `projects/orbit/src/lib/components/banner/banner.component.html`
- Create: `projects/orbit/src/lib/components/banner/banner.component.css`
- Create: `projects/orbit/src/lib/components/banner/banner.component.spec.ts`
- Create: `projects/orbit/src/lib/components/banner/index.ts`

**Interfaces:**
- Consumes: same as Task 4 (`OrbitIconComponent`, `OrbitIconButtonComponent`, `ORBIT_I18N`).
- Produces: `export type OrbitBannerTone = 'success' | 'danger' | 'warning' | 'info';` and `OrbitBannerComponent` with the identical `tone`/`dismissible`/`dismissed` API as `OrbitAlertComponent` (a distinct class, not a subclass or a variant flag — per spec, layout differs structurally). Consumed by Task 7 (banner catalog page) and `public-api.ts` (Task 6).

- [x] **Step 1: Write the failing component spec**

Create `projects/orbit/src/lib/components/banner/banner.component.spec.ts`:

```typescript
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { OrbitBannerComponent } from './banner.component';

@Component({
  selector: 'test-banner-host',
  standalone: true,
  imports: [OrbitBannerComponent],
  template: `<orbit-banner>Manutenzione programmata alle 22:00</orbit-banner>`,
})
class TestBannerHostComponent {}

describe('OrbitBannerComponent', () => {
  let fixture: ComponentFixture<OrbitBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitBannerComponent, TestBannerHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitBannerComponent);
  });

  it('creates with the default info tone', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-banner--info')).toBe(true);
  });

  it('renders projected content', () => {
    const hostFixture = TestBed.createComponent(TestBannerHostComponent);
    hostFixture.detectChanges();
    expect(hostFixture.nativeElement.textContent).toContain('Manutenzione programmata alle 22:00');
  });

  it.each([
    ['success', 'check'],
    ['danger', 'alert-circle'],
    ['warning', 'alert-triangle'],
    ['info', 'info'],
  ] as const)('shows the %s icon for the %s tone', (tone, expectedIcon) => {
    fixture.componentRef.setInput('tone', tone);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('orbit-icon')).toBeTruthy();
    expect(fixture.componentInstance['icon']()).toBe(expectedIcon);
  });

  it('uses role="alert" for the danger tone and role="status" otherwise', () => {
    fixture.componentRef.setInput('tone', 'danger');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('alert');

    fixture.componentRef.setInput('tone', 'warning');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('status');
  });

  it('shows the dismiss button only when dismissible is true', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-banner__close')).toBeNull();

    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-banner__close')).toBeTruthy();
  });

  it('emits dismissed when the close button is clicked, without hiding itself', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.dismissed.subscribe(() => (emitted = true));
    (fixture.nativeElement.querySelector('.orbit-banner__close button') as HTMLButtonElement).click();

    expect(emitted).toBe(true);
    expect(fixture.nativeElement.querySelector('.orbit-banner')).toBeTruthy();
  });
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`

Expected: FAIL — `Cannot find module './banner.component'`.

- [x] **Step 3: Write the component**

Create `projects/orbit/src/lib/components/banner/banner.component.ts`:

```typescript
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import { OrbitIconButtonComponent } from '../icon-button/icon-button.component';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';
import type { OrbitIconName } from '../../icons/icon-registry';

export type OrbitBannerTone = 'success' | 'danger' | 'warning' | 'info';

const TONE_ICON: Record<OrbitBannerTone, OrbitIconName> = {
  success: 'check',
  danger: 'alert-circle',
  warning: 'alert-triangle',
  info: 'info',
};

@Component({
  selector: 'orbit-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent, OrbitIconButtonComponent],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
  host: {
    class: 'orbit-banner',
    '[class.orbit-banner--success]': "tone() === 'success'",
    '[class.orbit-banner--danger]': "tone() === 'danger'",
    '[class.orbit-banner--warning]': "tone() === 'warning'",
    '[class.orbit-banner--info]': "tone() === 'info'",
    '[attr.role]': "tone() === 'danger' ? 'alert' : 'status'",
  },
})
export class OrbitBannerComponent {
  private readonly i18n = inject(ORBIT_I18N);

  tone = input<OrbitBannerTone>('info');
  dismissible = input(false, { transform: booleanAttribute });
  dismissed = output<void>();

  protected readonly icon = computed<OrbitIconName>(() => TONE_ICON[this.tone()]);
  protected readonly closeLabel = computed(() => this.i18n.labels.close);

  onDismiss(): void {
    this.dismissed.emit();
  }
}
```

- [x] **Step 4: Write the template**

Create `projects/orbit/src/lib/components/banner/banner.component.html`:

```html
<orbit-icon [name]="icon()" class="orbit-banner__icon" />
<div class="orbit-banner__content">
  <ng-content />
</div>
@if (dismissible()) {
  <orbit-icon-button
    class="orbit-banner__close"
    icon="close"
    [ariaLabel]="closeLabel()"
    (clicked)="onDismiss()"
  />
}
```

- [x] **Step 5: Write the CSS** (full-width, more prominent padding/typography than Alert, per spec)

Create `projects/orbit/src/lib/components/banner/banner.component.css`:

```css
:host.orbit-banner {
  display: flex;
  align-items: center;
  gap: var(--orbit-space-4);
  width: 100%;
  padding: var(--orbit-space-4) var(--orbit-space-6);
  border-radius: 0;
  border-bottom: 1px solid var(--orbit-border-subtle);
  box-sizing: border-box;
}

:host.orbit-banner--success {
  background: var(--orbit-status-success-subtle);
  border-color: var(--orbit-status-success);
}
:host.orbit-banner--success .orbit-banner__icon {
  color: var(--orbit-status-success);
}

:host.orbit-banner--danger {
  background: var(--orbit-status-danger-subtle);
  border-color: var(--orbit-status-danger);
}
:host.orbit-banner--danger .orbit-banner__icon {
  color: var(--orbit-status-danger);
}

:host.orbit-banner--warning {
  background: var(--orbit-status-warning-subtle);
  border-color: var(--orbit-status-warning);
}
:host.orbit-banner--warning .orbit-banner__icon {
  color: var(--orbit-status-warning);
}

:host.orbit-banner--info {
  background: var(--orbit-status-info-subtle);
  border-color: var(--orbit-status-info);
}
:host.orbit-banner--info .orbit-banner__icon {
  color: var(--orbit-status-info);
}

.orbit-banner__icon {
  flex: none;
  font-size: var(--orbit-font-size-lg);
}

.orbit-banner__content {
  flex: 1 1 auto;
  font-family: var(--orbit-font-sans);
  font-size: var(--orbit-font-size-lg);
  font-weight: var(--orbit-font-weight-emphasis);
}

.orbit-banner__close {
  flex: none;
}
```

- [x] **Step 6: Write the barrel**

Create `projects/orbit/src/lib/components/banner/index.ts`:

```typescript
export { OrbitBannerComponent } from './banner.component';
export type { OrbitBannerTone } from './banner.component';
```

- [x] **Step 7: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`

Expected: PASS for all `banner.component.spec.ts` tests, and every other `orbit` test still green.

- [x] **Step 8: Commit**

(Skipped — no git commands in this plan.)

---

### Task 6: Wire the barrel exports into `public-api.ts`

**Files:**
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Consumes: `projects/orbit/src/lib/components/toast` (Task 3), `projects/orbit/src/lib/components/alert` (Task 4), `projects/orbit/src/lib/components/banner` (Task 5), `projects/orbit/src/lib/services/toast` (Task 2).
- Produces: `OrbitToastComponent`, `OrbitAlertComponent`, `OrbitBannerComponent`, `OrbitToastService`, `OrbitToastRef`, `ORBIT_TOAST_DATA`, `ORBIT_TOAST_REF`, `OrbitToastConfig`, `OrbitToastTone`, `OrbitToastPosition`, `OrbitAlertTone`, `OrbitBannerTone` — all importable from `@galileo/orbit`, consumed by Task 7's catalog pages.

- [x] **Step 1: Add the exports**

Edit `projects/orbit/src/public-api.ts`. Add these lines after `export * from './lib/components/badge';` (keeping the file's existing component-then-service-then-i18n grouping):

```typescript
export * from './lib/components/alert';
export * from './lib/components/banner';
```

Add this line after `export * from './lib/components/table-row';` and before `export * from './lib/types';`:

```typescript
export * from './lib/components/toast';
```

Add this line after `export * from './lib/services/panel';`:

```typescript
export * from './lib/services/toast';
```

The resulting relevant excerpt of `projects/orbit/src/public-api.ts`:

```typescript
export * from './lib/components/button';
export * from './lib/components/icon-button';
export * from './lib/components/layout';
export * from './lib/components/divider';
export * from './lib/components/selectable-tile';
export * from './lib/components/badge';
export * from './lib/components/alert';
export * from './lib/components/banner';
export * from './lib/components/checkbox';
// ... (unchanged middle section) ...
export * from './lib/components/table-row';
export * from './lib/components/toast';
export * from './lib/types';
// Keep the barrel target explicit: the library compiler resolves public exports
// with ESM semantics and does not consistently infer a directory `index.ts`.
export * from './lib/icons/index';
export * from './lib/services/dialog';
export * from './lib/services/panel';
export * from './lib/services/toast';
export * from './lib/i18n';
export * from './lib/services/clipboard';
```

- [x] **Step 2: Verify the library still builds and tests pass**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`

Expected: PASS — no new tests here, this step only confirms the barrel edits didn't introduce a circular import or naming collision (e.g. `OrbitAlertTone` vs any pre-existing export). If a naming collision is reported, check whether `OrbitToastTone`, `OrbitAlertTone`, or `OrbitBannerTone` collide with each other — they don't, since each is scoped to its own component file and none previously existed — or with `OrbitBadgeTone` (different name, no collision).

- [x] **Step 3: Commit**

(Skipped — no git commands in this plan.)

---

### Task 7: Orbit-lab catalog — Toast page, entry, and route

**Files:**
- Create: `projects/orbit-lab/src/app/pages/toast-page/toast-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/toast-page/toast-page.component.html`
- Create: `projects/orbit-lab/src/app/pages/toast-page/toast-page.component.css`
- Create: `projects/orbit-lab/src/app/pages/toast-page/toast-page.component.spec.ts`
- Modify: `projects/orbit-lab/src/app/app.routes.ts`
- Modify: `projects/orbit-lab/src/app/catalog/catalog.ts`

**Interfaces:**
- Consumes: `OrbitButtonComponent` (existing), `OrbitToastService`, `OrbitToastTone`, `OrbitToastPosition` (Task 2, via `@galileo/orbit`), `LabExampleComponent` (existing, `../../catalog/example-panel.component`).
- Produces: `ToastPageComponent`, registered under route path `toast` and catalog slug `toast`.

- [x] **Step 1: Write the failing page spec**

Create `projects/orbit-lab/src/app/pages/toast-page/toast-page.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ToastPageComponent } from './toast-page.component';

describe('ToastPageComponent', () => {
  let fixture: ComponentFixture<ToastPageComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ToastPageComponent);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows a success toast when the success example button is clicked', () => {
    (fixture.nativeElement.querySelector('[data-example="success"] button') as HTMLButtonElement).click();

    expect(overlayContainer.getContainerElement().textContent).toContain('Modifiche salvate con successo');
  });

  it('shows a danger toast when the danger example button is clicked', () => {
    (fixture.nativeElement.querySelector('[data-example="danger"] button') as HTMLButtonElement).click();

    expect(overlayContainer.getContainerElement().textContent).toContain('Impossibile completare l\'operazione');
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      'OrbitToastService',
    );
  });
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`

Expected: FAIL — `Cannot find module './toast-page.component'`.

- [x] **Step 3: Write the page component**

Create `projects/orbit-lab/src/app/pages/toast-page/toast-page.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrbitButtonComponent, OrbitToastService } from '@galileo/orbit';
import type { OrbitToastTone } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-toast-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent, LabExampleComponent],
  templateUrl: './toast-page.component.html',
  styleUrl: './toast-page.component.css',
})
export class ToastPageComponent {
  private readonly toast = inject(OrbitToastService);

  protected readonly toneMessages: Record<OrbitToastTone, string> = {
    success: 'Modifiche salvate con successo',
    danger: "Impossibile completare l'operazione",
    warning: 'Controlla i campi obbligatori',
    info: 'Sincronizzazione in corso',
  };

  protected readonly usageSnippet = `import { OrbitToastService } from '@galileo/orbit';

private readonly toast = inject(OrbitToastService);

this.toast.show({
  message: 'Modifiche salvate con successo',
  tone: 'success',
  position: 'bottom-end',
});`;

  protected readonly dismissibleSnippet = `this.toast.show({
  message: 'Nessun auto-dismiss: chiudi manualmente',
  duration: 0,
  dismissible: true,
});`;

  showTone(tone: OrbitToastTone): void {
    this.toast.show({ message: this.toneMessages[tone], tone, position: 'bottom-end' });
  }

  showManual(): void {
    this.toast.show({
      message: 'Nessun auto-dismiss: chiudi manualmente',
      duration: 0,
      dismissible: true,
    });
  }

  dismissAll(): void {
    this.toast.dismissAll();
  }
}
```

- [x] **Step 4: Write the template**

Create `projects/orbit-lab/src/app/pages/toast-page/toast-page.component.html`:

```html
<article>
  <h1>Toast</h1>
  <p>Notifica transitoria fuori dal flusso, montata in un overlay CDK e impilata per angolo dello schermo.</p>

  <section>
    <h2>Esempio</h2>
    <lab-example [code]="usageSnippet">
      <div data-example="success">
        <orbit-button label="Mostra toast di successo" variant="filled" tone="success" (clicked)="showTone('success')" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Tone</h2>
    <div data-example="danger">
      <orbit-button label="Danger" variant="outline" tone="danger" (clicked)="showTone('danger')" />
    </div>
    <div data-example="warning">
      <orbit-button label="Warning" variant="outline" tone="neutral" (clicked)="showTone('warning')" />
    </div>
    <div data-example="info">
      <orbit-button label="Info" variant="outline" tone="neutral" (clicked)="showTone('info')" />
    </div>
  </section>

  <section>
    <h2>Manuale (nessun auto-dismiss)</h2>
    <lab-example [code]="dismissibleSnippet">
      <div data-example="manual">
        <orbit-button label="Mostra toast manuale" variant="outline" tone="neutral" (clicked)="showManual()" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Chiudi tutti</h2>
    <orbit-button label="Dismiss all" variant="outline" tone="neutral" (clicked)="dismissAll()" />
  </section>

  <section>
    <h2>Accessibilità</h2>
    <ul>
      <li>Tone <code>danger</code> usa <code>role="alert"</code>; gli altri tone usano <code>role="status"</code>.</li>
      <li>Il timer di auto-dismiss si mette in pausa su hover/focus e riparte su mouseleave/blur.</li>
    </ul>
  </section>
</article>
```

- [x] **Step 5: Write the CSS**

Create `projects/orbit-lab/src/app/pages/toast-page/toast-page.component.css`:

```css
section > div[data-example] {
  margin-block-end: var(--orbit-space-3);
}
```

- [x] **Step 6: Register the route**

Edit `projects/orbit-lab/src/app/app.routes.ts`. Add this route entry after the `panel` route block (right before the `navbar` route):

```typescript
  {
    path: 'toast',
    loadComponent: () =>
      import('./pages/toast-page/toast-page.component').then((m) => m.ToastPageComponent),
  },
```

- [x] **Step 7: Add the catalog entry**

Edit `projects/orbit-lab/src/app/catalog/catalog.ts`. Insert alphabetically by Italian `label` (`'Toast'` sorts after `'Tipografia'`... actually check ordering: entries are sorted by label text — `'Tab'`, `'Table'`, `'Temi e superfici'`, `'Tipografia'` — `'Toast'` sorts after `'Tipografia'` and before nothing since it's currently last alphabetically among T-entries; insert it as the last entry in the array, after `typography`):

```typescript
  { slug: 'toast', label: 'Toast', status: 'verified', icon: 'message-circle' },
```

placed as the final line before the closing `];`, i.e. after the `typography` entry:

```typescript
  { slug: 'typography', label: 'Tipografia', status: 'verified', icon: 'document' },
  { slug: 'toast', label: 'Toast', status: 'verified', icon: 'message-circle' },
];
```

(Note: strict alphabetical order would place `Toast` before `Typography` since "Toast" < "Tipografia" is false — "Tipografia" < "Toast" alphabetically since 'i' < 'o' — so `Toast` after `Tipografia` is correct, but it must come before `Themes`/`Temi` label check: `'Temi e superfici'` < `'Tipografia'` < `'Toast'`, all correct in ascending order as placed.)

- [x] **Step 8: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`

Expected: PASS for all `toast-page.component.spec.ts` tests.

- [x] **Step 9: Commit**

(Skipped — no git commands in this plan.)

---

### Task 8: Orbit-lab catalog — Alert page, entry, and route

**Files:**
- Create: `projects/orbit-lab/src/app/pages/alert-page/alert-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/alert-page/alert-page.component.html`
- Create: `projects/orbit-lab/src/app/pages/alert-page/alert-page.component.spec.ts`
- Modify: `projects/orbit-lab/src/app/app.routes.ts`
- Modify: `projects/orbit-lab/src/app/catalog/catalog.ts`

**Interfaces:**
- Consumes: `OrbitAlertComponent`, `OrbitButtonComponent` (both via `@galileo/orbit`), `LabExampleComponent` (existing).
- Produces: `AlertPageComponent`, registered under route path `alert` and catalog slug `alert`.

- [x] **Step 1: Write the failing page spec**

Create `projects/orbit-lab/src/app/pages/alert-page/alert-page.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AlertPageComponent } from './alert-page.component';

describe('AlertPageComponent', () => {
  let fixture: ComponentFixture<AlertPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AlertPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders an alert for each tone', () => {
    const tones = ['success', 'danger', 'warning', 'info'];
    for (const tone of tones) {
      expect(
        fixture.nativeElement.querySelector(`[data-example="${tone}"] orbit-alert`),
      ).toBeTruthy();
    }
  });

  it('hides the dismissible example alert and shows it again on reset', () => {
    const dismissButton = fixture.nativeElement.querySelector(
      '[data-example="dismissible"] .orbit-alert__close button',
    ) as HTMLButtonElement;
    dismissButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-example="dismissible"] orbit-alert')).toBeNull();

    (fixture.nativeElement.querySelector('[data-example="dismissible-reset"] button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-example="dismissible"] orbit-alert')).toBeTruthy();
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-alert',
    );
  });
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`

Expected: FAIL — `Cannot find module './alert-page.component'`.

- [x] **Step 3: Write the page component**

Create `projects/orbit-lab/src/app/pages/alert-page/alert-page.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { OrbitAlertComponent, OrbitButtonComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-alert-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitAlertComponent, OrbitButtonComponent, LabExampleComponent],
  templateUrl: './alert-page.component.html',
})
export class AlertPageComponent {
  protected readonly dismissibleVisible = signal(true);

  protected readonly usageSnippet = `<orbit-alert tone="success">Modifiche salvate con successo.</orbit-alert>`;

  protected readonly dismissibleSnippet = `<orbit-alert tone="warning" dismissible (dismissed)="visible = false">
  Alcuni campi richiedono attenzione.
</orbit-alert>`;

  resetDismissible(): void {
    this.dismissibleVisible.set(true);
  }

  hideDismissible(): void {
    this.dismissibleVisible.set(false);
  }
}
```

- [x] **Step 4: Write the template**

Create `projects/orbit-lab/src/app/pages/alert-page/alert-page.component.html`:

```html
<article>
  <h1>Alert</h1>
  <p>Messaggio inline dentro form e card, nel flusso del DOM del chiamante: nessun overlay, nessun servizio.</p>

  <section>
    <h2>Esempio</h2>
    <lab-example [code]="usageSnippet">
      <div data-example="success">
        <orbit-alert tone="success">Modifiche salvate con successo.</orbit-alert>
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Tone</h2>
    <div data-example="danger">
      <orbit-alert tone="danger">Impossibile completare l'operazione.</orbit-alert>
    </div>
    <div data-example="warning">
      <orbit-alert tone="warning">Controlla i campi obbligatori.</orbit-alert>
    </div>
    <div data-example="info">
      <orbit-alert tone="info">Sincronizzazione in corso.</orbit-alert>
    </div>
  </section>

  <section>
    <h2>Dismissible</h2>
    <lab-example [code]="dismissibleSnippet">
      <div data-example="dismissible">
        @if (dismissibleVisible()) {
          <orbit-alert tone="warning" dismissible (dismissed)="hideDismissible()">
            Alcuni campi richiedono attenzione.
          </orbit-alert>
        }
      </div>
      <div data-example="dismissible-reset">
        <orbit-button label="Mostra di nuovo" variant="outline" tone="neutral" (clicked)="resetDismissible()" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Accessibilità</h2>
    <ul>
      <li>Tone <code>danger</code> usa <code>role="alert"</code>; gli altri tone usano <code>role="status"</code>.</li>
      <li>L'alert non si nasconde da solo: l'output <code>dismissed</code> notifica il parent, che rimuove il componente dal template (pattern "controlled component").</li>
    </ul>
  </section>
</article>
```

- [x] **Step 5: Register the route**

Edit `projects/orbit-lab/src/app/app.routes.ts`. Add this route entry after the `badge` route block (right before the `form-grid` redirect):

```typescript
  {
    path: 'alert',
    loadComponent: () =>
      import('./pages/alert-page/alert-page.component').then((m) => m.AlertPageComponent),
  },
```

- [x] **Step 6: Add the catalog entry**

Edit `projects/orbit-lab/src/app/catalog/catalog.ts`. Insert alphabetically — `'Alert'` sorts before `'Allegati'` (`'Alert'` < `'Allegati'` since 'e' < 'l' at index 2)? Compare character by character: "Aler" vs "Alle" — index 1 'l' vs 'l' equal, index 2 'e' vs 'l' — 'e' < 'l', so `'Alert'` sorts before `'Allegati'`. Insert as the new first entry:

```typescript
export const CATALOG_ENTRIES: CatalogEntry[] = [
  { slug: 'alert', label: 'Alert', status: 'verified', icon: 'alert-triangle' },
  { slug: 'attachments', label: 'Allegati', status: 'verified', icon: 'paperclip' },
  ...
```

- [x] **Step 7: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`

Expected: PASS for all `alert-page.component.spec.ts` tests.

- [x] **Step 8: Commit**

(Skipped — no git commands in this plan.)

---

### Task 9: Orbit-lab catalog — Banner page, entry, and route

**Files:**
- Create: `projects/orbit-lab/src/app/pages/banner-page/banner-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/banner-page/banner-page.component.html`
- Create: `projects/orbit-lab/src/app/pages/banner-page/banner-page.component.spec.ts`
- Modify: `projects/orbit-lab/src/app/app.routes.ts`
- Modify: `projects/orbit-lab/src/app/catalog/catalog.ts`

**Interfaces:**
- Consumes: `OrbitBannerComponent`, `OrbitButtonComponent` (both via `@galileo/orbit`), `LabExampleComponent` (existing).
- Produces: `BannerPageComponent`, registered under route path `banner` and catalog slug `banner`.

- [x] **Step 1: Write the failing page spec**

Create `projects/orbit-lab/src/app/pages/banner-page/banner-page.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { BannerPageComponent } from './banner-page.component';

describe('BannerPageComponent', () => {
  let fixture: ComponentFixture<BannerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BannerPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a banner for each tone', () => {
    const tones = ['success', 'danger', 'warning', 'info'];
    for (const tone of tones) {
      expect(
        fixture.nativeElement.querySelector(`[data-example="${tone}"] orbit-banner`),
      ).toBeTruthy();
    }
  });

  it('hides the dismissible example banner and shows it again on reset', () => {
    const dismissButton = fixture.nativeElement.querySelector(
      '[data-example="dismissible"] .orbit-banner__close button',
    ) as HTMLButtonElement;
    dismissButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-example="dismissible"] orbit-banner')).toBeNull();

    (fixture.nativeElement.querySelector('[data-example="dismissible-reset"] button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-example="dismissible"] orbit-banner')).toBeTruthy();
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-banner',
    );
  });
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`

Expected: FAIL — `Cannot find module './banner-page.component'`.

- [x] **Step 3: Write the page component**

Create `projects/orbit-lab/src/app/pages/banner-page/banner-page.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { OrbitBannerComponent, OrbitButtonComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-banner-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitBannerComponent, OrbitButtonComponent, LabExampleComponent],
  templateUrl: './banner-page.component.html',
})
export class BannerPageComponent {
  protected readonly dismissibleVisible = signal(true);

  protected readonly usageSnippet = `<orbit-banner tone="info">Manutenzione programmata alle 22:00.</orbit-banner>`;

  protected readonly dismissibleSnippet = `<orbit-banner tone="danger" dismissible (dismissed)="visible = false">
  Servizio temporaneamente non disponibile.
</orbit-banner>`;

  resetDismissible(): void {
    this.dismissibleVisible.set(true);
  }

  hideDismissible(): void {
    this.dismissibleVisible.set(false);
  }
}
```

- [x] **Step 4: Write the template**

Create `projects/orbit-lab/src/app/pages/banner-page/banner-page.component.html`:

```html
<article>
  <h1>Banner</h1>
  <p>Messaggio full-width pensato per la cima di una pagina o sezione principale, non annidato in una card.</p>

  <section>
    <h2>Esempio</h2>
    <lab-example [code]="usageSnippet" fullWidth>
      <div data-example="info">
        <orbit-banner tone="info">Manutenzione programmata alle 22:00.</orbit-banner>
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Tone</h2>
    <div data-example="success">
      <orbit-banner tone="success">Operazione completata su tutti gli ambienti.</orbit-banner>
    </div>
    <div data-example="danger">
      <orbit-banner tone="danger">Servizio temporaneamente non disponibile.</orbit-banner>
    </div>
    <div data-example="warning">
      <orbit-banner tone="warning">La sessione scadrà tra 5 minuti.</orbit-banner>
    </div>
  </section>

  <section>
    <h2>Dismissible</h2>
    <lab-example [code]="dismissibleSnippet" fullWidth>
      <div data-example="dismissible">
        @if (dismissibleVisible()) {
          <orbit-banner tone="danger" dismissible (dismissed)="hideDismissible()">
            Servizio temporaneamente non disponibile.
          </orbit-banner>
        }
      </div>
      <div data-example="dismissible-reset">
        <orbit-button label="Mostra di nuovo" variant="outline" tone="neutral" (clicked)="resetDismissible()" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Accessibilità</h2>
    <ul>
      <li>Tone <code>danger</code> usa <code>role="alert"</code>; gli altri tone usano <code>role="status"</code>.</li>
      <li>Come l'alert, il banner non si nasconde da solo: l'output <code>dismissed</code> notifica il parent.</li>
    </ul>
  </section>
</article>
```

- [x] **Step 5: Register the route**

Edit `projects/orbit-lab/src/app/app.routes.ts`. Add this route entry after the `dialog` route block (right before the `popover` route):

```typescript
  {
    path: 'banner',
    loadComponent: () =>
      import('./pages/banner-page/banner-page.component').then((m) => m.BannerPageComponent),
  },
```

- [x] **Step 6: Add the catalog entry**

Edit `projects/orbit-lab/src/app/catalog/catalog.ts`. Insert alphabetically — `'Banner'` sorts after `'Barra di navigazione'`? Compare "Banner" vs "Barra": index 1 'a' == 'a', index 2 'n' vs 'r' — 'n' < 'r', so `'Banner'` sorts before `'Barra di navigazione'`. Insert right after `badge`'s current position, before `navbar`:

```typescript
  { slug: 'attachments', label: 'Allegati', status: 'verified', icon: 'paperclip' },
  { slug: 'motion', label: 'Animazioni', status: 'verified', icon: 'retry' },
  { slug: 'banner', label: 'Banner', status: 'verified', icon: 'window' },
  { slug: 'navbar', label: 'Barra di navigazione', status: 'verified', icon: 'menu' },
```

(Placed after `motion`/`'Animazioni'` and before `navbar`/`'Barra di navigazione'`, preserving ascending alphabetical order: "Allegati" < "Animazioni" < "Banner" < "Barra di navigazione".)

- [x] **Step 7: Run the tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`

Expected: PASS for all `banner-page.component.spec.ts` tests, and the full `orbit-lab` suite (minus the excluded in-progress directory) green.

- [x] **Step 8: Commit**

(Skipped — no git commands in this plan.)

---

### Task 10: Final full-suite verification

**Files:** none (verification only).

**Interfaces:** none — this task only runs the full test suites built by Tasks 1–9.

- [x] **Step 1: Run the full `orbit` library suite**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`

Expected: PASS — every spec file touched or created in Tasks 1–6 is green, plus all pre-existing `orbit` specs remain green (no regressions from the `public-api.ts` barrel edit or the global `tokens.css` toast-container CSS addition).

- [x] **Step 2: Run the full `orbit-lab` suite, excluding the in-progress examples-page directory**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`

Expected: PASS — every spec file created in Tasks 7–9 is green, plus all pre-existing `orbit-lab` specs remain green (no regressions from the `app.routes.ts` and `catalog.ts` edits).

- [x] **Step 3: Manually sanity-check catalog ordering**

Read `projects/orbit-lab/src/app/catalog/catalog.ts` and confirm the full array is still in ascending order by `label` (Italian collation, plain string comparison is sufficient since all labels are ASCII-only aside from accribute-free Italian text already in the file). The three new entries (`Alert`, `Banner`, `Toast`) must each sit between the two labels that alphabetically bracket them, per Tasks 7/8/9 Step 6/7.

- [x] **Step 4: Commit**

(Skipped — no git commands in this plan. Leave all changes in the working tree for the user to review and commit themselves.)

---

## Self-Review

**1. Spec coverage:**
- Toast service API (`show`, `dismissAll`, `OrbitToastRef.dismiss`/`afterDismissed$`) → Task 2.
- Toast per-corner stacking, lazy container creation/teardown, auto-dismiss + hover/focus pause/resume, `role` per tone → Task 2 (service/timer logic) + Task 3 (component markup/CSS for stacking direction).
- Toast fail-soft negative duration, idempotent `dismiss()` → Task 2, explicitly tested.
- `OrbitAlertComponent` API (`tone`, `dismissible`, `dismissed`, `ng-content`, icon-per-tone, `role`) → Task 4.
- `OrbitBannerComponent` as a distinct component with the same API but full-width/prominent layout → Task 5.
- 3 new icons (`alert-circle`, `alert-triangle`, `info`), 24x24/stroke-only contract → Task 1.
- `OrbitToastService.show()` negative-duration fail-soft and double-`dismiss()` no-op → Task 2 tests.
- Testing section: `toast.service.spec.ts` stacking/auto-dismiss/pause/`dismissAll`/container-teardown → Task 2 Step 4. `toast.component.spec.ts` role/dismiss-button → Task 3 Step 6. `alert.component.spec.ts`/`banner.component.spec.ts` icon/dismissed/role → Tasks 4 & 5. Manual orbit-lab catalog pages for all three, all tones, dismissible → Tasks 7–9.
- Catalog entries (`toast`/`message-circle`, `alert`/`alert-triangle`, `banner`/`window`) → Tasks 7 Step 7, 8 Step 6, 9 Step 6, matching the spec's exact icon choices.

**2. Placeholder scan:** No "TBD"/"add appropriate tests"/"similar to Task N" language remains. One drafting artifact was caught and explicitly corrected inline in Task 2 Step 2 (the `require()` placeholder) with the exact replacement code shown — this is not a placeholder left for the implementer to invent, it's a fully-specified fix with the corrected file content given verbatim.

**3. Type consistency:** `OrbitToastConfig`/`OrbitToastRef`/`ORBIT_TOAST_DATA`/`ORBIT_TOAST_REF` names match exactly between Task 2 (definition), Task 3 (`OrbitToastComponent` injection), Task 6 (barrel export), and Task 7 (catalog page usage). `OrbitAlertTone`/`OrbitBannerTone` and their `TONE_ICON` maps are consistent between Tasks 4/5 and their specs. `dismissed = output<void>()` and `dismissible = input(false, { transform: booleanAttribute })` are identical across Alert and Banner, matching the spec's requirement that they share the same API. Catalog `slug`/route `path` values match one-to-one across Tasks 7/8/9 (`toast`/`toast`, `alert`/`alert`, `banner`/`banner`).

**Gap found and resolved during planning:** the spec's service pattern (mirroring `OrbitPanelService`, which takes an arbitrary `ComponentType<T>`) doesn't by itself explain how `OrbitToastService.show()` gets a component to render, since `OrbitToastConfig` carries only data, not a component reference — unlike panel's `open<T>(component, config)`. Resolved by fixing the portal component to the concrete `OrbitToastComponent` inside the service (Task 2/3), which matches the spec's intent that toast visuals are a single reusable design, and threading `message`/`tone`/`dismissible` through `ORBIT_TOAST_DATA` plus the ref through `ORBIT_TOAST_REF`, both consumed by `OrbitToastComponent` — this keeps `OrbitToastService`'s public surface exactly as specified (`show(config): OrbitToastRef`) with no extra parameter the spec didn't ask for.
