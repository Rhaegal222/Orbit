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

## Breakpoints

| Token                    |            Value | Typical role           |
| ------------------------ | ---------------: | ---------------------- |
| `--orbit-breakpoint-sm`  |  `40rem` (640px) | smartphone → tablet    |
| `--orbit-breakpoint-md`  |  `48rem` (768px) | tablet → small desktop |
| `--orbit-breakpoint-lg`  | `64rem` (1024px) | standard desktop       |
| `--orbit-breakpoint-xl`  | `80rem` (1280px) | wide desktop           |
| `--orbit-breakpoint-2xl` | `96rem` (1536px) | wide workspace         |

These map to Tailwind v4's `sm:`/`md:`/`lg:`/`xl:`/`2xl:` utilities through `@theme`
in `theme.css`. A native `@media` condition cannot read a CSS custom property, so
every Orbit component's own `@media` rule repeats the literal rem value with a
comment naming the token it must match — treat the token as the documented source of
truth, not a live reference.

### Action foregrounds and dark theme

Action tokens separate the foreground used on a solid surface from the brighter foreground used by `soft`, `translucent`, `outline` and `flat` variants. This prevents dark-on-dark text when a theme changes the canvas.

| Tone    | Solid surface / foreground                               | Subtle foreground                  |
| ------- | -------------------------------------------------------- | ---------------------------------- |
| Primary | `--orbit-action-primary-bg`, `--orbit-action-primary-fg` | `--orbit-action-primary-fg-subtle` |
| Success | `--orbit-action-success-bg`, `--orbit-action-success-fg` | `--orbit-action-success-fg-subtle` |
| Danger  | `--orbit-action-danger-bg`, `--orbit-action-danger-fg`   | `--orbit-action-danger-fg-subtle`  |
| Neutral | `--orbit-action-neutral-bg`, `--orbit-action-neutral-fg` | `--orbit-action-neutral-fg-subtle` |

For a dark theme, set solid foregrounds to a light value where the action surface is saturated, and set subtle foregrounds to a lighter, contrast-tested tone. Do not rely on a dark brand colour for text on a dark surface.

Core also exposes narrowly scoped component tokens where a semantic token alone cannot express a readable state. Current examples are `--orbit-radius-full`, paired `--orbit-badge-*-{bg,fg}` tokens and the select option state tokens. They have default values and remain overrideable, but themes should prefer semantic tokens unless a component-specific exception is intentional.

### Typography roles

Every `font-size` declaration in Core maps to a semantic role and scales through `--orbit-text-scale`:

| Role     | Token                        | Intended use                                          |
| -------- | ---------------------------- | ----------------------------------------------------- |
| Display  | `--orbit-font-size-display`  | Page-level title                                      |
| Title    | `--orbit-font-size-title`    | Modal and surface title                               |
| Subtitle | `--orbit-font-size-subtitle` | Section heading                                       |
| Body     | `--orbit-font-size-body`     | Navigation, controls, table data and operational text |
| Label    | `--orbit-font-size-label`    | Field labels, table headers and compact metadata      |
| Caption  | `--orbit-font-size-caption`  | Secondary hints and badges                            |
| Code     | `--orbit-font-size-code`     | Code blocks and inline code                           |

Errors and persistent action status use the Label role, not Caption, so they remain readable in compact and dark interfaces.

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

Orbit has four density presets. Apply one on the application shell; nested
components inherit it unless their typed `density` input explicitly overrides it.

| Preset        | Control height at text scale `1` | Intended use                                             |
| ------------- | -------------------------------: | -------------------------------------------------------- |
| `spacious`    |                             48px | review, accessibility-focused flows and touch-heavy work |
| `comfortable` |                             42px | default operational forms                                |
| `compact`     |                             38px | information-dense desktop forms                          |
| `dense`       |                             34px | expert desktop tables and high-volume back-office work   |

```html
<main data-orbit-density="dense">
  <!-- Orbit components -->
</main>
```

