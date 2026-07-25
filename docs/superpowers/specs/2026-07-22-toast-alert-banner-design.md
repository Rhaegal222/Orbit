# Toast, Alert e Banner — Design Spec

## Obiettivo

Aggiungere al design system Orbit tre componenti di feedback, oggi assenti: notifiche transitorie fuori dal flusso (Toast), messaggi inline dentro form/card (Alert) e messaggi full-width in cima a pagina/sezione (Banner). Colmano il gap identificato nell'audit del design system: nessun pattern esistente comunica stato asincrono (successo/errore di un'azione) o avvisi persistenti.

## Architettura

- **Toast**: servizio `OrbitToastService` (`providedIn: 'root'`), calcato sul pattern già esistente di `OrbitPanelService` (`projects/orbit/src/lib/services/panel/panel.service.ts`): CDK `Overlay` + `ComponentPortal`, un `OrbitToastRef` per ogni notifica aperta, chiusura via observable/subscription. A differenza del panel (singolo, centrale), il toast supporta uno **stack per angolo**: più toast nello stesso angolo si accodano verticalmente.
- **Alert** e **Banner**: componenti standalone puri (nessun servizio), resi via template come qualsiasi altro componente Orbit — non richiedono overlay perché vivono nel flusso del DOM del chiamante.
- Tutti e tre condividono lo stesso set di **tone semantici**: `success | danger | warning | info`, mappati sui token già esistenti in `tokens.css` (`--orbit-status-{tone}`, `--orbit-status-{tone}-fg`, `--orbit-status-{tone}-subtle`).

## Componenti

### 1. `OrbitToastService` + `OrbitToastComponent`

File:
- `projects/orbit/src/lib/services/toast/toast.service.ts`
- `projects/orbit/src/lib/services/toast/toast-ref.ts`
- `projects/orbit/src/lib/components/toast/toast.component.ts` / `.html` / `.css`

API servizio:

```typescript
export type OrbitToastTone = 'success' | 'danger' | 'warning' | 'info';
export type OrbitToastPosition =
  | 'top-start' | 'top-center' | 'top-end'
  | 'bottom-start' | 'bottom-center' | 'bottom-end';

export interface OrbitToastConfig {
  message: string;
  tone?: OrbitToastTone;       // default 'info'
  position?: OrbitToastPosition; // default 'bottom-end'
  duration?: number;            // ms, default 5000; 0 = manuale (nessun auto-dismiss)
  dismissible?: boolean;        // default true, mostra pulsante chiusura
}

export class OrbitToastService {
  show(config: OrbitToastConfig): OrbitToastRef;
  dismissAll(): void;
}

export class OrbitToastRef {
  dismiss(): void;
  readonly afterDismissed$: Observable<void>;
}
```

Comportamento:
- Ogni `position` ha il proprio container overlay (creato lazy alla prima `show()` per quella posizione), con `overlay.position().global()` ancorato all'angolo corrispondente e un `display:flex; flex-direction:column` per impilare i toast (nuovi si aggiungono in fondo per i toast `top-*`, in cima per i `bottom-*`, così il più recente appare sempre vicino al bordo dello schermo).
- Auto-dismiss: `duration > 0` → `setTimeout` che chiama `dismiss()`; il timer si mette in pausa su `mouseenter`/focus interno e riparte su `mouseleave`/blur (accessibilità: un toast che scompare mentre lo si sta leggendo è un problema WCAG).
- `dismiss()` rimuove il portal dal container; se il container resta vuoto, viene distrutto (non lasciare overlay CDK vuoti in DOM).
- Markup toast: `role="status"` per tone `success|info|warning`, `role="alert"` per `danger` (più urgente → assertive live region implicita).

### 2. `OrbitAlertComponent`

File: `projects/orbit/src/lib/components/alert/alert.component.ts` / `.html` / `.css`

```typescript
export type OrbitAlertTone = 'success' | 'danger' | 'warning' | 'info';

@Component({ selector: 'orbit-alert', ... })
export class OrbitAlertComponent {
  tone = input<OrbitAlertTone>('info');
  dismissible = input(false, { transform: booleanAttribute });
  dismissed = output<void>();
}
```

