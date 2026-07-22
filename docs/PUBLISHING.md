# Publishing Wyrmrest Orbit

## Versioning

Use semantic versioning and release only from a protected `vX.Y.Z` tag.

- patch: fixes without public API changes;
- minor: backwards-compatible components, tokens or features;
- major: removed or changed public APIs, token names or required peer dependencies.

Before tagging, update `package.json` and `CHANGELOG.md`, then run:

```bash
npm run release:check
```

## CI publication

Pushing a tag that matches `vX.Y.Z` starts the `publish-package` job. It publishes to the Wyrmrest npm registry using the workflow token; no registry secret is stored in this repository.

For example:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Consumer authentication

Consumers configure the scoped group registry in `.npmrc`:

```ini
@wyrmrest:registry=https://git.wyrmrest.it/api/packages/wyrmrest/npm/
//git.wyrmrest.it/api/packages/wyrmrest/npm/:_authToken=
```

`NPM_TOKEN` must be supplied through the consuming project’s secret store or CI variables, never committed.

## Angular components

When Angular components are introduced, build them with `ng-packagr` in partial-Ivy mode and list Angular packages in `peerDependencies`. Publish Angular adapters as explicit entry points rather than bundling optional dependencies into the token package.
