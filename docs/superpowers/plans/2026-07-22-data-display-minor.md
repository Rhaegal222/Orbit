# Data-display minori Implementation Plan

> **Stato:** Completato
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add five independent, medium/low-complexity data-display/navigation components to the Orbit library — `OrbitAvatarComponent`, `OrbitChipComponent`, `OrbitBreadcrumbComponent`, `OrbitPaginationComponent`, `OrbitAccordionComponent`/`OrbitAccordionItemComponent` — plus five matching `orbit-lab` catalog demo pages, per the approved spec at `docs/superpowers/specs/2026-07-22-data-display-minor-design.md`.

**Architecture:** Each component lives in its own folder under `projects/orbit/src/lib/components/<name>/` (`.ts`/`.html`/`.css`/`.spec.ts`/`index.ts`), follows the existing OnPush + signal-input/output conventions (see `badge.component.ts`, `sidebar.component.ts`, `select.component.ts`), and is re-exported from `projects/orbit/src/public-api.ts`. Chip, Breadcrumb and Pagination are "controlled components" exactly like the shell's `sidebarCollapsed`/`onSidebarCollapsedChange` pair: they never keep their own divergent state, only reflect the input and emit change events. Breadcrumb's hidden-items popover and Accordion's single-open coordination both reuse existing low-level mechanisms already proven in the codebase (CDK `Overlay` + `flexibleConnectedTo`, and a self-injected controller token respectively) rather than introducing new abstractions. Five new `orbit-lab` pages follow the `slider-page` pattern exactly (page component + template + spec, `CATALOG_ENTRIES` entry, lazy route).

**Tech Stack:** Angular 22 (standalone components, signals: `input`/`output`/`computed`/`contentChildren`), `@angular/cdk/overlay` + `@angular/cdk/portal`, Vitest (`@angular/build:unit-test`).

## Global Constraints

- Angular 22 standalone components only, `ChangeDetectionStrategy.OnPush` on every component (per every existing Orbit component).
- Signal-based `input()`/`output()` APIs; boolean inputs use `input(false, { transform: booleanAttribute })` exactly like `OrbitSidebarComponent.collapsed`.
- No new design tokens for any of the five components — reuse existing surface/border/text/action tokens from `projects/orbit/src/styles/tokens.css`.
- No new icons — Chip's remove button reuses the existing `close` icon; Pagination's prev/next reuse `chevron-down` rotated ±90° (the exact technique in `sidebar.component.html`/`.css`, classes `orbit-sidebar__toggle-icon--collapsed`/`--expanded`); Accordion's expand indicator reuses `chevron-down` rotated the same way. Avatar never renders an icon (initials fallback only). Breadcrumb needs no icon at all (plain `/` text separator).
- Every controlled input (`OrbitChipComponent.selected`, `OrbitAccordionItemComponent.expanded`, `OrbitPaginationComponent.currentPage`) is read-only from the component's own perspective — the component never mutates it locally, it only emits change events, exactly like `LabShellComponent.sidebarCollapsed`/`onSidebarCollapsedChange` in `projects/orbit-lab/src/app/shell/lab-shell.component.ts:288,356-358`.
- Test runner: node/npm are managed via nvm, not on PATH. Every shell command that runs `npm`/`ng` must be prefixed with `source ~/.nvm/nvm.sh && nvm use v24.16.0 &&`.
  - Orbit library tests: `npm run test:core -- --watch=false` (equivalent to `ng test orbit --watch=false`).
  - orbit-lab tests: use `npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"` to isolate from an unrelated in-progress page in that directory — do **not** move, delete, or otherwise touch `projects/orbit-lab/src/app/pages/examples-page/`, it belongs to other work.
- Do not run any git commands (no commits, no branch changes, no staging) — this plan only writes/edits files.

---

## Spec-resolution notes (read before starting)

1. **Breadcrumb popover mechanism.** The design spec says the "…" popover reuses "il pattern overlay esistente, stesso usato da popover/select". `OrbitPanelService` (`projects/orbit/src/lib/services/panel/panel.service.ts`) is a *global, full-height, left/right side-panel* service — unsuitable for a small anchored dropdown next to a "…" button. The component that actually matches "same pattern as popover/select" is `OrbitSelectComponent`'s own overlay code (`select.component.ts:228-269`): it injects `Overlay`/`ViewContainerRef` directly, builds a `flexibleConnectedTo` position strategy anchored to a trigger element, and attaches a `TemplatePortal`. Task 3 below has Breadcrumb reuse *that* concrete mechanism (CDK `Overlay` + `flexibleConnectedTo` + `TemplatePortal`), not `OrbitPanelService`. This is the more faithful reading of "same pattern as popover/select" and keeps the popover visually anchored where a breadcrumb "…" popover needs to be.
2. **Accordion parent/child wiring without a circular import.** The spec mandates `OrbitAccordionComponent` uses `contentChildren(OrbitAccordionItemComponent)` (a value-level import of the item file) while each item must be able to notify its parent when it opens (a value-level import back toward the container) — a direct circular import between `accordion.component.ts` and `accordion-item.component.ts`. Task 5 resolves this with a third file, `accordion-token.ts`, holding only an `InjectionToken` and two structural interfaces; `accordion-item.component.ts` imports only from that token file (never from `accordion.component.ts`), and `accordion.component.ts` imports the item component (for `contentChildren`) and the token (to provide itself via `forwardRef`, exactly like the existing `NG_VALUE_ACCESSOR` self-provider pattern in `select.component.ts:36-42`). No cycle exists at the module level.
3. **Chip cannot literally nest a `<button>` inside a `<button>`.** The spec says the chip body is a `<button>` and the remove control is "un pulsante × interno... separato dal corpo cliccabile" (a *separate* button). Nested `<button>` elements are invalid HTML, so Task 2 renders a non-interactive `<span class="orbit-chip">` host wrapper containing two **sibling** `<button>` elements (`orbit-chip__body` and `orbit-chip__remove`), matching "separato" literally rather than nesting.
4. **New i18n labels required.** The spec's "Token e icone" section says no new tokens/icons, but doesn't mention i18n strings. Chip's remove button and Pagination's prev/next buttons need `aria-label`s, and the existing convention (`ORBIT_I18N`/`DEFAULT_ORBIT_I18N` in `projects/orbit/src/lib/i18n/orbit-i18n.ts`) is the only sanctioned place for that text (see `collapseSidebar`/`expandSidebar` already there for exactly this reason). Tasks 2 and 4 each add the two labels they need to that shared file.

---

## Task 1: `OrbitAvatarComponent`

**Files:**
- Create: `projects/orbit/src/lib/components/avatar/avatar.component.ts`
- Create: `projects/orbit/src/lib/components/avatar/avatar.component.html`
- Create: `projects/orbit/src/lib/components/avatar/avatar.component.css`
- Create: `projects/orbit/src/lib/components/avatar/avatar.component.spec.ts`
- Create: `projects/orbit/src/lib/components/avatar/index.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `OrbitAvatarComponent` (selector `orbit-avatar`), `export type OrbitAvatarSize = 'sm' | 'md' | 'lg'`. Inputs: `src = input<string | undefined>(undefined)`, `name = input.required<string>()`, `size = input<OrbitAvatarSize>('md')`. No outputs.

- [x] **Step 1: Write the failing spec**

Create `projects/orbit/src/lib/components/avatar/avatar.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitAvatarComponent } from './avatar.component';

describe('OrbitAvatarComponent', () => {
  let fixture: ComponentFixture<OrbitAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitAvatarComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitAvatarComponent);
  });

  it('creates', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('derives two-letter initials from a compound name', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-avatar__initials')?.textContent?.trim()).toBe('MR');
  });

  it('derives a single-letter initial from a single-word name', () => {
    fixture.componentRef.setInput('name', 'Cher');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-avatar__initials')?.textContent?.trim()).toBe('C');
  });

  it('falls back to "?" for an empty name', () => {
    fixture.componentRef.setInput('name', '');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-avatar__initials')?.textContent?.trim()).toBe('?');
  });

  it('takes the first letter of the first and last word for names with more than two words', () => {
    fixture.componentRef.setInput('name', 'Maria Grazia Del Vecchio');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.orbit-avatar__initials')?.textContent?.trim()).toBe('MV');
  });

  it('renders an <img> with alt text when src is provided', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.componentRef.setInput('src', 'https://example.test/avatar.png');
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.alt).toBe('Mario Rossi');
    expect(fixture.nativeElement.querySelector('.orbit-avatar__initials')).toBeNull();
  });

  it('falls back to initials when the image fails to load', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.componentRef.setInput('src', 'https://example.test/broken.png');
    fixture.detectChanges();
    fixture.nativeElement.querySelector('img').dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.querySelector('.orbit-avatar__initials')?.textContent?.trim()).toBe('MR');
  });

  it('produces the same background hue for the same name', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.detectChanges();
    const hueA = fixture.componentInstance['backgroundHue']();

    const fixture2 = TestBed.createComponent(OrbitAvatarComponent);
    fixture2.componentRef.setInput('name', 'Mario Rossi');
    fixture2.detectChanges();
    const hueB = fixture2.componentInstance['backgroundHue']();

    expect(hueA).toBe(hueB);
  });

  it('can produce different hues for different names', () => {
    fixture.componentRef.setInput('name', 'Aaa');
    fixture.detectChanges();
    const hueA = fixture.componentInstance['backgroundHue']();

    const fixture2 = TestBed.createComponent(OrbitAvatarComponent);
    fixture2.componentRef.setInput('name', 'Zzz Qqq');
    fixture2.detectChanges();
    const hueB = fixture2.componentInstance['backgroundHue']();

    expect(hueA).not.toBe(hueB);
  });

  it('applies the size class', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.orbit-avatar')?.classList.contains('orbit-avatar--lg'),
    ).toBe(true);
  });
});
```

- [x] **Step 2: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: FAIL — `Cannot find module './avatar.component'` (file does not exist yet).

- [x] **Step 3: Implement `OrbitAvatarComponent`**

Create `projects/orbit/src/lib/components/avatar/avatar.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export type OrbitAvatarSize = 'sm' | 'md' | 'lg';

/** Fixed, well-spaced hue set — keeps `--orbit-text-inverse` legible over every generated background. */
const AVATAR_HUES: readonly number[] = [4, 32, 96, 152, 200, 232, 268, 320];

@Component({
  selector: 'orbit-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
  host: {
    '[style.--orbit-avatar-hue]': 'backgroundHue()',
  },
})
export class OrbitAvatarComponent {
  src = input<string | undefined>(undefined);
  /** Used both as the `<img>` alt text and to derive the initials fallback. */
  name = input.required<string>();
  size = input<OrbitAvatarSize>('md');

