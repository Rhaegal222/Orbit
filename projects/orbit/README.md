# Galileo Orbit

Reusable, themeable Angular UI foundations for Galileo applications.

Install the package and import the default stylesheet once:

```bash
npm install @galileo/orbit @angular/cdk
```

The consuming Angular application provides the required peer dependencies:
`@angular/core`, `@angular/common` and `@angular/cdk` (Angular 22 compatible versions).

```css
@import '@galileo/orbit/styles';
```

Components and services are imported from `@galileo/orbit`. Theme the library by overriding semantic `--orbit-*` CSS custom properties in the consuming application. The full theming guide and contribution documentation are maintained in the [Orbit repository](https://gitlab.galileo.test/galileo/orbit).

Use `orbit-icon` for all Orbit icons. Icons are decorative by default; give informational icons a label explicitly:

```html
<orbit-icon name="check" [size]="20" />
<orbit-icon name="mail" [size]="20" [decorative]="false" label="Messaggi" />
```

Use an accessible `ariaLabel` on every `orbit-icon-button`; its projected or named icon remains decorative.

Use `orbit-topbar` for compact application chrome, not for horizontal navigation. Project Orbit
controls or content in its start, centre and end slots:

```html
<orbit-topbar ariaLabel="Area operativa">
  <orbit-icon-button orbitTopbarStart icon="menu" ariaLabel="Apri navigazione" />
  <strong orbitTopbarCenter>Dashboard</strong>
  <orbit-icon-button orbitTopbarEnd icon="settings" ariaLabel="Apri impostazioni" />
</orbit-topbar>
```

`--orbit-background-app` and `--orbit-background-chrome` provide semantic backgrounds for the
application canvas and persistent chrome. `orbit-topbar` consumes its own `--orbit-topbar-*`
tokens, mapped to those semantic surfaces by default.
