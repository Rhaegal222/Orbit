# Orbit Core — Visual Refresh Design

**Riferimento sorgente:** `~/Downloads/Orbit visual refresh priorities/ORBIT_VISUAL_REFRESH.md` (derivato dal mockup "Nuova Polizza" / `Orbit Refresh - Nuova Polizza.dc.html`).

**Obiettivo:** applicare il nuovo linguaggio visivo del mockup a Orbit Core (`projects/orbit/src/**`) come refresh dei token esistenti — palette, raggi, ombre, tipografia — più tre estensioni runtime-tunable (accent/CTA, font family, scala testo), le rifiniture di stato interattivo, il set di icone condiviso, e l'allineamento del pattern di composizione del modale operativo alle componenti Core già esistenti.

**Non è un nuovo progetto Orbit Studio**: gli swatch accent/CTA e la tunability font/scala vengono assorbiti nel contratto token permanente di Core (nuovi `[data-orbit-*]` + una custom property continua), disponibili a qualunque app che consuma la libreria, non solo a un configuratore dedicato.

## Contesto attuale (verificato nel codice)

- `projects/orbit/src/styles/tokens.css` ha già la struttura a 3 livelli (`--orbit-ref-*` → `--orbit-*` semantico → `--orbit-component-*`), con scoping runtime già in uso per `[data-orbit-theme='dark']` e `[data-orbit-density='compact']`.
- I componenti del "modale operativo" esistono già in Core: `modal`, `modal-header`, `modal-body`, `modal-footer`, `form-section` (con `[index]`), `form-grid`, `form-action-bar` (ha già lo slot `statusLabel()` per l'autosave a sinistra), `attachment-dropzone`, `attachment-list`/`attachment-list-item`, `selectable-tile` (le "chip toggle"), `divider`, `icon-button`, `popover`, `tooltip`, `confirm-dialog`.
- Tutti i componenti verificati consumano token semantici (`--orbit-action-primary-bg`, `--orbit-border-subtle`, `--orbit-surface-subtle`, ecc.), non valori hardcoded — quindi un refresh dei valori in `tokens.css` si propaga senza toccare quasi nessun component CSS.

## 1. Palette, raggi, ombre (fondazione)

Sostituzione valori in `--orbit-ref-neutral-*` con la scala ink del documento:

| Token | Nuovo valore | Uso |
|---|---|---|
| `--orbit-ref-neutral-900` | `#12151C` (ink900) | testo primario |
| `--orbit-ref-neutral-600`* | `#414958` (ink700) | testo secondario, label campo — *rinominare concettualmente, non serve nuova chiave* |
| `--orbit-ref-neutral-400` | `#74808F` (ink500) | testo terziario, icone neutre |
| nuovo `--orbit-ref-neutral-300` | `#94A0B1` (ink400) | placeholder, meta |
| nuovo `--orbit-ref-neutral-250` | `#A6AFBC` (ink300) | hint, placeholder chiaro |
| `--orbit-ref-neutral-200` | `#C7CDD6` (ink200) | bordo hover |
| nuovo `--orbit-ref-border` | `#E4E8EE` | bordo default input/card |
| `--orbit-ref-neutral-50` | `#F1F3F7` / `#FAFBFC` | hover, fill sezione |
| `--orbit-ref-neutral-0` | `#FFFFFF` | superficie card (invariato) |

I token semantici che referenziano queste chiavi (`--orbit-text-primary`, `--orbit-text-secondary`, `--orbit-border-subtle`, `--orbit-surface-subtle`, ecc.) **non cambiano nome**, solo il valore risolto cambia. Il tema dark (`[data-orbit-theme='dark']`) resta con le sue proprie override esistenti, verificato che il contrasto regga con i nuovi neutri chiari — se necessario si aggiustano le override dark in questo stesso task.

Stato/colori semantici (`success`, `danger`, `warning`, `info`) restano come oggi salvo allineamento hex minori dove il documento lo specifica esplicitamente (success `#1F8A4C`, danger `#D64545`).

**Raggi** — nuovi livelli in `--orbit-ref-radius-*`:

| Token | Valore | Uso |
|---|---|---|
| `--orbit-ref-radius-sm` | `0.25rem` (invariato) | sezione numerata quadrata |
| nuovo `--orbit-ref-radius-control` | `0.625rem` (10px) | input/select |
| `--orbit-radius-tile` (già esiste, già `0.875rem` = 14px — nessuna modifica) | `0.875rem` (14px) | chip/toggle/selectable-tile |
| `--orbit-ref-radius-full` | `9999px` (invariato) | badge/pill |
| nuovo `--orbit-ref-radius-card` | `1.25rem` (20px) | card modale |

Rimappare `--orbit-radius-control` (oggi `--orbit-ref-radius-md` = 6px) al nuovo `--orbit-ref-radius-control` (10px), e `--orbit-radius-surface` (oggi `--orbit-ref-radius-lg` = 10px) al nuovo `--orbit-ref-radius-card` (20px).

**Ombre** — `--orbit-ref-shadow-md` diventa la doppia ombra profonda del documento (`0 30px 60px -20px rgba(18,21,28,.35), 0 10px 28px -10px rgba(18,21,28,.16)`) per `--orbit-shadow-overlay`/`--orbit-shadow-floating` (modali, popover). `--orbit-shadow-raised` (badge, pill-switch selezionato) resta un'ombra leggera, aggiornata solo nel colore base (da `rgb(15 23 42 / ...)` a un tint coerente con ink900).

## 2. Swatch accent / CTA

Nuovi data-attribute di scoping, stesso pattern di `[data-orbit-theme]`/`[data-orbit-density]`:

```css
/* :root = default */
--orbit-action-primary-bg: #3457D5;        /* accent default (blu) */
--orbit-action-primary-bg-hover: <tint più scuro>;
--orbit-cta-bg: #1F8A4C;                    /* CTA default (verde) — NUOVO token semantico */
--orbit-cta-bg-hover: <tint più scuro>;

[data-orbit-accent='violet'] { --orbit-action-primary-bg: #7C3AED; --orbit-action-primary-bg-hover: ...; }
[data-orbit-accent='teal']   { --orbit-action-primary-bg: #0F9B8E; --orbit-action-primary-bg-hover: ...; }

[data-orbit-cta='blue'] { --orbit-cta-bg: var(--orbit-action-primary-bg); --orbit-cta-bg-hover: var(--orbit-action-primary-bg-hover); }
[data-orbit-cta='ink']  { --orbit-cta-bg: #12151C; --orbit-cta-bg-hover: #2a2e38; }
```

Solo 3 opzioni per accento e 3 per CTA (gli swatch curati del documento) — nessun color-picker libero. `orbit-button` variante `solid`/tone `primary` viene ripuntato da `--orbit-action-primary-bg` a `--orbit-cta-bg`; tutto il resto (focus ring, link, selezione chip/tile) resta su `--orbit-action-primary-bg` (l'accento).

## 3. Font family + scala testo (runtime tunable)

**Font family** — stesso pattern a data-attribute su `--orbit-font-sans`:

```css
[data-orbit-font='inter']  { --orbit-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
[data-orbit-font='system'] { --orbit-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
/* default 'public-sans' nel blocco :root, già coerente con l'attuale --orbit-ref-font-sans */
```

**Scala testo** — continua (0.85–1.5), non un enum: nuova custom property nuda `--orbit-text-scale` (default `1`), impostabile dal consumer via `style="--orbit-text-scale: 1.2"` sull'elemento di scoping. Tutti i token `--orbit-font-size-*` diventano `calc(<base-rem> * var(--orbit-text-scale))`.

Regola container "80% ratio" per non clippare a scale elevate: `--orbit-control-height`, altezza bottoni, dimensione badge numerico sezione diventano `calc(<base> * (1 + (var(--orbit-text-scale) - 1) * 0.8))`.

Testi che vanno a capo (label chip) ottengono `line-height: 1.3` esplicito indipendentemente dalla scala.

## 4. Stati interattivi

- **Bottone primario** (`orbit-button` variant solid): aggiungere `hover: filter: brightness(1.08)` e `active: transform: translateY(1px)` in `button.component.css`.
- **Bottone ghost**: verificare/aggiungere hover con `background: var(--orbit-surface-subtle)`.
- **Chip toggle** (`selectable-tile`): aggiungere `@keyframes orbit-pop` (scale 0.8→1.05→1, 0.25s) applicata a `.orbit-selectable-tile__indicator` alla transizione verso `--selected`.
- **Dropzone** (`attachment-dropzone`): verificare/aggiungere hover con bordo/sfondo tinto accent.
- **Riga documento** (`attachment-list-item`): verificare/aggiungere hover con leggero scurimento sfondo.
- **Input**: bordo default → hover `--orbit-border-strong`-equivalente ink200 → focus bordo accent + `box-shadow: 0 0 0 4px color-mix(in srgb, var(--orbit-action-primary-bg) 12%, transparent)` (allineare `--orbit-focus-ring` esistente a questo valore invece del 25%/30% attuale).

## 5. Sistema icone

Nuova cartella `projects/orbit/src/lib/icons/` con set SVG inline condiviso: chiusura, calendario, valuta, chevron, layers, shield-check, flame, refresh, star-burst, target, scale/bilancia, file, upload-cloud, check, save, arrow-right, clock, alert-circle. Contratto uniforme: `viewBox="0 0 24 24"`, `stroke-width:1.75` (2 per icone piccole/close), `stroke-linecap/linejoin:round`, `fill:none`, colore via `currentColor`.

**Occultamento icone sopra `textScale > 1.2`**: valutare in fase di piano se il target browser del progetto supporta `@container style(--orbit-text-scale > 1.2)` (CSS container style queries); se il supporto non è garantito, fallback a una classe `.orbit-icon--scale-sensitive` con `display:none` guidata da un piccolo helper JS che osserva la custom property. Icone sempre visibili indipendentemente dalla scala: check/selezione, icona header, icona riga allegato.

## 6. Pattern di composizione del modale

Nessun nuovo componente strutturale: il pattern (header con badge icona 44×44 e sfondo tinto accent 8%, body con sezioni numerate, footer sticky con slot autosave) è già coperto da `modal-header`, `form-section`, `form-action-bar`. Il lavoro è: (a) applicare i token aggiornati delle sezioni 1–3, (b) le rifiniture di stato della sezione 4, (c) verificare che `modal-header` supporti esattamente il badge icona 44×44/8% del documento — se manca, estendere il component esistente senza cambiarne l'API pubblica.

## Testing

- Ogni valore di token cambiato verificato via i test esistenti dei componenti (nessun test dovrebbe asserire valori hardcoded di colore — verificare comunque `button`, `badge`, `pill-switch`, `selectable-tile` specs prima di procedere).
- Nuovi test per: risoluzione dei nuovi data-attribute (`[data-orbit-accent]`, `[data-orbit-cta]`, `[data-orbit-font]`) su un fixture di test dedicato in `tokens.css`-consuming component; calcolo corretto di `--orbit-text-scale` sulle altezze contenitore (test snapshot/computed-style, non solo lettura del CSS statico).
- Animazione `orbit-pop`: test che verifica la classe/keyframe applicata al passaggio a `--selected`, non il timing esatto (fragile in jsdom).
- Verifica manuale visiva in Orbit Lab (pagine `pill-switch`, `checkbox`, `button`, `badge`) dopo ogni fase di token, dato che è l'unica app che rende dal vivo il CSS di Core.

## Error handling

Nessuna superficie di errore runtime nuova: tutti i tweak sono CSS puro (custom property / data-attribute), quindi un valore non riconosciuto ricade semplicemente sul default `:root` per gli enum, o viene ignorato dal browser per `--orbit-text-scale` se non numerico (nessun crash possibile). L'unico punto che introduce comportamento condizionale reale è l'occultamento icone a `scale > 1.2`, il cui fallback JS (se necessario) deve degradare in modo sicuro a "icona sempre visibile" se l'osservazione fallisce.

## Non-goals

- Color-picker libero per accent/CTA (solo swatch curati, per esplicita richiesta).
- Un vero configuratore/UI per scegliere questi tweak (quello resta eventualmente territorio di un futuro Orbit Studio, se mai ripreso) — qui si costruisce solo il *meccanismo* token, non un pannello per pilotarlo.
- Motion/overlay di apertura-chiusura modale, empty/loading states, responsive/mobile — esplicitamente rimandati dal documento sorgente stesso ("Cosa manca ancora").
