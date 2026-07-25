# Orbit Core Foundation — Piano di implementazione

> **Data:** 2026-07-21
> **Spec associata:** `specs/2026-07-21-orbit-core-foundation.md`
> **Stato:** Completato

## Esito

- I sei componenti del perimetro leggono soltanto token semantici o component token documentati.
- `OrbitFormSectionComponent` espone `collapsible`, mantiene la sezione aperta per default e usa un button nativo con `aria-expanded`, `aria-controls`, regione collegata e `hidden` per il body.
- Verifiche completate: `ng build orbit` e `ng test orbit --watch=false` (115 test passati).
- La consumer fixture resta una verifica della fase dedicata del piano generale, non un blocker della Fase 0.

## Checklist ordinata

### 1. Token CSS — aggiunte a `tokens.css`

- [ ] 1.1 Aggiungere `--orbit-radius-full: 9999px`
- [ ] 1.2 Aggiungere componente token badge: `--orbit-badge-primary-fg`, `--orbit-badge-success-fg`, `--orbit-badge-danger-fg`, `--orbit-badge-warning-fg`, `--orbit-badge-info-fg`, `--orbit-badge-neutral-fg`

**File:** `projects/orbit/src/styles/tokens.css`
**Verifica:** `ng build orbit` produce CSS senza errori, token presenti nel bundle.

### 2. OrbitFormSectionComponent — token + collassabile

- [ ] 2.1 Sostituire token legacy nel CSS:
  - `--orbit-color-border` → `--orbit-border-subtle`
  - `--orbit-color-text-muted` → `--orbit-text-secondary`
  - `--orbit-font-family` → `--orbit-font-sans`
  - `--orbit-font-weight-bold` → `--orbit-font-weight-emphasis`
- [ ] 2.2 Aggiungere input `collapsible` (boolean, default `false`)
- [ ] 2.3 Aggiungere signal `collapsed` (stato interno, default `false` — aperto)
- [ ] 2.4 Modificare template: header come `<button type="button">` quando `collapsible`
- [ ] 2.5 Aggiungere `aria-expanded`, `aria-controls`, `id` stabile sul body
- [ ] 2.6 Aggiungere `hidden` attribute sul body quando collassato
- [ ] 2.7 Aggiungere `role="region"` sul body quando collassabile
- [ ] 2.8 Test: espansione/collasso, aria-expanded, collegamento header/body, tastiera

**File:** `projects/orbit/src/lib/components/form-section/form-section.component.ts`, `.html`, `.css`, `.spec.ts`
**Verifica:** test collapsible passano, `ng test orbit` verde.

### 3. OrbitTextInputComponent — token

- [ ] 3.1 Sostituire token legacy nel CSS:
  - `--orbit-color-border` → `--orbit-border-subtle`
  - `--orbit-color-surface` → `--orbit-surface-default`
  - `--orbit-color-surface-muted` → `--orbit-surface-subtle`
  - `--orbit-color-text` → `--orbit-text-primary`
  - `--orbit-color-text-muted` → `--orbit-text-secondary`
  - `--orbit-color-border-focus` → `--orbit-action-primary-bg`
  - `--orbit-color-danger` → `--orbit-status-danger`
  - `--orbit-color-primary` → `--orbit-action-primary-bg`
  - `--orbit-font-family` → `--orbit-font-sans`
  - `--orbit-font-size-base` → `--orbit-font-size-body`
  - `--orbit-control-padding-x` → `--orbit-control-padding-inline`
  - `--orbit-shadow-focus` → `--orbit-focus-ring`
  - `rgba(220, 53, 69, 0.25)` → `color-mix(in srgb, var(--orbit-status-danger) 25%, transparent)`
- [ ] 3.2 Test: verifica assenza token legacy nei CSS

**File:** `projects/orbit/src/lib/components/text-input/text-input.component.css`, `.spec.ts`
**Verifica:** `grep` token legacy = 0 occorrenze, test passano.

### 4. OrbitSelectComponent — token