`comfortable` is the default when the attribute is omitted. `dense` is designed
for pointer-driven desktop work; do not use it as the only presentation on a
touch-first surface.

```html
<orbit-form-grid density="compact">
  <!-- This grid overrides a surrounding density without changing its behavior. -->
</orbit-form-grid>
```

Density changes the complete operational rhythm: control and action-target
height, control padding, component spacing, form/section gap, modal chrome and
dropzone padding. It must never change keyboard navigation, hierarchy or
component behavior.

The four values are represented by the public `OrbitDensity` type; the local
overrides of `orbit-form-grid` and `orbit-form-section` accept
`OrbitDensityOverride` (`'inherit'` plus those values).

## Shape style

Set `data-orbit-shape` on an application shell to choose a coherent geometric
language. It changes only the shared radius tokens; colour, spacing, density and
component behaviour are unaffected.

| Preset        | Intended style                                                      |
| ------------- | ------------------------------------------------------------------- |
| `square`      | Editorial, architectural or data-first surfaces with sharp corners. |
| `operational` | Compact enterprise controls with restrained rounding.               |
| `soft`        | Balanced default for most product platforms.                        |
| `rounded`     | Friendlier consumer-facing or hospitality interfaces.               |

```html
<main data-orbit-shape="operational">
  <!-- Orbit components inherit the same control, tile and surface geometry. -->
</main>
```

The preset controls `--orbit-radius-sm`, `--orbit-radius-control`,
`--orbit-radius-surface`, `--orbit-radius-tile` and
`--orbit-radius-icon-surface`. `--orbit-radius-full` remains circular for
badges, avatars and explicitly pill-shaped controls.

## Composition spacing

## Layout primitives

The semantic spacing scale is exposed as `--orbit-space-2xs`, `--orbit-space-xs`,
`--orbit-space-sm`, `--orbit-space-md`, `--orbit-space-lg`, `--orbit-space-xl`
and `--orbit-space-2xl`. These aliases inherit the active density and text scale;
use them through `orbit-stack` and `orbit-cluster` instead of child margins.

`orbit-page-shell` uses `--orbit-page-padding-inline`,
`--orbit-page-max-width-document` and `--orbit-page-max-width-workspace` to
maintain page gutters and readable content widths. `orbit-workspace` composes a
responsive sidebar and main area, while `orbitDataAlign` aligns table data by
reading direction (`start`, `center`, `end`).

Use `--orbit-layout-gap`, `--orbit-field-stack-gap`, `--orbit-section-gap`,
`--orbit-modal-padding-inline` and
`--orbit-modal-padding-block` to tune dense operational forms consistently.
Form grid, form sections and modal chrome consume these semantic tokens. Every
density preset overrides them together, without consumer-specific margins.

`--orbit-modal-size-sm`, `--orbit-modal-size-md`, `--orbit-modal-size-lg`,
`--orbit-modal-size-xl`, `--orbit-modal-size-xxl` and `--orbit-modal-size-full` define the compositional
widths of `orbit-modal`:

| Size   |          Default | Intended composition                        |
| ------ | ---------------: | ------------------------------------------- |
| `sm`   |            480px | confirmation and short decisions            |
| `md`   |            720px | linear operational form                     |
| `lg`   |            960px | dense two-column form                       |
| `xl`   |           1180px | workspace, detail or complex data           |
| `xxl`  |           1320px | broad workspace or information-dense review |
| `full` | 96vw, max 1440px | focused workspace                           |

At 768px and below every size becomes full-width with a full-height mobile
surface, so consumers do not need size-specific responsive CSS.

`--orbit-modal-header-padding-block-start`,
`--orbit-modal-header-padding-block-end` and
`--orbit-modal-footer-padding-block` maintain equal header/footer heights: 80px
in spacious, 70px in comfortable, 60px in compact and 52px in dense density at
text scale `1`.
`--orbit-section-index-size`, `--orbit-section-divider`,
`--orbit-section-index-bg`, `--orbit-section-index-fg` and
`--orbit-section-index-border` define the numbered section header without
requiring consumer CSS. The default index is a soft brand surface rather than a
high-contrast ink badge, so it supports hierarchy without dominating the title.

