# Orbit — Panel, Tab, Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** add three missing Orbit component families — Panel (offcanvas overlay + persistent sidebar), Tab (tablist/tab/tab-panel), and Table (sortable/filterable columns, disabled row state) — plus a catalog demo page per family in `orbit-lab`.

**Architecture:** each family reuses an existing Orbit convention rather than inventing one: Panel's offcanvas variant mirrors `OrbitDialogService` (CDK Overlay, `cdkTrapFocus`) with a side-anchored `GlobalPositionStrategy`; Tab uses fully consumer-controlled inputs/outputs (no cross-component DI), matching `orbit-pill-switch`'s and `orbit-selectable-tile`'s existing style; Table stays presentational (no CDK `Table`/data-source), matching `form-grid`'s thin-wrapper approach.

**Tech Stack:** Angular 22 standalone components, OnPush, Signals (`input`, `input.required`, `output`, `computed`, `contentChildren`), Angular CDK `Overlay`/`a11y`, Vitest via `@angular/build:unit-test`.

## Global Constraints

- Never edit `dist/**` (generated output).
- Node/Angular CLI only available after `source ~/.nvm/nvm.sh && nvm use 24.16.0`.
- No commits/tags/pushes beyond what this plan's own steps authorize.
- Component CSS must consume semantic (`--orbit-*`) tokens only — never hardcode a color, spacing, radius, or shadow. Every dimensional value (`width`, `height`, `padding`, `gap`, `font-size`) must be `rem` or an `--orbit-*` token, never a bare `px` literal, except the three established exceptions: hairline borders (1–2px), the `sr-only` visually-hidden pattern, and focus-ring `box-shadow` spread.
- Re-read any file listed below immediately before editing it — this repo has concurrent parallel edits in flight; line numbers here are a snapshot, not a guarantee.
- This spec deviates from the written design doc (`docs/superpowers/specs/2026-07-22-orbit-panel-tab-table-design.md`) in one place, resolved during planning: `orbit-tab`'s selection state is a plain consumer-bound `selected` input (no DI/auto-sync with `orbit-tablist`), because zero components in this codebase use parent→content-child DI, and every existing selection-style component (`orbit-pill-switch`, `orbit-selectable-tile`) is fully consumer-controlled. `orbit-tablist` computes *which* tab to activate (click delegation + keyboard) and emits `selectedChange`; the consumer binds `[selected]` on each `orbit-tab` and shows/hides `orbit-tab-panel`s themselves. This keeps zero hidden magic, consistent with the rest of the library.
- CDK's `GlobalPositionStrategy.top(x).bottom(y)` does NOT anchor both edges — calling `.bottom()` after `.top()` overwrites `_topOffset` back to `''` (verified by reading `node_modules/@angular/cdk/fesm2022/_overlay-module-chunk.mjs:1872-1893`). A full-height side panel must use `.top('0')` plus `side === 'left' ? .left('0') : .right('0')`, and get its height from `OverlayConfig.height: '100vh'` (which CDK's `apply()` treats as "flush", forcing `alignItems: 'flex-start'` regardless of what was set) — never from `positionStrategy.bottom()`.
- CDK's `GlobalPositionStrategy` applies `justifyContent`/`alignItems` to the `.cdk-global-overlay-wrapper` host element (via `overlayRef.hostElement`), not to the `.cdk-overlay-pane` itself — assert against `.cdk-global-overlay-wrapper` in tests, not the pane.

---

### Task 1: Panel offcanvas service (`OrbitPanelService`)

**Files:**
- Create: `projects/orbit/src/lib/services/panel/panel.service.ts`
- Create: `projects/orbit/src/lib/services/panel/index.ts`
- Test: `projects/orbit/src/lib/services/panel/panel.service.spec.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Produces: `OrbitPanelService.open<T>(component: ComponentType<T>, config?: OrbitPanelConfig): OrbitPanelRef<T>`. `OrbitPanelConfig { data?: unknown; side?: 'left' | 'right' (default 'right'); size?: 'sm' | 'md' | 'lg' | 'xl' | 'wide' (default 'md'); disableClose?: boolean; panelClass?: string }`. `OrbitPanelRef<T> { close(): void; overlayRef: OverlayRef; componentInstance: T }`. `ORBIT_PANEL_DATA: InjectionToken<unknown>`.

- [ ] **Step 1: Write the failing test**

```ts
// projects/orbit/src/lib/services/panel/panel.service.spec.ts
import { Component, inject } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ORBIT_PANEL_DATA, OrbitPanelService } from './panel.service';

@Component({
  selector: 'test-panel-content',
  template: `<p>{{ data }}</p>`,
})
class TestPanelContentComponent {
  data = inject(ORBIT_PANEL_DATA) as string;
}

