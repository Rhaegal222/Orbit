# Orbit Redesign Core Completion — piano

> **Stato:** in esecuzione
>
> **Spec associata:** `../specs/2026-07-21-orbit-redesign-component-audit.md`

## 1. Audit e contratto token

- **File:** audit, `tokens.css`, `docs/THEMING.md`, `CHANGELOG.md`.
- **API:** token semantic per densita', superfici, azioni e tipografia; nessun alias legacy nei componenti migrati.
- **Test:** inventario di `var(--orbit-*)` rispetto alle definizioni; controllo riferimenti legacy.
- **Rischi:** token non definiti o significato duplicato.
- **Uscita:** audit tracciabile e ogni token letto dal Core ha default documentato.

## 2. Primitive layout e section

- **File:** form grid/section/divider e relativi test.
- **API:** layout 7/5 e 12 colonne con span; `index`, `density`, `divided`, `collapsible` per le sezioni.
- **Test:** span, breakpoint, heading/region e tastiera.
- **Rischi:** layout fragile in proiezione contenuto e heading non semantici.
- **Uscita:** form denso costruibile senza classi applicative.

## 3. Controlli, button e font

- **File:** button/icon button/form field/CVA e Lab.
- **API:** primary, success, outline, soft, flat, icon-only; font dal token semantic.
- **Test:** loading, disabled, invalid, focus-visible, label accessibile e CVA.
- **Rischi:** CSS locale che duplica button o usa token legacy.
- **Uscita:** ogni azione di form compone `OrbitButtonComponent`.

## 4. Allegati e selectable tile

- **File:** selectable tile, attachment item/list/dropzone, public API e test.
- **API:** tile controllabile, lista tipizzata, item con metadata/status/actions, divider dashed.
- **Test:** semantica lista, emissione azioni, disabled e nome accessibile.
- **Rischi:** terminologia business o azioni non accessibili.
- **Uscita:** lista + dropzone generiche, esportate e catalogate.

## 5. Modal, dialog, overlay e azioni

- **File:** modal compositivo, dialog service/confirm dialog, header/body/footer, action bar e test.
- **API:** `OrbitModalComponent`, conferma tipizzata, chiusura e restore focus tramite CDK.
- **Test:** Escape, backdrop, focus trap/restore, ARIA dialog e composizione action bar.
- **Rischi:** overlay SSR/non-CDK e focus perso alla chiusura.
- **Uscita:** form modale componibile e confirmation dialog accessibile.

## 6. Orbit Lab

- **File:** route, pagine catalogo e shell Lab.
- **API:** esempi reali neutri, tema scoped e toggle density.
- **Test:** component rendering, stretto/desktop/ampio e stati di errore.
- **Rischi:** Lab diventa una pagina applicativa o usa markup non Orbit.
- **Uscita:** catalogo dimostra il flusso completo del redesign senza dati di dominio.

## 7. Consumer fixture e pacchetto

- **File:** fixture consumer e script package.
- **API:** solo `@galileo/orbit` e `@galileo/orbit/styles`.
- **Test:** build, Core test, Lab build, format, token audit e `npm pack --dry-run`.
- **Rischi:** simboli non esportati o asset CSS non inclusi nel tarball.
- **Uscita:** tarball installabile e nessun riferimento workspace/business nel pacchetto.
