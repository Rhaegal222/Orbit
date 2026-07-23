# Changelog

All notable changes to Galileo Orbit are documented here.

## Unreleased

- Added switch thumb tokens with a tonal active thumb so its state remains distinct in every theme.
- Fixed badge padding, height and icon gap to follow the active density scope.

### Added

- Added the `data-orbit-shape` geometry contract (`square`, `operational`, `soft`, `rounded`) and the Orbit Lab shape-style switcher.
- Added the complete semantic surface/elevation and layering token contract, including overlay surfaces and base, sticky, popover, overlay and toast layers. Orbit Lab now includes a light/dark theme matrix for surfaces, actions and status badges.
- Initial package metadata, publication pipeline and portable design tokens.
- Added Orbit Lab's pattern and governance guide, plus documented component maturity,
  proposal, review and deprecation requirements.
- Added `orbit-navbar`, a typed, accessible horizontal navigation primitive with active,
  disabled and link states.
- `orbit-icon` now exposes typed 16/20/24 sizing and decorative or labelled informative semantics; attachment and modal action icons use the shared registry.
- `orbit-button` now supports the `translucent` variant for colored, semi-transparent actions, derived from shared theme tokens.
- Added `orbit-slider`, an accessible numeric range control with reactive-form support, value output and semantic token styling.
- Added `orbit-switch`, an accessible boolean control with reactive-form support and `checkedChange` output.
- Added layout primitives: `orbit-stack`, `orbit-cluster`, `orbit-page-shell`, `orbit-page-header`, `orbit-workspace` and `orbitDataAlign`.
- Added `orbit-panel-surface`/`orbit-panel` (offcanvas + sidebar) via a new `OrbitPanelService`, `orbit-tab`/`orbit-tab-panel`/`orbit-tablist`, and `orbit-table`/`orbit-table-column`/`orbitTableRow`.
- `orbit-table` gained `bordered` and `striped` boolean inputs.
- `OrbitPanelService.open()` accepts `fullWidth`, `minWidth` and `maxWidth` to size an offcanvas panel beyond the preset `size` steps.

### Changed

- Angular CDK is now a required peer dependency because the shipped overlay, focus and interaction primitives use it directly.
- Status badges now use contrast-safe solid foreground/background pairings in light and dark themes, with a larger readable label and more representative Orbit Lab examples.
- Select menus now preserve the scoped theme in their CDK overlay and visibly distinguish the selected option with an accessible checkmark.
- Button tones now use documented semantic action foreground tokens. The dark theme provides contrast-safe solid and subtle foregrounds for primary, success, danger and neutral variants.
- Typography roles now distinguish operational body text from labels and captions: catalog navigation, sidebar items and table data use Body; validation and persistent action status use Label.
- Radius tokens now scale with text size and adapt to spacious, comfortable, compact and dense layouts; component internals consistently consume the semantic radius contract, including explicit square edges and circular indicators.
- Spacing and composition tokens now scale with text size across every density; Lab editorial spacing uses semantic tokens without leaking into nested Orbit components.
- Primary CTA buttons now follow the shared primary-action token, matching the sidebar and active navigation state.
- `data-orbit-shadow-intensity` now selects shared elevation levels across raised, floating, overlay, solid-action and form-footer surfaces.
- `data-orbit-motion="off"` disables Orbit transitions and animations, including CDK overlay surfaces; spinner and interaction durations now consume shared motion tokens.
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
- `orbit-text-input` now provides opt-in semantic leading icons for search, telephone and URL fields; currency symbols use the same leading-adornment surface as icons.
- Populated search inputs now expose a keyboard-accessible trailing clear action; `ORBIT_I18N` adds the `clearSearch` label.
- `orbit-sidebar` now exposes `showHeader` and `showFooter` to omit its optional chrome while retaining navigation; its mouse-tracking edge toggle accepts a configurable `toggleMargin`.
- `orbit-form-field` accepts `reserveMessageSpace` to reserve the hint/error row and keep aligned fields stable when validation feedback appears.
- `orbit-code-block` now consumes dedicated semantic code-surface tokens, with contrast-safe light and dark backgrounds, gutters and alternate lines.
- Striped tables now use the dedicated `--orbit-table-stripe-bg` token, improving alternate-row recognition in the light theme while preserving dark-theme contrast.
- Added selected-tile pop-in and attachment-list-item hover feedback.
- `orbit-code-block` can hide its built-in actions when a composite owns the source controls.
- Expanded the density contract to `spacious`, `comfortable`, `compact` and `dense`; Core now scales control targets, rhythm, modal chrome and upload areas together. Added public `OrbitDensity` and `OrbitDensityOverride` types.
- Date picker now supports `date`, `month` and `year` precision through `mode`; added the typed CVA `orbit-date-range-picker` composed from two accessible Orbit calendars.
- `orbit-modal-footer` now exposes left, center and right projection regions for operational status and action placement.
- Formalized motion tokens for slow overlays, shimmer and accelerate/shared easing; applied reduced-motion guardrails and tokenized enter/state feedback to modal, floating controls, pickers, selectable tiles, checkbox and collapsible sections.
- `orbit-text-input` now supports opt-in semantic leading icons for email and password through `showLeadingIcon`.
- Text-input leading and trailing adornments now distinguish decorative icons from actions through typed icon names and explicit action labels.
- Numbered form-section indices now use documented soft brand surface, foreground and border tokens instead of an ink-filled badge.
- Added `orbit-sidebar`: an advanced, generic expandable navigation rail with typed sections/items, badges, active state, keyboard-native buttons and projected footer content.
