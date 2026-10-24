<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://public.storm-cdn.com/shell-shock/media/banner-1280x427-dark.gif">
  <source media="(prefers-color-scheme: light)" srcset="https://public.storm-cdn.com/shell-shock/media/banner-1280x427-light.gif">
<img src="https://public.storm-cdn.com/shell-shock/media/banner-1280x427-dark.gif" width="100%" alt="Storm Software" />
</picture>
</div>
<br />

<div align="center">
<b>
<a href="https://stormsoftware.com" target="_blank">Website</a>  •
<a href="https://github.com/storm-software/shell-shock" target="_blank">GitHub</a>  •
<a href="https://discord.gg/MQ6YVzakM5">Discord</a>  •  <a href="https://stormstack.github.io/stormstack/" target="_blank">Docs</a>  •  <a href="https://stormsoftware.com/contact" target="_blank">Contact</a>  •
<a href="https://github.com/storm-software/stack/issues/new?assignees=&labels=bug&template=bug-report.yml&title=Bug Report%3A+">Report a Bug</a>
</b>
</div>
<br />

**Shell Shock** is a framework that uses NextJs's style of file based routing and applies it to command-line applications. When combined with it's extremely customizable theme and template component system, it allows for the rapid development of fully-featured command-line interfaces.

<h3 align="center">💻 Visit <a href="https://stormsoftware.com" target="_blank">stormsoftware.com</a> to stay up to date with this developer</h3>
<br />

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge&logo=commitlint&color=1fb2a6)](http://commitizen.github.io/cz-cli/)&nbsp;![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge&color=1fb2a6)&nbsp;![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/storm-software/earthquake/release.yml?style=for-the-badge&logo=github-actions&color=1fb2a6)

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

> [!IMPORTANT] 
> This repository, and the apps, libraries, and tools contained within, is still in it's initial development phase. As a result, bugs and issues are expected with it's usage. When the main development phase completes, a proper release will be performed, the packages will be available through NPM (and other distributions), and this message will be removed. However, in the meantime, please feel free to report any issues you may come across.

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<div align="center">
<a href="https://github.com/storm-software/shell-shock" target="_blank">
<b>Be sure to ⭐ this repository on GitHub so you can keep up to date on any daily progress!</b>
</a>
</div>

<!-- START doctoc -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Quick Features](#quick-features)
  - [Visual Studio Code Extension](#visual-studio-code-extension)
  - [Environment Configuration Help](#environment-configuration-help)
- [Getting Started](#getting-started)
  - [Build](#build)
  - [Development Server](#development-server)
- [Environment Configuration Help](#environment-configuration-help-1)
  - [Plug-Ins](#plug-ins)
  - [Generate an Application](#generate-an-application)
  - [Generate a Library](#generate-a-library)
  - [Code Scaffolding](#code-scaffolding)
- [Testing](#testing)
  - [Running Unit Tests](#running-unit-tests)
  - [Running End-to-End Tests](#running-end-to-end-tests)
  - [Understand your workspace](#understand-your-workspace)
- [☁ Nx Cloud](#-nx-cloud)
  - [Distributed Computation Caching \& Distributed Task Execution](#distributed-computation-caching--distributed-task-execution)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)
- [Contributors ✨](#contributors-)

<!-- END doctoc -->

<br />

# Quick Features

This section contains a quick overview of the features and functionality of the repository.

- Command files under `src` become CLI commands. `@shell-shock/core` is the build core.
- `@shell-shock/preset-cli` and `@shell-shock/preset-script` register the common plugins.
- `@shell-shock/nx` runs clean, prepare, lint, build, and docs targets.
- `@shell-shock/eslint-plugin` lints command files.

## Visual Studio Code Extension

This repository does not publish a Visual Studio Code extension. `.vscode/settings.json` associates the `acidic` language with `.acid` and `.acidic` files. That association is editor configuration in this workspace.

## Environment Configuration Help

If you run into any issues while trying to run any of the above steps, please
reach out to Patrick Sullivan. See the [Support](#support) section for more
information.

# Getting Started

Once the code is pulled locally, open a command prompt and run `pnpm install` in
the root repo directory (/shell-shock).

The notice at the top of this file says a public package registry release is still pending. Inside this workspace, packages use the `workspace:*` protocol.

# Usage

Create `shell-shock.config.ts` and a command file. This is the same shape as `playground/minimal` and `playground/cli/src/start/command.ts`.

```ts
import { defineConfig } from "@shell-shock/core/config";

export default defineConfig({
  name: "my-app"
});
```

```ts
function start() {
  console.log("start");
}

export default start;
```

Put the handler in `src/start/command.ts`. Build a playground with `pnpm exec nx build playground-cli`. Package pages under `packages/*/docs` describe each library.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Build

Run `pnpm build` to build the workspace. That script runs `tools/scripts/src/build.mjs --prod`. Run `pnpm build-dev` for the script with `--dev`.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Development Server

Run `pnpm start` to execute `nx serve`. The root `package.json` does not define a web server on port 4200. Playground applications are command-line projects. Build one with `pnpm exec nx build <project>`.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# Environment Configuration Help

If you run into any issues while trying to run any of the above steps, please
reach out to Patrick Sullivan. See the [Support](#support) section for more
information.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Plug-Ins

Nx packages in the root `package.json` include `@nx/js`, `@nx/jest`, `@nx/eslint`, `@nx/plugin`, and `@nx/workspace`. Shell Shock libraries live under `packages/`. The CLI presets are `@shell-shock/preset-cli` and `@shell-shock/preset-script`.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Generate an Application

This repository does not register `@storm-software/workspace:app`. Add a command file under a playground, or copy `playground/minimal`. `shell-shock.config.ts` in that directory sets `name` to `playground-minimal`.

The workspace holds the playground applications and the libraries under `packages/`.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Generate a Library

This repository does not register `@storm-software/workspace:lib`. Libraries in this workspace are the packages under `packages/`. Their import names use the `@shell-shock` scope, for example `@shell-shock/core`.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Code Scaffolding

Add a command by creating `command.ts` in a folder under the commands root. `src/start/command.ts` is the `start` command. This repository does not register `@nx/react:component`.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# Testing

Package tests use [Jest](https://jestjs.io/). Run `pnpm exec nx test <project>`. The root `e2e` script is `nx e2e`.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Running Unit Tests

Run `pnpm exec nx test <project>` to execute the unit tests via [Jest](https://jestjs.io). The root `package.json` has no `test` script.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Running End-to-End Tests

Run `pnpm e2e` to execute `nx e2e`.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Understand your workspace

Run `pnpm graph` to see a diagram of the dependencies of the Open System
projects.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# ☁ Nx Cloud

Nx caches the output of any previously run command such as testing and building,
so it can replay the cached results instead of rerunning it. Nx Cloud allows you
to share the computation cache across everyone in your team and CI.

<div align="center">
<img src="https://pub-4661138852db4e5da99a6660fbf9b633.r2.dev/Nx Cloud - Dashboard.png" width="100%" alt="Nx Cloud - Dashboard" />
</div>

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

## Distributed Computation Caching & Distributed Task Execution

Nx Cloud pairs with Nx in order to enable you to build and test code more
rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx
Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their
preferred framework alongside Nx’s advanced code generation and project
dependency graph, plus a unified experience for both frontend and backend
developers.

Visit [Nx Cloud](https://nx.app/) to learn more.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# Roadmap

See the [open issues](https://github.com/storm-software/shell-shock/issues) for a
list of proposed features (and known issues).

- [Top Feature Requests](https://github.com/storm-software/shell-shock/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc)
  (Add your votes using the 👍 reaction)
- [Top Bugs](https://github.com/storm-software/shell-shock/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc)
  (Add your votes using the 👍 reaction)
- [Newest Bugs](https://github.com/storm-software/shell-shock/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# Contributing

First off, thanks for taking the time to contribute! Contributions are what
makes the open-source community such an amazing place to learn, inspire, and
create. Any contributions you make will benefit everybody else and are **greatly
appreciated**.

Please try to create bug reports that are:

- _Reproducible._ Include steps to reproduce the problem.
- _Specific._ Include as much detail as possible: which version, what
  environment, etc.
- _Unique._ Do not duplicate existing opened issues.
- _Scoped to a Single Bug._ One bug per report.

Please adhere to this project's [code of conduct](.github/CODE_OF_CONDUCT.md).

From a checkout, run `pnpm install`. Run `pnpm build` to build the workspace. Run `pnpm lint` to lint. Run `pnpm exec nx test <project>` for a package test. Package names match `project.json`, such as `core` and `plugin-mcp`.

You can use
[markdownlint-cli](https://github.com/storm-software/shell-shock/markdownlint-cli) to
check for common markdown style inconsistency.

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# Support

Reach out to the maintainer at one of the following places:

- [Contact](https://stormsoftware.com/contact)
- [GitHub discussions](https://github.com/storm-software/shell-shock/discussions)
- <contact@stormsoftware.com>

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# License

This project is licensed under the **Apache License 2.0**. Feel free to edit and
distribute this template as you like. If you have any specific questions, please
reach out to the Storm Software development team.

See [LICENSE](LICENSE) for more information.

<br />

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fstorm-software%2Fshell-shock.svg?type=large&issueType=license)](https://app.fossa.io/projects/git%2Bgithub.com%2Fstorm-software%2Fshell-shock?ref=badge_large&issueType=license)

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

# Contributors ✨

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.sullypat.com/"><img src="https://avatars.githubusercontent.com/u/99053093?v=4?s=100" width="100px;" alt="Patrick Sullivan"/><br /><sub><b>Patrick Sullivan</b></sub></a><br /><a href="#design-sullivanpj" title="Design">🎨</a> <a href="https://github.com/storm-software/shell-shock/commits?author=sullivanpj" title="Code">💻</a> <a href="#tool-sullivanpj" title="Tools">🔧</a> <a href="https://github.com/storm-software/shell-shock/commits?author=sullivanpj" title="Documentation">📖</a> <a href="https://github.com/storm-software/shell-shock/commits?author=sullivanpj" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://tylerbenning.com/"><img src="https://avatars.githubusercontent.com/u/7265547?v=4?s=100" width="100px;" alt="Tyler Benning"/><br /><sub><b>Tyler Benning</b></sub></a><br /><a href="#design-tbenning" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://stormsoftware.com"><img src="https://avatars.githubusercontent.com/u/149802440?v=4?s=100" width="100px;" alt="Stormie"/><br /><sub><b>Stormie</b></sub></a><br /><a href="#maintenance-stormie-bot" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />

<hr />
<br />

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://public.storm-cdn.com/storm-software/media/banner-1280x320-dark.webp">
  <source media="(prefers-color-scheme: light)" srcset="https://public.storm-cdn.com/storm-software/media/banner-1280x320-light.webp">
<img src="https://public.storm-cdn.com/storm-software/media/banner-1280x320-dark.webp" width="100%" alt="Storm Software" />
</picture>
</div>
<br />

<div align="center">
<a href="https://stormsoftware.com" target="_blank">Website</a>  •  <a href="https://stormsoftware.com/contact" target="_blank">Contact</a>  •  <a href="https://linkedin.com/in/patrick-sullivan-865526b0" target="_blank">LinkedIn</a>  •  <a href="https://medium.com/@pat.joseph.sullivan" target="_blank">Medium</a>  •  <a href="https://github.com/storm-software" target="_blank">GitHub</a>  •  <a href="https://keybase.io/sullivanp" target="_blank">OpenPGP Key</a>
</div>

<div align="center">
<b>Fingerprint:</b> F47F 1853 BCAD DE9B 42C8  6316 9FDE EC95 47FE D106
</div>
<br />

Storm Software is an open source software development organization and creator
of Acidic, StormStack and StormCloud.

Our mission is to make software development more accessible. Our ideal future is
one where anyone can create software without years of prior development
experience serving as a barrier to entry. We hope to achieve this via LLMs,
Generative AI, and intuitive, high-level data modeling/programming languages.

Join us on [Discord](https://discord.gg/MQ6YVzakM5) to chat with the team,
receive release notifications, ask questions, and get involved.

If this sounds interesting, and you would like to help us in creating the next
generation of development tools, please reach out on our
[website](https://stormsoftware.com/contact) or join our
[Slack](https://join.slack.com/t/storm-software/shared_invite/zt-2gsmk04hs-i6yhK_r6urq0dkZYAwq2pA)
channel!

<br />

<div align="center">
<a href="https://stormsoftware.com" target="_blank">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://public.storm-cdn.com/storm-software/icons/circle-dark.webp">
  <source media="(prefers-color-scheme: light)" srcset="https://public.storm-cdn.com/storm-software/icons/circle-light.webp">
<img src="https://public.storm-cdn.com/storm-software/icons/circle-dark.webp" width="200px" alt="Storm Software" />
</picture>
</a>
</div>
<br />

<div align="center"><a href="https://stormsoftware.com" target="_blank"><picture><source media="(prefers-color-scheme: dark)" srcset="https://public.storm-cdn.com/misc/text/visit-us-dark.png"><source media="(prefers-color-scheme: light)" srcset="https://public.storm-cdn.com/misc/text/visit-us-light.png"><img src="https://public.storm-cdn.com/misc/text/visit-us-dark.png" height="90px" alt="Visit us at stormsoftware.com" /></picture></a></div>

<br />

<div align="right">[ <a href="#table-of-contents">Back to top ▲</a> ]</div>
<br />
<br />