  protected readonly imageFailed = signal(false);

  protected readonly showImage = computed(() => !!this.src() && !this.imageFailed());
  protected readonly initials = computed(() => this.deriveInitials(this.name()));
  protected readonly backgroundHue = computed(() => this.hashToHue(this.name()));

  onImageError(): void {
    this.imageFailed.set(true);
  }

  private deriveInitials(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    const first = words[0].charAt(0);
    const last = words[words.length - 1].charAt(0);
    return (first + last).toUpperCase();
  }

  private hashToHue(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) | 0;
    }
    const index = Math.abs(hash) % AVATAR_HUES.length;
    return AVATAR_HUES[index];
  }
}
```

Create `projects/orbit/src/lib/components/avatar/avatar.component.html`:

```html
<span
  class="orbit-avatar"
  [class.orbit-avatar--sm]="size() === 'sm'"
  [class.orbit-avatar--md]="size() === 'md'"
  [class.orbit-avatar--lg]="size() === 'lg'"
>
  @if (showImage()) {
    <img class="orbit-avatar__image" [src]="src()" [alt]="name()" (error)="onImageError()" />
  } @else {
    <span class="orbit-avatar__initials" aria-hidden="true">{{ initials() }}</span>
  }
</span>
```

Create `projects/orbit/src/lib/components/avatar/avatar.component.css`:

```css
:host {
  display: inline-flex;
}

.orbit-avatar {
  position: relative;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  overflow: hidden;
  border-radius: var(--orbit-radius-full);
  background: hsl(var(--orbit-avatar-hue) 55% 42%);
  color: var(--orbit-text-inverse);
  font-family: var(--orbit-font-sans);
  font-weight: var(--orbit-font-weight-emphasis);
  line-height: 1;
  user-select: none;
}

.orbit-avatar--sm {
  width: calc(var(--orbit-control-height) * 0.75);
  height: calc(var(--orbit-control-height) * 0.75);
  font-size: var(--orbit-font-size-caption);
}

.orbit-avatar--md {
  width: var(--orbit-control-height);
  height: var(--orbit-control-height);
  font-size: var(--orbit-font-size-label);
}

.orbit-avatar--lg {
  width: calc(var(--orbit-control-height) * 1.5);
  height: calc(var(--orbit-control-height) * 1.5);
  font-size: var(--orbit-font-size-subtitle);
}

.orbit-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.orbit-avatar__initials {
  display: block;
}
```

Create `projects/orbit/src/lib/components/avatar/index.ts`:

```typescript
export { OrbitAvatarComponent } from './avatar.component';
export type { OrbitAvatarSize } from './avatar.component';
```

- [x] **Step 4: Register the barrel export**

In `projects/orbit/src/public-api.ts`, add a line after the `divider` export (alphabetical grouping is not strictly enforced in this file — follow the existing convention of appending near related display components, right after `export * from './lib/components/divider';` and before `export * from './lib/components/selectable-tile';`):

```typescript
export * from './lib/components/avatar';
```

- [x] **Step 5: Run the spec and verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: PASS — all `OrbitAvatarComponent` tests green, no regressions in other orbit specs.

---

## Task 2: `OrbitChipComponent`

**Files:**
- Create: `projects/orbit/src/lib/components/chip/chip.component.ts`
- Create: `projects/orbit/src/lib/components/chip/chip.component.html`
- Create: `projects/orbit/src/lib/components/chip/chip.component.css`
- Create: `projects/orbit/src/lib/components/chip/chip.component.spec.ts`
- Create: `projects/orbit/src/lib/components/chip/index.ts`
- Modify: `projects/orbit/src/lib/i18n/orbit-i18n.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Consumes: `OrbitIconComponent` (`../../icons/icon.component`, selector `orbit-icon`, `name` input of type `OrbitIconName`), `ORBIT_I18N` token (`../../i18n/orbit-i18n`).
- Produces: `OrbitChipComponent` (selector `orbit-chip`). Inputs: `selected = input(false, { transform: booleanAttribute })`, `removable = input(false, { transform: booleanAttribute })`, `disabled = input(false, { transform: booleanAttribute })`. Outputs: `selectedChange = output<boolean>()`, `removed = output<void>()`.

- [x] **Step 1: Add the two new i18n labels**

In `projects/orbit/src/lib/i18n/orbit-i18n.ts`, add `removeChip` to the `labels` interface, right after `segmentedControl: string;`:

```typescript
    segmentedControl: string;
    removeChip: string;
```

And add the Italian default in `DEFAULT_ORBIT_I18N`, in the same line group as `segmentedControl`:

```typescript
    uploadLabel: 'Trascina i file qui oppure clicca per sfogliare', uploadHint: 'PDF, JPG, PNG · max 10 MB',
```
becomes (insert `removeChip` right before it, in the `segmentedControl` line):
```typescript
    ..., segmentedControl: 'Selettore', removeChip: 'Rimuovi',
    uploadLabel: 'Trascina i file qui oppure clicca per sfogliare', uploadHint: 'PDF, JPG, PNG · max 10 MB',
```

(Use the Edit tool against the actual current line content — `segmentedControl: 'Selettore',` — appending `removeChip: 'Rimuovi',` immediately after it, on the same line, matching the file's existing single-line-per-group style.)

- [x] **Step 2: Write the failing spec**

Create `projects/orbit/src/lib/components/chip/chip.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitChipComponent } from './chip.component';

describe('OrbitChipComponent', () => {
  let fixture: ComponentFixture<OrbitChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitChipComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitChipComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('emits selectedChange(true) when clicked while unselected', () => {
    let emitted: boolean | undefined;
    fixture.componentInstance.selectedChange.subscribe((v) => (emitted = v));
    fixture.nativeElement.querySelector('.orbit-chip__body').click();
    expect(emitted).toBe(true);
  });

  it('emits selectedChange(false) when clicked while selected', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    let emitted: boolean | undefined;
    fixture.componentInstance.selectedChange.subscribe((v) => (emitted = v));
    fixture.nativeElement.querySelector('.orbit-chip__body').click();
    expect(emitted).toBe(false);
  });

  it('does not render a remove button when removable is false', () => {
    expect(fixture.nativeElement.querySelector('.orbit-chip__remove')).toBeNull();
  });

  it('emits removed without toggling selected when the remove button is clicked', () => {
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();
    let removedCalled = false;
    let selectedChangeCalled = false;
    fixture.componentInstance.removed.subscribe(() => (removedCalled = true));
    fixture.componentInstance.selectedChange.subscribe(() => (selectedChangeCalled = true));
    fixture.nativeElement.querySelector('.orbit-chip__remove').click();
    expect(removedCalled).toBe(true);
    expect(selectedChangeCalled).toBe(false);
  });

  it('does not emit selectedChange or removed when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();
    let anyEmitted = false;
    fixture.componentInstance.selectedChange.subscribe(() => (anyEmitted = true));
    fixture.componentInstance.removed.subscribe(() => (anyEmitted = true));
    fixture.nativeElement.querySelector('.orbit-chip__body').click();
    fixture.nativeElement.querySelector('.orbit-chip__remove').click();
    expect(anyEmitted).toBe(false);
  });

  it('disables both internal buttons when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector('.orbit-chip__body') as HTMLButtonElement;
    const remove = fixture.nativeElement.querySelector('.orbit-chip__remove') as HTMLButtonElement;
    expect(body.disabled).toBe(true);
    expect(remove.disabled).toBe(true);
  });

  it('reflects selected as aria-pressed on the body button', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector('.orbit-chip__body') as HTMLButtonElement;
    expect(body.getAttribute('aria-pressed')).toBe('true');
  });
});
```

- [x] **Step 3: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: FAIL — `Cannot find module './chip.component'`.

- [x] **Step 4: Implement `OrbitChipComponent`**

Create `projects/orbit/src/lib/components/chip/chip.component.ts`:

```typescript
import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

@Component({
  selector: 'orbit-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.css',
})
export class OrbitChipComponent {
  protected readonly i18n = inject(ORBIT_I18N);

  selected = input(false, { transform: booleanAttribute });
  removable = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });

  selectedChange = output<boolean>();
  removed = output<void>();

  toggle(): void {
    if (this.disabled()) return;
    this.selectedChange.emit(!this.selected());
  }

  remove(event: Event): void {
    event.stopPropagation();
    if (this.disabled()) return;
    this.removed.emit();
  }
}
```

Create `projects/orbit/src/lib/components/chip/chip.component.html`:

```html
<span class="orbit-chip" [class.orbit-chip--selected]="selected()" [class.orbit-chip--disabled]="disabled()">
  <button
    type="button"
    class="orbit-chip__body"
    [disabled]="disabled()"
    [attr.aria-pressed]="selected()"
    (click)="toggle()"
  >
    <ng-content />
  </button>
  @if (removable()) {
    <button
      type="button"
      class="orbit-chip__remove"
      [disabled]="disabled()"
      [attr.aria-label]="i18n.labels.removeChip"
      (click)="remove($event)"
    >
      <orbit-icon name="close" [size]="16" />
    </button>
  }
</span>
```

Create `projects/orbit/src/lib/components/chip/chip.component.css`:

```css
:host {
  display: inline-flex;
}

.orbit-chip {
  display: inline-flex;
  align-items: stretch;
  overflow: hidden;
  border: 1px solid var(--orbit-border-subtle);
  border-radius: var(--orbit-radius-full);
  background: var(--orbit-surface-raised);
  transition:
    border-color var(--orbit-motion-fast) var(--orbit-easing-standard),
    background-color var(--orbit-motion-fast) var(--orbit-easing-standard);
}

.orbit-chip--selected {
  border-color: var(--orbit-action-primary-bg);
  background: var(--orbit-action-primary-bg);
}

.orbit-chip--disabled {
  opacity: 0.55;
}

.orbit-chip__body {
  display: flex;
  align-items: center;
  height: calc(var(--orbit-control-height) * 0.75);
  padding: 0 var(--orbit-space-3);
  border: 0;
  background: transparent;
  color: var(--orbit-text-primary);
  font-family: var(--orbit-font-sans);
  font-size: var(--orbit-font-size-body);
  cursor: pointer;
}

.orbit-chip--selected .orbit-chip__body {
  color: var(--orbit-action-primary-fg);
}

.orbit-chip__body:disabled {
  cursor: not-allowed;
}

.orbit-chip__body:focus-visible {
  outline: 2px solid var(--orbit-action-primary-bg);
  outline-offset: -2px;
}

.orbit-chip__remove {
  display: grid;
  place-items: center;
  width: calc(var(--orbit-control-height) * 0.75);
  padding: 0;
  border: 0;
  border-left: 1px solid var(--orbit-border-subtle);
  background: transparent;
  color: var(--orbit-text-secondary);
  cursor: pointer;
}

.orbit-chip--selected .orbit-chip__remove {
  border-left-color: color-mix(in srgb, var(--orbit-action-primary-fg) 35%, transparent);
  color: var(--orbit-action-primary-fg);
}

.orbit-chip__remove:disabled {
  cursor: not-allowed;
}

.orbit-chip__remove:focus-visible {
  outline: 2px solid var(--orbit-action-primary-bg);
  outline-offset: -2px;
}
```

Create `projects/orbit/src/lib/components/chip/index.ts`:

```typescript
export { OrbitChipComponent } from './chip.component';
```

- [x] **Step 5: Register the barrel export**

In `projects/orbit/src/public-api.ts`, add right after `export * from './lib/components/badge';`:

```typescript
export * from './lib/components/chip';
```

- [x] **Step 6: Run the spec and verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: PASS — all `OrbitChipComponent` tests green, no regressions.

---

## Task 3: `OrbitBreadcrumbComponent`

**Files:**
- Create: `projects/orbit/src/lib/components/breadcrumb/breadcrumb.component.ts`
- Create: `projects/orbit/src/lib/components/breadcrumb/breadcrumb.component.html`
- Create: `projects/orbit/src/lib/components/breadcrumb/breadcrumb.component.css`
- Create: `projects/orbit/src/lib/components/breadcrumb/breadcrumb.component.spec.ts`
- Create: `projects/orbit/src/lib/components/breadcrumb/index.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Consumes: `Overlay`, `OverlayRef` (`@angular/cdk/overlay`), `TemplatePortal` (`@angular/cdk/portal`) — same imports as `select.component.ts:19-20`.
- Produces: `OrbitBreadcrumbComponent` (selector `orbit-breadcrumb`), `export interface OrbitBreadcrumbItem { id: string; label: string; href?: string; }`. Input: `items = input.required<OrbitBreadcrumbItem[]>()`. Output: `itemSelected = output<OrbitBreadcrumbItem>()`.

- [x] **Step 1: Write the failing spec**

Create `projects/orbit/src/lib/components/breadcrumb/breadcrumb.component.spec.ts`:

```typescript
import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OrbitBreadcrumbComponent, OrbitBreadcrumbItem } from './breadcrumb.component';

