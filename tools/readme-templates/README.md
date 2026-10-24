# README templates

Private templates for generated Shell Shock README headers and footers.

## Quick Features

- `README.header.md` is the shared README header.
- `README.footer.md` is the shared README footer.
- Package READMEs mark the copies with `<!-- START header -->` and `<!-- START footer -->`.

## Installation

This package is private. Run `pnpm install` from the repository root. There is no runtime install for consumers.

## Usage

The header and footer files are copied into package READMEs by the repository's README tooling. Leave the marked header and footer regions in those READMEs for the generator.

## Development

Edit `README.header.md` or `README.footer.md` in this directory. Regenerate package README banners with the repository README task when you want the copies updated. This pass does not rewrite those generated regions.
