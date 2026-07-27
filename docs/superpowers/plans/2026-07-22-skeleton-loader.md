# Skeleton Loader Implementation Plan

> **Stato:** Completato
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add `OrbitSkeletonComponent` — a stateless, presentational loading placeholder (text/circle/rect shapes) to the `orbit` library, plus a catalog demo page in `orbit-lab` that shows all three shapes and a simulated-loading-to-real-content example.

**Architecture:** One host-only Angular component (`template: ''`, all rendering via host bindings + CSS, following the `OrbitDividerComponent` pattern) with a computed `resolvedHeight` signal that derives a shape-appropriate default height when none is passed explicitly. A CSS keyframe shimmer animates the background, disabled under `prefers-reduced-motion: reduce`. The `orbit-lab` catalog page reuses the `lab-example` / catalog-entry / lazy-route pattern established by every other catalog page (e.g. `slider-page`).

**Tech Stack:** Angular 22, standalone components, signals (`input`, `computed`), OnPush change detection, zoneless (`provideZonelessChangeDetection()` in `orbit-lab`), Vitest as the test runner (not Jasmine/Karma — `describe`/`it`/`expect`/`vi` imported from `'vitest'`).

## Global Constraints

- Component file: `projects/orbit/src/lib/components/skeleton/skeleton.component.ts` / `.css` (no `.html` — host-only template, matching `OrbitDividerComponent`).
- Public API: `export type OrbitSkeletonShape = 'text' | 'circle' | 'rect'`; inputs `shape` (default `'text'`), `width` (default `'100%'`), `height` (default `undefined`, shape-derived when unset).
- Host bindings only (no `@HostBinding`/`@HostListener` decorators) — use the `host: {}` metadata object, matching every existing Orbit component.
- `aria-hidden="true"` must always be present on the host element.
- Must respect `prefers-reduced-motion: reduce` — this repo has exactly one existing precedent, a **global** rule in `projects/orbit/src/styles/styles.css:123-132` that force-collapses all animation/transition durations to `0.01ms`. That global rule already neutralizes the shimmer for reduced-motion users touching the full `orbit-lab`/consumer app. This plan **additionally** puts an explicit, component-scoped `@media (prefers-reduced-motion: reduce)` block directly in `skeleton.component.css` (removing the background-image/animation outright, not just shortening its duration) so the component is correct in isolation too — e.g. inside a library consumer that doesn't import `styles.css`, or a future unit/visual test that only mounts this one component. This is the first *component-level* `prefers-reduced-motion` rule in Orbit; document it in the component's file as the pattern for future indeterminate spinners/progress-bars (per spec, out of scope to change those now).
- New catalog entry: slug `skeleton`, icon `square` (already registered — no new icon work).
- Test runner invocation (node is managed by nvm, not on PATH):
  - `orbit` lib: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
  - `orbit-lab`: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"` (isolates from an unrelated in-progress page in that directory — do not move/delete `examples-page`).
- Do not run any `git` commands (no commits, no branch changes) as part of this plan — a human will review and commit separately.
- Known pre-existing failure, unrelated to this plan: `projects/orbit-lab/src/app/catalog/catalog.spec.ts` — `'lists every entry in alphabetical label order'` **already fails on `main`** before any change in this plan (verified by running the suite: `CATALOG_ENTRIES` labels are not fully sorted, e.g. `'Barra di navigazione'` precedes `'Badge'`, `'Layout'` precedes `'Input di testo'`). This plan inserts the new `skeleton` entry in locally-correct alphabetical position (`'Skeleton'` sorts between `'Sezioni modulo'` and `'Slider'`) but does **not** attempt to fix the pre-existing global ordering bug — that is out of scope. Do not treat that one pre-existing failure as a regression introduced by this plan.

---

### Task 1: `OrbitSkeletonComponent` in the `orbit` library