describe('OrbitPanelService', () => {
  let service: OrbitPanelService;
  let overlayContainer: OverlayContainer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrbitPanelService);
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('attaches the given component to the overlay with the provided data, rendered immediately', () => {
    const ref = service.open(TestPanelContentComponent, { data: 'Ciao' });

    const overlayEl = overlayContainer.getContainerElement();
    expect(overlayEl.textContent).toContain('Ciao');
    expect(ref.componentInstance).toBeInstanceOf(TestPanelContentComponent);
  });

  it('anchors to the right by default and to the left when side is "left"', () => {
    service.open(TestPanelContentComponent, { data: 'A' });
    let wrapper = overlayContainer
      .getContainerElement()
      .querySelector('.cdk-global-overlay-wrapper') as HTMLElement;
    expect(wrapper.style.justifyContent).toBe('flex-end');
    service.closeAll();

    service.open(TestPanelContentComponent, { data: 'B', side: 'left' });
    wrapper = overlayContainer
      .getContainerElement()
      .querySelector('.cdk-global-overlay-wrapper') as HTMLElement;
    expect(wrapper.style.justifyContent).toBe('flex-start');
  });

  it('closes and detaches on backdrop click', () => {
    service.open(TestPanelContentComponent, { data: 'A' });
    const backdrop = overlayContainer
      .getContainerElement()
      .querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop.click();

    expect(overlayContainer.getContainerElement().textContent).not.toContain('A');
  });

  it('does not close on backdrop click when disableClose is true', () => {
    service.open(TestPanelContentComponent, { data: 'A', disableClose: true });
    const backdrop = overlayContainer
      .getContainerElement()
      .querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop.click();

    expect(overlayContainer.getContainerElement().textContent).toContain('A');
    service.closeAll();
  });

  it('ref.close() detaches the panel', () => {
    const ref = service.open(TestPanelContentComponent, { data: 'A' });
    ref.close();
    expect(overlayContainer.getContainerElement().textContent).not.toContain('A');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/panel.service.spec.ts'`
Expected: FAIL (`./panel.service` does not exist yet)

- [ ] **Step 3: Write the minimal implementation**

```ts
// projects/orbit/src/lib/services/panel/panel.service.ts
import { Injectable, inject, InjectionToken, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ESCAPE } from '@angular/cdk/keycodes';
import { filter, take } from 'rxjs';

export interface OrbitPanelConfig<T = unknown> {
  data?: T;
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'wide';
  disableClose?: boolean;
  panelClass?: string;
}

export const ORBIT_PANEL_DATA = new InjectionToken<unknown>('ORBIT_PANEL_DATA');

const SIZE_MAP: Record<string, string> = {
  sm: '320px',
  md: '440px',
  lg: '600px',
  xl: '760px',
  wide: '960px',
};

@Injectable({ providedIn: 'root' })
export class OrbitPanelService {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private openPanels: OverlayRef[] = [];

  open<T>(component: ComponentType<T>, config: OrbitPanelConfig = {}): OrbitPanelRef<T> {
    const size = config.size ?? 'md';
    const side = config.side ?? 'right';
    const panelClasses = ['orbit-panel-pane'];
    if (config.panelClass) panelClasses.push(config.panelClass);

    const positionStrategy = this.overlay.position().global().top('0');
    if (side === 'left') positionStrategy.left('0');
    else positionStrategy.right('0');

    const overlayConfig: OverlayConfig = {
      hasBackdrop: true,
      backdropClass: 'orbit-panel-backdrop',
      panelClass: panelClasses,
      width: SIZE_MAP[size],
      height: '100vh',
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.block(),
    };

    const overlayRef = this.overlay.create(overlayConfig);

    const portal = new ComponentPortal(
      component,
      null,
      Injector.create({
        parent: this.injector,
        providers: [{ provide: ORBIT_PANEL_DATA, useValue: config.data }],
      }),
    );
    const componentRef = overlayRef.attach(portal);
    componentRef.changeDetectorRef.detectChanges();

    this.openPanels.push(overlayRef);

    if (!config.disableClose) {
      overlayRef.backdropClick().pipe(take(1)).subscribe(() => this.close(overlayRef));
      overlayRef
        .keydownEvents()
        .pipe(
          filter((e) => e.keyCode === ESCAPE),
          take(1),
        )
        .subscribe(() => this.close(overlayRef));
    }

    return {
      close: () => this.close(overlayRef),
      overlayRef,
      componentInstance: componentRef.instance,
    };
  }

  closeAll(): void {
    [...this.openPanels].forEach((ref) => this.close(ref));
  }

  private close(ref: OverlayRef): void {
    const idx = this.openPanels.indexOf(ref);
    if (idx > -1) this.openPanels.splice(idx, 1);
    ref.detach();
    ref.dispose();
  }
}

export interface OrbitPanelRef<T = unknown> {
  close: () => void;
  overlayRef: OverlayRef;
  componentInstance: T;
}
```

```ts
// projects/orbit/src/lib/services/panel/index.ts
export { OrbitPanelService, ORBIT_PANEL_DATA } from './panel.service';
export type { OrbitPanelConfig, OrbitPanelRef } from './panel.service';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/panel.service.spec.ts'`
Expected: PASS (5 tests)

- [ ] **Step 5: Add the global overlay CSS classes**

In `projects/orbit/src/styles/styles.css`, add after the existing `.orbit-dialog-panel` block:

```css
.orbit-panel-backdrop { background: var(--orbit-overlay-backdrop); }
.orbit-panel-pane {
  display: flex;
  height: 100%;
  outline: 0;
}
```

- [ ] **Step 6: Export from public-api**

In `projects/orbit/src/public-api.ts`, add near the existing `export * from './lib/services/dialog';` line:

```ts
export * from './lib/services/panel';
```

- [ ] **Step 7: Full orbit-lab verification**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass (confirms the new export resolves through the library path mapping).

- [ ] **Step 8: Commit**

```bash
git add projects/orbit/src/lib/services/panel/ projects/orbit/src/styles/styles.css projects/orbit/src/public-api.ts
git commit -m "feat(orbit): add OrbitPanelService for side-anchored offcanvas panels"
```

---

### Task 2: Panel surfaces (`orbit-panel-surface` offcanvas shell, `orbit-panel` sidebar)

**Files:**
- Create: `projects/orbit/src/lib/components/panel-surface/panel-surface.component.ts`
- Create: `projects/orbit/src/lib/components/panel-surface/panel-surface.component.css`
- Create: `projects/orbit/src/lib/components/panel-surface/index.ts`
- Test: `projects/orbit/src/lib/components/panel-surface/panel-surface.component.spec.ts`
- Create: `projects/orbit/src/lib/components/panel/panel.component.ts`
- Create: `projects/orbit/src/lib/components/panel/panel.component.css`
- Create: `projects/orbit/src/lib/components/panel/index.ts`
- Test: `projects/orbit/src/lib/components/panel/panel.component.spec.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Consumes: nothing from Task 1 directly (a consumer's own component uses both `OrbitPanelService.open()` and `orbit-panel-surface` together, but neither references the other in code).
- Produces: `OrbitPanelSurfaceComponent` (selector `orbit-panel-surface`, inputs `labelledBy = input('')`, `describedBy = input('')`) — the visual shell a consumer places inside the component they pass to `OrbitPanelService.open()`. `OrbitPanelComponent` (selector `orbit-panel`, input `padding = input<'none' | 'default'>('default')`) — the persistent, non-overlay sidebar variant placed directly in a layout.

- [ ] **Step 1: Write the failing test for the offcanvas shell**

```ts
// projects/orbit/src/lib/components/panel-surface/panel-surface.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitPanelSurfaceComponent } from './panel-surface.component';

@Component({
  selector: 'test-host',
  imports: [OrbitPanelSurfaceComponent],
  template: `<orbit-panel-surface labelledBy="t" describedBy="d"><p>Contenuto</p></orbit-panel-surface>`,
})
class TestHostComponent {}

describe('OrbitPanelSurfaceComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('renders a dialog-role surface wired to the given labelledBy/describedBy', () => {
    const el = fixture.nativeElement.querySelector('.orbit-panel-surface');
    expect(el.getAttribute('role')).toBe('dialog');
    expect(el.getAttribute('aria-modal')).toBe('true');
    expect(el.getAttribute('aria-labelledby')).toBe('t');
    expect(el.getAttribute('aria-describedby')).toBe('d');
  });

  it('projects content', () => {
    expect(fixture.nativeElement.textContent).toContain('Contenuto');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/panel-surface.component.spec.ts'`
Expected: FAIL (`./panel-surface.component` does not exist)

- [ ] **Step 3: Implement the offcanvas shell**

```ts
// projects/orbit/src/lib/components/panel-surface/panel-surface.component.ts
import { A11yModule } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Visual shell for content opened through OrbitPanelService — the offcanvas analogue of orbit-modal. */
@Component({
  selector: 'orbit-panel-surface',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule],
  template: `<section
    class="orbit-panel-surface"
    role="dialog"
    aria-modal="true"
    cdkTrapFocus
    cdkTrapFocusAutoCapture
    [attr.aria-labelledby]="labelledBy() || null"
    [attr.aria-describedby]="describedBy() || null"
  ><ng-content /></section>`,
  styleUrl: './panel-surface.component.css',
})
export class OrbitPanelSurfaceComponent {
  labelledBy = input('');
  describedBy = input('');
}
```

```css
/* projects/orbit/src/lib/components/panel-surface/panel-surface.component.css */
:host { display: block; height: 100%; }
.orbit-panel-surface {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--orbit-surface-modal);
  box-shadow: var(--orbit-shadow-floating);
}
```

```ts
// projects/orbit/src/lib/components/panel-surface/index.ts
export { OrbitPanelSurfaceComponent } from './panel-surface.component';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/panel-surface.component.spec.ts'`
Expected: PASS (2 tests)

- [ ] **Step 5: Write the failing test for the sidebar variant**

```ts
// projects/orbit/src/lib/components/panel/panel.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitPanelComponent } from './panel.component';

describe('OrbitPanelComponent', () => {
  let fixture: ComponentFixture<OrbitPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitPanelComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitPanelComponent);
  });

  it('defaults to default padding', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-panel--no-padding')).toBe(false);
  });

  it('applies no-padding class when padding is "none"', () => {
    fixture.componentRef.setInput('padding', 'none');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('orbit-panel--no-padding')).toBe(true);
  });

  it('projects content', () => {
    const child = document.createElement('p');
    child.textContent = 'Barra laterale';
    fixture.nativeElement.appendChild(child);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Barra laterale');
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/panel.component.spec.ts'`
Expected: FAIL (`./panel.component` does not exist)

- [ ] **Step 7: Implement the sidebar variant**

```ts
// projects/orbit/src/lib/components/panel/panel.component.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './panel.component.css',
  host: {
    class: 'orbit-panel',
    '[class.orbit-panel--no-padding]': "padding() === 'none'",
  },
})
export class OrbitPanelComponent {
  padding = input<'none' | 'default'>('default');
}
```

```css
/* projects/orbit/src/lib/components/panel/panel.component.css */
:host.orbit-panel {
  display: block;
  padding: var(--orbit-space-5);
  border: 1px solid var(--orbit-border-subtle);
  border-radius: var(--orbit-radius-surface);
  background: var(--orbit-surface-default);
}
:host.orbit-panel--no-padding {
  padding: 0;
}
```

```ts
// projects/orbit/src/lib/components/panel/index.ts
export { OrbitPanelComponent } from './panel.component';
```

- [ ] **Step 8: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/panel.component.spec.ts'`
Expected: PASS (3 tests)

- [ ] **Step 9: Export both from public-api**

In `projects/orbit/src/public-api.ts`, add:

```ts
export * from './lib/components/panel-surface';
export * from './lib/components/panel';
```

- [ ] **Step 10: Full orbit-lab verification**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass.

- [ ] **Step 11: Commit**

```bash
git add projects/orbit/src/lib/components/panel-surface/ projects/orbit/src/lib/components/panel/ projects/orbit/src/public-api.ts
git commit -m "feat(orbit): add orbit-panel-surface (offcanvas shell) and orbit-panel (sidebar)"
```

---

### Task 3: Tab and tab-panel (`orbit-tab`, `orbit-tab-panel`)

**Files:**
- Create: `projects/orbit/src/lib/components/tab/tab.component.ts`
- Create: `projects/orbit/src/lib/components/tab/tab.component.html`
- Create: `projects/orbit/src/lib/components/tab/tab.component.css`
- Create: `projects/orbit/src/lib/components/tab/index.ts`
- Test: `projects/orbit/src/lib/components/tab/tab.component.spec.ts`
- Create: `projects/orbit/src/lib/components/tab-panel/tab-panel.component.ts`
- Create: `projects/orbit/src/lib/components/tab-panel/tab-panel.component.css`
- Create: `projects/orbit/src/lib/components/tab-panel/index.ts`
- Test: `projects/orbit/src/lib/components/tab-panel/tab-panel.component.spec.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Produces: `OrbitTabComponent` (selector `orbit-tab`; inputs `value = input.required<string>()`, `label = input('')`, `disabled = input(false, booleanAttribute)`, `selected = input(false, booleanAttribute)`; public method `focus(): void`; host renders `role="tab"`, `id="orbit-tab-" + value()`, `aria-controls="orbit-tab-panel-" + value()`). `OrbitTabPanelComponent` (selector `orbit-tab-panel`; input `value = input.required<string>()`; host renders `role="tabpanel"`, `id="orbit-tab-panel-" + value()`, `aria-labelledby="orbit-tab-" + value()`, `tabindex="0"`). Task 4's `orbit-tablist` consumes `OrbitTabComponent`'s `value()`, `disabled()`, and `focus()`.

- [ ] **Step 1: Write the failing test for orbit-tab**

```ts
// projects/orbit/src/lib/components/tab/tab.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTabComponent } from './tab.component';

describe('OrbitTabComponent', () => {
  let fixture: ComponentFixture<OrbitTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitTabComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitTabComponent);
    fixture.componentRef.setInput('value', 'general');
    fixture.componentRef.setInput('label', 'Generale');
  });

  it('renders ARIA tab role wired to its own value-derived id and controlled panel', () => {
    fixture.detectChanges();
    const host = fixture.nativeElement;
    expect(host.getAttribute('role')).toBe('tab');
    expect(host.getAttribute('id')).toBe('orbit-tab-general');
    expect(host.getAttribute('aria-controls')).toBe('orbit-tab-panel-general');
    expect(host.textContent).toContain('Generale');
  });

  it('reflects selected state via aria-selected and tabindex', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-selected')).toBe('true');
    expect(fixture.nativeElement.getAttribute('tabindex')).toBe('0');
  });

  it('is not tab-reachable when unselected', () => {
    fixture.componentRef.setInput('selected', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('tabindex')).toBe('-1');
  });

  it('reflects disabled state and forces tabindex -1 even if selected', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-disabled')).toBe('true');
    expect(fixture.nativeElement.getAttribute('tabindex')).toBe('-1');
  });

  it('focus() moves DOM focus to the host element', () => {
    fixture.detectChanges();
    fixture.componentInstance.focus();
    expect(document.activeElement).toBe(fixture.nativeElement);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/tab.component.spec.ts'`
Expected: FAIL (`./tab.component` does not exist)

- [ ] **Step 3: Implement orbit-tab**

```ts
// projects/orbit/src/lib/components/tab/tab.component.ts
import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';

@Component({
  selector: 'orbit-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
  host: {
    role: 'tab',
    '[id]': '"orbit-tab-" + value()',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-controls]': '"orbit-tab-panel-" + value()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]': 'selected() && !disabled() ? 0 : -1',
    '[class.orbit-tab--selected]': 'selected()',
    '[class.orbit-tab--disabled]': 'disabled()',
  },
})
export class OrbitTabComponent {
  value = input.required<string>();
  label = input('');
  disabled = input(false, { transform: booleanAttribute });
  selected = input(false, { transform: booleanAttribute });

  private readonly hostElement = inject(ElementRef<HTMLElement>);

  focus(): void {
    this.hostElement.nativeElement.focus();
  }
}
```

```html
<!-- projects/orbit/src/lib/components/tab/tab.component.html -->
<span class="orbit-tab__label">{{ label() }}</span>
<ng-content select="[orbitTabBadge]" />
```

```css
/* projects/orbit/src/lib/components/tab/tab.component.css */
:host {
  display: inline-flex;
  align-items: center;
  gap: var(--orbit-space-2);
  padding: var(--orbit-space-2) var(--orbit-space-4);
  border-bottom: 2px solid transparent;
  color: var(--orbit-text-secondary);
  font-family: var(--orbit-font-sans);
  font-size: var(--orbit-font-size-sm);
  font-weight: var(--orbit-font-weight-emphasis);
  cursor: pointer;
  white-space: nowrap;
  transition:
    color var(--orbit-motion-fast) var(--orbit-easing-standard),
    border-color var(--orbit-motion-fast) var(--orbit-easing-standard);
}
:host(.orbit-tab--selected) {
  border-color: var(--orbit-action-primary-bg);
  color: var(--orbit-text-primary);
}
:host(.orbit-tab--disabled) {
  opacity: 0.55;
  cursor: not-allowed;
}
:host(:focus-visible) {
  outline: 2px solid var(--orbit-action-primary-bg);
  outline-offset: -2px;
}
```

```ts
// projects/orbit/src/lib/components/tab/index.ts
export { OrbitTabComponent } from './tab.component';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/tab.component.spec.ts'`
Expected: PASS (5 tests)

- [ ] **Step 5: Write the failing test for orbit-tab-panel**

```ts
// projects/orbit/src/lib/components/tab-panel/tab-panel.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTabPanelComponent } from './tab-panel.component';

describe('OrbitTabPanelComponent', () => {
  let fixture: ComponentFixture<OrbitTabPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitTabPanelComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitTabPanelComponent);
    fixture.componentRef.setInput('value', 'general');
    fixture.detectChanges();
  });

  it('renders ARIA tabpanel role wired to its matching tab', () => {
    const host = fixture.nativeElement;
    expect(host.getAttribute('role')).toBe('tabpanel');
    expect(host.getAttribute('id')).toBe('orbit-tab-panel-general');
    expect(host.getAttribute('aria-labelledby')).toBe('orbit-tab-general');
    expect(host.getAttribute('tabindex')).toBe('0');
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/tab-panel.component.spec.ts'`
Expected: FAIL (`./tab-panel.component` does not exist)

- [ ] **Step 7: Implement orbit-tab-panel**

```ts
// projects/orbit/src/lib/components/tab-panel/tab-panel.component.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'orbit-tab-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './tab-panel.component.css',
  host: {
    role: 'tabpanel',
    '[id]': '"orbit-tab-panel-" + value()',
    '[attr.aria-labelledby]': '"orbit-tab-" + value()',
    tabindex: '0',
  },
})
export class OrbitTabPanelComponent {
  value = input.required<string>();
}
```

```css
/* projects/orbit/src/lib/components/tab-panel/tab-panel.component.css */
:host {
  display: block;
  padding: var(--orbit-space-4) 0;
}
```

```ts
// projects/orbit/src/lib/components/tab-panel/index.ts
export { OrbitTabPanelComponent } from './tab-panel.component';
```

- [ ] **Step 8: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/tab-panel.component.spec.ts'`
Expected: PASS (1 test)

- [ ] **Step 9: Export both from public-api**

In `projects/orbit/src/public-api.ts`, add:

```ts
export * from './lib/components/tab';
export * from './lib/components/tab-panel';
```

- [ ] **Step 10: Full orbit-lab verification**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass.

- [ ] **Step 11: Commit**

```bash
git add projects/orbit/src/lib/components/tab/ projects/orbit/src/lib/components/tab-panel/ projects/orbit/src/public-api.ts
git commit -m "feat(orbit): add orbit-tab and orbit-tab-panel"
```

---

### Task 4: Tablist orchestration (`orbit-tablist`)

**Files:**
- Create: `projects/orbit/src/lib/components/tablist/tablist.component.ts`
- Create: `projects/orbit/src/lib/components/tablist/index.ts`
- Test: `projects/orbit/src/lib/components/tablist/tablist.component.spec.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Consumes: `OrbitTabComponent` from Task 3 — its `value()`, `disabled()`, and `focus()`.
- Produces: `OrbitTablistComponent` (selector `orbit-tablist`; inputs `ariaLabel = input('')`; output `selectedChange = output<string>()`). Click on a tab, or `ArrowLeft`/`ArrowRight`/`Home`/`End` while focus is within the tablist, calls `.focus()` on the target `orbit-tab` and emits `selectedChange` with its `value()`. Disabled tabs are skipped.

- [ ] **Step 1: Write the failing test**

```ts
// projects/orbit/src/lib/components/tablist/tablist.component.spec.ts
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTabComponent } from '../tab/tab.component';
import { OrbitTablistComponent } from './tablist.component';

@Component({
  selector: 'test-host',
  imports: [OrbitTablistComponent, OrbitTabComponent],
  template: `<orbit-tablist ariaLabel="Sezioni" (selectedChange)="active.set($event)">
    <orbit-tab value="a" label="A" [selected]="active() === 'a'" />
    <orbit-tab value="b" label="B" [selected]="active() === 'b'" disabled />
    <orbit-tab value="c" label="C" [selected]="active() === 'c'" />
  </orbit-tablist>`,
})
class TestHostComponent {
  active = signal('a');
}

describe('OrbitTablistComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  function tabs(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
  }

  it('renders a tablist with the given aria-label', () => {
    expect(fixture.nativeElement.querySelector('[role="tablist"]').getAttribute('aria-label')).toBe(
      'Sezioni',
    );
  });

  it('emits selectedChange and moves focus when a tab is clicked', () => {
    tabs()[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('c');
    expect(document.activeElement).toBe(tabs()[2]);
  });

  it('does not activate a disabled tab on click', () => {
    tabs()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('a');
  });

  it('ArrowRight moves to the next enabled tab, skipping disabled ones', () => {
    tabs()[0].focus();
    tabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('c');
  });

  it('ArrowLeft from the first tab wraps to the last enabled tab', () => {
    tabs()[0].focus();
    tabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('c');
  });

  it('End activates the last enabled tab, Home the first', () => {
    tabs()[0].focus();
    tabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('c');

    tabs()[2].focus();
    tabs()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('a');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/tablist.component.spec.ts'`
Expected: FAIL (`./tablist.component` does not exist)

- [ ] **Step 3: Implement orbit-tablist**

```ts
// projects/orbit/src/lib/components/tablist/tablist.component.ts
import { ChangeDetectionStrategy, Component, contentChildren, input, output } from '@angular/core';
import { OrbitTabComponent } from '../tab/tab.component';

@Component({
  selector: 'orbit-tablist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'tablist',
    '[attr.aria-label]': 'ariaLabel() || null',
    '(keydown)': 'onKeydown($event)',
    '(click)': 'onClick($event)',
  },
})
export class OrbitTablistComponent {
  ariaLabel = input('');
  selectedChange = output<string>();

  private readonly tabs = contentChildren(OrbitTabComponent);

  onClick(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest('[role="tab"]') as HTMLElement | null;
    if (!target) return;
    const index = this.tabs().findIndex((tab) => target.id === `orbit-tab-${tab.value()}`);
    if (index === -1) return;
    this.activateIndex(index);
  }

  onKeydown(event: KeyboardEvent): void {
    const components = this.tabs();
    if (!components.length) return;

    const currentIndex = components.findIndex(
      (tab) => document.activeElement?.id === `orbit-tab-${tab.value()}`,
    );

    let nextIndex: number | null = null;
    if (event.key === 'Home') nextIndex = this.firstEnabled(components, 0, 1);
    if (event.key === 'End') nextIndex = this.firstEnabled(components, components.length - 1, -1);
    if (event.key === 'ArrowLeft') nextIndex = this.step(components, currentIndex, -1);
    if (event.key === 'ArrowRight') nextIndex = this.step(components, currentIndex, 1);
    if (nextIndex === null) return;

    event.preventDefault();
    this.activateIndex(nextIndex);
  }

  private activateIndex(index: number): void {
    const component = this.tabs()[index];
    if (!component || component.disabled()) return;
    component.focus();
    this.selectedChange.emit(component.value());
  }

  private step(components: readonly OrbitTabComponent[], from: number, direction: number): number | null {
    if (!components.length) return null;
    let idx = from;
    for (let i = 0; i < components.length; i++) {
      idx = (idx + direction + components.length) % components.length;
      if (!components[idx].disabled()) return idx;
    }
    return null;
  }

  private firstEnabled(
    components: readonly OrbitTabComponent[],
    start: number,
    direction: number,
  ): number | null {
    let idx = start;
    for (let i = 0; i < components.length; i++) {
      if (!components[idx].disabled()) return idx;
      idx = (idx + direction + components.length) % components.length;
    }
    return null;
  }
}
```

```ts
// projects/orbit/src/lib/components/tablist/index.ts
export { OrbitTablistComponent } from './tablist.component';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/tablist.component.spec.ts'`
Expected: PASS (6 tests)

- [ ] **Step 5: Export from public-api**

In `projects/orbit/src/public-api.ts`, add:

```ts
export * from './lib/components/tablist';
```

- [ ] **Step 6: Full orbit-lab verification**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add projects/orbit/src/lib/components/tablist/ projects/orbit/src/public-api.ts
git commit -m "feat(orbit): add orbit-tablist with click and arrow-key activation"
```

---

### Task 5: Table and sortable column (`orbit-table`, `orbit-table-column`)

**Files:**
- Create: `projects/orbit/src/lib/components/table/table.component.ts`
- Create: `projects/orbit/src/lib/components/table/table.component.css`
- Create: `projects/orbit/src/lib/components/table/index.ts`
- Test: `projects/orbit/src/lib/components/table/table.component.spec.ts`
- Create: `projects/orbit/src/lib/components/table-column/table-column.component.ts`
- Create: `projects/orbit/src/lib/components/table-column/table-column.component.html`
- Create: `projects/orbit/src/lib/components/table-column/table-column.component.css`
- Create: `projects/orbit/src/lib/components/table-column/index.ts`
- Test: `projects/orbit/src/lib/components/table-column/table-column.component.spec.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Consumes: `OrbitIconComponent` (`../../icons/icon.component`, already in the library since the visual-refresh plan) for the sort indicator.
- Produces: `OrbitTableComponent` (selector `orbit-table`, no inputs, wraps `<table class="orbit-table">`). `OrbitTableColumnComponent` (selector `orbit-table-column`, used inside a `<th>`; inputs `sortable = input(false, booleanAttribute)`, `sortDirection = input<'asc' | 'desc' | null>(null)`; output `sortChange = output<'asc' | 'desc'>()` — emits the *next* direction, toggled from the current one, defaulting to `'asc'` when `sortDirection()` is `null`).

- [ ] **Step 1: Write the failing test for orbit-table**

```ts
// projects/orbit/src/lib/components/table/table.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTableComponent } from './table.component';

@Component({
  selector: 'test-host',
  imports: [OrbitTableComponent],
  template: `<orbit-table>
    <thead><tr><th>Nome</th></tr></thead>
    <tbody><tr><td>Mario Rossi</td></tr></tbody>
  </orbit-table>`,
})
class TestHostComponent {}

describe('OrbitTableComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('wraps projected thead/tbody in a real <table>', () => {
    const table = fixture.nativeElement.querySelector('table.orbit-table');
    expect(table).toBeTruthy();
    expect(table.querySelector('th').textContent).toBe('Nome');
    expect(table.querySelector('td').textContent).toBe('Mario Rossi');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/table.component.spec.ts'`
Expected: FAIL (`./table.component` does not exist)

- [ ] **Step 3: Implement orbit-table**

```ts
// projects/orbit/src/lib/components/table/table.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orbit-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<table class="orbit-table"><ng-content /></table>`,
  styleUrl: './table.component.css',
})
export class OrbitTableComponent {}
```

```css
/* projects/orbit/src/lib/components/table/table.component.css */
:host { display: block; overflow-x: auto; }
.orbit-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--orbit-font-sans);
  font-size: var(--orbit-font-size-sm);
  color: var(--orbit-text-primary);
}
.orbit-table ::ng-deep th,
.orbit-table ::ng-deep td {
  padding: var(--orbit-space-3);
  text-align: left;
  border-bottom: 1px solid var(--orbit-border-subtle);
}
.orbit-table ::ng-deep thead th {
  color: var(--orbit-text-secondary);
  font-weight: var(--orbit-font-weight-emphasis);
  font-size: var(--orbit-font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.orbit-table ::ng-deep .orbit-table-row--disabled {
  color: var(--orbit-text-secondary);
  opacity: 0.65;
}
```

```ts
// projects/orbit/src/lib/components/table/index.ts
export { OrbitTableComponent } from './table.component';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/table.component.spec.ts'`
Expected: PASS (1 test)

- [ ] **Step 5: Write the failing test for orbit-table-column**

```ts
// projects/orbit/src/lib/components/table-column/table-column.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTableColumnComponent } from './table-column.component';

describe('OrbitTableColumnComponent', () => {
  let fixture: ComponentFixture<OrbitTableColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitTableColumnComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitTableColumnComponent);
  });

  it('has no aria-sort when not sortable', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-sort')).toBeNull();
  });

  it('reports aria-sort "none" when sortable with no current direction', () => {
    fixture.componentRef.setInput('sortable', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-sort')).toBe('none');
  });

  it('reports aria-sort "ascending"/"descending" matching sortDirection', () => {
    fixture.componentRef.setInput('sortable', true);
    fixture.componentRef.setInput('sortDirection', 'asc');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-sort')).toBe('ascending');

    fixture.componentRef.setInput('sortDirection', 'desc');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-sort')).toBe('descending');
  });

  it('emits "asc" on click when currently unsorted, and toggles thereafter', () => {
    fixture.componentRef.setInput('sortable', true);
    fixture.detectChanges();

    let emitted: string | undefined;
    fixture.componentInstance.sortChange.subscribe((dir) => (emitted = dir));

    fixture.nativeElement.click();
    expect(emitted).toBe('asc');

    fixture.componentRef.setInput('sortDirection', 'asc');
    fixture.detectChanges();
    fixture.nativeElement.click();
    expect(emitted).toBe('desc');
  });

  it('does not emit sortChange when not sortable', () => {
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.sortChange.subscribe(() => (emitted = true));
    fixture.nativeElement.click();
    expect(emitted).toBe(false);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/table-column.component.spec.ts'`
Expected: FAIL (`./table-column.component` does not exist)

- [ ] **Step 7: Implement orbit-table-column**

```ts
// projects/orbit/src/lib/components/table-column/table-column.component.ts
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'orbit-table-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent],
  templateUrl: './table-column.component.html',
  styleUrl: './table-column.component.css',
  host: {
    '[class.orbit-table-column--sortable]': 'sortable()',
    '[attr.aria-sort]': 'ariaSort()',
    '(click)': 'onClick()',
  },
})
export class OrbitTableColumnComponent {
  sortable = input(false, { transform: booleanAttribute });
  sortDirection = input<'asc' | 'desc' | null>(null);
  sortChange = output<'asc' | 'desc'>();

  protected readonly ariaSort = computed(() => {
    if (!this.sortable()) return null;
    if (this.sortDirection() === 'asc') return 'ascending';
    if (this.sortDirection() === 'desc') return 'descending';
    return 'none';
  });

  onClick(): void {
    if (!this.sortable()) return;
    this.sortChange.emit(this.sortDirection() === 'asc' ? 'desc' : 'asc');
  }
}
```

```html
<!-- projects/orbit/src/lib/components/table-column/table-column.component.html -->
<span class="orbit-table-column__label"><ng-content /></span>
@if (sortable()) {
  <orbit-icon
    name="chevron-down"
    class="orbit-table-column__sort-icon"
    [class.orbit-table-column__sort-icon--asc]="sortDirection() === 'asc'"
  />
}
```

```css
/* projects/orbit/src/lib/components/table-column/table-column.component.css */
:host {
  display: inline-flex;
  align-items: center;
  gap: var(--orbit-space-1);
}
:host(.orbit-table-column--sortable) {
  cursor: pointer;
  user-select: none;
}
.orbit-table-column__sort-icon {
  width: 0.875rem;
  height: 0.875rem;
  transition: transform var(--orbit-motion-fast) var(--orbit-easing-standard);
}
.orbit-table-column__sort-icon--asc {
  transform: rotate(180deg);
}
```

```ts
// projects/orbit/src/lib/components/table-column/index.ts
export { OrbitTableColumnComponent } from './table-column.component';
```

- [ ] **Step 8: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/table-column.component.spec.ts'`
Expected: PASS (5 tests)

- [ ] **Step 9: Export both from public-api**

In `projects/orbit/src/public-api.ts`, add:

```ts
export * from './lib/components/table';
export * from './lib/components/table-column';
```

- [ ] **Step 10: Full orbit-lab verification**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass.

- [ ] **Step 11: Commit**

```bash
git add projects/orbit/src/lib/components/table/ projects/orbit/src/lib/components/table-column/ projects/orbit/src/public-api.ts
git commit -m "feat(orbit): add orbit-table and orbit-table-column with sort toggling"
```

---

### Task 6: Table row disabled state (`orbitTableRow`)

**Files:**
- Create: `projects/orbit/src/lib/components/table-row/table-row.directive.ts`
- Create: `projects/orbit/src/lib/components/table-row/index.ts`
- Test: `projects/orbit/src/lib/components/table-row/table-row.directive.spec.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Consumes: nothing (styling class `.orbit-table-row--disabled` is already defined in `table.component.css` from Task 5, scoped via `::ng-deep`).
- Produces: `OrbitTableRowDirective` (selector `[orbitTableRow]`; input `disabled = input(false, booleanAttribute)`) — applied to a consumer's own `<tr>`.

- [ ] **Step 1: Write the failing test**

```ts
// projects/orbit/src/lib/components/table-row/table-row.directive.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitTableRowDirective } from './table-row.directive';

@Component({
  selector: 'test-host',
  imports: [OrbitTableRowDirective],
  template: `<table>
    <tbody>
      <tr orbitTableRow [disabled]="isDisabled" (click)="clicked = true">
        <td>Riga</td>
      </tr>
    </tbody>
  </table>`,
})
class TestHostComponent {
  isDisabled = false;
  clicked = false;
}

describe('OrbitTableRowDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('adds no disabled class/attribute by default', () => {
    const row = fixture.nativeElement.querySelector('tr');
    expect(row.classList.contains('orbit-table-row--disabled')).toBe(false);
    expect(row.getAttribute('aria-disabled')).toBeNull();
  });

  it('adds the disabled class and aria-disabled when disabled is true', () => {
    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();
    const row = fixture.nativeElement.querySelector('tr');
    expect(row.classList.contains('orbit-table-row--disabled')).toBe(true);
    expect(row.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not suppress a native click handler the consumer attaches to the same row', () => {
    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();
    fixture.nativeElement.querySelector('tr').click();
    expect(fixture.componentInstance.clicked).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/table-row.directive.spec.ts'`
Expected: FAIL (`./table-row.directive` does not exist)

- [ ] **Step 3: Implement the directive**

```ts
// projects/orbit/src/lib/components/table-row/table-row.directive.ts
import { booleanAttribute, Directive, input } from '@angular/core';

@Directive({
  selector: '[orbitTableRow]',
  host: {
    '[class.orbit-table-row--disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled() || null',
  },
})
export class OrbitTableRowDirective {
  disabled = input(false, { transform: booleanAttribute });
}
```

```ts
// projects/orbit/src/lib/components/table-row/index.ts
export { OrbitTableRowDirective } from './table-row.directive';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/table-row.directive.spec.ts'`
Expected: PASS (3 tests)

- [ ] **Step 5: Export from public-api**

In `projects/orbit/src/public-api.ts`, add:

```ts
export * from './lib/components/table-row';
```

- [ ] **Step 6: Full orbit-lab verification**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add projects/orbit/src/lib/components/table-row/ projects/orbit/src/public-api.ts
git commit -m "feat(orbit): add orbitTableRow directive for disabled row state"
```

---

### Task 7: Panel catalog page

**Files:**
- Create: `projects/orbit-lab/src/app/pages/panel-page/panel-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/panel-page/panel-page.component.html`
- Test: `projects/orbit-lab/src/app/pages/panel-page/panel-page.component.spec.ts`
- Modify: `projects/orbit-lab/src/app/catalog/catalog.ts`
- Modify: `projects/orbit-lab/src/app/app.routes.ts`

**Interfaces:**
- Consumes: `OrbitPanelService`, `OrbitPanelSurfaceComponent`, `OrbitPanelComponent`, `OrbitModalHeaderComponent`, `OrbitButtonComponent` (all already exported), `LabExampleComponent` (`../../catalog/example-panel.component`).

- [ ] **Step 1: Write the component and its demo content**

```ts
// projects/orbit-lab/src/app/pages/panel-page/panel-page.component.ts
import { ChangeDetectionStrategy, Component, inject, Injectable, signal } from '@angular/core';
import {
  OrbitButtonComponent,
  OrbitModalHeaderComponent,
  OrbitPanelComponent,
  OrbitPanelService,
  OrbitPanelSurfaceComponent,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-panel-demo-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitPanelSurfaceComponent, OrbitModalHeaderComponent],
  template: `<orbit-panel-surface labelledBy="panel-demo-title">
    <orbit-modal-header title="Dettaglio" titleId="panel-demo-title" (closeClicked)="close()" />
    <div style="padding: 1rem">Contenuto del pannello offcanvas.</div>
  </orbit-panel-surface>`,
})
class LabPanelDemoContentComponent {
  private readonly panel = inject(OrbitPanelService);
  close(): void {
    this.panel.closeAll();
  }
}

@Component({
  selector: 'lab-panel-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent, OrbitPanelComponent, LabExampleComponent],
  templateUrl: './panel-page.component.html',
})
export class PanelPageComponent {
  private readonly panel = inject(OrbitPanelService);
  protected readonly lastOpenedSide = signal<'left' | 'right' | null>(null);

  protected readonly offcanvasSnippet = `const panel = inject(OrbitPanelService);
panel.open(MyPanelContentComponent, { side: 'right', size: 'md' });`;

  protected readonly sidebarSnippet = '<orbit-panel><p>Contenuto fisso di layout</p></orbit-panel>';

  openOffcanvas(side: 'left' | 'right'): void {
    this.lastOpenedSide.set(side);
    this.panel.open(LabPanelDemoContentComponent, { side });
  }
}
```

- [ ] **Step 2: Write the template**

```html
<!-- projects/orbit-lab/src/app/pages/panel-page/panel-page.component.html -->
<article>
  <h1>Panel</h1>
  <p>Due varianti: overlay offcanvas transitorio (via <code>OrbitPanelService</code>) e sidebar persistente di layout (<code>orbit-panel</code>).</p>

  <section>
    <h2>Offcanvas</h2>
    <lab-example [code]="offcanvasSnippet">
      <orbit-button label="Apri da destra" (clicked)="openOffcanvas('right')" />
      <orbit-button label="Apri da sinistra" tone="neutral" variant="outline" (clicked)="openOffcanvas('left')" />
    </lab-example>
    @if (lastOpenedSide()) {
      <p>Ultimo lato aperto: <strong>{{ lastOpenedSide() }}</strong></p>
    }
  </section>

  <section>
    <h2>Sidebar</h2>
    <lab-example [code]="sidebarSnippet">
      <orbit-panel><p>Contenuto fisso di layout</p></orbit-panel>
    </lab-example>
  </section>
</article>
```

- [ ] **Step 3: Write the test**

```ts
// projects/orbit-lab/src/app/pages/panel-page/panel-page.component.spec.ts
import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { PanelPageComponent } from './panel-page.component';

describe('PanelPageComponent', () => {
  let fixture: ComponentFixture<PanelPageComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PanelPageComponent] }).compileComponents();
    fixture = TestBed.createComponent(PanelPageComponent);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('renders a persistent sidebar panel inline', () => {
    expect(fixture.nativeElement.querySelector('orbit-panel')).toBeTruthy();
  });

  it('opens the offcanvas panel on the overlay when "Apri da destra" is clicked', () => {
    const openButton = Array.from(fixture.nativeElement.querySelectorAll('orbit-button button')).find((btn) =>
      (btn as HTMLButtonElement).textContent?.includes('Apri da destra'),
    ) as HTMLButtonElement;
    openButton.click();
    fixture.detectChanges();

    const overlayEl = overlayContainer.getContainerElement();
    expect(overlayEl.querySelector('orbit-panel-surface')).toBeTruthy();
    expect(overlayEl.textContent).toContain('Dettaglio');
  });
});
```

- [ ] **Step 4: Add the catalog entry and route**

In `projects/orbit-lab/src/app/catalog/catalog.ts`, add before the closing `];`:

```ts
  { slug: 'panel', label: 'Panel', status: 'verified' },
