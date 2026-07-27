# Publishing Wyrmrest Orbit

## Overview

Orbit uses a **triple-distribution** model:

| Package | Registry | Publish method |
|---------|----------|---------------|
| `@rhaegal222/orbit` | npmjs.com | GitHub Actions (automated) |
| `@galileo/orbit` | GitLab | GitLab CI (manual tag) |
| `@wyrmrest/orbit` | Forgejo | npm bump workflow (weekly) |

## Public publishing (`@rhaegal222/orbit`)

### Automated via GitHub Actions

Pushing a tag that matches `v*` triggers the publish workflow:

```bash
# 1. Bump version in projects/orbit/package.json (on GitHub main)
# 2. Commit
git commit -m "chore(release): v0.1.4"
# 3. Create and push tag
git tag v0.1.4
git push upstream v0.1.4
```

The workflow will:
1. Build the library (`npm run build:lib`)
2. Verify package contents (`npm pack --dry-run`)
3. Publish to npmjs.com (`npm publish --access public`)

### Prerequisites

- `NPM_TOKEN` configured in GitHub repo secrets (sourced from Vault)
- Library source on `upstream/main` must be up to date

### Versioning

Use semantic versioning:
- **patch**: fixes without public API changes
- **minor**: backwards-compatible components, tokens or features
- **major**: removed or changed public APIs, token names or required peer dependencies

Before tagging:
1. Update `projects/orbit/package.json` version
2. Update `CHANGELOG.md` with new version entry
3. Verify: `npm run lint && npm run build:lib && npm test`

## Internal publishing (`@wyrmrest/orbit`)

The Forgejo wrapper (`@wyrmrest/orbit`) is bumped automatically:

- **npm-bump.yml**: weekly cron checks npmjs.com for latest `@rhaegal222/orbit`
- Opens a Forgejo MR to bump the dependency in `projects/orbit/package.json`
- Merge the MR to update the wrapper

Only bump the wrapper version when:
- Metadata, assets, or peer dependency range changes
- Not for every patch release of `@rhaegal222/orbit`

## Consumer authentication

### npmjs.com (public)

```bash
npm install @rhaegal222/orbit
```

No authentication needed for install. Publishing requires `NPM_TOKEN`.

### Forgejo (private)

```ini
# .npmrc
@wyrmrest:registry=https://git.wyrmrest.it/api/packages/wyrmrest/npm/
```

`_authToken` must be supplied through the consuming project's secret store or CI variables, never committed.

### GitLab (private)

```ini
# .npmrc
@galileo:registry=https://gitlab.galileo.test/api/v4/groups/142/-/packages/npm/
```

## Angular components

When Angular components are introduced, build them with `ng-packagr` in partial-Ivy mode and list Angular packages in `peerDependencies`. Publish Angular adapters as explicit entry points rather than bundling optional dependencies into the token package.
