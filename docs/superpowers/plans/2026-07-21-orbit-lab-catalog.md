# Orbit Lab Catalog Implementation Plan

> **Stato:** Completato
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build the Orbit Lab technical catalog shell and its first five component pages (Button, Badge, Form grid, Form field, Form section), honestly distinguishing components that are token-clean from those blocked on Orbit Core drift, plus a generic "stabilizing" page for text-input/select/checkbox/pill-switch.

**Architecture:** Angular 22 standalone, zoneless app (`projects/orbit-lab`) with Angular Router. A `LabShellComponent` provides header (theme/density toggles) + nav + `<router-outlet>`. A declarative `CATALOG_ENTRIES` array drives the nav. Each component page is a standalone component using only real `@galileo/orbit` components — no hand-rolled markup imitating a control.

**Tech Stack:** Angular 22 (standalone components, signals, `provideZonelessChangeDetection`), Angular Router, Vitest (`@angular/build:unit-test`), existing `@galileo/orbit` path mapping (`@galileo/orbit` → `projects/orbit/src/public-api.ts`).

## Global Constraints

- Do not modify anything under `projects/orbit/src/**` or `projects/orbit-studio/**` — this plan is scoped to `projects/orbit-lab/**` only.
- Use only real Orbit components in every example; never recreate a button/input/badge/switch with local markup.
- Never declare a component "verified" if its stylesheet references a `--orbit-*` custom property not defined in `projects/orbit/src/styles/tokens.css` — show a blocked banner with the exact file and token names instead.
- No new external dependencies without explicit approval.
- Theme/density toggles apply to a container wrapping the whole `<router-outlet>`, not to an isolated preview scope (unlike Orbit Studio).
- No commits, tags, or pushes without explicit instruction from the user for this session.

---

## Task 1: Catalog data model

**Files:**
- Create: `projects/orbit-lab/src/app/catalog/catalog-entry.model.ts`
- Create: `projects/orbit-lab/src/app/catalog/catalog.ts`
- Test: `projects/orbit-lab/src/app/catalog/catalog.spec.ts`

**Interfaces:**
- Produces: `CatalogStatus = 'verified' | 'token-blocked' | 'stabilizing'`, `CatalogEntry { slug: string; label: string; status: CatalogStatus; blockedTokens?: string[]; blockedFile?: string }`, `CATALOG_ENTRIES: CatalogEntry[]`.

- [x] **Step 1: Write the failing test**

```ts
// projects/orbit-lab/src/app/catalog/catalog.spec.ts
import { describe, expect, it } from 'vitest';
import { CATALOG_ENTRIES } from './catalog';

describe('CATALOG_ENTRIES', () => {
  it('lists the five priority entries plus the four stabilizing ones', () => {
    expect(CATALOG_ENTRIES.map((e) => e.slug)).toEqual([
      'button',
      'badge',
      'form-grid',
      'form-field',
      'form-section',
      'text-input',
      'select',
      'checkbox',
      'pill-switch',
    ]);
  });

  it('marks button as the only verified entry', () => {
    const verified = CATALOG_ENTRIES.filter((e) => e.status === 'verified');
    expect(verified.map((e) => e.slug)).toEqual(['button']);
  });

  it('marks badge, form-grid, form-field and form-section as token-blocked with exact tokens', () => {
    const badge = CATALOG_ENTRIES.find((e) => e.slug === 'badge')!;
    expect(badge.status).toBe('token-blocked');
    expect(badge.blockedFile).toBe('projects/orbit/src/lib/components/badge/badge.component.css');
    expect(badge.blockedTokens).toEqual([
      '--orbit-font-family',
      '--orbit-font-size-xs',
      '--orbit-font-weight-semibold',
      '--orbit-radius-full',
    ]);
  });

  it('marks text-input, select, checkbox and pill-switch as stabilizing', () => {
    const stabilizing = CATALOG_ENTRIES.filter((e) => e.status === 'stabilizing');
    expect(stabilizing.map((e) => e.slug)).toEqual([
      'text-input',
      'select',
      'checkbox',
      'pill-switch',
    ]);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx ng test orbit-lab --include='**/catalog/catalog.spec.ts'`
Expected: FAIL with "Cannot find module './catalog'" (file does not exist yet).

- [x] **Step 3: Write the model**

```ts
// projects/orbit-lab/src/app/catalog/catalog-entry.model.ts
export type CatalogStatus = 'verified' | 'token-blocked' | 'stabilizing';

export interface CatalogEntry {
  slug: string;
  label: string;
  status: CatalogStatus;
  /** Only set when status is 'token-blocked'. */
  blockedTokens?: string[];
  /** Only set when status is 'token-blocked'. Repo-relative path. */
  blockedFile?: string;
}
```

- [x] **Step 4: Write the catalog**

```ts
// projects/orbit-lab/src/app/catalog/catalog.ts
import { CatalogEntry } from './catalog-entry.model';

export const CATALOG_ENTRIES: CatalogEntry[] = [
  { slug: 'button', label: 'Button', status: 'verified' },
  {
    slug: 'badge',
    label: 'Badge',
    status: 'token-blocked',
    blockedFile: 'projects/orbit/src/lib/components/badge/badge.component.css',
    blockedTokens: [
      '--orbit-font-family',
      '--orbit-font-size-xs',
      '--orbit-font-weight-semibold',
      '--orbit-radius-full',
    ],
  },
  {
    slug: 'form-grid',
    label: 'Form grid',
    status: 'token-blocked',
    blockedFile: 'projects/orbit/src/lib/components/form-grid/form-grid.component.css',
    blockedTokens: ['--orbit-space-2', '--orbit-space-3', '--orbit-space-4', '--orbit-space-5'],
  },
  {
    slug: 'form-field',
    label: 'Form field',
    status: 'token-blocked',
    blockedFile: 'projects/orbit/src/lib/components/form-field/form-field.component.css',
    blockedTokens: [
      '--orbit-font-family',
      '--orbit-font-size-sm',
      '--orbit-font-size-xs',
      '--orbit-font-weight-semibold',
      '--orbit-space-1',
    ],
  },
  {
    slug: 'form-section',
    label: 'Form section',
    status: 'token-blocked',
    blockedFile: 'projects/orbit/src/lib/components/form-section/form-section.component.css',
    blockedTokens: [
      '--orbit-font-family',
      '--orbit-font-weight-bold',
      '--orbit-font-size-xs',
      '--orbit-space-2',
      '--orbit-space-3',
    ],
  },
  { slug: 'text-input', label: 'Text input', status: 'stabilizing' },
  { slug: 'select', label: 'Select', status: 'stabilizing' },
  { slug: 'checkbox', label: 'Checkbox', status: 'stabilizing' },
  { slug: 'pill-switch', label: 'Pill switch', status: 'stabilizing' },
];
```

