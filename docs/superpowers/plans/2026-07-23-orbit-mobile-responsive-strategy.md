# Orbit Mobile/Responsive Strategy Implementation Plan

> **Stato:** Completato
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Close Galileo Orbit's mobile/responsive gap — shared breakpoint tokens, a pointer-based touch-target floor, a documented mobile-navigation composition pattern, responsive page-shell padding, and migration of every existing hardcoded `@media` value onto the new shared scale — without changing desktop (`lg`/`xl`/`2xl`) behavior.

**Architecture:** Four ordered pillars, each independently shippable. See
`docs/superpowers/specs/2026-07-23-orbit-mobile-responsive-strategy.md` for the full
design rationale, including two corrections made after auditing the real codebase:
(1) no new `orbit-drawer` component is built — `OrbitPanelService`/`orbit-panel-surface`
already provide that overlay; (2) `orbit-workspace`'s internal sidebar is **not**
converted to an overlay (it is plain `ng-content` projection, not a dynamic component,
and forcing it through `OrbitPanelService` would break its existing API) — only
`orbit-sidebar` (a standalone component) gets a documented drawer-composition pattern.

**Tech Stack:** Angular 22 (standalone components, `OnPush`, signals), Tailwind CSS v4
(CSS-first `@theme`), Vitest (`describe`/`it` from `'vitest'`, `TestBed` from
`@angular/core/testing`), CDK Overlay (via the existing `OrbitPanelService`).

## Global Constraints

- Dimensional CSS (`width`, `height`, `padding`, `margin`, `gap`, `font-size`,
  `line-height`, radii, positional offsets) must use `rem` or an `--orbit-*` token;
  never a bare `px` literal, except 1–2px hairline borders, the `sr-only` pattern, and
  focus-ring `box-shadow` spread (`AGENTS.md`).
- No new public API is introduced without a `CHANGELOG.md` **Unreleased** entry
  (`AGENTS.md`, `CONTRIBUTING.md`).
- CSS custom properties cannot be referenced inside a native `@media` condition —
  every `@media` rule in this plan uses a literal rem value with a `/* --orbit-breakpoint-* */`
  comment pointing at the token it must stay numerically identical to (see spec §1).
- No existing component's public TypeScript API (inputs/outputs) changes in this plan.
  Every change is CSS-only or additive documentation/Lab tooling.
- This codebase has **no existing test that evaluates a CSS `@media` condition**
  (confirmed: no `matchMedia` usage anywhere in `projects/orbit/src` or
  `projects/orbit-lab/src`, and no spec file exists for `orbit-workspace` at all).
  `pointer: coarse` in particular cannot be evaluated by jsdom/the Angular test
  runner used here. Consistent with this codebase's existing convention (manual checks
  for text-scale 1.5 and 200% zoom are documented, not unit-tested, per `AGENTS.md`),
  every step in this plan that touches only CSS ends with a **manual Orbit Lab
  verification** step instead of an automated assertion. Steps that touch TypeScript
  logic keep full TDD.

---

### Task 1: Shared breakpoint tokens

**Files:**
- Modify: `projects/orbit/src/styles/tokens.css:212` (insert after
  `--orbit-page-max-width-workspace: 90rem;`)
- Modify: `projects/orbit/src/styles/theme.css:29` (insert before the closing `}`)
- Modify: `docs/THEMING.md` (insert a new section after the "Token layers" table,
  before "### Action foregrounds and dark theme", i.e. after line 23)
- Modify: `CHANGELOG.md:10` (insert into **Added** under **Unreleased**)

**Interfaces:**
- Produces: `--orbit-breakpoint-sm` (`40rem`), `--orbit-breakpoint-md` (`48rem`),
  `--orbit-breakpoint-lg` (`64rem`), `--orbit-breakpoint-xl` (`80rem`),
  `--orbit-breakpoint-2xl` (`96rem`) — read by later tasks as documentation/Tailwind
  source of truth; every component `@media` rule in Tasks 5–6 uses these literal values.

- [x] **Step 1: Add the breakpoint tokens to `tokens.css`**

Insert after line 214 (`--orbit-page-max-width-workspace: 90rem;`):

```css
  /* Shared breakpoint scale (mobile-first). Cannot be read from a native @media
     condition (custom properties aren't resolved there) — component @media rules
     use the literal value below with a comment referencing the token name. */
  --orbit-breakpoint-sm: 40rem;
  --orbit-breakpoint-md: 48rem;
  --orbit-breakpoint-lg: 64rem;
  --orbit-breakpoint-xl: 80rem;
  --orbit-breakpoint-2xl: 96rem;
```

