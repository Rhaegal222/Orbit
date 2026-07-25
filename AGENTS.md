# Agents

## Scope

This file applies to the whole Galileo Orbit repository.

Galileo Orbit is a private, reusable UI foundation published as `@galileo/orbit`. It contains design tokens and framework-neutral UI primitives, with Angular adapters where appropriate. It must never become a copy of an application or of KMS.

## Collaboration scope

- Modify only the files and API surface required by the request.
- For analysis, diagnosis or review requests, report findings without changing files.
- Do not make a breaking public API, token or package change without explicitly calling it out.
- Do not add dependencies, registries, credentials, or CI secrets without clear user approval.
- Preserve unrelated user changes and never edit generated output such as `dist/`.
- Never commit, publish, tag, or change GitLab project settings unless the user asks for it.

## Product boundaries

This section governs the published package (`projects/orbit`). The internal applications `projects/orbit-lab` and `projects/orbit-studio` are not published and may have their own feature areas, routes and application state as needed for their purpose (a component catalog and a theme configurator, respectively); they must still respect the other rules in this file (platform baseline, styling, accessibility).

Orbit may contain:

- design tokens, themes and reusable accessibility primitives;
- buttons, inputs, selects, pickers, form layout, feedback and modal abstractions;
- optional Angular/CDK adapters with documented peer dependencies;
- tests, examples and documentation that demonstrate the public API.

Orbit must not contain:

- KMS business models, API clients, permissions, routes, feature modules or application state;
- domain controls such as customer, supplier, vehicle or insurance selectors;
- app-specific assets, endpoints, environment configuration or credentials;
- Bootstrap, jQuery, Popper or Bootstrap-derived APIs and class names.

When a component needs business data, expose typed inputs and outputs. The consuming application owns data loading, permissions and persistence.

## Platform baseline

- Target the current stable Angular major: Angular 22 at the time of writing.
- Use a compatible Node runtime: `^22.22.3`, `^24.15.0`, or newer supported by Angular.
- Keep Angular CLI, framework packages, compiler and builder on the same major and compatible patch line.
- Use TypeScript 6 and RxJS versions supported by the selected Angular release.
- Use standalone components, `OnPush` change detection and Angular signals for local component state. Do not introduce NgModules for new code.
- Prefer Angular CDK primitives for overlay, focus management, keyboard navigation, a11y, portal, scrolling, drag-drop and clipboard behaviors.
- Do not access `window`, `document`, `localStorage`, browser timers or DOM nodes directly unless no Angular/CDK primitive exists. When indispensable, isolate it behind an injected, browser-safe abstraction and cover it with tests.
- Keep the package compatible with SSR and hydration: browser-only work must be guarded and must not run during server rendering.

## Tailwind and styling

- Tailwind CSS v4 is the styling system. Do not add Bootstrap, Sass, Less, jQuery or a second utility framework.
- Use Tailwind’s CSS-first configuration (`@theme`, `@utility`, `@variant`, `@source`) and native CSS custom properties; do not start a new JavaScript Tailwind configuration unless a documented compatibility need requires it.
- Define reusable visual decisions through the public `--orbit-*` token contract. Components consume semantic or component tokens only; they must never depend directly on a brand colour, font, spacing scale, radius or shadow.
- Keep token layers separate: reference tokens provide raw values, semantic tokens express intent, and component tokens map that intent to a control. A consuming project customizes reference and semantic tokens; component tokens are only for a deliberate local exception.
- Ship a complete default theme, but make it replaceable by CSS custom-property overrides scoped to `:root`, an application shell or `[data-orbit-theme]`. Do not require a JavaScript provider or a Tailwind configuration to apply a theme.
- Support `comfortable` (default) and `compact` density through `data-orbit-density`. Density changes dimensions and spacing, never semantics, keyboard behavior or accessibility.
- Use semantic component inputs such as `tone`, `variant`, `size`, `invalid`, `disabled` and `loading`. Consumers must never need to know a Tailwind class string to use a component.
- Keep Tailwind class composition inside the component implementation. Do not accept arbitrary `class` inputs as a styling API; expose an explicit extension point only when there is a demonstrated need.
- Prefer logical layout primitives: CSS Grid for structured forms and Flexbox for one-dimensional alignment. Do not recreate Bootstrap’s grid naming or utility conventions.
- Keep style scope local to the component or an explicit Orbit theme file. Do not use broad global selectors, `!important`, or selectors that target a consuming application.
- Include `cursor-pointer`, clear focus-visible treatment and disabled-state feedback for every clickable control.
- Treat responsive and dense enterprise layouts as first-class: test narrow, standard desktop and large desktop widths. Avoid decorative cards, accidental whitespace and text overlap.
- For dimensional CSS (`width`, `height`, `padding`, `margin`, `gap`, `font-size`, `line-height`, radii and positional offsets), use a `rem` value or an `--orbit-*` token; never introduce a bare `px` literal.
- The only allowed `px` exceptions are 1–2px solid hairline borders, the established visually-hidden `sr-only` pattern, and focus-ring `box-shadow` spread values. Any other `px` use is a defect.
- Size outer SVG icons from CSS with `rem` or `1em`; never give the outer `<svg>` a `px` `width` or `height` attribute.
- Before completing a new component, inspect it in `orbit-lab` at `--orbit-text-scale: 1.5` and at 200% browser page zoom.

