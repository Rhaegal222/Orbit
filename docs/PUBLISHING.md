# Publishing Galileo Orbit

## Versioning

Use semantic versioning and release only from a protected `vX.Y.Z` tag.

- patch: fixes without public API changes;
- minor: backwards-compatible components, tokens or features;
- major: removed or changed public APIs, token names or required peer dependencies.

Before tagging, update `package.json` and `CHANGELOG.md`, then run:

```bash
npm run check
```

`npm run release:check` builds the package, checks its packed contents and installs
the freshly generated tarball into `consumer-fixture` before building that consumer.
This catches missing exports and stylesheet assets that a workspace build cannot detect.

## CI publication

Pushing a tag that matches `vX.Y.Z` starts the `publish-package` job. It publishes to the project-level GitLab npm registry using `CI_JOB_TOKEN`; no registry secret is stored in this repository.

For example:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Consumer authentication

Consumers configure the scoped group registry in `.npmrc`:

```ini
@galileo:registry=https://gitlab.galileo.test/api/v4/groups/142/-/packages/npm/
//gitlab.galileo.test/api/v4/groups/142/-/packages/npm/:_authToken=${NPM_TOKEN}
```

`NPM_TOKEN` must be supplied through the consuming project’s secret store or CI variables, never committed.

## Angular components

Angular components are built with `ng-packagr` in partial-Ivy mode and Angular packages remain peer dependencies. Consumers provide Angular 22-compatible `@angular/core`, `@angular/common` and `@angular/cdk`. Keep the public API simple: JavaScript and Angular symbols come from `@galileo/orbit`; styles come from the optional `@galileo/orbit/styles` import.
