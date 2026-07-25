# Galileo Orbit — Piano di implementazione

> **Stato aggiornato:** Fasi 0–4 completate (MVP). Prossimo passo: Fase 5.

## Obiettivo

Pubblicare `@galileo/orbit` come libreria privata di componenti UI e design token, costruita con Angular 22 e Tailwind CSS v4. La libreria deve essere indipendente da KMS, accessibile, pronta per SSR e semplice da usare in ogni progetto Galileo.

## Principio guida: semplicità per chi la usa

Orbit deve nascondere la complessità tecnica. Angular CDK, Tailwind, overlay, focus management e token sono dettagli interni, non requisiti per i consumer.

L'esperienza prevista è:

```bash
npm install @galileo/orbit
```

```ts
import {
  OrbitButtonComponent,
  OrbitFormSectionComponent,
  OrbitTextInputComponent,
  OrbitSelectComponent,
} from '@galileo/orbit';
```

```html
<orbit-form-section title="Dati polizza">
  <orbit-form-field label="Compagnia" inputId="compagnia" required>
    <orbit-text-input inputId="compagnia" [(ngModel)]="compagnia" />
  </orbit-form-field>
  <orbit-form-field label="Periodicità" inputId="periodicita">
    <orbit-select inputId="periodicita" [options]="periodicita" />
  </orbit-form-field>
  <orbit-button label="Salva" variant="solid" />
</orbit-form-section>
```

Regole di API:

- un import principale: `@galileo/orbit`;
- un import opzionale di soli token: `@galileo/orbit/styles`;
- nessun modulo da configurare, provider obbligatorio o configurazione Tailwind richiesta al consumer;
- nessun entry point tecnico esposto come `/angular`, `/cdk` o `/primitives`;
- componenti con prefisso unico e leggibile: `OrbitButtonComponent` e `<orbit-button>`;
- input pochi e coerenti: `variant`, `tone`, `size`, `disabled`, `loading`, `invalid`;
- servizi avanzati con lo stesso import principale, per esempio `OrbitDialogService`;
- ogni API pubblica deve avere un esempio copiabile nel README o nel catalogo componenti.

---

## Fase 0 — Decisioni architetturali ✅

- [x] Angular 22 confermato come baseline (CLI 22.0.7).
- [x] Node `^24.15.0` (v24.16.0 installato via nvm), TypeScript 6.0.2, RxJS 7.8.
- [x] Nessun Bootstrap, ng-bootstrap, jQuery, Popper, Sass.
- [x] `AGENTS.md` e questo piano committati.

**Criterio di uscita:** scelte confermate in README, AGENTS e package metadata.

## Fase 1 — Governance e repository

- [ ] Committare `AGENTS.md` e questo piano.
- [ ] Proteggere `main` e i tag di release.
- [ ] Richiedere merge request e pipeline verde prima dell'unione.
- [ ] Mantenere GitLab Package Registry come registry unico.
- [ ] Conservare segreti e token solo nelle variabili CI o nell'ambiente locale.

**Criterio di uscita:** repository pronta per contributi e rilasci, senza segreti versionati.

## Fase 2 — Workspace e libreria Angular ✅

- [x] Workspace Angular 22 creata senza applicazione business.
- [x] Libreria `projects/orbit/` con ng-packagr partial-Ivy.
- [x] Strict TypeScript 6 + strict template checking abilitati.
- [x] `OnPush` + Signals come default per tutti i componenti.
- [x] Angular CDK aggiunto come `peerDependencies` (opzionale).
- [x] Demo app `projects/orbit-lab/` con routing standalone.
- [x] Build: `ng build orbit` → `dist/orbit-new/` (partial-Ivy, FESM2022).
- [x] Pack: 149.1 kB unpacked, 10 file.

Struttura realizzata:

```text
projects/orbit/
├── src/lib/components/
│   ├── badge/
│   ├── button/
│   ├── checkbox/
│   ├── form-field/
│   ├── form-grid/
│   ├── form-section/
│   ├── pill-switch/
│   ├── select/
│   └── text-input/
├── src/styles/
│   ├── tokens.css      ← --orbit-* design tokens
│   ├── theme.css       ← @theme Tailwind v4
│   └── styles.css      ← entry point unico per consumer
├── ng-package.json
├── package.json
└── postcss.config.js

projects/orbit-lab/
├── src/app/app.component.ts   ← demo con tutti i componenti
└── src/main.ts
```

**Criterio di uscita:** `ng build orbit` produce un pacchetto partial-Ivy installabile. ✅

## Fase 3 — Tailwind e design token ✅

- [x] Tailwind CSS v4 integrato in modalità CSS-first (`@tailwindcss/postcss`).
- [x] Token `--orbit-*` definiti per: colori (base + semantici), tipografia, spaziatura, raggi, dimensioni controlli, ombre, overlay.
- [x] `@theme` CSS condiviso tra classi Tailwind e componenti.
- [x] Distribuzione token da `@galileo/orbit/styles` (`tokens.css`).
- [x] Stili componenti compilati nel bundle (consumer non configura Tailwind).
- [ ] Tema override via `[data-orbit-theme]` (da fare).
- [ ] Densità `comfortable` / `compact` via `data-orbit-density` (da fare).

**Criterio di uscita:** consumer fixture mostra token funzionanti senza Bootstrap. ✅ (parziale: tema/densità da completare)

## Fase 4 — MVP delle primitive UI ✅

Componenti implementati:

| # | Componente | Selector | Tipo | Stato |
|---|---|---|---|---|
| 1 | `OrbitButtonComponent` | `<orbit-button>` | Standalone | ✅ 4 toni × 4 varianti |
| 2 | `OrbitFormFieldComponent` | `<orbit-form-field>` | Standalone | ✅ label/hint/error/required |
| 3 | `OrbitTextInputComponent` | `<orbit-text-input>` | CVA | ✅ text/email/password/currency/number |
| 4 | `OrbitSelectComponent` | `<orbit-select>` | CVA | ✅ keyboard nav, search, filter |
| 5 | `OrbitCheckboxComponent` | `<orbit-checkbox>` | CVA | ✅ keyboard toggle |
| 6 | `OrbitPillSwitchComponent` | `<orbit-pill-switch>` | CVA | ✅ exclusive selection |
| 7 | `OrbitBadgeComponent` | `<orbit-badge>` | Standalone | ✅ 6 toni |
| 8 | `OrbitFormSectionComponent` | `<orbit-form-section>` | Standalone | ✅ title/divided/fill |
| 9 | `OrbitFormGridComponent` | `<orbit-form-grid>` | Layout | ✅ CSS Grid 7fr/5fr responsive |

Per ogni componente:

- ✅ standalone, `OnPush` e API tipizzata con signals;
- ✅ focus-visible, tastiera, disabled e loading;
- ✅ stato invalid e messaggi associabili (via form-field);
- ✅ CSS locale con token `--orbit-*`, zero Bootstrap;
- [ ] test unitari (da fare);
- [ ] esempi completi in Orbit Lab (bozza in app.component.ts).

**Criterio di uscita:** un form reale si compone solo con Orbit e senza markup Bootstrap. ✅

---

## Fase 5 — Form control avanzati (prossimo)

### 5.1 Currency e number input

Estendere `OrbitTextInputComponent` con `type="currency"` e `type="number"` già supportati. Verificare:
- formattazione migliaia/decimali corretta per locale IT;
- `inputmode="decimal"` / `inputmode="numeric"`;
- supporto `min`, `max`, `step` come input opzionali.

### 5.2 Autocomplete

Nuovo componente `OrbitAutocompleteComponent`:
- CVA con `OrbitSelectOption[]` e filtro client-side;
- CDK Overlay per il menu (non `position: absolute` nel template);
- `aria-activedescendant`, `role="listbox"`, `role="option"`;
- debounce opzionale per ricerca remota;
- slot per template custom delle opzioni.

### 5.3 Date picker

