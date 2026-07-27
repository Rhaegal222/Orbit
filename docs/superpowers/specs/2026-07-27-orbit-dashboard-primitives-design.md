# Orbit dashboard/surveillance primitives — design

> **Superseded (2026-07-27).** After review, the decision was to *not* add new public components
> for this need. A local CSS Grid + existing public primitives (`orbit-panel`, `orbit-stack`,
> `orbit-icon`, `orbit-badge`, `orbit-cluster`, `orbit-spinner`) composes the same three needs
> (KPI rows, action bar, video wall) without introducing premature public API. See
> `2026-07-27-orbit-dashboard-composition-guide-design.md` for the composition-guide replacement.
> This document is kept for historical reference only — do not implement it.

## Problem

A consumer team building KPI dashboards and camera-surveillance screens on top of Orbit reports
four recurring gaps, reproduced verbatim from their feedback:

> conviene aggiungere primitive Orbit, non alterare token o forzare quelle esistenti.
>
> Servono soprattutto:
> - OrbitGrid: griglia responsive generica a 12 colonne. OrbitFormGrid è per form, non per
>   KPI/dashboard.
> - OrbitMetricCard: valore, label, descrizione opzionale, tono/stato e icona. Risolve le card
>   KPI disallineate.
> - OrbitToolbar / OrbitActionGroup: composizione uniforme di pulsanti, selettori e stato per la
>   sorveglianza.
> - OrbitMediaWall o almeno OrbitMediaSurface: contenitore responsivo e coerente per stream
>   video/camere.
>
> Non modificherei Workspace, Sidebar, PageShell, Panel, Stack o Cluster: sono corretti; è errato
> usarli fuori dalla loro semantica.

Today, consumers reach for `OrbitFormGrid` (form-specific 7-5/auto composition), hand-rolled flex
wrappers, and ad hoc `<div>`s to build KPI rows and camera walls — producing misaligned cards,
inconsistent toolbars and one-off video containers per screen. The four primitives below close
that gap additively, without touching any existing component, directive or token.

## Intended users

Orbit consumers building operational/surveillance dashboards (KMS and similar), needing KPI rows,
a uniform action bar, and a coherent multi-camera video wall.

## Source location

