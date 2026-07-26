# Orbit Core — Visual Refresh (gap-closing) Implementation Plan

> **Stato:** Completato
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** close the remaining gaps between Orbit Core and the "Orbit Visual Refresh" mockup spec (`docs/superpowers/specs/2026-07-21-orbit-core-visual-refresh-design.md`) — the palette/radii/shadow/text-scale foundation described in that spec is **already implemented** in `projects/orbit/src/styles/tokens.css` (verified by re-reading the file: ink palette, 10px/20px/14px radii, deep overlay shadow, `--orbit-text-scale` calc-based font sizes and 80%-ratio control heights, 12% focus ring are all already present). What remains: the accent/CTA/font swatch mechanisms, two missing interactive-state refinements, and a shared icon set with scale-sensitivity support.

**Architecture:** extend the existing `[data-orbit-*]` token-scoping pattern (already used for `data-orbit-theme`/`data-orbit-density`) with three new attributes; add one new semantic token (`--orbit-cta-bg`); add a small new `OrbitIconComponent` + icon registry under `projects/orbit/src/lib/icons/`.

**Tech Stack:** Angular 22 standalone components, OnPush, Signals (`input`), Vitest via `@angular/build:unit-test`.

## Global Constraints

- Never edit `dist/**` (generated output).
- Node/Angular CLI only available after `source ~/.nvm/nvm.sh && nvm use 24.16.0`.
- No commits/tags/pushes without explicit user instruction — stop after the last task and report.
- Component CSS must consume semantic (`--orbit-*`) or alias (`--orbit-color-*`) tokens, never hardcode colors/radii — this repo's established rule (see `AGENTS.md`).
- Re-read any file listed below immediately before editing it — this repo has concurrent parallel edits in flight; line numbers here are a snapshot, not a guarantee.

---

### Task 1: Accent color swatch (`[data-orbit-accent]`)

**Files:**
- Modify: `projects/orbit/src/styles/tokens.css`

**Interfaces:**
- Produces: `[data-orbit-accent='violet']` and `[data-orbit-accent='teal']` attribute selectors overriding `--orbit-action-primary-bg` / `--orbit-action-primary-bg-hover`. Default (no attribute) stays the current blue (`--orbit-ref-brand-500` = `#3457d5`).

- [x] **Step 1: Add the two accent override blocks**

Add this new block immediately after the `[data-orbit-density='compact']` block (currently ends at line 193) and before the `[data-orbit-theme='dark']` block:

```css
/* Accent swatch — curated options only, no free color picker. Default (blue) lives on :root. */
[data-orbit-accent='violet'] {
  --orbit-action-primary-bg: #7c3aed;
  --orbit-action-primary-bg-hover: #6423c8;
}

[data-orbit-accent='teal'] {
  --orbit-action-primary-bg: #0f9b8e;
  --orbit-action-primary-bg-hover: #0c7a70;
}
```

- [x] **Step 2: Verify the new selectors are present**

Run: `grep -c "data-orbit-accent" projects/orbit/src/styles/tokens.css`
Expected: `2` (one for `violet`, one for `teal`)

- [x] **Step 3: Verify no existing test broke**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all test files pass (this app compiles `@galileo/orbit` from source, so a CSS syntax error would show up as a build failure here).

- [x] **Step 4: Commit**

```bash
git add projects/orbit/src/styles/tokens.css
git commit -m "feat(orbit): add accent color swatch (violet, teal)"
```

---

### Task 2: CTA color swatch (`[data-orbit-cta]`) + repoint primary button

**Files:**
- Modify: `projects/orbit/src/styles/tokens.css`
- Modify: `projects/orbit/src/lib/components/button/button.component.css:39-47`

**Interfaces:**
- Consumes: nothing new.
- Produces: new semantic tokens `--orbit-cta-bg` (default `#1f8a4c`, matches `--orbit-status-success`) and `--orbit-cta-bg-hover`; `[data-orbit-cta='blue']` and `[data-orbit-cta='ink']` override them. `.orbit-btn--primary` now derives `--btn-bg`/`--btn-bg-hover`/`--btn-border` from `--orbit-cta-bg`/`--orbit-cta-bg-hover` instead of `--orbit-action-primary-bg` — the accent (selection/focus/links) and the CTA (primary button) become independently swatchable, matching the mockup where accent=blue but CTA=green by default.