**Files:**
- Create: `projects/orbit/src/lib/components/skeleton/skeleton.component.ts`
- Create: `projects/orbit/src/lib/components/skeleton/skeleton.component.css`
- Create: `projects/orbit/src/lib/components/skeleton/index.ts`
- Create: `projects/orbit/src/lib/components/skeleton/skeleton.component.spec.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Consumes: existing tokens `--orbit-surface-subtle`, `--orbit-text-primary`, `--orbit-font-size-body`, `--orbit-line-height-body`, `--orbit-radius-sm`, `--orbit-radius-control` (all already defined in `projects/orbit/src/styles/tokens.css`, confirmed present).
- Produces (for Task 2 and any future consumer): selector `orbit-skeleton`, exported symbols `OrbitSkeletonComponent` and `OrbitSkeletonShape` from `@galileo/orbit` (via `projects/orbit/src/public-api.ts`), inputs `shape: OrbitSkeletonShape` (default `'text'`), `width: string` (default `'100%'`), `height: string | undefined` (default `undefined`).

- [x] **Step 1: Write the failing spec file**

Create `projects/orbit/src/lib/components/skeleton/skeleton.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitSkeletonComponent } from './skeleton.component';

describe('OrbitSkeletonComponent', () => {
  let fixture: ComponentFixture<OrbitSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrbitSkeletonComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('is always aria-hidden, since a skeleton must never be announced by a screen reader', () => {
    expect(fixture.nativeElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('defaults to the text shape', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('orbit-skeleton--text')).toBe(true);
    expect(host.classList.contains('orbit-skeleton--circle')).toBe(false);
    expect(host.classList.contains('orbit-skeleton--rect')).toBe(false);
  });

  it('applies the circle shape class and removes the others', () => {
    fixture.componentRef.setInput('shape', 'circle');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('orbit-skeleton--circle')).toBe(true);
    expect(host.classList.contains('orbit-skeleton--text')).toBe(false);
    expect(host.classList.contains('orbit-skeleton--rect')).toBe(false);
  });

  it('applies the rect shape class and removes the others', () => {
    fixture.componentRef.setInput('shape', 'rect');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('orbit-skeleton--rect')).toBe(true);
    expect(host.classList.contains('orbit-skeleton--text')).toBe(false);
    expect(host.classList.contains('orbit-skeleton--circle')).toBe(false);
  });

  it('defaults width to 100%', () => {
    expect((fixture.nativeElement as HTMLElement).style.width).toBe('100%');
  });

  it('applies an explicit width', () => {
    fixture.componentRef.setInput('width', '3rem');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).style.width).toBe('3rem');
  });

  it('defaults height to a text-row height derived from typography tokens when shape is text', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.height).toBe('calc(var(--orbit-font-size-body) * var(--orbit-line-height-body))');
  });

  it('defaults height to a text-row height derived from typography tokens when shape is rect', () => {
    fixture.componentRef.setInput('shape', 'rect');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.height).toBe('calc(var(--orbit-font-size-body) * var(--orbit-line-height-body))');
  });

  it('defaults height to the width when shape is circle, so a bare width produces a true circle', () => {
    fixture.componentRef.setInput('shape', 'circle');
    fixture.componentRef.setInput('width', '3rem');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.height).toBe('3rem');
  });

  it('lets an explicit height override the shape-derived default, for every shape', () => {
    for (const shape of ['text', 'circle', 'rect'] as const) {
      fixture.componentRef.setInput('shape', shape);
      fixture.componentRef.setInput('height', '2.5rem');
      fixture.detectChanges();
      expect((fixture.nativeElement as HTMLElement).style.height).toBe('2.5rem');
    }
  });
});
```

- [x] **Step 2: Run the spec to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: FAIL — `Cannot find module './skeleton.component'` (or similar resolution error), since `skeleton.component.ts` does not exist yet.

- [x] **Step 3: Implement `OrbitSkeletonComponent`**

Create `projects/orbit/src/lib/components/skeleton/skeleton.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type OrbitSkeletonShape = 'text' | 'circle' | 'rect';

/**
 * Height of a single text row, derived from the body typography tokens rather
 * than a bare `1em`, so the default stays correct regardless of what
 * font-size the skeleton happens to inherit from its DOM position.
 */
const TEXT_ROW_HEIGHT = 'calc(var(--orbit-font-size-body) * var(--orbit-line-height-body))';

/**
 * Purely presentational loading placeholder. Stateless: the parent decides
 * when to render it instead of real content, typically via
 * `@if (loading()) { <orbit-skeleton ... /> } @else { ... }`.
 *
 * No `.html` template: like `OrbitDividerComponent`, the whole visual is the
 * host element itself, styled and shaped via host bindings + CSS classes.
 */