describe('OrbitBreadcrumbComponent', () => {
  let fixture: ComponentFixture<OrbitBreadcrumbComponent>;
  let overlayContainer: OverlayContainer;

  const SHORT_ITEMS: OrbitBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'section', label: 'Sezione', href: '/section' },
    { id: 'current', label: 'Pagina corrente' },
  ];

  const LONG_ITEMS: OrbitBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'a', label: 'A', href: '/a' },
    { id: 'b', label: 'B', href: '/a/b' },
    { id: 'c', label: 'C', href: '/a/b/c' },
    { id: 'd', label: 'D', href: '/a/b/c/d' },
    { id: 'current', label: 'Pagina corrente' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitBreadcrumbComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitBreadcrumbComponent);
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('creates', () => {
    fixture.componentRef.setInput('items', SHORT_ITEMS);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders nothing when items is empty', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('nav')).toBeNull();
  });

  it('does not collapse when at or below the threshold', () => {
    fixture.componentRef.setInput('items', SHORT_ITEMS);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.orbit-breadcrumb__ellipsis').length).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('.orbit-breadcrumb__item').length).toBe(3);
  });

  it('collapses the middle items above the threshold', () => {
    fixture.componentRef.setInput('items', LONG_ITEMS);
    fixture.detectChanges();
    const rendered = fixture.nativeElement.querySelectorAll('.orbit-breadcrumb__item');
    expect(rendered.length).toBe(3);
    expect(fixture.nativeElement.querySelector('.orbit-breadcrumb__ellipsis')).toBeTruthy();
    expect(rendered[0].textContent).toContain('Home');
    expect(rendered[2].textContent).toContain('Pagina corrente');
  });

  it('renders the last item as a non-clickable current-page span', () => {
    fixture.componentRef.setInput('items', SHORT_ITEMS);
    fixture.detectChanges();
    const current = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(current.tagName).toBe('SPAN');
    expect(current.textContent.trim()).toBe('Pagina corrente');
  });

  it('emits itemSelected when a direct link is clicked', () => {
    fixture.componentRef.setInput('items', SHORT_ITEMS);
    fixture.detectChanges();
    let emitted: OrbitBreadcrumbItem | undefined;
    fixture.componentInstance.itemSelected.subscribe((item) => (emitted = item));
    fixture.nativeElement.querySelector('.orbit-breadcrumb__link').click();
    expect(emitted?.id).toBe('home');
  });

  it('opens a popover listing the hidden items when the ellipsis is clicked', () => {
    fixture.componentRef.setInput('items', LONG_ITEMS);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.orbit-breadcrumb__ellipsis').click();
    fixture.detectChanges();
    const popoverItems = overlayContainer
      .getContainerElement()
      .querySelectorAll('.orbit-breadcrumb__popover-item');
    expect(popoverItems.length).toBe(4);
    expect(popoverItems[0].textContent).toContain('A');
    expect(popoverItems[3].textContent).toContain('D');
  });

  it('emits itemSelected when a hidden item is chosen from the popover', () => {
    fixture.componentRef.setInput('items', LONG_ITEMS);
    fixture.detectChanges();
    let emitted: OrbitBreadcrumbItem | undefined;
    fixture.componentInstance.itemSelected.subscribe((item) => (emitted = item));
    fixture.nativeElement.querySelector('.orbit-breadcrumb__ellipsis').click();
    fixture.detectChanges();
    const popoverItem = overlayContainer
      .getContainerElement()
      .querySelector('.orbit-breadcrumb__popover-item') as HTMLElement;
    popoverItem.click();
    expect(emitted?.id).toBe('a');
  });
});
```

- [x] **Step 2: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: FAIL — `Cannot find module './breadcrumb.component'`.

- [x] **Step 3: Implement `OrbitBreadcrumbComponent`**

Create `projects/orbit/src/lib/components/breadcrumb/breadcrumb.component.ts`:

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

export interface OrbitBreadcrumbItem {
  id: string;
  label: string;
  /** Absent = current item, rendered as non-clickable text. */
  href?: string;
}

type OrbitBreadcrumbVisibleEntry =
  | { type: 'item'; item: OrbitBreadcrumbItem }
  | { type: 'ellipsis'; hiddenItems: OrbitBreadcrumbItem[] };

/** Above this item count, the middle items collapse behind a single "…" entry. */
const COLLAPSE_THRESHOLD = 4;

@Component({
  selector: 'orbit-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
})
export class OrbitBreadcrumbComponent implements OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);

  items = input.required<OrbitBreadcrumbItem[]>();
  itemSelected = output<OrbitBreadcrumbItem>();

  protected readonly visibleItems = computed(() => this.collapseMiddle(this.items()));
  protected readonly isPopoverOpen = signal(false);
  protected currentHiddenItems: readonly OrbitBreadcrumbItem[] = [];

  @ViewChild('hiddenItemsTemplate') private hiddenItemsTemplate!: TemplateRef<{
    $implicit: readonly OrbitBreadcrumbItem[];
  }>;

  private overlayRef: OverlayRef | null = null;
  private ellipsisTriggerElement: HTMLElement | null = null;

  entryTrackId(entry: OrbitBreadcrumbVisibleEntry): string {
    return entry.type === 'item' ? entry.item.id : 'ellipsis';
  }

  selectItem(item: OrbitBreadcrumbItem, event: Event): void {
    event.preventDefault();
    if (!item.href) return;
    this.itemSelected.emit(item);
  }

  toggleHiddenItemsPopover(hiddenItems: readonly OrbitBreadcrumbItem[], trigger: HTMLElement): void {
    if (this.isPopoverOpen()) {
      this.closeHiddenItemsPopover();
      return;
    }
    this.ellipsisTriggerElement = trigger;
    this.currentHiddenItems = hiddenItems;
    this.openHiddenItemsPopover();
  }

  selectHiddenItem(item: OrbitBreadcrumbItem): void {
    this.closeHiddenItemsPopover();
    this.itemSelected.emit(item);
  }

  ngOnDestroy(): void {
    this.closeHiddenItemsPopover();
  }

  private collapseMiddle(items: readonly OrbitBreadcrumbItem[]): OrbitBreadcrumbVisibleEntry[] {
    if (items.length === 0) return [];
    if (items.length <= COLLAPSE_THRESHOLD) {
      return items.map((item) => ({ type: 'item', item }) as const);
    }
    const first = items[0];
    const last = items[items.length - 1];
    const hiddenItems = items.slice(1, items.length - 1);
    return [
      { type: 'item', item: first },
      { type: 'ellipsis', hiddenItems },
      { type: 'item', item: last },
    ];
  }

  private openHiddenItemsPopover(): void {
    if (!this.ellipsisTriggerElement) return;
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.ellipsisTriggerElement)
      .withFlexibleDimensions(false)
      .withPush(false)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      panelClass: 'orbit-breadcrumb-popover-panel',
      hasBackdrop: true,
      backdropClass: 'orbit-breadcrumb-popover-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    this.overlayRef.backdropClick().subscribe(() => this.closeHiddenItemsPopover());

    const portal = new TemplatePortal(this.hiddenItemsTemplate, this.vcr, {
      $implicit: this.currentHiddenItems,
    });
    this.overlayRef.attach(portal);
    this.isPopoverOpen.set(true);
  }

  private closeHiddenItemsPopover(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.isPopoverOpen.set(false);
  }
}
```

Create `projects/orbit/src/lib/components/breadcrumb/breadcrumb.component.html`:

```html
@if (items().length > 0) {
  <nav class="orbit-breadcrumb" aria-label="breadcrumb">
    <ol class="orbit-breadcrumb__list">
      @for (entry of visibleItems(); track entryTrackId(entry); let last = $last) {
        <li class="orbit-breadcrumb__item">
          @if (entry.type === 'item') {
            @if (entry.item.href) {
              <a
                class="orbit-breadcrumb__link"
                [href]="entry.item.href"
                (click)="selectItem(entry.item, $event)"
              >{{ entry.item.label }}</a>
            } @else {
              <span class="orbit-breadcrumb__current" aria-current="page">{{ entry.item.label }}</span>
            }
          } @else {
            <button
              #ellipsisTrigger
              type="button"
              class="orbit-breadcrumb__ellipsis"
              aria-haspopup="true"
              [attr.aria-expanded]="isPopoverOpen()"
              (click)="toggleHiddenItemsPopover(entry.hiddenItems, ellipsisTrigger)"
            >…</button>
          }
          @if (!last) {
            <span class="orbit-breadcrumb__separator" aria-hidden="true">/</span>
          }
        </li>
      }
    </ol>
  </nav>
}

<ng-template #hiddenItemsTemplate let-hiddenItems>
  <ul class="orbit-breadcrumb__popover-list">
    @for (item of hiddenItems; track item.id) {
      <li>
        <button type="button" class="orbit-breadcrumb__popover-item" (click)="selectHiddenItem(item)">
          {{ item.label }}
        </button>
      </li>
    }
  </ul>
</ng-template>
```

