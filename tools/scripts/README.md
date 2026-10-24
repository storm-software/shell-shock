# Shell Shock - Shared Scripts Tools

A collection of tools for managing shared configuration files used in the Shell Shock
monorepo.

This library was generated with [Nx](https://nx.dev).

## Quick Features

- `tools/scripts/src/build.mjs` is the root `pnpm build` script.
- `bootstrap.mjs` runs from `postinstall`.
- Other root scripts call `clean.mjs`, `lint.mjs`, `format.mjs`, `typecheck.mjs`, and `release.mjs`.

## Installation

Private workspace scripts used by the root `package.json` commands. Run `pnpm install` from the repository root. This package is private.

## Usage

Run `pnpm build` from the repository root. That command is `pnpm exec zx tools/scripts/src/build.mjs --prod`.

## Development

Edit the scripts under `tools/scripts/src`. Run them through the root `package.json` scripts.

