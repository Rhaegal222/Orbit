# Orbit — Panel, Tab, Table

## Context

Orbit already covers form primitives, buttons, badges, pickers, and a modal/dialog/
popover/tooltip overlay family (`docs/superpowers/specs/2026-07-22-orbit-scale-zoom-verification-design.md`
audited that family). Four structural component families were still missing: modal
(already covered), panel/offcanvas/sidebar, tab, and table. This spec covers the three
still missing: **Panel**, **Tab**, **Table**.

Scope for Tab and Table was set by auditing real usage in the consuming application
(`service-frontend`), not by speculative feature lists:

- **Tab**: 3 real hand-rolled tab UIs found (`detail-sopralluogo`, `detail-commessa`,
  `ui-kit-shell`), all horizontal — no vertical tab usage exists anywhere in the
  codebase. One of them (`detail-sopralluogo.component.html:61,84,106`) shows a
  rounded-pill counter badge on individual tabs (`tab-badge`) — a confirmed real need.
- **Table**: 169 hand-rolled `<table>` usages. Sortable/filterable columns
  (`sortEvent`/`filterEvent` on a shared `data-column` component) appear in 128 files —
  pervasive. A trailing per-row actions cell (dropdown menu) is a near-universal
  pattern. Muted/disabled row state (`text-muted` when a record is inactive) is common.
  Row-selection checkboxes appear in exactly one file — too rare to justify in v1.
- **Panel**: no existing hand-rolled equivalent to audit against (no offcanvas/sidebar
  pattern currently exists in `service-frontend`); scoped instead by direct user
  decision to cover both an overlay (offcanvas) and a persistent layout (sidebar)
  variant, since both are named real UI shapes the user wants Orbit to support before
  any consumer builds one ad hoc.

## Architecture

Each of the three families follows an existing Orbit convention rather than
introducing a new one:

- **Panel — offcanvas variant** reuses the `OrbitDialogService` overlay pattern
  (`projects/orbit/src/lib/services/dialog/dialog.service.ts`): CDK `Overlay`,
  backdrop, Escape-to-close, `cdkTrapFocus` (as `orbit-modal` already does). The
  difference is position: anchored to `left` or `right` and full-height, instead of
  centered. A new `OrbitPanelService.open(component, config)` mirrors
  `OrbitDialogService.open()` exactly (same `OrbitDialogRef`-shaped return value) so
  the two services are drop-in analogues, differing only in the `side` config option
  and the resulting CSS.
- **Panel — sidebar variant** is a plain structural component (`orbit-panel`, a
  `display: block` host with `--orbit-*` surface/border/padding tokens), analogous to
  `orbit-form-section`: no overlay, no focus trap, no service — the consumer places it
  directly in their layout (e.g. inside a CSS grid column).
- **Tab** (`orbit-tablist` + `orbit-tab`) follows the ARIA `tablist`/`tab`/`tabpanel`
  pattern with manual keyboard handling via `@HostListener`, matching
  `select.component.ts`'s existing convention — CDK's `ListKeyManager` is not used
  anywhere in Orbit today and this spec does not introduce it. Selection is a
  controlled input/output pair on `orbit-tablist` (`selected`/`selectedChange`),
  matching `orbit-pill-switch`'s existing API shape. Per-tab badges are supported by
  letting `orbit-tab` project an `orbit-badge` through a named content slot — no new
  badge-specific input, reusing the existing component instead of duplicating it.