- [x] **Step 2: Map the same literal values into Tailwind's `@theme` screens**

In `projects/orbit/src/styles/theme.css`, insert before the closing `}` of the
`@theme` block (after `--shadow-orbit-overlay: var(--orbit-shadow-overlay);`):

```css
  /* Must stay numerically identical to --orbit-breakpoint-* in tokens.css. Tailwind
     compiles --breakpoint-* into literal @media rules, so it cannot reference a
     custom property either. */
  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;
  --breakpoint-2xl: 96rem;
```

- [x] **Step 3: Document the token in `docs/THEMING.md`**

Insert after line 23 (the end of the "Token layers" table), before the "### Action
foregrounds and dark theme" heading:

```markdown
## Breakpoints

| Token | Value | Typical role |
| --- | ---: | --- |
| `--orbit-breakpoint-sm` | `40rem` (640px) | smartphone → tablet |
| `--orbit-breakpoint-md` | `48rem` (768px) | tablet → small desktop |
| `--orbit-breakpoint-lg` | `64rem` (1024px) | standard desktop |
| `--orbit-breakpoint-xl` | `80rem` (1280px) | wide desktop |
| `--orbit-breakpoint-2xl` | `96rem` (1536px) | wide workspace |

These map to Tailwind v4's `sm:`/`md:`/`lg:`/`xl:`/`2xl:` utilities through `@theme`
in `theme.css`. A native `@media` condition cannot read a CSS custom property, so
every Orbit component's own `@media` rule repeats the literal rem value with a
comment naming the token it must match — treat the token as the documented source of
truth, not a live reference.
```

- [x] **Step 4: Add the CHANGELOG entry**

In `CHANGELOG.md`, under `## Unreleased` → `### Added` (after line 12, the
`data-orbit-shape` entry):

```markdown
- Added the shared `--orbit-breakpoint-{sm,md,lg,xl,2xl}` token scale, mapped to
  Tailwind v4's `sm:`/`md:`/`lg:`/`xl:`/`2xl:` utilities.
```

- [x] **Step 5: Manual verification**

Run `npm run check`. Open Orbit Lab (`ng serve orbit-lab`), navigate to any page using
a Tailwind `sm:`/`md:` utility class (e.g. the theme-switcher layout), resize the
browser across 640px/768px/1024px/1280px and confirm the utility classes still toggle
at those widths (Tailwind must have picked up the new `@theme` screens without error).

- [x] **Step 6: Commit**

```bash
git add projects/orbit/src/styles/tokens.css projects/orbit/src/styles/theme.css docs/THEMING.md CHANGELOG.md
git commit -m "feat(orbit): add shared --orbit-breakpoint-* token scale"
```

---

### Task 2: Touch-target floor for coarse pointers

**Files:**
- Modify: `projects/orbit/src/styles/tokens.css:214` (insert alongside the
  breakpoint tokens added in Task 1, or immediately after them)
- Modify: `projects/orbit/src/lib/components/button/button.component.css`
- Modify: `projects/orbit/src/lib/components/icon-button/icon-button.component.css`
- Modify: `projects/orbit/src/lib/components/checkbox/checkbox.component.css`
- Modify: `projects/orbit/src/lib/components/switch/switch.component.css`
- Modify: `projects/orbit/src/lib/components/pill-switch/pill-switch.component.css`
- Modify: `projects/orbit/src/lib/components/select/select.component.css`
- Modify: `docs/THEMING.md` (append to the new "Breakpoints" section from Task 1)
- Modify: `CHANGELOG.md`

**Interfaces:**
- Produces: `--orbit-control-height-touch-min: 2.75rem` — a token other Orbit
  components can adopt later; no other task in this plan consumes it directly.

- [x] **Step 1: Add the token**

In `tokens.css`, immediately after the breakpoint tokens from Task 1:

```css
  /** WCAG 2.5.5 minimum (44px). Applied only under (pointer: coarse) — see below. */
  --orbit-control-height-touch-min: 2.75rem;
```

- [x] **Step 2: Apply the floor to `.orbit-btn` (button)**

In `projects/orbit/src/lib/components/button/button.component.css`, after the
`.orbit-btn` rule block (the block starting at line 6, containing
`min-height: var(--orbit-control-height);`), append:

```css
@media (pointer: coarse) {
  .orbit-btn {
    min-height: var(--orbit-control-height-touch-min);
  }
}
```

- [x] **Step 3: Apply the floor to `.orbit-icon-button`**

In `projects/orbit/src/lib/components/icon-button/icon-button.component.css`, after
the `.orbit-icon-button` rule block (lines 4–14), append:

```css
@media (pointer: coarse) {
  .orbit-icon-button {
    width: var(--orbit-control-height-touch-min);
    height: var(--orbit-control-height-touch-min);
  }
}
```

- [x] **Step 4: Apply the floor to `.orbit-checkbox` (label wrapper)**

In `projects/orbit/src/lib/components/checkbox/checkbox.component.css`, after the
`.orbit-checkbox` rule block (lines 5–14), append:

```css
@media (pointer: coarse) {
  .orbit-checkbox {
    min-height: var(--orbit-control-height-touch-min);
  }
}
```

- [x] **Step 5: Apply the floor to `.orbit-switch` (label wrapper)**

In `projects/orbit/src/lib/components/switch/switch.component.css`, after the
`.orbit-switch` rule block (lines 5–13, which already sets
`min-height: var(--orbit-control-height);`), append:

```css
@media (pointer: coarse) {
  .orbit-switch {
    min-height: var(--orbit-control-height-touch-min);
  }
}
```

- [x] **Step 6: Apply the floor to `.orbit-pill-switch__option`**

In `projects/orbit/src/lib/components/pill-switch/pill-switch.component.css`, after
the `.orbit-pill-switch__option` rule block (starts at line 23), append:

```css
@media (pointer: coarse) {
  .orbit-pill-switch__option {
    min-height: var(--orbit-control-height-touch-min);
  }
}
```

- [x] **Step 7: Apply the floor to `.orbit-select__input` (trigger)**

In `projects/orbit/src/lib/components/select/select.component.css`, after the
`.orbit-select__input` rule block (starts at line 11, sets
`height: var(--orbit-control-height);`), append:

```css
@media (pointer: coarse) {
  .orbit-select__input {
    min-height: var(--orbit-control-height-touch-min);
  }
}
```

- [x] **Step 8: Document the token in `docs/THEMING.md`**

Append to the end of the "Breakpoints" section added in Task 1:

```markdown
### Touch target

`--orbit-control-height-touch-min` (`2.75rem`, WCAG 2.5.5) applies under
`@media (pointer: coarse)` to button, icon-button, checkbox, switch, pill-switch and
select — independent of density, so `compact`/`dense` stay touch-safe on a
touch/hybrid device while a mouse-driven desktop window (even narrow) is unaffected.
```

- [x] **Step 9: Add the CHANGELOG entry**

In `CHANGELOG.md` → `### Added`:

```markdown
- Added `--orbit-control-height-touch-min`, a `(pointer: coarse)` touch-target floor
  applied to button, icon-button, checkbox, switch, pill-switch and select, independent
  of the active density.
```

- [x] **Step 10: Manual verification**

`npm run check`. In Chrome DevTools, open Orbit Lab, toggle device toolbar (which sets
`pointer: coarse`), and confirm button/icon-button/checkbox/switch/pill-switch/select
grow to at least 44px in the emulated device; then close device toolbar and confirm
`compact`/`dense` density controls shrink back on a normal mouse pointer.

- [x] **Step 11: Commit**

```bash
git add projects/orbit/src/styles/tokens.css projects/orbit/src/lib/components/button/button.component.css projects/orbit/src/lib/components/icon-button/icon-button.component.css projects/orbit/src/lib/components/checkbox/checkbox.component.css projects/orbit/src/lib/components/switch/switch.component.css projects/orbit/src/lib/components/pill-switch/pill-switch.component.css projects/orbit/src/lib/components/select/select.component.css docs/THEMING.md CHANGELOG.md
git commit -m "feat(orbit): add pointer:coarse touch-target floor to interactive controls"
```

---

### Task 3: Document and demonstrate the drawer-nav composition pattern

No Core component code changes — `orbit-sidebar`'s `embedded` input and
`OrbitPanelService` already provide everything needed. This task adds the missing
documentation and a working Orbit Lab example.

**Files:**
- Modify: `docs/PATTERNS-AND-GOVERNANCE.md:8-15` (add a row to the interaction
  patterns table)
- Modify: `projects/orbit-lab/src/app/pages/panel-page/panel-page.component.ts`
- Modify: `projects/orbit-lab/src/app/pages/panel-page/panel-page.component.html`
- Test: `projects/orbit-lab/src/app/pages/panel-page/panel-page.component.spec.ts`
  (create if it does not exist; verify first — this repo already has one per the
  audit, so check before creating)

**Interfaces:**
- Consumes: `OrbitPanelService.open(component, config)` — existing signature from
  `projects/orbit/src/lib/services/panel/panel.service.ts:37`; `OrbitSidebarComponent`
  with `embedded` input from `projects/orbit/src/lib/components/sidebar/sidebar.component.ts:54`.