The operational refresh additionally exposes `--orbit-text-label`,
`--orbit-text-tertiary`, `--orbit-text-placeholder`, `--orbit-radius-tile`,
`--orbit-radius-icon-surface`, `--orbit-dropzone-padding-block` and
`--orbit-dropzone-padding-inline`. They keep field labels, metadata, selectable
tiles and upload areas visually coherent when a consumer changes brand tokens.

`orbit-sidebar` is a generic navigation rail. Its width, collapsed width,
surface, foreground, active state and badge are controlled by the documented
`--orbit-sidebar-*` component tokens. The default derives from Orbit semantic
surfaces, text and primary-action tokens; consumers can override those tokens
to align it with their brand without application-specific navigation CSS. This includes the floating
edge toggle, icon sizes for expanded/compact modes and the active indicator.

## Colour, surfaces and elevation

The semantic colour contract is complete in both the default and dark themes:

| Domain           | Tokens                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Text             | `--orbit-text-primary`, `--orbit-text-secondary`, `--orbit-text-tertiary`, `--orbit-text-inverse`, `--orbit-text-placeholder`        |
| Surfaces         | `--orbit-surface-default`, `--orbit-surface-subtle`, `--orbit-surface-raised`, `--orbit-surface-floating`, `--orbit-surface-overlay` |
| Borders          | `--orbit-border-subtle`, `--orbit-border-strong`                                                                                     |
| Actions          | `--orbit-action-{primary,success,danger,neutral}-{bg,bg-hover,fg,fg-subtle}`                                                         |
| Status and focus | `--orbit-status-{success,warning,danger,info}` (with `-fg` and `-subtle` pairings), `--orbit-focus-ring`                             |

Use the explicit foreground paired with each action background. In particular,
`*-fg-subtle` is the foreground for soft, translucent, outline and flat actions;
do not derive it in component CSS. `--orbit-surface-modal` remains a compatibility
alias for `--orbit-surface-overlay` and new component styles use the latter.

Surface elevation is semantic: default (0), subtle (1), raised (2), floating (3)
and overlay (4). Pair raised, floating and overlay surfaces with their matching
`--orbit-shadow-raised`, `--orbit-shadow-floating` and `--orbit-shadow-overlay`
tokens. The dark theme separates surfaces tonally and uses lower-opacity shadows;
it does not depend on indiscriminately brighter borders.

### Layering

Orbit centralizes stacking values in `--orbit-z-base`, `--orbit-z-sticky`,
`--orbit-z-popover`, `--orbit-z-overlay` and `--orbit-z-toast`. Core components
do not declare numeric `z-index` values. Angular CDK Overlay remains the authority
for overlay placement and stacking; application sticky chrome and toast hosts should
consume the corresponding token. `--orbit-z-modal` and `--orbit-z-tooltip` are
compatibility aliases for existing consumer overrides.

## Visual roles

The default theme exposes raised, floating and overlay surfaces, floating elevation,
typography roles and motion tokens. Override `--orbit-surface-raised`,
`--orbit-surface-floating`, `--orbit-surface-modal`, `--orbit-shadow-floating`,
`--orbit-motion-fast`, `--orbit-motion-base` and `--orbit-easing-standard` rather
than individual component CSS values.

Set `data-orbit-shadow-intensity` to one of `0`, `0.25`, `0.5`, `0.75`, `1`,
`1.25` or `1.5`
on an application shell to scale the opacity of the shared raised, floating and
overlay shadows. The semantic `--orbit-shadow-raised`, `--orbit-shadow-floating`
and `--orbit-shadow-overlay` tokens remain the component contract. The same
level also scales the derived action-button and form-footer elevation tokens,
so no raised component is excluded from the setting.

Set `data-orbit-motion="off"` on the application shell to disable all Orbit
animations and transitions, including CDK overlay surfaces. Components use
`--orbit-motion-fast`, `--orbit-motion-base`, `--orbit-motion-slow` and
`--orbit-motion-spin` for their motion durations; the global attribute is the
appropriate user preference override.

