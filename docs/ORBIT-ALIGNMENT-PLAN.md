# Orbit — Piano di allineamento post-pubblicazione

> **Stato:** in corso  
> **Data di riferimento:** 2026-07-27  
> **Obiettivo:** rendere coerenti documentazione, package, sicurezza e deploy
> di Orbit dopo la pubblicazione pubblica di `@rhaegal222/orbit` v0.1.3.

## Stato confermato

| Area | Stato attuale |
| --- | --- |
| Libreria condivisa | `@rhaegal222/orbit` v0.1.3 è pubblicata su npmjs.com con licenza MIT. |
| Galileo | `@galileo/orbit` v0.3.0 resta privata nel GitLab Package Registry. |
| Wyrmrest | `@wyrmrest/orbit` v0.1.0 resta un wrapper privato su Forgejo (`^0.1.3`). |
| Siti | `orbit.wyrmrest.it` è distribuito su staging e produzione. |
| Segreti | `NPM_TOKEN` (GitHub) e `GITHUB_SYNC_TOKEN` (Forgejo) da Vault. |
| Flusso libreria | Galileo → Forgejo → sync automatico → GitHub → npmjs. |
| CI/CD GitHub | `publish.yml` (tag `v*` → npm) e `ci.yml` (lint + build + test). |
| CI/CD Forgejo | `ci.yml` (lint + build + test), `deploy.yml` (build + Docker + deploy), `sync-to-github.yml`, `npm-bump.yml`. |
| Lint | ESLint + angular-eslint configurato su entrambi i repo (0 errori, 12 warning). |

Il wrapper dichiara `@rhaegal222/orbit` con il range `^0.1.3`. Il suo numero
di versione non deve essere reso artificialmente uguale a quello della libreria
pubblica: descrive un artefatto distinto.

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

- [x] Verificare i tre package pubblicati: `@rhaegal222/orbit@0.1.3` su
  npmjs.com, `@wyrmrest/orbit@0.1.0` su Forgejo, `@galileo/orbit@0.3.0` su GitLab.
- [x] Verificare che il wrapper risolva la versione pubblica attesa (`^0.1.3`).
- [x] Registrare commit, tag e URL di release nelle note di rilascio.
- [ ] Confermare lo stato dei due ambienti del sito tramite healthcheck e
  build riproducibile.

**Uscita:** una tabella di versione/repository/registry verificata e datata.

## Fase 1 — Allineare i documenti autorevoli

**Scopo:** eliminare le contraddizioni nate durante lo split pubblico.

- [x] Aggiornare `docs/DEPLOYMENT.md`:
  - `@wyrmrest/orbit` come wrapper Forgejo;
  - `@rhaegal222/orbit@0.1.3` su npmjs.com;
  - flusso Galileo → Forgejo → GitHub → npmjs;
  - CI/CD aggiornato (lint, build, test).
- [x] Aggiornare `docs/UPDATE-GUIDELINES.md`:
  - npmjs.com per il package pubblico (no GitHub Packages);
  - riferimenti a Vault per le credenziali;
  - flusso automatico sync-to-github.yml.
- [x] Aggiornare `README.md` con CI badge e lint nei comandi.
- [x] Creare `CONTRIBUTING.md` nella repo GitHub pubblica.
- [x] Correggere `docs/PUBLISHING.md`: publish npm automatizzato da GitHub Actions.
- [x] Creare `CHANGELOG.md` con storico versioni.
- [x] Creare `SECURITY.md` per vulnerability disclosure.
- [x] Creare `CODEOWNERS` per review routing.

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
  aggiornamento.

**Uscita:** chi lavora su Orbit può capire il contratto corrente senza dedurlo
da piani di implementazione precedenti allo split.

## Fase 3 — Consolidare package e release

**Scopo:** rendere esplicite le responsabilità dei tre artefatti.

- [x] Creare e proteggere il tag GitHub `v0.1.3`.
- [x] Creare CI GitHub → npm: `publish.yml` su tag `v*`.
- [x] Creare CI Forgejo → GitHub: `sync-to-github.yml`.
- [x] Creare `npm-bump.yml` su Forgejo.
- [x] Configurare `NPM_TOKEN` in GitHub secrets da Vault.
- [x] Fixare `.npmrc`: `@rhaegal222` → npmjs.org (era GitHub Packages).
- [x] Aggiungere lint a CI e deploy workflow Forgejo.
- [x] Fixare node-version 20 → 22 nei workflow Forgejo.
- [ ] Decidere se pubblicare un nuovo `@wyrmrest/orbit` soltanto quando cambia
  il wrapper (metadata, asset o range di dipendenza).

**Uscita:** ogni versione può essere ricondotta a un repository, un tag, un
tarball verificato e un owner.

## Fase 4 — Sicurezza e rotazione

**Scopo:** completare la migrazione delle credenziali senza introdurre nuove
dipendenze segrete nella documentazione.

- [x] Verificare che gli accessi npm e GitHub provengano dal Vault.
- [x] Configurare `NPM_TOKEN` in GitHub secrets.
- [x] Codificare policy Vault in HCL (IaC): `git-forge-policy.hcl`,
  `rotation-agent-policy.hcl`.
- [x] Container `vault-init` per applicazione idempotente delle policy.
- [x] Rotation agent signals both git-forge and git-workspace after rotation.
- [ ] Ridurre i privilegi dei token al minimo necessario e testare una
  rotazione completa.
- [ ] Aggiungere una verifica non sensibile che segnali policy non applicate.

**Uscita:** un riavvio e una rotazione non interrompono publish, sync o CI.

## Fase 5 — Migrare il sito al deploy GitOps

**Scopo:** chiudere il gap con ADR-033 / STD-013 / DEL-025.

- [ ] Creare `wyrmrest-orbit-deploy` con branch `develop`, `staging`, `main`.
- [ ] Rendere la CI responsabile di build, test e push dell'immagine nel
  Forgejo Container Registry.
- [ ] Registrare e promuovere solo riferimenti `image@sha256:…`.
- [ ] Configurare runner con scope minimo e approvazione umana per `main`.
- [ ] Migrare staging, verificare healthcheck e rollback per digest.
- [ ] Deprecare il workflow tar-pipe + `docker compose up --build`.

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

## Rischi e controlli

| Rischio | Controllo |
| --- | --- |
| Confondere i tre package | Tabella versioni e ownership in ogni guida autorevole. |
| Pubblicare codice Wyrmrest/Galileo sul repo pubblico | `sync-to-github.yml` estrae solo `projects/orbit/src/`. |
| Esposizione di credenziali | Solo Vault; divieto di token in URL, documenti e log. |
| Deploy non riproducibile | Target: immagine CI + digest immutabile + repo deploy separato. |
| Piani storici eseguiti come backlog | Stato esplicito e backlog post-split separato. |
| Sync Forgejo → GitHub fallisce | Fallback manuale con script locale. |

## Criterio di chiusura

Il piano è concluso quando documenti e package descrivono lo stesso stato,
le release sono tracciabili e sicure, il bootstrap Vault è riproducibile e il
sito Orbit è promosso tramite un repository GitOps con digest immutabili.