- Contenuto del messaggio via `<ng-content />` (nessun `message` input — permette markup ricco, coerente con come altri componenti Orbit proiettano contenuto).
- Icona automatica per tone (vedi sezione Icone).
- `role="status"` (o `"alert"` per `danger`), `aria-live` non necessario qui: l'alert è già nel DOM al render, non appare dinamicamente come il toast (se il chiamante lo mostra/nasconde con `@if`, è sua responsabilità gestire l'annuncio).

### 3. `OrbitBannerComponent`

File: `projects/orbit/src/lib/components/banner/banner.component.ts` / `.html` / `.css`

Stessa API di `OrbitAlertComponent` (stesso `tone`, `dismissible`, `dismissed`), ma componente distinto (non una variante di Alert) perché il layout differisce strutturalmente: full-width, padding maggiore (`--orbit-space-4`/`--orbit-space-6` invece di `--orbit-space-3`), tipografia più prominente, pensato per essere il primo figlio di una pagina o sezione principale, non annidato in una card.

## Icone

Servono 2 nuove icone nel registry (`projects/orbit/src/lib/icons/icon-registry.ts`), le altre due tone riusano icone esistenti:

| Tone | Icona | Stato |
|---|---|---|
| success | `check` | esiste già |
| danger | `alert-circle` | **nuova** |
| warning | `alert-triangle` | **nuova** |
| info | `info` | **nuova** |

(Nota: 3 nuove icone in totale — `alert-circle`, `alert-triangle`, `info` — seguendo lo stile esistente: viewBox 24x24, stroke-only, `stroke="currentColor"`, `fill="none"`, `stroke-width="1.75"`.)

## Data flow

- Toast: chiamante → `toastService.show(config)` → `OrbitToastRef` restituito sincronicamente → componente montato in overlay → auto-dismiss o `ref.dismiss()` esplicito → `afterDismissed$` emette per eventuale cleanup lato chiamante (es. refetch dopo un'azione confermata).
- Alert/Banner: puramente basati su `@if`/binding lato chiamante; l'output `dismissed` notifica il parent per rimuovere il componente dal template (il componente stesso non si nasconde da solo, coerente con pattern "controlled component" già usato altrove nel design system, es. `sidebarCollapsed` gestito dal parent).

## Error handling

- `OrbitToastService.show()` con `duration` negativo → trattato come `0` (manuale), nessuna eccezione lanciata (fail-soft su input malformato in un componente di UI non critico).
- Se `dismiss()` viene chiamato più volte sullo stesso `OrbitToastRef` (es. doppio click sul pulsante di chiusura), le chiamate successive sono no-op (il ref traccia uno stato `dismissed` interno).

## Testing

- `toast.service.spec.ts`: verifica stacking (più `show()` sullo stesso `position` producono più toast nello stesso container, ordine corretto), auto-dismiss dopo `duration` (usare `fakeAsync`/`tick`), pausa su hover, `dismissAll()` chiude tutti i ref attivi, container distrutto quando vuoto.
- `toast.component.spec.ts`: `role` corretto per tone, pulsante chiusura presente solo se `dismissible`.
- `alert.component.spec.ts` / `banner.component.spec.ts`: icona corretta per tone, `dismissed` emesso al click sul pulsante chiusura, `role` corretto per `danger` vs altri tone.
- Test manuale in `orbit-lab`: nuove pagine catalogo per Toast, Alert, Banner con esempi per ogni tone e per `dismissible`.

## Catalogo (orbit-lab)

Tre nuove entry in `CATALOG_ENTRIES` (`projects/orbit-lab/src/app/catalog/catalog.ts`): `toast` (icona `message-circle`, già esistente), `alert` (icona `alert-triangle`), `banner` (icona `window`, già esistente — riuso semantico ok data l'assenza di un'icona più specifica). Route + pagina dedicata per ciascuno, seguendo il pattern di `slider-page`.