```

In `projects/orbit-lab/src/app/app.routes.ts`, add:

```ts
  {
    path: 'panel',
    loadComponent: () =>
      import('./pages/panel-page/panel-page.component').then((m) => m.PanelPageComponent),
  },
```

- [ ] **Step 5: Run the tests**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab --include='**/panel-page.component.spec.ts' --include='**/catalog.spec.ts'`
Expected: all pass.

- [ ] **Step 6: Full orbit-lab verification**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass (aside from any pre-existing failures already present on the branch before this plan started — note them in the report, do not attempt to fix unrelated pre-existing failures).

- [ ] **Step 7: Commit**

```bash
git add projects/orbit-lab/src/app/pages/panel-page/ projects/orbit-lab/src/app/catalog/catalog.ts projects/orbit-lab/src/app/app.routes.ts
git commit -m "feat(orbit-lab): add Panel catalog page (offcanvas + sidebar)"
```

---

### Task 8: Tab catalog page

**Files:**
- Create: `projects/orbit-lab/src/app/pages/tab-page/tab-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/tab-page/tab-page.component.html`
- Test: `projects/orbit-lab/src/app/pages/tab-page/tab-page.component.spec.ts`
- Modify: `projects/orbit-lab/src/app/catalog/catalog.ts`
- Modify: `projects/orbit-lab/src/app/app.routes.ts`

