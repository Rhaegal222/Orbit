# Progress Bar e Spinner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two reusable, display-only Orbit components — `OrbitProgressBarComponent` (determinate + indeterminate progress) and `OrbitSpinnerComponent` (3-size loading spinner) — plus their orbit-lab catalog demo pages, per the approved spec at `docs/superpowers/specs/2026-07-22-progress-spinner-design.md`.

**Architecture:** Two new standalone, `OnPush`, pure-render components in `projects/orbit/src/lib/components/` (no service, no `ControlValueAccessor` — they are not form controls). Each consumes state only via `input()`. Both reuse the existing `.orbit-btn__spinner` rotation technique (`border` + `border-right-color: transparent` + `@keyframes … { to { transform: rotate(360deg) } }`) as their own scoped keyframes — `OrbitButtonComponent` itself is **not** touched or refactored, per spec's explicit "out of scope" note. Two new lazy-loaded pages are added to `orbit-lab` following the exact `slider-page` pattern (component + template + spec, `CATALOG_ENTRIES` entry, `app.routes.ts` route).

**Tech Stack:** Angular 22, standalone components, signals (`input`, `computed`), Vitest + `@angular/core/testing`, no CVA/forms involvement in the new library components (orbit-lab demo pages do use `ReactiveFormsModule` + `toSignal` to drive the live example, matching existing repo precedent).

## Global Constraints

- Do NOT run any git commands (no commits, no branch changes) — only write/edit files.
- Match existing conventions exactly: `ChangeDetectionStrategy.OnPush`, `input()`/`computed()` signals, `templateUrl`/`styleUrl` (not inline template/styles), one component per directory with an `index.ts` barrel.
- `OrbitButtonComponent` and its `.orbit-btn__spinner` CSS are read-only reference material in this plan — never edit `projects/orbit/src/lib/components/button/*`.
- Every new library component file must be exported from `projects/orbit/src/public-api.ts`.
- Node/npm are managed via `nvm`, not on `PATH`. Every shell command that runs `npm`/`ng`/`npx` MUST be prefixed with:
  `source ~/.nvm/nvm.sh && nvm use v24.16.0 &&`
- Test commands:
  - `orbit` library: `npm run test:core -- --watch=false`
  - `orbit-lab` app: `npm run test -- --watch=false`, or to isolate from the unrelated in-progress `examples-page` directory (do not move/delete it — it belongs to other work): `npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
- Known pre-existing, unrelated failure: `projects/orbit-lab/src/app/catalog/catalog.spec.ts`'s `'lists every entry in alphabetical label order'` test already fails on `main` before this plan touches anything (two pre-existing label-order swaps: `Badge`/`Barra di navigazione` and `Layout`/`Input di testo`). This plan inserts its two new entries in their own correct alphabetical position and does not fix the pre-existing swaps — do not attempt to "fix" that failure as part of this work; it is out of scope.

---

## Spec-gap resolutions (decided during planning, not left open)

1. **Progress-bar icon.** The spec explicitly flags no ideal icon exists and floats `bar-chart`/`activity` as options to "evaluate during implementation." Resolved: add a new `'bar-chart'` entry to `ORBIT_ICON_PATHS`/`OrbitIconName` in `projects/orbit/src/lib/icons/icon-registry.ts` (three ascending rectangles, styled like the existing `grid` icon's straight-rect path convention). Reusing `window` (already used by `dialog`/`examples`/`panel`) would be visually ambiguous in the catalog nav; a dedicated bar-chart glyph is a small, contained addition matching the registry's existing style.
2. **Spinner default aria-label copy.** The spec suggests the default label `"Caricamento"`, localized via the `ORBIT_I18N` pattern. The `ORBIT_I18N` registry (`projects/orbit/src/lib/i18n/orbit-i18n.ts`) already has a `labels.loading` key with value `'Operazione in corso'` (used elsewhere for the same "operation in progress" concept). Resolved: reuse `labels.loading` via `inject(ORBIT_I18N)` instead of adding a duplicate key — DRY, and consistent with how `OrbitSidebarComponent` consumes `ORBIT_I18N`. The rendered default label is therefore `"Operazione in corso"`, not the spec's placeholder `"Caricamento"`.
3. **Indeterminate progress-bar animation technique.** The spec says "same technique as `@keyframes orbit-sidebar-toggle-enter`, adapted." That keyframe animates an `opacity`/`transform` entrance, not a horizontal sweep. Resolved: use a translateX sweep keyframe (`orbit-progress-bar-sweep`) on the fill element sized to a fixed 40% width — the same *category* of technique (CSS `@keyframes` + `transform`, `infinite` loop) but shaped for a progress sweep rather than an enter/exit transition, since no existing sweep animation exists to copy verbatim.
4. **Keyframe naming.** To avoid relying on undocumented behavior of Angular's emulated view encapsulation with global `@keyframes` names, the two new components use distinct keyframe names (`orbit-spinner-spin`, `orbit-progress-bar-sweep`) rather than reusing the literal `orbit-spin` name already defined in `button.component.css`.
5. **Live-updating catalog example.** Spec's testing section says "slider di controllo che aggiorna value live." Resolved: the progress-bar page drives its determinate example with an `orbit-slider` bound through a `FormControl` + `toSignal(control.valueChanges, …)` — the same `toSignal` pattern already used in `projects/orbit-lab/src/app/shell/lab-shell.component.ts` — rather than a timer/interval, since a control that the visitor can drag is a stronger manual-test tool than an auto-incrementing bar and matches the spec's literal wording.

---

### Task 1: `OrbitProgressBarComponent`

**Files:**
- Create: `projects/orbit/src/lib/components/progress-bar/progress-bar.component.ts`
- Create: `projects/orbit/src/lib/components/progress-bar/progress-bar.component.html`
- Create: `projects/orbit/src/lib/components/progress-bar/progress-bar.component.css`
- Create: `projects/orbit/src/lib/components/progress-bar/progress-bar.component.spec.ts`
- Create: `projects/orbit/src/lib/components/progress-bar/index.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Produces: `OrbitProgressBarComponent` with selector `orbit-progress-bar`, inputs `value = input<number | undefined>(undefined)` (0–100, `undefined`/`NaN` ⇒ indeterminate) and `ariaLabel = input<string | undefined>(undefined)`. No outputs.