- [x] **Step 5: Run test to verify it passes**

Run: `npx ng test orbit-lab --include='**/catalog/catalog.spec.ts'`
Expected: PASS (4 tests).

- [x] **Step 6: Commit**

```bash
git add projects/orbit-lab/src/app/catalog
git commit -m "feat(orbit-lab): add catalog entry model and declarative catalog"
```

---

## Task 2: Lab shell component (header + theme/density + nav)

**Files:**
- Create: `projects/orbit-lab/src/app/shell/lab-shell.component.ts`
- Create: `projects/orbit-lab/src/app/shell/lab-shell.component.html`
- Create: `projects/orbit-lab/src/app/shell/lab-shell.component.css`
- Test: `projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts`

**Interfaces:**
- Consumes: `CATALOG_ENTRIES` from Task 1 (`projects/orbit-lab/src/app/catalog/catalog`).
- Produces: `LabShellComponent` with `protected theme = signal<'default' | 'dark'>('default')`, `protected density = signal<'comfortable' | 'compact'>('comfortable')`, methods `setTheme(theme: 'default' | 'dark')` and `setDensity(density: 'comfortable' | 'compact')`. Later tasks route into `<router-outlet>` inside this shell.

- [x] **Step 1: Write the failing test**

```ts
// projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { LabShellComponent } from './lab-shell.component';
import { CATALOG_ENTRIES } from '../catalog/catalog';

describe('LabShellComponent', () => {
  let fixture: ComponentFixture<LabShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(LabShellComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders one nav link per catalog entry', () => {
    const links = fixture.nativeElement.querySelectorAll('[data-lab-nav-link]');
    expect(links.length).toBe(CATALOG_ENTRIES.length);
  });

  it('defaults to default theme and comfortable density', () => {
    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.getAttribute('data-orbit-theme')).toBeNull();
    expect(container.getAttribute('data-orbit-density')).toBeNull();
  });

  it('applies dark theme attribute when selected', () => {
    fixture.componentInstance.setTheme('dark');
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.getAttribute('data-orbit-theme')).toBe('dark');
  });

  it('applies compact density attribute when selected', () => {
    fixture.componentInstance.setDensity('compact');
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('[data-lab-theme-container]');
    expect(container.getAttribute('data-orbit-density')).toBe('compact');
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx ng test orbit-lab --include='**/shell/lab-shell.component.spec.ts'`
Expected: FAIL with "Cannot find module './lab-shell.component'".

- [x] **Step 3: Write the component**

```ts
// projects/orbit-lab/src/app/shell/lab-shell.component.ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CATALOG_ENTRIES } from '../catalog/catalog';

type LabTheme = 'default' | 'dark';
type LabDensity = 'comfortable' | 'compact';

@Component({
  selector: 'lab-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './lab-shell.component.html',
  styleUrl: './lab-shell.component.css',
})
export class LabShellComponent {
  protected readonly entries = CATALOG_ENTRIES;
  protected readonly theme = signal<LabTheme>('default');
  protected readonly density = signal<LabDensity>('comfortable');

  setTheme(theme: LabTheme): void {
    this.theme.set(theme);
  }

  setDensity(density: LabDensity): void {
    this.density.set(density);
  }
}
```

- [x] **Step 4: Write the template**

```html
<!-- projects/orbit-lab/src/app/shell/lab-shell.component.html -->
<header class="lab-shell__header">
  <span class="lab-shell__brand">Orbit Lab</span>

  <div class="lab-shell__controls">
    <label class="lab-shell__control">
      Tema
      <select
        class="lab-shell__select"
        [value]="theme()"
        (change)="setTheme($any($event.target).value)"
      >
        <option value="default">Default</option>
        <option value="dark">Regressione (dark)</option>
      </select>
    </label>

    <label class="lab-shell__control">
      Densità
      <select
        class="lab-shell__select"
        [value]="density()"
        (change)="setDensity($any($event.target).value)"
      >
        <option value="comfortable">Comfortable</option>
        <option value="compact">Compact</option>
      </select>
    </label>
  </div>
</header>

<div
  class="lab-shell__body"
  data-lab-theme-container
  [attr.data-orbit-theme]="theme() === 'dark' ? 'dark' : null"
  [attr.data-orbit-density]="density() === 'compact' ? 'compact' : null"
>
  <nav class="lab-shell__nav">
    <a
      *ngFor="let entry of entries"
      data-lab-nav-link
      class="lab-shell__nav-link"
      [class.lab-shell__nav-link--blocked]="entry.status !== 'verified'"
      [routerLink]="['/', entry.slug]"
      routerLinkActive="lab-shell__nav-link--active"
    >
      {{ entry.label }}
      @if (entry.status === 'token-blocked') {
        <span class="lab-shell__nav-badge" aria-label="Bloccato su token Core">⛔</span>
      } @else if (entry.status === 'stabilizing') {
        <span class="lab-shell__nav-badge" aria-label="In stabilizzazione Core">⏳</span>
      }
    </a>
  </nav>

  <main class="lab-shell__content">
    <router-outlet />
  </main>
</div>
```

`*ngFor` requires `CommonModule`; add it to the component imports since the template above uses the structural directive form. Update the component's `imports` array:

```ts
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
```

and add `import { CommonModule } from '@angular/common';` to the top of `lab-shell.component.ts`.

