# Orbit

Reusable, themeable Angular UI foundations.

Install the package and import the default stylesheet once:

```bash
npm install @rhaegal222/orbit @angular/cdk
```

The consuming Angular application provides the required peer dependencies:
`@angular/core`, `@angular/common` and `@angular/cdk` (Angular 22 compatible versions).

```css
@import '@rhaegal222/orbit/styles';
```

Components and services are imported from `@rhaegal222/orbit`. Theme the library by overriding semantic `--orbit-*` CSS custom properties in the consuming application. The full theming guide and contribution documentation are maintained in the [Orbit repository](https://github.com/Rhaegal222/Orbit).

Use `orbit-icon` for all Orbit icons. Icons are decorative by default; give informational icons a label explicitly:

```html
<orbit-icon name="check" [size]="20" />
<orbit-icon name="mail" [size]="20" [decorative]="false" label="Messaggi" />
```

Use an accessible `ariaLabel` on every `orbit-icon-button`; its projected or named icon remains decorative.