- [ ] **Step 1: Write the failing spec**

Create `projects/orbit/src/lib/components/progress-bar/progress-bar.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitProgressBarComponent } from './progress-bar.component';

describe('OrbitProgressBarComponent', () => {
  let fixture: ComponentFixture<OrbitProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitProgressBarComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitProgressBarComponent);
  });

  function bar(): HTMLElement {
    return fixture.nativeElement.querySelector('.orbit-progress-bar') as HTMLElement;
  }

  function fill(): HTMLElement {
    return fixture.nativeElement.querySelector('.orbit-progress-bar__fill') as HTMLElement;
  }

  it('defaults to indeterminate when value is not set', () => {
    fixture.detectChanges();

    expect(bar().classList.contains('orbit-progress-bar--indeterminate')).toBe(true);
    expect(bar().getAttribute('aria-valuenow')).toBeNull();
    expect(fill().style.width).toBe('');
  });

  it('renders a determinate bar with width and aria-valuenow matching the value', () => {
    fixture.componentRef.setInput('value', 45);
    fixture.detectChanges();

    expect(bar().classList.contains('orbit-progress-bar--indeterminate')).toBe(false);
    expect(bar().getAttribute('aria-valuenow')).toBe('45');
    expect(fill().style.width).toBe('45%');
  });

  it('clamps a value above 100 down to 100', () => {
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();

    expect(bar().getAttribute('aria-valuenow')).toBe('100');
    expect(fill().style.width).toBe('100%');
  });

  it('clamps a negative value up to 0', () => {
    fixture.componentRef.setInput('value', -20);
    fixture.detectChanges();

    expect(bar().getAttribute('aria-valuenow')).toBe('0');
    expect(fill().style.width).toBe('0%');
  });

  it('treats NaN as indeterminate instead of rendering width:NaN%', () => {
    fixture.componentRef.setInput('value', NaN);
    fixture.detectChanges();

    expect(bar().classList.contains('orbit-progress-bar--indeterminate')).toBe(true);
    expect(bar().getAttribute('aria-valuenow')).toBeNull();
    expect(fill().style.width).toBe('');
  });

  it('always exposes role=progressbar with min/max bounds of 0 and 100', () => {
    fixture.detectChanges();

    expect(bar().getAttribute('role')).toBe('progressbar');
    expect(bar().getAttribute('aria-valuemin')).toBe('0');
    expect(bar().getAttribute('aria-valuemax')).toBe('100');
  });

  it('applies the given ariaLabel, and omits the attribute when unset', () => {
    fixture.detectChanges();
    expect(bar().hasAttribute('aria-label')).toBe(false);

    fixture.componentRef.setInput('ariaLabel', 'Caricamento allegato');
    fixture.detectChanges();
    expect(bar().getAttribute('aria-label')).toBe('Caricamento allegato');
  });
});
```

