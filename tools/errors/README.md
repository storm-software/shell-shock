# Shell Shock - Workspace Error Config Tools

A collection of tools for managing error message configuration files used in the
Shell Shock monorepo.

## Quick Features

- `codes.json` groups messages by `general`, `not_found`, `security`, `validation`, `unknown`, `service_unavailable`, and `action_unsupported`.
- Each group maps a numeric string to a message.

## Installation

Private error-message strings for the workspace. Run `pnpm install` from the repository root. This package is private.

## Usage

Read `tools/errors/codes.json` when you need the workspace error text. This package has no runtime export in `package.json`.

## Development

Edit `codes.json`. The package is private and has no test script in its manifest.