Create `projects/orbit/src/lib/components/breadcrumb/breadcrumb.component.css`:

```css
:host {
  display: block;
}

.orbit-breadcrumb__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--orbit-font-sans);
  font-size: var(--orbit-font-size-body);
}

.orbit-breadcrumb__item {
  display: flex;
  align-items: center;
  gap: var(--orbit-space-2);
}

.orbit-breadcrumb__link {
  color: var(--orbit-text-secondary);
  text-decoration: none;
}

.orbit-breadcrumb__link:hover {
  color: var(--orbit-action-primary-bg);
  text-decoration: underline;
}

.orbit-breadcrumb__link:focus-visible {
  outline: 2px solid var(--orbit-action-primary-bg);
  outline-offset: 2px;
}

.orbit-breadcrumb__current {
  color: var(--orbit-text-primary);
  font-weight: var(--orbit-font-weight-emphasis);
}

.orbit-breadcrumb__ellipsis {
  padding: 0 var(--orbit-space-1);
  border: 0;
  background: transparent;
  color: var(--orbit-text-secondary);
  font: inherit;
  cursor: pointer;
}

.orbit-breadcrumb__ellipsis:hover {
  color: var(--orbit-action-primary-bg);
}

.orbit-breadcrumb__ellipsis:focus-visible {
  outline: 2px solid var(--orbit-action-primary-bg);
  outline-offset: 2px;
}

.orbit-breadcrumb__separator {
  color: var(--orbit-text-tertiary);
}

/* Rendered through a CDK connected overlay so it escapes any ancestor's overflow/stacking context. */
.orbit-breadcrumb__popover-list {
  display: grid;
  gap: var(--orbit-space-1);
  margin: 0;
  padding: var(--orbit-space-2);
  border: 1px solid var(--orbit-border-subtle);
  border-radius: var(--orbit-radius-control);
  background: var(--orbit-surface-floating);
  box-shadow: var(--orbit-shadow-floating);
  list-style: none;
}

.orbit-breadcrumb__popover-item {
  display: block;
  width: 100%;
  padding: var(--orbit-space-2) var(--orbit-space-3);
  border: 0;
  border-radius: var(--orbit-radius-sm);
  background: transparent;
  color: var(--orbit-text-primary);
  font-family: var(--orbit-font-sans);
  font-size: var(--orbit-font-size-body);
  text-align: left;
  cursor: pointer;
}

.orbit-breadcrumb__popover-item:hover {
  background: var(--orbit-surface-subtle);
}
```

Create `projects/orbit/src/lib/components/breadcrumb/index.ts`:

```typescript
export { OrbitBreadcrumbComponent } from './breadcrumb.component';
export type { OrbitBreadcrumbItem } from './breadcrumb.component';
```

- [x] **Step 4: Register the barrel export**

In `projects/orbit/src/public-api.ts`, add right after `export * from './lib/components/navbar';`:

```typescript
export * from './lib/components/breadcrumb';
```

- [x] **Step 5: Run the spec and verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: PASS — all `OrbitBreadcrumbComponent` tests green, no regressions.

---

## Task 4: `OrbitPaginationComponent`

**Files:**
- Create: `projects/orbit/src/lib/components/pagination/pagination.component.ts`
- Create: `projects/orbit/src/lib/components/pagination/pagination.component.html`
- Create: `projects/orbit/src/lib/components/pagination/pagination.component.css`
- Create: `projects/orbit/src/lib/components/pagination/pagination.component.spec.ts`
- Create: `projects/orbit/src/lib/components/pagination/index.ts`
- Modify: `projects/orbit/src/lib/i18n/orbit-i18n.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Consumes: `OrbitIconComponent` (`../../icons/icon.component`), `ORBIT_I18N` token.
- Produces: `OrbitPaginationComponent` (selector `orbit-pagination`). Inputs: `currentPage = input.required<number>()` (1-based), `totalPages = input.required<number>()`. Output: `pageChange = output<number>()`.

- [x] **Step 1: Add the two new i18n labels**

In `projects/orbit/src/lib/i18n/orbit-i18n.ts`, add to the `labels` interface (after the `removeChip: string;` line added in Task 2 — if Task 2 has not run yet in this session, add both `removeChip: string;` and these two lines together, since they land in the same interface block):

```typescript
    previousPage: string;
    nextPage: string;
```

And to `DEFAULT_ORBIT_I18N`, append to the same `segmentedControl`/`removeChip` line:

```typescript
segmentedControl: 'Selettore', removeChip: 'Rimuovi', previousPage: 'Pagina precedente', nextPage: 'Pagina successiva',
```

- [x] **Step 2: Write the failing spec**

Create `projects/orbit/src/lib/components/pagination/pagination.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitPaginationComponent } from './pagination.component';

describe('OrbitPaginationComponent', () => {
  let fixture: ComponentFixture<OrbitPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitPaginationComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitPaginationComponent);
  });

  function pageButtons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.orbit-pagination__page'));
  }

  it('creates', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows first, last, current and adjacent pages, collapsing the rest at the start', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const labels = pageButtons().map((b) => b.textContent?.trim());
    expect(labels).toEqual(['1', '2', '10']);
    expect(fixture.nativeElement.querySelectorAll('.orbit-pagination__ellipsis').length).toBe(1);
  });

  it('shows first, last, current and adjacent pages, collapsing both sides in the middle', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const labels = pageButtons().map((b) => b.textContent?.trim());
    expect(labels).toEqual(['1', '4', '5', '6', '10']);
    expect(fixture.nativeElement.querySelectorAll('.orbit-pagination__ellipsis').length).toBe(2);
  });

  it('shows first, last, current and adjacent pages, collapsing the rest at the end', () => {
    fixture.componentRef.setInput('currentPage', 10);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const labels = pageButtons().map((b) => b.textContent?.trim());
    expect(labels).toEqual(['1', '9', '10']);
    expect(fixture.nativeElement.querySelectorAll('.orbit-pagination__ellipsis').length).toBe(1);
  });

  it('renders no ellipsis when every page fits', () => {
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('totalPages', 4);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.orbit-pagination__ellipsis').length).toBe(0);
    expect(pageButtons().map((b) => b.textContent?.trim())).toEqual(['1', '2', '3', '4']);
  });

  it('disables the previous button on the first page', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const prev = fixture.nativeElement.querySelector('.orbit-pagination__prev') as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
  });

  it('disables the next button on the last page', () => {
    fixture.componentRef.setInput('currentPage', 10);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const next = fixture.nativeElement.querySelector('.orbit-pagination__next') as HTMLButtonElement;
    expect(next.disabled).toBe(true);
  });

  it('emits pageChange with the clicked page number', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    let emitted: number | undefined;
    fixture.componentInstance.pageChange.subscribe((page) => (emitted = page));
    pageButtons()[1].click();
    expect(emitted).toBe(4);
  });

  it('emits pageChange(currentPage - 1) when previous is clicked', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    let emitted: number | undefined;
    fixture.componentInstance.pageChange.subscribe((page) => (emitted = page));
    fixture.nativeElement.querySelector('.orbit-pagination__prev').click();
    expect(emitted).toBe(4);
  });

  it('emits pageChange(currentPage + 1) when next is clicked', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    let emitted: number | undefined;
    fixture.componentInstance.pageChange.subscribe((page) => (emitted = page));
    fixture.nativeElement.querySelector('.orbit-pagination__next').click();
    expect(emitted).toBe(6);
  });

  it('marks the current page with aria-current', () => {
    fixture.componentRef.setInput('currentPage', 5);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();
    const current = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(current.textContent.trim()).toBe('5');
  });
});
```

- [x] **Step 3: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: FAIL — `Cannot find module './pagination.component'`.

- [x] **Step 4: Implement `OrbitPaginationComponent`**

Create `projects/orbit/src/lib/components/pagination/pagination.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

type OrbitPaginationRangeItem = { type: 'page'; page: number } | { type: 'ellipsis'; id: string };