- [ ] **Step 2: Run the spec to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx vitest run projects/orbit/src/lib/components/progress-bar/progress-bar.component.spec.ts`
Expected: FAIL — cannot resolve `./progress-bar.component` (module not found).

- [ ] **Step 3: Create the component class**

Create `projects/orbit/src/lib/components/progress-bar/progress-bar.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'orbit-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
})
export class OrbitProgressBarComponent {
  /** 0-100; `undefined` (or a non-finite number) renders an indeterminate bar. */
  value = input<number | undefined>(undefined);
  ariaLabel = input<string | undefined>(undefined);

  /** Clamped to [0, 100]; `undefined` when the raw value is absent or not finite. */
  readonly clampedValue = computed<number | undefined>(() => {
    const raw = this.value();
    if (raw === undefined || !Number.isFinite(raw)) {
      return undefined;
    }
    return Math.min(100, Math.max(0, raw));
  });

  readonly isIndeterminate = computed(() => this.clampedValue() === undefined);
}
```

- [ ] **Step 4: Create the template**

Create `projects/orbit/src/lib/components/progress-bar/progress-bar.component.html`:

```html
<div
  class="orbit-progress-bar"
  role="progressbar"
  [class.orbit-progress-bar--indeterminate]="isIndeterminate()"
  [attr.aria-label]="ariaLabel() || null"
  [attr.aria-valuenow]="clampedValue() ?? null"
  aria-valuemin="0"
  aria-valuemax="100"
>
  <div class="orbit-progress-bar__fill" [style.width.%]="clampedValue() ?? null"></div>
</div>
```

- [ ] **Step 5: Create the stylesheet**

Create `projects/orbit/src/lib/components/progress-bar/progress-bar.component.css`:

```css
:host {
  display: block;
}

.orbit-progress-bar {
  position: relative;
  width: 100%;
  height: var(--orbit-space-2);
  overflow: hidden;
  border-radius: var(--orbit-radius-full);
  background: var(--orbit-border-subtle);
}

.orbit-progress-bar__fill {
  height: 100%;
  border-radius: var(--orbit-radius-full);
  background: var(--orbit-action-primary-bg);
  transition: width var(--orbit-motion-fast) var(--orbit-easing-standard);
}

.orbit-progress-bar--indeterminate .orbit-progress-bar__fill {
  width: 40%;
  animation: orbit-progress-bar-sweep 1.4s ease-in-out infinite;
}

