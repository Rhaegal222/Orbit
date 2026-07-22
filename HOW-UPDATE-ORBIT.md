# Aggiornare Orbit

Per aggiornare questo checkout, chiedi a un agente:

> Aggiorna Orbit usando lo script `/home/rhaegal222/Server/development/rhaegal222/wyrmrest/wyrmrest-sslvpn-transit-gateway/update-orbit.sh`. Ti fornirò le credenziali quando richieste.

Lo script stabilisce la SSL-VPN, importa `develop` da GitLab tramite `192.168.1.191` e crea un branch temporaneo `integration/gitlab-develop-*` a partire da Forgejo `develop`. Il merge e il push su `forgejo/develop` avvengono solo se l integrazione riesce; in caso di conflitti `develop` resta invariato. Conserva inoltre un branch di backup e, al termine, rimuove la route GitLab e arresta la SSL-VPN.

Le credenziali GitLab e VPN vengono richieste a runtime e non devono essere scritte in questo file o nel repository.
