# Orbit Lab — catalogo tecnico interno

## Contesto

Orbit Lab è il secondo elemento della triade descritta in [`docs/ARCHITECTURE.md`](../../ARCHITECTURE.md): il catalogo tecnico interno che mostra i componenti reali di Orbit Core in tutte le loro varianti e stati. Risponde a: *il componente funziona, è accessibile e resta coerente in ogni stato?* Non è una landing page, non è Orbit Studio e non è un editor di temi: non modifica palette o genera CSS, mostra soltanto i componenti così come sono.

Lo scaffold `projects/orbit-lab` esiste già (Angular 22 standalone, zoneless change detection, routing vuoto) con un solo `LabRootComponent` che mostra un `orbit-button` a scopo di verifica manuale dei token.

## Cambio di priorità e perimetro

Orbit Studio è in pausa: dipende dalla stabilizzazione di Orbit Core (Fase 0, vedi [la spec Studio](2026-07-21-orbit-studio-mvp-design.md)) e non viene lavorato in questo ciclo. Questo lavoro riguarda **solo Orbit Lab** e procede in parallelo alla stabilizzazione di Core, senza intersecarla.

Perimetro di modifica consentito:

- `projects/orbit-lab/**`
- documentazione e configurazione Lab strettamente necessaria (`docs/superpowers/specs|plans/2026-07-21-orbit-lab-catalog.md`, eventuale voce in `angular.json` se richiesta da nuovi target)

Esplicitamente fuori perimetro, anche se un problema viene rilevato lì:

- `projects/orbit/src/**` (componenti, token, API pubbliche, test di Core)
- `projects/orbit-studio/**`
- build o pubblicazione del pacchetto `@galileo/orbit`
- Bootstrap, dipendenze esterne non già presenti, modelli o logica applicativa KMS

## Stato reale di Orbit Core (verificato sul codice, non assunto)

Una scansione di tutti i fogli di stile dei componenti contro `projects/orbit/src/styles/tokens.css` mostra che **solo `orbit-button` è privo di riferimenti a custom property non definite**. Tutti gli altri 17 componenti con un proprio `.component.css` referenziano almeno un token che non esiste nel contratto attuale (es. `--orbit-font-family` invece di `--orbit-font-sans`, `--orbit-space-1/2/3/4/5/6` mai promossi a livello semantico, `--orbit-radius-full`/`--orbit-radius-sm` mai definiti, `--orbit-shadow-focus/sm/lg` mai definiti). `orbit-tooltip` non ha un proprio foglio di stile dedicato e non è stato incluso nella scansione.

Questo significa che **la lista di priorità "componenti già più stabili" (Button, Badge, Form grid, Form field, Form section) è parzialmente ottimistica**: di questi cinque, solo Button risulta oggi privo di drift verificabile. Badge, Form grid, Form field e Form section vanno comunque catalogati (hanno API stabili e un test esistente, tranne form-section che non ha ancora test), ma **non possono essere dichiarati "verificati" a livello di token** finché Core non completa la Fase 0. Il catalogo deve rendere questa distinzione visibile invece di nasconderla.

