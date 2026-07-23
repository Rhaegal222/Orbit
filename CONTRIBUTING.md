# Contributing to Wyrmrest Orbit

## Boundaries

Keep Orbit independent from Wyrmrest application domains. Do not import API services, permissions, routes or business models.

Expose semantic APIs such as `tone`, `variant`, `size`, `invalid` and `disabled`. Do not require consumers to know Bootstrap or Tailwind utility classes.

## Design system rules

- use `--orbit-*` tokens for reusable visual decisions;
- prefer component-scoped styles;
- keep optional framework integrations behind dedicated entry points;
- add a documented migration note for every public API or token change;
- provide focused tests and an example whenever a new primitive is introduced.

## Pull requests

1. Keep a change focused on one primitive or concern.
2. Update the README or the relevant document when the public contract changes.
3. Run `npm run check`.
4. Add an entry under **Unreleased** in `CHANGELOG.md` for user-visible changes.

## Component governance

Every new public component begins with a short proposal that records the problem,
intended users, the native HTML alternative considered and the smallest viable API.
The implementation spec must cover tokens, keyboard and screen-reader behaviour,
localization, responsive and dark-mode behaviour, non-goals, and an owner.

Use one maturity status in the component documentation:

- `experimental`: the API can change while it is being proven in real flows;
- `stable`: the API is supported under semantic versioning;
- `deprecated`: a supported alternative and migration path exist.

Promotion from `experimental` requires an accessible Lab example, focused Core
tests, documented public API and theming behaviour, responsive verification, and
at least one consumer-flow review by the named owner. Deprecations must state the
replacement, target removal version and support period. Do not create local CSS
or application-specific wrappers to bypass this process.

## Definition of ready

Before review, verify the public API, semver impact, bundle impact and the clean
consumer fixture. For a release, run `npm run check` and install the packed
tarball in `consumer-fixture`; `npm pack --dry-run` alone is not sufficient.
