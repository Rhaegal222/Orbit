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

## Theming

Orbit is intentionally separated from its visual identity. Components use semantic CSS custom properties, so the same component library can look native in different platforms without forks or Tailwind configuration.

Override a theme at application level:

```css
:root {
  --orbit-font-sans: 'Inter', sans-serif;
  --orbit-action-primary-bg: #6d28d9;
  --orbit-action-primary-fg: #ffffff;
  --orbit-radius-control: 0.5rem;
  --orbit-surface-canvas: #fbfaf8;
}
```

Choose a density for the operating context: `spacious` (48px), `comfortable`
(42px, default), `compact` (38px) or `dense` (34px, desktop expert flows).
For example, set compact density where an operator-facing application needs more information on screen:

```html
<body data-orbit-density="compact"></body>
```

Use semantic tokens for themes rather than component-specific values whenever possible. See [the theming guide](docs/THEMING.md) for the token layers, scoping and supported customization points.

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
