# Pattern, content and governance guide

Orbit provides reusable interaction decisions, not application workflows. Use this
guide before introducing a new component, service or local CSS extension.

## Interaction patterns

| Need | Orbit pattern | Use it when | Avoid it when |
| --- | --- | --- | --- |
| Focused task | Modal | A short decision or form needs focused completion. | The user must keep working with the canvas. |
| Preserved canvas | Offcanvas/sidebar | Navigation, filters or detail belong beside the current work. | The task is a blocking confirmation. |
| Local result | Inline alert | A field or section needs actionable, persistent feedback. | The message is only a brief confirmation. |
| Transient result | Toast | A completed, non-blocking action needs acknowledgement. | An error blocks progress; show it inline too. |
| Loading | Skeleton | The incoming content shape is known. Preserve its density. | Progress can be stated more clearly with a native progress control. |
| No data | Empty state | A collection has no result. Explain why and offer one useful action. | Data is still loading. |

Only one primary CTA belongs on a surface. Secondary actions use a less emphatic
Orbit tone or variant. A modal has a task-oriented title and persistent actions;
an offcanvas preserves the original context.

## Content

- Buttons use a verb plus object: `Salva modifiche`, not `OK` or a generic `Invia`.
- Errors state the cause and recovery action without blaming the user.
- Format dates, numbers and currency through an injectable localized formatter;
  do not concatenate formatted values in templates.
- Status is never conveyed by colour alone; include text and semantic markup.

## Catalog contract

Every public component has an alphabetic, localized Lab entry using `lab-example`.
Its page includes a working preview, public snippet and API, normal and exceptional
states, responsive notes, accessibility behaviour, maturity status and usage
decision. Composite catalog scenarios demonstrate modal forms, data-management
panels and the global theme/font/density/motion/text-scale switcher.

## Lifecycle

| Phase | Required evidence |
| --- | --- |
| Proposal | Problem, users, native alternative, minimal API and owner. |
| Spec | Tokens, a11y, localization, responsive, dark mode and non-goals. |
| Implementation | Core tests, Lab example, theming documentation and changelog. |
| Review | API, semver, compatibility, bundle and consumer fixture. |
| Deprecation | Alternative, migration, target version and support period. |

All public components declare `experimental`, `stable` or `deprecated`. A component
leaves experimental only after its API, accessible behaviour, responsive states,
Lab documentation and consumer-flow review are complete. The named owner remains
responsible for triage and migration guidance.