The default values follow the operational visual contract: ink-based text,
subtle borders, 10px control radius, 14px selectable tiles and 20px modal
surfaces. Consumers can replace these semantic roles, including
`--orbit-font-sans`, without forking component styles.

## Text scale

Set one unitless `--orbit-text-scale` value (supported range: `0.85`–`1.5`) on
the application shell. Font roles derive from it and the control height, section
index and button height follow at 80% of the text growth rate; spacing density
does not change with text scale.

```css
.consumer-shell[data-density='large-text'] {
  --orbit-text-scale: 1.25;
}
```

At a scale above `1.2`, set `--orbit-optional-icon-display: none` on the same
shell. `orbit-selectable-tile` uses it to hide its optional leading icon while
keeping its trailing selection check visible.

### Authoring scale-safe components

All dimensional component CSS (`width`, `height`, `padding`, `margin`, `gap`,
`font-size`, `line-height`, border radius and positional offsets) must resolve
to `rem` or an `--orbit-*` token. Do not introduce bare `px` values. The only
exceptions are 1–2px solid hairline borders, the established visually-hidden
`sr-only` pattern, and focus-ring `box-shadow` spread values.

Size the outer SVG element from CSS with `rem` or `1em`; do not put a `px`
`width` or `height` attribute on it. This lets the icon inherit the same text
scale as surrounding content.

Before a new component is complete, inspect it in Orbit Lab with
`--orbit-text-scale: 1.5` and at 200% browser page zoom. Check for clipping,
overlap and broken icon or label alignment.

## Motion

Orbit motion is semantic and token-driven. Use `fast` for micro-feedback,
`base` for floating controls and expandable content, and `slow` only for large
overlay surfaces. Enter uses `--orbit-easing-standard`; collapse and exit use
`--orbit-easing-accelerate`; shared movement uses `--orbit-easing-shared`.

| Token                       | Default                        | Role                                  |
| --------------------------- | ------------------------------ | ------------------------------------- |
| `--orbit-motion-fast`       | `120ms`                        | Hover, pressed, toggle and fast exit  |
| `--orbit-motion-base`       | `180ms`                        | Dropdown, popover, tooltip and expand |
| `--orbit-motion-slow`       | `240ms`                        | Modal and large overlay entry         |
| `--orbit-motion-shimmer`    | `1200ms`                       | Continuous skeleton treatment         |
| `--orbit-easing-standard`   | `cubic-bezier(0.2, 0, 0, 1)`   | Enter and state change                |
| `--orbit-easing-accelerate` | `cubic-bezier(0.4, 0, 1, 1)`   | Exit and collapse                     |
| `--orbit-easing-shared`     | `cubic-bezier(0.4, 0, 0.2, 1)` | Shared movement                       |

The shipped stylesheet honors `prefers-reduced-motion: reduce` by reducing
transition and animation durations and limiting animated loops. Do not add
unconditional JavaScript timers to reproduce a CSS transition.

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

The date and date-range pickers use the configured locale through
`Intl.DateTimeFormat` for month and weekday names. `orbit-date-picker` supports
`date`, `month` and `year` precision; the latter two emit a `Date` normalized to
the first day of the selected period. Explicit component inputs still take
precedence over translated default labels.

## Tailwind v4

The Orbit stylesheet maps semantic tokens to Tailwind v4 theme values such as `text-orbit-text`, `bg-orbit-primary` and `rounded-orbit-control`. These utilities always resolve to the active CSS theme.

Orbit component consumers do not need Tailwind configuration. Applications that do use Tailwind can use these aliases for adjacent layout without duplicating the brand values.

## Compatibility rules

- Semantic token names and their meaning are public API.
- Removing or changing the meaning of a public token is a breaking change.
- Adding an optional token is a minor change.
- A component must provide a fallback through the default theme for every token it reads.
- Document every new public token and update `CHANGELOG.md` when the contract changes.
