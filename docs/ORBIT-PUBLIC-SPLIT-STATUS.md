# Orbit public split — status

Working notes to resume the Galileo/Wyrmrest → public Orbit split with minimal
re-explanation. Written 2026-07-26.

## Goal

Francesco owns the Orbit UI library personally (confirmed with Galileo, not a
company asset). Target end state:

```
        github.com/Rhaegal222/Orbit  (public, MIT, npm-installable)
         |  theme-neutral components + tokens
    +----+----+
galileo-orbit   wyrmrest-orbit   (private forks, branding/business logic only)
```

Wyrmrest and Galileo packages stay on their existing private registries
(GitLab/Forgejo). Only Orbit itself is public.

## What's done

1. **Public repo created**: https://github.com/Rhaegal222/Orbit
   - MIT license, `main` branch protected (PR required, 1 review; admin can
     bypass since Francesco is currently the only maintainer)
   - Contains: `projects/orbit` (the theme-neutral library only — not
     `orbit-lab`/`orbit-studio`/`service`, see "Deliberately not migrated" below)

2. **Audit completed** (Galileo vs Wyrmrest, via a temporary read-only clone
   through the existing SSL-VPN transit gateway — see
   `wyrmrest-sslvpn-transit-gateway/update-orbit.sh` for the credential/VPN
   pattern this reused, but targeting a separate throwaway directory instead
   of merging into `wyrmrest-orbit`):
   - 51/51 components identical between the two forks
   - Only 6 files differed, all either test-correctness fixes or a generic
     (non-branded) sidebar content-projection feature — **zero branding or
     business-logic coupling found** in `projects/orbit` in either fork
   - Found and fixed a stray proprietary `LICENSE` file inside
     `projects/orbit/` in both the Wyrmrest checkout and the extracted public
     copy — leftover from an early, since-abandoned distribution attempt
     (confirmed with Francesco, not a real constraint)

3. **Published `@rhaegal222/orbit`** to GitHub Packages (not npmjs.com yet —
   no npm login available in this environment; GitHub Packages reuses the
   existing GitHub token, scope `write:packages`)
   - v0.1.0: initial extraction
   - v0.1.1: fixes a real bug found during verification — `import * as Prism
     from 'prismjs'` resolves inconsistently depending on module-loader
     interop (native ESM gives `{ default }` only, dropping `Prism.languages`
     and crashing `OrbitCodeBlockComponent`). Fixed by normalizing to the
     default export when present. This bug was latent in the original code
     too; it only surfaced once the library was consumed as an external
     package rather than compiled in-place.

4. **`wyrmrest-orbit` converted into a thin wrapper fork**:
   - `.npmrc`: added `@rhaegal222:registry=https://npm.pkg.github.com` (kept
     the pre-existing `@wyrmrest:registry` line — don't delete it)
   - Added `upstream` git remote → `https://github.com/Rhaegal222/Orbit.git`
   - `projects/orbit/src/lib/**` deleted entirely (all now sourced from the
     npm dependency)
   - `projects/orbit/src/public-api.ts` now just does
     `export * from '@rhaegal222/orbit';`
   - `projects/orbit/package.json`: renamed from stray `@galileo/orbit` to
     `@wyrmrest/orbit` (metadata was never fixed after a past merge), added
     `@rhaegal222/orbit` as a dependency
   - `projects/orbit/ng-package.json`: added `"allowedNonPeerDependencies":
     ["@rhaegal222/orbit"]` (required by ng-packagr for non-peer deps)
   - Root `package.json`: added `@rhaegal222/orbit` dependency
   - Verified: `build:lib`, `build:lab`, `build:studio` all pass; full test
     suite passes with the **same single pre-existing failure** as before any
     of this work (`service/src/app/app.spec.ts` — expects h1 text "Wyrmrest
     Orbit", actual renders "Build with Orbit"; unrelated to this migration,
     not fixed, not investigated further)

## ⚠️ Not yet committed

All `wyrmrest-orbit` changes above are **uncommitted working-tree changes**.
The repo is currently on branch `promote/staging-20260725` (a staging
promotion branch per the develop→staging→main flow in
`docs/HOW-UPDATE-ORBIT.md`), not `develop`. Do not commit/push this on the
promotion branch — check with Francesco which branch this belongs on before
committing, since `staging`/`main` trigger automatic deploys.

Also note the working tree already had other, unrelated uncommitted changes
before this session touched anything (`docs/superpowers/plans/*.md`,
`package-lock.json`, some `orbit-lab` page components, an untracked
`example-switcher/` directory) — those are pre-existing WIP, not part of this
migration; don't discard them.

## Deliberately not migrated to public repo (yet)

- `projects/orbit-lab` — internal component catalog/demo app. Generic,
  no branding found except imports still aliased to `@galileo/orbit` (dead
  alias, never renamed). Could be ported later as public docs/demo.
- `projects/orbit-studio` — theme configurator app. Not audited for branding
  yet.
- `service/` — **has real branding** ("Wyrmrest Orbit" hardcoded in
  `service/src/index.html`, `app.html`, `app.spec.ts`). This is Wyrmrest's own
  demo/landing app, correctly stays fork-only.

## Explicitly deferred / needs a decision

1. **Galileo's GitLab repo is untouched.** The plan was always to convert it
   into a fork too (same pattern as Wyrmrest above), but that requires
   pushing to their shared `develop` branch — do this only via a proper
   branch + PR, and only with a separate explicit go-ahead from Francesco,
   since other people and the CI/CD pipeline depend on that branch.
2. **Proprietary `LICENSE` residue inside Galileo's own checkout** (same file
   found in Wyrmrest, same fix needed) was not touched — no write access
   without the GitLab step above.
3. **npm publish to npmjs.com** (the "real" public registry, installable by
   anyone without a GitHub token) is still pending — blocked on Francesco
   running `npm login` (or providing an automation token via
   `export NPM_TOKEN=...` locally, never pasted in chat). GitHub Packages
   works for now but still requires a GitHub PAT with `read:packages` to
   install, even though the repo is public.
4. **`orbit-lab`/`orbit-studio` migration to the public repo** — optional,
   not blocking.

## Credentials/tooling notes for next session

- A GitHub PAT (`ghp_...`, scopes: `admin:org, repo, workflow,
  write:packages`) was used for repo creation, branch protection, and GitHub
  Packages publish. **It was pasted in chat and should have been revoked and
  rotated** — if picking this up again, get a fresh token, don't reuse.
- `wyrmrest-sslvpn-transit-gateway/.env` already has `GITLAB_USERNAME`,
  `GITLAB_PASSWORD`, `VPN_PASSWORD` configured — reusable for any further
  Galileo-side read/audit work.
- Public package name: `@rhaegal222/orbit` (chosen because `orbit-ui` and
  `orbit-components` were already taken on npm; scoped name avoids any
  collision risk permanently).
