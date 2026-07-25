# Orbit — Iconografia e accessibilità

> **Data:** 2026-07-22  
> **Stato:** Proposta  
> **Pilastri:** 3. Iconografia & visual assets · 4. Accessibilità

## Obiettivo

Stabilire un linguaggio iconografico sostituibile e un contratto a11y verificabile per tutte le primitive Orbit, inclusi i controlli overlay.

## Contratto `orbit-icon`

`OrbitIconComponent` è l'unico punto di integrazione del set icone. Accetta un nome tipizzato, dimensione e modalità decorativa/accessibile; non richiede Bootstrap o una libreria di icone al consumer.

```ts
name = input.required<OrbitIconName>();
size = input<16 | 20 | 24>(20);
label = input<string | null>(null);
decorative = input(true, { transform: booleanAttribute });
```

| Regola | Contratto |
| --- | --- |
| Griglia | 16, 20 e 24 px; `viewBox` coerente `0 0 24 24` quando possibile |
| Stroke | `1.5` o `1.75`, round cap/join; niente mix casuale di stili filled e outline |
| Colore | `currentColor`; il contenitore applica un token semantico |
| Decorativa | `aria-hidden="true"`, nessuna label duplicata |
| Informativa | `role="img"` e `aria-label` obbligatoria |

Le icone dentro un button non ricevono label autonoma: è la label del button a descrivere l'azione. Un icon-button senza testo accessibile richiede sempre `ariaLabel`.

## Contratto a11y

| Area | Requisito |
| --- | --- |
| Focus | `:focus-visible` tokenizzato, mai rimosso senza alternativa AA |
| Form | label associata, disabled e invalid esposti, messaggio errore collegato al campo |
| Tastiera | controlli nativi quando sufficienti; Enter/Space, frecce ed Escape documentati per i compositi |
| Overlay | CDK Overlay, focus management, Escape, restore focus e click esterno definiti per tipo |
| Screen reader | ruoli e stati ARIA nativi o standardizzati (`dialog`, `listbox`, `aria-expanded`, `aria-selected`) |
| Preferenze | `prefers-reduced-motion`, `data-orbit-motion='off'`, forced colors/high contrast |

## Matrice test obbligatoria

Per ogni componente interattivo Core:

1. Tab/Shift+Tab e focus ring; tastiera specifica del pattern.
2. Disabled, invalid e readonly quando applicabili.
3. Nome accessibile e ruolo con test unitario o harness.
4. Overlay: apertura, Escape, click esterno, focus restore e assenza di clipping.
5. Reduced motion e high contrast con verifica manuale nel Lab.

## Non-obiettivi

- Non imporre un fornitore di icone esterno.
- Non sostituire contenuti testuali con icone prive di label.
- Non usare `tabindex` positivo né `<div>` cliccabili.

## Criteri di uscita

1. Le icone Core rispettano griglia, stroke e API accessibile.
2. Ogni componente interattivo dispone di una prova di tastiera e nome accessibile.
3. Tutti gli overlay condividono comportamento di chiusura e focus documentato.
4. Catalogo mostra gli stati accessibili, non solo il default visuale.
