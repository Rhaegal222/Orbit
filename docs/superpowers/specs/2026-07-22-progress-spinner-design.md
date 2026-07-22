# Progress Bar e Spinner — Design Spec

## Obiettivo

Aggiungere indicatori di caricamento/avanzamento riutilizzabili. Oggi l'unico indicatore di caricamento esistente è uno spinner inline hard-coded dentro `OrbitButtonComponent` (`.orbit-btn__spinner`, CSS puro, nessun componente proprio) — non riusabile fuori dal bottone (es. dentro un panel, una card, una pagina intera in caricamento). Manca inoltre qualunque indicatore di avanzamento determinato (percentuale).

## Architettura

Due componenti display-only, nessun servizio, nessun CVA (non sono form control). Entrambi puramente presentazionali, stato passato via `input()`.

## Componenti

### 1. `OrbitProgressBarComponent`

File: `projects/orbit/src/lib/components/progress-bar/progress-bar.component.ts` / `.html` / `.css`

```typescript
@Component({ selector: 'orbit-progress-bar', ... })
export class OrbitProgressBarComponent {
  value = input<number | undefined>(undefined); // 0-100; undefined = indeterminata
  ariaLabel = input<string | undefined>(undefined);
}
```

Template:

```html
<div
  class="orbit-progress-bar"
  role="progressbar"
  [class.orbit-progress-bar--indeterminate]="value() === undefined"
  [attr.aria-label]="ariaLabel() || null"
  [attr.aria-valuenow]="value() ?? null"
  aria-valuemin="0"
  aria-valuemax="100"
>
  <div
    class="orbit-progress-bar__fill"
    [style.width.%]="value() ?? null"
  ></div>
</div>
```

Comportamento:
- `value()` assente (`undefined`) → classe `--indeterminate`, il fill CSS anima con un keyframe che scorre da sinistra a destra in loop (stessa tecnica di `@keyframes orbit-sidebar-toggle-enter` già presente nel codebase, adattata), `aria-valuenow` omesso per non mentire agli screen reader su una percentuale che non esiste.
- `value()` presente → clamp a `[0, 100]` internamente (via `computed`) prima di applicarlo a `width` e `aria-valuenow`, per tollerare input fuori range senza rompere il layout.

### 2. `OrbitSpinnerComponent`

File: `projects/orbit/src/lib/components/spinner/spinner.component.ts` / `.html` / `.css`

```typescript
export type OrbitSpinnerSize = 'sm' | 'md' | 'lg';

@Component({ selector: 'orbit-spinner', ... })
export class OrbitSpinnerComponent {
  size = input<OrbitSpinnerSize>('md');
  ariaLabel = input<string | undefined>(undefined);
}
```

- Puro indicatore rotante (stessa animazione CSS già usata in `.orbit-btn__spinner`, estratta in una classe condivisa o duplicata come keyframe — nessuna refactor di `OrbitButtonComponent` richiesta in questo scope, il bottone può continuare a usare il proprio CSS interno; l'estrazione a componente condiviso è un miglioramento futuro fuori scope).
- `role="status"`, `aria-label` di default `"Caricamento"` se non specificato (localizzabile via l'`i18n` pattern già usato altrove, es. `OrbitSidebarComponent.i18n.labels`).
- Tre size mappate su dimensioni fisse in px/rem coerenti con `--orbit-sidebar-icon-size`/`-collapsed` come riferimento di scala già esistente nel sistema.

## Token e stile

Nessun nuovo token colore necessario: entrambi i componenti usano `--orbit-action-primary-bg` (o un token neutro `--orbit-fg-muted` per lo spinner, da verificare in `tokens.css`) per il colore dell'indicatore, coerente con lo stato "in corso" piuttosto che un tone semantico (progress/spinner non comunicano successo/errore, solo attesa).

## Data flow

Nessuno stato interno persistente: entrambi i componenti sono puri render del loro `input()`. Il chiamante (es. una pagina che fa polling di un upload) aggiorna `value` con un signal/observable esterno; il componente si ridisegna via `OnPush` alla modifica dell'input.

## Error handling

- `value` fuori range (`< 0` o `> 100`) → clamp silenzioso (nessun throw), coerente con la filosofia "fail-soft" già vista in altri input numerici del design system (es. slider con `min`/`max`).
- `value` non numerico (`NaN`) → trattato come indeterminato (stesso path di `undefined`), per evitare un `width: NaN%` che romperebbe il layout.

## Testing

- `progress-bar.component.spec.ts`: classe `--indeterminate` applicata quando `value` è assente/NaN; `aria-valuenow` riflette il valore clampato; width inline style corrisponde al valore.
- `spinner.component.spec.ts`: `size` applica la classe/dimensione corretta; `aria-label` di default e override.
- Test manuale in `orbit-lab`: pagina catalogo con esempio determinato (slider di controllo che aggiorna `value` live), esempio indeterminato, spinner nelle 3 size.

## Catalogo (orbit-lab)

Due nuove entry in `CATALOG_ENTRIES`: `progress-bar` (icona `window`, riuso — nessuna icona a barre orizzontali esiste nel registry, valutare in fase di implementazione se aggiungerne una dedicata tipo `bar-chart` o `activity`) e `spinner` (icona `retry`, già esistente — semanticamente vicina a "in corso/ricarica"). Route + pagina dedicata per ciascuno, pattern `slider-page`.
