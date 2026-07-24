# Aggiornare Orbit

Per aggiornare questo checkout, chiedi a un agente:

> Aggiorna Orbit usando lo script `/home/rhaegal222/Server/development/rhaegal222/wyrmrest/wyrmrest-sslvpn-transit-gateway/update-orbit.sh`.

Lo script legge le credenziali direttamente dal file `.env` nella stessa directory dello script (non committato, elencato in `.gitignore`). Le variabili richieste sono:

- `GITLAB_USERNAME`
- `GITLAB_PASSWORD`
- `VPN_PASSWORD`

Lo script stabilisce la SSL-VPN, importa `develop` da GitLab tramite `192.168.1.191` e crea un branch temporaneo `integration/gitlab-develop-*` a partire da Forgejo `develop`. Il merge e il push su `forgejo/develop` avvengono solo se l'integrazione riesce; in caso di conflitti `develop` resta invariato. Conserva inoltre un branch di backup e, al termine, rimuove la route GitLab e arresta la SSL-VPN.

**Nota:** `gitlab.galileo.test` è direttamente raggiungibile via VPN attraverso la SSL-VPN transit gateway. Non è necessario passare dal MacMini — il tunnel SSH verso `192.168.1.186` non è richiesto per questa operazione.
