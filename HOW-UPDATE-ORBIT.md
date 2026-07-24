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

Vedi `TROUBLESHOOTING.md` per dettagli su tutti i problemi risolti.

## Nota sulla rete

`gitlab.galileo.test` è raggiungibile solo tramite la SSL-VPN transit gateway. Non è necessario passare dal MacMini — il tunnel SSH verso `192.168.1.186` non è richiesto per questa operazione.

## Promozione CI/CD

Dopo il push su `develop`, il flusso di promozione è:

```
develop → (PR) → staging → (PR) → main
```

- `develop`: CI verifica il package, nessun deploy automatico
- `staging`: deploy automatico (Traefik disabilitato, solo interno)
- `main`: deploy automatico (Traefik abilitato, pubblico)
