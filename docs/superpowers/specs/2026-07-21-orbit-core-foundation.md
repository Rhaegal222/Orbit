# Orbit Core Foundation — Spec

> **Data:** 2026-07-21
> **Stato:** Definitiva
> **Autore:** Orbit Core agent

## Contesto

Orbit Studio (configuratore visuale) deve poter dichiarare di usare "componenti Orbit reali e tematizzabili" nella sua preview. Questo richiede che i componenti consumati da Studio leggano esclusivamente token del contratto semantico corrente definito in `tokens.css`, e che `orbit-form-section` supporti il collasso per l'editor accordion.

## Perimetro

Interventi esclusivamente su:

| Componente                  | Selector               | Tipo       |
| --------------------------- | ---------------------- | ---------- |
| `OrbitFormSectionComponent` | `<orbit-form-section>` | Standalone |
| `OrbitTextInputComponent`   | `<orbit-text-input>`   | CVA        |
| `OrbitSelectComponent`      | `<orbit-select>`       | CVA        |
| `OrbitCheckboxComponent`    | `<orbit-checkbox>`     | CVA        |
| `OrbitPillSwitchComponent`  | `<orbit-pill-switch>`  | CVA        |
| `OrbitBadgeComponent`       | `<orbit-badge>`        | Standalone |

Più: token CSS (`tokens.css`), test strettamente necessari, export pubblici solo se necessari.

## Token pubblici coinvolti

### Semantic tokens (superficie di theming approvata)

| Token                                  | Scopo                                                |
| -------------------------------------- | ---------------------------------------------------- |
| `--orbit-font-sans`                    | Font family                                          |
| `--orbit-font-size-body`               | Font size body                                       |
| `--orbit-font-size-xs`                 | Font size extra-small                                |
| `--orbit-font-weight-body`             | Font weight body                                     |
| `--orbit-font-weight-emphasis`         | Font weight emphasis (sostituisce `bold`/`semibold`) |
| `--orbit-text-primary`                 | Testo primario                                       |
| `--orbit-text-secondary`               | Testo secondario/muted                               |
| `--orbit-text-inverse`                 | Testo su sfondo colorato                             |
| `--orbit-surface-default`              | Sfondo default                                       |
| `--orbit-surface-subtle`               | Sfondo sottile/muted                                 |
| `--orbit-border-subtle`                | Bordo sottile                                        |
| `--orbit-border-strong`                | Bordo forte                                          |
| `--orbit-action-primary-bg`            | Azione primaria sfondo                               |
| `--orbit-action-primary-bg-hover`      | Azione primaria hover                                |
| `--orbit-action-primary-fg`            | Azione primaria testo                                |
| `--orbit-status-success`               | Stato successo                                       |
| `--orbit-status-success-subtle`        | Stato successo sottile                               |
| `--orbit-status-danger`                | Stato errore                                         |
| `--orbit-status-danger-subtle`         | Stato errore sottile                                 |
| `--orbit-status-warning`               | Stato warning                                        |
| `--orbit-status-warning-subtle`        | Stato warning sottile                                |
| `--orbit-status-info`                  | Stato info                                           |
| `--orbit-status-info-subtle`           | Stato info sottile                                   |
| `--orbit-focus-ring`                   | Anello di focus                                      |
| `--orbit-radius-control`               | Raggio controlli                                     |
| `--orbit-radius-surface`               | Raggio superfici                                     |
| `--orbit-control-height`               | Altezza controlli                                    |
| `--orbit-control-padding-inline`       | Padding inline controlli                             |
| `--orbit-shadow-raised`                | Ombra rialzata                                       |
| `--orbit-shadow-overlay`               | Ombra overlay                                        |
| `--orbit-space-1` .. `--orbit-space-6` | Spaziatura                                           |
| `--orbit-radius-sm`                    | Raggio piccolo                                       |

### Token da aggiungere a `tokens.css`

| Token                      | Valore                                                      | Scopo              |
| -------------------------- | ----------------------------------------------------------- | ------------------ |
| `--orbit-radius-full`      | `9999px`                                                    | Raggio pill/badge  |
| `--orbit-badge-primary-fg` | `var(--orbit-action-primary-bg-hover)`                      | Badge primary text |
| `--orbit-badge-success-fg` | `color-mix(in srgb, var(--orbit-status-success) 80%, #000)` | Badge success text |
| `--orbit-badge-danger-fg`  | `color-mix(in srgb, var(--orbit-status-danger) 80%, #000)`  | Badge danger text  |
| `--orbit-badge-warning-fg` | `color-mix(in srgb, var(--orbit-status-warning) 80%, #000)` | Badge warning text |
| `--orbit-badge-info-fg`    | `color-mix(in srgb, var(--orbit-status-info) 80%, #000)`    | Badge info text    |
| `--orbit-badge-neutral-fg` | `var(--orbit-text-secondary)`                               | Badge neutral text |

## API collassabile — `orbit-form-section`

### Input pubblici

```ts
collapsible = input(false, { transform: booleanAttribute });
```

### Comportamento

- `collapsible = false` (default): rendering invariato, title è un `<h3>` puro.
- `collapsible = true`:
  - Title è un `<button type="button">` con `class="orbit-form-section__toggle"`.
  - `aria-expanded` sull'header, collegato allo stato interno.
  - `aria-controls` punta all'id del body.
  - Body ha `id` stabile e `role="region"` quando collassabile.
  - Body nascosto con `hidden` attribute quando collassato (non `display:none` via CSS).
- Toggle con `collapsed` signal interno, inizialmente `false` (sezione aperta).
  - Click sul toggle inverte lo stato.
  - Tastiera: Space e Enter attivano il toggle (comportamento nativo button).
  - Focus nativo sul button, nessun `<div>` cliccabile.

### Non-obiettivi

- Nessun animazione di collasso/espansione nell'MVP.
- Nessun input, output o two-way binding per `collapsed` nell'MVP: è solo stato interno.
- Nessun persistence dello stato.

## Accessibilità

- Header collassabile è un `<button type="button">` — tastiera nativa funziona.
- `aria-expanded="true|false"` sull'header.
- `aria-controls="section-body-{id}"` sull'header.
- `id="section-body-{id}"` sul body.
- `role="region"` sul body quando collassabile (per screen reader).
- `aria-label` sul button con il titolo della sezione.
- Nessun `tabindex` custom, nessun event listener keyboard custom.

## Non-obiettivi

- Nessuna modifica ad altri componenti oltre ai 6 elencati.
- Nessuna modifica a `OrbitButtonComponent`, `OrbitDialogService`, modali, tooltip, popover, autocomplete, date-picker, time-picker, dropzone, form-action-bar, form-field, form-grid.
- Nessuna introduzione di Bootstrap, dipendenze esterne, API browser dirette o modelli KMS.
- Nessuna aggiunta o uso di alias legacy nei componenti del perimetro. Qualunque esigenza di retrocompatibilità deve essere esplicitamente approvata e documentata separatamente.
- Nessuna modifica all'API pubblica dei componenti esistenti (solo aggiunte).

## Criteri di uscita

1. Nessuno dei 6 componenti usa token legacy o valori visivi hard-coded evitabili.
2. `orbit-form-section` è collassabile, accessibile e testato.
3. I test Core rilevanti passano (`ng test orbit`).
4. Build della libreria passa (`ng build orbit`).
5. La spec e il piano Core indicano chiaramente cosa è stato completato.
6. I nuovi token aggiunti a `tokens.css` sono documentati in `docs/THEMING.md`, tematizzabili e registrati in `CHANGELOG.md`.