- [ ] 4.1 Sostituire token legacy nel CSS:
  - `--orbit-color-border` → `--orbit-border-subtle`
  - `--orbit-color-surface` → `--orbit-surface-default`
  - `--orbit-color-surface-muted` → `--orbit-surface-subtle`
  - `--orbit-color-text` → `--orbit-text-primary`
  - `--orbit-color-text-muted` → `--orbit-text-secondary`
  - `--orbit-color-border-focus` → `--orbit-action-primary-bg`
  - `--orbit-color-danger` → `--orbit-status-danger`
  - `--orbit-color-primary` → `--orbit-action-primary-bg`
  - `--orbit-color-primary-subtle` → `color-mix(in srgb, var(--orbit-action-primary-bg) 15%, transparent)`
  - `--orbit-font-family` → `--orbit-font-sans`
  - `--orbit-font-size-base` → `--orbit-font-size-body`
  - `--orbit-control-padding-x` → `--orbit-control-padding-inline`
  - `--orbit-shadow-focus` → `--orbit-focus-ring`
  - `--orbit-shadow-lg` → `--orbit-shadow-overlay`
  - `--orbit-radius-sm` → `--orbit-radius-sm` (OK, esiste)
  - `rgba(220, 53, 69, 0.25)` → `color-mix(in srgb, var(--orbit-status-danger) 25%, transparent)`
- [ ] 4.2 Test: verifica assenza token legacy nei CSS

**File:** `projects/orbit/src/lib/components/select/select.component.css`, `.spec.ts`
**Verifica:** `grep` token legacy = 0 occorrenze, test passano.

### 5. OrbitCheckboxComponent — token

- [ ] 5.1 Sostituire token legacy nel CSS:
  - `--orbit-color-border` → `--orbit-border-subtle`
  - `--orbit-color-surface` → `--orbit-surface-default`
  - `--orbit-color-text` → `--orbit-text-primary`
  - `--orbit-color-primary` → `--orbit-action-primary-bg`
  - `--orbit-color-border-focus` → `--orbit-action-primary-bg`
  - `--orbit-font-family` → `--orbit-font-sans`
  - `--orbit-font-size-base` → `--orbit-font-size-body`
  - `#fff` → `var(--orbit-text-inverse)`
- [ ] 5.2 Test: verifica assenza token legacy nei CSS

**File:** `projects/orbit/src/lib/components/checkbox/checkbox.component.css`, `.spec.ts`
**Verifica:** `grep` token legacy = 0 occorrenze, test passano.

### 6. OrbitPillSwitchComponent — token

- [ ] 6.1 Sostituire token legacy nel CSS:
  - `--orbit-color-border` → `--orbit-border-subtle`
  - `--orbit-color-surface-muted` → `--orbit-surface-subtle`
  - `--orbit-color-surface` → `--orbit-surface-default`
  - `--orbit-color-text-muted` → `--orbit-text-secondary`
  - `--orbit-color-text` → `--orbit-text-primary`
  - `--orbit-color-primary` → `--orbit-action-primary-bg`
  - `--orbit-color-border-focus` → `--orbit-action-primary-bg`
  - `--orbit-font-family` → `--orbit-font-sans`
  - `--orbit-font-size-xs` → `--orbit-font-size-xs` (OK, esiste)
  - `--orbit-font-weight-bold` → `--orbit-font-weight-emphasis`
  - `--orbit-shadow-sm` → `--orbit-shadow-raised`
- [ ] 6.2 Test: verifica assenza token legacy nei CSS

**File:** `projects/orbit/src/lib/components/pill-switch/pill-switch.component.css`, `.spec.ts`
**Verifica:** `grep` token legacy = 0 occorrenze, test passano.

### 7. OrbitBadgeComponent — token