@Component({
  selector: 'orbit-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styleUrl: './skeleton.component.css',
  host: {
    '[class.orbit-skeleton--text]': "shape() === 'text'",
    '[class.orbit-skeleton--circle]': "shape() === 'circle'",
    '[class.orbit-skeleton--rect]': "shape() === 'rect'",
    '[style.width]': 'width()',
    '[style.height]': 'resolvedHeight()',
    '[attr.aria-hidden]': 'true',
  },
})
export class OrbitSkeletonComponent {
  shape = input<OrbitSkeletonShape>('text');
  width = input<string>('100%');
  /** When unset, derived from `shape()` — see `resolvedHeight`. */
  height = input<string | undefined>(undefined);

  /**
   * Resolves the effective height. An explicit `height()` always wins.
   * Otherwise: `circle` defaults to `width()` (a bare width alone produces a
   * true circle); `text` and `rect` both default to one typography text-row
   * height — the spec only describes a default for `text`; `rect` (used for
   * generic image/block placeholders) is left to the caller to size via an
   * explicit `height` in the common case, but still needs *some* sane
   * default when omitted, so it reuses the same text-row height rather than
   * inventing a new arbitrary constant.
   */
  protected readonly resolvedHeight = computed(() => {
    const explicit = this.height();
    if (explicit) {
      return explicit;
    }
    if (this.shape() === 'circle') {
      return this.width();
    }
    return TEXT_ROW_HEIGHT;
  });
}
```

- [x] **Step 4: Add the shimmer stylesheet, with the reduced-motion override**

Create `projects/orbit/src/lib/components/skeleton/skeleton.component.css`:

```css
:host {
  display: block;
  overflow: hidden;
  background-color: var(--orbit-surface-subtle);
  /* Local, component-scoped variable — reuses the existing text-color token
     via color-mix so the shimmer overlay automatically adapts to light/dark
     theme without a new semantic token or a duplicated dark-mode override. */
  --orbit-skeleton-shimmer: color-mix(in srgb, var(--orbit-text-primary) 8%, transparent);
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    var(--orbit-skeleton-shimmer) 50%,
    transparent 100%
  );
  background-repeat: no-repeat;
  background-size: 200% 100%;
  animation: orbit-skeleton-shimmer 1.6s ease-in-out infinite;
}

:host(.orbit-skeleton--text) {
  border-radius: var(--orbit-radius-sm);
}

:host(.orbit-skeleton--circle) {
  border-radius: 50%;
}

:host(.orbit-skeleton--rect) {
  border-radius: var(--orbit-radius-control);
}

@keyframes orbit-skeleton-shimmer {
  0% {
    background-position: 150% 0;
  }
  100% {
    background-position: -50% 0;
  }
}

/*
 * First component-level `prefers-reduced-motion` rule in Orbit (the only
 * prior precedent, in styles.css, is a *global* rule that shortens all
 * animation/transition durations to 0.01ms — it does not remove the
 * shimmer's background-image, and it only applies where styles.css is
 * loaded). This component additionally disables its own animation and
 * flattens to the plain base color, so it is correct standalone too.
 * Future indeterminate spinners/progress-bars should adopt the same
 * per-component pattern (out of scope here).
 */
