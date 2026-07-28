# Changelog

All notable changes to Orbit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [0.1.4] - 2026-07-28

### Added
- `OrbitTopbarComponent`: compact application header with start, centre and end projection slots
- Application-chrome background tokens (`--orbit-background-app`, `--orbit-background-chrome`)
- Topbar component tokens (`--orbit-topbar-*`)

## [0.1.3] - 2026-07-27

### Added
- CONTRIBUTING.md for public contributors
- CONTRIBUTORS.md for pre-release recognition
- GitHub Actions CI (lint, build, test) on PRs and main
- GitHub Actions publish workflow on version tags
- SECURITY.md vulnerability disclosure policy
- CODEOWNERS for review routing
- ESLint with angular-eslint for code quality
- Fork syncing instructions in CONTRIBUTING.md
- CI status badge in README

### Fixed
- CI build script (`build:lib`) and output path (`dist/orbit-new`)
- `.npmrc` registry routing for `@rhaegal222` scope
- Lockfile regeneration with all transitive dependencies

## [0.1.2] - 2026-07-27

### Fixed
- Modal compact input and fallback aria-label

## [0.1.1] - 2026-07-27

### Fixed
- Prism CJS/ESM interop crash in code-block

## [0.1.0] - 2026-07-27

### Added
- Initial public release
- 51 UI components with Angular adapters
- Three-tier design token system (reference, semantic, component)
- Theme-neutral architecture with CSS custom property overrides
- Comfortable and compact density modes
- Full accessibility support (keyboard nav, ARIA, focus management)
