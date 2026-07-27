# Orbit Lab dashboard composition guide — design

## Problem

The same consumer feedback that prompted
`2026-07-27-orbit-dashboard-primitives-design.md` (superseded) asked for KPI grids, a uniform
action bar and a camera video wall. On review, none of the three need a new public Orbit
component: each is a straightforward composition of primitives already public in
`@rhaegal222/orbit` (`orbit-panel`, `orbit-stack`, `orbit-cluster`, `orbit-icon`, `orbit-badge`,
`orbit-spinner`) plus a small amount of app-owned CSS Grid. Adding `OrbitGrid`, `OrbitMetricCard`,
`OrbitToolbar`/`OrbitActionGroup`, `OrbitMediaSurface`/`OrbitMediaWall` would introduce public API
for problems solvable by composition — premature, and contrary to the consumer's own stated
preference ("non occorre aggiungere componenti alla libreria").

What's actually missing is a documented, copy-pasteable recipe for each composition, so every
consumer doesn't re-derive the same CSS Grid + primitive combination independently (which is how
the "misaligned KPI cards" complaint arose in the first place).

## Intended users

Orbit Lab visitors building operational/surveillance dashboards, who need to see a working example
of KPI rows, an action bar, and a video wall built entirely from existing public primitives.

## Scope

A new Orbit Lab catalog page presenting the three recipes below, each as a live `lab-example`
(interactive preview + toggleable source snippet — the same mechanism `patterns-page` and
`examples-page` already use).

### Non-goals

- No new public component, directive or token in `@rhaegal222/orbit` or `@galileo/orbit`.
- No changes to `orbit-panel`, `orbit-stack`, `orbit-cluster`, `orbit-icon`, `orbit-badge`,
  `orbit-spinner`, or any existing primitive.
- No live camera/WebRTC integration in the example — the video wall recipe uses placeholder tiles
  (colored blocks + state icon), not a real stream.
- Not added to `consumer-fixture` in this pass — Orbit Lab only. (If a real KMS screen later
  proves the pattern needs adjustment, that's a follow-up, not part of this doc.)

## Recipe 1 — KPI grid

Local CSS Grid, 12 columns (`grid-template-columns: repeat(12, 1fr)`), each KPI tile is an
`orbit-panel` containing an `orbit-stack` with:
- `orbit-icon` (tone-colored via a wrapper span using existing status/tone color tokens, not a
  new token)
- the value (plain text, page-owned typography class — e.g. reusing the existing Display/Body
  type roles already documented in `typography-page`)
- the label and optional description (plain text)
- an `orbit-badge` for tone/status when the KPI has a discrete state (e.g. "In allarme")

Column span per tile is set with a plain CSS class per breakpoint (`.kpi-tile` at `grid-column:
span 12`, overridden at `sm`/`md`/`lg` via the existing `--orbit-breakpoint-*` custom properties
in a page-local `@media` query) — no new grid-item directive; this is the app's own CSS, scoped to
the example page.

## Recipe 2 — Action bar

`orbit-cluster` (existing primitive, already supports `gap`/`align`/`justify` and wraps by
default) containing `orbit-button`s, an `orbit-select`, and an `orbit-badge` for live status —
no new toolbar component needed since `orbit-cluster` already provides the row layout and wrap
behavior.

For narrow screens: **not** the `OrbitTablistPickerMode` scroll/modal/offcanvas strategy proposed
in the superseded doc — that mechanism is `orbit-tablist`-internal and not exposed as a reusable
directive. Instead, the recipe uses a plain **app-owned horizontally-scrollable row**: a wrapper
`<div>` with `overflow-x: auto; -webkit-overflow-scrolling: touch` and `white-space: nowrap` (or
flex + `overflow-x: auto`) around the `orbit-cluster`, active only under a page-local narrow-width
media query. This keeps the responsive strategy entirely in the consuming app's CSS, with zero
new Orbit API — consistent with "Orbit resta una base neutra."

## Recipe 3 — Video wall

Local CSS Grid using `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))` — no preset
row/column table, no `count` input, no new component: `auto-fit`/`minmax` already produces an
adaptive tile count natively from however many stream wrappers the app renders.

Each stream is a plain wrapper `<div>` with:
- `aspect-ratio: 16 / 9` (page-owned CSS, not a new Orbit input)
- `orbit-spinner` shown while loading (existing component)
- `orbit-icon` (`alert-circle`) + short message shown for offline/error (existing component,
  existing icon)
- the actual `<video>`/stream content when live (app-owned, never Orbit's concern)

State switching between spinner / icon / video is the example's own `@if`, not a new Orbit
component behavior — mirrors how `orbit-skeleton` is already used elsewhere (parent decides what
to render).

## Implementation

- New page: `projects/orbit-lab/src/app/pages/dashboard-page/dashboard-page.component.{ts,html,css,spec.ts}`,
  following the `patterns-page` shape (`LabExampleComponent` wrapping each recipe, one `<section>`
  per recipe, `<h1>`/`<h2>` headings, no new shared components).
- Catalog entry in `catalog.ts`: `{ slug: 'dashboard', label: 'Dashboard operative', status:
  'verified', icon: 'bar-chart' }`, alphabetically placed by label like the rest of the list.
- Lazy route in `app.routes.ts`, same `loadComponent` shape as the `examples`/`patterns` routes.
- No changes to `@galileo/orbit`, `@rhaegal222/orbit`, or any `projects/orbit/*` file.

## Testing

- `dashboard-page.component.spec.ts`: page renders three `lab-example` sections; each recipe's
  interactive preview renders without error (KPI tiles, action bar buttons/select/badge, video
  wall placeholder tiles in each of the three states).
- `catalog.spec.ts` (existing suite) continues to pass with the new entry appended — verifies
  slug/label/icon shape, no bespoke assertion needed.
