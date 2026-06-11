# shell-shock/invalid-handler-params

📝 The command handler function must have a valid parameter types.

💼 This rule is enabled in the following configs: 📋 `base`, 🌟 `recommended`.

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

This rule was introduced in version 0.0.83 of `@shell-shock/eslint-plugin`.
