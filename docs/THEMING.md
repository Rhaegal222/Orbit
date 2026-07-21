# Theming Galileo Orbit

Orbit components are visual contracts, not a fixed brand. They use CSS custom properties so an application can change its identity without forking components, compiling Tailwind again or adding a provider.

## Start with the default theme

Import it once in the global stylesheet of the consuming application:

```css
@import '@galileo/orbit/styles';
```

The import includes the default Orbit tokens and Tailwind v4 theme aliases. Tailwind is not a consumer requirement: Orbit components remain styled when the consuming application does not use Tailwind.

## Token layers

| Layer     | Prefix                                | Purpose                                        | Consumer guidance                          |
| --------- | ------------------------------------- | ---------------------------------------------- | ------------------------------------------ |
| Reference | `--orbit-ref-*`                       | Raw palette, type and geometry values          | Use when defining a complete brand theme.  |
| Semantic  | `--orbit-*`                           | Intent such as primary action, canvas and text | Preferred customization surface.           |
| Component | `--orbit-button-*`, `--orbit-field-*` | A component-specific mapping                   | Use only for a documented local exception. |

Components must consume semantic or component tokens. They must not use a reference token or a literal visual value directly.

## Create an application theme

Override semantic tokens after the Orbit import. This example has a different typeface, colour palette and geometry while using exactly the same components:

```css
:root {
  --orbit-font-sans: 'Inter', sans-serif;
  --orbit-surface-canvas: #faf8ff;
  --orbit-surface-default: #ffffff;
  --orbit-text-primary: #231942;
  --orbit-text-secondary: #655d78;
  --orbit-border-subtle: #ded8ea;
  --orbit-action-primary-bg: #6d28d9;
  --orbit-action-primary-bg-hover: #5b21b6;
  --orbit-action-primary-fg: #ffffff;
  --orbit-radius-control: 0.5rem;
  --orbit-radius-surface: 0.75rem;
}
```

For a complete palette, override reference values first and let the semantic defaults inherit them:

```css
:root {
  --orbit-ref-brand-500: #006b5f;
  --orbit-ref-brand-600: #00554b;
  --orbit-ref-neutral-900: #102a2a;
}
```

If a platform hosts more than one branded area, scope the overrides to its shell. Custom properties cascade to all nested Orbit components:

```css
[data-orbit-theme='partner'] {
  --orbit-action-primary-bg: #b45309;
  --orbit-action-primary-bg-hover: #92400e;
}
```

## Density

`comfortable` is the default. Set `data-orbit-density="compact"` on an application shell for data-dense operational screens:

```html
<main data-orbit-density="compact">
  <!-- Orbit components -->
</main>
```

Density only changes control height and spacing tokens. It must never change keyboard navigation, hit-area accessibility, hierarchy or component behavior.

## Tailwind v4

The Orbit stylesheet maps semantic tokens to Tailwind v4 theme values such as `text-orbit-text`, `bg-orbit-primary` and `rounded-orbit-control`. These utilities always resolve to the active CSS theme.

Orbit component consumers do not need Tailwind configuration. Applications that do use Tailwind can use these aliases for adjacent layout without duplicating the brand values.

## Compatibility rules

- Semantic token names and their meaning are public API.
- Removing or changing the meaning of a public token is a breaking change.
- Adding an optional token is a minor change.
- A component must provide a fallback through the default theme for every token it reads.
- Document every new public token and update `CHANGELOG.md` when the contract changes.
