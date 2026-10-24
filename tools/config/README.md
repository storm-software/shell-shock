# Shell Shock - Shared Config Tools

A collection of tools for managing shared configuration files used in the Shell Shock monorepo.

This library was generated with [Nx](https://nx.dev).

## Quick Features

- `powerlines.shared.ts` exports shared Powerlines config.
- `tsdown.shared.ts` exports shared tsdown config.
- The Nx build target echoes a skip message.

## Installation

Private shared Powerlines and tsdown config for this workspace. Run `pnpm install` from the repository root. This package is private.

## Usage

Import the shared files from a package config in this repo. The project name is `tools-config`.

## Development

Run `pnpm exec nx build tools-config`. The target is `nx:run-commands` and prints a skip message.