@Component({
  selector: 'orbit-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class OrbitPaginationComponent {
  protected readonly i18n = inject(ORBIT_I18N);

  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  protected readonly visiblePages = computed(() => this.computeRange(this.currentPage(), this.totalPages()));
  protected readonly isFirstPage = computed(() => this.currentPage() <= 1);
  protected readonly isLastPage = computed(() => this.currentPage() >= this.totalPages());

  rangeTrackId(entry: OrbitPaginationRangeItem): string {
    return entry.type === 'page' ? `page-${entry.page}` : entry.id;
  }

  goToPage(page: number): void {
    if (page === this.currentPage()) return;
    this.pageChange.emit(page);
  }

  goToPrevious(): void {
    if (this.isFirstPage()) return;
    this.pageChange.emit(this.currentPage() - 1);
  }

  goToNext(): void {
    if (this.isLastPage()) return;
    this.pageChange.emit(this.currentPage() + 1);
  }

  private computeRange(current: number, total: number): OrbitPaginationRangeItem[] {
    if (total <= 0) return [];
    const pages = new Set<number>();
    pages.add(1);
    pages.add(total);
    for (let page = current - 1; page <= current + 1; page++) {
      if (page >= 1 && page <= total) pages.add(page);
    }
    const sorted = [...pages].sort((a, b) => a - b);
    const result: OrbitPaginationRangeItem[] = [];
    let previous: number | null = null;
    for (const page of sorted) {
      if (previous !== null && page - previous > 1) {
        result.push({ type: 'ellipsis', id: `ellipsis-${previous}-${page}` });
      }
      result.push({ type: 'page', page });
      previous = page;
    }
    return result;
  }
}
```

Create `projects/orbit/src/lib/components/pagination/pagination.component.html`:

```html
<nav class="orbit-pagination" aria-label="pagination">
  <button
    type="button"
    class="orbit-pagination__prev"
    [disabled]="isFirstPage()"
    [attr.aria-label]="i18n.labels.previousPage"
    (click)="goToPrevious()"
  >
    <orbit-icon name="chevron-down" class="orbit-pagination__nav-icon orbit-pagination__nav-icon--prev" />
  </button>

  <ul class="orbit-pagination__list">
    @for (entry of visiblePages(); track rangeTrackId(entry)) {
      <li>
        @if (entry.type === 'page') {
          <button
            type="button"
            class="orbit-pagination__page"
            [class.orbit-pagination__page--current]="entry.page === currentPage()"
            [attr.aria-current]="entry.page === currentPage() ? 'page' : null"
            (click)="goToPage(entry.page)"
          >{{ entry.page }}</button>
        } @else {
          <span class="orbit-pagination__ellipsis" aria-hidden="true">…</span>
        }
      </li>
    }
  </ul>

  <button
    type="button"
    class="orbit-pagination__next"
    [disabled]="isLastPage()"
    [attr.aria-label]="i18n.labels.nextPage"
    (click)="goToNext()"
  >
    <orbit-icon name="chevron-down" class="orbit-pagination__nav-icon orbit-pagination__nav-icon--next" />
  </button>
</nav>
```

Create `projects/orbit/src/lib/components/pagination/pagination.component.css`:

```css
:host {
  display: block;
}

.orbit-pagination {
  display: flex;
  align-items: center;
  gap: var(--orbit-space-2);
  font-family: var(--orbit-font-sans);
}

.orbit-pagination__list {
  display: flex;
  align-items: center;
  gap: var(--orbit-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.orbit-pagination__prev,
.orbit-pagination__next {
  display: grid;
  place-items: center;
  width: var(--orbit-control-height);
  height: var(--orbit-control-height);
  padding: 0;
  border: 1px solid var(--orbit-border-subtle);
  border-radius: var(--orbit-radius-control);
  background: var(--orbit-surface-raised);
  color: var(--orbit-text-secondary);
  cursor: pointer;
}

.orbit-pagination__prev:hover:not(:disabled),
.orbit-pagination__next:hover:not(:disabled) {
  border-color: var(--orbit-border-strong);
  color: var(--orbit-text-primary);
}

.orbit-pagination__prev:disabled,
.orbit-pagination__next:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.orbit-pagination__prev:focus-visible,
.orbit-pagination__next:focus-visible,
.orbit-pagination__page:focus-visible {
  outline: 2px solid var(--orbit-action-primary-bg);
  outline-offset: 2px;
}

/* Same rotation technique as the sidebar collapse toggle (sidebar.component.css). */
.orbit-pagination__nav-icon--prev {
  transform: rotate(90deg);
}

.orbit-pagination__nav-icon--next {
  transform: rotate(-90deg);
}

.orbit-pagination__page {
  display: grid;
  place-items: center;
  min-width: var(--orbit-control-height);
  height: var(--orbit-control-height);
  padding: 0 var(--orbit-space-2);
  border: 1px solid transparent;
  border-radius: var(--orbit-radius-control);
  background: transparent;
  color: var(--orbit-text-primary);
  font: inherit;
  font-size: var(--orbit-font-size-body);
  cursor: pointer;
}

.orbit-pagination__page:hover:not(.orbit-pagination__page--current) {
  background: var(--orbit-surface-subtle);
}

.orbit-pagination__page--current {
  border-color: var(--orbit-action-primary-bg);
  background: var(--orbit-action-primary-bg);
  color: var(--orbit-action-primary-fg);
  font-weight: var(--orbit-font-weight-emphasis);
}

.orbit-pagination__ellipsis {
  display: grid;
  place-items: center;
  min-width: var(--orbit-control-height);
  height: var(--orbit-control-height);
  color: var(--orbit-text-tertiary);
}
```

Create `projects/orbit/src/lib/components/pagination/index.ts`:

```typescript
export { OrbitPaginationComponent } from './pagination.component';
```

- [x] **Step 5: Register the barrel export**

In `projects/orbit/src/public-api.ts`, add right after `export * from './lib/components/table-row';`:

```typescript
export * from './lib/components/pagination';
```

- [x] **Step 6: Run the spec and verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: PASS — all `OrbitPaginationComponent` tests green, no regressions.

---

## Task 5: `OrbitAccordionComponent` + `OrbitAccordionItemComponent`

**Files:**
- Create: `projects/orbit/src/lib/components/accordion/accordion-token.ts`
- Create: `projects/orbit/src/lib/components/accordion/accordion-item.component.ts`
- Create: `projects/orbit/src/lib/components/accordion/accordion-item.component.html`
- Create: `projects/orbit/src/lib/components/accordion/accordion-item.component.css`
- Create: `projects/orbit/src/lib/components/accordion/accordion-item.component.spec.ts`
- Create: `projects/orbit/src/lib/components/accordion/accordion.component.ts`
- Create: `projects/orbit/src/lib/components/accordion/accordion.component.html`
- Create: `projects/orbit/src/lib/components/accordion/accordion.component.css`
- Create: `projects/orbit/src/lib/components/accordion/accordion.component.spec.ts`
- Create: `projects/orbit/src/lib/components/accordion/index.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Consumes: `OrbitIconComponent` (`../../icons/icon.component`).
- Produces: `OrbitAccordionComponent` (selector `orbit-accordion`, input `multi = input(false, { transform: booleanAttribute })`) and `OrbitAccordionItemComponent` (selector `orbit-accordion-item`, inputs `header = input.required<string>()`, `expanded = input(false, { transform: booleanAttribute })`, `disabled = input(false, { transform: booleanAttribute })`, output `expandedChange = output<boolean>()`, public method `collapse(): void`).

- [x] **Step 1: Create the shared controller token (avoids a circular import — see spec-resolution note 2)**

Create `projects/orbit/src/lib/components/accordion/accordion-token.ts`:

```typescript
import { InjectionToken } from '@angular/core';

/**
 * Minimal surface an accordion item needs from its parent accordion.
 * Kept in its own file so `accordion-item.component.ts` never imports
 * `accordion.component.ts` directly — `accordion.component.ts` needs a
 * value-level import of the item (for `contentChildren`), so the reverse
 * import would form a circular module dependency.
 */
export interface OrbitAccordionItemHandle {
  collapse(): void;
}

export interface OrbitAccordionController {
  isMulti(): boolean;
  notifyExpanded(item: OrbitAccordionItemHandle): void;
}

export const ORBIT_ACCORDION_CONTROLLER = new InjectionToken<OrbitAccordionController>(
  'ORBIT_ACCORDION_CONTROLLER',
);
```

- [x] **Step 2: Write the failing spec for the item component**

Create `projects/orbit/src/lib/components/accordion/accordion-item.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitAccordionItemComponent } from './accordion-item.component';

describe('OrbitAccordionItemComponent', () => {
  let fixture: ComponentFixture<OrbitAccordionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitAccordionItemComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitAccordionItemComponent);
    fixture.componentRef.setInput('header', 'Sezione 1');
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the header text', () => {
    expect(fixture.nativeElement.querySelector('.orbit-accordion-item__header-label').textContent.trim()).toBe(
      'Sezione 1',
    );
  });

  it('emits expandedChange(true) when the collapsed header is clicked', () => {
    let emitted: boolean | undefined;
    fixture.componentInstance.expandedChange.subscribe((v) => (emitted = v));
    fixture.nativeElement.querySelector('.orbit-accordion-item__header').click();
    expect(emitted).toBe(true);
  });

  it('emits expandedChange(false) when the expanded header is clicked', () => {
    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();
    let emitted: boolean | undefined;
    fixture.componentInstance.expandedChange.subscribe((v) => (emitted = v));
    fixture.nativeElement.querySelector('.orbit-accordion-item__header').click();
    expect(emitted).toBe(false);
  });

  it('does not emit expandedChange when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.expandedChange.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('.orbit-accordion-item__header').click();
    expect(emitted).toBe(false);
  });

  it('sets aria-expanded to match the expanded input', () => {
    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.orbit-accordion-item__header') as HTMLButtonElement;
    expect(header.getAttribute('aria-expanded')).toBe('true');
  });

  it('collapse() emits expandedChange(false) only when currently expanded', () => {
    let calls = 0;
    fixture.componentInstance.expandedChange.subscribe(() => calls++);
    fixture.componentInstance.collapse();
    expect(calls).toBe(0);

    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();
    fixture.componentInstance.collapse();
    expect(calls).toBe(1);
  });
});
```

- [x] **Step 3: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: FAIL — `Cannot find module './accordion-item.component'`.

- [x] **Step 4: Implement `OrbitAccordionItemComponent`**

Create `projects/orbit/src/lib/components/accordion/accordion-item.component.ts`:

```typescript
import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { OrbitIconComponent } from '../../icons/icon.component';
import { ORBIT_ACCORDION_CONTROLLER } from './accordion-token';

let nextOrbitAccordionItemId = 0;

@Component({
  selector: 'orbit-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitIconComponent],
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.css',
})
export class OrbitAccordionItemComponent {
  private readonly controller = inject(ORBIT_ACCORDION_CONTROLLER, { optional: true });
  protected readonly panelId = `orbit-accordion-panel-${++nextOrbitAccordionItemId}`;

  header = input.required<string>();
  expanded = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  expandedChange = output<boolean>();

  toggle(): void {
    if (this.disabled()) return;
    const next = !this.expanded();
    if (next) this.controller?.notifyExpanded(this);
    this.expandedChange.emit(next);
  }

  /** Invoked by the parent accordion when `multi()` is false and a sibling opened. */
  collapse(): void {
    if (this.expanded()) this.expandedChange.emit(false);
  }
}
```

Create `projects/orbit/src/lib/components/accordion/accordion-item.component.html`:

```html
<div class="orbit-accordion-item" [class.orbit-accordion-item--disabled]="disabled()">
  <h3 class="orbit-accordion-item__heading">
    <button
      type="button"
      class="orbit-accordion-item__header"
      [disabled]="disabled()"
      [attr.aria-expanded]="expanded()"
      [attr.aria-controls]="panelId"
      (click)="toggle()"
    >
      <span class="orbit-accordion-item__header-label">{{ header() }}</span>
      <orbit-icon
        name="chevron-down"
        class="orbit-accordion-item__indicator"
        [class.orbit-accordion-item__indicator--expanded]="expanded()"
        [class.orbit-accordion-item__indicator--collapsed]="!expanded()"
      />
    </button>
  </h3>
  <div
    class="orbit-accordion-item__panel"
    [class.orbit-accordion-item__panel--expanded]="expanded()"
    [id]="panelId"
    role="region"
  >
    <div class="orbit-accordion-item__panel-content">
      <ng-content />
    </div>
  </div>
</div>
```

Create `projects/orbit/src/lib/components/accordion/accordion-item.component.css`:

```css
:host {
  display: block;
  border-bottom: 1px solid var(--orbit-border-subtle);
}

:host:last-child {
  border-bottom: 0;
}

.orbit-accordion-item__heading {
  margin: 0;
}

.orbit-accordion-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--orbit-space-3) var(--orbit-space-2);
  border: 0;
  background: transparent;
  color: var(--orbit-text-primary);
  font: inherit;
  font-family: var(--orbit-font-sans);
  font-size: var(--orbit-font-size-body);
  font-weight: var(--orbit-font-weight-emphasis);
  text-align: left;
  cursor: pointer;
}

.orbit-accordion-item--disabled .orbit-accordion-item__header {
  color: var(--orbit-text-secondary);
  cursor: not-allowed;
}

.orbit-accordion-item__header:focus-visible {
  outline: 2px solid var(--orbit-action-primary-bg);
  outline-offset: -2px;
}

.orbit-accordion-item__indicator {
  flex: 0 0 auto;
  transition: transform var(--orbit-motion-fast) var(--orbit-easing-shared);
}

/* Same rotation technique as the sidebar collapse toggle (sidebar.component.css). */
.orbit-accordion-item__indicator--collapsed {
  transform: rotate(-90deg);
}

.orbit-accordion-item__indicator--expanded {
  transform: rotate(0deg);
}

.orbit-accordion-item__panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--orbit-motion-base) var(--orbit-easing-shared);
}

.orbit-accordion-item__panel--expanded {
  max-height: 640px;
}

.orbit-accordion-item__panel-content {
  padding: 0 var(--orbit-space-2) var(--orbit-space-3);
  color: var(--orbit-text-primary);
  font-family: var(--orbit-font-sans);
  font-size: var(--orbit-font-size-body);
}
```

- [x] **Step 5: Run the item spec and verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: PASS — all `OrbitAccordionItemComponent` tests green (the `collapse()`/controller-notify path is exercised indirectly here; full multi/single-open coordination is covered by the container spec next).

- [x] **Step 6: Write the failing spec for the container component**

Create `projects/orbit/src/lib/components/accordion/accordion.component.spec.ts`:

```typescript
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitAccordionComponent } from './accordion.component';
import { OrbitAccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'orbit-accordion-test-host',
  standalone: true,
  imports: [OrbitAccordionComponent, OrbitAccordionItemComponent],
  template: `
    <orbit-accordion [multi]="multi">
      <orbit-accordion-item header="Uno" [expanded]="expandedA" (expandedChange)="expandedA = $event">
        Contenuto uno
      </orbit-accordion-item>
      <orbit-accordion-item header="Due" [expanded]="expandedB" (expandedChange)="expandedB = $event">
        Contenuto due
      </orbit-accordion-item>
      <orbit-accordion-item
        header="Tre"
        disabled
        [expanded]="expandedC"
        (expandedChange)="expandedC = $event"
      >
        Contenuto tre
      </orbit-accordion-item>
    </orbit-accordion>
  `,
})
class AccordionTestHostComponent {
  multi = false;
  expandedA = false;
  expandedB = false;
  expandedC = false;
}

describe('OrbitAccordionComponent', () => {
  let fixture: ComponentFixture<AccordionTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionTestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AccordionTestHostComponent);
    fixture.detectChanges();
  });

  function headers(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.orbit-accordion-item__header'));
  }

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('closes the previously open item when multi is false and another item opens', () => {
    headers()[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedA).toBe(true);
    expect(fixture.componentInstance.expandedB).toBe(false);

    headers()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedA).toBe(false);
    expect(fixture.componentInstance.expandedB).toBe(true);
  });

  it('allows every item to stay open independently when multi is true', () => {
    fixture.componentInstance.multi = true;
    fixture.detectChanges();

    headers()[0].click();
    fixture.detectChanges();
    headers()[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.expandedA).toBe(true);
    expect(fixture.componentInstance.expandedB).toBe(true);
  });

  it('does not open a disabled item', () => {
    headers()[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expandedC).toBe(false);
  });
});
```

- [x] **Step 7: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: FAIL — `Cannot find module './accordion.component'`.

- [x] **Step 8: Implement `OrbitAccordionComponent`**

Create `projects/orbit/src/lib/components/accordion/accordion.component.ts`:

```typescript
import { booleanAttribute, ChangeDetectionStrategy, Component, contentChildren, forwardRef, input } from '@angular/core';
import { OrbitAccordionItemComponent } from './accordion-item.component';
import {
  ORBIT_ACCORDION_CONTROLLER,
  type OrbitAccordionController,
  type OrbitAccordionItemHandle,
} from './accordion-token';

@Component({
  selector: 'orbit-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './accordion.component.css',
  host: {
    role: 'presentation',
  },
  providers: [
    { provide: ORBIT_ACCORDION_CONTROLLER, useExisting: forwardRef(() => OrbitAccordionComponent) },
  ],
})
export class OrbitAccordionComponent implements OrbitAccordionController {
  /** Default: only one panel open at a time. */
  multi = input(false, { transform: booleanAttribute });

  private readonly items = contentChildren(OrbitAccordionItemComponent);

  isMulti(): boolean {
    return this.multi();
  }

  notifyExpanded(openedItem: OrbitAccordionItemHandle): void {
    if (this.multi()) return;
    for (const item of this.items()) {
      if (item !== openedItem) item.collapse();
    }
  }
}
```

Create `projects/orbit/src/lib/components/accordion/accordion.component.css`:

```css
:host {
  display: block;
  border: 1px solid var(--orbit-border-subtle);
  border-radius: var(--orbit-radius-control);
  background: var(--orbit-surface-raised);
}
```

Create `projects/orbit/src/lib/components/accordion/index.ts`:

```typescript
export { OrbitAccordionComponent } from './accordion.component';
export { OrbitAccordionItemComponent } from './accordion-item.component';
```

- [x] **Step 9: Register the barrel export**

In `projects/orbit/src/public-api.ts`, add right after `export * from './lib/components/tablist';`:

```typescript
export * from './lib/components/accordion';
```

- [x] **Step 10: Run both specs and verify they pass**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: PASS — all `OrbitAccordionItemComponent` and `OrbitAccordionComponent` tests green, no regressions in the full orbit suite.

---

## Task 6: orbit-lab catalog pages, routes and entries

**Files:**
- Create: `projects/orbit-lab/src/app/pages/avatar-page/avatar-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/avatar-page/avatar-page.component.html`
- Create: `projects/orbit-lab/src/app/pages/avatar-page/avatar-page.component.spec.ts`
- Create: `projects/orbit-lab/src/app/pages/chip-page/chip-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/chip-page/chip-page.component.html`
- Create: `projects/orbit-lab/src/app/pages/chip-page/chip-page.component.spec.ts`
- Create: `projects/orbit-lab/src/app/pages/breadcrumb-page/breadcrumb-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/breadcrumb-page/breadcrumb-page.component.html`
- Create: `projects/orbit-lab/src/app/pages/breadcrumb-page/breadcrumb-page.component.spec.ts`
- Create: `projects/orbit-lab/src/app/pages/pagination-page/pagination-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/pagination-page/pagination-page.component.html`
- Create: `projects/orbit-lab/src/app/pages/pagination-page/pagination-page.component.spec.ts`
- Create: `projects/orbit-lab/src/app/pages/accordion-page/accordion-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/accordion-page/accordion-page.component.html`
- Create: `projects/orbit-lab/src/app/pages/accordion-page/accordion-page.component.spec.ts`
- Modify: `projects/orbit-lab/src/app/catalog/catalog.ts`
- Modify: `projects/orbit-lab/src/app/app.routes.ts`

**Interfaces:**
- Consumes: `OrbitAvatarComponent`, `OrbitChipComponent`, `OrbitBreadcrumbComponent`/`OrbitBreadcrumbItem`, `OrbitPaginationComponent`, `OrbitAccordionComponent`/`OrbitAccordionItemComponent` from `@galileo/orbit` (Tasks 1–5), `LabExampleComponent` (`projects/orbit-lab/src/app/catalog/example-panel.component.ts`, selector `lab-example`, `code` input).
- Produces: `AvatarPageComponent`, `ChipPageComponent`, `BreadcrumbPageComponent`, `PaginationPageComponent`, `AccordionPageComponent`; five new `CATALOG_ENTRIES` rows; five new lazy routes in `app.routes.ts`.

- [x] **Step 1: Write the failing spec for the Avatar page**

Create `projects/orbit-lab/src/app/pages/avatar-page/avatar-page.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AvatarPageComponent } from './avatar-page.component';

describe('AvatarPageComponent', () => {
  let fixture: ComponentFixture<AvatarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AvatarPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders an image avatar in the base example', () => {
    expect(fixture.nativeElement.querySelector('[data-example="base"] img')).toBeTruthy();
  });

  it('renders an initials fallback in the initials example', () => {
    const initials = fixture.nativeElement.querySelector('[data-example="initials"] .orbit-avatar__initials');
    expect(initials?.textContent?.trim()).toBe('MR');
  });

  it('renders all three sizes in the sizes example', () => {
    const avatars = fixture.nativeElement.querySelectorAll('[data-example="sizes"] .orbit-avatar');
    expect(avatars.length).toBe(3);
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain('<orbit-avatar');
  });
});
```

- [x] **Step 2: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: FAIL — `Cannot find module './avatar-page.component'`.

- [x] **Step 3: Implement the Avatar page**

Create `projects/orbit-lab/src/app/pages/avatar-page/avatar-page.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitAvatarComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-avatar-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitAvatarComponent, LabExampleComponent],
  templateUrl: './avatar-page.component.html',
})
export class AvatarPageComponent {
  protected readonly usageSnippet =
    '<orbit-avatar name="Mario Rossi" src="https://example.test/avatar.png" />';

  protected readonly initialsSnippet = '<orbit-avatar name="Mario Rossi" />';

  protected readonly sizesSnippet =
    '<orbit-avatar name="Mario Rossi" size="sm" />\n<orbit-avatar name="Mario Rossi" size="md" />\n<orbit-avatar name="Mario Rossi" size="lg" />';
}
```

Create `projects/orbit-lab/src/app/pages/avatar-page/avatar-page.component.html`:

```html
<article>
  <h1>Avatar</h1>
  <p>Cerchio identificativo di un utente: immagine se disponibile, iniziali derivate dal nome altrimenti.</p>

  <section>
    <h2>Esempio</h2>
    <lab-example [code]="usageSnippet">
      <div data-example="base">
        <orbit-avatar name="Mario Rossi" src="https://picsum.photos/seed/mario/80/80" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Fallback su iniziali</h2>
    <lab-example [code]="initialsSnippet">
      <div data-example="initials">
        <orbit-avatar name="Mario Rossi" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Dimensioni</h2>
    <lab-example [code]="sizesSnippet">
      <div data-example="sizes" style="display: flex; align-items: center; gap: 1rem;">
        <orbit-avatar name="Mario Rossi" size="sm" />
        <orbit-avatar name="Mario Rossi" size="md" />
        <orbit-avatar name="Mario Rossi" size="lg" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Accessibilità</h2>
    <ul>
      <li><code>name</code> imposta l'<code>alt</code> dell'immagine quando presente.</li>
      <li>Se l'immagine non carica (URL rotto o errore di rete), il componente mostra automaticamente le iniziali.</li>
      <li>Lo stesso <code>name</code> produce sempre lo stesso colore di sfondo per le iniziali, utile per riconoscere lo stesso utente in liste diverse.</li>
    </ul>
  </section>
</article>
```

- [x] **Step 4: Run the spec and verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: PASS for `AvatarPageComponent`.

- [x] **Step 5: Write the failing spec for the Chip page**

Create `projects/orbit-lab/src/app/pages/chip-page/chip-page.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ChipPageComponent } from './chip-page.component';

describe('ChipPageComponent', () => {
  let fixture: ComponentFixture<ChipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ChipPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('toggles selected in the selectable example', () => {
    const chipBody = fixture.nativeElement.querySelector('[data-example="selectable"] .orbit-chip__body');
    expect(fixture.componentInstance.selected).toBe(false);
    chipBody.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected).toBe(true);
  });

  it('removes an item from the removable example without toggling selection', () => {
    const initialCount = fixture.nativeElement.querySelectorAll('[data-example="removable"] orbit-chip').length;
    fixture.nativeElement.querySelector('[data-example="removable"] .orbit-chip__remove').click();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('[data-example="removable"] orbit-chip').length,
    ).toBe(initialCount - 1);
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain('<orbit-chip');
  });
});
```

- [x] **Step 6: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: FAIL — `Cannot find module './chip-page.component'`.

- [x] **Step 7: Implement the Chip page**

Create `projects/orbit-lab/src/app/pages/chip-page/chip-page.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitChipComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

interface ChipDemoTag {
  id: string;
  label: string;
}

@Component({
  selector: 'lab-chip-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitChipComponent, LabExampleComponent],
  templateUrl: './chip-page.component.html',
})
export class ChipPageComponent {
  protected selected = false;
  protected removableTags: ChipDemoTag[] = [
    { id: 'ui', label: 'UI' },
    { id: 'ux', label: 'UX' },
    { id: 'a11y', label: 'Accessibilità' },
  ];

  protected readonly usageSnippet =
    '<orbit-chip [selected]="selected" (selectedChange)="selected = $event">Frontend</orbit-chip>';

  protected readonly removableSnippet = '<orbit-chip removable (removed)="removeTag(tag)">{{ tag.label }}</orbit-chip>';

  protected readonly disabledSnippet = '<orbit-chip disabled removable>Archiviato</orbit-chip>';

  onSelectedChange(value: boolean): void {
    this.selected = value;
  }

  removeTag(tag: ChipDemoTag): void {
    this.removableTags = this.removableTags.filter((t) => t.id !== tag.id);
  }
}
```

Create `projects/orbit-lab/src/app/pages/chip-page/chip-page.component.html`:

```html
<article>
  <h1>Chip</h1>
  <p>Etichetta interattiva: selezionabile e/o rimovibile, sempre un elemento cliccabile (non un badge statico).</p>

  <section>
    <h2>Esempio</h2>
    <lab-example [code]="usageSnippet">
      <div data-example="selectable">
        <orbit-chip [selected]="selected" (selectedChange)="onSelectedChange($event)">Frontend</orbit-chip>
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Rimovibile</h2>
    <lab-example [code]="removableSnippet">
      <div data-example="removable" style="display: flex; gap: 0.5rem;">
        @for (tag of removableTags; track tag.id) {
          <orbit-chip removable (removed)="removeTag(tag)">{{ tag.label }}</orbit-chip>
        }
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Stati</h2>
    <lab-example [code]="disabledSnippet">
      <div data-example="disabled">
        <orbit-chip disabled removable>Archiviato</orbit-chip>
      </div>
    </lab-example>
  </section>
</article>
```

- [x] **Step 8: Run the spec and verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: PASS for `ChipPageComponent`.

- [x] **Step 9: Write the failing spec for the Breadcrumb page**

Create `projects/orbit-lab/src/app/pages/breadcrumb-page/breadcrumb-page.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BreadcrumbPageComponent } from './breadcrumb-page.component';

describe('BreadcrumbPageComponent', () => {
  let fixture: ComponentFixture<BreadcrumbPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BreadcrumbPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the short example without collapsing', () => {
    expect(
      fixture.nativeElement.querySelectorAll('[data-example="short"] .orbit-breadcrumb__item').length,
    ).toBe(3);
  });

  it('renders the long example collapsed', () => {
    expect(
      fixture.nativeElement.querySelector('[data-example="long"] .orbit-breadcrumb__ellipsis'),
    ).toBeTruthy();
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain('<orbit-breadcrumb');
  });
});
```

- [x] **Step 10: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: FAIL — `Cannot find module './breadcrumb-page.component'`.

- [x] **Step 11: Implement the Breadcrumb page**

Create `projects/orbit-lab/src/app/pages/breadcrumb-page/breadcrumb-page.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitBreadcrumbComponent, OrbitBreadcrumbItem } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-breadcrumb-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitBreadcrumbComponent, LabExampleComponent],
  templateUrl: './breadcrumb-page.component.html',
})
export class BreadcrumbPageComponent {
  protected readonly shortItems: OrbitBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'catalog', label: 'Catalogo', href: '/catalog' },
    { id: 'breadcrumb', label: 'Breadcrumb' },
  ];

  protected readonly longItems: OrbitBreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'clients', label: 'Clienti', href: '/clients' },
    { id: 'client', label: 'Rossi S.p.A.', href: '/clients/rossi' },
    { id: 'projects', label: 'Progetti', href: '/clients/rossi/projects' },
    { id: 'project', label: 'Migrazione ERP', href: '/clients/rossi/projects/erp' },
    { id: 'current', label: 'Dettaglio task' },
  ];

  protected lastSelectedLabel = '';

  protected readonly usageSnippet =
    '<orbit-breadcrumb [items]="items" (itemSelected)="onItemSelected($event)" />';

  onItemSelected(item: OrbitBreadcrumbItem): void {
    this.lastSelectedLabel = item.label;
  }
}
```

Create `projects/orbit-lab/src/app/pages/breadcrumb-page/breadcrumb-page.component.html`:

```html
<article>
  <h1>Breadcrumb</h1>
  <p>Traccia di navigazione gerarchica; oltre una certa lunghezza, gli elementi centrali collassano in un menu "…".</p>

  <section>
    <h2>Esempio</h2>
    <lab-example [code]="usageSnippet">
      <div data-example="short">
        <orbit-breadcrumb [items]="shortItems" (itemSelected)="onItemSelected($event)" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Collasso su percorsi lunghi</h2>
    <lab-example [code]="usageSnippet">
      <div data-example="long">
        <orbit-breadcrumb [items]="longItems" (itemSelected)="onItemSelected($event)" />
      </div>
      @if (lastSelectedLabel) {
        <p>Ultimo elemento selezionato: <strong>{{ lastSelectedLabel }}</strong></p>
      }
    </lab-example>
  </section>

  <section>
    <h2>Accessibilità</h2>
    <ul>
      <li>Struttura semantica <code>&lt;nav aria-label="breadcrumb"&gt;&lt;ol&gt;</code>.</li>
      <li>L'ultimo elemento (pagina corrente) è uno <code>&lt;span aria-current="page"&gt;</code>, non cliccabile.</li>
      <li>Il pulsante "…" apre un popover CDK Overlay con gli elementi nascosti.</li>
    </ul>
  </section>
</article>
```

- [x] **Step 12: Run the spec and verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: PASS for `BreadcrumbPageComponent`.

- [x] **Step 13: Write the failing spec for the Pagination page**

Create `projects/orbit-lab/src/app/pages/pagination-page/pagination-page.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { PaginationPageComponent } from './pagination-page.component';

describe('PaginationPageComponent', () => {
  let fixture: ComponentFixture<PaginationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(PaginationPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('advances the current page in the base example when next is clicked', () => {
    expect(fixture.componentInstance.currentPage).toBe(1);
    fixture.nativeElement.querySelector('[data-example="base"] .orbit-pagination__next').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.currentPage).toBe(2);
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain('<orbit-pagination');
  });
});
```

- [x] **Step 14: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: FAIL — `Cannot find module './pagination-page.component'`.

- [x] **Step 15: Implement the Pagination page**

Create `projects/orbit-lab/src/app/pages/pagination-page/pagination-page.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitPaginationComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-pagination-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitPaginationComponent, LabExampleComponent],
  templateUrl: './pagination-page.component.html',
})
export class PaginationPageComponent {
  protected currentPage = 1;
  protected readonly totalPages = 10;

  protected middlePage = 5;
  protected lastPage = 20;
  protected readonly manyPages = 20;

  protected readonly usageSnippet =
    '<orbit-pagination [currentPage]="currentPage" [totalPages]="totalPages" (pageChange)="currentPage = $event" />';

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onMiddlePageChange(page: number): void {
    this.middlePage = page;
  }

  onLastPageChange(page: number): void {
    this.lastPage = page;
  }
}
```

Create `projects/orbit-lab/src/app/pages/pagination-page/pagination-page.component.html`:

```html
<article>
  <h1>Pagination</h1>
  <p>Navigazione tra pagine numerate, con collasso decorativo delle pagine intermedie non adiacenti.</p>

  <section>
    <h2>Esempio</h2>
    <lab-example [code]="usageSnippet">
      <div data-example="base">
        <orbit-pagination [currentPage]="currentPage" [totalPages]="totalPages" (pageChange)="onPageChange($event)" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Pagina centrale</h2>
    <lab-example [code]="usageSnippet">
      <div data-example="middle">
        <orbit-pagination [currentPage]="middlePage" [totalPages]="manyPages" (pageChange)="onMiddlePageChange($event)" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Ultima pagina</h2>
    <lab-example [code]="usageSnippet">
      <div data-example="last">
        <orbit-pagination [currentPage]="lastPage" [totalPages]="manyPages" (pageChange)="onLastPageChange($event)" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Accessibilità</h2>
    <ul>
      <li>Struttura semantica <code>&lt;nav aria-label="pagination"&gt;</code>.</li>
      <li>La pagina corrente porta <code>aria-current="page"</code>.</li>
      <li>I pulsanti precedente/successivo si disabilitano automaticamente sui bordi dell'intervallo.</li>
    </ul>
  </section>
</article>
```

- [x] **Step 16: Run the spec and verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: PASS for `PaginationPageComponent`.

- [x] **Step 17: Write the failing spec for the Accordion page**

Create `projects/orbit-lab/src/app/pages/accordion-page/accordion-page.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AccordionPageComponent } from './accordion-page.component';

describe('AccordionPageComponent', () => {
  let fixture: ComponentFixture<AccordionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AccordionPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('closes the previously open panel in the single-open example', () => {
    const headers = fixture.nativeElement.querySelectorAll(
      '[data-example="single"] .orbit-accordion-item__header',
    );
    headers[0].click();
    fixture.detectChanges();
    headers[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.singleExpandedFirst).toBe(false);
    expect(fixture.componentInstance.singleExpandedSecond).toBe(true);
  });

  it('keeps every panel open independently in the multi example', () => {
    const headers = fixture.nativeElement.querySelectorAll(
      '[data-example="multi"] .orbit-accordion-item__header',
    );
    headers[0].click();
    fixture.detectChanges();
    headers[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.multiExpandedFirst).toBe(true);
    expect(fixture.componentInstance.multiExpandedSecond).toBe(true);
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain('<orbit-accordion');
  });
});
```

- [x] **Step 18: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: FAIL — `Cannot find module './accordion-page.component'`.

- [x] **Step 19: Implement the Accordion page**

Create `projects/orbit-lab/src/app/pages/accordion-page/accordion-page.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitAccordionComponent, OrbitAccordionItemComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-accordion-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitAccordionComponent, OrbitAccordionItemComponent, LabExampleComponent],
  templateUrl: './accordion-page.component.html',
})
export class AccordionPageComponent {
  protected singleExpandedFirst = true;
  protected singleExpandedSecond = false;

  protected multiExpandedFirst = true;
  protected multiExpandedSecond = false;

  protected readonly usageSnippet = `<orbit-accordion>
  <orbit-accordion-item header="Sezione 1" [expanded]="expandedA" (expandedChange)="expandedA = $event">
    Contenuto della sezione 1
  </orbit-accordion-item>
  <orbit-accordion-item header="Sezione 2" [expanded]="expandedB" (expandedChange)="expandedB = $event">
    Contenuto della sezione 2
  </orbit-accordion-item>
</orbit-accordion>`;

  protected readonly multiSnippet = '<orbit-accordion multi>...</orbit-accordion>';

  protected readonly disabledSnippet =
    '<orbit-accordion-item header="Non disponibile" disabled>...</orbit-accordion-item>';
}
```

Create `projects/orbit-lab/src/app/pages/accordion-page/accordion-page.component.html`:

```html
<article>
  <h1>Accordion</h1>
  <p>Pannelli espandibili impilati; per default solo uno aperto alla volta, con <code>multi</code> tutti indipendenti.</p>

  <section>
    <h2>Esempio (un solo pannello aperto)</h2>
    <lab-example [code]="usageSnippet">
      <div data-example="single">
        <orbit-accordion>
          <orbit-accordion-item
            header="Sezione 1"
            [expanded]="singleExpandedFirst"
            (expandedChange)="singleExpandedFirst = $event"
          >
            Contenuto della sezione 1.
          </orbit-accordion-item>
          <orbit-accordion-item
            header="Sezione 2"
            [expanded]="singleExpandedSecond"
            (expandedChange)="singleExpandedSecond = $event"
          >
            Contenuto della sezione 2.
          </orbit-accordion-item>
          <orbit-accordion-item header="Sezione non disponibile" disabled>
            Contenuto non raggiungibile.
          </orbit-accordion-item>
        </orbit-accordion>
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Pannelli multipli aperti</h2>
    <lab-example [code]="multiSnippet">
      <div data-example="multi">
        <orbit-accordion multi>
          <orbit-accordion-item
            header="Sezione 1"
            [expanded]="multiExpandedFirst"
            (expandedChange)="multiExpandedFirst = $event"
          >
            Contenuto della sezione 1.
          </orbit-accordion-item>
          <orbit-accordion-item
            header="Sezione 2"
            [expanded]="multiExpandedSecond"
            (expandedChange)="multiExpandedSecond = $event"
          >
            Contenuto della sezione 2.
          </orbit-accordion-item>
        </orbit-accordion>
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Stati</h2>
    <lab-example [code]="disabledSnippet">
      <div data-example="disabled">
        <orbit-accordion>
          <orbit-accordion-item header="Sezione non disponibile" disabled>
            Contenuto non raggiungibile.
          </orbit-accordion-item>
        </orbit-accordion>
      </div>
    </lab-example>
  </section>
</article>
```

- [x] **Step 20: Run the spec and verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: PASS for `AccordionPageComponent`.

- [x] **Step 21: Register the five catalog entries**

In `projects/orbit-lab/src/app/catalog/catalog.ts`, add five new rows to `CATALOG_ENTRIES`, keeping the existing alphabetical-by-label ordering (insert each in its correct alphabetical slot):

```typescript
export const CATALOG_ENTRIES: CatalogEntry[] = [
  { slug: 'accordion', label: 'Accordion', status: 'verified', icon: 'layers' },
  { slug: 'attachments', label: 'Allegati', status: 'verified', icon: 'paperclip' },
  { slug: 'motion', label: 'Animazioni', status: 'verified', icon: 'retry' },
  { slug: 'avatar', label: 'Avatar', status: 'verified', icon: 'user' },
  { slug: 'navbar', label: 'Barra di navigazione', status: 'verified', icon: 'menu' },
  { slug: 'badge', label: 'Badge', status: 'verified', icon: 'tag' },
  { slug: 'breadcrumb', label: 'Breadcrumb', status: 'verified', icon: 'chevron-down' },
  { slug: 'form-field', label: 'Campi modulo', status: 'verified', icon: 'document' },
  { slug: 'checkbox', label: 'Caselle di controllo', status: 'verified', icon: 'check' },
  { slug: 'chip', label: 'Chip', status: 'verified', icon: 'tag' },
  { slug: 'dialog', label: 'Dialoghi', status: 'verified', icon: 'window' },
  { slug: 'examples', label: 'Esempi', status: 'verified', icon: 'window' },
  { slug: 'layout', label: 'Layout', status: 'verified', icon: 'grid' },
  { slug: 'text-input', label: 'Input di testo', status: 'verified', icon: 'document' },
  { slug: 'pagination', label: 'Paginazione', status: 'verified', icon: 'grid' },
  { slug: 'panel', label: 'Panel', status: 'verified', icon: 'window' },
  { slug: 'patterns', label: 'Pattern e governance', status: 'verified', icon: 'layers' },
  { slug: 'popover', label: 'Popover', status: 'verified', icon: 'message-circle' },
  { slug: 'button', label: 'Pulsanti', status: 'verified', icon: 'square' },
  { slug: 'pill-switch', label: 'Selettore a pillola', status: 'verified', icon: 'toggle' },
  { slug: 'pickers', label: 'Selettori', status: 'verified', icon: 'calendar' },
  { slug: 'select', label: 'Selezione', status: 'verified', icon: 'chevron-down' },
  { slug: 'form-section', label: 'Sezioni modulo', status: 'verified', icon: 'layers' },
  { slug: 'slider', label: 'Slider', status: 'verified', icon: 'slider' },
  { slug: 'tooltip', label: 'Suggerimenti', status: 'verified', icon: 'message-circle' },
  { slug: 'tab', label: 'Tab', status: 'verified', icon: 'layers' },
  { slug: 'table', label: 'Table', status: 'verified', icon: 'grid' },
  { slug: 'themes', label: 'Temi e superfici', status: 'verified', icon: 'settings' },
  { slug: 'typography', label: 'Tipografia', status: 'verified', icon: 'document' },
];
```

- [x] **Step 22: Register the five lazy routes**

In `projects/orbit-lab/src/app/app.routes.ts`, add five new route entries. Insert right after the `badge` route:

```typescript
  {
    path: 'avatar',
    loadComponent: () =>
      import('./pages/avatar-page/avatar-page.component').then((m) => m.AvatarPageComponent),
  },
  {
    path: 'chip',
    loadComponent: () =>
      import('./pages/chip-page/chip-page.component').then((m) => m.ChipPageComponent),
  },
  {
    path: 'breadcrumb',
    loadComponent: () =>
      import('./pages/breadcrumb-page/breadcrumb-page.component').then(
        (m) => m.BreadcrumbPageComponent,
      ),
  },
  {
    path: 'pagination',
    loadComponent: () =>
      import('./pages/pagination-page/pagination-page.component').then(
        (m) => m.PaginationPageComponent,
      ),
  },
  {
    path: 'accordion',
    loadComponent: () =>
      import('./pages/accordion-page/accordion-page.component').then(
        (m) => m.AccordionPageComponent,
      ),
  },
```

- [x] **Step 23: Run the full orbit-lab test suite (excluding the unrelated in-progress page) and verify everything passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: PASS — every page spec (including the five new ones), `catalog.spec.ts`, and every other pre-existing orbit-lab spec green, with zero changes made under `projects/orbit-lab/src/app/pages/examples-page/`.

- [x] **Step 24: Run the full orbit library test suite one more time to confirm no cross-task regressions**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: PASS — all specs across all five new Orbit components plus every pre-existing Orbit component spec green.

---

## Final self-review checklist (perform after all six tasks are complete)

- [x] Every spec section of `docs/superpowers/specs/2026-07-22-data-display-minor-design.md` maps to at least one task: Avatar → Task 1; Chip → Task 2; Breadcrumb → Task 3; Pagination → Task 4; Accordion → Task 5; Testing/Catalog sections → Tasks 1–6 collectively (component specs) and Task 6 (catalog pages/routes/entries).
- [x] No task contains "TBD", "add appropriate tests", or any other placeholder — confirm by re-reading each task's code blocks.
- [x] Type/method names are consistent end-to-end: `OrbitBreadcrumbItem` used identically in `breadcrumb.component.ts` and `breadcrumb-page.component.ts`; `OrbitAccordionItemHandle`/`OrbitAccordionController` used identically in `accordion-token.ts`, `accordion.component.ts`, and implicitly satisfied by `OrbitAccordionItemComponent.collapse()`; `OrbitPaginationComponent.pageChange`/`currentPage`/`totalPages` used identically in `pagination.component.ts` and `pagination-page.component.ts`.
- [x] Every new component is OnPush, standalone (implicit in Angular 22), and re-exported from `projects/orbit/src/public-api.ts`.
- [x] The two spec-vs-instruction conflicts (Breadcrumb popover mechanism, Chip's `<button>`-in-`<button>` impossibility) are documented in "Spec-resolution notes" above and resolved consistently in Tasks 2 and 3.
- [x] No task instructs running any git command.
