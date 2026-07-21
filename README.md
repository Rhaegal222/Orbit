# Galileo Orbit

Reusable, themeable UI foundations for Galileo applications.

Orbit starts with portable design tokens and will grow into an Angular component library. Its public API is intentionally framework- and CSS-implementation-neutral: consumers use semantic component inputs and design tokens, while the internals can evolve from SCSS to Tailwind without changing application templates.

## Scope

- design tokens: color, spacing, radius, typography and control dimensions;
- reusable UI primitives: buttons, fields, selects, pickers, switches, form layout, attachments and modal adapters;
- Angular adapters only when they do not contain KMS business logic.

Orbit does **not** include API clients, permissions, routes, KMS models, or domain-specific fields such as customer and supplier selectors.

## Install

Configure the Galileo GitLab Package Registry once:

```ini
@galileo:registry=https://gitlab.galileo.test/api/v4/groups/142/-/packages/npm/
```

Then install the package:

```bash
npm install @galileo/orbit
```

Import the default Orbit theme once:

```css
@import '@galileo/orbit/styles';
```

Angular components will be imported from the same package entry point as they become available.

## Theming

Orbit is intentionally separated from its visual identity. Components use semantic CSS custom properties, so the same component library can look native in different Galileo platforms without forks or Tailwind configuration.

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

Set a compact density where an operator-facing application needs more information on screen:

```html
<body data-orbit-density="compact"></body>
```

Use semantic tokens for themes rather than component-specific values whenever possible. See [the theming guide](docs/THEMING.md) for the token layers, scoping and supported customization points.

## Development

```bash
npm run check
```

`check` verifies the package contents with `npm pack --dry-run`. See [the contribution guide](CONTRIBUTING.md) and [the release guide](docs/PUBLISHING.md).

## Compatibility policy

The package follows semantic versioning. Component APIs and token names are public contracts; breaking changes require a major version and an upgrade note.

## License

Copyright © 2026 Galileo. This is proprietary software; see [LICENSE](LICENSE).