@media (prefers-reduced-motion: reduce) {
  :host {
    animation: none;
    background-image: none;
  }
}
```

- [x] **Step 5: Add the barrel export**

Create `projects/orbit/src/lib/components/skeleton/index.ts`:

```typescript
export { OrbitSkeletonComponent } from './skeleton.component';
export type { OrbitSkeletonShape } from './skeleton.component';
```

- [x] **Step 6: Wire the barrel into the library's public API**

Modify `projects/orbit/src/public-api.ts` — add the export right after the `badge` line (both are simple, tokens-only display components):

```typescript
export * from './lib/components/badge';
export * from './lib/components/skeleton';
```

- [x] **Step 7: Run the spec to verify it passes**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: PASS — all `OrbitSkeletonComponent` tests green, no other `orbit` suite regressions.

- [x] **Step 8: Commit**

Do not run `git` commands — leave the working tree as-is for the human to review and commit.

---

### Task 2: `skeleton` catalog page in `orbit-lab`

**Files:**
- Create: `projects/orbit-lab/src/app/pages/skeleton-page/skeleton-page.component.ts`
- Create: `projects/orbit-lab/src/app/pages/skeleton-page/skeleton-page.component.html`
- Create: `projects/orbit-lab/src/app/pages/skeleton-page/skeleton-page.component.css`
- Create: `projects/orbit-lab/src/app/pages/skeleton-page/skeleton-page.component.spec.ts`
- Modify: `projects/orbit-lab/src/app/catalog/catalog.ts`
- Modify: `projects/orbit-lab/src/app/app.routes.ts`

**Interfaces:**
- Consumes: `OrbitSkeletonComponent`, `OrbitSkeletonShape` from `@galileo/orbit` (Task 1); `LabExampleComponent` from `projects/orbit-lab/src/app/catalog/example-panel.component.ts` (input `code: string`); `CatalogEntry` shape from `projects/orbit-lab/src/app/catalog/catalog-entry.model.ts` (`slug`, `label`, `status`, `icon: OrbitIconName`).
- Produces: route path `skeleton` lazy-loading `SkeletonPageComponent`; catalog entry `{ slug: 'skeleton', label: 'Skeleton', status: 'verified', icon: 'square' }`.

- [x] **Step 1: Write the failing spec file**

Create `projects/orbit-lab/src/app/pages/skeleton-page/skeleton-page.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { SkeletonPageComponent } from './skeleton-page.component';

describe('SkeletonPageComponent', () => {
  let fixture: ComponentFixture<SkeletonPageComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [SkeletonPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SkeletonPageComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the three static shape examples', () => {
    const skeletons = fixture.nativeElement.querySelectorAll('orbit-skeleton');
    // 3 static examples (text, circle, rect) + 2 per loading card while loading (3 cards).
    expect(skeletons.length).toBe(3 + 3 * 2);
  });

  it('shows skeletons instead of real content in the simulated-loading example before the timeout', () => {
    const loadingContainer = fixture.nativeElement.querySelector('[data-example="loading-cards"]');
    expect(loadingContainer.querySelectorAll('orbit-skeleton').length).toBe(6);
    expect(loadingContainer.querySelectorAll('h3').length).toBe(0);
  });

  it('replaces the skeletons with real card content once the simulated load completes', () => {
    vi.advanceTimersByTime(1800);
    fixture.detectChanges();

    const loadingContainer = fixture.nativeElement.querySelector('[data-example="loading-cards"]');
    expect(loadingContainer.querySelectorAll('orbit-skeleton').length).toBe(0);
    expect(loadingContainer.querySelectorAll('h3').length).toBe(3);
    expect(loadingContainer.textContent).toContain('Rilascio v2.4');
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-skeleton',
    );
  });
});
```

- [x] **Step 2: Run the spec to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: FAIL — `Cannot find module './skeleton-page.component'`.

- [x] **Step 3: Implement `SkeletonPageComponent`**

Create `projects/orbit-lab/src/app/pages/skeleton-page/skeleton-page.component.ts`:

```typescript
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { OrbitSkeletonComponent } from '@galileo/orbit';
import { LabExampleComponent } from '../../catalog/example-panel.component';

interface SkeletonDemoCard {
  id: number;
  title: string;
  body: string;
}

/** How long the simulated-loading example keeps showing skeletons before revealing real content. */
const SIMULATED_LOAD_DELAY_MS = 1800;

@Component({
  selector: 'lab-skeleton-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitSkeletonComponent, LabExampleComponent],
  templateUrl: './skeleton-page.component.html',
  styleUrl: './skeleton-page.component.css',
})
export class SkeletonPageComponent {
  protected readonly textSnippet = '<orbit-skeleton shape="text" width="70%" />';
  protected readonly circleSnippet = '<orbit-skeleton shape="circle" width="3rem" />';
  protected readonly rectSnippet = '<orbit-skeleton shape="rect" width="100%" height="8rem" />';
  protected readonly loadingSnippet =
    '@if (loading()) {\n' +
    '  <orbit-skeleton shape="text" width="60%" />\n' +
    '  <orbit-skeleton shape="rect" width="100%" height="4rem" />\n' +
    '} @else {\n' +
    '  <h3>{{ card.title }}</h3>\n' +
    '  <p>{{ card.body }}</p>\n' +
    '}';