- Produces: `LabSidebarDrawerContentComponent` (new, Orbit Lab-local only, not a Core
  export) — a component demonstrating the pattern; `PanelPageComponent.openSidebarDrawer()`
  (new method).

- [x] **Step 1: Add a row to the interaction patterns table**

In `docs/PATTERNS-AND-GOVERNANCE.md`, insert a new row into the table (after the
"Preserved canvas" row, before "Local result", around line 11):

```markdown
| Mobile navigation | `orbit-sidebar embedded` opened via `OrbitPanelService` | The primary navigation must collapse into an overlay under `--orbit-breakpoint-sm`. | The navigation is already visible in a persistent rail on the current viewport. |
```

- [x] **Step 2: Check whether `panel-page.component.spec.ts` already exists**

```bash
test -f projects/orbit-lab/src/app/pages/panel-page/panel-page.component.spec.ts && echo EXISTS || echo MISSING
```

If `EXISTS`, read it before Step 6 and add the new test alongside the existing ones
instead of creating a new file.

- [x] **Step 3: Add the demo content component to `panel-page.component.ts`**

After the existing `LabPanelDemoContentComponent` class (ends at line 78), add:

```ts
/** Demonstrates the drawer-nav composition pattern: orbit-sidebar embedded inside the existing OrbitPanelService overlay — no new Core primitive. */
@Component({
  selector: 'lab-sidebar-drawer-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitPanelSurfaceComponent, OrbitSidebarComponent],
  template: `<orbit-panel-surface ariaLabel="Navigazione mobile">
    <orbit-sidebar
      embedded
      brand="Orbit"
      [sections]="sections"
      [activeId]="activeId()"
      (itemSelected)="select($event)"
    />
  </orbit-panel-surface>`,
})
class LabSidebarDrawerContentComponent {
  private readonly panel = inject(OrbitPanelService);
  readonly sections = SIDEBAR_SECTIONS;
  readonly activeId = signal('overview');

  select(item: OrbitSidebarItem): void {
    this.activeId.set(item.id);
    this.panel.closeAll();
  }
}
```

- [x] **Step 4: Add `OrbitIconButtonComponent` to `PanelPageComponent`'s imports and add the open method**

In the `imports` array of the `@Component` decorator for `PanelPageComponent` (starts
at line 84), add `OrbitIconButtonComponent` and import it at the top alongside the
other `@galileo/orbit` imports (line 2). Then add this method to the
`PanelPageComponent` class, near `openOffcanvas`:

```ts
  protected readonly drawerNavSnippet = `<!-- Sotto --orbit-breakpoint-sm: apri via OrbitPanelService -->
<orbit-icon-button icon="menu" ariaLabel="Apri navigazione" (clicked)="openNav()" />

<!-- openNav(): this.panel.open(NavContentComponent, { side: 'left', size: 'sm' }) -->
<!-- NavContentComponent template: -->
<orbit-panel-surface ariaLabel="Navigazione mobile">
  <orbit-sidebar embedded [sections]="sections" [activeId]="activeId" (itemSelected)="select($event)" />
</orbit-panel-surface>`;

  openSidebarDrawer(): void {
    this.panel.open(LabSidebarDrawerContentComponent, { side: 'left', size: 'sm' });
  }
```

- [x] **Step 5: Add the example block to `panel-page.component.html`**

