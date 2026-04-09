![Shell Shock's logo banner](https://public.storm-cdn.com/shell-shock/banner-1280x320-dark.gif)

# Changelog for Shell Shock - Core

## [0.17.1](https://github.com/storm-software/shell-shock/releases/tag/core%400.17.1) (04/09/2026)

### Miscellaneous

- **core:** Update generated entry modules to remove duplicated options parsing ([1f40636](https://github.com/storm-software/shell-shock/commit/1f40636))

## [0.17.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.17.0) (04/09/2026)

### Features

- **core:** Added the `exec` built-in and `getTerminalSize` helpers ([1c68646](https://github.com/storm-software/shell-shock/commit/1c68646))

## [0.16.2](https://github.com/storm-software/shell-shock/releases/tag/core%400.16.2) (04/09/2026)

### Bug Fixes

- **core:** Resolve typing issues in `state` built-in module ([4263031](https://github.com/storm-software/shell-shock/commit/4263031))

## [0.16.1](https://github.com/storm-software/shell-shock/releases/tag/core%400.16.1) (04/07/2026)

### Bug Fixes

- **core:** Resolve issue with invalid types in generated built-in module ([828676b](https://github.com/storm-software/shell-shock/commit/828676b))

## [0.16.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.16.0) (04/07/2026)

### Features

- **core:** Added the `state` built-in module ([47bea93](https://github.com/storm-software/shell-shock/commit/47bea93))

## [0.15.2](https://github.com/storm-software/shell-shock/releases/tag/core%400.15.2) (04/03/2026)

### Features

- **plugin-console:** Update `console` built-ins exports for improved tree-shaking ([07c1255](https://github.com/storm-software/shell-shock/commit/07c1255))

## [0.15.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.15.0) (04/01/2026)

### Features

- **core:** Added `resolveModule` function to `utils` built-in ([9c4f7bd](https://github.com/storm-software/shell-shock/commit/9c4f7bd))

## [0.14.4](https://github.com/storm-software/shell-shock/releases/tag/core%400.14.4) (03/28/2026)

### Miscellaneous

- **monorepo:** Regenerate `README.md` files ([06022e1](https://github.com/storm-software/shell-shock/commit/06022e1))

### Features

- **plugin-completions:** Split completions commands into `script` and `config` flavors ([dca09ec](https://github.com/storm-software/shell-shock/commit/dca09ec))

## [0.14.2](https://github.com/storm-software/shell-shock/releases/tag/core%400.14.2) (03/27/2026)

### Miscellaneous

- **monorepo:** Regenerate `README.md` files ([1d6290e](https://github.com/storm-software/shell-shock/commit/1d6290e))
- **monorepo:** Regenerate `README.md` files ([238ae6e](https://github.com/storm-software/shell-shock/commit/238ae6e))
- **core:** Add front-matter data to generated markdown docs ([0f69157](https://github.com/storm-software/shell-shock/commit/0f69157))

## [0.14.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.14.0) (03/27/2026)

### Features

- **core:** Added the `tags` property to commands' metadata ([2e5c4f5](https://github.com/storm-software/shell-shock/commit/2e5c4f5))

## [0.13.14](https://github.com/storm-software/shell-shock/releases/tag/core%400.13.14) (03/27/2026)

### Miscellaneous

- **plugin-theme:** Update theme to be more greyscale ([8baa935](https://github.com/storm-software/shell-shock/commit/8baa935))

## [0.13.13](https://github.com/storm-software/shell-shock/releases/tag/core%400.13.13) (03/27/2026)

### Miscellaneous

- **core:** Resolve issue managing arguments for bytecode modules ([c66254d](https://github.com/storm-software/shell-shock/commit/c66254d))

### Bug Fixes

- **core:** Allow command methods with missing options parameter ([cbd6a90](https://github.com/storm-software/shell-shock/commit/cbd6a90))

## [0.13.12](https://github.com/storm-software/shell-shock/releases/tag/core%400.13.12) (03/27/2026)

### Bug Fixes

- **core:** Ensure `framework` option is correctly applied ([fcaeadd](https://github.com/storm-software/shell-shock/commit/fcaeadd))

## [0.13.11](https://github.com/storm-software/shell-shock/releases/tag/core%400.13.11) (03/27/2026)

### Miscellaneous

- **monorepo:** Regenerate `README.md` files ([96cbd33](https://github.com/storm-software/shell-shock/commit/96cbd33))

## [0.13.9](https://github.com/storm-software/shell-shock/releases/tag/core%400.13.9) (03/26/2026)

### Miscellaneous

- **monorepo:** Resolved workspace linting rule failures ([7acb1f3](https://github.com/storm-software/shell-shock/commit/7acb1f3))

### Bug Fixes

- **core:** Resolve issue bundling commands during prepare ([7d57450](https://github.com/storm-software/shell-shock/commit/7d57450))
- **core:** Resolve issue with literal typed positional arguments ([1b6174f](https://github.com/storm-software/shell-shock/commit/1b6174f))

## [0.13.8](https://github.com/storm-software/shell-shock/releases/tag/core%400.13.8) (03/22/2026)

### Bug Fixes

- **core:** Resolve issue finding commands root directory ([d097bb8](https://github.com/storm-software/shell-shock/commit/d097bb8))

## [0.13.7](https://github.com/storm-software/shell-shock/releases/tag/core%400.13.7) (03/22/2026)

### Bug Fixes

- **core:** Resolve issue with invoking deprecated `typegen` plugin hook ([839995d](https://github.com/storm-software/shell-shock/commit/839995d))

## [0.13.5](https://github.com/storm-software/shell-shock/releases/tag/core%400.13.5) (03/22/2026)

### Miscellaneous

- **core:** Upgrade `powerlines` to v0.42.10 ([a98de9f](https://github.com/storm-software/shell-shock/commit/a98de9f))

## [0.13.4](https://github.com/storm-software/shell-shock/releases/tag/core%400.13.4) (03/22/2026)

### Bug Fixes

- **nx:** List `powerlines` as a peer dependency to allow extra versions ([f54d178](https://github.com/storm-software/shell-shock/commit/f54d178))

## [0.13.3](https://github.com/storm-software/shell-shock/releases/tag/core%400.13.3) (03/21/2026)

### Bug Fixes

- **monorepo:** Resolve typing issues and missing `banner` built-in module ([7104d2b](https://github.com/storm-software/shell-shock/commit/7104d2b))

## [0.13.2](https://github.com/storm-software/shell-shock/releases/tag/core%400.13.2) (03/19/2026)

### Bug Fixes

- **nx:** Upgrade `powerlines` and resolving plugin bundling issue ([fa638c6](https://github.com/storm-software/shell-shock/commit/fa638c6))

### Features

- **plugin-banner:** Added the `banner` build-in generator plugin ([ccf8599](https://github.com/storm-software/shell-shock/commit/ccf8599))

## [0.13.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.13.0) (03/16/2026)

### Features

- **core:** Completed implementation of virtual file generation ([c3e8058](https://github.com/storm-software/shell-shock/commit/c3e8058))

## [0.12.2](https://github.com/storm-software/shell-shock/releases/tag/core%400.12.2) (03/06/2026)

### Miscellaneous

- **core:** Added `CommandValidationLogic` component for reuse in presets ([a1acbaa](https://github.com/storm-software/shell-shock/commit/a1acbaa))

## [0.12.1](https://github.com/storm-software/shell-shock/releases/tag/core%400.12.1) (03/06/2026)

### Miscellaneous

- **core:** Clean up display strings in console output ([9c1b7a9](https://github.com/storm-software/shell-shock/commit/9c1b7a9))

### Features

- **plugin-help:** Added separate `help` plugin to be used in presets ([f36a547](https://github.com/storm-software/shell-shock/commit/f36a547))
- **plugin-help:** Added separate `help` plugin ([8468d07](https://github.com/storm-software/shell-shock/commit/8468d07))

## [0.12.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.12.0) (03/04/2026)

### Bug Fixes

- **core:** Resolved issue assigning options/args `kind` from bytecode data ([e9a7153](https://github.com/storm-software/shell-shock/commit/e9a7153))

### Features

- **core:** Added various helper function to assist in displaying descriptions ([2c2ff0a](https://github.com/storm-software/shell-shock/commit/2c2ff0a))
- **core:** Added `CommandParameterType` helper component ([8391e1b](https://github.com/storm-software/shell-shock/commit/8391e1b))
- **core:** Added the `autoAssignEnv` plugin option to disable assigning envs ([cedb508](https://github.com/storm-software/shell-shock/commit/cedb508))

## [0.11.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.11.0) (03/03/2026)

### Features

- **core:** Added `options` and `args` schema exports ([b37cfd9](https://github.com/storm-software/shell-shock/commit/b37cfd9))

## [0.10.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.10.0) (03/02/2026)

### Features

- **core:** Update packages to align with latest `powerlines` project structure ([ce44312](https://github.com/storm-software/shell-shock/commit/ce44312))

## [0.9.2](https://github.com/storm-software/shell-shock/releases/tag/core%400.9.2) (02/23/2026)

### Features

- **plugin-console:** Added the `spinner` function to built-in module/theme ([e68cce3](https://github.com/storm-software/shell-shock/commit/e68cce3))

## [0.9.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.9.0) (02/21/2026)

### Features

- **core:** Added the `spawn` method to `utils` built-in module ([b87aa6a](https://github.com/storm-software/shell-shock/commit/b87aa6a))

## [0.8.12](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.12) (02/20/2026)

### Source Code Improvements

- **core:** Move the `utils` built-in module to the `core` package ([1d83714](https://github.com/storm-software/shell-shock/commit/1d83714))

## [0.8.11](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.11) (02/19/2026)

### Features

- **plugin-prompts:** Split `prompts` out into separate plugin ([b640c65](https://github.com/storm-software/shell-shock/commit/b640c65))

## [0.8.10](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.10) (02/19/2026)

### Miscellaneous

- **core:** Cleaned up the application title parsing logic ([d75b0f7](https://github.com/storm-software/shell-shock/commit/d75b0f7))

### Bug Fixes

- **core:** Resolve virtual command issue for command files added in plugins ([b1bc783](https://github.com/storm-software/shell-shock/commit/b1bc783))

## [0.8.9](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.9) (02/19/2026)

### Bug Fixes

- **core:** Resolve issue with missing typescript import ([319919f](https://github.com/storm-software/shell-shock/commit/319919f))

## [0.8.8](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.8) (02/18/2026)

### Miscellaneous

- **monorepo:** Reformat workspace source files ([3919976](https://github.com/storm-software/shell-shock/commit/3919976))

## [0.8.7](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.7) (02/18/2026)

### Miscellaneous

- **core:** Update boolean parsing option to include all positive numbers ([f0f9ce1](https://github.com/storm-software/shell-shock/commit/f0f9ce1))

## [0.8.6](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.6) (02/17/2026)

### Bug Fixes

- **preset-cli:** Resolved issue displaying description under prompts ([82d0683](https://github.com/storm-software/shell-shock/commit/82d0683))

## [0.8.5](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.5) (02/16/2026)

### Features

- **preset-cli:** Added the `prompts` built-in module ([95119a6](https://github.com/storm-software/shell-shock/commit/95119a6))

## [0.8.4](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.4) (02/10/2026)

### Miscellaneous

- **monorepo:** Clean up the command's and option's descriptions ([d82a793](https://github.com/storm-software/shell-shock/commit/d82a793))
- **core:** Update processing to better handle duplicate parameter names ([aa3ecef](https://github.com/storm-software/shell-shock/commit/aa3ecef))
- **core:** Add logic to handle duplicate argument names ([caf86be](https://github.com/storm-software/shell-shock/commit/caf86be))

## [0.8.3](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.3) (02/10/2026)

### Features

- **preset-cli:** Prompt user for missing input during execution ([d44c65d](https://github.com/storm-software/shell-shock/commit/d44c65d))

## [0.8.2](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.2) (02/10/2026)

### Miscellaneous

- **monorepo:** Update workspace packages' dependencies ([0648dfd](https://github.com/storm-software/shell-shock/commit/0648dfd))

## [0.8.1](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.1) (02/09/2026)

### Miscellaneous

- **monorepo:** Regenerate README markdown files ([c8a63a7](https://github.com/storm-software/shell-shock/commit/c8a63a7))

## [0.8.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.8.0) (02/09/2026)

### Miscellaneous

- **monorepo:** Added the `CommandContext` to pass to command handler functions ([dbf242c](https://github.com/storm-software/shell-shock/commit/dbf242c))

### Features

- **core:** Significant changes to handle arguments and dynamic paths ([19b8c56](https://github.com/storm-software/shell-shock/commit/19b8c56))
- **core:** Rename the positional parameters to arguments ([d6a969c](https://github.com/storm-software/shell-shock/commit/d6a969c))

## [0.7.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.7.0) (02/08/2026)

### Miscellaneous

- **core:** Added partial logic to postional parameters parsing ([6dec482](https://github.com/storm-software/shell-shock/commit/6dec482))
- **core:** Added `reflection` object to command tree ([4e37f1d](https://github.com/storm-software/shell-shock/commit/4e37f1d))
- **core:** Added comments to the type definitions ([89da76d](https://github.com/storm-software/shell-shock/commit/89da76d))

### Features

- **core:** Added the `icon` field to command metadata ([d60b57e](https://github.com/storm-software/shell-shock/commit/d60b57e))

## [0.6.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.6.0) (02/06/2026)

### Miscellaneous

- **monorepo:** Reformat workspace package files ([5be9940](https://github.com/storm-software/shell-shock/commit/5be9940))

### Features

- **core:** Added command path segment groups ([cf085ea](https://github.com/storm-software/shell-shock/commit/cf085ea))
- **core:** Added dynamic and catch-all command path segments ([cce9030](https://github.com/storm-software/shell-shock/commit/cce9030))

## [0.5.1](https://github.com/storm-software/shell-shock/releases/tag/core%400.5.1) (02/06/2026)

### Features

- **preset-script:** Added help display for individual and virtual commands ([dd63f5e](https://github.com/storm-software/shell-shock/commit/dd63f5e))

## [0.5.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.5.0) (02/06/2026)

### Features

- **core:** Added support for reading `metadata` export from command modules ([19f4ce0](https://github.com/storm-software/shell-shock/commit/19f4ce0))

## [0.4.4](https://github.com/storm-software/shell-shock/releases/tag/core%400.4.4) (02/05/2026)

### Features

- **preset-cli:** Added `banner` runtime function specific to the preset ([4775801](https://github.com/storm-software/shell-shock/commit/4775801))

## [0.4.2](https://github.com/storm-software/shell-shock/releases/tag/core%400.4.2) (02/03/2026)

### Miscellaneous

- **monorepo:** Rerun formatters on package files ([9d1da37](https://github.com/storm-software/shell-shock/commit/9d1da37))

### Features

- **preset-script:** Added `banner` function and resolved issue with message function output ([a5739ea](https://github.com/storm-software/shell-shock/commit/a5739ea))

## [0.4.1](https://github.com/storm-software/shell-shock/releases/tag/core%400.4.1) (02/02/2026)

### Miscellaneous

- **monorepo:** Update markdown `README.md` files ([2ba98db](https://github.com/storm-software/shell-shock/commit/2ba98db))

## [0.4.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.4.0) (02/01/2026)

### Features

- **core:** Added support for `automd` document generation ([a21664c](https://github.com/storm-software/shell-shock/commit/a21664c))

## [0.3.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.3.0) (01/30/2026)

### Miscellaneous

- **core:** Resolve issues writing builtin modules ([dda5285](https://github.com/storm-software/shell-shock/commit/dda5285))

### Bug Fixes

- **core:** Resolve issue with built file output and prepending hashbang to executable ([cd35753](https://github.com/storm-software/shell-shock/commit/cd35753))

### Features

- **core:** Added the `CommandDocs` component ([21a2f30](https://github.com/storm-software/shell-shock/commit/21a2f30))
- **core:** Reorganize repository projects and implemented core ([ffa2d39](https://github.com/storm-software/shell-shock/commit/ffa2d39))
- **core:** Implemented command variable paths and parameters ([0629e12](https://github.com/storm-software/shell-shock/commit/0629e12))

## [0.2.1](https://github.com/storm-software/shell-shock/releases/tag/core%400.2.1) (01/07/2026)

### Miscellaneous

- **monorepo:** Reformat repository source files
  ([f4ad97f](https://github.com/storm-software/shell-shock/commit/f4ad97f))

### Features

- **monorepo:** Updates to repository packages organization
  ([2944ef2](https://github.com/storm-software/shell-shock/commit/2944ef2))

## [0.2.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.2.0) (12/22/2025)

### Features

- **core:** Added command reflection logic and persistence
  ([2e31772](https://github.com/storm-software/shell-shock/commit/2e31772))

## [0.1.0](https://github.com/storm-software/shell-shock/releases/tag/core%400.1.0) (12/21/2025)

### Features

- **core:** Added logic to update `commands` node on powerlines context during
  build
  ([dd5f1b2](https://github.com/storm-software/shell-shock/commit/dd5f1b2))

## [0.0.2](https://github.com/storm-software/shell-shock/releases/tag/core%400.0.2) (12/19/2025)

### Bug Fixes

- **core:** Resolve issue with workspace build order
  ([282fa76](https://github.com/storm-software/shell-shock/commit/282fa76))
