# Contributing to Orbit

Thanks for your interest in contributing to Orbit. This document explains how to get started.

## Code of conduct

Be respectful, constructive, and professional. We are building a shared UI library — assume good intent and focus on the technical problem.

## What Orbit is

Orbit is a **theme-neutral UI component library** for Angular. It provides accessible UI primitives and a three-tier design token system that any application can theme on top of.

Orbit is **not**:

- an application or a business logic layer
- a CSS framework or utility library
- a collection of domain-specific components

## Getting started

### Fork and clone

```bash
git clone https://github.com/<your-username>/Orbit.git
cd Orbit
npm install
```

### Development commands

```bash
npm run build          # build the library
npm test               # run unit tests
npm run check          # full verification (build + test + pack)
npm run lint           # lint the codebase
npm run format:check   # check formatting
```

## Making changes

### Branch strategy

```
main (protected) ← feature branches
```

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes.
3. Run `npm run check` to verify everything passes.
4. Open a Pull Request against `main`.

### Commit conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(slider): add range mode with dual handles
fix(modal): restore focus trap on close
docs: update README installation section
chore: bump Angular to 22.0.7
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `release`.

### What to include in a PR

- **One logical change per PR.** Don't mix unrelated fixes.
- **Tests** for new components or behavior changes.
- **Documentation** updates if the public API changes.
- **CHANGELOG.md** entry under **Unreleased** for user-visible changes.

## Component guidelines

### API design

- Use semantic inputs: `tone`, `variant`, `size`, `invalid`, `disabled`, `loading`.
- Implement `ControlValueAccessor` for form controls.
- Expose typed `@Input()` and `@Output()` — never mutable internal objects.
- Icon-only buttons require an accessible name (`aria-label`).

### Styling

- Use `--orbit-*` design tokens for all visual decisions.
- No bare `px` values (except 1–2px borders and `sr-only`).
- No Bootstrap, jQuery, or second CSS framework.
- Support `comfortable` (default) and `compact` density via `data-orbit-density`.

### Accessibility

- Keyboard navigation must work for all interactive elements.
- Focus-visible treatment on every clickable control.
- ARIA roles, labels, and live regions where appropriate.
- Test at `--orbit-text-scale: 1.5` and 200% browser zoom.

### Testing

- Unit tests with Vitest for every public component.
- Test keyboard navigation, disabled state, and validation.
- Verify the packed tarball installs cleanly in a consumer fixture.

## Reporting issues

Open a GitHub Issue with:

- A clear title and description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Angular version, Orbit version, and browser

## Release process

Releases are managed by maintainers. The publish workflow is automated:

1. Maintainer bumps version in `projects/orbit/package.json`.
2. Maintainer creates a tag: `git tag v0.1.3 && git push upstream v0.1.3`.
3. GitHub Actions builds and publishes to npm automatically.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