- **Table** stays presentational, not a CDK `Table` / data-source abstraction — Orbit's
  existing components (`form-grid`, `attachment-list`) are all thin presentational
  wrappers around native semantics, and a data-source/virtual-scroll abstraction is
  more machinery than any of the 169 real usages need. `orbit-table` wraps a native
  `<table>`; `orbit-table-column` (used inside `<th>`) takes a `sortable` boolean and
  emits `sortChange` with the next sort direction; the header content itself (label,
  optional filter control) is projected, matching how KMS's own `data-column` already
  separates label from filter UI. Row-level muted/disabled state is a boolean input on
  a thin `orbit-table-row` directive applied to `<tr>` (mirrors `orbit-selectable-tile`'s
  `disabled` input semantics: dims and marks non-interactive, doesn't hide). The
  trailing actions cell is plain projected content in a `<td>` — no dedicated
  component, since actions are already just buttons/icon-buttons Orbit provides.

## Panel

**Files:**
- `projects/orbit/src/lib/services/panel/panel.service.ts` (new) — `OrbitPanelService`,
  `OrbitPanelConfig` (`data`, `side: 'left' | 'right'` default `'right'`, `size`
  matching `OrbitDialogConfig`'s `sm | md | lg | xl | wide`, `disableClose`,
  `panelClass`), `ORBIT_PANEL_DATA` injection token (parallel to `ORBIT_DIALOG_DATA`).
- `projects/orbit/src/lib/components/panel/panel.component.ts` (new) — `orbit-panel`,
  the sidebar/structural variant. Inputs: `padding` (`'none' | 'default'`, default
  `'default'`), nothing else — it is a styled `<section>` wrapper, matching
  `form-section`'s minimalism.
- CSS for both: reuse `--orbit-surface-modal`, `--orbit-shadow-floating`,
  `--orbit-border-subtle`, `--orbit-radius-surface` — the offcanvas panel is visually a
  modal rotated to a side (slide-in from `left`/`right` instead of centered), the
  sidebar panel is visually a static card.

**Offcanvas interaction contract:**
- Same close triggers as `OrbitDialogService`: backdrop click (unless
  `disableClose`), Escape (unless `disableClose`).
- `cdkTrapFocus` + `cdkTrapFocusAutoCapture`, matching `orbit-modal`.
- Width is fixed per `size` (reusing `OrbitDialogConfig`'s `SIZE_MAP` values) instead
  of scaling with viewport, since an offcanvas panel's identity is a fixed-width strip,
  not a centered card.

**Non-goal:** no resizable/draggable panel width — no real usage need identified, and
it would require drag-handling infrastructure disproportionate to the rest of Orbit's
primitives.

## Tab

**Files:**
- `projects/orbit/src/lib/components/tab/tablist.component.ts` (new) — `orbit-tablist`.
  Inputs: `selected = input.required<string>()` (the selected tab's `value`),
  `ariaLabel = input('')`. Output: `selectedChange = output<string>()`. Projects
  `orbit-tab` children via `ng-content` and reads them through `contentChildren`
  (signal-based query, Angular 22) to drive roving `tabindex` and arrow-key
  navigation (`ArrowLeft`/`ArrowRight` move focus and selection, `Home`/`End` jump to
  first/last, matching `select.component.ts`'s existing `ArrowUp`/`ArrowDown` handling
  style).
- `projects/orbit/src/lib/components/tab/tab.component.ts` (new) — `orbit-tab`.
  Inputs: `value = input.required<string>()`, `label = input('')`,
  `disabled = input(false, { transform: booleanAttribute })`. Projects an optional
  `orbit-badge` through `<ng-content select="[orbitTabBadge]" />` exactly like
  `orbit-selectable-tile` projects its icon slot. Renders `role="tab"`,
  `aria-selected`, `aria-controls` wired to a matching `orbit-tab-panel` `id`.
- `projects/orbit/src/lib/components/tab/tab-panel.component.ts` (new) —
  `orbit-tab-panel`. Input: `value = input.required<string>()`. Renders
  `role="tabpanel"` and toggles `hidden` based on whether its `value` matches the
  tablist's `selected`; content stays in the DOM (not re-created on switch) to match
  Angular's usual behavior for other Orbit disclosure patterns (`selectable-tile`
  doesn't destroy its content on deselect either).

**Interaction contract:**
- Arrow keys move both focus and selection (single-selection "automatic activation"
  tab pattern per the deprecated but still-common WAI-ARIA tabs pattern), matching
  what all 3 real KMS usages already behave like (Bootstrap nav-tabs also activates on
  click, and none of the 3 usages show a "manual activation" — press-Enter-to-select —
  affordance).
- `disabled` tabs are skipped by arrow-key navigation (same semantics as
  `orbit-selectable-tile`'s `disabled`).

**Non-goal:** no vertical orientation, no closable/removable tabs — no real usage
found for either.

## Table

**Files:**
- `projects/orbit/src/lib/components/table/table.component.ts` (new) — `orbit-table`.
  No inputs beyond `density` passthrough (`'comfortable' | 'compact'`, defaults to
  inherited density like every other Orbit component — does not introduce a new
  density concept). Wraps `<table class="orbit-table">`; everything else is
  projected `<thead>`/`<tbody>` — Orbit does not own row iteration, the consumer's
  `*ngFor`/`@for` does, matching every real KMS table's own structure.
- `projects/orbit/src/lib/components/table/table-column.component.ts` (new) —
  `orbit-table-column`, used inside a `<th>`. Inputs: `sortable = input(false, {
  transform: booleanAttribute })`, `sortDirection = input<'asc' | 'desc' | null>(null)`
  (the *current* direction, controlled by the consumer — this component does not
  track its own state, matching `orbit-pill-switch`'s fully-controlled pattern).
  Output: `sortChange = output<'asc' | 'desc'>()` (the *next* direction to apply,
  toggling from the current one). Renders a sort indicator icon (via the Task 6
  `OrbitIconComponent` `chevron-down`, rotated for `asc`) when `sortable` is true.
  Projects the header label/filter control via `ng-content` — no dedicated filter
  API, since KMS's own filter controls vary per column type (date range, text,
  select) and forcing one shape into Orbit would be premature abstraction.
- `projects/orbit/src/lib/components/table/table-row.directive.ts` (new) —
  `[orbitTableRow]`, applied to `<tr>`. Input: `disabled = input(false, {
  transform: booleanAttribute })`. Toggles a `orbit-table-row--disabled` class
  (dimmed text/background, `aria-disabled`) — does not prevent click handlers the
  consumer attaches (Orbit doesn't own row interaction, same reasoning as not owning
  `*ngFor`).

**Non-goal:** no built-in pagination, no row-selection checkboxes, no virtual
scrolling, no data-source/sort-implementation (the *comparison* logic is always the
consumer's, `orbit-table-column` only emits the requested direction) — none has a
strong enough real-usage signal (pagination and row-selection are each present in a
small minority of the 169 real tables) to justify inclusion now; each is a
well-isolated follow-up if usage data changes.

## Testing

- Each new component gets a Vitest spec following this repo's established
  `TestBed`/`componentRef.setInput`/host-wrapper pattern (see
  `pill-switch.component.spec.ts` for the reference shape).
- Panel offcanvas: verify via `OverlayContainer` (same pattern used for
  `dialog-page.component.spec.ts` in this session) that opening attaches
  `orbit-panel` content to the overlay, and that backdrop click / Escape close it
  unless `disableClose`.
- Tab: verify roving `tabindex`, `aria-selected` state changes on click and on
  arrow-key navigation, and that a `disabled` tab is skipped during arrow navigation.
- Table: verify `sortChange` emits the toggled direction (not the current one) on
  click, and that `[orbitTableRow][disabled]` adds the expected class/attribute
  without suppressing a native `(click)` the consumer attaches to the same `<tr>`.
- No `getComputedStyle`/resolved-token assertions — matches this repo's established
  testing convention (structural DOM/class/attribute checks only).

## Non-goals (cross-cutting)

- No new density, motion, or color tokens — all three families consume only
  existing `--orbit-*` tokens.
- No migration of the one existing row-selection-checkbox table or the 128
  sort/filter tables in `service-frontend` onto these new components — this spec
  covers the Orbit library only; adopting the new components in KMS is separate,
  future, per-screen work.
- No Orbit Studio changes.
