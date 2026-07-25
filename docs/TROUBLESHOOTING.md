# Troubleshooting Orbit

Problemi risolti durante l'aggiornamento e il deployment di Orbit.

## 1. Conflitti di merge su package.json

**Sintomi:** Lo script `update-orbit.sh` fallisce con `CONFLICT (content): Merge conflict in package.json`.

**Causa:** GitLab e Forgejo hanno evoluto `package.json` in modo indipendente:
- GitLab: ha aggiunto `dependencies` e `devDependencies` (Angular, Tailwind, ecc.)
- Forgejo: ha aggiunto metadata (`repository`, `bugs`, `homepage`, `publishConfig`, `engines`)

**Soluzione:** Risolvere manualmente unificando entrambi i lati:
```bash
# 1. Entra nel branch di integrazione
git switch integration/gitlab-develop-YYYYMMDD-HHMMSS

# 2. Ri-esegui il merge (il branch abortito è ancora valido)
git merge --no-ff --allow-unrelated-histories galileo/develop \
  -m "merge: import develop from GitLab (resolved)"

# 3. Risolvi i conflitti in package.json, poi:
git add package.json
git commit -m "merge: import develop from GitLab (resolved package.json conflict)"

# 4. Merge su develop e push
git switch develop
git merge --ff-only integration/gitlab-develop-YYYYMMDD-HHMMSS
git push forgejo develop:develop
```

**Prevenzione:** Mantenere `package.json` sincronizzato tra GitLab e Forgejo. Le dipendenze Angular/Tailwind vanno su GitLab; le metadata del package su Forgejo.

## 2. Container serve HTML statico invece dell'Angular app

**Sintomi:** `orbit.wyrmrest.it` mostra una pagina statica con token samples invece del catalogo componenti Angular.

**Causa:** Il Dockerfile copiava `site/` (HTML statico creato su Forgejo) invece di `dist/orbit-lab/browser/` (build Angular).

**Soluzione:** Aggiornare il Dockerfile:
```dockerfile
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/orbit-lab/browser/ /usr/share/nginx/html/
EXPOSE 8080
```

Prima del build Docker, buildare l'Angular app:
```bash
npx ng build orbit-lab --configuration=production
```

## 3. nginx.conf non supporta Angular routing

**Sintomi:** Le route Angular (es. `/lab/button`) restituiscono 404.

**Causa:** `try_files $uri $uri/ =404` non fa fallback a `index.html`.

**Soluzione:** Aggiornare `nginx.conf`:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 4. traefik.enable=false su production

**Sintomi:** Il container risponde internamente ma non è raggiungibile dall'esterno.

**Causa:** `docker-compose.yml` ha `traefik.enable=${TRAEFIK_ENABLE:-false}`. Il default è `false`.

**Soluzione:** Il deploy.yml gestisce correttamente questo con `TRAEFIK_ENABLE=true` per la branch `main`. Se si ricostruisce manualmente:
```bash
TRAEFIK_ENABLE=true docker compose -p wyrmrest-orbit-production up -d --force-recreate orbit
```

## 5. Docker image non aggiornata nel container

**Sintomi:** `docker compose up -d --force-recreate` ma il container serve contenuti vecchi.

**Causa:** L'immagine buildata con il compose project di development (`wyrmrest-orbit-orbit`) non è la stessa del compose project di production (`wyrmrest-orbit-production`).

**Soluzione:** Taggare l'immagine correttamente:
```bash
docker tag wyrmrest-orbit-orbit:latest wyrmrest-orbit-production-orbit:latest
TRAEFIK_ENABLE=true docker compose -p wyrmrest-orbit-production up -d --force-recreate orbit
```

## 6. Deploy seguendo il flusso CI/CD

Il flusso di promozione è:
```
develop → (PR) → staging → (PR) → main
```

- `develop`: CI verifica il package (`npm pack --dry-run`), nessun deploy
- `staging`: deploy automatico su push (Traefik disabilitato, solo interno)
- `main`: deploy automatico su push (Traefik abilitato, pubblico)

**Non deployare mai manualmente in produzione.** Usare sempre PR per promuovere codice.

## 7. VPN necessaria per GitLab

`gitlab.galileo.test` non è raggiungibile senza VPN. Lo script `update-orbit.sh`:
1. Avvia la SSL-VPN nel container Docker
2. Aggiunge la route verso `192.168.1.191` via `ppp0`
3. Esegue `git fetch` con `--resolve` per bypassare DNS
4. Al termine, rimuove la route e arresta la VPN

**Non è possibile accedere a GitLab dal browser o da strumenti esterni senza la VPN.**
