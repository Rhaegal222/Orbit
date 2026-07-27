# Galileo Orbit — Documentazione completa

## Cos'è

**Galileo Orbit** (`@galileo/orbit`) è una libreria privata di design token e componenti UI riutilizzabili per le applicazioni Galileo. È costruita con **Angular 22** e **Tailwind CSS v4**, pubblicata sul GitLab Package Registry privato di Galileo.

L'API pubblica è intenzionalmente **neutrale rispetto al framework e all'implementazione CSS**: i consumatori usano input semantici e design token, mentre i componenti interni possono evolvere senza cambiare i template delle applicazioni.

---

## Architettura — La Triade

Orbit è un sistema composto da tre parti distinte:

```
Orbit Core (@galileo/orbit) — Libreria distribuita via npm
       ↓
┌──────────────┬────────────────┬──────────────────────┐
│  Orbit Lab   │ Orbit Studio   │  App consumer        │
│ catalogo/test│ tema + preview │ importa Core + tema  │
└──────────────┴────────────────┴──────────────────────┘
```

### Orbit Core
- Libreria Angular pubblicata come `@galileo/orbit`
- Contiene: componenti Angular riusabili, token CSS, tema di default, comportamenti accessibili
- API semplici: `@galileo/orbit` (JS/Angular) e `@galileo/orbit/styles` (CSS)
- **Non contiene**: pagine applicative, route, dati, permessi, persistenza, modelli KMS

### Orbit Lab
- Catalogo tecnico interno (non pubblicato)
- Mostra componenti in tutte le varianti e stati (loading, disabled, invalid, responsive, densità, temi)
- Ambiente di sviluppo, verifica e documentazione

### Orbit Studio
- Configuratore visuale interno (non pubblicato)
- Permette di modificare palette, tipografia, raggi, ombre, densità e generare il tema CSS risultante
- Output: file CSS versionabile (`orbit-theme.css`)

---

## Stack tecnologico

| Componente | Versione |
|---|---|
| Angular | 22 |
| Node.js | `^22.22.3` / `^24.15.0` |
| TypeScript | 6 |
| RxJS | 7.8 |
| Tailwind CSS | v4 (CSS-first) |
| Angular CDK | peer dependency richiesta |
| Build | ng-packagr (partial-Ivy) |

**Zero dipendenze da**: Bootstrap, ng-bootstrap, jQuery, Popper, Sass, KMS business logic.

---

## Design Token — Contratto a tre livelli

```
Reference token → Semantic token → Component token
valore grezzo      intento visivo    applicazione nel controllo
```

Esempio:
```
--orbit-ref-brand-500
        ↓
--orbit-action-primary-bg
        ↓
--orbit-button-primary-bg
```

| Layer | Prefisso | Scopo |
|---|---|---|
| Reference | `--orbit-ref-*` | Valori grezzi di palette, tipografia, geometria |
| Semantic | `--orbit-*` | Intento visivo (primary action, canvas, text) |
| Component | `--orbit-button-*`, `--orbit-field-*` | Mapping specifico per componente |

I componenti consumano **solo token semantici o di componente**, mai valori brand hard-coded.

---

## Temi

- Il tema di default è incluso nel pacchetto
- Override a livello applicativo tramite CSS custom properties:

```css
:root {
  --orbit-font-sans: 'Inter', sans-serif;
  --orbit-action-primary-bg: #6d28d9;
  --orbit-action-primary-fg: #ffffff;
  --orbit-radius-control: 0.5rem;
  --orbit-surface-canvas: #fbfaf8;
}
```

- Temi multipli: scoped via `[data-orbit-theme='partner']`
- Nessun provider JavaScript o configurazione Tailwind richiesta al consumer

---

## Densità

| Preset | Altezza controllo | Uso |
|---|---|---|
| `spacious` | 48px | Review, accessibilità, touch |
| `comfortable` | 42px | Default, form operativi |
| `compact` | 38px | Form desktop dense |
| `dense` | 34px | Tabelle esperti, back-office |

```html
<body data-orbit-density="compact">
```

La densità cambia dimensioni e spaziatura, **mai** navigazione, comportamento o accessibilità.

---

## Shape Style

| Preset | Stile |
|---|---|
| `square` | Angoli sharp, editorial/data-first |
| `operational` | Enterprise, arrotondamenti ridotti |
| `soft` | Default bilanciato |
| `rounded` | Consumer/hospitality |

---

## Responsive Breakpoints

| Token | Valore | Ruolo |
|---|---|---|
| `--orbit-breakpoint-sm` | 40rem (640px) | smartphone → tablet |
| `--orbit-breakpoint-md` | 48rem (768px) | tablet → desktop |
| `--orbit-breakpoint-lg` | 64rem (1024px) | desktop standard |
| `--orbit-breakpoint-xl` | 80rem (1280px) | desktop wide |
| `--orbit-breakpoint-2xl` | 96rem (1536px) | workspace wide |

Touch target minimo: `--orbit-control-height-touch-min` (2.75rem, WCAG 2.5.5) sotto `@media (pointer: coarse)`.

---

## Componenti (51 componenti attualmente)

