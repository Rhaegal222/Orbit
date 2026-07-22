# Data-display minori — Design Spec

## Obiettivo

Aggiungere cinque componenti di visualizzazione/navigazione dati usati meno frequentemente ma comuni in qualunque applicazione: Avatar, Chip/Tag, Breadcrumb, Pagination, Accordion. Ognuno è indipendente dagli altri; questa spec li raggruppa solo perché condividono la stessa fascia di priorità e complessità medio-bassa individuale.

## Componenti

### 1. `OrbitAvatarComponent`

File: `projects/orbit/src/lib/components/avatar/avatar.component.ts` / `.html` / `.css`

```typescript
export type OrbitAvatarSize = 'sm' | 'md' | 'lg';

@Component({ selector: 'orbit-avatar', ... })
export class OrbitAvatarComponent {
  src = input<string | undefined>(undefined);
  name = input.required<string>(); // usato per alt text E per fallback iniziali
  size = input<OrbitAvatarSize>('md');

  protected readonly initials = computed(() => this.deriveInitials(this.name()));
  protected readonly backgroundHue = computed(() => this.hashToHue(this.name()));
}
```

Comportamento:
- `src` presente e caricata con successo → `<img>` con `alt="{{ name() }}"`.
- `src` assente, o `<img>` con errore di caricamento (`(error)` handler che forza fallback anche se `src` era valorizzato ma la richiesta fallisce) → cerchio con iniziali derivate da `name()` (`"Mario Rossi"` → `"MR"`; singola parola → prima lettera; stringa vuota → `"?"`).
- Colore di sfondo delle iniziali: hash deterministico della stringa `name()` mappato su un set fisso di hue HSL predefinite (es. 6-8 hue distanziate, non l'intero cerchio cromatico, per restare leggibili con `--orbit-*-fg` chiaro sopra) — stesso `name()` produce sempre lo stesso colore, utile per riconoscere a colpo d'occhio lo stesso utente in liste diverse.
- Tre size mappate su dimensioni fisse (diametro cerchio + font-size iniziali proporzionale).

### 2. `OrbitChipComponent`

File: `projects/orbit/src/lib/components/chip/chip.component.ts` / `.html` / `.css`

```typescript
@Component({ selector: 'orbit-chip', ... })
export class OrbitChipComponent {
  selected = input(false, { transform: booleanAttribute });
  removable = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });

  selectedChange = output<boolean>();
  removed = output<void>();
}
```

- Contenuto via `<ng-content />` (etichetta libera, coerente con Alert/Banner).
- Click sul corpo del chip (quando non `disabled`) → toggle `selected`, emette `selectedChange` con il nuovo valore — pattern "controlled component": il chip non tiene stato visivo proprio persistente oltre a riflettere l'input `selected()`, il parent decide se aggiornarlo (stesso pattern di `sidebarCollapsed`/`onSidebarCollapsedChange` già nello shell).
- Se `removable`, un pulsante `×` interno (icona `close`, già esistente) separato dal corpo cliccabile — click emette `removed` senza toggleare `selected`, `stopPropagation` per evitare doppio evento.
- Differenza esplicita da `OrbitBadgeComponent`: Badge resta puro display (stato/conteggio non interattivo), Chip è sempre un elemento interattivo (`<button>` internamente, non `<span>`), anche quando usato solo per `removable` senza `selected`.

### 3. `OrbitBreadcrumbComponent`

File: `projects/orbit/src/lib/components/breadcrumb/breadcrumb.component.ts` / `.html` / `.css`

```typescript
export interface OrbitBreadcrumbItem {
  id: string;
  label: string;
  href?: string; // assente = elemento corrente, non cliccabile
}

@Component({ selector: 'orbit-breadcrumb', ... })
export class OrbitBreadcrumbComponent {
  items = input.required<OrbitBreadcrumbItem[]>();
  itemSelected = output<OrbitBreadcrumbItem>();

  protected readonly visibleItems = computed(() => this.collapseMiddle(this.items()));
}
```

- Renderizza sempre primo e ultimo elemento; se `items().length > soglia` (soglia fissa, es. 4), gli elementi centrali vengono sostituiti da un singolo elemento `…` cliccabile.
- Click su `…` apre un `OrbitPanelService`-based popover (riuso del pattern overlay esistente, stesso usato da `popover`/`select`) con la lista degli elementi nascosti; selezione di un elemento nel popover emette `itemSelected` esattamente come un click diretto su un elemento visibile.
- Ultimo elemento (`href` assente per definizione, è la pagina corrente) reso come `<span aria-current="page">`, non `<a>`/`<button>` — non cliccabile perché rappresenta "dove sei ora".
- Nav semantics: `<nav aria-label="breadcrumb"><ol>...</ol></nav>`.

### 4. `OrbitPaginationComponent`

File: `projects/orbit/src/lib/components/pagination/pagination.component.ts` / `.html` / `.css`

```typescript
@Component({ selector: 'orbit-pagination', ... })
export class OrbitPaginationComponent {
  currentPage = input.required<number>(); // 1-based
  totalPages = input.required<number>();
  pageChange = output<number>();

  protected readonly visiblePages = computed(() => this.computeRange(this.currentPage(), this.totalPages()));
}
```

- Bottoni prev/next (icona `chevron-down` ruotata ±90°, stesso trick già usato per il toggle della sidebar — nessuna nuova icona necessaria per le frecce orizzontali) disabilitati rispettivamente su prima/ultima pagina.
- Numeri di pagina: sempre visibili prima, ultima, pagina corrente e le due adiacenti; il resto collassato in `…` (stessa logica di collasso concettuale del Breadcrumb, ma qui il `…` è puramente decorativo/non cliccabile — differenza dal breadcrumb dove invece apre un menu, perché in pagination il range è numerico e "saltare a una pagina arbitraria" non è un requisito di questa spec).
- Click su un numero (o su prev/next) → `pageChange` emesso con il nuovo numero; il componente non gestisce da solo `currentPage` (controlled component, il parent aggiorna l'input dopo aver reagito all'evento — stesso motivo per cui non c'è validazione di range lato output: è il parent a sapere se il numero è valido).
- `nav aria-label="pagination"`, pagina corrente marcata con `aria-current="page"`.

### 5. `OrbitAccordionComponent` + `OrbitAccordionItemComponent`

File:
- `projects/orbit/src/lib/components/accordion/accordion.component.ts` / `.html` / `.css`
- `projects/orbit/src/lib/components/accordion/accordion-item.component.ts` / `.html` / `.css`

```typescript
@Component({ selector: 'orbit-accordion', ... })
export class OrbitAccordionComponent {
  multi = input(false, { transform: booleanAttribute }); // default: un solo pannello aperto
}

@Component({ selector: 'orbit-accordion-item', ... })
export class OrbitAccordionItemComponent {
  header = input.required<string>();
  expanded = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  expandedChange = output<boolean>();
}
```

- `OrbitAccordionItemComponent` proietta il contenuto del pannello via `<ng-content />`; l'header è un `<button>` con `aria-expanded`/`aria-controls` verso l'id generato del pannello contenuto.
- `OrbitAccordionComponent` (contenitore) usa `contentChildren(OrbitAccordionItemComponent)` per enumerare i figli; quando `multi() === false` e un item emette `expandedChange(true)`, il contenitore forza a `false` gli altri item precedentemente aperti (via un signal interno che i figli leggono, non manipolazione diretta — coerente col fatto che ogni item resta un controlled component sul proprio `expanded` input).
- Quando `multi() === true`, nessuna esclusione reciproca: ogni item gestisce il proprio stato indipendentemente.
- Animazione apertura/chiusura pannello: transizione CSS su `max-height` (tecnica standard per contenuto di altezza variabile, dato che Angular non anima bene `height:auto` nativamente).

## Token e icone

- Nessun nuovo token colore per nessuno dei cinque componenti (riuso di superfici/bordi/testo esistenti).
- Nuove icone richieste: nessuna icona nuova indispensabile — Breadcrumb/Pagination riusano `chevron-down` ruotato, Chip riusa `close`, Accordion riusa `chevron-down` (stesso pattern di rotazione della sidebar). Avatar non usa icone (fallback a iniziali, non a icona, per decisione già presa).

## Data flow

Tutti e cinque sono controlled component rispetto al proprio stato principale (chip `selected`, accordion item `expanded`, pagination `currentPage`) — nessuno mantiene una fonte di verità propria che diverga dall'input passato dal parent, coerente con il pattern già stabilito nello shell (`sidebarCollapsed`).

## Error handling

- `OrbitAvatarComponent`: `name()` vuoto → iniziali `"?"`, nessuna eccezione.
- `OrbitPaginationComponent`: `currentPage` fuori range `[1, totalPages]` → il componente non corregge da solo il valore (è il parent a garantirne la validità), ma il rendering clampa visivamente quali bottoni disabilitare in base al confronto diretto, senza crash su valori fuori range.
- `OrbitBreadcrumbComponent`: `items()` vuoto → nessun render (nav vuoto), nessun errore.

## Testing

Per ciascun componente, uno spec file dedicato che copre:
- **Avatar**: derivazione iniziali (nome singolo, nome composto, stringa vuota), fallback su errore immagine, colore deterministico per lo stesso `name()`.
- **Chip**: toggle `selectedChange` al click, `removed` emesso senza toggleare `selected`, nessuna interazione se `disabled`.
- **Breadcrumb**: collasso centrale sopra soglia, nessun collasso sotto soglia, `itemSelected` emesso sia da click diretto che da selezione nel popover del `…`, ultimo elemento non cliccabile.
- **Pagination**: range di pagine visibili corretto per posizioni iniziale/centrale/finale, prev/next disabilitati ai bordi, `pageChange` emesso con il numero corretto.
- **Accordion**: `multi=false` chiude gli altri item all'apertura di uno nuovo; `multi=true` nessuna esclusione; `disabled` blocca l'apertura.

Test manuale in `orbit-lab`: cinque nuove pagine catalogo, pattern `slider-page`, ciascuna con esempi per gli stati principali del rispettivo componente.

## Catalogo (orbit-lab)

Cinque nuove entry in `CATALOG_ENTRIES`: `avatar` (icona `user`, esistente), `chip` (icona `tag`, esistente), `breadcrumb` (icona `chevron-down`, esistente — riuso semantico per navigazione), `pagination` (icona `grid`, esistente — riuso per "elenco/collezione"), `accordion` (icona `layers`, esistente — già usata da `form-section`, riuso accettabile data la somiglianza concettuale di "sezioni impilate").
