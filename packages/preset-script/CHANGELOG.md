![Shell Shock's logo banner](https://public.storm-cdn.com/shell-shock/banner-1280x320-dark.gif)

# Changelog for Shell Shock - Preset Script

## [0.6.8](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.6.8) (02/19/2026)

### Miscellaneous

- **preset-script:** Improve style of error display in `exit` function ([18be86d](https://github.com/storm-software/shell-shock/commit/18be86d))

### Bug Fixes

- **preset-script:** Clean up error display in `exit` function ([50986ac](https://github.com/storm-software/shell-shock/commit/50986ac))
- **preset-script:** Resolve issue displaying stacktrace in messages ([cc99f25](https://github.com/storm-software/shell-shock/commit/cc99f25))

### Updated Dependencies

- Updated **plugin-theme** to **v0.2.0**
- Updated **core** to **v0.8.9**

## [0.6.7](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.6.7) (02/18/2026)

### Miscellaneous

- **monorepo:** Reformat workspace source files ([3919976](https://github.com/storm-software/shell-shock/commit/3919976))

### Updated Dependencies

- Updated **plugin-theme** to **v0.1.3**
- Updated **core** to **v0.8.8**

## [0.6.6](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.6.6) (02/18/2026)

### Updated Dependencies

- Updated **plugin-theme** to **v0.1.2**
- Updated **core** to **v0.8.7**

## [0.6.5](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.6.5) (02/17/2026)

### Bug Fixes

- **preset-cli:** Resolved issue displaying description under prompts ([82d0683](https://github.com/storm-software/shell-shock/commit/82d0683))

### Updated Dependencies

- Updated **plugin-theme** to **v0.1.1**
- Updated **core** to **v0.8.6**

## [0.6.4](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.6.4) (02/16/2026)

### Bug Fixes

- **preset-script:** Resolve issues with `splitText` built-in helper function ([963f91d](https://github.com/storm-software/shell-shock/commit/963f91d))

### Features

- **preset-cli:** Added the `prompts` built-in module ([95119a6](https://github.com/storm-software/shell-shock/commit/95119a6))
- **plugin-theme:** Added `prompt` node to theme configuration and split out preprocessors ([2858208](https://github.com/storm-software/shell-shock/commit/2858208))

### Updated Dependencies

- Updated **plugin-theme** to **v0.1.0**
- Updated **core** to **v0.8.5**

## [0.6.3](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.6.3) (02/10/2026)

### Miscellaneous

- **monorepo:** Update workspace packages' dependencies ([919914b](https://github.com/storm-software/shell-shock/commit/919914b))
- **preset-script:** Reduce `didyouknow2` simularity threashold to 0.25 ([6335719](https://github.com/storm-software/shell-shock/commit/6335719))
- **preset-script:** Clean up newline display after banner ([977372f](https://github.com/storm-software/shell-shock/commit/977372f))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.21**
- Updated **core** to **v0.8.4**

## [0.6.2](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.6.2) (02/10/2026)

### Features

- **preset-cli:** Prompt user for missing input during execution ([d44c65d](https://github.com/storm-software/shell-shock/commit/d44c65d))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.20**
- Updated **core** to **v0.8.3**

## [0.6.1](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.6.1) (02/10/2026)

### Miscellaneous

- **monorepo:** Update workspace packages' dependencies ([0648dfd](https://github.com/storm-software/shell-shock/commit/0648dfd))
- **preset-script:** Added `children` prop to `ConsoleBuiltin` component ([b091a77](https://github.com/storm-software/shell-shock/commit/b091a77))
- **preset-script:** Clean up the command context async hook ([6c68e40](https://github.com/storm-software/shell-shock/commit/6c68e40))
- **preset-script:** Added `CommandValidationLogic` component and remove ansi from valdation ([f34d845](https://github.com/storm-software/shell-shock/commit/f34d845))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.19**
- Updated **core** to **v0.8.2**

## [0.6.0](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.6.0) (02/09/2026)

### Miscellaneous

- **monorepo:** Regenerate README markdown files ([c8a63a7](https://github.com/storm-software/shell-shock/commit/c8a63a7))

### Features

- **preset-script:** Added input validation logic to command entry files ([78edfaf](https://github.com/storm-software/shell-shock/commit/78edfaf))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.18**
- Updated **core** to **v0.8.1**

## [0.5.0](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.5.0) (02/09/2026)

### Miscellaneous

- **monorepo:** Added the `CommandContext` to pass to command handler functions ([dbf242c](https://github.com/storm-software/shell-shock/commit/dbf242c))

### Features

- **core:** Significant changes to handle arguments and dynamic paths ([19b8c56](https://github.com/storm-software/shell-shock/commit/19b8c56))
- **preset-script:** Added the `useSegments` and `usePath` hooks ([26a2c81](https://github.com/storm-software/shell-shock/commit/26a2c81))
- **core:** Rename the positional parameters to arguments ([d6a969c](https://github.com/storm-software/shell-shock/commit/d6a969c))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.17**
- Updated **core** to **v0.8.0**

## [0.4.2](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.4.2) (02/08/2026)

### Miscellaneous

- **core:** Added partial logic to postional parameters parsing ([6dec482](https://github.com/storm-software/shell-shock/commit/6dec482))
- **preset-script:** Added `isUnicodeSupported` check before displaying icon ([80c870c](https://github.com/storm-software/shell-shock/commit/80c870c))

### Features

- **core:** Added the `icon` field to command metadata ([d60b57e](https://github.com/storm-software/shell-shock/commit/d60b57e))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.16**
- Updated **core** to **v0.7.0**

## [0.4.1](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.4.1) (02/06/2026)

### Miscellaneous

- **preset-script:** Added total processsing time logging to `exit` function ([7807c41](https://github.com/storm-software/shell-shock/commit/7807c41))
- **monorepo:** Reformat workspace package files ([5be9940](https://github.com/storm-software/shell-shock/commit/5be9940))

### Features

- **core:** Added dynamic and catch-all command path segments ([cce9030](https://github.com/storm-software/shell-shock/commit/cce9030))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.15**
- Updated **core** to **v0.6.0**

## [0.4.0](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.4.0) (02/06/2026)

### Features

- **preset-script:** Added help display for individual and virtual commands ([dd63f5e](https://github.com/storm-software/shell-shock/commit/dd63f5e))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.14**
- Updated **core** to **v0.5.1**

## [0.3.3](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.3.3) (02/06/2026)

### Features

- **core:** Added support for reading `metadata` export from command modules ([19f4ce0](https://github.com/storm-software/shell-shock/commit/19f4ce0))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.13**
- Updated **core** to **v0.5.0**

## [0.3.2](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.3.2) (02/05/2026)

### Bug Fixes

- **preset-script:** Resolved issue with the `splitText` runtime function's wrapping logic ([1bdd72b](https://github.com/storm-software/shell-shock/commit/1bdd72b))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.12**
- Updated **core** to **v0.4.4**

## [0.3.1](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.3.1) (02/05/2026)

### Bug Fixes

- **preset-script:** Resolve issue with banner header and footer display ([c5be6f4](https://github.com/storm-software/shell-shock/commit/c5be6f4))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.11**
- Updated **core** to **v0.4.3**

## [0.3.0](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.3.0) (02/03/2026)

### Miscellaneous

- **monorepo:** Rerun formatters on package files ([9d1da37](https://github.com/storm-software/shell-shock/commit/9d1da37))

### Features

- **preset-script:** Added `banner` function and resolved issue with message function output ([a5739ea](https://github.com/storm-software/shell-shock/commit/a5739ea))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.10**
- Updated **core** to **v0.4.2**

## [0.2.1](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.2.1) (02/02/2026)

### Miscellaneous

- **preset-script:** Clean up alignment in `table` formatting ([d4a44fb](https://github.com/storm-software/shell-shock/commit/d4a44fb))
- **monorepo:** Update markdown `README.md` files ([2ba98db](https://github.com/storm-software/shell-shock/commit/2ba98db))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.9**
- Updated **core** to **v0.4.1**

## [0.2.0](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.2.0) (02/01/2026)

### Features

- **preset-script:** Added `didyoumean2` to provide suggestions to the user ([f8e31aa](https://github.com/storm-software/shell-shock/commit/f8e31aa))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.8**
- Updated **core** to **v0.4.0**

## [0.1.2](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.1.2) (01/30/2026)

### Miscellaneous

- **core:** Resolve issues writing builtin modules ([dda5285](https://github.com/storm-software/shell-shock/commit/dda5285))

### Bug Fixes

- **core:** Resolve issue with built file output and prepending hashbang to executable ([cd35753](https://github.com/storm-software/shell-shock/commit/cd35753))

### Features

- **core:** Reorganize repository projects and implemented core ([ffa2d39](https://github.com/storm-software/shell-shock/commit/ffa2d39))
- **core:** Implemented command variable paths and parameters ([0629e12](https://github.com/storm-software/shell-shock/commit/0629e12))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.7**
- Updated **core** to **v0.3.0**

## [0.1.1](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.1.1) (01/07/2026)

### Miscellaneous

- **monorepo:** Reformat repository source files
  ([f4ad97f](https://github.com/storm-software/shell-shock/commit/f4ad97f))

### Features

- **monorepo:** Updates to repository packages organization
  ([2944ef2](https://github.com/storm-software/shell-shock/commit/2944ef2))

### Updated Dependencies

- Updated **plugin-theme** to **v0.0.6**
- Updated **core** to **v0.2.1**

## [0.1.0](https://github.com/storm-software/shell-shock/releases/tag/preset-script%400.1.0) (12/22/2025)

### Features

- **core:** Added command reflection logic and persistence
  ([2e31772](https://github.com/storm-software/shell-shock/commit/2e31772))
- **preset-script:** Initial check-in of the `base` plugin
  ([371b5e6](https://github.com/storm-software/shell-shock/commit/371b5e6))

### Updated Dependencies

- Updated **core** to **v0.2.0**
