# Wyrmrest Orbit

Reusable UI foundations for Wyrmrest applications.

This is the independent Wyrmrest distribution of the Orbit UI foundations, initially derived from Galileo Orbit. Wyrmrest owns its roadmap, releases and package contract.

Orbit starts with portable design tokens and will grow into an Angular component library. Its public API is intentionally framework- and CSS-implementation-neutral: consumers use semantic component inputs and design tokens, while the internals can evolve from SCSS to Tailwind without changing application templates.

## Scope

- design tokens: color, spacing, radius, typography and control dimensions;
- reusable UI primitives: buttons, fields, selects, pickers, switches, form layout, attachments and modal adapters;
- Angular adapters only when they do not contain Wyrmrest business logic.

Orbit does **not** include API clients, permissions, routes, application models, or domain-specific fields such as customer and supplier selectors.

## Install

Configure the Wyrmrest Forgejo Package Registry once:

```ini
@wyrmrest:registry=https://git.wyrmrest.it/api/packages/wyrmrest/npm/
```

Then install the package:

```bash
npm install @wyrmrest/orbit
```

The first release currently exposes the token stylesheet:

```scss
@import '@wyrmrest/orbit/styles';
```

Angular component entry points will be added as the existing UI Kit is extracted and validated.

## Development

```bash
npm run check
```

`check` verifies the package contents with `npm pack --dry-run`. See [the contribution guide](CONTRIBUTING.md) and [the release guide](docs/PUBLISHING.md).

## Website

`orbit.wyrmrest.it` is the public home of Orbit and uses the package token stylesheet directly. It contains the overview, the token reference at `/lab/`, and composition examples at `/studio/`.

The static site is served by the repository's Nginx container. Traefik remains disabled by default; production enables it through `TRAEFIK_ENABLE=true` after DNS and the protected promotion flow are complete.

## Compatibility policy

The package follows semantic versioning. Component APIs and token names are public contracts; breaking changes require a major version and an upgrade note.

## License

Copyright © 2026 Wyrmrest. This is proprietary software; see [LICENSE](LICENSE).
