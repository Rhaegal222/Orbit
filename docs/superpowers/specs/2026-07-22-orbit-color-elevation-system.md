# Orbit — Colore, theming ed elevazione

> **Data:** 2026-07-22  
> **Stato:** Proposta  
> **Pilastri:** 1. Architettura dei colori & theming · 2. Elevazione, layering e superfici

## Obiettivo

Rendere il tema Orbit sostituibile senza fork e fare della profondità una proprietà semantica, non l'effetto accidentale di bordi grigi o `z-index` locali.

## Contratto colore

I componenti consumano esclusivamente token di ruolo. I valori primitivi (palette, HSL, hex) restano nel tema e non entrano nei CSS dei componenti.

| Dominio | Token semantici minimi | Uso consentito |
| --- | --- | --- |
| Testo | `--orbit-text-primary`, `secondary`, `tertiary`, `inverse`, `placeholder` | gerarchia dei contenuti |
| Superfici | `--orbit-surface-default`, `subtle`, `raised`, `floating` | pagina, card, controllo, overlay |
| Bordi | `--orbit-border-subtle`, `strong` | separazione e contenimento, mai unico feedback interattivo |
| Azioni | `--orbit-action-{primary,success,danger,neutral}-{bg,bg-hover,fg,fg-subtle}` | button, link azione, stati selezionati |
| Stato | `--orbit-status-{success,warning,danger,info}` e `-subtle` | feedback non azionabili |
| Focus | `--orbit-focus-ring` | focus visibile coerente e AA |

Ogni tema (`:root`, `[data-orbit-theme='dark']`, tema consumer) definisce l'intera matrice. Non è ammesso dedurre il foreground con `color-mix()` dentro un componente: il tema dichiara esplicitamente il pairing sfondo/testo.

### Regole di contrasto

- Testo normale e icone informative: almeno 4.5:1 sulla superficie ospite.
- Testo grande: almeno 3:1; focus ring e confini interattivi: almeno 3:1 rispetto alla superficie adiacente.
- Lo stato non dipende mai dal solo colore: aggiungere label, icona, bordo o struttura.
- `soft`, `translucent`, `outline` e `flat` in dark mode usano `*-fg-subtle`, non il colore scuro del tema light.

## Surface ed elevazione

| Livello | Token | Esempi | Ombra |
| --- | --- | --- | --- |
| 0 | `surface-default` | canvas, body | nessuna |
| 1 | `surface-subtle` | gruppi e aree secondarie | nessuna o bordo subtle |
| 2 | `surface-raised` + `shadow-raised` | card e controlli | lieve |
| 3 | `surface-floating` + `shadow-floating` | dropdown, tooltip, popover | media |
| 4 | `surface-overlay` + `shadow-overlay` | modal, drawer | marcata |

I token `--orbit-shadow-{raised,floating,overlay}` sono definiti per light e dark. Nei temi scuri prevalgono separazione tonale e shadow a bassa opacità: non si schiarisce indiscriminatamente il bordo.

## Layering

| Token | Contenuto |
| --- | --- |
| `--orbit-z-base` | contenuto ordinario |
| `--orbit-z-sticky` | header e action bar sticky |
| `--orbit-z-popover` | tooltip, dropdown, popover CDK |
| `--orbit-z-overlay` | modal e drawer CDK |
| `--orbit-z-toast` | notifiche temporanee |

Il CDK Overlay resta l'autorità per stacking e posizionamento degli overlay. I componenti non introducono valori numerici locali di `z-index`.

## Implementazione e verifiche

- Centralizzare token in `projects/orbit/src/styles/tokens.css`; documentare le aggiunte in `docs/THEMING.md` e `CHANGELOG.md`.
- Audit CSS: nessun hex, rgb, `z-index` numerico o token legacy nei componenti modificati.
- Catalogo: pagina Themes con matrice button/superfici/status in light e dark.
- Test visivo manuale: light, dark, high contrast, zoom browser 200%.

## Criteri di uscita

1. Ogni componente Core usa solo token semantici o component token documentati.
2. Light e dark definiscono tutti i token consumati.
3. La matrice foreground/background dei controlli soddisfa WCAG AA.
4. Overlay, sticky e toast rispettano la scala di layer senza conflitti.
