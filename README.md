# Orbit

Theme-neutral UI component library (Angular + Tailwind CSS).

Orbit provides accessible UI primitives and a three-tier design token system
(reference → semantic → component) that any consuming application can theme
on top of, without embedding organization-specific branding or business logic.

This is the public base library. Organization-specific forks build on top of
it via their own theme layer and stay in sync with this repository through
the standard git upstream-remote workflow.

## Install

```bash
npm install @rhaegal222/orbit
```

## Development

```bash
npm install
npm run build:lib   # build the library
npm test            # run unit tests
```

## Status

51 UI primitives (buttons, form controls, overlays, data display, navigation)
plus a three-tier design token system. Extracted from a private fork audit —
verified free of organization-specific branding or business logic.

## License

MIT