Tabella di stato per i componenti in scope di questo ciclo (aggiornata dopo il secondo audit token, 2026-07-21 — Core ha esteso il contratto semantico per spacing/tipografia/radius e ha aggiunto l'API collassabile a `orbit-form-section`):

| Componente | Test esistente | Drift token | Stato pagina Lab |
| --- | --- | --- | --- |
| `orbit-button` | Sì (`button.component.spec.ts`) | Nessuno rilevato | Verificato |
| `orbit-badge` | Sì | Nessuno rilevato (era bloccato, risolto da Core) | Verificato |
| `orbit-form-grid` | No | Nessuno rilevato (era bloccato, risolto da Core) | Verificato |
| `orbit-form-field` | Sì | Nessuno rilevato (era bloccato, risolto da Core) | Verificato |
| `orbit-form-section` | No | Nessuno rilevato (era bloccato, risolto da Core); ora espone anche `collapsible` con toggle accessibile (`aria-expanded`/`aria-controls`/`role="region"`) | Verificato |
| `orbit-text-input` | Sì | Nessuno rilevato nel secondo audit | Pagina non ancora scritta (placeholder generico) |
| `orbit-select` | Sì | Nessuno rilevato nel secondo audit | Pagina non ancora scritta (placeholder generico) |
| `orbit-checkbox` | Sì | Nessuno rilevato nel secondo audit | Pagina non ancora scritta (placeholder generico) |
| `orbit-pill-switch` | Sì | Nessuno rilevato nel secondo audit | Pagina non ancora scritta (placeholder generico) |

Drift residuo confermato altrove in Core, fuori dallo scope attuale del catalogo Lab: `date-picker.component.css` e `form-action-bar.component.css` (`--orbit-color-text-inverse`, `--orbit-color-text-secondary`), `modal-header.component.css`/`modal-footer.component.css`/`time-picker.component.css` (`--orbit-color-border-subtle`, oltre a `--orbit-color-text-inverse` per time-picker). Nessuno di questi componenti è ancora catalogato in Lab; andranno aggiunti solo dopo l'allineamento.

Nota: le quattro voci "text-input/select/checkbox/pill-switch" restano con la pagina placeholder generica non perché bloccate su token (non lo sono più), ma perché le loro pagine di catalogo dedicate non sono ancora state scritte — è un lavoro residuo di Lab, non un blocco di Core.

## Obiettivo

Costruire una shell di catalogo enterprise, compatta e orientata al lavoro tecnico, che usi esclusivamente componenti Orbit reali (mai markup locale che imita un componente), con:

- header con nome Lab e selettori di tema (default / regressione) e densità (comfortable / compact);
- indice di navigazione dei componenti, raggruppato per stato (verificato / bloccato su token / in stabilizzazione);
- area contenuto con una pagina per componente, raggiungibile via routing;
- possibilità di ispezionare ogni componente a viewport stretto, desktop standard e desktop ampio.

## Non obiettivi

- Correggere CSS, token o API di un componente Core: se un componente appare rotto per token legacy, si registra come blocker con file esatto e token esatto, non si corregge da Lab.
- Dichiarare "verificato" un componente con drift di token, anche se il resto della pagina è completo.
- Costruire un secondo editor di temi: il selettore di tema in Lab sceglie fra `default` e `dark` (il tema di regressione già presente in `tokens.css` via `[data-orbit-theme='dark']`), non crea override arbitrari.
- Aggiungere dipendenze esterne o markup che ricrea visivamente un componente Orbit.

## Architettura

`projects/orbit-lab` resta un'app Angular 22 standalone, zoneless (`provideZonelessChangeDetection()` già presente), con Angular Router per navigare fra le pagine componente. Struttura proposta in `projects/orbit-lab/src/app/`:

```
shell/
  lab-shell.component.ts     ← header (tema/densità) + nav + <router-outlet>
  lab-shell.component.html
  lab-shell.component.css
catalog/
  catalog-entry.model.ts     ← { slug, label, status: 'verified' | 'token-blocked' | 'stabilizing', component }
  catalog.ts                 ← CATALOG_ENTRIES: elenco dichiarativo per la nav
pages/
  button-page/
  badge-page/
  form-grid-page/
  form-field-page/
  form-section-page/
  stabilizing-page/          ← pagina generica riusata per text-input/select/checkbox/pill-switch
app.routes.ts                ← route per ogni pagina sotto LabShellComponent
app.component.ts             ← diventa solo bootstrap del router (la demo attuale viene sostituita)
```

Ogni pagina componente (tranne `stabilizing-page`) segue la stessa struttura di sezioni:

1. Scopo breve (una frase).
2. Esempio base con snippet di import/uso copiabile (blocco `<pre>`, nessuna libreria di syntax highlight aggiuntiva).
3. Varianti e toni disponibili, resi con il componente reale.
4. Stati: default, hover/focus (dove verificabile via `:focus-visible` nativo, non simulato), disabled, loading, invalid, empty/error quando applicabile al componente.
5. Nota sul comportamento responsive (come il componente si comporta a viewport stretto).
6. Note di accessibilità (tastiera, ARIA, screen reader) per quel componente specifico.
7. Se il componente ha drift di token: un banner "Bloccato su token Core" con l'elenco esatto dei token mancanti e il file interessato, invece della dicitura "verificato".

`stabilizing-page` è un'unica pagina parametrica (riceve `componentName` e l'elenco dei token mancanti) usata per le quattro voci "in stabilizzazione Core", per evitare di scrivere quattro pagine quasi identiche prima che Core sia stabile.

## Tema e densità

Il selettore tema nello shell applica `[attr.data-orbit-theme]` su un elemento contenitore che avvolge l'intero `<router-outlet>` (non solo la preview di un singolo componente, a differenza di Studio: Lab deve mostrare la pagina intera, incluso il proprio chrome, sotto il tema scelto, perché il suo scopo è verificare la coerenza reale, non isolare un'anteprima). Stesso principio per la densità (`[attr.data-orbit-density]`). Entrambi i valori sono segnali locali nello shell, nessuna persistenza.

## Testing

- Component test per `LabShellComponent`: il cambio tema aggiorna `data-orbit-theme` sul contenitore; il cambio densità aggiorna `data-orbit-density`; la nav espone un link per ogni voce di `CATALOG_ENTRIES`.
- Component test per ciascuna pagina "verificata" o "bloccata su token": rendering delle varianti dichiarate, presenza del banner di blocco quando `status !== 'verified'`.
- Nessun test end-to-end multi-viewport in questo ciclo: la verifica multi-viewport è manuale (resize della finestra), coerente con l'assenza di strumenti di visual regression nel workspace.

## Criterio di uscita

Un utente apre Orbit Lab, naviga fra Button, Badge, Form grid, Form field e Form section, vede per ciascuno esempio/varianti/stati con i componenti reali, vede chiaramente quali sono "verificati" e quali "bloccati su token" (con l'elenco esatto dei token mancanti), e trova le quattro voci in stabilizzazione Core chiaramente etichettate come tali. Il cambio tema/densità nello shell si riflette su tutta la pagina attiva. Nessuna modifica a `projects/orbit/src` o `projects/orbit-studio` è stata introdotta.
