# Changelog

All notable changes to Galileo Orbit are documented here.

## Unreleased

### Added

- Initial package metadata, publication pipeline and portable design tokens.
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