**Interfaces:**
- Consumes: `OrbitTablistComponent`, `OrbitTabComponent`, `OrbitTabPanelComponent`, `OrbitBadgeComponent` (all already exported), `LabExampleComponent`.

- [ ] **Step 1: Write the component**

```ts
// projects/orbit-lab/src/app/pages/tab-page/tab-page.component.ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  OrbitBadgeComponent,
  OrbitTabComponent,
  OrbitTabPanelComponent,
  OrbitTablistComponent,
} from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-tab-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitTablistComponent,
    OrbitTabComponent,
    OrbitTabPanelComponent,
    OrbitBadgeComponent,
    LabExampleComponent,
  ],
  templateUrl: './tab-page.component.html',
})
export class TabPageComponent {
  protected readonly active = signal('general');

  protected readonly snippet = `<orbit-tablist ariaLabel="Sezioni" (selectedChange)="active.set($event)">
  <orbit-tab value="general" label="Generale" [selected]="active() === 'general'" />
  <orbit-tab value="docs" label="Documenti" [selected]="active() === 'docs'">
    <orbit-badge orbitTabBadge label="3" tone="neutral" />
  </orbit-tab>
  <orbit-tab value="closed" label="Chiuso" [selected]="active() === 'closed'" disabled />
</orbit-tablist>`;
}
```

