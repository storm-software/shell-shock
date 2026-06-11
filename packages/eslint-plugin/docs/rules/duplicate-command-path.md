# shell-shock/duplicate-command-path

📝 Multiple command files found in the same directory. This can lead to unexpected behavior. Please ensure that there is only one command file per directory.

⚠️ This rule _warns_ in the following configs: 📋 `base`, 🌟 `recommended`.

<!-- end auto-generated rule header -->

## Rule Details

👎 Examples of **incorrect** code for this rule:

```ts
// file at commands/admin/command.ts
// file at commands/admin/(task)/command.ts
```

👍 Examples of **correct** code for this rule:

```ts
// file at commands/admin/create/command.ts
// file at commands/admin/(task)/command.ts
```

## Version

This rule was introduced in version 0.0.83 of `@shell-shock/eslint-plugin`.