- [x] **Step 5: Write the styles**

```css
/* projects/orbit-lab/src/app/shell/lab-shell.component.css */
:host {
  display: block;
  min-height: 100dvh;
  font-family: var(--orbit-font-sans);
  color: var(--orbit-text-primary);
  background: var(--orbit-surface-canvas);
}

.lab-shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
  padding: 0 var(--orbit-ref-space-4);
  border-bottom: 1px solid var(--orbit-border-subtle);
  background: var(--orbit-surface-default);
}

.lab-shell__brand {
  font-weight: var(--orbit-font-weight-emphasis);
}

.lab-shell__controls {
  display: flex;
  gap: var(--orbit-ref-space-4);
}

.lab-shell__control {
  display: flex;
  align-items: center;
  gap: var(--orbit-ref-space-2);
  font-size: var(--orbit-ref-font-size-sm);
  color: var(--orbit-text-secondary);
}

.lab-shell__select {
  height: 1.75rem;
  border: 1px solid var(--orbit-border-subtle);
  border-radius: var(--orbit-radius-control);
  background: var(--orbit-surface-default);
  color: var(--orbit-text-primary);
}

.lab-shell__body {
  display: grid;
  grid-template-columns: 14rem 1fr;
  min-height: calc(100dvh - 3rem);
}

.lab-shell__nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--orbit-ref-space-4);
  border-right: 1px solid var(--orbit-border-subtle);
  background: var(--orbit-surface-default);
}

.lab-shell__nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--orbit-ref-space-2) var(--orbit-ref-space-3);
  border-radius: var(--orbit-radius-control);
  color: var(--orbit-text-primary);
  text-decoration: none;
  font-size: var(--orbit-ref-font-size-sm);
}

.lab-shell__nav-link:hover {
  background: var(--orbit-surface-subtle);
}

.lab-shell__nav-link--active {
  background: color-mix(in srgb, var(--orbit-action-primary-bg) 12%, transparent);
  color: var(--orbit-action-primary-bg);
}

.lab-shell__nav-link--blocked {
  color: var(--orbit-text-secondary);
}

.lab-shell__content {
  padding: var(--orbit-ref-space-6);
  overflow: auto;
}

@media (max-width: 768px) {
  .lab-shell__body {
    grid-template-columns: 1fr;
  }

  .lab-shell__nav {
    flex-direction: row;
    flex-wrap: wrap;
    border-right: 0;
    border-bottom: 1px solid var(--orbit-border-subtle);
  }
}
```

Note: this file intentionally uses only tokens already confirmed to resolve today (`--orbit-font-sans`, `--orbit-text-primary/secondary`, `--orbit-surface-*`, `--orbit-border-subtle`, `--orbit-action-primary-bg`, `--orbit-radius-control`, `--orbit-font-weight-emphasis`, and the `--orbit-ref-space-*` / `--orbit-ref-font-size-*` reference tokens for spacing/sizing that have no semantic equivalent yet). Using `--orbit-ref-*` directly here is a deliberate, documented exception for Lab's own chrome (not a component), pending Core adding the missing semantic spacing/sizing tokens in Phase 0.

- [x] **Step 6: Run test to verify it passes**

Run: `npx ng test orbit-lab --include='**/shell/lab-shell.component.spec.ts'`
Expected: PASS (5 tests).

- [x] **Step 7: Commit**

```bash
git add projects/orbit-lab/src/app/shell
git commit -m "feat(orbit-lab): add shell with theme/density controls and nav"
```

---

## Task 3: Routing and bootstrap wiring

**Files:**
- Modify: `projects/orbit-lab/src/app/app.routes.ts`
- Modify: `projects/orbit-lab/src/main.ts`
- Delete: `projects/orbit-lab/src/app/app.component.ts` (replaced by `LabShellComponent` as the bootstrap root)
- Test: none new (covered by shell and page tests; this task is pure wiring)

**Interfaces:**
- Consumes: `LabShellComponent` (Task 2), page components created in Tasks 4–9 (forward references by path only — routes are added incrementally per task, this task creates the array with the entries available so far and each later task appends its own route).

- [x] **Step 1: Replace routes with one entry per verified/blocked page (grown incrementally)**

```ts
// projects/orbit-lab/src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'button',
    pathMatch: 'full',
  },
  {
    path: 'button',
    loadComponent: () =>
      import('./pages/button-page/button-page.component').then((m) => m.ButtonPageComponent),
  },
];
```