Nuovo componente `OrbitDatePickerComponent`:
- CVA con `Date | null`;
- CDK Overlay per il calendario;
- Calendario custom (nessuna dipendenza ng-bootstrap);
- Navigazione mese/anno con menu a tendina;
- Input mask `GG/MM/AAAA`;
- Supporto `minDate`, `maxDate`;
- Primo giorno della settimana configurabile (default: lunedì).

### 5.4 Time picker

Nuovo componente `OrbitTimePickerComponent`:
- CVA con `{ hour: number; minute: number } | null`;
- CDK Overlay per il selettore;
- Step minuti configurabile (default: 5);
- Input `HH:MM` con validazione;
- Supporto `maxHour`, `minHour`.

### 5.5 Attachment dropzone

Nuovo componente `OrbitAttachmentDropzoneComponent`:
- Interfaccia generica `OrbitFileAttachment { id, name, size, mimeType }?`;
- Input `[attachments]`, output `(upload)`, `(remove)`, `(download)`;
- Drag-and-drop + click per selezionare;
- Stati: vuoto, con file, errore, caricamento;
- Nessuna dipendenza da modelli KMS — il consumer fornisce i servizi HTTP.

Regole per tutta la Fase 5:

- ogni field implementa `ControlValueAccessor`;
- label, hint, errore e `aria-describedby` restano associabili via `<orbit-form-field>`;
- date/time picker usano CDK Overlay e focus management;
- nessun componente conosce modelli, permessi o endpoint KMS;
- test unitari per ogni componente.

**Criterio di uscita:** controlli avanzati riusabili, accessibili e privi di accesso diretto non protetto a browser globals.

## Fase 6 — Overlay e compositi

### 6.1 Dialog service

`OrbitDialogService` — servizio per aprire dialog e confirmation dialog:

```ts
const result = await this.dialog.open(OrbitConfirmDialogComponent, {
  data: { title: 'Conferma', message: 'Vuoi eliminare?' },
  size: 'md',
});
```

### 6.2 Modal chrome

Componenti strutturali per modali:
- `OrbitModalHeaderComponent`: title, subtitle, variant (default/form), close button;
- `OrbitModalBodyComponent`: scrollable body con optional loader overlay;
- `OrbitModalFooterComponent`: slot per `<orbit-form-action-bar>` o custom.

### 6.3 Form action bar

`OrbitFormActionBarComponent` — barra azioni a 3 bottoni (già esistente in KMS come `form-footer-actions`):
- `(cancel)`, `(saveDraft)`, `(confirm)`;
- Variante `confirmLabel`, `draftLabel`, `cancelLabel`;
- Stati `loading`, `confirmDisabled`.

### 6.4 Tooltip e popover

- `OrbitTooltipDirective` — CDK Overlay, positioning, show/hide su hover/focus;
- `OrbitPopoverComponent` — CDK Overlay, contenuto custom, gestione focus.

Requisiti per tutta la Fase 6:

- focus trap, Escape, backdrop e ripristino del focus via CDK;
- semantica ARIA: `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`;
- size: `sm` (400px), `md` (560px), `lg` (720px), `xl` (900px), `wide` (1100px);
- `OrbitDialogService` gestisce apertura/chiusura, empiling, scroll lock;
- nessuna dipendenza da ng-bootstrap.

**Criterio di uscita:** nuovi progetti possono usare modali e overlay Orbit senza Bootstrap.

## Fase 7 — Qualità, demo e documentazione

### 7.1 Orbit Lab — catalogo completo

Il catalogo deve mostrare per ogni componente:

- tutte le varianti e toni;
- stati: default, hover, focus-visible, active, disabled, loading, invalid, empty, error;
- esempi do/don't;
- responsive behavior (narrow, desktop, large desktop);
- slot di composizione (form completi, non frammenti).

### 7.2 Documentazione per componente

Per ogni componente pubblico:

- import ed esempio copiabile;
- tabella API (inputs, outputs, tipo, default);
- accessibilità: tastiera, ARIA, screen reader;
- limiti noti e workaround;
- migration guide da Bootstrap/KMS.

