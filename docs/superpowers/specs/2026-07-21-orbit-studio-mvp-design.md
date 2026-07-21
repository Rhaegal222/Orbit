# Orbit Studio — MVP design

## Contesto

Orbit Studio è il terzo elemento della triade descritta in [`docs/ARCHITECTURE.md`](../../ARCHITECTURE.md): un configuratore visuale interno che permette a un team di modificare i token semantic di Orbit Core (palette, tipografia, raggi, ombre, densità), vedere un'anteprima con componenti Orbit reali, e generare un file `orbit-theme.css` versionabile dal consumer.

Lo scaffold `projects/orbit-studio` esiste già (`ng generate application`, Angular 22 standalone) ma contiene solo il template placeholder di default: nessuna UI, nessuna logica.

Orbit Studio **non è** Orbit Lab: Lab verifica che i componenti funzionino in ogni stato (strumento per chi sviluppa Orbit); Studio genera temi (strumento per chi adotta Orbit e vuole un'identità visiva propria). Nessuno dei due è pubblicato su npm o aggiunto automaticamente a un progetto consumer.

## Obiettivo

Consegnare un MVP di Orbit Studio che copra fin da subito tutte le famiglie di token descritte in ARCHITECTURE.md — colore, tipografia, raggi, ombre — con anteprima live tramite componenti Orbit reali, e produca in output un file `orbit-theme.css` scaricabile.

## Non obiettivi (fuori scope MVP)

- Salvataggio di temi in backend o `localStorage`.
- Autenticazione e autorizzazione.
- Validazione completa di CSS arbitrario o import di un tema CSS esistente.
- Font picker con caricamento/hosting di font.
- Applicazione automatica del tema generato all'app consumer.
- Route automatica tipo `/galileo-orbit-config` in Core o in un'app consumer.
- Temi multi-tenant a runtime.
- Densità come variabile dentro il file tema generato (resta una scelta a runtime del consumer).

## Fase 0 — Stabilizzare Orbit Core (precondizione)

Verificato sul codice reale: `orbit-button` è già allineato al contratto semantico corrente (`--orbit-font-sans`, `--orbit-action-primary-bg`, `--orbit-focus-ring`, ecc.), ma `orbit-form-section` non espone alcuna API collassabile, e `orbit-text-input`, `orbit-select`, `orbit-checkbox`, `orbit-pill-switch` e `orbit-badge` referenziano ancora token rimossi/rinominati (`--orbit-color-border`, `--orbit-color-surface`, `--orbit-color-text`, `--orbit-color-text-muted`, `--orbit-color-primary`, `--orbit-color-danger`, `--orbit-font-family`, ...) che non esistono in `tokens.css`. Studio non può dichiarare di usare "componenti Orbit reali e tematizzabili" finché questa deriva non è risolta: oggi quei componenti non reagirebbero affatto alle sovrascritture generate da Studio.

Questa fase precede l'implementazione di Studio ed è un prerequisito bloccante:

- **`orbit-form-section` collassabile**: aggiungere un input `collapsible` e uno stato `collapsed` (signal interno + eventuale two-way binding), con l'header reso come `<button>` nativo, `aria-expanded` sull'header e `aria-hidden`/`id` collegati sul body — mai un `<div>` cliccabile.
- **Riallineamento token**: sostituire in `text-input`, `select`, `checkbox`, `pill-switch`, `badge` e `form-section` ogni riferimento a token rimossi con l'equivalente semantico attuale (bordi → `--orbit-border-subtle`/`--orbit-border-strong`, superfici → `--orbit-surface-default`/`--orbit-surface-subtle`, testo → `--orbit-text-primary`/`--orbit-text-secondary`, font → `--orbit-font-sans`, stati → `--orbit-status-*`, azione primaria → `--orbit-action-primary-*`). La mappatura puntuale per ogni file è compito del piano di implementazione, non di questa spec.
- **Test delle API usate da Studio**: test di rendering/interazione per lo stato collassato/espanso di `orbit-form-section` e uno snapshot/assert dei token CSS effettivamente applicati dai componenti coinvolti, cosicché una regressione futura di Core rompa i test di Core, non silenziosamente Studio.

**Criterio di uscita Fase 0:** i componenti che Studio userà in preview leggono esclusivamente token del contratto semantico corrente in `tokens.css`, e `orbit-form-section` espone un'API collassabile accessibile e testata.

## Architettura

Orbit Studio resta un progetto Angular standalone nello stesso workspace di `projects/orbit`, seguendo lo stesso pattern già usato da `projects/orbit-lab`: importa `@galileo/orbit` tramite il path mapping già presente in `tsconfig.json` (`@galileo/orbit` → `projects/orbit/src/public-api.ts`), senza build intermedia né dipendenza da tarball npm. Nessuna nuova dipendenza esterna oltre ad Angular, CDK (se necessario) e Orbit Core.

`AGENTS.md` §"Product boundaries" elenca cosa "Orbit... non deve contenere", inclusi "feature modules" e "application state" — un vincolo pensato per il pacchetto pubblicato `projects/orbit`, non per le applicazioni interne `orbit-lab`/`orbit-studio`, che per natura hanno feature e stato applicativo propri. Il file va aggiornato per rendere esplicito questo scope prima di iniziare l'implementazione (vedi task dedicato nel piano).

Struttura di cartelle in `projects/orbit-studio/src/app/`:

```
core/
  theme-token.model.ts        ← catalogo dichiarativo dei token editabili
  theme-config.store.ts       ← stato in-memory (signals) delle sole sovrascritture
  theme-css-generator.ts      ← funzione pura: overrides + data → testo orbit-theme.css
  browser-io.token.ts         ← InjectionToken ORBIT_STUDIO_BROWSER_IO + interfaccia
  browser-io.service.ts       ← implementazione reale (clipboard, download)
features/
  editor/                     ← pannello di editing, sezioni per gruppo di token
  preview/                    ← pannello con componenti Orbit reali, scoping locale dei token
  output/                     ← blocco CSS generato + azioni Copia/Scarica + snippet densità
app.ts / app.html             ← layout a due colonne
```

## Modello dati dei token editabili

```ts
interface ThemeTokenDef {
  key: string; // es. '--orbit-action-primary-bg'
  label: string; // es. 'Azione primaria — sfondo'
  group: 'color' | 'typography' | 'radius' | 'shadow';
  control: 'color' | 'font-family' | 'font-size' | 'length' | 'shadow';
  defaultValue: string | ShadowLayer[]; // dichiarato staticamente, non letto da tokens.css a runtime
}

interface ShadowLayer {
  offsetX: string;
  offsetY: string;
  blur: string;
  spread?: string;
  color: string;
}

const THEME_TOKENS: ThemeTokenDef[] = [
  /* solo token semantic pubblici, mai reference o component-level */
];
```

**Perché il default è dichiarato staticamente e non letto da `tokens.css`.** Leggere il file a runtime non sarebbe SSR-safe né affidabile; ma c'è una ragione più profonda: i token semantic in `tokens.css` sono per lo più indirezioni `var(--orbit-ref-*)` (es. `--orbit-action-primary-bg: var(--orbit-ref-brand-500);`), non valori letterali. Non esiste quindi "il valore" da leggere senza risolvere la cascata CSS. Il catalogo dichiara perciò il valore **risolto** ed editabile per ogni token (es. `#0d6efd`, non `var(--orbit-ref-brand-500)`), e un test dedicato (`theme-token.catalog.spec.ts`) verifica per ogni token che il valore dichiarato coincida con quello effettivamente risolto in `tokens.css`, leggendo il file da disco in Node/Vitest (operazione da build/test tooling, non da runtime browser — nessun impatto SSR). Questo test è la difesa contro la deriva tra catalogo e Core.

## Comportamento dell'editor colore

`<input type="color">` accetta e restituisce solo valori HEX; i token semantic possono invece contenere qualunque sintassi CSS valida (`oklch()`, `rgb()`, nomi). Per ogni token `control: 'color'` l'editor espone due controlli sincronizzati ma con ruoli distinti:

- **color input nativo**: sempre e solo HEX, per la selezione visuale rapida;
- **`orbit-text-input`**: valore CSS libero (validato solo come "non vuoto e sintatticamente plausibile", mai risolto/convertito);
- quando il valore corrente nel text input è un HEX valido, il color input lo riflette;
- quando non lo è (es. l'utente scrive `oklch(...)`), il color input **non tenta conversioni**: mostra l'ultimo HEX valido noto per quel token con un'indicazione esplicita di "non sincronizzato" (es. badge/icona accanto allo swatch), così l'editor non promette una fedeltà cromatica che non può garantire.

## Ombre multi-layer

I default di Core possono comporre più shadow layer nello stesso token (es. `--orbit-shadow-overlay` è due `box-shadow` separati da virgola). Un solo set offset/blur/opacity non li rappresenterebbe fedelmente: l'editor tratta ogni token shadow come un **array strutturato di `ShadowLayer`**, con controlli per aggiungere/rimuovere layer. Il valore serializzato in `ThemeConfigStore` (sempre `Record<string, string>`) è la stringa `box-shadow` risultante dalla concatenazione dei layer con virgola; la struttura a layer vive solo nello stato locale del componente editor, ricostruita dal default dichiarato nel catalogo.

Gruppi e token rappresentativi:

- **color**: `--orbit-action-primary-bg`, `--orbit-action-primary-fg`, `--orbit-surface-canvas`, `--orbit-surface-default`, `--orbit-text-primary`, `--orbit-text-secondary`, `--orbit-border-subtle`, `--orbit-status-success/danger/warning/info`.
- **typography**: `--orbit-font-sans` (input testo libero, nessun font picker), `--orbit-font-size-body`.
- **radius**: `--orbit-radius-control`, `--orbit-radius-surface`.
- **shadow**: `--orbit-shadow-raised`, `--orbit-shadow-overlay` (editor con campi offset/blur/opacity che compongono la stringa box-shadow, non free-text diretto).

Stato: `ThemeConfigStore` espone un `signal<Record<string, string>>` contenente **solo le sovrascritture** (una chiave è presente solo se il valore differisce dal default). Reset di un token o di un'intera sezione rimuove le chiavi corrispondenti dalla mappa.

La densità **non** entra in questa mappa: è un signal locale della sola preview (`previewDensity: 'comfortable' | 'compact'`), pilota `data-orbit-density` esclusivamente dentro il contenitore di preview.

## Layout

Desktop: due colonne fisse, editor 35% / preview 65% (sticky), nessun drawer nell'MVP.
Mobile (stack verticale): editor → preview → output.

```
┌───────────── 35% ─────────────┬───────────────── 65% ─────────────────┐
│ Editor (scroll verticale)     │ Preview (sticky, live)                 │
│  ▸ Colore                     │  [data-orbit-density=... solo qui]     │
│  ▸ Tipografia                 │  form rappresentativo con componenti   │
│  ▸ Raggi                      │  Orbit reali (button, text-input,      │
│  ▸ Ombre                      │  select, checkbox, pill-switch, badge) │
│  toggle densità preview       │                                        │
│  [Reset tutto] [Genera tema]  ├────────────────────────────────────────┤
│                                │ Output: CSS generato (read-only)       │
│                                │ [Copia] [Scarica]                      │
│                                │ snippet densità (copiabile, separato)  │
└────────────────────────────────┴────────────────────────────────────────┘
```

Dettagli:

- Ogni sezione dell'editor è un `<orbit-form-section>` collassabile (Fase 0), con i controlli reali di Orbit (`<orbit-text-input>` per i valori testuali/numerici) affiancati a un `<input type="color">` nativo per i token di tipo `color`, secondo la sincronizzazione descritta in "Comportamento dell'editor colore" — nessun color-picker custom via CDK.
- Il pannello preview applica le sovrascritture tramite un binding `[style]` sul proprio contenitore radice, **mai su `:root` globale**: il resto della UI di Studio non viene mai tinto dal tema in costruzione.
- Il pannello preview è un mini-form rappresentativo (non un catalogo esaustivo come Lab): quanto basta per vedere l'effetto su bottoni, campi, badge, switch.
- Sezione "Output" sempre visibile, sotto la preview: blocco codice leggibile con commento di intestazione (`/* Generato da Orbit Studio — <data> */`), bottone **Copia** (clipboard) e bottone **Scarica** (`orbit-theme.css`).
- Sotto l'output, uno snippet separato e copiabile per la densità (es. `<body data-orbit-density="compact">`), con nota esplicita che non fa parte del file tema generato.

## Generazione CSS

```ts
function generateThemeCss(
  overrides: Record<string, string>,
  generatedAt: Date,
): string;
```

Regole:

- Prima di generare, filtra `overrides` contro `THEME_TOKENS`: qualunque chiave non presente nel catalogo viene scartata e non compare mai nell'output.
- Con zero override validi dopo il filtro, l'output è **solo il commento di intestazione**, senza alcun blocco `:root {}` vuoto.
- Con almeno un override valido, produce un unico blocco `:root { ... }`, un token per riga, ordinato per gruppo (color → typography → radius → shadow) per leggibilità.
- `generatedAt` è un parametro esplicito (mai `new Date()` interno alla funzione), per mantenere i test deterministici.
- La densità non viene mai scritta nel CSS generato.

## Accesso browser isolato (SSR-safe)

Un solo punto di contatto con API browser dirette, dietro un `InjectionToken` esplicito:

```ts
export const ORBIT_STUDIO_BROWSER_IO = new InjectionToken<OrbitStudioBrowserIo>(
  'ORBIT_STUDIO_BROWSER_IO',
);

export interface OrbitStudioBrowserIo {
  copyToClipboard(text: string): Promise<void>;
  downloadTextFile(filename: string, content: string): void;
}
```

- L'implementazione reale (`BrowserIoService`) usa `navigator.clipboard`, `Blob`, `URL.createObjectURL` e un anchor temporaneo; effettua il check che l'ambiente sia un browser **dentro i propri metodi**, mai fuori.
- Se l'ambiente non è un browser, o `navigator.clipboard` non è disponibile, o `writeText` rigetta: il servizio non lancia eccezioni non gestite. Il chiamante (`OutputComponent`) riceve un esito che traduce in un feedback utente non bloccante (es. messaggio inline "copia non riuscita, usa il download"), mai un errore che interrompe l'interazione.
- Nessun altro file del progetto deve referenziare `navigator`, `Blob`, `URL` o `document` direttamente.
- I test del componente Output forniscono una fake che implementa l'interfaccia e registra le chiamate, senza toccare API reali del browser; i test del servizio reale coprono invece i casi limite elencati sopra.

## Testing

Framework: Vitest (già in `devDependencies` del workspace).

- `theme-css-generator.spec.ts`:
  - zero override validi → solo commento intestazione, nessun blocco `:root`;
  - override valide → blocco `:root` con solo le chiavi presenti, ordinate per gruppo;
  - chiave estranea (non in `THEME_TOKENS`) nella mappa di input → sempre filtrata, mai nell'output;
  - stessa `generatedAt` in input → stesso output byte-per-byte (determinismo).
- `theme-config.store.spec.ts`: set/reset di un singolo token, reset totale, invarianza dei token non toccati.
- `theme-token.catalog.spec.ts`: ogni `defaultValue` dichiarato in `THEME_TOKENS` coincide con il valore risolto in `tokens.css` (letto da disco in Node, non a runtime browser).
- `output.component.spec.ts` (non `browser-io.service.spec.ts` — la fake testa il consumatore, non il servizio reale): con una fake iniettata su `ORBIT_STUDIO_BROWSER_IO`, verifica che `OutputComponent` invochi `copyToClipboard` / `downloadTextFile` con contenuto e filename attesi.
- `browser-io.service.spec.ts`: test del servizio reale, inclusi i casi non coperti dalla fake — ambiente non browser (no-op sicuro, nessun throw), clipboard non disponibile o `navigator.clipboard.writeText` che rigetta (l'errore produce un feedback utente non bloccante, es. un messaggio inline nel componente Output, mai un'eccezione non gestita).
- Component test editor → preview: un cambio su un color-input aggiorna lo store e si riflette nello scoping `[style]` del pannello preview, mai su `:root` globale (test anti-regressione).
- Component test densità: il toggle cambia `data-orbit-density` solo dentro il contenitore preview, mai fuori.

## Criterio di uscita MVP

Un utente apre Orbit Studio, modifica almeno un token per ciascun gruppo (colore, tipografia, raggio, ombra), vede l'effetto immediato sui componenti Orbit reali in preview, scarica `orbit-theme.css` valido (verificabile con un diff manuale contro `tokens.css`), copia il CSS negli appunti e copia separatamente lo snippet di densità — il tutto senza che Studio scriva mai su `localStorage`, backend o `:root` globale.