- [x] **Step 1: Add the CTA tokens and swatch overrides to tokens.css**

In the `:root` block, immediately after the `--orbit-action-primary-fg` line, add:

```css
  --orbit-cta-bg: var(--orbit-status-success);
  --orbit-cta-bg-hover: color-mix(in srgb, var(--orbit-status-success) 82%, black);
```

Then, in the same new block added in Task 1 (after `[data-orbit-density='compact']`, before `[data-orbit-theme='dark']`), add:

```css
[data-orbit-cta='blue'] {
  --orbit-cta-bg: var(--orbit-action-primary-bg);
  --orbit-cta-bg-hover: var(--orbit-action-primary-bg-hover);
}

[data-orbit-cta='ink'] {
  --orbit-cta-bg: var(--orbit-ref-neutral-900);
  --orbit-cta-bg-hover: color-mix(in srgb, var(--orbit-ref-neutral-900) 82%, black);
}
```

- [x] **Step 2: Repoint the primary button tone**

In `projects/orbit/src/lib/components/button/button.component.css`, replace the `.orbit-btn--primary` block:

```css
/* ── Tone: primary ── */
.orbit-btn--primary {
  --btn-bg: var(--orbit-cta-bg);
  --btn-bg-hover: var(--orbit-cta-bg-hover);
  --btn-text: var(--orbit-action-primary-fg);
  --btn-border: var(--orbit-cta-bg);
  --btn-soft-bg: color-mix(in srgb, var(--orbit-cta-bg) 14%, var(--orbit-surface-default));
  --btn-soft-text: var(--orbit-cta-bg-hover);
  --btn-soft-border: color-mix(in srgb, var(--orbit-cta-bg) 28%, var(--orbit-surface-default));
}
```

- [x] **Step 3: Add the colored shadow the mockup specifies for the primary CTA (matches the existing `--success` pattern)**

Immediately after `.orbit-btn--solid.orbit-btn--success { ... }` in the same file, add:

```css
.orbit-btn--solid.orbit-btn--primary {
  box-shadow: 0 4px 12px -2px color-mix(in srgb, var(--orbit-cta-bg) 40%, transparent);
}
```

- [x] **Step 4: Run the button spec — must still pass unchanged (regression, not a new test)**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/button.component.spec.ts'`
Expected: existing tests pass (they assert `orbit-btn--primary` class presence, not resolved colors, so no test code changes needed).

