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

5. **Galileo's GitLab repo converted the same way**, on a feature branch (not
   pushed to `develop` directly):
   - Branch `feature/orbit-public-split` pushed to
     `gitlab.galileo.test/galileo/orbit`, MR not yet opened — GitLab gave the
     creation link on push:
     `https://gitlab.galileo.test/galileo/orbit/-/merge_requests/new?merge_request%5Bsource_branch%5D=feature%2Forbit-public-split`
   - Same conversion as Wyrmrest: `projects/orbit/src/lib` removed,
     `public-api.ts` re-exports from `@rhaegal222/orbit`, `.npmrc` and
     `ng-package.json` updated the same way
   - Kept `@galileo/orbit` as the package name (that one was already correct,
     unlike Wyrmrest's stray naming) — only added `@rhaegal222/orbit` as a
     dependency, nothing else touched
   - Did **not** touch Galileo's `projects/orbit/LICENSE` (its "Copyright
     Galileo, proprietary" content is correct there — only Wyrmrest's copy had
     the wrong owner)
   - Verified: 208/208 tests passing (orbit + orbit-lab, no pre-existing
     failures here unlike Wyrmrest's `service` app), `orbit-lab` and
     `orbit-studio` builds both pass
   - **MR opened and merged into Galileo's `develop`** (MR !1, GitLab
     project 105). Two rounds of CI failures fixed before merge, both
     genuinely caused by this change (unlike Wyrmrest's pre-existing deploy
     issue below):
     - `format:check` failed on an unrelated file
       (`examples-page.component.html`) that was already unformatted on
       `develop` before this MR — fixed as a trivial whitespace-only commit
       in the same MR (confirmed pre-existing by running prettier against
       the pre-MR `develop` tip directly)
     - `test:core` (`ng test orbit`) hard-failed with "No tests found" once
       `projects/orbit/src/lib` (and its specs) moved upstream — removed
       that script step from `release:check`; also needed a `.npmrc` in
       `consumer-fixture/` (the release-check's Angular consumer smoke test)
       so it can resolve `@rhaegal222/orbit` too when installing the packed
       tarball
   - Galileo does not have a `staging`/`main` promotion pipeline — this only
     needed to land on `develop`, no further promotion step there

## `wyrmrest-orbit` commit status

Committed and pushed to `develop` (not `promote/staging-20260725`, which is
where the working tree originally had these changes as uncommitted edits
mixed in with unrelated pre-existing WIP — moved to a clean `develop`
checkout via a git worktree instead; that branch's own unrelated WIP
(`docs/superpowers/plans/*.md`, some `orbit-lab` page components, an
untracked `example-switcher/` directory) was left untouched).

**`develop` → `staging` promoted and merged** (PR #15, then two follow-up
fix PRs #16 and #17 — see below). `staging` deploy is green and the
container is healthy. `staging` → `main` has **not** been done — same
mechanics apply, but `main` is public-facing (Traefik enabled), so do that
promotion as its own explicit step, not bundled silently into other work.

### CI/deploy issues found and fixed along the way

Three real, unrelated-to-each-other problems surfaced only once actual CI
pipelines ran (not caught by local build/test alone):

1. **GitHub Packages needs auth even for public repos.** `npm ci` in both
   GitLab (Galileo) and Forgejo (Wyrmrest) CI failed with 401 pulling
   `@rhaegal222/orbit`, since GitHub Packages always requires a token to
   install regardless of repo visibility. Fixed by creating a fine-scoped-as-
   possible GitHub PAT (classic, since this GitHub account's fine-grained
   tokens don't expose a Packages permission — a known gap) and wiring it in
   as a `GH_TOKEN` CI/CD variable/secret in both GitLab (project variable,
   masked) and Forgejo (Actions secret) — **but a secret alone isn't enough**:
   Forgejo/GitHub Actions don't auto-inject secrets into a step's process
   environment, they must be mapped via `env: GH_TOKEN: ${{ secrets.GH_TOKEN }}`
   on the step that needs it. `.forgejo/workflows/deploy.yml`'s "Install
   dependencies" step needed this added explicitly.
2. **`projects/orbit`'s own unit-test target broke** once `src/lib` (and all
   its `.spec.ts` files) moved to the public package — the Angular unit-test
   builder hard-errors on zero matched tests with no opt-out flag. Fixed by
   removing Galileo's `test:core` script step and Wyrmrest's `orbit` test
   architect target from `angular.json` (component tests now run in the
   public repo's own CI instead).
3. **Wyrmrest's deploy pipeline was already broken, unrelated to any of
   this** — commit `9dabfdd` ("chore: remove legacy deploy/ and dist_old/")
   deleted the *entire* `deploy/` directory, conflating genuinely legacy
   static content (`deploy/site/*`, unreferenced anywhere) with the
   `Dockerfile`/`docker-compose.yml`/`nginx.conf` that `deploy.yml` still
   depends on to build and serve `orbit-lab`/`orbit-studio`/`service`. Every
   staging/main deploy had been silently failing since that commit (confirmed
   via `forgejo-runner` container logs on this host — the runner is
   self-hosted locally, so `docker logs forgejo-runner` is the fastest way to
   see real job output when the Forgejo API's job/log endpoints 404). Also
   `.gitignore` blanket-ignored `deploy/`, so the restored infra files
   wouldn't even show up in `git status` until narrowed to
   `deploy/* + !deploy/Dockerfile` etc., ignoring only the CI-copied build
   artifacts. Restored the 4 infra files from git history (pre-9dabfdd) and
   verified end-to-end with a real local `docker build` + `docker run`,
   confirming `/healthz`, `/`, `/lab/`, `/studio/` all return 200 before
   pushing.

Also fixed one genuinely pre-existing test bug while in the area (separate
from all of the above, at the user's request): `service/app.spec.ts` asserted
stale copy ("Wyrmrest Orbit") that a prior landing-page redesign commit had
changed to "Build with Orbit" — updated the assertion. Full suite is now
100% green (was previously masked by grep filtering during verification and
incorrectly reported as "no regressions" earlier in this work — corrected).

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

1. **`staging` → `main` promotion for Wyrmrest** — not done. Same PR mechanics
   as `develop` → `staging`, but `main` is public (Traefik enabled), so treat
   as its own explicit step rather than assuming it's covered by "promote to
   staging/main".
2. **npm publish to npmjs.com** (the "real" public registry, installable by
   anyone without a GitHub token) is still pending — blocked on Francesco
   running `npm login` (or providing an automation token via
   `export NPM_TOKEN=...` locally, never pasted in chat). GitHub Packages
   works for now but still requires a GitHub PAT with `read:packages` to
   install, even though the repo is public. Would also remove the need for
   the `GH_TOKEN` CI secrets in both GitLab and Forgejo.
3. **`orbit-lab`/`orbit-studio` migration to the public repo** — optional,
   not blocking.

## Credentials/tooling notes for next session

- Multiple GitHub PATs were pasted in chat over the course of this work
  (repo-creation token, a broad classic token used temporarily to unblock CI,
  and a fine-grained attempt that turned out not to have Packages access at
  all — GitHub fine-grained tokens don't expose a Packages permission on this
  account, a known gap; classic tokens with a packages scope are the only
  working option here). **All of them should be revoked and rotated** if not
  already done. The one currently live as `GH_TOKEN` in GitLab project 105's
  CI/CD variables and in Forgejo's Actions secrets for wyrmrest-orbit is a
  **broad classic token** (`admin:org, repo, workflow, write:packages`), not
  a minimal one — narrowing it later means generating a proper
  `read:packages`-only classic token and swapping it into both places (GitLab
  project variable + Forgejo repo secret), or better, finishing the npmjs.com
  public publish so no token is needed there at all.
- `wyrmrest-sslvpn-transit-gateway/.env` already has `GITLAB_USERNAME`,
  `GITLAB_PASSWORD`, `VPN_PASSWORD` configured — reusable for any further
  Galileo-side read/audit work. GitLab API access uses OAuth2 password grant
  (`POST /oauth/token`) against those same credentials over the VPN, not a
  separate PAT.
- Forgejo API access uses the credential already stored in
  `~/.git-credentials` for `git.wyrmrest.it` (basic auth) — no VPN needed,
  Forgejo is reachable directly.
- The `forgejo-runner` Docker container runs locally on this host — when a
  Forgejo Actions job fails and the API's job/log endpoints 404 (they did,
  repeatedly, during this work), `docker logs forgejo-runner` is the fastest
  way to see real output.
- Public package name: `@rhaegal222/orbit` (chosen because `orbit-ui` and
  `orbit-components` were already taken on npm; scoped name avoids any
  collision risk permanently).
