# Orbit Lab: sidebar fissa + ricerca sezioni catalogo tecnico

Data: 2026-07-22

## Contesto

`LabShellComponent` (`projects/orbit-lab/src/app/shell/lab-shell.component.ts/.html`) è lo shell dell'app "Orbit Lab" (catalogo tecnico dei componenti Orbit). Oggi la navigazione tra le sezioni del catalogo (`CATALOG_ENTRIES`, in `projects/orbit-lab/src/app/catalog/catalog.ts`) avviene tramite un pannello overlay (`LabCatalogNavigationPanelComponent`), aperto dal bottone "Navigazione" nell'header, che mostra una lista di link (`routerLink`) dentro un `orbit-modal-header` + `orbit-modal-body`.

Esiste già in libreria un componente `orbit-sidebar` (`projects/orbit/src/lib/components/sidebar/`) pensato per navigazione persistente: sezioni con item (`OrbitSidebarSection[]`), stato attivo (`activeId`), collassabile con toggle integrato, badge, icone, footer proiettato. È usato oggi solo nella pagina demo del catalogo (`sidebar-page`), non nello shell reale.

## Obiettivo

1. Sostituire il pannello overlay di navigazione con `orbit-sidebar` come elemento **fisso** del layout dello shell (sempre presente, collassabile tramite il suo toggle integrato). Il bottone "Navigazione" e l'apertura overlay vengono rimossi.
2. Aggiungere nell'header dello shell una barra di ricerca che filtra live le sezioni mostrate nella sidebar.

Il pannello "Opzioni" (tema/densità/font/ecc., `LabCatalogOptionsPanelComponent`) **non è toccato**: resta un overlay a destra come oggi.

## Design

### 1. Sidebar fissa

- In `lab-shell.component.html`, il layout `.lab-shell__body` (oggi contiene solo `<main class="lab-shell__content"><router-outlet /></main>`) diventa un flex row con due figli:
  - `<orbit-sidebar>` (nuovo)
  - `<main class="lab-shell__content">` (invariato, `flex: 1`)
- `LabShellComponent` costruisce `sections: OrbitSidebarSection[]` con **una singola sezione senza label** i cui `items` sono derivati da `CATALOG_ENTRIES`, mappando `entry.slug → id`, `entry.label → label`. Nessun campo `disabled`/`icon`/`badge` viene popolato per ora (parità con il comportamento attuale, che non disabilita nulla in base allo `status`; tutte le entry oggi sono `verified`).
- `activeId`: un signal calcolato dal path corrente. Si inietta `Router` e si deriva l'id attivo dal primo segmento dell'URL (`router.url`), aggiornato ad ogni `NavigationEnd` (via `toSignal` su `router.events` filtrati, o un signal aggiornato in un `effect`/subscription con `takeUntilDestroyed`).
- `(itemSelected)`: naviga con `this.router.navigate(['/', item.id])`.
- `(collapsedChange)`: nuovo signal `sidebarCollapsed` in `LabShellComponent`, aggiornato dall'evento e passato a `[collapsed]`. Nessun bottone custom per aprire/chiudere: si usa solo il toggle integrato di `orbit-sidebar`.
- `brand`/`brandIcon`: si lasciano vuoti (default). L'header dello shell resta con il proprio branding ("Orbit Lab"), quindi la sidebar non duplica il brand.
- `LabCatalogNavigationPanelComponent` e la sua apertura (`openNavigation()`, bottone "Navigazione") vengono rimossi. `catalog-panel.component.css` resta (condiviso anche da `LabCatalogOptionsPanelComponent`), va solo ripulito dalle regole `.lab-catalog-panel__nav*` non più usate.

### 2. Ricerca sezioni nell'header

- In `lab-shell.component.html`, al posto del bottone "Navigazione" rimosso (colonna sinistra dell'header), si inserisce `<orbit-text-input type="search" leadingIconName="search" placeholder="Cerca sezione…">` legato a un nuovo signal `searchQuery` in `LabShellComponent` (via `[value]`/`(valueChange)` o `FormControl`, secondo il pattern già usato da `orbit-text-input` altrove nel codebase).
- Un `computed` filtra `CATALOG_ENTRIES` per `label` (case-insensitive, `includes(searchQuery().toLowerCase())`) e produce le `sections` passate a `orbit-sidebar`. Query vuota → tutte le entries.
- Se nessuna entry matcha, la sidebar riceve una sezione con `items: []` (lista vuota, nessun messaggio "nessun risultato" — comportamento confermato con l'utente).

### 3. Cosa non cambia

- `sidebar-page` (pagina demo) e `OrbitSidebarComponent` (libreria) restano invariati: si riusa il componente così com'è, nessuna nuova API richiesta.
- `LabCatalogOptionsPanelComponent` e il bottone "Opzioni" restano identici.
- `CATALOG_ENTRIES` / `CatalogEntry` model non cambiano.

## Fuori scope

- Nessuna modifica allo stato `status` (`verified`/`token-blocked`/`stabilizing`) delle entry o alla loro resa visiva nella sidebar (badge/disabled) — oggi non distinta nemmeno nel pannello overlay attuale.
- Nessun messaggio "nessun risultato" per la ricerca.
- Nessuna persistenza dello stato collassato della sidebar tra sessioni (no localStorage) — resta un signal in-memory come gli altri stati dello shell.
- Nessuna modifica al pannello "Opzioni".

## File coinvolti (attesi)

- `projects/orbit-lab/src/app/shell/lab-shell.component.ts` — rimuove `openNavigation`/`LabCatalogNavigationPanelComponent`, aggiunge signal `searchQuery`, `sidebarCollapsed`, computed `sidebarSections`, `activeSidebarId`, inject `Router`.
- `projects/orbit-lab/src/app/shell/lab-shell.component.html` — sostituisce bottone "Navigazione" con `orbit-text-input` di ricerca; aggiunge `orbit-sidebar` nel body accanto a `<main>`.
- `projects/orbit-lab/src/app/shell/lab-shell.component.css` — `.lab-shell__body` diventa `display: flex; flex-direction: row` (mantenendo `.lab-shell__content` come `flex: 1 0 auto; min-width: 0`).
- `projects/orbit-lab/src/app/shell/catalog-panel.component.css` — rimozione regole `.lab-catalog-panel__nav*` non più usate (resta condiviso dal pannello opzioni).
- `projects/orbit-lab/src/app/shell/lab-shell.component.spec.ts` — aggiornamento test che referenziano il bottone "Navigazione"/overlay, nuovi test per filtro ricerca e navigazione via sidebar.
