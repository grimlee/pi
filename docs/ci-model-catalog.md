# Model catalog CI policy

The Pi model generator intentionally fetches live catalogs from models.dev, OpenRouter, Vercel, and other sources. These feeds change independently of this repository: a model ID can disappear, move API group, or change pricing between two CI runs of the same commit.

## Two separate checks

1. **Live compatibility**: `npm run build` performs strict online model generation and compiles the runtime packages against today's data. `npm run check:model-data` then checks the generated manifest, integrity hashes, and catalog structure. The existing **Publish Model Catalog** workflow separately generates and validates the latest online catalog. New API groups still cause build failures until explicitly supported.
2. **Deterministic regression**: after the live build passes, CI extracts `dist/providers/data` from the published immutable `@earendil-works/pi-ai@0.86.1` npm package. `npm run check:model-data` re-validates the restored manifest; `npm run check` and `npm test` exercise the source and typed model tests against this pinned catalog.

The model fixture is **test-only** and is never used for an actual release build or publishing step. This prevents mutable upstream metadata from silently invalidating carefully authored tests of old behavior. It does **not** suppress TypeScript errors, skip runtime tests, or turn off the security workflow.

## Updating the regression fixture

When deliberately updating tests and supported model defaults, bump the **exact** npm package version in `.github/workflows/ci.yml` in the same PR, run full CI, and review any model ID/API/compatibility changes. Do not use `latest` or an unpinned URL. Keep tests for historical provider payloads on explicit typed test fixtures rather than fabricating models in production catalogs.

The daily `npm audit` workflow remains fully active. New advisories may require future dependency patches.
