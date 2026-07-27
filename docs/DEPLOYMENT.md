# Orbit — Distribuzione e Deploy

## Tripla distribuzione

```
Galileo (gitlab.galileo.test)          ← upstream privato (VPN)
    │  @galileo/orbit v0.3.0 UNLICENSED
    │  update-orbit.sh
    ▼
Forgejo (git.wyrmrest.it)              ← wrapper + deploy website
    │  @wyrmrest/orbit v0.1.0 → wrapper su @rhaegal222/orbit
    │  CI: .forgejo/workflows/deploy.yml
    ├─► staging (orbit.wyrmrest.it, Traefik OFF)
    └─► production (orbit.wyrmrest.it, Traefik ON)

GitHub (github.com/Rhaegal222/Orbit)   ← pubblico, MIT
    │  @rhaegal222/orbit v0.1.3
    │  51 UI primitives + tokens (theme-neutral)
    │  CI: publish.yml (tag v* → npm), ci.yml (PR/main → verify)
    ▼
npmjs.com (pubblico)
    npm install @rhaegal222/orbit
```

## I tre package

| Package | Registry | Versione | Licenza | Contenuto |
|---------|----------|----------|---------|-----------|
| `@galileo/orbit` | GitLab (privato) | 0.3.0 | UNLICENSED | Libreria interna Galileo |
| `@rhaegal222/orbit` | npmjs.com (pubblico) | 0.1.3 | MIT | 51 UI primitives + tokens (theme-neutral) |
| `@wyrmrest/orbit` | Forgejo (privato) | 0.1.0 | UNLICENSED | Wrapper che dipende da `@rhaegal222/orbit` |

## GitHub repo (`github.com/Rhaegal222/Orbit`)

- Solo branch `main` (tutto squash-merged)
- CI: `ci.yml` (lint + build + test su PR e main)
- Publish: `publish.yml` (tag `v*` → build → npmjs.com)
- Secret: `NPM_TOKEN` (da Vault)

## Flusso di sincretismo

1. **Galileo** sviluppa `@galileo/orbit` (fork privata, componenti + branding Galileo)
2. **Forgejo** importa da Galileo via VPN (`update-orbit.sh`)
3. **Estrazione** della libreria theme-neutral → `@rhaegal222/orbit` su GitHub (MIT)
   - Automatica: `sync-to-github.yml` estrae `projects/orbit/src/` e apre PR su GitHub
4. **GitHub** pubblica su npmjs.com al tag `v*`
5. **Forgejo** wrappa `@rhaegal222/orbit` con `@wyrmrest/orbit` (lab, studio, service)
6. **CI** Forgejo builda Angular apps → Docker → deploy su `orbit.wyrmrest.it`

## File chiave

| File | Contenuto |
|------|-----------|
| `upstream/main:projects/orbit/package.json` | `@rhaegal222/orbit` v0.1.3, `publishConfig.access: "public"` |
| `upstream/main:package.json` | Workspace root, `build:lib` + `lint` + `test` |
| `upstream/main:README.md` | `npm install @rhaegal222/orbit`, 51 UI primitives |
| `develop:projects/orbit/package.json` | `@wyrmrest/orbit` v0.1.0, wrapper su `@rhaegal222/orbit@^0.1.3` |
| `docs/PUBLISHING.md` | Flusso di pubblicazione |

## Deployment website (Forgejo CI)

```
push to staging/main
  → npm ci + lint + ng build (orbit-lab, orbit-studio, service)
  → tar-pipe in worktree target
  → docker compose up -d --build --force-recreate
  → healthcheck verify (12 × 5s)
```

### Stack runtime

- **Immagine**: `nginxinc/nginx-unprivileged:1.27-alpine` (~52 MB)
- **Contenuto**: SPA Angular (lab + studio) + landing page statica
- **Healthcheck**: `GET /healthz` → `ok`
- **Route**: `orbit.wyrmrest.it` || `orbit.wyrmrest.com`

### Container attivi

| Container | Host | Status |
|-----------|------|--------|
| `wyrmrest-orbit-production-orbit-1` | orbit.wyrmrest.it | production |
| `wyrmrest-orbit-staging-orbit-1` | interno | staging |

## Worktrees

| Ambiente | Path | Scopo |
|----------|------|-------|
| **development** | `Server/development/.../wyrmrest-orbit/` | Sviluppo attivo |
| **staging** | `Server/staging/.../wyrmrest-orbit/` | Pre-produzione |
| **main** | `Server/main/.../wyrmrest-orbit/` | Produzione |

## Git remotes (sviluppo)

```
origin   → https://git.wyrmrest.it/wyrmrest/wyrmrest-orbit.git (Forgejo)
upstream → https://github.com/Rhaegal222/Orbit.git (GitHub pubblico)
```

## Upstream sync (Galileo → Forgejo)

Script `update-orbit.sh` (114 righe):

1. Avvia container SSL-VPN (openfortivpn → Fortinet `217.141.188.34:4443`)
2. Route a `192.168.1.191` via `ppp0`
3. `git fetch` da GitLab con SSL bypass
4. Merge `galileo/develop` → `develop` su Forgejo
5. Pulizia VPN

## npm Publishing

- **GitHub Actions**: su tag `v*` → build → `npm publish --access public` → npmjs.com
- **GitLab CI**: su tag `vX.Y.Z` → pubblica `@galileo/orbit` su GitLab Package Registry
- **Forgejo**: `@wyrmrest/orbit` disponibile su `https://git.wyrmrest.it/api/packages/wyrmrest/npm/`
- **Secrets**: `NPM_TOKEN` (GitHub), `GITHUB_SYNC_TOKEN` (Forgejo) — entrambi da Vault

## Branch strategy

```
develop → (PR) → main
```

- `develop`: CI verifica package (lint + build + test), nessun deploy
- `staging`: auto-deploy on push (Traefik OFF)
- `main`: auto-deploy on push (Traefik ON, pubblico)
