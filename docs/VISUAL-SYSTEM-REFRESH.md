# Orbit Visual & System Refresh

## Benchmark visivo

Il materiale `Downloads/Orbit visual refresh strategy` e' il benchmark di
composizione del refresh: modal ampio con radius morbido, una sola elevazione
principale, header leggibile, section header numerati, griglia operativa, tile
selezionabili, attachment card/dropzone e footer d'azione. Ne deriviamo ritmo,
gerarchia e feedback; non importiamo Bootstrap, font asset o terminologia del
prototipo nel package.

Il successivo riferimento `Downloads/Orbit visual refresh priorities` definisce
i valori operativi adottati nel Core: palette ink, controlli 42px/38px,
spaziatura 26px/14px, radius 10px/14px/20px, focus ring a 4px e la gerarchia
title/field-label/value/metadata. Questi valori entrano nei token semantici e
non restano CSS del solo showcase.

## Direzione

Orbit e' un sistema per superfici operative, non una raccolta di box. Il linguaggio
usa profondita' contenuta, tipografia leggibile, spaziatura intenzionale e stati
interattivi riconoscibili. Il bordo definisce i limiti; la superficie e l'elevazione
definiscono la gerarchia.

## 1. Foundations

### Surface ed elevation

| Ruolo | Token | Uso |
| --- | --- | --- |
| Canvas | `--orbit-surface-canvas` | sfondo applicazione |
| Base | `--orbit-surface-default` | contenuto primario |
| Raised | `--orbit-surface-raised` | card e gruppi informativi |
| Floating | `--orbit-surface-floating` | menu, picker, popover |
| Modal | `--orbit-surface-modal` | dialog operativo |

Usare bordi semantici insieme a `--orbit-shadow-raised` o
`--orbit-shadow-floating`; non simulare gerarchia con molte card annidate.

### Typography

`display`, `title`, `subtitle`, `body`, `label`, `caption` e `code` sono ruoli,
non classi decorative. Label e caption sono per contesto; il valore operativo usa
body o title, mai solo colore tenue.

### Stati interattivi

- Hover: cambia superficie e contrasto, non soltanto il cursore.
- Active/selected: combina superficie, colore e forma/bordo.
- Focus: usa sempre `--orbit-focus-ring` con outline visibile.
- Disabled: riduce contrasto e interazione, senza affidarsi al solo colore.
- Motion: `--orbit-motion-fast` per hover, `--orbit-motion-base` per popup e
  `--orbit-easing-standard` per tutti i componenti.

### Icone

Le icone Orbit sono SVG 16/20/24 px, `stroke-linecap="round"`,
`stroke-linejoin="round"`, stroke 1.5–1.75. Ereditano `currentColor`; il tono e'
determinato dal contenitore/azione, non dal path SVG.

## 2. Layout e pattern

### Rhythm

- label → control: `--orbit-field-stack-gap`;
- campi correlati: `--orbit-layout-gap`;
- sezioni: `--orbit-section-gap`;
- modal chrome: `--orbit-modal-padding-*`.

### Modal operativo

```html
<orbit-modal labelledBy="configuration-title">
  <orbit-modal-header titleId="configuration-title" title="Configura elemento" />
  <orbit-modal-body>
    <orbit-form-grid>…</orbit-form-grid>
  </orbit-modal-body>
  <orbit-modal-footer variant="form"><orbit-form-action-bar /></orbit-modal-footer>
</orbit-modal>
```

Header e footer restano visibili; il solo body scorre. La griglia 7/5 gestisce
contenuto primario e secondario; la griglia 12 colonne gestisce i field interni.

### Stati di sistema

Loading usa superfici subtle e shimmer, non solo spinner. Empty state combina una
icona 24 px, titolo, descrizione e CTA opzionale. Success/error mantengono testo e
icona oltre al colore.

## 3. Micro-esperienze

Date/time picker, select e autocomplete mantengono input editabile quando utile,
trigger esplicito, focus visibile, Escape/outside close e scorciatoie rapide. Le
opzioni selezionabili devono avere stato `aria-pressed`/`aria-selected` coerente.

## 4. Orbit Lab

Il catalogo deve usare canvas, superfici e pattern reali. `Operational modal` e
`Pickers` sono gli scenari di regressione per responsive, densita', tema e footer
persistente; i componenti atomici restano per test API, non per decidere il look.
