# Swell SDK

This repository is a monorepo that contains packages meant to improve the speed and development experience of building storefronts with Swell.

## What's inside

This collection includes the following external packages:

- `@swell/js`: A more modular, TypeScript-first rewrite of [swell-js](https://github.com/swellstores/swell-js). [Link.](https://github.com/swellstores/swell-sdk/tree/main/packages/js). [npm](https://www.npmjs.com/package/@swell/js).
- `@swell/react`: Wrapper around `@swell/js` that provides its functionality in the shape of a collection of hooks. [Link.](https://github.com/swellstores/swell-sdk/tree/main/packages/react).[npm](https://www.npmjs.com/package/@swell/react)

And the following internal packages:

- `eslint-config-custom`: Shared `eslint` configurations.
- `tsconfig`: Shared TypeScript configurations.

## Setup

This monorepo makes use of Turborepo, pnpm and Node.js 16+ to synchronize dependencies and pipelines across all packages.

To update dependencies you can simply run

```bash
pnpm i
```

within any place of the file tree and it will update the packages across the monorepo.

### Monorepo Commands

- "build": "Builds the packages that contain a build command, following the order of the dependency tree.",
- "dev": "Starts a development server for all the packages that have one, in parallel.",
- "lint": "Lints the packages in parallel.",
- "test": "Tests the packages in parallel.",
- "format": "Formats all files according to the prettier config.",

Packages also contain their own specific commands apart from the general ones described above.
