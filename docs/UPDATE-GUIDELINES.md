# Orbit — Linee Guida Aggiornamento

## Architettura a tre livelli

```
Galileo (gitlab.galileo.test)     ← sviluppo componenti (privato)
        │
        │  update-orbit.sh (VPN)
        ▼
Forgejo (git.wyrmrest.it)        ← wrapper + deploy + lab/studio
        │
        │  sync-to-github.yml (auto)
        ▼
GitHub (github.com/Rhaegal222)   ← @rhaegal222/orbit (npm public)
        │
        │  publish.yml (tag v*)
        ▼
npmjs.com                        ← consumato da tutti
```

## Regole fondamentali

1. **Galileo è la sorgente dello sviluppo** — tutti i nuovi componenti e fix vengono creati qui
2. **GitHub è la sorgente della libreria pubblica** — `@rhaegal222/orbit` su npmjs.com
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

### Automatico (consigliato)

Il workflow `sync-to-github.yml` estrae automaticamente `projects/orbit/src/` e apre una PR su GitHub quando viene pushato su develop con modifiche alla libreria.

### Manuale (quando necessario)

```bash
cd /home/rhaegal222/Server/development/rhaegal222/wyrmrest/wyrmrest-orbit

# 1. Crea branch da upstream/main
git checkout -b publish/library-to-github upstream/main

# 2. Cherry-pick i commit rilevanti
git cherry-pick <commit-hash> --no-commit

# 3. Risolvi conflitti se necessario
git checkout --theirs <file>
git add <file>

# 4. Commit e push
git commit -m "fix(scope): descrizione"
git push upstream publish/library-to-github:main

# 5. Torna su develop
git checkout develop
git branch -D publish/library-to-github
```

### Cosa NON pushare su GitHub

- `deploy/` (Dockerfile, compose, nginx)
- `service/`, `projects/orbit-lab/`, `projects/orbit-studio/` (applicazioni Angular)
- `.forgejo/` (CI/CD)
- Configurazioni Forgejo-specifiche

## Pubblicazione npm

### Pubblica (`@rhaegal222/orbit`)

La pubblicazione è automatizzata tramite GitHub Actions:

```bash
# Crea tag v* su upstream/main → triggera publish.yml
git tag v0.1.4
git push upstream v0.1.4
```

### Aggiorna wrapper (`@wyrmrest/orbit`)

Il workflow `npm-bump.yml` controlla settimanalmente la versione su npmjs.com e apre un MR automatico. In alternativa:

```bash
# Aggiorna manualmente
sed -i 's/"@rhaegal222\/orbit": "\^0\.1\.3"/"@rhaegal222\/orbit": "^0.1.4"/' \
  projects/orbit/package.json
git add projects/orbit/package.json
git commit -m "chore: bump @rhaegal222/orbit to ^0.1.4"
git push origin develop
```

## Naming

| Package | Registry | Access |
|---------|----------|--------|
| `@rhaegal222/orbit` | npmjs.com | public |
| `@galileo/orbit` | GitLab | restricted |
| `@wyrmrest/orbit` | Forgejo | restricted |

## Consumo

### Da npmjs.com (pubblico)

```bash
npm install @rhaegal222/orbit
```

Nessuna autenticazione necessaria per l'installazione.

### Da Forgejo (privato)

```bash
npm install @wyrmrest/orbit
```

```ini
# .npmrc
@wyrmrest:registry=https://git.wyrmrest.it/api/packages/wyrmrest/npm/
```

### Da GitLab (privato)

```bash
npm install @galileo/orbit
```

```ini
# .npmrc
@galileo:registry=https://gitlab.galileo.test/api/v4/groups/142/-/packages/npm/
```

## Credenziali

Tutte le credenziali sono in Vault. Nessuna deve essere committata.

| Servizio | Vault path | Uso |
|----------|-----------|-----|
| npm | `wyrmrest/access/npm` | `NPM_TOKEN` per publish GitHub Actions |
| GitHub | `wyrmrest/access/github` | `GITHUB_SYNC_TOKEN` per sync Forgejo → GitHub |
| Forgejo | `wyrmrest/services/production/wyrmrest-git` | Token Forgejo per CI |
| GitLab | `wyrmrest/access/gitlab` | Credenziali GitLab per update-orbit.sh |