- [ ] 7.1 Sostituire token legacy nel CSS:
  - `--orbit-font-family` → `--orbit-font-sans`
  - `--orbit-font-size-xs` → `--orbit-font-size-xs` (OK)
  - `--orbit-font-weight-semibold` → `--orbit-font-weight-emphasis`
  - `--orbit-radius-full` → `--orbit-radius-full` (nuovo token)
  - `--orbit-color-primary-subtle` → `color-mix(in srgb, var(--orbit-action-primary-bg) 15%, transparent)`
  - `--orbit-color-primary-strong` → `--orbit-badge-primary-fg` (component token)
  - `--orbit-color-success-subtle` → `var(--orbit-status-success-subtle)`
  - `#157347` → `var(--orbit-badge-success-fg)`
  - `--orbit-color-danger-subtle` → `var(--orbit-status-danger-subtle)`
  - `#b02a37` → `var(--orbit-badge-danger-fg)`
  - `--orbit-color-warning-subtle` → `var(--orbit-status-warning-subtle)`
  - `#664d03` → `var(--orbit-badge-warning-fg)`
  - `--orbit-color-info-subtle` → `var(--orbit-status-info-subtle)`
  - `#055160` → `var(--orbit-badge-info-fg)`
  - `--orbit-color-neutral-subtle` → `var(--orbit-surface-subtle)`
  - `#41464b` → `var(--orbit-badge-neutral-fg)`
- [ ] 7.2 Test: verifica assenza token legacy e hard-coded nei CSS

**File:** `projects/orbit/src/lib/components/badge/badge.component.css`, `.spec.ts`
**Verifica:** `grep` token legacy + hex color = 0 occorrenze, test passano.

### 8. Verifica globale

- [ ] 8.1 `ng build orbit` — build libreria passa
- [ ] 8.2 `ng test orbit` — tutti i test passano
- [ ] 8.3 `grep -r 'orbit-color-\|orbit-font-family\|orbit-font-size-base\|orbit-control-padding-x\|orbit-shadow-focus\|orbit-shadow-lg\|orbit-shadow-sm\|orbit-font-weight-bold\|orbit-font-weight-semibold' projects/orbit/src/lib/components/{form-section,text-input,select,checkbox,pill-switch,badge}/` — 0 occorrenze
- [ ] 8.4 Aggiornare `docs/THEMING.md` e `CHANGELOG.md` per i token pubblici aggiunti

## Mapping token applicato

### form-section.component.css

| Prima                      | Dopo                           |
| -------------------------- | ------------------------------ |
| `--orbit-color-border`     | `--orbit-border-subtle`        |
| `--orbit-color-text-muted` | `--orbit-text-secondary`       |
| `--orbit-font-family`      | `--orbit-font-sans`            |
| `--orbit-font-weight-bold` | `--orbit-font-weight-emphasis` |

### text-input.component.css

| Prima                         | Dopo                                                              |
| ----------------------------- | ----------------------------------------------------------------- |
| `--orbit-color-border`        | `--orbit-border-subtle`                                           |
| `--orbit-color-surface`       | `--orbit-surface-default`                                         |
| `--orbit-color-surface-muted` | `--orbit-surface-subtle`                                          |
| `--orbit-color-text`          | `--orbit-text-primary`                                            |
| `--orbit-color-text-muted`    | `--orbit-text-secondary`                                          |
| `--orbit-color-border-focus`  | `--orbit-action-primary-bg`                                       |
| `--orbit-color-danger`        | `--orbit-status-danger`                                           |
| `--orbit-color-primary`       | `--orbit-action-primary-bg`                                       |
| `--orbit-font-family`         | `--orbit-font-sans`                                               |
| `--orbit-font-size-base`      | `--orbit-font-size-body`                                          |
| `--orbit-control-padding-x`   | `--orbit-control-padding-inline`                                  |
| `--orbit-shadow-focus`        | `--orbit-focus-ring`                                              |
| `rgba(220,53,69,0.25)`        | `color-mix(in srgb, var(--orbit-status-danger) 25%, transparent)` |

### select.component.css