(Tasks 5–9 each add one more object to this array; each task's step shows the exact addition in context so no placeholder is left.)

- [x] **Step 2: Point bootstrap at the shell**

```ts
// projects/orbit-lab/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { LabShellComponent } from './app/shell/lab-shell.component';

bootstrapApplication(LabShellComponent, appConfig);
```

- [x] **Step 3: Delete the old demo root component**

```bash
rm projects/orbit-lab/src/app/app.component.ts
```

- [x] **Step 4: Update `index.html` root selector**

```html
<!-- projects/orbit-lab/src/index.html -->
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <title>Orbit Lab</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/x-icon" href="favicon.ico" />
</head>
<body>
  <lab-shell></lab-shell>
</body>
</html>
```

- [x] **Step 5: Run the full orbit-lab test suite to confirm nothing else references the deleted component**

Run: `npx ng test orbit-lab`
Expected: PASS, no failures about missing `app.component`.

- [x] **Step 6: Commit**

```bash
git add projects/orbit-lab/src/app.routes.ts projects/orbit-lab/src/main.ts projects/orbit-lab/src/index.html
git rm projects/orbit-lab/src/app/app.component.ts
git commit -m "feat(orbit-lab): bootstrap from LabShellComponent with routed pages"
```

---

## Task 4: Button page (verified)

**Files:**
- Create: `projects/orbit-lab/src/app/pages/button-page/button-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/button-page/button-page.component.html`
- Test: `projects/orbit-lab/src/app/pages/button-page/button-page.component.spec.ts`

**Interfaces:**
- Consumes: `OrbitButtonComponent` from `@galileo/orbit` (inputs: `label`, `variant: 'solid'|'soft'|'outline'|'flat'`, `tone: 'primary'|'success'|'danger'|'neutral'`, `disabled`, `loading`, `type`; output: `clicked`).

- [x] **Step 1: Write the failing test**

```ts
// projects/orbit-lab/src/app/pages/button-page/button-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ButtonPageComponent } from './button-page.component';

describe('ButtonPageComponent', () => {
  let fixture: ComponentFixture<ButtonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ButtonPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('does not show a blocked banner', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('renders every tone x variant combination as a real orbit-button', () => {
    const buttons = fixture.nativeElement.querySelectorAll('orbit-button');
    // 4 variants x 4 tones = 16, plus 3 state examples (disabled, loading, icon-only omitted) = at least 16
    expect(buttons.length).toBeGreaterThanOrEqual(16);
  });

  it('includes a disabled example', () => {
    const disabledButtons = Array.from(
      fixture.nativeElement.querySelectorAll('orbit-button'),
    ).filter((el: any) => el.getAttribute('ng-reflect-disabled') === 'true' || el.hasAttribute('disabled'));
    // ng-reflect attributes are not guaranteed; assert via the component's own disabled input state instead
    expect(fixture.nativeElement.querySelector('[data-example="disabled"] orbit-button')).toBeTruthy();
  });

  it('includes a loading example', () => {
    expect(fixture.nativeElement.querySelector('[data-example="loading"] orbit-button')).toBeTruthy();
  });

  it('renders a copyable usage snippet', () => {
    const snippet = fixture.nativeElement.querySelector('[data-usage-snippet]');
    expect(snippet.textContent).toContain('<orbit-button');
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx ng test orbit-lab --include='**/pages/button-page/button-page.component.spec.ts'`
Expected: FAIL with "Cannot find module './button-page.component'".

- [x] **Step 3: Write the component**

```ts
// projects/orbit-lab/src/app/pages/button-page/button-page.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitButtonComponent, OrbitButtonTone, OrbitButtonVariant } from '@galileo/orbit';

@Component({
  selector: 'lab-button-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitButtonComponent],
  templateUrl: './button-page.component.html',
})
export class ButtonPageComponent {
  protected readonly variants: OrbitButtonVariant[] = ['solid', 'soft', 'outline', 'flat'];
  protected readonly tones: OrbitButtonTone[] = ['primary', 'success', 'danger', 'neutral'];
  protected readonly usageSnippet =
    '<orbit-button label="Salva" variant="solid" tone="primary" (clicked)="onSave()" />';
}
```

- [x] **Step 4: Write the template**

```html
<!-- projects/orbit-lab/src/app/pages/button-page/button-page.component.html -->
<article>
  <h1>Button</h1>
  <p>Azione singola, primaria o secondaria, con quattro varianti visive e quattro toni semantici.</p>

  <section>
    <h2>Esempio base</h2>
    <orbit-button label="Salva" variant="solid" tone="primary" />
    <pre data-usage-snippet><code>{{ usageSnippet }}</code></pre>
  </section>

  <section>
    <h2>Varianti e toni</h2>
    @for (variant of variants; track variant) {
      <div>
        <h3>{{ variant }}</h3>
        @for (tone of tones; track tone) {
          <orbit-button [label]="tone" [variant]="variant" [tone]="tone" />
        }
      </div>
    }
  </section>

  <section>
    <h2>Stati</h2>
    <div data-example="default">
      <orbit-button label="Default" variant="solid" tone="primary" />
    </div>
    <div data-example="disabled">
      <orbit-button label="Disabilitato" variant="solid" tone="primary" [disabled]="true" />
    </div>
    <div data-example="loading">
      <orbit-button label="Caricamento" variant="solid" tone="primary" [loading]="true" />
    </div>
  </section>

  <section>
    <h2>Comportamento responsive</h2>
    <p>
      Larghezza intrinseca al contenuto in ogni breakpoint; non esiste una variante full-width
      dedicata. In layout stretti va inserito in un contenitore flex/grid che ne gestisca
      l'allineamento.
    </p>
  </section>

  <section>
    <h2>Accessibilità</h2>
    <ul>
      <li>Elemento nativo <code>&lt;button&gt;</code> con attributo <code>type</code> esplicito.</li>
      <li>Stato disabled e loading impediscono l'emissione di <code>clicked</code>.</li>
      <li>Focus-visible nativo del browser, nessun outline soppresso.</li>
    </ul>
  </section>
</article>
```

- [x] **Step 5: Run test to verify it passes**

Run: `npx ng test orbit-lab --include='**/pages/button-page/button-page.component.spec.ts'`
Expected: PASS (6 tests).

- [x] **Step 6: Add the route**

```ts
// projects/orbit-lab/src/app/app.routes.ts — append to the routes array from Task 3
  {
    path: 'badge',
    loadComponent: () =>
      import('./pages/badge-page/badge-page.component').then((m) => m.BadgePageComponent),
  },
```

(This entry is a forward reference to Task 5; add it together with Task 5's component so the app keeps compiling. If executing Task 4 in isolation, skip this step and add both entries when Task 5 lands.)

- [x] **Step 7: Commit**

```bash
git add projects/orbit-lab/src/app/pages/button-page
git commit -m "feat(orbit-lab): add verified Button catalog page"
```

---

## Task 5: Blocked-banner shared partial + Badge page

Badge, Form grid, Form field and Form section all need the same "blocked on Core tokens" banner. Extract it once here so Tasks 6–8 reuse it (DRY) instead of repeating markup.

**Files:**
- Create: `projects/orbit-lab/src/app/catalog/blocked-banner.component.ts`
- Create: `projects/orbit-lab/src/app/pages/badge-page/badge-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/badge-page/badge-page.component.html`
- Test: `projects/orbit-lab/src/app/catalog/blocked-banner.component.spec.ts`
- Test: `projects/orbit-lab/src/app/pages/badge-page/badge-page.component.spec.ts`

**Interfaces:**
- Produces: `LabBlockedBannerComponent` with inputs `file = input.required<string>()`, `tokens = input.required<string[]>()`. Renders a `[data-blocked-banner]` element listing `file` and each token in `tokens`. Consumed by every token-blocked page (Tasks 5–8).

- [x] **Step 1: Write the failing test for the banner**

```ts
// projects/orbit-lab/src/app/catalog/blocked-banner.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LabBlockedBannerComponent } from './blocked-banner.component';

describe('LabBlockedBannerComponent', () => {
  let fixture: ComponentFixture<LabBlockedBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabBlockedBannerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LabBlockedBannerComponent);
    fixture.componentRef.setInput('file', 'projects/orbit/src/lib/components/badge/badge.component.css');
    fixture.componentRef.setInput('tokens', ['--orbit-font-family', '--orbit-radius-full']);
    fixture.detectChanges();
  });

  it('renders the file path', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'projects/orbit/src/lib/components/badge/badge.component.css',
    );
  });

  it('renders every blocked token', () => {
    const items = fixture.nativeElement.querySelectorAll('[data-blocked-token]');
    expect(items.length).toBe(2);
    expect(items[0].textContent.trim()).toBe('--orbit-font-family');
    expect(items[1].textContent.trim()).toBe('--orbit-radius-full');
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx ng test orbit-lab --include='**/catalog/blocked-banner.component.spec.ts'`
Expected: FAIL with "Cannot find module './blocked-banner.component'".

- [x] **Step 3: Write the banner component**

```ts
// projects/orbit-lab/src/app/catalog/blocked-banner.component.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lab-blocked-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div data-blocked-banner role="note">
      <strong>Bloccato su token Core</strong>
      <p>
        Questo componente referenzia in <code>{{ file() }}</code> token non presenti nel
        contratto semantico attuale. Non può essere dichiarato verificato finché Orbit Core non
        completa la Fase 0 di stabilizzazione.
      </p>
      <ul>
        @for (token of tokens(); track token) {
          <li data-blocked-token>{{ token }}</li>
        }
      </ul>
    </div>
  `,
})
export class LabBlockedBannerComponent {
  file = input.required<string>();
  tokens = input.required<string[]>();
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `npx ng test orbit-lab --include='**/catalog/blocked-banner.component.spec.ts'`
Expected: PASS (2 tests).

- [x] **Step 5: Write the failing test for the Badge page**

```ts
// projects/orbit-lab/src/app/pages/badge-page/badge-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BadgePageComponent } from './badge-page.component';

describe('BadgePageComponent', () => {
  let fixture: ComponentFixture<BadgePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgePageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BadgePageComponent);
    fixture.detectChanges();
  });

  it('shows the blocked banner with the exact badge tokens', () => {
    const banner = fixture.nativeElement.querySelector('[data-blocked-banner]');
    expect(banner).toBeTruthy();
    expect(banner.textContent).toContain('badge.component.css');
    expect(banner.textContent).toContain('--orbit-radius-full');
  });

  it('renders every tone as a real orbit-badge', () => {
    const badges = fixture.nativeElement.querySelectorAll('orbit-badge');
    expect(badges.length).toBe(6);
  });
});
```

- [x] **Step 6: Run test to verify it fails**

Run: `npx ng test orbit-lab --include='**/pages/badge-page/badge-page.component.spec.ts'`
Expected: FAIL with "Cannot find module './badge-page.component'".

- [x] **Step 7: Write the Badge page component**

```ts
// projects/orbit-lab/src/app/pages/badge-page/badge-page.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitBadgeComponent, OrbitBadgeTone } from '@galileo/orbit';
import { LabBlockedBannerComponent } from '../../catalog/blocked-banner.component';

@Component({
  selector: 'lab-badge-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitBadgeComponent, LabBlockedBannerComponent],
  templateUrl: './badge-page.component.html',
})
export class BadgePageComponent {
  protected readonly tones: OrbitBadgeTone[] = [
    'primary',
    'success',
    'danger',
    'warning',
    'info',
    'neutral',
  ];
  protected readonly blockedFile = 'projects/orbit/src/lib/components/badge/badge.component.css';
  protected readonly blockedTokens = [
    '--orbit-font-family',
    '--orbit-font-size-xs',
    '--orbit-font-weight-semibold',
    '--orbit-radius-full',
  ];
}
```

- [x] **Step 8: Write the Badge page template**

```html
<!-- projects/orbit-lab/src/app/pages/badge-page/badge-page.component.html -->
<article>
  <h1>Badge</h1>
  <p>Etichetta di stato compatta, sei toni semantici.</p>

  <lab-blocked-banner [file]="blockedFile" [tokens]="blockedTokens" />

  <section>
    <h2>Toni</h2>
    @for (tone of tones; track tone) {
      <orbit-badge [tone]="tone" [label]="tone" />
    }
  </section>

  <section>
    <h2>Accessibilità</h2>
    <p>
      Il colore non è l'unico indicatore: ogni badge riporta anche il testo del tono/etichetta,
      mai solo un pallino colorato.
    </p>
  </section>
</article>
```

- [x] **Step 9: Run test to verify it passes**

Run: `npx ng test orbit-lab --include='**/pages/badge-page/badge-page.component.spec.ts'`
Expected: PASS (2 tests).

- [x] **Step 10: Add the route**

```ts
// projects/orbit-lab/src/app/app.routes.ts — append after the 'badge' entry added in Task 4 Step 6
  {
    path: 'form-grid',
    loadComponent: () =>
      import('./pages/form-grid-page/form-grid-page.component').then(
        (m) => m.FormGridPageComponent,
      ),
  },
```

(Forward reference to Task 6, same convention as Task 4 Step 6.)

- [x] **Step 11: Commit**

```bash
git add projects/orbit-lab/src/app/catalog/blocked-banner.component.ts \
        projects/orbit-lab/src/app/catalog/blocked-banner.component.spec.ts \
        projects/orbit-lab/src/app/pages/badge-page
git commit -m "feat(orbit-lab): add shared blocked-banner and Badge catalog page"
```

---

## Task 6: Form grid page (token-blocked)

**Files:**
- Create: `projects/orbit-lab/src/app/pages/form-grid-page/form-grid-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/form-grid-page/form-grid-page.component.html`
- Test: `projects/orbit-lab/src/app/pages/form-grid-page/form-grid-page.component.spec.ts`

**Interfaces:**
- Consumes: `OrbitFormGridComponent` from `@galileo/orbit` (no inputs; two content projection slots `[primary]` and `[secondary]`), `LabBlockedBannerComponent` from Task 5.

- [x] **Step 1: Write the failing test**

```ts
// projects/orbit-lab/src/app/pages/form-grid-page/form-grid-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FormGridPageComponent } from './form-grid-page.component';

describe('FormGridPageComponent', () => {
  let fixture: ComponentFixture<FormGridPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGridPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FormGridPageComponent);
    fixture.detectChanges();
  });

  it('shows the blocked banner with the exact form-grid tokens', () => {
    const banner = fixture.nativeElement.querySelector('[data-blocked-banner]');
    expect(banner.textContent).toContain('form-grid.component.css');
    expect(banner.textContent).toContain('--orbit-space-5');
  });

  it('renders a real orbit-form-grid with primary and secondary content', () => {
    const grid = fixture.nativeElement.querySelector('orbit-form-grid');
    expect(grid.querySelector('[primary]')).toBeTruthy();
    expect(grid.querySelector('[secondary]')).toBeTruthy();
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx ng test orbit-lab --include='**/pages/form-grid-page/form-grid-page.component.spec.ts'`
Expected: FAIL with "Cannot find module './form-grid-page.component'".

- [x] **Step 3: Write the component**

```ts
// projects/orbit-lab/src/app/pages/form-grid-page/form-grid-page.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitFormGridComponent } from '@galileo/orbit';
import { LabBlockedBannerComponent } from '../../catalog/blocked-banner.component';

@Component({
  selector: 'lab-form-grid-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitFormGridComponent, LabBlockedBannerComponent],
  templateUrl: './form-grid-page.component.html',
})
export class FormGridPageComponent {
  protected readonly blockedFile =
    'projects/orbit/src/lib/components/form-grid/form-grid.component.css';
  protected readonly blockedTokens = [
    '--orbit-space-2',
    '--orbit-space-3',
    '--orbit-space-4',
    '--orbit-space-5',
  ];
}
```

- [x] **Step 4: Write the template**

```html
<!-- projects/orbit-lab/src/app/pages/form-grid-page/form-grid-page.component.html -->
<article>
  <h1>Form grid</h1>
  <p>Layout a due colonne (7fr/5fr) per form con contenuto primario e secondario.</p>

  <lab-blocked-banner [file]="blockedFile" [tokens]="blockedTokens" />

  <section>
    <h2>Esempio base</h2>
    <orbit-form-grid>
      <div primary>Contenuto primario (7fr)</div>
      <div secondary>Contenuto secondario (5fr)</div>
    </orbit-form-grid>
  </section>

  <section>
    <h2>Comportamento responsive</h2>
    <p>
      Sotto 991.98px la griglia collassa a singola colonna: il proprio CSS lo gestisce già con
      una media query interna, verificabile ridimensionando la finestra.
    </p>
  </section>
</article>
```

- [x] **Step 5: Run test to verify it passes**

Run: `npx ng test orbit-lab --include='**/pages/form-grid-page/form-grid-page.component.spec.ts'`
Expected: PASS (2 tests).

- [x] **Step 6: Add the route**

```ts
// projects/orbit-lab/src/app/app.routes.ts — append after 'form-grid'
  {
    path: 'form-field',
    loadComponent: () =>
      import('./pages/form-field-page/form-field-page.component').then(
        (m) => m.FormFieldPageComponent,
      ),
  },
```

- [x] **Step 7: Commit**

```bash
git add projects/orbit-lab/src/app/pages/form-grid-page
git commit -m "feat(orbit-lab): add Form grid catalog page"
```

---

## Task 7: Form field page (token-blocked)

**Files:**
- Create: `projects/orbit-lab/src/app/pages/form-field-page/form-field-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/form-field-page/form-field-page.component.html`
- Test: `projects/orbit-lab/src/app/pages/form-field-page/form-field-page.component.spec.ts`

**Interfaces:**
- Consumes: `OrbitFormFieldComponent` (inputs: `label`, `inputId`, `hint`, `error`, `required`, `disabled`), `OrbitTextInputComponent` (used only as the projected control example — its own page is "stabilizing", but Form field's page needs *a* control to demonstrate label/hint/error association), `LabBlockedBannerComponent`.

- [x] **Step 1: Write the failing test**

```ts
// projects/orbit-lab/src/app/pages/form-field-page/form-field-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FormFieldPageComponent } from './form-field-page.component';

describe('FormFieldPageComponent', () => {
  let fixture: ComponentFixture<FormFieldPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FormFieldPageComponent);
    fixture.detectChanges();
  });

  it('shows the blocked banner with the exact form-field tokens', () => {
    const banner = fixture.nativeElement.querySelector('[data-blocked-banner]');
    expect(banner.textContent).toContain('form-field.component.css');
    expect(banner.textContent).toContain('--orbit-space-1');
  });

  it('renders a hint example and an error example', () => {
    expect(fixture.nativeElement.querySelector('[data-example="hint"] .orbit-form-field__hint')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-example="error"] .orbit-form-field__error')).toBeTruthy();
  });

  it('associates the label with the control via inputId/for', () => {
    const label = fixture.nativeElement.querySelector('[data-example="base"] label');
    const input = fixture.nativeElement.querySelector('[data-example="base"] input');
    expect(label.getAttribute('for')).toBe(input.id);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx ng test orbit-lab --include='**/pages/form-field-page/form-field-page.component.spec.ts'`
Expected: FAIL with "Cannot find module './form-field-page.component'".

- [x] **Step 3: Write the component**

```ts
// projects/orbit-lab/src/app/pages/form-field-page/form-field-page.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitFormFieldComponent, OrbitTextInputComponent } from '@galileo/orbit';
import { LabBlockedBannerComponent } from '../../catalog/blocked-banner.component';

@Component({
  selector: 'lab-form-field-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitFormFieldComponent, OrbitTextInputComponent, LabBlockedBannerComponent],
  templateUrl: './form-field-page.component.html',
})
export class FormFieldPageComponent {
  protected readonly blockedFile =
    'projects/orbit/src/lib/components/form-field/form-field.component.css';
  protected readonly blockedTokens = [
    '--orbit-font-family',
    '--orbit-font-size-sm',
    '--orbit-font-size-xs',
    '--orbit-font-weight-semibold',
    '--orbit-space-1',
  ];
}
```

- [x] **Step 4: Write the template**

```html
<!-- projects/orbit-lab/src/app/pages/form-field-page/form-field-page.component.html -->
<article>
  <h1>Form field</h1>
  <p>Associa label, hint ed errore a un controllo proiettato via <code>ng-content</code>.</p>

  <lab-blocked-banner [file]="blockedFile" [tokens]="blockedTokens" />

  <section>
    <h2>Esempio base</h2>
    <div data-example="base">
      <orbit-form-field label="Compagnia" inputId="fld-base" required>
        <orbit-text-input inputId="fld-base" />
      </orbit-form-field>
    </div>
  </section>

  <section>
    <h2>Con hint</h2>
    <div data-example="hint">
      <orbit-form-field label="Codice fiscale" inputId="fld-hint" hint="16 caratteri alfanumerici">
        <orbit-text-input inputId="fld-hint" />
      </orbit-form-field>
    </div>
  </section>

  <section>
    <h2>Con errore</h2>
    <div data-example="error">
      <orbit-form-field label="Email" inputId="fld-error" error="Formato non valido">
        <orbit-text-input inputId="fld-error" [invalid]="true" />
      </orbit-form-field>
    </div>
  </section>

  <section>
    <h2>Accessibilità</h2>
    <p>
      Nota: l'associazione dell'errore al controllo tramite <code>aria-describedby</code> non è
      ancora presente in <code>orbit-form-field</code> (il messaggio ha <code>role="alert"</code>
      ma non è collegato esplicitamente all'input). Segnalato come nota per Core, non corretto qui.
    </p>
  </section>
</article>
```

- [x] **Step 5: Run test to verify it passes**

Run: `npx ng test orbit-lab --include='**/pages/form-field-page/form-field-page.component.spec.ts'`
Expected: PASS (3 tests).

- [x] **Step 6: Add the route**

```ts
// projects/orbit-lab/src/app/app.routes.ts — append after 'form-field'
  {
    path: 'form-section',
    loadComponent: () =>
      import('./pages/form-section-page/form-section-page.component').then(
        (m) => m.FormSectionPageComponent,
      ),
  },
```

- [x] **Step 7: Commit**

```bash
git add projects/orbit-lab/src/app/pages/form-field-page
git commit -m "feat(orbit-lab): add Form field catalog page"
```

---

## Task 8: Form section page (token-blocked)

**Files:**
- Create: `projects/orbit-lab/src/app/pages/form-section-page/form-section-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/form-section-page/form-section-page.component.html`
- Test: `projects/orbit-lab/src/app/pages/form-section-page/form-section-page.component.spec.ts`

**Interfaces:**
- Consumes: `OrbitFormSectionComponent` (inputs: `title`, `divided`, `fill`, `contentSpacing` — **no `collapsible` input exists yet**, this page must not assume one), `LabBlockedBannerComponent`.

- [x] **Step 1: Write the failing test**

```ts
// projects/orbit-lab/src/app/pages/form-section-page/form-section-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FormSectionPageComponent } from './form-section-page.component';

describe('FormSectionPageComponent', () => {
  let fixture: ComponentFixture<FormSectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSectionPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FormSectionPageComponent);
    fixture.detectChanges();
  });

  it('shows the blocked banner with the exact form-section tokens', () => {
    const banner = fixture.nativeElement.querySelector('[data-blocked-banner]');
    expect(banner.textContent).toContain('form-section.component.css');
    expect(banner.textContent).toContain('--orbit-font-weight-bold');
  });

  it('renders a titled and a divided example', () => {
    expect(fixture.nativeElement.querySelector('[data-example="titled"] .orbit-form-section__title')).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('[data-example="divided"] .orbit-form-section--divided'),
    ).toBeTruthy();
  });

  it('notes the missing collapsible API instead of assuming it exists', () => {
    expect(fixture.nativeElement.textContent).toContain('non espone ancora');
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx ng test orbit-lab --include='**/pages/form-section-page/form-section-page.component.spec.ts'`
Expected: FAIL with "Cannot find module './form-section-page.component'".

- [x] **Step 3: Write the component**

```ts
// projects/orbit-lab/src/app/pages/form-section-page/form-section-page.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrbitFormSectionComponent } from '@galileo/orbit';
import { LabBlockedBannerComponent } from '../../catalog/blocked-banner.component';

@Component({
  selector: 'lab-form-section-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitFormSectionComponent, LabBlockedBannerComponent],
  templateUrl: './form-section-page.component.html',
})
export class FormSectionPageComponent {
  protected readonly blockedFile =
    'projects/orbit/src/lib/components/form-section/form-section.component.css';
  protected readonly blockedTokens = [
    '--orbit-font-family',
    '--orbit-font-weight-bold',
    '--orbit-font-size-xs',
    '--orbit-space-2',
    '--orbit-space-3',
  ];
}
```

- [x] **Step 4: Write the template**

```html
<!-- projects/orbit-lab/src/app/pages/form-section-page/form-section-page.component.html -->
<article>
  <h1>Form section</h1>
  <p>Raggruppa campi correlati sotto un titolo opzionale, con divisore facoltativo.</p>

  <lab-blocked-banner [file]="blockedFile" [tokens]="blockedTokens" />

  <section>
    <h2>Esempio con titolo</h2>
    <div data-example="titled">
      <orbit-form-section title="Dati polizza">
        <p>Contenuto della sezione.</p>
      </orbit-form-section>
    </div>
  </section>

  <section>
    <h2>Con divisore</h2>
    <div data-example="divided">
      <orbit-form-section title="Dati veicolo" [divided]="true">
        <p>Contenuto della sezione.</p>
      </orbit-form-section>
    </div>
  </section>

  <section>
    <h2>Nota</h2>
    <p>
      <code>orbit-form-section</code> non espone ancora un'API collassabile: non esiste alcun
      input <code>collapsible</code> nel componente reale oggi. Qualsiasi esempio di sezione
      "collassabile" andrebbe aggiunto solo dopo che Core avrà introdotto quella API (Fase 0 della
      spec Orbit Studio), non simulato qui con markup locale.
    </p>
  </section>
</article>
```

- [x] **Step 5: Run test to verify it passes**

Run: `npx ng test orbit-lab --include='**/pages/form-section-page/form-section-page.component.spec.ts'`
Expected: PASS (3 tests).

- [x] **Step 6: Add the route**

```ts
// projects/orbit-lab/src/app/app.routes.ts — append after 'form-section'
  {
    path: 'text-input',
    loadComponent: () =>
      import('./pages/stabilizing-page/stabilizing-page.component').then(
        (m) => m.StabilizingPageComponent,
      ),
    data: { componentName: 'Text input' },
  },
  {
    path: 'select',
    loadComponent: () =>
      import('./pages/stabilizing-page/stabilizing-page.component').then(
        (m) => m.StabilizingPageComponent,
      ),
    data: { componentName: 'Select' },
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import('./pages/stabilizing-page/stabilizing-page.component').then(
        (m) => m.StabilizingPageComponent,
      ),
    data: { componentName: 'Checkbox' },
  },
  {
    path: 'pill-switch',
    loadComponent: () =>
      import('./pages/stabilizing-page/stabilizing-page.component').then(
        (m) => m.StabilizingPageComponent,
      ),
    data: { componentName: 'Pill switch' },
  },
```

- [x] **Step 7: Commit**

```bash
git add projects/orbit-lab/src/app/pages/form-section-page
git commit -m "feat(orbit-lab): add Form section catalog page"
```

---

## Task 9: Stabilizing page (generic, for text-input/select/checkbox/pill-switch)

**Files:**
- Create: `projects/orbit-lab/src/app/pages/stabilizing-page/stabilizing-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/stabilizing-page/stabilizing-page.component.html`
- Test: `projects/orbit-lab/src/app/pages/stabilizing-page/stabilizing-page.component.spec.ts`

**Interfaces:**
- Consumes: Angular Router's `ActivatedRoute` snapshot `data.componentName` (set per-route in Task 8 Step 6).
- Produces: `StabilizingPageComponent`, reused by all four "stabilizing" routes.

- [x] **Step 1: Write the failing test**

```ts
// projects/orbit-lab/src/app/pages/stabilizing-page/stabilizing-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { StabilizingPageComponent } from './stabilizing-page.component';

describe('StabilizingPageComponent', () => {
  let fixture: ComponentFixture<StabilizingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StabilizingPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { componentName: 'Select' } } },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(StabilizingPageComponent);
    fixture.detectChanges();
  });

  it('shows the component name from route data', () => {
    expect(fixture.nativeElement.textContent).toContain('Select');
  });

  it('shows a stabilizing notice, not a blocked banner', () => {
    expect(fixture.nativeElement.querySelector('[data-stabilizing-notice]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx ng test orbit-lab --include='**/pages/stabilizing-page/stabilizing-page.component.spec.ts'`
Expected: FAIL with "Cannot find module './stabilizing-page.component'".

- [x] **Step 3: Write the component**

```ts
// projects/orbit-lab/src/app/pages/stabilizing-page/stabilizing-page.component.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lab-stabilizing-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stabilizing-page.component.html',
})
export class StabilizingPageComponent {
  protected readonly componentName: string =
    inject(ActivatedRoute).snapshot.data['componentName'] ?? '';
}
```

- [x] **Step 4: Write the template**

```html
<!-- projects/orbit-lab/src/app/pages/stabilizing-page/stabilizing-page.component.html -->
<article>
  <h1>{{ componentName }}</h1>
  <div data-stabilizing-notice role="note">
    <strong>In stabilizzazione Core</strong>
    <p>
      La pagina di catalogo per <strong>{{ componentName }}</strong> non è ancora stata scritta:
      il componente ha drift di token verificato (vedi la tabella di stato nella spec Lab) e Core
      deve completare la Fase 0 prima che valga la pena documentarne varianti e stati definitivi.
    </p>
  </div>
</article>
```

- [x] **Step 5: Run test to verify it passes**

Run: `npx ng test orbit-lab --include='**/pages/stabilizing-page/stabilizing-page.component.spec.ts'`
Expected: PASS (2 tests).

- [x] **Step 6: Run the full orbit-lab suite and build**

Run: `npx ng test orbit-lab`
Expected: PASS, all suites from Tasks 1–9 green.

Run: `npx ng build orbit-lab`
Expected: build succeeds with no missing-token or missing-route errors.

- [x] **Step 7: Commit**

```bash
git add projects/orbit-lab/src/app/pages/stabilizing-page
git commit -m "feat(orbit-lab): add generic stabilizing page for text-input/select/checkbox/pill-switch"
```

---

## Self-review notes (for whoever executes this plan)

- Every route added in Tasks 4–9 is shown in the exact array-append form; when executing tasks out of order, re-open `app.routes.ts` and confirm all previously-added entries are still present before appending the next one.
- `LabBlockedBannerComponent` (Task 5) is the only shared UI unit; Tasks 6–8 reuse it rather than duplicating banner markup — do not recreate the banner locally in those pages.
- No task touches `projects/orbit/src/**` or `projects/orbit-studio/**`, per the Global Constraints.
- Verified for real after implementation: `npx ng test orbit-lab` → 9 test files, 29 tests, all passing; `npx ng build orbit-lab` → succeeds, one lazy chunk per routed page. Node is available via `nvm` (`source ~/.nvm/nvm.sh && nvm use 24.16.0`) even when not active by default in a fresh shell.