@keyframes orbit-progress-bar-sweep {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(60%);
  }
  100% {
    transform: translateX(250%);
  }
}
```

- [ ] **Step 6: Create the barrel file**

Create `projects/orbit/src/lib/components/progress-bar/index.ts`:

```typescript
export { OrbitProgressBarComponent } from './progress-bar.component';
```

- [ ] **Step 7: Export from the library's public API**

In `projects/orbit/src/public-api.ts`, add a new line (alphabetically grouped is not enforced by the existing file — append next to the other `components/*` exports, immediately after the `panel-surface`/`panel` group and before `sidebar`, matching the file's loose grouping by feature area):

```typescript
export * from './lib/components/panel';
export * from './lib/components/progress-bar';
export * from './lib/components/sidebar';
```

(i.e. insert `export * from './lib/components/progress-bar';` on its own line directly after the existing `export * from './lib/components/panel';` line.)

- [ ] **Step 8: Run the spec to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx vitest run projects/orbit/src/lib/components/progress-bar/progress-bar.component.spec.ts`
Expected: PASS — 7 tests passing.

- [ ] **Step 9: Run the full `orbit` library test suite**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: PASS — all existing `orbit` tests still pass, plus the 7 new ones.

---

### Task 2: `OrbitSpinnerComponent`

**Files:**
- Create: `projects/orbit/src/lib/components/spinner/spinner.component.ts`
- Create: `projects/orbit/src/lib/components/spinner/spinner.component.html`
- Create: `projects/orbit/src/lib/components/spinner/spinner.component.css`
- Create: `projects/orbit/src/lib/components/spinner/spinner.component.spec.ts`
- Create: `projects/orbit/src/lib/components/spinner/index.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Consumes: `ORBIT_I18N` injection token and `OrbitI18n` type from `projects/orbit/src/lib/i18n/orbit-i18n.ts` (`labels.loading: string`, value `'Operazione in corso'` by default).
- Produces: `export type OrbitSpinnerSize = 'sm' | 'md' | 'lg';` and `OrbitSpinnerComponent` with selector `orbit-spinner`, inputs `size = input<OrbitSpinnerSize>('md')` and `ariaLabel = input<string | undefined>(undefined)`. No outputs.

- [ ] **Step 1: Write the failing spec**

Create `projects/orbit/src/lib/components/spinner/spinner.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitSpinnerComponent } from './spinner.component';

describe('OrbitSpinnerComponent', () => {
  let fixture: ComponentFixture<OrbitSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitSpinnerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitSpinnerComponent);
  });

  function spinner(): HTMLElement {
    return fixture.nativeElement.querySelector('.orbit-spinner') as HTMLElement;
  }

  it('defaults to the md size with role=status and the default i18n label', () => {
    fixture.detectChanges();

    expect(spinner().classList.contains('orbit-spinner--md')).toBe(true);
    expect(spinner().getAttribute('role')).toBe('status');
    expect(spinner().getAttribute('aria-label')).toBe('Operazione in corso');
  });

  it('applies the sm size class', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    expect(spinner().classList.contains('orbit-spinner--sm')).toBe(true);
    expect(spinner().classList.contains('orbit-spinner--md')).toBe(false);
  });

  it('applies the lg size class', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    expect(spinner().classList.contains('orbit-spinner--lg')).toBe(true);
    expect(spinner().classList.contains('orbit-spinner--md')).toBe(false);
  });

  it('overrides the default aria-label when one is provided', () => {
    fixture.componentRef.setInput('ariaLabel', 'Caricamento allegato in corso');
    fixture.detectChanges();

    expect(spinner().getAttribute('aria-label')).toBe('Caricamento allegato in corso');
  });
});
```

- [ ] **Step 2: Run the spec to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx vitest run projects/orbit/src/lib/components/spinner/spinner.component.spec.ts`
Expected: FAIL — cannot resolve `./spinner.component` (module not found).

- [ ] **Step 3: Create the component class**

Create `projects/orbit/src/lib/components/spinner/spinner.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ORBIT_I18N } from '../../i18n/orbit-i18n';

export type OrbitSpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'orbit-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
})
export class OrbitSpinnerComponent {
  size = input<OrbitSpinnerSize>('md');
  ariaLabel = input<string | undefined>(undefined);

  protected readonly i18n = inject(ORBIT_I18N);
}
```

- [ ] **Step 4: Create the template**

Create `projects/orbit/src/lib/components/spinner/spinner.component.html`:

```html
<span
  class="orbit-spinner"
  role="status"
  [class.orbit-spinner--sm]="size() === 'sm'"
  [class.orbit-spinner--md]="size() === 'md'"
  [class.orbit-spinner--lg]="size() === 'lg'"
  [attr.aria-label]="ariaLabel() || i18n.labels.loading"
></span>
```

- [ ] **Step 5: Create the stylesheet**

Create `projects/orbit/src/lib/components/spinner/spinner.component.css`:

```css
:host {
  display: inline-flex;
}

.orbit-spinner {
  display: inline-block;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: var(--orbit-radius-full);
  color: var(--orbit-action-primary-bg);
  animation: orbit-spinner-spin var(--orbit-motion-spin) linear infinite;
}

.orbit-spinner--sm {
  width: var(--orbit-font-size-sm);
  height: var(--orbit-font-size-sm);
}

.orbit-spinner--md {
  width: var(--orbit-sidebar-icon-size);
  height: var(--orbit-sidebar-icon-size);
}

.orbit-spinner--lg {
  width: var(--orbit-sidebar-icon-size-collapsed);
  height: var(--orbit-sidebar-icon-size-collapsed);
}

@keyframes orbit-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}
```

- [ ] **Step 6: Create the barrel file**

Create `projects/orbit/src/lib/components/spinner/index.ts`:

```typescript
export { OrbitSpinnerComponent, type OrbitSpinnerSize } from './spinner.component';
```

- [ ] **Step 7: Export from the library's public API**

In `projects/orbit/src/public-api.ts`, insert `export * from './lib/components/spinner';` directly after the `slider` export line:

```typescript
export * from './lib/components/slider';
export * from './lib/components/spinner';
export * from './lib/components/switch';
```

- [ ] **Step 8: Run the spec to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx vitest run projects/orbit/src/lib/components/spinner/spinner.component.spec.ts`
Expected: PASS — 4 tests passing.

- [ ] **Step 9: Run the full `orbit` library test suite**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: PASS — all existing `orbit` tests still pass, plus the 7 (Task 1) + 4 (Task 2) new ones.

---

### Task 3: `progress-bar` catalog page (icon, page, route, entry)

**Files:**
- Modify: `projects/orbit/src/lib/icons/icon-registry.ts`
- Create: `projects/orbit-lab/src/app/pages/progress-bar-page/progress-bar-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/progress-bar-page/progress-bar-page.component.html`
- Create: `projects/orbit-lab/src/app/pages/progress-bar-page/progress-bar-page.component.spec.ts`
- Modify: `projects/orbit-lab/src/app/catalog/catalog.ts`
- Modify: `projects/orbit-lab/src/app/app.routes.ts`

**Interfaces:**
- Consumes: `OrbitProgressBarComponent` (selector `orbit-progress-bar`, inputs `value`, `ariaLabel` — from Task 1), `OrbitSliderComponent` (selector `orbit-slider`, CVA-based — existing), `LabExampleComponent` (selector `lab-example`, input `code: string` — existing, from `projects/orbit-lab/src/app/catalog/example-panel.component.ts`), `CatalogEntry`/`CATALOG_ENTRIES` (existing), `toSignal` from `@angular/core/rxjs-interop`.
- Produces: `ProgressBarPageComponent`; a new `'bar-chart'` member of `OrbitIconName`.

- [ ] **Step 1: Add the `bar-chart` icon to the registry**

In `projects/orbit/src/lib/icons/icon-registry.ts`, add `'bar-chart'` to the `OrbitIconName` union (append after `'slider'`):

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
  | 'bar-chart';
```

And add the matching entry to `ORBIT_ICON_PATHS`, appended after the `slider` entry (before the closing `};`):

```typescript
  slider: [
    'M4 12h16',
    'M15.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
  ],
  'bar-chart': [
    'M4 20V14h4v6H4Z',
    'M10 20V9h4v11h-4Z',
    'M16 20V4h4v16h-4Z',
  ],
};
```

- [ ] **Step 2: Run the orbit-lab catalog test to confirm the type change doesn't break anything**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx vitest run projects/orbit/src/lib/icons`
Expected: PASS — existing icon tests unaffected (they test specific named icons, not an exhaustive enumeration).

- [ ] **Step 3: Write the failing page spec**

Create `projects/orbit-lab/src/app/pages/progress-bar-page/progress-bar-page.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ProgressBarPageComponent } from './progress-bar-page.component';

describe('ProgressBarPageComponent', () => {
  let fixture: ComponentFixture<ProgressBarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ProgressBarPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the initial value in the determinate example', () => {
    const bar = fixture.nativeElement.querySelector(
      '[data-example="determinate"] .orbit-progress-bar',
    ) as HTMLElement;
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
  });

  it('updates the progress bar when the control slider changes', () => {
    const control = fixture.nativeElement.querySelector(
      '[data-example="determinate"] input[type="range"]',
    ) as HTMLInputElement;

    control.value = '75';
    control.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const bar = fixture.nativeElement.querySelector(
      '[data-example="determinate"] .orbit-progress-bar',
    ) as HTMLElement;
    expect(bar.getAttribute('aria-valuenow')).toBe('75');
  });

  it('renders an indeterminate example with no aria-valuenow', () => {
    const bar = fixture.nativeElement.querySelector(
      '[data-example="indeterminate"] .orbit-progress-bar',
    ) as HTMLElement;
    expect(bar.classList.contains('orbit-progress-bar--indeterminate')).toBe(true);
    expect(bar.hasAttribute('aria-valuenow')).toBe(false);
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-progress-bar',
    );
  });
});
```

- [ ] **Step 4: Run the spec to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx vitest run projects/orbit-lab/src/app/pages/progress-bar-page/progress-bar-page.component.spec.ts`
Expected: FAIL — cannot resolve `./progress-bar-page.component` (module not found).

- [ ] **Step 5: Create the page component**

Create `projects/orbit-lab/src/app/pages/progress-bar-page/progress-bar-page.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OrbitProgressBarComponent, OrbitSliderComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-progress-bar-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OrbitProgressBarComponent,
    OrbitSliderComponent,
    ReactiveFormsModule,
    LabExampleComponent,
  ],
  templateUrl: './progress-bar-page.component.html',
})
export class ProgressBarPageComponent {
  protected readonly determinateControl = new FormControl<number>(40, { nonNullable: true });
  protected readonly determinateValue: Signal<number> = toSignal(
    this.determinateControl.valueChanges,
    { initialValue: this.determinateControl.value },
  );

  protected readonly determinateSnippet =
    '<orbit-slider inputId="upload-progress" ariaLabel="Avanzamento upload" showValue [formControl]="uploadProgress" />\n<orbit-progress-bar [value]="uploadProgress.value" ariaLabel="Avanzamento upload" />';

  protected readonly indeterminateSnippet =
    '<orbit-progress-bar ariaLabel="Caricamento in corso" />';
}
```

- [ ] **Step 6: Create the template**

Create `projects/orbit-lab/src/app/pages/progress-bar-page/progress-bar-page.component.html`:

```html
<article>
  <h1>Barra di avanzamento</h1>
  <p>
    Indicatore di avanzamento riutilizzabile: determinato (percentuale 0-100) o indeterminato
    (attesa senza percentuale nota), fuori dal contesto di un singolo bottone.
  </p>

  <section>
    <h2>Esempio determinato</h2>
    <lab-example [code]="determinateSnippet">
      <div data-example="determinate">
        <orbit-slider
          inputId="progress-bar-control"
          ariaLabel="Valore avanzamento"
          showValue
          [formControl]="determinateControl"
        />
        <orbit-progress-bar [value]="determinateValue()" ariaLabel="Avanzamento upload" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Esempio indeterminato</h2>
    <lab-example [code]="indeterminateSnippet">
      <div data-example="indeterminate">
        <orbit-progress-bar ariaLabel="Caricamento in corso" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Accessibilità</h2>
    <ul>
      <li><code>role="progressbar"</code> con <code>aria-valuemin="0"</code> e <code>aria-valuemax="100"</code> sempre presenti.</li>
      <li>
        <code>aria-valuenow</code> è presente solo quando <code>value</code> è un numero finito
        (viene omesso in stato indeterminato, per non annunciare una percentuale inesistente).
      </li>
      <li><code>ariaLabel</code> imposta <code>aria-label</code> sul contenitore.</li>
      <li>Un <code>value</code> fuori range (&lt;0 o &gt;100) viene clampato silenziosamente; <code>NaN</code> è trattato come indeterminato.</li>
    </ul>
  </section>
</article>
```

- [ ] **Step 7: Add the catalog entry**

In `projects/orbit-lab/src/app/catalog/catalog.ts`, insert the new entry immediately before the existing `navbar` entry (`Barra di navigazione`), so the two `Barra …` labels stay in their correct relative alphabetical order:

```typescript
  { slug: 'attachments', label: 'Allegati', status: 'verified', icon: 'paperclip' },
  { slug: 'motion', label: 'Animazioni', status: 'verified', icon: 'retry' },
  { slug: 'progress-bar', label: 'Barra di avanzamento', status: 'verified', icon: 'bar-chart' },
  { slug: 'navbar', label: 'Barra di navigazione', status: 'verified', icon: 'menu' },
```

- [ ] **Step 8: Add the route**

In `projects/orbit-lab/src/app/app.routes.ts`, insert a new route entry directly after the `slider` route:

```typescript
  {
    path: 'slider',
    loadComponent: () =>
      import('./pages/slider-page/slider-page.component').then((m) => m.SliderPageComponent),
  },
  {
    path: 'progress-bar',
    loadComponent: () =>
      import('./pages/progress-bar-page/progress-bar-page.component').then(
        (m) => m.ProgressBarPageComponent,
      ),
  },
```

- [ ] **Step 9: Run the page spec to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx vitest run projects/orbit-lab/src/app/pages/progress-bar-page/progress-bar-page.component.spec.ts`
Expected: PASS — 5 tests passing.

- [ ] **Step 10: Run the catalog spec and confirm no new (only the known pre-existing) failure**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx vitest run projects/orbit-lab/src/app/catalog/catalog.spec.ts`
Expected: the `'marks every catalog entry as verified'` and `'leaves no blockedFile/blockedTokens on verified entries'` tests PASS; the `'lists every entry in alphabetical label order'` test still FAILS with the same pre-existing `Badge`/`Barra di navigazione` and `Layout`/`Input di testo` swaps as before this task (confirm the new `Barra di avanzamento` entry does not appear as a newly out-of-order item in the diff).

---

### Task 4: `spinner` catalog page (page, route, entry)

**Files:**
- Create: `projects/orbit-lab/src/app/pages/spinner-page/spinner-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/spinner-page/spinner-page.component.html`
- Create: `projects/orbit-lab/src/app/pages/spinner-page/spinner-page.component.spec.ts`
- Modify: `projects/orbit-lab/src/app/catalog/catalog.ts`
- Modify: `projects/orbit-lab/src/app/app.routes.ts`

**Interfaces:**
- Consumes: `OrbitSpinnerComponent` (selector `orbit-spinner`, input `size: OrbitSpinnerSize`, `ariaLabel` — from Task 2), `LabExampleComponent` (existing).
- Produces: `SpinnerPageComponent`.

- [ ] **Step 1: Write the failing page spec**

Create `projects/orbit-lab/src/app/pages/spinner-page/spinner-page.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { SpinnerPageComponent } from './spinner-page.component';

describe('SpinnerPageComponent', () => {
  let fixture: ComponentFixture<SpinnerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SpinnerPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the sm example at the sm size', () => {
    const spinner = fixture.nativeElement.querySelector(
      '[data-example="sm"] .orbit-spinner',
    ) as HTMLElement;
    expect(spinner.classList.contains('orbit-spinner--sm')).toBe(true);
  });

  it('renders the md example at the md size', () => {
    const spinner = fixture.nativeElement.querySelector(
      '[data-example="md"] .orbit-spinner',
    ) as HTMLElement;
    expect(spinner.classList.contains('orbit-spinner--md')).toBe(true);
  });

  it('renders the lg example at the lg size', () => {
    const spinner = fixture.nativeElement.querySelector(
      '[data-example="lg"] .orbit-spinner',
    ) as HTMLElement;
    expect(spinner.classList.contains('orbit-spinner--lg')).toBe(true);
  });

  it('renders a custom aria-label example', () => {
    const spinner = fixture.nativeElement.querySelector(
      '[data-example="custom-label"] .orbit-spinner',
    ) as HTMLElement;
    expect(spinner.getAttribute('aria-label')).toBe('Caricamento allegato in corso');
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-spinner',
    );
  });
});
```

- [ ] **Step 2: Run the spec to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx vitest run projects/orbit-lab/src/app/pages/spinner-page/spinner-page.component.spec.ts`
Expected: FAIL — cannot resolve `./spinner-page.component` (module not found).

- [ ] **Step 3: Create the page component**

Create `projects/orbit-lab/src/app/pages/spinner-page/spinner-page.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitSpinnerComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

@Component({
  selector: 'lab-spinner-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitSpinnerComponent, LabExampleComponent],
  templateUrl: './spinner-page.component.html',
})
export class SpinnerPageComponent {
  protected readonly sizesSnippet =
    '<orbit-spinner size="sm" />\n<orbit-spinner size="md" />\n<orbit-spinner size="lg" />';

  protected readonly customLabelSnippet =
    '<orbit-spinner ariaLabel="Caricamento allegato in corso" />';
}
```

- [ ] **Step 4: Create the template**

Create `projects/orbit-lab/src/app/pages/spinner-page/spinner-page.component.html`:

```html
<article>
  <h1>Spinner</h1>
  <p>
    Indicatore rotante di caricamento, riutilizzabile fuori da <code>orbit-button</code> (es. in
    un panel, una card o una pagina intera in attesa di dati).
  </p>

  <section>
    <h2>Dimensioni</h2>
    <lab-example [code]="sizesSnippet">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div data-example="sm">
          <orbit-spinner size="sm" />
        </div>
        <div data-example="md">
          <orbit-spinner size="md" />
        </div>
        <div data-example="lg">
          <orbit-spinner size="lg" />
        </div>
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Etichetta personalizzata</h2>
    <lab-example [code]="customLabelSnippet">
      <div data-example="custom-label">
        <orbit-spinner ariaLabel="Caricamento allegato in corso" />
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Accessibilità</h2>
    <ul>
      <li><code>role="status"</code> con <code>aria-label</code> di default "Operazione in corso" (localizzabile via <code>provideOrbitI18n</code>, chiave <code>labels.loading</code>).</li>
      <li><code>ariaLabel</code> sovrascrive l'etichetta di default quando lo spinner descrive un'operazione specifica.</li>
    </ul>
  </section>
</article>
```

- [ ] **Step 5: Add the catalog entry**

In `projects/orbit-lab/src/app/catalog/catalog.ts`, insert the new entry immediately before the existing `tooltip` entry (`Suggerimenti`), directly after `slider`, so `Spinner` sits in its correct alphabetical slot between `Slider` and `Suggerimenti`:

```typescript
  { slug: 'slider', label: 'Slider', status: 'verified', icon: 'slider' },
  { slug: 'spinner', label: 'Spinner', status: 'verified', icon: 'retry' },
  { slug: 'tooltip', label: 'Suggerimenti', status: 'verified', icon: 'message-circle' },
```

- [ ] **Step 6: Add the route**

In `projects/orbit-lab/src/app/app.routes.ts`, insert a new route entry directly after the `progress-bar` route added in Task 3:

```typescript
  {
    path: 'progress-bar',
    loadComponent: () =>
      import('./pages/progress-bar-page/progress-bar-page.component').then(
        (m) => m.ProgressBarPageComponent,
      ),
  },
  {
    path: 'spinner',
    loadComponent: () =>
      import('./pages/spinner-page/spinner-page.component').then(
        (m) => m.SpinnerPageComponent,
      ),
  },
```

- [ ] **Step 7: Run the page spec to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx vitest run projects/orbit-lab/src/app/pages/spinner-page/spinner-page.component.spec.ts`
Expected: PASS — 6 tests passing.

- [ ] **Step 8: Run the full `orbit-lab` test suite (excluding the unrelated in-progress `examples-page` directory)**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: PASS, except for the single pre-existing, unrelated `catalog.spec.ts` ordering failure noted in Global Constraints — no other failures.

- [ ] **Step 9: Run the full `orbit` library suite one more time as a final cross-check**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: PASS — no regressions from the icon-registry change in Task 3.

---

## Self-Review

**1. Spec coverage:**
- `OrbitProgressBarComponent` (value clamp, indeterminate, aria attrs) → Task 1. ✅
- `OrbitSpinnerComponent` (3 sizes, aria-label default) → Task 2. ✅
- Tokens (`--orbit-action-primary-bg`, `--orbit-border-subtle`, `--orbit-radius-full`, `--orbit-motion-spin`, `--orbit-sidebar-icon-size[-collapsed]`, `--orbit-font-size-sm`) → used exactly as named in Tasks 1–2, no new tokens invented. ✅
- Error handling (fail-soft clamp, NaN → indeterminate) → covered by `clampedValue` computed + dedicated spec cases in Task 1. ✅
- Catalog entries + routes for both components → Tasks 3–4. ✅
- Icon gap for `progress-bar` → resolved in Task 3 Step 1 with a new `bar-chart` registry entry (documented in Spec-gap resolutions §1). ✅
- `OrbitButtonComponent` left untouched → confirmed via Global Constraints and no task modifies `components/button/*`. ✅
- Manual test coverage described in spec (`slider di controllo che aggiorna value live`, indeterminate example, 3 spinner sizes) → all present in Task 3/4 page templates and specs. ✅

**2. Placeholder scan:** No "TBD"/"add appropriate tests"/"similar to Task N" phrases remain; every step has literal code or an exact shell command with expected output.

**3. Type consistency:** `OrbitProgressBarComponent.value: number | undefined`, `clampedValue(): number | undefined` used identically in Task 1's component/template/spec and Task 3's page. `OrbitSpinnerComponent.size: OrbitSpinnerSize` (`'sm' | 'md' | 'lg'`) used identically in Task 2 and Task 4. `ariaLabel: string | undefined` naming matches across both components and both pages. `ProgressBarPageComponent`/`SpinnerPageComponent` class names match the `loadComponent` imports added to `app.routes.ts` in Tasks 3–4.
