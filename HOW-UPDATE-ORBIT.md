# Aggiornare Orbit

Per aggiornare questo checkout, chiedi a un agente:

> Aggiorna Orbit usando lo script `/home/rhaegal222/Server/development/rhaegal222/wyrmrest/wyrmrest-sslvpn-transit-gateway/update-orbit.sh`. Ti fornirò le credenziali quando richieste.

Lo script stabilisce la SSL-VPN, instrada GitLab tramite `192.168.1.191`, scarica `develop` dal remoto `galileo` e protegge la versione locale con un branch di backup se le storie Git divergono.

Le credenziali GitLab e VPN vengono richieste a runtime e non devono essere scritte in questo file o nel repository.
