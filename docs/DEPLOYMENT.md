# Orbit — Distribuzione e Deploy

## Tripla distribuzione

```
Galileo (gitlab.galileo.test)          ← upstream privato (VPN)
    │  @galileo/orbit v0.3.0 UNLICENSED
    │  update-orbit.sh
    ▼
Forgejo (git.wyrmrest.it)              ← mirror + deploy website
    │  @galileo/orbit → wrapper su @rhaegal222/orbit
    │  CI: .forgejo/workflows/deploy.yml
    ├─► staging (orbit.wyrmrest.it, Traefik OFF)
    └─► production (orbit.wyrmrest.it, Traefik ON)

GitHub (github.com/Rhaegal222/Orbit)   ← pubblico, MIT
    │  @rhaegal222/orbit v0.1.1
    │  "la parte condivisa" — 51 UI primitives + tokens
    │  4 commit, manual publish
    ▼
npm registry (pubblico)
    npm install @rhaegal222/orbit
```

## I tre package

| Package | Registry | Versione | Licenza | Contenuto |
|---------|----------|----------|---------|-----------|
| `@galileo/orbit` | GitLab (privato) | 0.3.0 | UNLICENSED | Libreria interna Galileo |
| `@rhaegal222/orbit` | npm (pubblico) | 0.1.1 | MIT | 51 UI primitives + tokens (theme-neutral) |
| `@galileo/orbit` | Forgejo (privato) | 0.3.0 | UNLICENSED | Wrapper che dipende da `@rhaegal222/orbit` |

## GitHub repo (`github.com/Rhaegal222/Orbit`)

| Commit | Data | Descrizione |
|--------|------|-------------|
| `b9afaf3` | 2026-07-25 | Initial commit (LICENSE MIT + .gitignore) |
| `3be0d10` | 2026-07-25 | README scaffold |
| `c191b5c` | 2026-07-25 | Extract theme-neutral orbit library (304 file, 18k LOC) |
| `3068ccb` | 2026-07-26 | Fix Prism CJS/ESM interop crash in code-block (v0.1.1) |

## Flusso di sincretismo

1. **Galileo** sviluppa `@galileo/orbit` (fork privata, componenti + branding Galileo)
2. **Estrazione** della libreria theme-neutral → `@rhaegal222/orbit` su GitHub (MIT)
3. **Forgejo** wrappa `@rhaegal222/orbit` con i componenti specifici Galileo (lab, studio, landing page)
4. **CI** Forgejo builda Angular apps → Docker → deploy su `orbit.wyrmrest.it`

## File chiave

| File | Contenuto |
|------|-----------|
| `upstream/main:projects/orbit/package.json` | `@rhaegal222/orbit` v0.1.1, `publishConfig.access: "public"` |
| `upstream/main:package.json` | Workspace root, `build:lib` + `test` + `release:check` |
| `upstream/main:README.md` | `npm install @rhaegal222/orbit`, 51 UI primitives |
| `develop:projects/orbit/package.json` | `@galileo/orbit` v0.3.0, wrapper |
| `docs/PUBLISHING.md` | Istruzioni per `npm publish` via tag `vX.Y.Z` |

## Deployment website (Forgejo CI)

```
push to staging/main
  → npm ci + ng build (orbit-lab, orbit-studio, service)
  → tar-pipe in worktree target
  → docker compose up -d --build --force-recreate
  → healthcheck verify (12 × 5s)
```

### Stack runtime

- **Immagine**: `nginxinc/nginx-unprivileged:1.27-alpine` (~52 MB)
- **Contenuto**: SPA Angular (lab + studio) + landing page statica
- **Healthcheck**: `GET /healthz` → `ok`
- **Route**: `orbit.wyrmrest.it` || `orbit.wyrmrest.com`
- **Nessun digest @sha256** — immagini referenziate solo per tag

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

- **GitLab CI**: su tag `vX.Y.Z` → pubblica `@galileo/orbit` su GitLab Package Registry
- **GitHub**: publish manuale → `@rhaegal222/orbit` su npm pubblico
- **Forgejo**: `@galileo/orbit` disponibile su `https://git.wyrmrest.it/api/packages/wyrmrest/npm/`

## Branch strategy

```
develop → (PR) → staging → (PR) → main
```

- `develop`: CI verifica package, nessun deploy
- `staging`: auto-deploy on push (Traefik OFF)
- `main`: auto-deploy on push (Traefik ON, pubblico)
