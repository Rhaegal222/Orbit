# Orbit — Linee Guidida Aggiornamento

## Architettura a tre livelli

```
Galileo (gitlab.galileo.test)     ← sviluppo componenti (privato)
        │
        │  update-orbit.sh (VPN)
        ▼
Forgejo (git.wyrmrest.it)        ← wrapper + deploy + lab/studio
        │
        │  cherry-pick libreria
        ▼
GitHub (github.com/Rhaegal222)   ← @rhaegal222/orbit (npm public)
        │
        │  npm publish
        ▼
npm registry                     ← consumato da tutti
```

## Regole fondamentali

1. **Galileo è la sorgente dello sviluppo** — tutti i nuovi componenti e fix vengono creati qui
2. **GitHub è la sorgente della libreria pubblica** — `@rhaegal222/orbit` su npm
3. **Forgejo è il deployment** — wrapper thin + apps (lab, studio, service)

## Aggiornamento da Galileo → Forgejo

```bash
# Esegui lo script (richiede VPN attiva)
bash /home/rhaegal222/Server/development/rhaegal222/wyrmrest/wyrmrest-sslvpn-transit-gateway/update-orbit.sh
```

### In caso di conflitti

Lo script si ferma e mostra le istruzioni. Risolvere manualmente:

```bash
git switch integration/gitlab-develop-YYYYMMDD-HHMMSS
# Risolvi i conflitti (di solito package.json)
git add <file>
git commit -m "merge: import develop from Galileo (resolved)"
git switch develop
git merge --ff-only integration/gitlab-develop-YYYYMMDD-HHMMSS
git push forgejo develop:develop
```

## Aggiornamento da Forgejo/Galileo → GitHub

### Quando pushare su GitHub

- Fix di bug nei componenti della libreria (`projects/orbit/`)
- Nuovi componenti aggiunti a Galileo
- Miglioramenti ai token CSS

### Cosa NON pushare su GitHub

- `deploy/` (Dockerfile, compose, nginx)
- `service/`, `lab/`, `studio/` (applicazioni Angular)
- `.forgejo/` (CI/CD)
- Configurazioni Forgejo-specifiche

### Procedura

```bash
cd /home/rhaegal222/Server/development/rhaegal222/wyrmrest/wyrmrest-orbit

# 1. Crea branch da upstream/main
git checkout -b publish/library-to-github upstream/main

# 2. Cherry-pick i commit rilevanti
git cherry-pick <commit-hash> --no-commit

# 3. Risolvi conflitti se necessario
git checkout --theirs <file>    # prendi versione Galileo
git add <file>

# 4. Commit e push
git commit -m "fix(scope): descrizione"
git remote set-url upstream "https://Rhaegal222:GH_TOKEN@github.com/Rhaegal222/Orbit.git"
git push upstream publish/library-to-github:main
git remote set-url upstream "https://github.com/Rhaegal222/Orbit.git"

# 5. Torna su develop
git checkout develop
git branch -D publish/library-to-github
```

## Pubblicazione npm

### Prerequisiti

```bash
# Login (una tantum)
npm adduser
```

### Procedura

```bash
cd /home/rhaegal222/Server/development/rhaegal222/wyrmrest/wyrmrest-orbit

# 1. Aggiorna versione (patch/minor/major)
sed -i 's/"version": "0.1.X"/"version": "0.1.Y"/' projects/orbit/package.json

# 2. Build
npm run build:lib

# 3. Pubblica
cd dist/orbit-new
npm publish --access public
```

### Naming

| Package | Registry | Access |
|---------|----------|--------|
| `@rhaegal222/orbit` | npmjs.com | public |
| `@galileo/orbit` | GitLab | restricted |
| `@wyrmrest/orbit` | Forgejo | restricted |

## Consumo

### Da npm (pubblico)

```bash
npm install @rhaegal222/orbit
```

```json
// .npmrc
@rhaegal222:registry=https://npm.pkg.github.com
```

### Da Forgejo (privato)

```bash
npm install @wyrmrest/orbit
```

```ini
// .npmrc
@wyrmrest:registry=https://git.wyrmrest.it/api/packages/wyrmrest/npm/
//git.wyrmrest.it/api/packages/wyrmrest/npm/:_authToken=TOKEN
```

### Da GitLab (privato)

```bash
npm install @galileo/orbit
```

```ini
// .npmrc
@galileo:registry=https://gitlab.galileo.test/api/v4/groups/142/-/packages/npm/
```

## Credenziali

| Servizio | Dove | Variabile |
|----------|------|-----------|
| GitLab | `.env` del transit gateway | `GITLAB_USERNAME`, `GITLAB_PASSWORD` |
| VPN | `.env` del transit gateway | `VPN_PASSWORD` |
| npm | `~/.npmrc` | `_authToken` |
| GitHub | `~/.git-credentials` | token personale |
| Forgejo | git remote URL | token repo |
