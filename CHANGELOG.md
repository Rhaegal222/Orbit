# Changelog

All notable changes to Galileo Orbit are documented here.

## Unreleased

### Added

- Initial package metadata, publication pipeline and portable design tokens.
- Added `orbit-panel-surface`/`orbit-panel` (offcanvas + sidebar) via a new `OrbitPanelService`, `orbit-tab`/`orbit-tab-panel`/`orbit-tablist`, and `orbit-table`/`orbit-table-column`/`orbitTableRow`.
- Public theming contract with semantic CSS tokens and comfortable/compact density.
- `orbit-form-section` can now collapse through an accessible native button.
- Component token alignment for form controls, pill switch and badge; added `--orbit-radius-full` and badge foreground tokens.
- Added generic attachment list primitives, compositional modal surface and confirmation dialog content for CDK dialogs.
- Added semantic composition-spacing tokens used by form grid, sections and modal chrome.
- Added the injectable `ORBIT_I18N` contract and `provideOrbitI18n` helper for component labels and date locale.
- Refreshed surface, elevation, typography and motion foundations; documented operational layout and system-state patterns.
- `orbit-modal` now supports responsive `sm`, `md`, `lg` and `full` compositional sizes; modal header accepts a projected icon.
- `orbit-form-section` now renders the numbered header and divider pattern, and accepts projected header metadata.
- `orbit-text-input` now supports native `readonly` and a semantic `success` tone; form action bars can expose a generic status label.
- Rebased Core visual tokens on the operational refresh contract (ink palette, typography, 42px/38px controls, 10px/14px/20px radii and modal elevation).
- `orbit-selectable-tile` accepts an optional projected SVG icon through `[orbitSelectableTileIcon]`.
- Added the single `--orbit-text-scale` contract; type roles and fixed text containers scale from it coherently.
- Applied the text-scale contract to Orbit Lab typography and Tailwind theme utilities; Lab chrome now inherits the selected scale too.
- Formalized `orbit-modal` sizes: `sm` (480px), `md` (720px), `lg` (960px), `xl` (1180px), `xxl` (1320px) and `full`.
- Added accent, CTA and font-family token swatches; primary button CTAs can now be themed independently from the accent color.
- Added `orbit-icon`, with a four-icon starter registry and optional scale-sensitive rendering.
- Added selected-tile pop-in and attachment-list-item hover feedback.
- `orbit-code-block` can hide its built-in actions when a composite owns the source controls.
- Expanded the density contract to `spacious`, `comfortable`, `compact` and `dense`; Core now scales control targets, rhythm, modal chrome and upload areas together. Added public `OrbitDensity` and `OrbitDensityOverride` types.
- Date picker now supports `date`, `month` and `year` precision through `mode`; added the typed CVA `orbit-date-range-picker` composed from two accessible Orbit calendars.
- `orbit-modal-footer` now exposes left, center and right projection regions for operational status and action placement.
- Formalized motion tokens for slow overlays, shimmer and accelerate/shared easing; applied reduced-motion guardrails and tokenized enter/state feedback to modal, floating controls, pickers, selectable tiles, checkbox and collapsible sections.
