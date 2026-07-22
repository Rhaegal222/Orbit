# Orbit — Pattern UX, governance e developer experience

> **Data:** 2026-07-22  
> **Stato:** Proposta  
> **Pilastri:** 5. Pattern di interazione & content guidelines · 6. Documentazione, governance & DX

## Obiettivo

Trasformare Orbit Lab in riferimento operativo e dare al team regole per comporre, estendere e deprecare il sistema senza produrre varianti locali incoerenti.

## Pattern UX e contenuto

| Necessità | Pattern Orbit | Regola di uso |
| --- | --- | --- |
| Azione focalizzata | Modal | task breve, decisione o form con azioni persistenti |
| Contesto laterale | Offcanvas/Sidebar | navigazione, filtri o dettaglio che conserva il canvas |
| Esito locale | Alert inline | errore o informazione che riguarda una sezione/campo |
| Esito transitorio | Toast | conferma breve, mai unico canale per errori bloccanti |
| Attesa | Skeleton | conserva struttura e densità del contenuto in arrivo |
| Assenza dati | Empty state | descrive cosa manca e propone una CTA utile |

Copywriting:

- Button: verbo + oggetto (`Salva modifiche`, `Crea elemento`), non `OK` o `Invia` generici.
- Errori: causa comprensibile + azione di recupero; evitare colpa dell'utente.
- Date, numeri e valuta: formatter localizzati e iniettabili, mai concatenazioni manuali.
- Una CTA primaria per superficie; secondarie con tono/variante meno enfatici.

## Catalogo e documentazione

Ogni pagina di catalogo usa `lab-example` e contiene: preview funzionante, snippet, API pubblica, stati, comportamento responsive, accessibilità e decisioni d'uso. Le voci sono alfabetiche e localizzate.

Il catalogo deve includere scenari composti, non solo atomi:

- modal operativo con form grid, sezioni, allegati e action bar sticky;
- pannello di gestione con sidebar, filtri offcanvas, tabella, loading/empty/error;
- switch live di tema, font, densità, motion e scala per validare i token.

## Governance

| Fase | Evidenza richiesta |
| --- | --- |
| Proposta | problema, utenti, alternativa nativa valutata, API minima |
| Spec | token, a11y, localizzazione, responsive, dark mode e non-obiettivi |
| Implementazione | test Core, esempio Lab e documentazione theming/changelog |
| Review | API, semver, compatibilità, bundle e consumer fixture |
| Deprecazione | alternativa, migrazione, versione target e periodo di supporto |

Ogni nuovo componente deve avere owner, stato di maturità (`experimental`, `stable`, `deprecated`) e criteri espliciti per uscire da experimental.

## Criteri di uscita

1. I principali pattern di flusso e feedback sono documentati e dimostrati nel Lab.
2. Ogni componente esposto ha esempio standard, API, a11y e stato di maturità.
3. Il processo di proposta/deprecazione evita API o CSS locali non governati.
4. Consumer fixture e `npm pack --dry-run` fanno parte della definizione di pronto per le release.