Insert a new `<section>` after the existing "Sidebar" section (after its closing
`</section>`, i.e. after line 168's `</lab-example>` and its section close):

```html
<section>
  <h2>Navigazione mobile (drawer)</h2>
  <p>
    Sotto <code>--orbit-breakpoint-sm</code>, componi <code>orbit-sidebar embedded</code>
    dentro un contenuto aperto da <code>OrbitPanelService</code> invece di un nuovo
    componente: nessuna nuova primitiva è necessaria.
  </p>
  <lab-example [code]="drawerNavSnippet">
    <orbit-icon-button icon="menu" ariaLabel="Apri navigazione" (clicked)="openSidebarDrawer()" />
  </lab-example>
</section>
```

- [x] **Step 6: Write the test**

Add to `panel-page.component.spec.ts` (create following the existing
`panel-page.component.spec.ts:64` pattern from the audit if the file exists, otherwise
create with the same `TestBed`/`RouterTestingModule` setup already used by that file):

```ts
it('opens the sidebar drawer example through OrbitPanelService', () => {
  const button = fixture.nativeElement.querySelector(
    'orbit-icon-button[aria-label="Apri navigazione"] button, [ariaLabel="Apri navigazione"]',
  ) as HTMLElement;
  button.click();
  fixture.detectChanges();

  const overlayEl = document.querySelector('.cdk-overlay-container');
  expect(overlayEl?.querySelector('orbit-sidebar[embedded]')).toBeTruthy();
});
```

Adjust the button selector to match whatever selector the existing
`panel-page.component.spec.ts` already uses for `orbit-icon-button` clicks (check
Step 2's file before finalizing this selector).

- [x] **Step 7: Run the test**

```bash
npm run test -- panel-page
```

Expected: PASS.

- [x] **Step 8: Commit**

```bash
git add docs/PATTERNS-AND-GOVERNANCE.md projects/orbit-lab/src/app/pages/panel-page/
git commit -m "docs(orbit): demonstrate drawer-nav composition (orbit-sidebar + OrbitPanelService)"
```

---

### Task 4: `orbit-page-shell` responsive padding

**Files:**
- Modify: `projects/orbit/src/lib/components/layout/page-shell.component.css`
- Modify: `CHANGELOG.md`

**Interfaces:**
- No new inputs/outputs. Purely a `@media`-scoped override of an existing token usage.

- [x] **Step 1: Add the responsive padding rule**

In `projects/orbit/src/lib/components/layout/page-shell.component.css`, append after
the existing rules (after line 17, the `.orbit-page-shell--full` block):

```css
@media (max-width: 40rem) /* --orbit-breakpoint-sm */ {
  :host {
    padding-inline: var(--orbit-space-md);
  }
}
```

`--orbit-space-md` (already defined as `var(--orbit-space-4)` in `tokens.css:208`) is
narrower than the default `--orbit-page-padding-inline` (`var(--orbit-space-lg)`,
`tokens.css:212`) — this only overrides the computed padding under `sm`, it does not
redefine `--orbit-page-padding-inline` itself.

- [x] **Step 2: Add the CHANGELOG entry**

```markdown
- `orbit-page-shell` now reduces its inline padding under `--orbit-breakpoint-sm`.
```

- [x] **Step 3: Manual verification**

`npm run check`. In Orbit Lab, open the `layout` page (which renders `orbit-page-shell`
usage), resize the browser to below 640px and confirm the content padding visibly
tightens; resize back above 1024px and confirm the padding matches current behavior
exactly (no regression).

- [x] **Step 4: Commit**

```bash
git add projects/orbit/src/lib/components/layout/page-shell.component.css CHANGELOG.md
git commit -m "feat(orbit): reduce orbit-page-shell padding under --orbit-breakpoint-sm"
```

---

### Task 5: Migrate breakpoints — card-family components

Moves `attachment-list-item`, `form-action-bar`, `date-range-picker` and
`modal-footer` from their ad hoc values onto `--orbit-breakpoint-sm` (`40rem`). Every
delta widens the range in which the component keeps its current wider layout (see spec
§4) — this is a conservative direction change, not a narrowing.

**Files:**
- Modify: `projects/orbit/src/lib/components/attachment-list-item/attachment-list-item.component.css:88`
- Modify: `projects/orbit/src/lib/components/form-action-bar/form-action-bar.component.css:44`
- Modify: `projects/orbit/src/lib/components/date-range-picker/date-range-picker.component.css:7`
- Modify: `projects/orbit/src/lib/components/modal-footer/modal-footer.component.css:36`
- Modify: `CHANGELOG.md`

- [x] **Step 1: `attachment-list-item` — 32rem → 40rem**

In `attachment-list-item.component.css`, change:

```css
@media (max-width: 32rem) {
```

to:

```css
@media (max-width: 40rem) /* --orbit-breakpoint-sm */ {
```

- [x] **Step 2: `form-action-bar` — 32rem → 40rem**

In `form-action-bar.component.css`, change:

```css
@media (max-width: 32rem) {
```

to:

```css
@media (max-width: 40rem) /* --orbit-breakpoint-sm */ {
```

- [x] **Step 3: `date-range-picker` — 36rem → 40rem**

In `date-range-picker.component.css`, change:

```css
@media (max-width: 36rem) { .orbit-drp { grid-template-columns: 1fr; align-items: stretch; } .orbit-drp__separator { display: none; } }
```

to:

```css
@media (max-width: 40rem) /* --orbit-breakpoint-sm */ { .orbit-drp { grid-template-columns: 1fr; align-items: stretch; } .orbit-drp__separator { display: none; } }
```

- [x] **Step 4: `modal-footer` — 36rem → 40rem**

In `modal-footer.component.css`, change:

```css
@media (max-width: 36rem) {
```

to:

```css
@media (max-width: 40rem) /* --orbit-breakpoint-sm */ {
```

- [x] **Step 5: Add the CHANGELOG entry**

```markdown
### Changed

- `orbit-attachment-list-item`, `orbit-form-action-bar`, `orbit-date-range-picker` and
  `orbit-modal-footer` now switch to their compact mobile layout at
  `--orbit-breakpoint-sm` (40rem) instead of their previous ad hoc 32rem/36rem
  breakpoints — each keeps its current desktop layout slightly longer, never shorter.
```

(Add under the existing `### Changed` heading in `CHANGELOG.md`, or create the heading
if Task 6 has not already added it — check before duplicating.)

- [x] **Step 6: Manual verification**

`npm run check`. In Orbit Lab: open the `attachments` page and resize across 32–40rem
(512–640px) to confirm the layout now stays wide until 40rem; open `pickers` and
`dialog` pages and repeat for date-range-picker and modal-footer. Confirm nothing
changes above 40rem (desktop unaffected) and at `lg`/`xl`/`2xl`.

- [x] **Step 7: Commit**

```bash
git add projects/orbit/src/lib/components/attachment-list-item/attachment-list-item.component.css projects/orbit/src/lib/components/form-action-bar/form-action-bar.component.css projects/orbit/src/lib/components/date-range-picker/date-range-picker.component.css projects/orbit/src/lib/components/modal-footer/modal-footer.component.css CHANGELOG.md
git commit -m "refactor(orbit): migrate card-family component breakpoints onto --orbit-breakpoint-sm"
```

---

### Task 6: Migrate breakpoints — structural components

Moves `navbar` (42rem → 48rem/`md`), and adds the `--orbit-breakpoint-*` reference
comment to `modal`, `workspace` (both already exactly 48rem — numeric no-op) and
`form-grid`'s first step (36rem → 40rem/`sm`; its other three steps, 48/64/80rem,
already match `md`/`lg`/`xl` exactly — comment-only).

**Files:**
- Modify: `projects/orbit/src/lib/components/navbar/navbar.component.css:85`
- Modify: `projects/orbit/src/lib/components/modal/modal.component.css:34`
- Modify: `projects/orbit/src/lib/components/layout/workspace.component.css:20`
- Modify: `projects/orbit/src/lib/components/form-grid/form-grid.component.css:38,44,50,64`
- Modify: `CHANGELOG.md`

- [x] **Step 1: `navbar` — 42rem → 48rem**

In `navbar.component.css`, change:

```css
@media (max-width: 42rem) {
```

to:

```css
@media (max-width: 48rem) /* --orbit-breakpoint-md */ {
```

- [x] **Step 2: `modal` — add the reference comment (48rem, no numeric change)**

In `modal.component.css`, change:

```css
@media (max-width: 48rem) {
```

to:

```css
@media (max-width: 48rem) /* --orbit-breakpoint-md */ {
```

- [x] **Step 3: `workspace` — add the reference comment (48rem, no numeric change)**

In `workspace.component.css`, change:

```css
@media (max-width: 48rem) {
```

to:

```css
@media (max-width: 48rem) /* --orbit-breakpoint-md */ {
```

- [x] **Step 4: `form-grid` — first step 36rem → 40rem, others get the reference comment**

In `form-grid.component.css`, change all four occurrences:

```css
@media (min-width: 36rem) {
```
→
```css
@media (min-width: 40rem) /* --orbit-breakpoint-sm */ {
```

```css
@media (min-width: 48rem) {
```
→
```css
@media (min-width: 48rem) /* --orbit-breakpoint-md */ {
```

```css
@media (min-width: 64rem) {
```
→
```css
@media (min-width: 64rem) /* --orbit-breakpoint-lg */ {
```

```css
@media (min-width: 80rem) {
```
→
```css
@media (min-width: 80rem) /* --orbit-breakpoint-xl */ {
```

- [x] **Step 5: Add the CHANGELOG entry**

Under `### Changed` in `CHANGELOG.md` (same heading as Task 5's entry if that task ran
first — check before duplicating the heading):

```markdown
- `orbit-navbar` now wraps its actions at `--orbit-breakpoint-md` (48rem) instead of
  42rem — it keeps its single-row desktop layout slightly longer, never shorter.
- `orbit-form-grid`'s first responsive column step now activates at
  `--orbit-breakpoint-sm` (40rem) instead of 36rem; its other three steps are
  unchanged (already exactly `md`/`lg`/`xl`).
```

- [x] **Step 6: Manual verification**

`npm run check`. In Orbit Lab: open `navbar` page, resize across 42–48rem
(672–768px), confirm the navbar keeps items on one row slightly longer than before.
Open `form-grid`'s host page (`layout`), resize across 36–40rem (576–640px), confirm
the first column-span step now activates at 40rem. Confirm `modal` (`dialog` page) and
`workspace` (`layout` page) behavior at 48rem is visually identical to before (numeric
no-op). Confirm `lg`/`xl`/`2xl` behavior across all four components is unchanged.

- [x] **Step 7: Commit**

```bash
git add projects/orbit/src/lib/components/navbar/navbar.component.css projects/orbit/src/lib/components/modal/modal.component.css projects/orbit/src/lib/components/layout/workspace.component.css projects/orbit/src/lib/components/form-grid/form-grid.component.css CHANGELOG.md
git commit -m "refactor(orbit): migrate structural component breakpoints onto the shared scale"
```

---

### Task 7: Orbit Lab — resizable device-frame

Replaces the static `aspect-ratio` device mockup with a frame whose width can be set to
one of the new breakpoint values, so content inside genuinely crosses real `@media`
boundaries instead of being visually scaled inside a fixed frame.

**Files:**
- Modify: `projects/orbit-lab/src/app/shell/lab-shell.component.ts`
- Modify: `projects/orbit-lab/src/app/shell/lab-shell.component.html`
- Modify: `projects/orbit-lab/src/app/shell/lab-shell.component.css`
- Test: `projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts` (check if it
  exists first — the audit found one; read it before adding to it)

**Interfaces:**
- Consumes: existing `mobilePreview: WritableSignal<boolean>` and
  `device: WritableSignal<LabDevice>` signals (`lab-shell.component.ts:344-345`).
- Produces: `frameWidthRem: WritableSignal<number>` (new), `setFrameWidth(rem: number): void` (new).

- [x] **Step 1: Check the existing spec file's structure**

```bash
cat projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts
```

Read the output before writing Step 2's test so the new test matches the file's
existing `TestBed` setup exactly (imports, providers, router mocking).

- [x] **Step 2: Write the failing test**

Add to `lab-shell.component.spec.ts` (matching the existing file's setup found in
Step 1):

```ts
it('setFrameWidth updates the frame width signal to the given rem value', () => {
  const instance = fixture.componentInstance as unknown as {
    frameWidthRem: () => number;
    setFrameWidth: (rem: number) => void;
  };
  instance.setFrameWidth(48);
  expect(instance.frameWidthRem()).toBe(48);
});
```

- [x] **Step 3: Run the test to verify it fails**

```bash
npm run test -- lab-shell
```

Expected: FAIL — `setFrameWidth` is not a function.

- [x] **Step 4: Add the signal and method**

In `lab-shell.component.ts`, after the `protected readonly touchMode = signal(false);`
line (line 347):

```ts
  protected readonly frameWidthRem = signal(23.4375); // 375px, current smartphone default
```

And after the `toggleTouchMode` method (ends around line 442):

```ts
  setFrameWidth(rem: number): void {
    this.frameWidthRem.set(rem);
  }
```

- [x] **Step 5: Run the test to verify it passes**

```bash
npm run test -- lab-shell
```

Expected: PASS.

- [x] **Step 6: Wire breakpoint preset buttons into the template**

In `lab-shell.component.html`, near the existing mobile-preview toggle controls (the
audit found them around lines 11/41/58/72 — locate the `mobilePreview`/`device` toggle
markup and add these buttons alongside it):

```html
@if (mobilePreview()) {
  <div class="lab-shell__frame-presets">
    <button type="button" (click)="setFrameWidth(23.4375)">375px</button>
    <button type="button" (click)="setFrameWidth(40)">sm · 640px</button>
    <button type="button" (click)="setFrameWidth(48)">md · 768px</button>
    <button type="button" (click)="setFrameWidth(64)">lg · 1024px</button>
  </div>
}
```

- [x] **Step 7: Bind the frame width in CSS**

In `lab-shell.component.html`, find the device-frame host element (the element
carrying the fixed `aspect-ratio`/width styling described by the audit) and bind:

```html
[style.width.rem]="frameWidthRem()"
```

In `lab-shell.component.css`, find the rule that currently sets a fixed width/
`aspect-ratio` for the phone/tablet frame (audit: lines 70–292) and remove the fixed
`width` declaration from it (keep `aspect-ratio` only if it is still wanted for the
device chrome image; the inner content area must be free to reflow at the bound width).

- [x] **Step 8: Manual verification**

`ng serve orbit-lab`. Toggle mobile preview, click each preset button, and confirm a
component with an existing `@media` rule (e.g. `orbit-navbar`) visibly changes layout
at the corresponding preset — this is the concrete proof the frame now exercises real
`@media` conditions instead of a static mockup.

- [x] **Step 9: Commit**

```bash
git add projects/orbit-lab/src/app/shell/lab-shell.component.ts projects/orbit-lab/src/app/shell/lab-shell.component.html projects/orbit-lab/src/app/shell/lab-shell.component.css projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts
git commit -m "feat(orbit-lab): make the mobile preview device frame resizable to real breakpoints"
```

---

### Task 8: Orbit Lab — "Comportamento responsive" catalog sections

Adds the missing responsive-behavior section to the catalog pages for components
touched in Tasks 4–6 that don't already have one (the audit found the pattern already
exists on some pages, e.g. `button-page.component.html:43`, under the heading
"Comportamento responsive" — follow that exact heading text for consistency).

