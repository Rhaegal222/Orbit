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

## Architettura

Orbit Studio resta un progetto Angular standalone nello stesso workspace di `projects/orbit`, seguendo lo stesso pattern già usato da `projects/orbit-lab`: importa `@galileo/orbit` tramite il path mapping già presente in `tsconfig.json` (`@galileo/orbit` → `projects/orbit/src/public-api.ts`), senza build intermedia né dipendenza da tarball npm. Nessuna nuova dipendenza esterna oltre ad Angular, CDK (se necessario) e Orbit Core.

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
  defaultValue: string; // preso da tokens.css, unica fonte di verità
}

const THEME_TOKENS: ThemeTokenDef[] = [
  /* solo token semantic pubblici, mai reference o component-level */
];
```

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

- Ogni sezione dell'editor è un `<orbit-form-section>` collassabile, con i controlli reali di Orbit (`<orbit-text-input>` per i valori testuali/numerici) affiancati a un `<input type="color">` nativo per i token di tipo `color` — nessun color-picker custom via CDK.
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

- L'implementazione reale (`BrowserIoService`) usa `navigator.clipboard`, `Blob`, `URL.createObjectURL` e un anchor temporaneo; effettua il check che l'ambiente sia un browser **dentro i propri metodi**.
- Nessun altro file del progetto deve referenziare `navigator`, `Blob`, `URL` o `document` direttamente.
- I test forniscono una fake che implementa l'interfaccia e registra le chiamate, senza toccare API reali del browser.

## Testing

Framework: Vitest (già in `devDependencies` del workspace).

- `theme-css-generator.spec.ts`:
  - zero override validi → solo commento intestazione, nessun blocco `:root`;
  - override valide → blocco `:root` con solo le chiavi presenti, ordinate per gruppo;
  - chiave estranea (non in `THEME_TOKENS`) nella mappa di input → sempre filtrata, mai nell'output;
  - stessa `generatedAt` in input → stesso output byte-per-byte (determinismo).
- `theme-config.store.spec.ts`: set/reset di un singolo token, reset totale, invarianza dei token non toccati.
- `browser-io.service.spec.ts` (via fake iniettata su `ORBIT_STUDIO_BROWSER_IO`): il componente Output invoca `copyToClipboard` / `downloadTextFile` con contenuto e filename attesi.
- Component test editor → preview: un cambio su un color-input aggiorna lo store e si riflette nello scoping `[style]` del pannello preview, mai su `:root` globale (test anti-regressione).
- Component test densità: il toggle cambia `data-orbit-density` solo dentro il contenitore preview, mai fuori.

## Criterio di uscita MVP

Un utente apre Orbit Studio, modifica almeno un token per ciascun gruppo (colore, tipografia, raggio, ombra), vede l'effetto immediato sui componenti Orbit reali in preview, scarica `orbit-theme.css` valido (verificabile con un diff manuale contro `tokens.css`), copia il CSS negli appunti e copia separatamente lo snippet di densità — il tutto senza che Studio scriva mai su `localStorage`, backend o `:root` globale.
