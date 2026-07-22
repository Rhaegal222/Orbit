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