**Files:**
- Modify: `projects/orbit-lab/src/app/pages/attachment-page/attachment-page.component.html`
- Modify: `projects/orbit-lab/src/app/pages/pickers-page/pickers-page.component.html`
- Modify: `projects/orbit-lab/src/app/pages/navbar-page/navbar-page.component.html`
- Modify: `projects/orbit-lab/src/app/pages/layout-page/layout-page.component.html`
- Modify: `projects/orbit-lab/src/app/pages/dialog-page/dialog-page.component.html`

- [x] **Step 1: Check each target file for an existing "Comportamento responsive" heading**

```bash
for f in attachment-page pickers-page navbar-page layout-page dialog-page; do
  echo "=== $f ==="
  grep -n "Comportamento responsive" "projects/orbit-lab/src/app/pages/$f/${f}.component.html"
done
```

Skip any file that already has the heading — add the section only where it's missing.

- [x] **Step 2: Add the section to `attachment-page.component.html`** (attachment-list-item)

Append before the closing `</article>`:

```html
<section>
  <h2>Comportamento responsive</h2>
  <p>
    Sotto <code>--orbit-breakpoint-sm</code> (40rem) l'elemento passa a un layout con
    wrap: contenuto, stato e azioni si dispongono su più righe invece che su una sola.
  </p>
</section>
```

