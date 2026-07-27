# Orbit

Theme-neutral UI component library for Angular applications.

Orbit provides accessible UI primitives and a three-tier design token system
(reference → semantic → component) that any consuming application can theme
on top of, without embedding organization-specific branding or business logic.

## Install

```bash
npm install @rhaegal222/orbit
```

## What's included

**51 UI primitives** across six categories:

| Category | Components |
|----------|-----------|
| **Form controls** | Button, Checkbox, Switch, Select, Text Input, Autocomplete, Slider, Pill Switch, Date Picker, Time Picker, Date Range Picker |
| **Layout** | Page Shell, Page Header, Workspace, Stack, Cluster, Divider, Form Grid, Form Section, Form Field, Form Action Bar |
| **Data display** | Table, Table Column, Table Row, Badge, Avatar, Skeleton, Progress Bar, Chip, Tooltip |
| **Navigation** | Sidebar, Navbar, Breadcrumb, Tab, Tab Panel, Tablist, Pagination |
| **Feedback** | Alert, Banner, Toast, Spinner, Confirm Dialog |
| **Overlay** | Modal, Modal Header, Modal Body, Modal Footer, Panel, Panel Surface, Popover, Code Block |
| **Attachment** | Attachment Dropzone, Attachment List, Attachment List Item |
| **Utility** | Icon, Auto Hide on Scroll, Selectable Tile |

**Three-tier token system:**

- **Reference tokens** — raw design values (colors, spacing, typography)
- **Semantic tokens** — intent-based aliases (`--orbit-color-primary`, `--orbit-space-2`)
- **Component tokens** — control-level overrides (`--orbit-button-bg`, `--orbit-input-border`)

**Themes:** Ships a complete default theme replaceable via CSS custom properties.
Supports `comfortable` (default) and `compact` density through `data-orbit-density`.

## Quick start

```typescript
import { provideOrbitI18n } from '@rhaegal222/orbit';

bootstrapApplication(AppComponent, {
  providers: [provideOrbitI18n({ locale: 'it' })],
});
```

```css
@import '@rhaegal222/orbit/styles/tokens.css';
@import '@rhaegal222/orbit/styles/styles.css';
@import '@rhaegal222/orbit/styles/theme.css';
```

## Development

```bash
npm install
npm run build:lib    # build the library
npm test             # run unit tests
npm run check        # full verification (build + test + pack + fixture)
```

## Peer dependencies

- Angular ^22.0.0
- Angular CDK ^22.0.0
- PrismJS ^1.29.0 (for Code Block syntax highlighting)

## License

MIT