  protected readonly cardsLoading = signal(true);
  protected readonly cards: readonly SkeletonDemoCard[] = [
    { id: 1, title: 'Rilascio v2.4', body: 'Nuove funzionalità per la gestione degli allegati.' },
    {
      id: 2,
      title: 'Manutenzione pianificata',
      body: 'Finestra di manutenzione sabato dalle 02:00 alle 04:00.',
    },
    {
      id: 3,
      title: 'Nuovo componente',
      body: 'Lo skeleton loader è ora disponibile nel design system.',
    },
  ];

  constructor() {
    // Simulates an async fetch: swaps the placeholder cards for real content
    // once, after a fixed delay, so the catalog page demonstrates the
    // typical `@if (loading()) { skeleton } @else { content }` transition.
    setTimeout(() => this.cardsLoading.set(false), SIMULATED_LOAD_DELAY_MS);
  }
}
```

- [x] **Step 4: Write the template**

Create `projects/orbit-lab/src/app/pages/skeleton-page/skeleton-page.component.html`:

```html
<article>
  <h1>Skeleton</h1>
  <p>
    Placeholder di caricamento per contenuti asincroni (liste, card, testo che arriva da rete):
    mostra la forma approssimativa del contenuto finale mentre viene caricato, riducendo il
    "flash of empty content".
  </p>

  <section>
    <h2>Forme</h2>
    <lab-example [code]="textSnippet">
      <orbit-skeleton shape="text" width="70%" />
    </lab-example>
    <lab-example [code]="circleSnippet">
      <orbit-skeleton shape="circle" width="3rem" />
    </lab-example>
    <lab-example [code]="rectSnippet">
      <orbit-skeleton shape="rect" width="100%" height="8rem" />
    </lab-example>
  </section>

  <section>
    <h2>Caricamento simulato</h2>
    <p>
      Le card sottostanti restano in stato skeleton per {{ 1800 / 1000 }}s, poi transitano al
      contenuto reale, per verificare visivamente la transizione da placeholder a dato caricato.
    </p>
    <lab-example [code]="loadingSnippet">
      <div class="skeleton-page__cards" data-example="loading-cards">
        @for (card of cards; track card.id) {
          <div class="skeleton-page__card">
            @if (cardsLoading()) {
              <orbit-skeleton shape="text" width="60%" />
              <orbit-skeleton shape="rect" width="100%" height="4rem" />
            } @else {
              <h3>{{ card.title }}</h3>
              <p>{{ card.body }}</p>
            }
          </div>
        }
      </div>
    </lab-example>
  </section>

  <section>
    <h2>Accessibilità</h2>
    <ul>
      <li>
        Ogni <code>orbit-skeleton</code> è <code>aria-hidden="true"</code>: non viene mai
        annunciato da uno screen reader, che deve ignorare il placeholder e attendere il
        contenuto reale.
      </li>
      <li>
        L'animazione shimmer rispetta <code>prefers-reduced-motion: reduce</code>: se l'utente ha
        disattivato le animazioni di sistema, viene mostrato solo il colore piatto di base, senza
        movimento.
      </li>
    </ul>
  </section>
</article>
```

- [x] **Step 5: Add the card layout stylesheet**

Create `projects/orbit-lab/src/app/pages/skeleton-page/skeleton-page.component.css`:

```css
.skeleton-page__cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: var(--orbit-space-4);
  width: 100%;
}

.skeleton-page__card {
  display: grid;
  gap: var(--orbit-space-2);
  padding: var(--orbit-space-4);
  border: 1px solid var(--orbit-border-subtle);
  border-radius: var(--orbit-radius-surface);
  background: var(--orbit-surface-default);
}

.skeleton-page__card h3 {
  margin: 0;
  color: var(--orbit-text-primary);
  font-size: var(--orbit-font-size-body);
  font-weight: var(--orbit-font-weight-emphasis);
}

.skeleton-page__card p {
  margin: 0;
  color: var(--orbit-text-secondary);
  font-size: var(--orbit-font-size-body);
}
```

- [x] **Step 6: Register the catalog entry**

Modify `projects/orbit-lab/src/app/catalog/catalog.ts` — insert the new entry between `form-section` (`'Sezioni modulo'`) and `slider` (`'Slider'`), which is the locally-correct alphabetical slot (`'Skeleton'` sorts between them):

```typescript
  { slug: 'form-section', label: 'Sezioni modulo', status: 'verified', icon: 'layers' },
  { slug: 'skeleton', label: 'Skeleton', status: 'verified', icon: 'square' },
  { slug: 'slider', label: 'Slider', status: 'verified', icon: 'slider' },
