# Aggiornare Orbit

Per aggiornare questo checkout, chiedi a un agente:

> Aggiorna Orbit usando lo script `/home/rhaegal222/Server/development/rhaegal222/wyrmrest/wyrmrest-sslvpn-transit-gateway/update-orbit.sh`. Ti fornirò le credenziali quando richieste.

Lo script stabilisce la SSL-VPN, importa `develop` da GitLab tramite `192.168.1.191`, conserva il precedente stato Forgejo in un branch di backup e pubblica la nuova versione sul remoto `forgejo`. Al termine rimuove la route GitLab e arresta la SSL-VPN.

Le credenziali GitLab e VPN vengono richieste a runtime e non devono essere scritte in questo file o nel repository.
