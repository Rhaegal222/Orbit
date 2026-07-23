# Skeleton Loader — Design Spec

## Obiettivo

Aggiungere un placeholder di caricamento per contenuti asincroni (liste, card, testo che arriva da rete), oggi assente nel design system. Riduce il "flash of empty content" mostrando la forma approssimativa del contenuto finale mentre viene caricato.

## Architettura

Un solo componente, puramente presentazionale, nessuno stato interno oltre agli input di forma/dimensione. Nessun servizio: il chiamante decide quando renderizzare lo skeleton al posto del contenuto reale (tipicamente via `@if (loading()) { <orbit-skeleton .../> } @else { ... }`).

## Componente

`OrbitSkeletonComponent`

File: `projects/orbit/src/lib/components/skeleton/skeleton.component.ts` / `.html` / `.css`

```typescript
export type OrbitSkeletonShape = 'text' | 'circle' | 'rect';

@Component({
  selector: 'orbit-skeleton',
  host: {
    '[style.width]': 'width()',
    '[style.height]': 'resolvedHeight()',
    '[attr.aria-hidden]': 'true',
  },
})
export class OrbitSkeletonComponent {
  shape = input<OrbitSkeletonShape>('text');
  width = input<string>('100%');
  height = input<string | undefined>(undefined); // se assente, derivato dalla shape
}
```

Comportamento:
- `shape="text"`: altezza di default pari a un'altezza di riga di testo (`1em` relativo al font-size ereditato, o un token tipografico esistente come `--orbit-font-size-body` con line-height), `border-radius` piccolo.
- `shape="circle"`: `border-radius: 50%`, richiede tipicamente `width` e `height` uguali (nessuna validazione runtime: è responsabilità del chiamante, come per qualunque CSS dimensionale nel sistema).
- `shape="rect"`: nessun `border-radius` (o un valore standard `--orbit-radius-control` per coerenza con card/panel), per placeholder di immagini/blocchi generici.
- `height` esplicito sovrascrive il default derivato dalla shape in tutti i casi.

## Animazione

Shimmer via CSS puro: gradiente lineare che si muove in loop (`background-position` animato), nessuna dipendenza da JS/RxJS. Rispetta `prefers-reduced-motion: reduce` disattivando l'animazione (mostra solo il colore piatto di base) — primo componente Orbit a introdurre questo media query, da tenere presente come precedente per componenti futuri con animazioni continue (spinner/progress-bar indeterminati dovrebbero idealmente adottare lo stesso rispetto in un secondo momento, ma è fuori scope di questa spec).

## Token

Nuovo token o riuso: colore di base dal token neutro di superficie esistente più vicino (es. `--orbit-surface-subtle` o equivalente), colore dello shimmer leggermente più chiaro/scuro in overlay — nessun nuovo token semantico richiesto, solo eventuale variabile locale al componente per l'intensità dello shimmer se i token esistenti non bastano.

## Data flow

Nessuno: componente stateless, il parent controlla interamente quando montarlo/smontarlo in base al proprio stato di loading.

## Error handling

N/A — componente puramente visivo senza input che possano produrre stati invalidi rilevanti (dimensioni CSS malformate sono responsabilità del chiamante, come altrove nel sistema).

## Testing

- `skeleton.component.spec.ts`: classe/border-radius corretti per ciascuna `shape`; `height` di default corretto per `text` quando non specificato; `height` esplicito sovrascrive il default; `aria-hidden="true"` sempre presente (uno skeleton non deve mai essere annunciato da uno screen reader).
- Test manuale in `orbit-lab`: pagina catalogo con esempio di lista di card in skeleton che dopo un timeout simulato si trasformano in contenuto reale, per verificare visivamente la transizione.

## Catalogo (orbit-lab)

Una nuova entry in `CATALOG_ENTRIES`: `skeleton` (icona `square`, già esistente — forma neutra coerente con un placeholder rettangolare). Route + pagina dedicata, pattern `slider-page`.