```

- [x] **Step 7: Register the lazy route**

Modify `projects/orbit-lab/src/app/app.routes.ts` — add the route next to `slider` (alphabetically adjacent in the routes array too, though route order itself isn't asserted by any test):

```typescript
  {
    path: 'skeleton',
    loadComponent: () =>
      import('./pages/skeleton-page/skeleton-page.component').then(
        (m) => m.SkeletonPageComponent,
      ),
  },
  {
    path: 'slider',
    loadComponent: () =>
      import('./pages/slider-page/slider-page.component').then((m) => m.SliderPageComponent),
  },
```

- [x] **Step 8: Run the orbit-lab suite to verify the new specs pass**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: PASS for `SkeletonPageComponent` and all pre-existing suites, **except** the already-known-broken `catalog.spec.ts` alphabetical-order test (see Global Constraints — that failure predates this plan and is not a regression to fix here).

- [x] **Step 9: Commit**

Do not run `git` commands — leave the working tree as-is for the human to review and commit.

---

### Task 3: Full verification pass

**Files:** none (verification only).

**Interfaces:** none.

- [x] **Step 1: Run the full `orbit` library suite**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run test:core -- --watch=false`
Expected: PASS, including all `OrbitSkeletonComponent` tests from Task 1, with zero regressions in any other `orbit` component suite.

- [x] **Step 2: Run the full `orbit-lab` suite (excluding the in-progress `examples-page` directory)**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npx ng test orbit-lab --watch=false --exclude="projects/orbit-lab/src/app/pages/examples-page/**"`
Expected: PASS for every suite except the pre-existing `catalog.spec.ts` alphabetical-order failure documented in Global Constraints. Confirm no *new* failures were introduced (diff the failing-test list against the pre-change baseline: only that one test should be red, and it should be red for the same reason as before — `'Barra di navigazione'`/`'Badge'` and `'Layout'`/`'Input di testo'` ordering, not anything related to the new `skeleton` entry).

- [x] **Step 3: Manual visual smoke check (optional but recommended)**

Run: `source ~/.nvm/nvm.sh && nvm use v24.16.0 && npm run start` (serves `orbit-lab`), then navigate to `/skeleton` in the browser and confirm:
- The three shape examples render with visible shimmer motion.
- The "Caricamento simulato" card grid shows skeletons for ~1.8s, then swaps to the three real cards (titles: "Rilascio v2.4", "Manutenzione pianificata", "Nuovo componente").
- With OS-level "reduce motion" enabled (e.g. `prefers-reduced-motion: reduce` via browser devtools rendering emulation), the shimmer stops moving and only the flat base color remains.

- [x] **Step 4: Self-review against the spec**

Confirm every spec requirement maps to a task:
- Component shape/inputs/host bindings (spec lines 17-33) → Task 1, Step 3.
- Shape-specific default heights and border-radius (spec lines 35-39) → Task 1, Steps 3-4 (with the `rect`-default gap explicitly resolved and documented, since the spec only defines a default for `text`).
- Shimmer animation + `prefers-reduced-motion` (spec lines 41-43) → Task 1, Step 4 (confirmed no existing component-level precedent via repo-wide grep — only the pre-existing global rule in `styles.css`).
- Token reuse, no new semantic token (spec lines 45-47) → Task 1, Step 4 (`--orbit-surface-subtle` base + local `--orbit-skeleton-shimmer` via `color-mix`).
- Stateless data flow / no service (spec lines 49-51) → Task 1, Step 3 (plain `input()`s, no service, no internal loading state).
- No runtime validation of malformed CSS dimensions (spec lines 53-55) → Task 1, Step 3 (inputs are opaque `string`s, no parsing/validation).
- Unit tests: shape/border-radius, default/overridden height, `aria-hidden` (spec lines 57-59) → Task 1, Steps 1 and 7.
- Manual test: catalog page with simulated-loading card list (spec line 60) → Task 2, Steps 3-5 and Task 3, Step 3.
- Catalog entry `skeleton` / icon `square` / route + page, `slider-page` pattern (spec lines 62-64) → Task 2, Steps 3-7.

No gaps found. All tasks are complete as written; do not proceed to implementation without re-running this checklist if the spec changes.
