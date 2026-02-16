# All command handler functions must have the correct parameter types (`shell-shock/invalid-handler-params`)

💼🚫 This rule is enabled in the 🔒 `strict` config. This rule is _disabled_ in
the following configs: 📋 `base`, 🌟 `recommended`.

🔧 This rule is automatically fixable by the
[`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

The specific requirements for the command handler parameters include:

- the first parameter must be an object containing the command's options
- all remaining parameters must be positional arguments

👎 Examples of **incorrect** code for this rule:

```ts
export default function handler(isValid: boolean, someValues: Record<string, string>) {
    ...
}
```

👍 Examples of **correct** code for this rule:

```ts
interface CommandOptions {
    ...
}

export default function handler(options: CommandOptions, sourceFiles: string[], destination: string, count?: number) {
    ...
}
```

## Version