- [ ] **Step 2: Write the template**

```html
<!-- projects/orbit-lab/src/app/pages/tab-page/tab-page.component.html -->
<article>
  <h1>Tab</h1>
  <p>
    Selezione controllata dal consumer; frecce/Home/End spostano focus e selezione, saltando le
    tab disabilitate. Ogni tab può proiettare un badge contatore.
  </p>

  <section>
    <h2>Con badge e stato disabilitato</h2>
    <lab-example [code]="snippet">
      <orbit-tablist ariaLabel="Sezioni" (selectedChange)="active.set($event)">
        <orbit-tab value="general" label="Generale" [selected]="active() === 'general'" />
        <orbit-tab value="docs" label="Documenti" [selected]="active() === 'docs'">
          <orbit-badge orbitTabBadge label="3" tone="neutral" />
        </orbit-tab>
        <orbit-tab value="closed" label="Chiuso" [selected]="active() === 'closed'" disabled />
      </orbit-tablist>

      @if (active() === 'general') {
        <orbit-tab-panel value="general">Contenuto generale.</orbit-tab-panel>
      }
      @if (active() === 'docs') {
        <orbit-tab-panel value="docs">Elenco documenti.</orbit-tab-panel>
      }
    </lab-example>
  </section>
</article>
```

- [ ] **Step 3: Write the test**