| Prima                          | Dopo                                                                  |
| ------------------------------ | --------------------------------------------------------------------- |
| `--orbit-color-border`         | `--orbit-border-subtle`                                               |
| `--orbit-color-surface`        | `--orbit-surface-default`                                             |
| `--orbit-color-surface-muted`  | `--orbit-surface-subtle`                                              |
| `--orbit-color-text`           | `--orbit-text-primary`                                                |
| `--orbit-color-text-muted`     | `--orbit-text-secondary`                                              |
| `--orbit-color-border-focus`   | `--orbit-action-primary-bg`                                           |
| `--orbit-color-danger`         | `--orbit-status-danger`                                               |
| `--orbit-color-primary`        | `--orbit-action-primary-bg`                                           |
| `--orbit-color-primary-subtle` | `color-mix(in srgb, var(--orbit-action-primary-bg) 15%, transparent)` |
| `--orbit-font-family`          | `--orbit-font-sans`                                                   |
| `--orbit-font-size-base`       | `--orbit-font-size-body`                                              |
| `--orbit-control-padding-x`    | `--orbit-control-padding-inline`                                      |
| `--orbit-shadow-focus`         | `--orbit-focus-ring`                                                  |
| `--orbit-shadow-lg`            | `--orbit-shadow-overlay`                                              |
| `rgba(220,53,69,0.25)`         | `color-mix(in srgb, var(--orbit-status-danger) 25%, transparent)`     |

### checkbox.component.css

| Prima                        | Dopo                        |
| ---------------------------- | --------------------------- |
| `--orbit-color-border`       | `--orbit-border-subtle`     |
| `--orbit-color-surface`      | `--orbit-surface-default`   |
| `--orbit-color-text`         | `--orbit-text-primary`      |
| `--orbit-color-primary`      | `--orbit-action-primary-bg` |
| `--orbit-color-border-focus` | `--orbit-action-primary-bg` |
| `--orbit-font-family`        | `--orbit-font-sans`         |
| `--orbit-font-size-base`     | `--orbit-font-size-body`    |
| `#fff`                       | `var(--orbit-text-inverse)` |

### pill-switch.component.css

| Prima                         | Dopo                           |
| ----------------------------- | ------------------------------ |
| `--orbit-color-border`        | `--orbit-border-subtle`        |
| `--orbit-color-surface-muted` | `--orbit-surface-subtle`       |
| `--orbit-color-surface`       | `--orbit-surface-default`      |
| `--orbit-color-text-muted`    | `--orbit-text-secondary`       |
| `--orbit-color-text`          | `--orbit-text-primary`         |
| `--orbit-color-primary`       | `--orbit-action-primary-bg`    |
| `--orbit-color-border-focus`  | `--orbit-action-primary-bg`    |
| `--orbit-font-family`         | `--orbit-font-sans`            |
| `--orbit-font-weight-bold`    | `--orbit-font-weight-emphasis` |
| `--orbit-shadow-sm`           | `--orbit-shadow-raised`        |

### badge.component.css

| Prima                          | Dopo                                                                  |
| ------------------------------ | --------------------------------------------------------------------- |
| `--orbit-font-family`          | `--orbit-font-sans`                                                   |
| `--orbit-font-weight-semibold` | `--orbit-font-weight-emphasis`                                        |
| `--orbit-color-primary-subtle` | `color-mix(in srgb, var(--orbit-action-primary-bg) 15%, transparent)` |
| `--orbit-color-primary-strong` | `var(--orbit-badge-primary-fg)`                                       |
| `--orbit-color-success-subtle` | `var(--orbit-status-success-subtle)`                                  |
| `#157347`                      | `var(--orbit-badge-success-fg)`                                       |
| `--orbit-color-danger-subtle`  | `var(--orbit-status-danger-subtle)`                                   |
| `#b02a37`                      | `var(--orbit-badge-danger-fg)`                                        |
| `--orbit-color-warning-subtle` | `var(--orbit-status-warning-subtle)`                                  |
| `#664d03`                      | `var(--orbit-badge-warning-fg)`                                       |
| `--orbit-color-info-subtle`    | `var(--orbit-status-info-subtle)`                                     |
| `#055160`                      | `var(--orbit-badge-info-fg)`                                          |
| `--orbit-color-neutral-subtle` | `var(--orbit-surface-subtle)`                                         |
| `#41464b`                      | `var(--orbit-badge-neutral-fg)`                                       |