- [x] **Step 3: Add the section to `pickers-page.component.html`** (date-range-picker)

```html
<section>
  <h2>Comportamento responsive</h2>
  <p>
    <code>orbit-date-range-picker</code> passa da tre colonne (inizio/separatore/fine)
    a una singola colonna sotto <code>--orbit-breakpoint-sm</code> (40rem), nascondendo
    il separatore visivo.
  </p>
</section>
```

- [x] **Step 4: Add the section to `navbar-page.component.html`**

```html
<section>
  <h2>Comportamento responsive</h2>
  <p>
    Sotto <code>--orbit-breakpoint-md</code> (48rem) la lista di navigazione va a
    capo su una seconda riga invece di restare su una sola riga con la barra.
  </p>
</section>
```

- [x] **Step 5: Add the section to `layout-page.component.html`** (workspace + form-grid)

```html
<section>
  <h2>Comportamento responsive</h2>
  <p>
    <code>orbit-workspace</code> collassa dalla griglia a 2 colonne a una colonna
    sotto <code>--orbit-breakpoint-md</code> (48rem). <code>orbit-form-grid</code>
    espande progressivamente lo span delle colonne a <code>--orbit-breakpoint-sm</code>,
    <code>md</code>, <code>lg</code> e <code>xl</code>.
  </p>
</section>
```

- [x] **Step 6: Add the section to `dialog-page.component.html`** (modal / modal-footer)

```html
<section>
  <h2>Comportamento responsive</h2>
  <p>
    Sotto <code>--orbit-breakpoint-md</code> (48rem) il modal diventa un foglio a
    tutta larghezza e tutta altezza (100dvh, radius azzerato); il footer passa da una
    griglia a tre regioni a una singola colonna.
  </p>
</section>
```

- [x] **Step 7: Manual verification**

`ng serve orbit-lab`. Visit each modified page, confirm the new section renders
correctly and the prose matches what Tasks 4–6 actually shipped (re-check the exact
breakpoint values used after those tasks' edits, in case any changed during review).

- [x] **Step 8: Commit**

```bash
git add projects/orbit-lab/src/app/pages/attachment-page/attachment-page.component.html projects/orbit-lab/src/app/pages/pickers-page/pickers-page.component.html projects/orbit-lab/src/app/pages/navbar-page/navbar-page.component.html projects/orbit-lab/src/app/pages/layout-page/layout-page.component.html projects/orbit-lab/src/app/pages/dialog-page/dialog-page.component.html
git commit -m "docs(orbit-lab): add Comportamento responsive sections to migrated component pages"
```