As of `@galileo/orbit` v0.3.0 (`c358c96`, 2026-07-27), the actual component source no longer lives
in this repository — `projects/orbit` is a thin re-export wrapper (`export * from
'@rhaegal222/orbit'`) over the theme-neutral library extracted to
[github.com/Rhaegal222/Orbit](https://github.com/Rhaegal222/Orbit) and published as
`@rhaegal222/orbit`. This document specifies the four primitives at the API level; implementation
happens against that source repository, not this one.

## Non-goals (apply to all four primitives)

- No changes to `OrbitWorkspaceComponent`, `OrbitSidebarComponent`, `OrbitPageShellComponent`,
  `OrbitPanelComponent`, `OrbitStackComponent`, `OrbitClusterComponent`, `OrbitFormGridComponent`,
  `OrbitFormGridItemDirective`, or any existing design token. All four primitives are pure
  additions.
- No WebRTC/video-player logic — streaming/playback stays app-owned; Orbit only frames and states
  the surface.
- No overflow-menu toolbar beyond the `pickerMode` strategy described below (no bespoke third
  overflow mechanism).
- No selection state in `OrbitActionGroup` (that need is already met by
  `OrbitPillSwitchComponent`).
- No focus/PIP mode in `OrbitMediaWall` (uniform-grid layout only).

---

## 1. OrbitGrid

Generic responsive 12-column grid track for dashboard/KPI layouts, independent of the form-specific
`OrbitFormGrid`.

### API

```html
<orbit-grid gap="md">
  <orbit-metric-card orbitGridItem span="12" spanMd="6" spanLg="3" ... />
  <orbit-metric-card orbitGridItem span="12" spanMd="6" spanLg="3" ... />
</orbit-grid>
```

- `OrbitGridComponent` (`orbit-grid`)
  - `gap: OrbitLayoutGap` — reuses the existing gap scale, default `'md'`.
  - Fixed 12-column CSS Grid track. Column count is not configurable (YAGNI — the request is for
    "griglia generica a 12 colonne", not an arbitrary-column primitive).
- `OrbitGridItemDirective` (`[orbitGridItem]`) — a **new**, independent directive, deliberately not
  shared with `OrbitFormGridItemDirective` so the generic grid never couples to form-layout
  internals.
  - `span`, `spanSm`, `spanMd`, `spanLg`, `spanXl` — same shape as `OrbitFormGridItemDirective`
    (progressive breakpoint override), same breakpoint tokens
    (`--orbit-breakpoint-{sm,md,lg,xl}`).
- No `layout="auto"/"single"/"7-5"` composition modes — those are form-specific semantics.
  `OrbitGrid` is a bare track; all layout decisions are expressed via `orbitGridItem` spans.

### Non-goals

- Not a replacement for `OrbitFormGrid` inside forms.
- No implicit auto-placement heuristics beyond native CSS Grid auto-flow for items without
  `orbitGridItem`.

---

## 2. OrbitMetricCard

Single KPI value display: value, label, optional description, tone, optional icon.

### API

```html
<orbit-metric-card
  value="128 ms"
  label="Tempo medio risposta"
  description="Ultime 24h"
  tone="success"
  icon="bar-chart"
/>
```

- `OrbitMetricCardComponent` (`orbit-metric-card`)
  - `value: string | number` (required) — `string` allows pre-formatted values (`"99.9%"`,
    `"128 ms"`).
  - `label: string` (required)
  - `description: string` (optional)
  - `tone: OrbitBadgeTone` (reused, default `'neutral'`) — same semantic scale as
    `OrbitBadgeComponent`/`OrbitAlertComponent`, keeping severity/status colour consistent across
    the library rather than inventing a card-specific palette.
  - `icon: OrbitIconName | null` (optional) — typed against the existing icon registry, rendered
    via `orbit-icon` internally (same constraint as `OrbitIconButtonComponent`); no projected-icon
    slot, to avoid free-form markup inside a data-display primitive.

### Behavior

- Stateless/presentational, same philosophy as `OrbitSkeletonComponent`: no built-in `loading`
  input. Consumers render `<orbit-skeleton shape="rect">` in place of the card while loading
  (`@if (loading()) { <orbit-skeleton .../> } @else { <orbit-metric-card .../> }`), rather than the
  card owning a loading variant.
- Composes with `OrbitGrid`: consumers place `orbitGridItem` on the `orbit-metric-card` host
  directly (no wrapper element required, since the directive attaches to any host).

---

## 3. OrbitToolbar + OrbitActionGroup

Uniform composition of buttons, selectors and status for a surveillance/dashboard header row.
Two separate primitives: a sectioned container (`OrbitToolbar`) and a visual button-fusion group
usable anywhere (`OrbitActionGroup`).

### OrbitToolbar API

```html
<orbit-toolbar gap="sm" pickerMode="scroll">
  <div orbitToolbarStart>
    <orbit-action-group>
      <orbit-button label="Live" variant="soft" />
      <orbit-button label="Registrazioni" variant="soft" />
    </orbit-action-group>
  </div>
  <div orbitToolbarCenter>
    <orbit-badge tone="success" label="12 telecamere online" />
  </div>
  <div orbitToolbarEnd>
    <orbit-select ... />
    <orbit-icon-button icon="settings" ariaLabel="Impostazioni" />
  </div>
</orbit-toolbar>
```

- `OrbitToolbarComponent` (`orbit-toolbar`)
  - Three projected regions via `[orbitToolbarStart]`, `[orbitToolbarCenter]`, `[orbitToolbarEnd]`
    directives — same content-projection shape as `OrbitModalFooterComponent`'s
    left/center/right regions. Unassigned (no-directive) content lands in the `start` region,
    matching the modal footer's existing convention so single-child usage stays simple.
  - `gap: OrbitLayoutGap` (default `'sm'`)
  - `density: OrbitDensityOverride` (default `'inherit'`)
  - `pickerMode: OrbitTablistPickerMode` (`'modal' | 'offcanvas' | 'scroll'`) — **reuses the type
    already defined for `OrbitTablistComponent`**, fixed per instance. `OrbitTablistComponent`'s
    own doc comment states the rationale this primitive inherits verbatim: "offcanvas, modal and
    horizontal scroll are alternative strategies for the same problem, never combined." When the
    three regions don't fit on one row:
    - `'scroll'`: the whole toolbar becomes a single horizontally-scrollable row (no wrap).
    - `'modal'` / `'offcanvas'`: the whole toolbar's content opens via `OrbitDialogService` /
      `OrbitPanelService`, exactly as `OrbitTablist` does for tabs that don't fit.
  - `pickerMode` applies to the **entire toolbar as one unit** (all three regions together), not
    per-region — same mental model as `OrbitTablist` treating its whole tab list as one unit.
    Per-region overflow was considered and rejected: it multiplies the API surface and introduces
    region-vs-region collision cases for no expressed need.
  - No generic responsive wrap fallback: `pickerMode` is the only responsive strategy, consistent
    with `OrbitTablistComponent` not offering wrap either.

### OrbitActionGroup API

```html
<orbit-action-group>
  <orbit-button label="Live" variant="soft" />
  <orbit-button label="Registrazioni" variant="soft" />
  <orbit-button label="Allarmi" variant="soft" />
</orbit-action-group>
```

- `OrbitActionGroupComponent` (`orbit-action-group`)
  - No inputs. Purely visual: fuses a projected row of `OrbitButtonComponent` /
    `OrbitIconButtonComponent` into one coherent block (shared border between adjacent items,
    connected outer corners, no double border).
  - No selection state, no `value`/`valueChange`. Exclusive-selection segmented controls are
    already served by `OrbitPillSwitchComponent`; duplicating that here was considered and
    rejected to avoid two components solving the same problem differently.

---

## 4. OrbitMediaSurface + OrbitMediaWall

Responsive, consistent container for a single video/camera stream, and an adaptive grid of many.

### OrbitMediaSurface API

```html
<orbit-media-surface aspectRatio="16/9" label="Ingresso principale" state="live">
  <video ...></video>
  <orbit-badge orbitMediaSurfaceOverlay tone="danger" label="REC" />
</orbit-media-surface>
```

- `OrbitMediaSurfaceComponent` (`orbit-media-surface`)
  - `aspectRatio: string` (default `'16/9'`)
  - `label: string` (optional — e.g. camera name, rendered as a caption)
  - `state: 'live' | 'loading' | 'offline' | 'error'` — a **dedicated type**, deliberately not
    `OrbitBadgeTone`. A stream's connectivity state is a different concept from a severity/tone
    scale (a camera isn't "successful" or "dangerous"; it's live, loading, offline or erroring),
    so it gets its own type rather than overloading the badge tone enum.
  - Default (no-directive) projected content is the live stream itself (`<video>`, `<img>`, or an
    app-owned player component — Orbit does not own playback).
  - `[orbitMediaSurfaceOverlay]` — optional projected slot for overlay chrome (status badge,
    timestamp, camera label) positioned over the surface.

### Behavior

- `state='loading'`: renders a centered `OrbitSpinnerComponent` (existing component, reused rather
  than a new bespoke spinner).
- `state='offline'` / `'error'`: renders an `orbit-icon` (`alert-circle`) plus the surface's own
  `label`, over a dimmed background. No new icon token needed.
- `state='live'`: renders the projected stream content as-is.
- The component never conditionally hides/shows the *projected* content itself — it only overlays
  its own state indicator. Swapping between an actual `<video>` and a placeholder, if a consumer
  wants that, stays the consumer's own `@if`, consistent with `OrbitMediaSurface` being
  presentational rather than owning a content-swap control flow.

### OrbitMediaWall API

```html
<orbit-media-wall [count]="cameras.length" gap="sm">
  @for (camera of cameras; track camera.id) {
    <orbit-media-surface [state]="camera.state" [label]="camera.name">
      <video [srcObject]="camera.stream"></video>
    </orbit-media-surface>
  }
</orbit-media-wall>
```

- `OrbitMediaWallComponent` (`orbit-media-wall`)
  - `count: number` (required) — explicitly input-driven rather than derived via
    `contentChildren()` DOM introspection, consistent with every other Orbit component being
    input-driven and avoiding content-projection timing edge cases.
  - `gap: OrbitLayoutGap`
  - Lays out `count` equal-sized cells using preset row/column counts tuned for common
    camera-wall counts: 1→1×1, 2→2×1, 3–4→2×2, 5–6→3×2, 7–9→3×3, 10–12→4×3, 13–16→4×4, beyond
    16 → `columns = ceil(sqrt(count))`.
  - **Not** built on top of `OrbitGrid`: `OrbitGrid`'s 12-column span model is for irregularly
    sized dashboard blocks, not "N equal tiles" — forcing e.g. 7 cameras into 12-column spans
    produces awkward fractional spans. `OrbitMediaWall` computes its own
    `grid-template-columns`/`grid-template-rows` from the preset table instead. This is a
    deliberate divergence from "compose everything from OrbitGrid," recorded here so it isn't
    revisited as an oversight.
  - No focus/PIP mode in this version — all cells render at equal size.

---

## Package and governance

All four primitives are new public exports of `@rhaegal222/orbit` (implemented in
[github.com/Rhaegal222/Orbit](https://github.com/Rhaegal222/Orbit)), then picked up unchanged by
`@galileo/orbit`'s next dependency bump (same mechanism as every other component: `@galileo/orbit`
re-exports; it defines no component code itself post-`c358c96`).

- New types: `OrbitGridSpan` (independent of `OrbitFormGridSpan`), `OrbitMediaSurfaceState`.
- Reused types: `OrbitLayoutGap`, `OrbitDensityOverride`, `OrbitBadgeTone`, `OrbitIconName`,
  `OrbitTablistPickerMode`.
- Suggested maturity: `experimental` until a real KMS surveillance/dashboard screen consumes all
  four and confirms the API holds up (same maturity gate `orbitAutoHideOnScroll` used).
- `CHANGELOG.md` (in the Rhaegal222/Orbit repo): **Unreleased**, minor (new additive public API,
  no breaking change to existing components/tokens).

## Testing

- `OrbitGrid` / `OrbitGridItemDirective`: span resolves per breakpoint identically to
  `OrbitFormGridItemDirective`'s existing test shape; grid stays 12 columns regardless of item
  count.
- `OrbitMetricCard`: renders `value`/`label`/`description`/`icon` conditionally on presence; `tone`
  maps to the same CSS class contract as `OrbitBadgeComponent`.
- `OrbitToolbar`: unassigned content renders in `start`; each `pickerMode` opens the correct
  surface (`OrbitDialogService` for `'modal'`, `OrbitPanelService` for `'offcanvas'`, scrollable
  container for `'scroll'`) when content overflows, mirroring `OrbitTablistComponent`'s existing
  overflow tests.
- `OrbitActionGroup`: purely visual — snapshot/class-contract test only (adjacent-item border
  fusion), no behavioral test needed.
- `OrbitMediaSurface`: renders spinner on `'loading'`, icon+label on `'offline'`/`'error'`,
  projected content on `'live'`; overlay slot renders when projected.
- `OrbitMediaWall`: preset table resolves to the documented column/row counts for representative
  `count` values (1, 4, 9, 16, 20 → `ceil(sqrt(20))=5` columns).