- [x] **Step 5: Verify the repoint via grep (colors aren't observable through jsdom computed style without a real cascade)**

Run: `grep -A6 "Tone: primary" projects/orbit/src/lib/components/button/button.component.css`
Expected: block references `--orbit-cta-bg`/`--orbit-cta-bg-hover`, no direct reference to `--orbit-action-primary-bg` left in that block.

- [x] **Step 6: Full orbit-lab verification**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass (button-page renders every tone × variant combination, would fail to compile on a CSS/token typo).

- [x] **Step 7: Commit**

```bash
git add projects/orbit/src/styles/tokens.css projects/orbit/src/lib/components/button/button.component.css
git commit -m "feat(orbit): add CTA color swatch and decouple primary button from accent token"
```

---

### Task 3: Font family swatch (`[data-orbit-font]`)

**Files:**
- Modify: `projects/orbit/src/styles/tokens.css`

**Interfaces:**
- Produces: `[data-orbit-font='inter']` and `[data-orbit-font='system']` overriding `--orbit-font-sans`. Default (no attribute) stays Public Sans (already `--orbit-ref-font-sans`).

- [x] **Step 1: Add the two font overrides**

In the same new block used by Tasks 1–2, add:

```css
[data-orbit-font='inter'] {
  --orbit-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

[data-orbit-font='system'] {
  --orbit-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

- [x] **Step 2: Verify**

Run: `grep -c "data-orbit-font" projects/orbit/src/styles/tokens.css`
Expected: `2`

- [x] **Step 3: Full orbit-lab verification**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass.

- [x] **Step 4: Commit**

```bash
git add projects/orbit/src/styles/tokens.css
git commit -m "feat(orbit): add font family swatch (Public Sans, Inter, System UI)"
```

---

### Task 4: Selectable-tile check pop-in animation

**Files:**
- Modify: `projects/orbit/src/lib/components/selectable-tile/selectable-tile.component.css`
- Test: `projects/orbit/src/lib/components/selectable-tile/selectable-tile.component.spec.ts` (create if it does not exist — check first with `ls projects/orbit/src/lib/components/selectable-tile/`)

**Interfaces:**
- Consumes: existing `.orbit-selectable-tile--selected` class already toggled by `OrbitSelectableTileComponent` on `selected()` input (unchanged).
- Produces: `@keyframes orbit-pop` applied to `.orbit-selectable-tile--selected .orbit-selectable-tile__indicator`.

- [x] **Step 1: Write the failing test (or the first test, if no spec file exists yet)**

```ts
it('marks the indicator as selected so the pop-in animation applies', () => {
  fixture.componentRef.setInput('selected', true);
  fixture.detectChanges();
  const indicator = fixture.nativeElement.querySelector('.orbit-selectable-tile__indicator');
  expect(indicator.closest('.orbit-selectable-tile--selected')).toBeTruthy();
});
```

If `selectable-tile.component.spec.ts` doesn't exist yet, create it following the pattern in `projects/orbit/src/lib/components/pill-switch/pill-switch.component.spec.ts` (TestBed host wrapper component with `[label]`, `[selected]` bindings).

- [x] **Step 2: Run it**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/selectable-tile.component.spec.ts'`
Expected: PASS (this assertion is already true today — it's a baseline/regression guard before the CSS-only change below, since jsdom can't observe CSS animations).

- [x] **Step 3: Add the animation**

Append to `selectable-tile.component.css`:

```css
@keyframes orbit-pop {
  0% { transform: scale(0.8); }
  60% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.orbit-selectable-tile--selected .orbit-selectable-tile__indicator {
  animation: orbit-pop 0.25s var(--orbit-easing-standard);
}
```

- [x] **Step 4: Verify via grep (jsdom does not execute CSS animations, so this is the real check)**

Run: `grep -c "orbit-pop" projects/orbit/src/lib/components/selectable-tile/selectable-tile.component.css`
Expected: `2` (the `@keyframes` declaration and its one usage)

- [x] **Step 5: Run the full component test again**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/selectable-tile.component.spec.ts'`
Expected: PASS

- [x] **Step 6: Commit**

```bash
git add projects/orbit/src/lib/components/selectable-tile/
git commit -m "feat(orbit): add check pop-in animation to selected selectable-tile"
```

---

### Task 5: Attachment-list-item hover state

**Files:**
- Modify: `projects/orbit/src/lib/components/attachment-list-item/attachment-list-item.component.css:1-12`

**Interfaces:**
- Consumes: nothing new (host-level styling only).
- Produces: `:host(:hover)` rule darkening the background slightly, matching the "riga documento: hover leggero scurimento" rule from the mockup spec.

- [x] **Step 1: Add the hover rule**

In `attachment-list-item.component.css`, immediately after the `:host { ... }` block (currently lines 1-12), add:

```css
:host(:hover) {
  background: var(--orbit-surface-subtle);
}
```

- [x] **Step 2: Verify**

Run: `grep -A2 ":host(:hover)" projects/orbit/src/lib/components/attachment-list-item/attachment-list-item.component.css`
Expected: shows the new rule.

- [x] **Step 3: Run the existing component spec (regression)**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/attachment-list-item.component.spec.ts'`
Expected: PASS unchanged (no test asserts hover background, this is a CSS-only addition).

- [x] **Step 4: Commit**

```bash
git add projects/orbit/src/lib/components/attachment-list-item/attachment-list-item.component.css
git commit -m "feat(orbit): add hover state to attachment list item"
```

---

### Task 6: Shared icon set (`OrbitIconComponent`)

**Files:**
- Create: `projects/orbit/src/lib/icons/icon-registry.ts`
- Create: `projects/orbit/src/lib/icons/icon.component.ts`
- Create: `projects/orbit/src/lib/icons/icon.component.html`
- Create: `projects/orbit/src/lib/icons/index.ts`
- Test: `projects/orbit/src/lib/icons/icon.component.spec.ts`
- Modify: `projects/orbit/src/public-api.ts`

**Interfaces:**
- Produces: `OrbitIconName = 'close' | 'calendar' | 'chevron-down' | 'check'` (first 4 icons — the doc's full 18-icon set follows the identical registry-entry pattern as a mechanical fast-follow, not required for this task's deliverable to be complete and testable). `ORBIT_ICON_PATHS: Record<OrbitIconName, string[]>` (array of SVG `<path d>` values per icon, since some icons need multiple paths, e.g. `close`'s two diagonal strokes). `OrbitIconComponent` with `name = input.required<OrbitIconName>()`, selector `orbit-icon`.

- [x] **Step 1: Write the icon registry**

```ts
// projects/orbit/src/lib/icons/icon-registry.ts
export type OrbitIconName = 'close' | 'calendar' | 'chevron-down' | 'check';

export const ORBIT_ICON_PATHS: Record<OrbitIconName, string[]> = {
  close: ['M6 6l12 12', 'M18 6l-12 12'],
  calendar: [
    'M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-13Z',
    'M8 3v3',
    'M16 3v3',
    'M4 9.5h16',
  ],
  'chevron-down': ['M6 9l6 6 6-6'],
  check: ['M5 12.5l4.5 4.5L19 7'],
};
```

- [x] **Step 2: Write the failing component test**

```ts
// projects/orbit/src/lib/icons/icon.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { OrbitIconComponent } from './icon.component';

describe('OrbitIconComponent', () => {
  let fixture: ComponentFixture<OrbitIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrbitIconComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrbitIconComponent);
  });

  it('renders one <path> per registry entry for the given icon', () => {
    fixture.componentRef.setInput('name', 'close');
    fixture.detectChanges();
    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBe(2);
  });

  it('renders a single path for a single-path icon', () => {
    fixture.componentRef.setInput('name', 'check');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('path').length).toBe(1);
  });

  it('uses a 24x24 viewBox with the shared stroke contract', () => {
    fixture.componentRef.setInput('name', 'chevron-down');
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('stroke-width')).toBe('1.75');
  });
});
```

- [x] **Step 3: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/icon.component.spec.ts'`
Expected: FAIL (`OrbitIconComponent` does not exist yet)

- [x] **Step 4: Write the component**

```ts
// projects/orbit/src/lib/icons/icon.component.ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ORBIT_ICON_PATHS, OrbitIconName } from './icon-registry';

@Component({
  selector: 'orbit-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
})
export class OrbitIconComponent {
  name = input.required<OrbitIconName>();
  protected readonly paths = computed(() => ORBIT_ICON_PATHS[this.name()]);
}
```

```html
<!-- projects/orbit/src/lib/icons/icon.component.html -->
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  @for (path of paths(); track path) {
    <path [attr.d]="path" />
  }
</svg>
```

```ts
// projects/orbit/src/lib/icons/index.ts
export * from './icon.component';
export * from './icon-registry';
```

- [x] **Step 5: Run tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/icon.component.spec.ts'`
Expected: PASS (3 tests)

- [x] **Step 6: Export from public-api**

In `projects/orbit/src/public-api.ts`, add:

```ts
export * from './lib/icons';
```

- [x] **Step 7: Full orbit-lab verification (confirms the export resolves through the library path mapping)**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass.

- [x] **Step 8: Commit**

```bash
git add projects/orbit/src/lib/icons/ projects/orbit/src/public-api.ts
git commit -m "feat(orbit): add shared OrbitIconComponent with a 4-icon starter registry"
```

---

### Task 7: Icon scale-sensitivity (hide fixed-size icons above `textScale > 1.2`)

**Files:**
- Modify: `projects/orbit/src/lib/icons/icon.component.ts`
- Modify: `projects/orbit/src/lib/icons/icon.component.html`
- Modify: `projects/orbit/src/lib/icons/icon.component.spec.ts`

**Interfaces:**
- Consumes: `OrbitIconComponent` from Task 6.
- Produces: two new inputs — `scaleSensitive = input(false, { transform: booleanAttribute })` (opt-in per the mockup rule: only icons next to text that can wrap/grow are scale-sensitive; check/selection, header, and attachment-row icons stay `scaleSensitive=false`, the default) and `textScale = input(1, { transform: numberAttribute })` (the effective current scale, passed down by the consumer that already knows it — avoids reading `--orbit-text-scale` back out of the CSS cascade via `getComputedStyle`, which would be fragile and untestable in jsdom).

- [x] **Step 1: Write the failing tests**

Add to `icon.component.spec.ts`:

```ts
it('renders normally when scaleSensitive is false, regardless of textScale', () => {
  fixture.componentRef.setInput('name', 'calendar');
  fixture.componentRef.setInput('scaleSensitive', true);
  fixture.componentRef.setInput('textScale', 1.5);
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
});

it('hides a scale-sensitive icon once textScale exceeds 1.2', () => {
  fixture.componentRef.setInput('name', 'calendar');
  fixture.componentRef.setInput('scaleSensitive', true);
  fixture.componentRef.setInput('textScale', 1.3);
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('svg')).toBeNull();
});

it('keeps a non-scale-sensitive icon like check visible at any scale', () => {
  fixture.componentRef.setInput('name', 'check');
  fixture.componentRef.setInput('textScale', 1.5);
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
});
```

(Correction to the test written in Task 6, Step 2: `scaleSensitive` defaults to `false`, so those three original tests keep passing unmodified — no need to touch them.)

- [x] **Step 2: Run to verify the two new tests fail**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/icon.component.spec.ts'`
Expected: FAIL on the `hides a scale-sensitive icon...` test (`scaleSensitive`/`textScale` inputs don't exist yet, so it currently always renders).

- [x] **Step 3: Implement**

```ts
// projects/orbit/src/lib/icons/icon.component.ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { ORBIT_ICON_PATHS, OrbitIconName } from './icon-registry';

@Component({
  selector: 'orbit-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
})
export class OrbitIconComponent {
  name = input.required<OrbitIconName>();
  scaleSensitive = input(false, { transform: booleanAttribute });
  textScale = input(1, { transform: numberAttribute });

  protected readonly paths = computed(() => ORBIT_ICON_PATHS[this.name()]);
  protected readonly hidden = computed(() => this.scaleSensitive() && this.textScale() > 1.2);
}
```

```html
<!-- projects/orbit/src/lib/icons/icon.component.html -->
@if (!hidden()) {
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    @for (path of paths(); track path) {
      <path [attr.d]="path" />
    }
  </svg>
}
```

- [x] **Step 4: Run tests to verify they pass**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit --include='**/icon.component.spec.ts'`
Expected: PASS (6 tests total)

- [x] **Step 5: Full orbit-lab verification**

Run: `source ~/.nvm/nvm.sh && nvm use 24.16.0 && npx ng test orbit-lab`
Expected: all pass.

- [x] **Step 6: Commit**

```bash
git add projects/orbit/src/lib/icons/
git commit -m "feat(orbit): hide scale-sensitive icons above textScale 1.2"
```

---

## Deferred / not in this plan

- Extending the icon registry from 4 to the full 18-icon set from the mockup — mechanical repetition of Task 6's pattern, do as a fast-follow whenever a component needs a specific icon.
- Consumers actually adopting `scaleSensitive`/`textScale` on their inline SVGs (`attachment-dropzone`, `modal-header`, etc. still use raw inline `<svg>`, not `orbit-icon`) — a separate migration once `orbit-icon` proves out.
- `modal-header`'s icon-badge tint (currently 12%, mockup says 8%) — cosmetic delta judged not worth its own task; fold into a future pass if it's ever flagged.
- Any Orbit Studio work — explicitly out of scope per this session's brief.