```ts
// projects/orbit-lab/src/app/pages/tab-page/tab-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TabPageComponent } from './tab-page.component';

describe('TabPageComponent', () => {
  let fixture: ComponentFixture<TabPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TabPageComponent] }).compileComponents();
    fixture = TestBed.createComponent(TabPageComponent);
    fixture.detectChanges();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('renders three real orbit-tab elements including one disabled', () => {
    const tabs = fixture.nativeElement.querySelectorAll('orbit-tab');
    expect(tabs.length).toBe(3);
    expect(tabs[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('switches panel content when a tab is clicked', () => {
    expect(fixture.nativeElement.textContent).toContain('Contenuto generale.');

    const docsTab = Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')).find((el) =>
      (el as HTMLElement).textContent?.includes('Documenti'),
    ) as HTMLElement;
    docsTab.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Elenco documenti.');
    expect(fixture.nativeElement.textContent).not.toContain('Contenuto generale.');
  });

  it('renders the badge on the Documenti tab', () => {
    const docsTab = Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')).find((el) =>
      (el as HTMLElement).textContent?.includes('Documenti'),
    ) as HTMLElement;
    expect(docsTab.querySelector('orbit-badge')).toBeTruthy();
  });
});
```

- [ ] **Step 4: Add the catalog entry and route**