## Component API and accessibility

- Each component must have one clear responsibility and a stable, typed public API.
- Use Angular input/output functions and typed models. Do not expose mutable internal objects or leak third-party component instances.
- Form controls must implement `ControlValueAccessor`, support disabled and invalid states, associate labels and errors correctly, and preserve native keyboard behavior.
- Buttons must have a semantic `type`; icon-only controls require an accessible name.
- Overlays, menus and dialogs must manage focus, Escape, backdrop behavior and ARIA semantics through Angular CDK or a tested adapter.
- Use native HTML controls where they meet the requirement. Do not build a custom picker, select or menu solely for visual styling.
- Do not use color as the sole indicator of status, validation or selection.

## Package architecture

- Keep the public surface simple: `@galileo/orbit` is the only JavaScript/Angular import and `@galileo/orbit/styles` is the only optional stylesheet import.
- Do not expose technical entry points such as `/angular`, `/cdk` or `/primitives`. Angular CDK and other implementation details remain internal.
- Export only supported symbols from `public-api.ts` or the relevant entry-point API. Internal helpers stay internal.
- Angular packages belong in `peerDependencies`, never normal `dependencies`. Optional integrations use optional peer dependencies when supported.
- Build Angular libraries with `ng-packagr` in partial-Ivy mode. Never publish `dist/`, `node_modules`, application source or full-Ivy output.
- Keep package assets explicit in `files` and `exports`. Every documented import path must resolve from the packed tarball.
- Any public API, token, peer-dependency or export-path change requires an appropriate semantic-version bump and a `CHANGELOG.md` entry.

## Testing and verification

Run the narrowest relevant checks first, then the complete package checks when feasible.

- Current package verification: `npm run check`
- After the Angular workspace exists: use the package scripts for format, lint, unit tests, build and package verification; do not invent untracked commands.
- For every public component change: verify keyboard navigation, focus-visible state, disabled state, validation, screen-reader labels and responsive behavior.
- For Tailwind changes: inspect generated styles and confirm the packed package includes every referenced CSS asset.
- Before publishing: run the production build, tests, `npm pack --dry-run`, and install the produced tarball in a clean consumer fixture.
- If a command cannot run, state exactly what failed and which verification remains outstanding.

## Documentation and releases

- Update `README.md` for installation or primary API changes.
- Update `CONTRIBUTING.md` when workflow or boundaries change.
- Record user-visible changes under **Unreleased** in `CHANGELOG.md`.
- Update `docs/PUBLISHING.md` for registry, release or peer-dependency changes.
- Do not store access tokens in `.npmrc`, Git history, examples, logs or documentation. Use CI variables or local environment variables.
- Publish only from a protected semantic-version tag after CI passes. Do not publish a package that has not been tested from its packed tarball.