### Primitive base
`badge`, `button`, `icon`, `icon-button`, `checkbox`, `switch`, `pill-switch`, `slider`, `spinner`, `tooltip`

### Form
`form-field`, `form-grid`, `form-section`, `form-action-bar`, `text-input`, `select`, `autocomplete`, `date-picker`, `date-range-picker`, `time-picker`, `checkbox`, `switch`

### Layout
`stack`, `cluster`, `page-shell`, `page-header`, `workspace`, `sidebar`, `navbar`

### Compositi
`modal` (+ `modal-header`, `modal-body`, `modal-footer`), `dialog`, `panel` (offcanvas), `tab`/`tab-panel`/`tablist`

### Data display
`table` (+ `table-column`, `table-row`), `code-block`, `attachment-list-item`, `skeleton-loader`, `selectable-tile`

### Feedback
`badge`, `toast`, `alert`, `banner`

### Direttive
`orbitAutoHideOnScroll` (nasconde toolbar su scroll), `orbitSelectableTileIcon`

---

## Modal composition

```html
<orbit-modal labelledBy="title">
  <orbit-modal-header titleId="title" title="Configura" />
  <orbit-modal-body>
    <orbit-form-grid>…</orbit-form-grid>
  </orbit-modal-body>
  <orbit-modal-footer variant="form">
    <orbit-form-action-bar />
  </orbit-modal-footer>
</orbit-modal>
```

Dimensioni: `sm` (480px), `md` (720px), `lg` (960px), `xl` (1180px), `xxl` (1320px), `full` (96vw, max 1440px). Sotto 768px tutto diventa full-width.

---

## Localizzazione

- Default: etichette italiane
- Contratto iniettabile: `ORBIT_I18N` + `provideOrbitI18n()`
- Date picker usa `Intl.DateTimeFormat` per nomi mesi/giorni
- Default labels ritenuti se non forniti

---

## Motione e animazioni

| Token | Default | Ruolo |
|---|---|---|
| `--orbit-motion-fast` | 120ms | Hover, pressed, toggle |
| `--orbit-motion-base` | 180ms | Dropdown, popover, expand |
| `--orbit-motion-slow` | 240ms | Modal, overlay grandes |
| `--orbit-motion-shimmer` | 1200ms | Skeleton continuo |

`data-orbit-motion="off"` disabilita tutte le animazioni. Supporto `prefers-reduced-motion: reduce`.

---

## Livelli visivi (Layering)

```css
--orbit-z-base
--orbit-z-sticky
--orbit-z-popover
--orbit-z-overlay
--orbit-z-toast
```

Shadow intensità regolabile via `data-orbit-shadow-intensity` (0 → 1.5).

---

## Governanza dei componenti

Ogni componente pubblico dichiara uno stato:
- **experimental**: API può cambiare
- **stable**: supportato sotto semver
- **deprecated**: alternativa e migration path esistono

Ciclo di vita: Proposal → Spec → Implementation → Review → Deprecation.

Promozione da `experimental` richiede: Lab example accessibile, test Core, API documentata, verifica responsive, review dal proprietario.

---

## Installazione e pubblicazione

```ini
# .npmrc
@galileo:registry=https://gitlab.galileo.test/api/v4/groups/142/-/packages/npm/
```

```bash
npm install @galileo/orbit @angular/cdk
```

- Pubblicazione: push tag `vX.Y.Z` → job CI `publish-package` → GitLab registry
- `npm run check` verifica il contenuto del pacchetto
- `npm run release:check` build + tarball + install consumer fixture
- Semantic versioning obbligatorio

---

## Verifica e qualità

```bash
npm run format:check
npm run lint
npm run test
npm run build
npm run pack:check
npm run test:consumer
```

Per ogni componente: keyboard nav, focus-visible, disabled, invalid, ARIA, responsive, screen reader labels.

---

## Piano di implementazione (stato)

| Fase | Stato |
|---|---|
| 0 — Decisioni architetturali | ✅ Completata |
| 1 — Governance | ⏳ In corso |
| 2 — Workspace Angular | ✅ Completata |
| 3 — Tailwind e token | ✅ Completata |
| 4 — MVP primitive UI | ✅ Completata (9 componenti) |
| 5 — Form avanzati | 🔜 Prossimo (autocomplete, date/time picker, dropzone) |
| 6 — Overlay e compositi | 📋 Pianificato |
| 7 — Qualità e documentazione | 📋 Pianificato |
| 8 — Test e consumer fixture | 📋 Pianificato |
| 9 — CI/CD e pubblicazione | 📋 Pianificato |
| 10 — Adozione progressiva | 📋 Pianificato |

---

## Regole fondamentali

- Nessun `px` bare nei CSS (eccezione: bordi 1-2px, sr-only, focus ring spread)
- Dimensioni in `rem` o token `--orbit-*`
- SVG icone sized via CSS con `rem`/`1em`
- Standalone components + OnPush + Signals
- Nessun accesso diretto a `window`, `document`, `localStorage`
- Compatibilità SSR e hydration obbligatoria
- Nessun bootstrap, jQuery, Sass nel package
- I token CSS sono contratti pubblici: rimuoverli o cambiarne il significato è breaking change
