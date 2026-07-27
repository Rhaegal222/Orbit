# Orbit — Piano di allineamento post-pubblicazione

> **Stato:** in corso  
> **Data di riferimento:** 2026-07-27  
> **Obiettivo:** rendere coerenti documentazione, package, sicurezza e deploy
> di Orbit dopo la pubblicazione pubblica di `@rhaegal222/orbit` v0.1.2.

## Stato confermato

| Area | Stato attuale |
| --- | --- |
| Libreria condivisa | `@rhaegal222/orbit` v0.1.2 è pubblicata su npmjs.com con licenza MIT. |
| Galileo | `@galileo/orbit` v0.3.0 resta privata nel GitLab Package Registry. |
| Wyrmrest | `@wyrmrest/orbit` v0.1.0 resta un wrapper privato su Forgejo e riesporta il package pubblico. |
| Siti | `orbit.wyrmrest.it` è distribuito su staging e produzione. |
| Segreti | Le credenziali npm e GitHub sono nel Vault; le policy del rotation agent includono `access/*`. |
| Flusso libreria | Galileo → Forgejo → selezione/cherry-pick della sola libreria → GitHub → npmjs. |
| CI/CD GitHub | `publish.yml` (tag `v*` → npm) e `ci.yml` (PR/main → verify) attivi su `Rhaegal222/Orbit`. |
| CI/CD Forgejo | `sync-to-github.yml` (push develop con modifiche a `projects/orbit/src/` → PR su GitHub) e `npm-bump.yml` (settimanale → bump automatico wrapper). |
| Secret GitHub | `NPM_TOKEN` necessario in GitHub repo secrets per publish. `GITHUB_SYNC_TOKEN` necessario in Forgejo secrets per sync. |

Il wrapper dichiara `@rhaegal222/orbit` con il range `^0.1.1`: una nuova
installazione può quindi risolvere v0.1.2. Il suo numero di versione non deve
essere reso artificialmente uguale a quello della libreria pubblica: descrive
un artefatto distinto.

## Principi vincolanti

1. GitHub/npmjs è la fonte della libreria theme-neutral; Galileo e Wyrmrest
   restano fork privati con responsabilità proprie.
2. Nessun token, URL con credenziali o percorso di segreti viene scritto in
   repository, documentazione, output CI o cronologia Git.
3. Un update della libreria pubblica non promuove automaticamente codice verso
   staging o produzione Wyrmrest.
4. Il deploy del sito deve convergere al modello DEL-025: CI produce immagine,
   registry conserva il digest, un repository di deploy promuove solo digest
   immutabili.
5. I piani `docs/superpowers/` sono materiale storico della libreria estratta;
   non costituiscono il backlog corrente finché non sono riclassificati.

## Fase 0 — Congelare la baseline

**Scopo:** registrare una fotografia verificabile senza cambiare il runtime.

- [ ] Verificare i tre package pubblicati con installazioni pulite:
  `@rhaegal222/orbit@0.1.2`, `@galileo/orbit@0.3.0` e
  `@wyrmrest/orbit@0.1.0`.
- [ ] Verificare che il wrapper risolva la versione pubblica attesa e che il
  tarball contenga soltanto gli export e gli asset dichiarati.
- [ ] Registrare commit, tag e URL di release nelle note di rilascio, senza
  duplicare token o configurazioni di accesso.
- [ ] Confermare lo stato dei due ambienti del sito tramite healthcheck e
  build riproducibile.

**Uscita:** una tabella di versione/repository/registry verificata e datata.

## Fase 1 — Allineare i documenti autorevoli

**Scopo:** eliminare le contraddizioni nate durante lo split pubblico.

- [ ] Aggiornare `docs/DEPLOYMENT.md`:
  - `@wyrmrest/orbit` come wrapper Forgejo, non `@galileo/orbit`;
  - `@rhaegal222/orbit@0.1.2` su npmjs.com, non GitHub Packages;
  - flusso Galileo → Forgejo → GitHub → npmjs, con il cherry-pick come
    passaggio selettivo e non replica automatica;
  - separare chiaramente deploy corrente e target GitOps.
- [ ] Aggiornare `docs/UPDATE-GUIDELINES.md`:
  - usare npmjs per il package pubblico, senza configurare `npm.pkg.github.com`;
  - rimuovere gli esempi che inseriscono credenziali nell'URL Git;
  - descrivere soltanto riferimenti a Vault/secret store, mai nomi, percorsi o
    meccanismi che permettano di ricavare credenziali.
- [x] Aggiornare `README.md`, `docs/ARCHITECTURE.md`, `docs/THEMING.md`,
  `docs/IMPLEMENTATION-PLAN.md` e `projects/orbit/README.md` per rendere
  esplicito il contesto a cui si riferiscono: pubblico, Galileo o Wyrmrest.
- [x] Creare `CONTRIBUTING.md` nella repo GitHub pubblica con istruzioni per
  fork, development, testing e apertura PR.
- [x] Correggere `docs/PUBLISHING.md`: il publish npm è ora automatizzato da
  GitHub Actions (`publish.yml` su tag `v*`).
- [ ] Rendere `docs/ORBIT-PUBLIC-SPLIT-STATUS.md` un changelog di migrazione
  chiuso, rimuovendo dettagli di infrastruttura, scope e collocazione dei
  segreti ormai non necessari alla lettura storica.

**Uscita:** nessun documento autorevole identifica il package, registry o
canale di rilascio sbagliato.

## Fase 2 — Riordinare la documentazione di prodotto

**Scopo:** distinguere contratto attuale, decisioni storiche e backlog futuro.