In `projects/orbit-lab/src/app/catalog/catalog.ts`, add:

```ts
  { slug: 'tab', label: 'Tab', status: 'verified' },
```

In `projects/orbit-lab/src/app/app.routes.ts`, add:

```ts
  {
    path: 'tab',
    loadComponent: () => import('./pages/tab-page/tab-page.component').then((m) => m.TabPageComponent),
  },
```

- [ ] **Step 5: Run the tests**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab --include='**/tab-page.component.spec.ts' --include='**/catalog.spec.ts'`
Expected: all pass.

- [ ] **Step 6: Full orbit-lab verification**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass (aside from any pre-existing unrelated failures already on the branch).

- [ ] **Step 7: Commit**

```bash
git add projects/orbit-lab/src/app/pages/tab-page/ projects/orbit-lab/src/app/catalog/catalog.ts projects/orbit-lab/src/app/app.routes.ts
git commit -m "feat(orbit-lab): add Tab catalog page"
```

---

### Task 9: Table catalog page

**Files:**
- Create: `projects/orbit-lab/src/app/pages/table-page/table-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/table-page/table-page.component.html`
- Test: `projects/orbit-lab/src/app/pages/table-page/table-page.component.spec.ts`
- Modify: `projects/orbit-lab/src/app/catalog/catalog.ts`
- Modify: `projects/orbit-lab/src/app/app.routes.ts`

**Interfaces:**
- Consumes: `OrbitTableComponent`, `OrbitTableColumnComponent`, `OrbitTableRowDirective` (all already exported), `LabExampleComponent`.

- [ ] **Step 1: Write the component**

```ts
// projects/orbit-lab/src/app/pages/table-page/table-page.component.ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { OrbitTableColumnComponent, OrbitTableComponent, OrbitTableRowDirective } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

