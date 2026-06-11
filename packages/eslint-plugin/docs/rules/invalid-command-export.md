# shell-shock/invalid-command-export

📝 A command module must have a handler function as it's default export.

💼 This rule is enabled in the following configs: 📋 `base`, 🌟 `recommended`.

<!-- end auto-generated rule header -->

## Rule Details

👎 Examples of **incorrect** code for this rule:

```ts
export default const value = 1;
```

👍 Examples of **correct** code for this rule:

```ts
export default function handler(options) {
    ...
}
```

## Version

This rule was introduced in version 0.0.83 of `@shell-shock/eslint-plugin`.