### 7.3 Tema e densità

- applicazione tema via `[data-orbit-theme="dark"]` o custom;
- override singoli token via CSS custom properties;
- densità `compact` con riduzione spaziature e altezza controlli;
- test di contrasto WCAG AA per tutti i toni.

**Criterio di uscita:** un altro team può adottare Orbit senza leggere l'implementazione.

## Fase 8 — Test e consumer fixture

### 8.1 Unit test

Per ogni componente:

- rendering con input diversi;
- interazione utente (click, tastiera, blur);
- ControlValueAccessor: writeValue, setDisabledState, onChange, onTouched;
- accessibilità: aria attributes, focus management.

Framework: Vitest (già in devDependencies).

### 8.2 Consumer fixture

Progetto Angular 22 pulito che:

- installa `@galileo/orbit` dal tarball;
- importa e usa tutti i componenti;
- verifica export, CSS e asset;
- testa SSR (Angular Universal o analogo).

Script:

```bash
npm run test:consumer
```

### 8.3 Verifiche obbligatorie

```bash
npm run format:check
npm run lint
npm run test
npm run build
npm run pack:check
npm run test:consumer
```

**Criterio di uscita:** il tarball funziona in un progetto esterno senza riferimenti alla workspace locale.

## Fase 9 — CI/CD e pubblicazione

Pipeline Node 24:

```text
verify
├── install deterministico (npm ci)
├── format e lint
├── unit test
├── build libreria
├── npm pack
└── consumer fixture

publish
└── npm publish su tag vX.Y.Z
```

File necessari:

- `.gitlab-ci.yml` con stage `verify` e `publish`;
- `verify` su MR e push a `main`;
- `publish` solo da tag semantici protetti (`v*.*.*`);
- autenticazione tramite `CI_JOB_TOKEN`;
- nessuna pubblicazione manuale come flusso standard.

Regole:

- tag e `package.json` devono avere la stessa versione;
- `CHANGELOG.md` aggiornato prima della release;
- pipeline verde prima del publish.

**Criterio di uscita:** un tag `v0.1.0` pubblica `@galileo/orbit` nel GitLab Package Registry.

## Fase 10 — Adozione progressiva

1. **Consumer fixture** — validare tutti i componenti in isolamento.
2. **Progetto pilota Angular 22** — introdurre Orbit in un nuovo micro-front-end.
3. **KMS** — dopo upgrade ad Angular 22:
   - migrare per primitive: button → form field → input/select → form layout → picker → modal;
   - rimuovere il vecchio markup CSS solo dopo equivalenza funzionale, visiva e accessibile;
   - mantenere una guida di migrazione per ogni incompatibilità.
4. **Estensione** — altri progetti Galileo adottano Orbit come design system condiviso.

---

## Riepilogo avanzamento

| Fase | Stato | Note |
|---|---|---|
| 0 — Decisioni architetturali | ✅ Completata | Angular 22, TS 6, Node 24, zero Bootstrap |
| 1 — Governance | ⏳ Da fare | Commit, branch protection, CI |
| 2 — Workspace Angular | ✅ Completata | ng-packagr, partial-Ivy, orbit-lab |
| 3 — Tailwind e token | ✅ Completata | CSS-first, --orbit-*, @theme |
| 4 — MVP primitive UI | ✅ Completata | 9 componenti, CVA, signals |
| 5 — Form control avanzati | 🔜 Prossimo | autocomplete, date/time picker, dropzone |
| 6 — Overlay e compositi | 📋 Pianificato | dialog, modal, tooltip, popover |
| 7 — Qualità e documentazione | 📋 Pianificato | Orbit Lab, docs, tema/densità |
| 8 — Test e consumer fixture | 📋 Pianificato | Vitest, consumer fixture Angular 22 |
| 9 — CI/CD e pubblicazione | 📋 Pianificato | GitLab CI, semantic tags |
| 10 — Adozione progressiva | 📋 Pianificato | Progetto pilota, poi KMS |