- [ ] Aggiungere un indice `docs/README.md` con tre sezioni: architettura e
  consumo corrente; operazioni e release; storico/specifiche.
- [ ] Etichettare le specifiche e i piani in `docs/superpowers/` come
  **storici**, **completati nel package pubblico** oppure **da rivalidare**.
- [ ] Creare un backlog post-split contenente solo lavoro ancora applicabile a
  Orbit pubblico, wrapper Wyrmrest, Lab, Studio o landing.
- [ ] Stabilire l'owner di ciascun documento autorevole e il trigger di
  aggiornamento (release pubblica, modifica del wrapper, cambio CI, modifica
  del deploy).

**Uscita:** chi lavora su Orbit può capire il contratto corrente senza dedurlo
da piani di implementazione precedenti allo split.

## Fase 3 — Consolidare package e release

**Scopo:** rendere esplicite le responsabilità dei tre artefatti.

- [x] Creare e proteggere il tag GitHub `v0.1.2`, con release note che
  includano il fix del compact modal input.
- [x] Creare CI GitHub → npm: `publish.yml` su tag `v*`, con token
  `NPM_TOKEN` a privilegio minimo nello secret store.
- [x] Creare CI Forgejo → GitHub: `sync-to-github.yml` che estrae la libreria
  da `projects/orbit/src/` e apre una PR su `Rhaegal222/Orbit`.
- [x] Creare `npm-bump.yml` su Forgejo: verifica settimanale della versione
  pubblica su npm e apre MR automatico sul wrapper.
- [ ] Decidere se pubblicare un nuovo `@wyrmrest/orbit` soltanto quando cambia
  il wrapper (metadata, asset o range di dipendenza), non per ogni release
  patch di `@rhaegal222/orbit`.
- [ ] Se si pubblica il wrapper, aumentare la sua versione in modo semantico,
  generare il tarball e provarlo in un consumer pulito.

**Uscita:** ogni versione può essere ricondotta a un repository, un tag, un
tarball verificato e un owner.

## Fase 4 — Sicurezza e rotazione

**Scopo:** completare la migrazione delle credenziali senza introdurre nuove
dipendenze segrete nella documentazione.

- [x] Verificare che gli accessi npm e GitHub usati dal publish e dalla CI
  provengano esclusivamente dal Vault/secret store. `NPM_TOKEN` in GitHub
  secrets, `GITHUB_SYNC_TOKEN` in Forgejo secrets.
- [ ] Ridurre i privilegi dei token al minimo necessario e testare una
  rotazione completa, inclusa la propagazione ai consumer CI autorizzati.
- [ ] Risolvere il bootstrap di `VAULT_INIT_TOKEN`: l'applicazione delle policy
  deve essere idempotente e verificabile dopo un riavvio, non solo presente in
  memoria.
- [ ] Aggiungere una verifica non sensibile che segnali policy non applicate o
  secret non caricabili, senza esporre valori o identificatori riservati.

**Uscita:** un riavvio e una rotazione non interrompono publish, sync o CI e
non richiedono interventi manuali sulle credenziali.

## Fase 5 — Migrare il sito al deploy GitOps

**Scopo:** chiudere il gap con ADR-033 / STD-013 / DEL-025.

- [ ] Creare `wyrmrest-orbit-deploy` con branch `develop`, `staging`, `main`,
  protezioni coerenti e permessi separati dal repository applicativo.
- [ ] Rendere la CI del repository Orbit responsabile di build, test e push
  dell'immagine del sito nel Forgejo Container Registry.
- [ ] Registrare e promuovere nel repository deploy esclusivamente riferimenti
  `image@sha256:…`; eliminare build dell'immagine sull'host runtime.
- [ ] Configurare runner di staging e produzione con scope minimo e approvazione
  umana obbligatoria per `main`.
- [ ] Migrare staging, verificare healthcheck e rollback per digest, quindi
  promuovere produzione con PR approvata.
- [ ] Deprecare il workflow che copia l'intero worktree e usa `docker compose
  up --build` nel percorso di deploy.

**Uscita:** il runtime applica un digest già pubblicato e il rollback è una
commit nel repository deploy.

## Sequenza e dipendenze

```text
Fase 0 ──► Fase 1 ──► Fase 2
              │
              ├──► Fase 3 ──► Fase 4
              │
              └──► Fase 5
```

Le fasi 3 e 5 sono indipendenti dopo l'allineamento documentale. La Fase 5 non
richiede di attendere l'automazione GitHub → npm, ma richiede registry Forgejo,
policy Vault verificabili e approvazione del modello di runner.

## Rischi e controlli

| Rischio | Controllo |
| --- | --- |
| Confondere i tre package | Tabella versioni e ownership in ogni guida autorevole. |
| Pubblicare codice Wyrmrest/Galileo sul repository pubblico | `sync-to-github.yml` estrae solo `projects/orbit/src/`; PR separata da `upstream/main` e checklist di estrazione theme-neutral. |
| Esposizione di credenziali | Solo secret store; divieto di token in URL Git, documenti e log. Token CI: `NPM_TOKEN` (GitHub), `GITHUB_SYNC_TOKEN` (Forgejo). |
| Deploy non riproducibile | Immagine CI, digest immutabile, repository deploy separato. |
| Piani storici eseguiti come backlog corrente | Stato esplicito e backlog post-split separato. |
| Sync Forgejo → GitHub fallisce | `sync-to-github.yml` logga errori e non blocca develop; fallback manuale con script locale. |

## Criterio di chiusura

Il piano è concluso quando documenti e package descrivono lo stesso stato,
le release sono tracciabili e sicure, il bootstrap Vault è riproducibile e il
sito Orbit è promosso tramite un repository GitOps con digest immutabili.
