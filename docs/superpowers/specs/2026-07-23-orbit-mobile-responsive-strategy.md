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
2. **Mobile navigation** — a new `orbit-drawer` overlay primitive; `orbit-sidebar` and
   `orbit-workspace`'s internal sidebar compose it below `sm`/`md`.
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

### `orbit-drawer` (new public primitive)

An overlay component built on the same CDK `Overlay` foundation as
`OrbitDialogService`/`orbit-modal` (backdrop, `cdkTrapFocus`, Escape-to-close, focus
restore on close) — reusing the existing overlay pattern rather than inventing a new
one.

- Inputs: `open: boolean`, `position: 'start' | 'end'` (logical, RTL-safe), `size`
  (width, `rem` or `--orbit-*` token, default `18rem`).
- Output: `openedChange`.
- ARIA: `role="dialog"`, `aria-modal="true"`.
- Motion: slide-in from `position`, using `--orbit-motion-base` /
  `--orbit-easing-standard`; honors `data-orbit-motion="off"`.
- Not modal-specific: reusable for any future off-canvas need (filters, detail panel),
  not restricted to navigation.

### `orbit-sidebar`

Below `--orbit-breakpoint-sm`, the sidebar's content is composed inside an
`orbit-drawer` instead of rendering inline. A new output (`menuToggle`, or an
equivalent projected trigger slot) lets the consumer wire a hamburger button that opens
it. Above `sm`, behavior is byte-for-byte identical to today — the drawer is simply not
instantiated/activated, so there is no desktop regression risk from this change.

### `orbit-workspace`

Its existing grid-to-stack collapse (`workspace.component.css:20-27`) moves from its
current ad hoc `48rem` to the shared `--orbit-breakpoint-md` (see migration table
below — this is a no-op numerically, `48rem` already equals `md`). Below `md`, instead
of stacking the internal sidebar above the content, `orbit-workspace` composes it
inside `orbit-drawer`, consistent with `orbit-sidebar`'s standalone behavior. Above
`md`, the 2-column grid is unchanged.

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
| `form-grid` | 36/48/64/80rem | `sm`/`md`/`lg`/`xl` | 0 (no-op) |

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

## Non-regression strategy

- Every touched component is checked in Orbit Lab at `lg`/`xl`/`2xl` before and after,
  in addition to the existing required check at `--orbit-text-scale: 1.5` and 200%
  browser zoom (`AGENTS.md`).
- No existing semantic token is redefined. `--orbit-page-padding-inline`'s desktop
  default is untouched; the mobile value is a `@media`-scoped override, not a token
  redefinition.
- Touch-target floor activates only on `pointer: coarse` — zero effect on desktop with
  a mouse, even in a narrow resized window.
- `orbit-drawer` is a new public export — additive, no existing API changes.
- The breakpoint migration table above changes visual behavior only at intermediate
  viewports, always in the direction of preserving the desktop layout longer.

## Versioning

- `orbit-drawer` (new component), breakpoint tokens, touch-target token: **minor**
  version bump (additive).
- Migrated `@media` values on existing components: **minor** version bump with a
  `CHANGELOG.md` entry describing the exact breakpoint shift per component (table
  above) — a behavior change at specific intermediate viewports, not an API or token
  contract break.

## Open questions for implementation planning

- Exact mobile value for `--orbit-page-padding-inline` under `sm` (needs an Orbit Lab
  visual check, not a spec-time guess).
- Whether `orbit-drawer`'s default `size` (`18rem`) needs a distinct value for the
  sidebar-hosting case versus a general-purpose drawer use.
- Which components beyond the interactive controls named in §1 need the touch-target
  floor (a full inventory of interactive components is implementation-time work, not
  a design-time enumeration).
