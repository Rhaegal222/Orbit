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

Core also exposes narrowly scoped component tokens where a semantic token alone cannot express a readable state. Current examples are `--orbit-radius-full` and the `--orbit-badge-*-fg` foreground tokens. They have default values and remain overrideable, but themes should prefer semantic tokens unless a component-specific exception is intentional.

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

## Composition spacing

Use `--orbit-layout-gap`, `--orbit-layout-gap-compact`, `--orbit-field-stack-gap`,
`--orbit-section-gap`, `--orbit-modal-padding-inline` and
`--orbit-modal-padding-block` to tune dense operational forms consistently.
Form grid, form sections and modal chrome consume these semantic tokens. Compact
density overrides them together, without consumer-specific margins.

`--orbit-modal-size-sm`, `--orbit-modal-size-md`, `--orbit-modal-size-lg` and
`--orbit-modal-size-full` define the compositional widths of `orbit-modal`.
`--orbit-section-index-size` and `--orbit-section-divider` define the numbered
section header without requiring consumer CSS. The standard control is 42px in
comfortable density and 38px in compact density.

The operational refresh additionally exposes `--orbit-text-label`,
`--orbit-text-tertiary`, `--orbit-text-placeholder`, `--orbit-radius-tile`,
`--orbit-radius-icon-surface`, `--orbit-dropzone-padding-block` and
`--orbit-dropzone-padding-inline`. They keep field labels, metadata, selectable
tiles and upload areas visually coherent when a consumer changes brand tokens.

## Visual roles

The default theme exposes raised, floating and modal surfaces, floating elevation,
typography roles and motion tokens. Override `--orbit-surface-raised`,
`--orbit-surface-floating`, `--orbit-surface-modal`, `--orbit-shadow-floating`,
`--orbit-motion-fast`, `--orbit-motion-base` and `--orbit-easing-standard` rather
than individual component CSS values.

The default values follow the operational visual contract: ink-based text,
subtle borders, 10px control radius, 14px selectable tiles and 20px modal
surfaces. Consumers can replace these semantic roles, including
`--orbit-font-sans`, without forking component styles.

## Localization

Orbit provides Italian labels by default and has no dependency on a specific
translation library. Provide `ORBIT_I18N` at application or feature scope with
`provideOrbitI18n`; omitted labels retain their default values.

```ts
import { provideOrbitI18n } from '@galileo/orbit';

bootstrapApplication(AppComponent, {
  providers: [
    provideOrbitI18n({
      locale: 'en-GB',
      labels: { close: 'Close', select: 'Select…', noResults: 'No results' },
    }),
  ],
});
```

The date picker uses the configured locale through `Intl.DateTimeFormat` for
month and weekday names. Explicit component inputs still take precedence over
translated default labels.

## Tailwind v4

The Orbit stylesheet maps semantic tokens to Tailwind v4 theme values such as `text-orbit-text`, `bg-orbit-primary` and `rounded-orbit-control`. These utilities always resolve to the active CSS theme.

Orbit component consumers do not need Tailwind configuration. Applications that do use Tailwind can use these aliases for adjacent layout without duplicating the brand values.

## Compatibility rules

- Semantic token names and their meaning are public API.
- Removing or changing the meaning of a public token is a breaking change.
- Adding an optional token is a minor change.
- A component must provide a fallback through the default theme for every token it reads.
- Document every new public token and update `CHANGELOG.md` when the contract changes.