interface Row {
  name: string;
  status: string;
  active: boolean;
}

@Component({
  selector: 'lab-table-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitTableComponent, OrbitTableColumnComponent, OrbitTableRowDirective, LabExampleComponent],
  templateUrl: './table-page.component.html',
})
export class TablePageComponent {
  private readonly rows: Row[] = [
    { name: 'Mario Rossi', status: 'Attivo', active: true },
    { name: 'Luca Bianchi', status: 'Scaduto', active: false },
    { name: 'Anna Verdi', status: 'Attivo', active: true },
  ];

  protected readonly sortDirection = signal<'asc' | 'desc' | null>(null);

  protected readonly sortedRows = computed(() => {
    const direction = this.sortDirection();
    if (!direction) return this.rows;
    const sorted = [...this.rows].sort((a, b) => a.name.localeCompare(b.name));
    return direction === 'asc' ? sorted : sorted.reverse();
  });

  protected readonly snippet = `<orbit-table>
  <thead>
    <tr><th><orbit-table-column sortable [sortDirection]="dir" (sortChange)="dir = $event">Nome</orbit-table-column></th></tr>
  </thead>
  <tbody>
    @for (row of rows; track row.name) {
      <tr orbitTableRow [disabled]="!row.active">
        <td>{{ row.name }}</td>
      </tr>
    }
  </tbody>
</orbit-table>`;

  onSortChange(direction: 'asc' | 'desc'): void {
    this.sortDirection.set(direction);
  }
}
```

- [ ] **Step 2: Write the template**

```html
<!-- projects/orbit-lab/src/app/pages/table-page/table-page.component.html -->
<article>
  <h1>Table</h1>
  <p>
    Componente presentazionale: il consumer possiede l'iterazione riga e la logica di
    ordinamento. <code>orbit-table-column</code> emette solo la direzione richiesta;
    <code>orbitTableRow</code> marca lo stato disabilitato/muted.
  </p>

  <section>
    <h2>Colonna ordinabile e riga disabilitata</h2>
    <lab-example [code]="snippet">
      <orbit-table>
        <thead>
          <tr>
            <th>
              <orbit-table-column sortable [sortDirection]="sortDirection()" (sortChange)="onSortChange($event)"
                >Nome</orbit-table-column
              >
            </th>
            <th>Stato</th>
          </tr>
        </thead>
        <tbody>
          @for (row of sortedRows(); track row.name) {
            <tr orbitTableRow [disabled]="!row.active" [attr.data-row-disabled]="!row.active">
              <td>{{ row.name }}</td>
              <td>{{ row.status }}</td>
            </tr>
          }
        </tbody>
      </orbit-table>
    </lab-example>
  </section>
</article>
```

- [ ] **Step 3: Write the test**

```ts
// projects/orbit-lab/src/app/pages/table-page/table-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TablePageComponent } from './table-page.component';

describe('TablePageComponent', () => {
  let fixture: ComponentFixture<TablePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TablePageComponent] }).compileComponents();
    fixture = TestBed.createComponent(TablePageComponent);
    fixture.detectChanges();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('renders one row per record with the inactive one marked disabled', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
    const disabledRow = Array.from(rows).find(
      (row) => (row as HTMLElement).getAttribute('data-row-disabled') === 'true',
    ) as HTMLElement;
    expect(disabledRow.classList.contains('orbit-table-row--disabled')).toBe(true);
  });

  it('re-sorts rows alphabetically on column click, toggling direction', () => {
    const columnHeader = fixture.nativeElement.querySelector('orbit-table-column');
    columnHeader.click();
    fixture.detectChanges();

    let names = Array.from(fixture.nativeElement.querySelectorAll('tbody tr td:first-child')).map(
      (td) => (td as HTMLElement).textContent,
    );
    expect(names).toEqual(['Anna Verdi', 'Luca Bianchi', 'Mario Rossi']);

    columnHeader.click();
    fixture.detectChanges();
    names = Array.from(fixture.nativeElement.querySelectorAll('tbody tr td:first-child')).map(
      (td) => (td as HTMLElement).textContent,
    );
    expect(names).toEqual(['Mario Rossi', 'Luca Bianchi', 'Anna Verdi']);
  });
});
```

- [ ] **Step 4: Add the catalog entry and route**

In `projects/orbit-lab/src/app/catalog/catalog.ts`, add:

```ts
  { slug: 'table', label: 'Table', status: 'verified' },
```

In `projects/orbit-lab/src/app/app.routes.ts`, add:

```ts
  {
    path: 'table',
    loadComponent: () =>
      import('./pages/table-page/table-page.component').then((m) => m.TablePageComponent),
  },
```

- [ ] **Step 5: Run the tests**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab --include='**/table-page.component.spec.ts' --include='**/catalog.spec.ts'`
Expected: all pass.

- [ ] **Step 6: Full orbit-lab verification**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass (aside from any pre-existing unrelated failures already on the branch).

- [ ] **Step 7: Commit**

```bash
git add projects/orbit-lab/src/app/pages/table-page/ projects/orbit-lab/src/app/catalog/catalog.ts projects/orbit-lab/src/app/app.routes.ts
git commit -m "feat(orbit-lab): add Table catalog page"
```

---

## Deferred / not in this plan

- Row-selection checkboxes, pagination, and virtual scrolling for `orbit-table` — real usage signal is a small minority of the 169 audited tables; each is a well-isolated follow-up if usage data changes.
- Vertical tab orientation and closable/removable tabs — no real usage found in `service-frontend`.
- Resizable/draggable panel width — no real usage need identified.
- Migrating any of the 128 sort/filter tables, 3 hand-rolled tab UIs, or a future offcanvas/sidebar screen in `service-frontend` onto these new Orbit components — separate, future, per-screen work.
- Expanding `OrbitIconComponent`'s registry beyond the 4 existing icons for table/tab-specific needs — `chevron-down` (used here) already exists; no new icon was needed.
