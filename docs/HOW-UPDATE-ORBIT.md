# Aggiornare Orbit

Per aggiornare questo checkout, chiedi a un agente:

> Aggiorna Orbit usando lo script `/home/rhaegal222/Server/development/rhaegal222/wyrmrest/wyrmrest-sslvpn-transit-gateway/update-orbit.sh`.

## Credenziali

Lo script legge le credenziali dal file `.env` nella stessa directory dello script (non committato, elencato in `.gitignore`). Variabili richieste:

- `GITLAB_USERNAME`
- `GITLAB_PASSWORD`
- `VPN_PASSWORD`

## Come funziona

1. Avvia la SSL-VPN nel container Docker
2. Aggiunge la route verso `192.168.1.191` via `ppp0`
3. Esegue `git fetch` da GitLab con `--resolve` per bypassare DNS
4. Crea un branch temporaneo `integration/gitlab-develop-*` da Forgejo `develop`
5. Merge di `galileo/develop` nel branch di integrazione
6. Se il merge riesce: fast-forward su `develop` e push su Forgejo
7. Se ci sono conflitti: esce con istruzioni di risoluzione (vedi sotto)
8. Al termine: pulisce branch di integrazione/backup vecchi (tiene ultimi 3)
9. Rimuove la route GitLab e arresta la SSL-VPN

## Conflitti di merge

Se il merge fallisce (solitamente su `package.json`), lo script mostra le istruzioni per risolvere manualmente. In sintesi:

```bash
git switch integration/gitlab-develop-YYYYMMDD-HHMMSS
# Risolvi i conflitti (mantieni sia dipendenze GitLab che metadata Forgejo)
git add <file>
git commit -m "merge: import develop from GitLab (resolved)"
git switch develop
git merge --ff-only integration/gitlab-develop-YYYYMMDD-HHMMSS
git push forgejo develop:develop
```

Vedi `docs/TROUBLESHOOTING.md` per dettagli su tutti i problemi risolti.

## Nota sulla rete

`gitlab.galileo.test` è raggiungibile solo tramite la SSL-VPN transit gateway. Non è necessario passare dal MacMini — il tunnel SSH verso `192.168.1.186` non è richiesto per questa operazione.

## Promozione CI/CD

Dopo il push su `develop`, il flusso di promozione è:

```
develop → (PR) → main
```

- `develop`: CI verifica il package, nessun deploy automatico
- `main`: deploy automatico (Traefik abilitato, pubblico)

## Richieste di nuove primitive

Orbit è una base UI riutilizzabile: una richiesta nata da una singola applicazione non richiede
automaticamente una nuova componente nella libreria. Prima di proporre modifiche alla libreria,
realizzare il risultato nel consumer componendo le primitive già pubbliche e mantenendo nel
consumer dati, streaming, permessi e stato applicativo.

Per dashboard operative e sorveglianza, la composizione consigliata è:

- KPI: CSS Grid locale a 12 colonne con `orbit-panel`, `orbit-stack`, `orbit-cluster`,
  `orbit-icon` e `orbit-badge`;
- barra azioni: `orbit-cluster` con pulsanti, selettori e badge; sui viewport stretti la
  strategia di overflow (per esempio scroll orizzontale) appartiene all'applicazione;
- superfici media: una grid CSS locale e wrapper con `aspect-ratio`, `orbit-spinner` per il
  caricamento e `orbit-icon` per gli stati offline o di errore. Video, WebRTC e playback restano
  sempre dell'applicazione.

Documentare il pattern nell'applicazione o in Orbit Lab e verificarlo su almeno due schermate o
consumer reali. Una nuova primitiva è giustificata solo se il pattern, inclusi API, comportamento
responsive e requisiti di accessibilità, rimane stabile senza CSS o logica applicativa specifica.

### Quando aggiornare la repo pubblica e npm

Non aggiornare la repository sorgente pubblica né pubblicare una nuova versione npm per replicare un
singolo layout. In questo checkout `@wyrmrest/orbit` è un wrapper che re-esporta
`@rhaegal222/orbit`; il codice delle primitive appartiene alla repo sorgente di
`@rhaegal222/orbit`.

Un commit che aggiunge una primitiva pubblica, per esempio `orbit-topbar`, non è un cambiamento
solo documentale: deve essere portato nella repository pubblica e pubblicato come versione
**minor** di `@rhaegal222/orbit`, dopo le verifiche previste. Poiché la libreria è ancora `0.x`,
il range attuale del wrapper `^0.1.3` non include `0.2.0`: per `orbit-topbar` occorre quindi
aggiornare la dipendenza a `^0.2.0`, il lockfile e pubblicare anche una nuova versione del wrapper
`@wyrmrest/orbit`.

Prima di decidere una release, verificare sempre che la modifica proposta soddisfi la condizione di
riuso sopra; non pubblicare per allineare versioni già compatibili.

Quando l'evidenza d'uso giustifica una primitiva riutilizzabile:

1. implementarla e testarla nella repository sorgente `@rhaegal222/orbit`, senza modificare token o
   primitive esistenti se non necessario;
2. registrare l'API pubblica e la modifica additiva in `CHANGELOG.md` sotto **Unreleased**;
3. eseguire build, test, `npm pack --dry-run` e installazione del tarball in un consumer pulito;
4. portare il commit nella repository pubblica, aggiornare la versione e pubblicare una release
   **minor** di `@rhaegal222/orbit` solo dopo le verifiche previste;
5. aggiornare qui la dipendenza e il lockfile; pubblicare una nuova versione di `@wyrmrest/orbit`
   solo se il suo contratto o il range della dipendenza cambia. Registrare tale modifica nel suo
   changelog, quindi rieseguire `npm run check` e la verifica del consumer fixture.

Un cambiamento solo documentale, un esempio composto da primitive esistenti o un aggiornamento
compatibile già coperto dal range semver non richiede alcun rilascio npm.
