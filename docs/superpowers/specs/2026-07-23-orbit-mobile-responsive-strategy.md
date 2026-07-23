# Orbit — Mobile/Responsive Strategy

## Context

Orbit's desktop-facing token system (spacing, density, shape, elevation, motion,
typography scale) reached an acceptable maturity level — it supports building good
operational desktop interfaces. Mobile/responsive support has not: an audit of
`projects/orbit/src/lib/components/` and `projects/orbit/src/styles/` found:

- **No shared breakpoint tokens.** Every component that has a `@media` rule
  (`attachment-list-item` 32rem, `form-action-bar` 32rem, `date-range-picker` and
  `modal-footer` 36rem, `navbar` 42rem, `modal` and `workspace` 48rem, `form-grid`
  36/48/64/80rem) hardcodes its own value, disconnected from every other component.
- **No touch-target floor.** `compact`/`dense` density can produce controls below the
  WCAG 2.5.5 44px recommendation, with no protection tied to viewport or pointer type.
- **Key structural components have zero responsive behavior.** `orbit-sidebar` has no
  `@media` at all — its collapse is purely programmatic (a class toggled via the
  component API), not automatic on narrow viewports. `orbit-page-shell` has only static
  `max-width` variants, no `@media`.
- **`orbit-workspace` is partial.** It collapses its 2-column grid to 1 column under
  48rem, but the result is a static vertical stack — its internal sidebar has no
  overlay/drawer behavior, it's just pushed above the content.
- **No mobile-native primitive exists.** No drawer, bottom-sheet or hamburger-nav
  component in `projects/orbit/src/lib/components/`.
- **Orbit Lab cannot verify responsive behavior.** The "mobile preview" toggle in
  `lab-shell.component` is a static device-frame mockup (`aspect-ratio` fixed at
  768/1024 for tablet, fixed rem dimensions for smartphone) for demonstration/screenshot
  purposes — it does not resize the real viewport, so it never exercises a component's
  actual `@media` rules. No catalog page has a dedicated "Responsive" section.

This spec closes that gap for real smartphone viewports (down to ~360–375px), not just
tablet/narrow-desktop, while leaving desktop behavior (`lg` and above) unchanged.

## Non-goals

- No app-specific mobile navigation pattern (that belongs to the consumer, e.g. KMS).
- No new density preset — mobile adapts existing density via breakpoints and pointer
  type, it does not introduce a fifth `data-orbit-density` value.
- No virtual/native mobile app concerns (no Capacitor/Cordova wrapper behavior).
- No redesign of any component's desktop visual language.

## Architecture

Four pillars, each independently shippable but ordered because later pillars depend on
the first:

1. **Foundations** — shared breakpoint tokens and a pointer-based touch-target floor.
2. **Mobile navigation** — document and demonstrate composing `orbit-sidebar
   embedded` with the existing `OrbitPanelService` offcanvas overlay as the drawer-nav
   pattern (no new Core API); `orbit-workspace`'s internal sidebar keeps its existing
   stack collapse, migrated onto the shared breakpoint.
3. **Page structure** — `orbit-page-shell` gains responsive padding.
4. **Verification** — Orbit Lab's device-frame becomes genuinely resizable, and
   component catalog pages gain a "Responsive" section.

Existing components with hardcoded breakpoints are migrated onto the new shared scale
as part of pillar 1, rather than left to drift further from it.

## 1. Foundation tokens

### Breakpoints

New tokens in `tokens.css`, min-width/mobile-first, matching Tailwind v4's default
scale so they line up with `@theme`'s `screens` (usable as `sm:`/`md:` utilities, not
just Orbit component CSS):

| Token | Value | Typical role |
|---|---|---|
| `--orbit-breakpoint-sm` | `40rem` (640px) | smartphone → tablet |
| `--orbit-breakpoint-md` | `48rem` (768px) | tablet → small desktop |
| `--orbit-breakpoint-lg` | `64rem` (1024px) | standard desktop |
| `--orbit-breakpoint-xl` | `80rem` (1280px) | wide desktop |
| `--orbit-breakpoint-2xl` | `96rem` (1536px) | wide workspace |

CSS custom properties are not resolved inside native `@media (min-width: ...)`
conditions by any browser, so these tokens cannot be referenced live from a component's
`@media` rule. They serve as:

- the documented, single source of truth for the numeric scale;
- the value Tailwind's `@theme` maps to `screens.sm/md/lg/xl/2xl`, so anything using
  Tailwind utilities (`sm:hidden`, `md:grid-cols-2`, …) is automatically aligned;
- the literal value each component's own `@media` rule uses, annotated with a comment
  referencing the token name (e.g. `@media (max-width: 40rem) /* --orbit-breakpoint-sm */`)
  so a future scale change is a documented, greppable, single-PR update across
  components — not a silent drift.

### Touch-target floor

New token `--orbit-control-height-touch-min: 2.75rem` (44px, WCAG 2.5.5). Applied via:

```css
@media (pointer: coarse) {
  /* interactive controls: button, checkbox, pill-switch, select trigger, … */
  min-height: var(--orbit-control-height-touch-min);
}
```

`pointer: coarse` is keyed to input capability, not viewport width: a touch laptop or
hybrid device gets the floor even at desktop widths, and a narrow desktop browser
window resized with a mouse does *not* get the floor. This is deliberately decoupled
from the breakpoint scale — mobile and touch are different axes and must not be
conflated. `compact`/`dense` density still reduce height on precise-pointer devices;
on coarse-pointer devices the floor wins regardless of the active density.

## 2. Mobile navigation

### Reuse `OrbitPanelService` / `orbit-panel-surface` — no new overlay primitive

An audit of `projects/orbit/src/lib/services/panel/panel.service.ts` and
`projects/orbit/src/lib/components/panel-surface/` found that Orbit **already has** an
offcanvas overlay primitive: `OrbitPanelService.open()` (CDK `Overlay`, backdrop,
Escape-to-close, `side: 'left' | 'right'`, `size: 'sm' | 'md' | 'lg' | 'xl' | 'wide'`,
`minWidth`/`maxWidth`/`fullWidth` overrides) paired with `orbit-panel-surface`
(`role="dialog"`, `aria-modal="true"`, `cdkTrapFocus`). This is exactly what an
`orbit-drawer` primitive would provide. Building a new component would duplicate this
pattern — this spec originally proposed `orbit-drawer` before this was found in the
codebase; that plan is superseded by reusing the existing service.

Mobile navigation composes the existing primitive rather than adding a new one:

- `side: 'left'` for a navigation drawer (Orbit's default reading direction), `size:
  'sm'` (320px, already close to the sidebar's own default width).
- Escape-to-close, backdrop-to-close and focus trap/restore all come for free from
  `OrbitPanelService` — no new overlay logic to write or test.

### `orbit-sidebar`

`orbit-sidebar` already has everything needed to be hosted inside an overlay: its
`embedded` input (`sidebar.component.ts:54`, `.orbit-sidebar--embedded` in
`sidebar.component.css:33-35`) removes the fixed width/border-right so it fills its
host, which is exactly what a consumer needs to place `<orbit-sidebar embedded>` inside
a component opened via `OrbitPanelService.open(..., { side: 'left', size: 'sm' })`. No
change to `orbit-sidebar`'s own code is required — this is a composition pattern, not a
new feature. This spec adds a documented example (see §5) rather than new component
API, since the consuming application (which owns its shell/routing) decides when to
render the sidebar inline (desktop) versus open it through the panel service (mobile),
matching Orbit's existing division of responsibility between primitive and consumer.

### `orbit-workspace`

Its internal sidebar is plain content-projection (`orbitWorkspaceSidebar` directive
applied to a consumer-supplied element via `ng-content`, `workspace.component.ts:1-14`),
not a dynamically-instantiated component — it cannot be opened through
`OrbitPanelService.open()` (which requires a `ComponentType`) without changing that
projection contract, which would break every existing consumer of
`orbit-workspace`. This spec does **not** convert it to an overlay. Its existing
grid-to-stack collapse (`workspace.component.css:20-27`) simply moves from its current
ad hoc `48rem` to the shared `--orbit-breakpoint-md` (a no-op numerically, `48rem`
already equals `md`) — the stacked layout it already has is kept as-is. Converting its
internal sidebar to a drawer is out of scope for this spec; the composable
`orbit-sidebar` + `OrbitPanelService` pattern above is the recommended route for any
consumer that needs a drawer-style mobile nav.

## 3. Page structure

`orbit-page-shell` adds:

```css
@media (max-width: 40rem) /* --orbit-breakpoint-sm */ {
  /* reduce --orbit-page-padding-inline to a mobile-appropriate value */
}
```

Only `--orbit-page-padding-inline` changes on mobile; `max-width` variants
(`document`/`workspace`/`full`) and every other page-shell behavior are untouched.

## 4. Migrating existing breakpoints

Every component with a hardcoded `@media` moves onto the shared scale:

| Component | Current | New token | Delta |
|---|---|---|---|
| `attachment-list-item` | 32rem | `sm` (40rem) | +8rem |
| `form-action-bar` | 32rem | `sm` (40rem) | +8rem |
| `date-range-picker` | 36rem | `sm` (40rem) | +4rem |
| `modal-footer` | 36rem | `sm` (40rem) | +4rem |
| `navbar` | 42rem | `md` (48rem) | +6rem |
| `modal` | 48rem | `md` (48rem) | 0 (no-op) |
| `workspace` | 48rem | `md` (48rem) | 0 (no-op) |
| `form-grid` (1st step) | 36rem | `sm` (40rem) | +4rem |
| `form-grid` (2nd/3rd/4th step) | 48/64/80rem | `md`/`lg`/`xl` | 0 (no-op) |

Every non-zero delta widens the viewport range in which the component keeps its
current (wider/desktop) layout — none of them narrows it. This is a deliberately
conservative direction: at intermediate viewports where behavior changes, a component
switches to its compact layout slightly later than before, never earlier.

## 5. Orbit Lab verification tooling

- `lab-shell.component`'s device-frame becomes resizable: a drag handle or breakpoint
  presets (`sm`/`md`/`lg`/`xl`) replace the fixed `aspect-ratio`, so content inside
  actually crosses real `@media` boundaries instead of being scaled inside a fixed
  frame.
- Every catalog page for a component with responsive behavior gains a **"Responsive"**
  section (already anticipated by the catalog contract in
  `docs/PATTERNS-AND-GOVERNANCE.md`: "responsive notes" is a required page element) —
  a live preview that crosses the component's relevant breakpoints, its snippet, and a
  short note on what changes and why.
- The sidebar page adds a working **drawer-nav example**: a small Orbit Lab-local
  wrapper component rendering `<orbit-sidebar embedded>`, opened via
  `OrbitPanelService.open(..., { side: 'left', size: 'sm' })` from a menu button, so the
  composition pattern in §2 is demonstrated end-to-end and is exercisable at the new
  resizable breakpoints, not just described in prose. This wrapper lives in
  `projects/orbit-lab/` only — it is not a Core export.

## Non-regression strategy

- Every touched component is checked in Orbit Lab at `lg`/`xl`/`2xl` before and after,
  in addition to the existing required check at `--orbit-text-scale: 1.5` and 200%
  browser zoom (`AGENTS.md`).
- No existing semantic token is redefined. `--orbit-page-padding-inline`'s desktop
  default is untouched; the mobile value is a `@media`-scoped override, not a token
  redefinition.
- Touch-target floor activates only on `pointer: coarse` — zero effect on desktop with
  a mouse, even in a narrow resized window.
- No new overlay primitive is introduced; `OrbitPanelService`/`orbit-panel-surface` are
  reused as-is, so their existing tests and consumer contract are untouched.
- The breakpoint migration table above changes visual behavior only at intermediate
  viewports, always in the direction of preserving the desktop layout longer.

## Versioning

- Breakpoint tokens and touch-target token: **minor** version bump (additive).
- `orbit-sidebar` and `OrbitPanelService` receive no code changes — no version impact
  from §2; only documentation and an Orbit Lab example are added.
- Migrated `@media` values on existing components: **minor** version bump with a
  `CHANGELOG.md` entry describing the exact breakpoint shift per component (table
  above) — a behavior change at specific intermediate viewports, not an API or token
  contract break.

## Open questions for implementation planning

- Exact mobile value for `--orbit-page-padding-inline` under `sm` (needs an Orbit Lab
  visual check, not a spec-time guess).
- Which components beyond the interactive controls named in §1 need the touch-target
  floor (a full inventory of interactive components is implementation-time work, not
  a design-time enumeration).
