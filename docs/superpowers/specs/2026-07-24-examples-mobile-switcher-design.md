# Mobile example switcher for Orbit Lab's Examples page — design

## Problem

`examples-page` (`/examples`) lets a visitor pick among 4 demo scenarios (Portafoglio
catalogo, Dossier prodotto, Azione rapida, Landing partner) via a single `orbit-tablist`.
The page's `orbitFormGridItem` usages were fixed in this session to follow Orbit's
mobile-first grid convention, but the tablist itself still wraps onto multiple rows with
uneven whitespace under `--orbit-breakpoint-sm` (40rem) — it predates Orbit's mobile
navigation convention documented in `docs/PATTERNS-AND-GOVERNANCE.md`:

> Mobile navigation | `orbit-sidebar embedded` opened via `OrbitPanelService` | The primary
> navigation must collapse into an overlay under `--orbit-breakpoint-sm`.

## Users

Orbit Lab visitors (component consumers, designers) browsing `/examples` on a phone-width
viewport, and future Lab authors who want to reuse this composition pattern elsewhere.

## Scope

- Applies only to `examples-page.component.ts`'s existing 4-item example switcher.
- Applies only below `--orbit-breakpoint-sm` (40rem / 640px). At and above that width, the
  current `orbit-tablist` is unchanged.
- Two switcher UIs, both live on `/examples` on mobile, toggled by the user in place (not
  one primary + one "documented only" — the user explicitly asked for a live toggle):
  1. **Offcanvas** — `OrbitPanelService.open(...)` with an `orbit-panel-surface` wrapping
     `orbit-sidebar embedded`, one item per example. Mirrors the existing
     `LabSidebarDrawerContentComponent` composition in `panel-page.component.ts` exactly.
  2. **Modal with preview cards** — a CDK Dialog (`Dialog.open(...)`, same mechanism as
     `LabGoogleFontsDialogComponent`) showing an `orbit-modal` with a grid of
     `orbit-selectable-tile`, one per example.
- No new Core (`projects/orbit`) components. Everything is a Lab-only composition, same
  tier as `LabExampleComponent`/`LabSidebarDrawerContentComponent`.
- Out of scope: changing `orbit-tablist` itself, changing any other Lab page, persisting
  the user's toggle choice across navigations/reloads.

## API / composition

New shared components under `projects/orbit-lab/src/app/catalog/example-switcher/`:

- `LabExampleSwitcherComponent` (selector `lab-example-switcher`) — the public composition.
  - Inputs: `items: readonly LabExampleSwitcherItem[]` (`{ value: string; label: string;
    badgeTone: OrbitBadgeTone; badgeLabel: string }`), `selected: string`.
  - Output: `selectedChange: string`.
  - Renders a slim mobile-only topbar: current item's label + badge, a 2-way icon-button
    toggle (`menu` icon = offcanvas mode, `grid` icon = modal-cards mode, whichever is not
    active is the clickable one), and a "Cambia scheda" trigger button that opens whichever
    surface the toggle currently selects.
  - Hidden (`display: none`) at and above `--orbit-breakpoint-sm`; the consumer keeps
    rendering its own desktop `orbit-tablist` unconditionally, gated the opposite way in
    CSS, so exactly one is visible at any width — no JS breakpoint check, pure CSS/media
    query, consistent with how the rest of this codebase gates responsive-only UI.
  - Internal `mode` signal (`'offcanvas' | 'modal'`), default `'offcanvas'`.
  - On trigger click: if `mode() === 'offcanvas'`, calls `OrbitPanelService.open(
    LabExampleSwitcherSidebarContentComponent, { data, side: 'left', size: 'sm' })`; else
    calls `dialog.open(LabExampleSwitcherModalComponent, { data })` (`Dialog` from
    `@angular/cdk/dialog`).
- `LabExampleSwitcherSidebarContentComponent` — `orbit-panel-surface` wrapping
  `orbit-sidebar embedded`, one `OrbitSidebarSection` with one `OrbitSidebarItem` per
  example item; `itemSelected`/`closed` both close the panel, `itemSelected` also emits the
  chosen value back through the injected data's callback.
- `LabExampleSwitcherModalComponent` — `orbit-modal size="sm"` with an
  `orbit-modal-header` ("Cambia scheda"), a grid (reuse `.examples__` grid conventions —
  actually a small local grid, 1 column, gap `--orbit-space-3`) of `orbit-selectable-tile`
  (`label`, no description, `[selected]` bound to whether it's the current example),
  `(selectedChange)` closes the dialog and emits the chosen value.

`examples-page.component.ts` wires `lab-example-switcher` alongside the existing
`orbit-tablist`, both bound to `selectedExample()`/`selectExample()`, each visible only on
its side of `--orbit-breakpoint-sm` via CSS (`examples-page.component.css`).

## Documentation in the Lab

Add a third demo to `panel-page.component.ts` (which already documents the "sidebar
drawer" composition) titled "Selettore esempio (offcanvas + modale)", using
`lab-example-switcher` with 3-4 sample items, `[code]` snippet shown via `lab-example`, so
the pattern is discoverable independently of `/examples`.

## Accessibility

- The topbar trigger button has an explicit `aria-label` ("Cambia scheda, attualmente:
  {label}").
- The mode-toggle icon buttons have `aria-pressed` reflecting the active mode and distinct
  `aria-label`s ("Passa a menu laterale" / "Passa a schede di anteprima").
- Offcanvas content: unchanged accessibility from the existing `orbit-sidebar embedded`
  pattern (focus management already handled by `OrbitPanelService`/CDK overlay).
- Modal content: unchanged accessibility from `orbit-modal` + CDK Dialog (focus trap
  already handled, same as `LabGoogleFontsDialogComponent`).

## Testing plan

- `LabExampleSwitcherComponent`: unit tests for toggle state, correct service/dialog called
  per mode, `selectedChange` emission relay from both child surfaces.
- `LabExampleSwitcherSidebarContentComponent` / `LabExampleSwitcherModalComponent`: unit
  tests for item rendering and selection emission/close.
- Manual browser check: `/examples` at 390px width — confirm tablist hidden, switcher
  topbar shown, both modes open/select/close correctly, and desktop width shows the
  reverse.

## Non-goals

- No changes to `orbit-tablist`/`orbit-tab` themselves.
- No persistence of the toggle mode.
- No new Core public API surface.
