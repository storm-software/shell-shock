# All command files must include a handler function as the default export (`shell-shock/invalid-command-export`)

💼🚫 This rule is enabled in the 🔒 `strict` config. This rule is _disabled_ in
the following configs: 📋 `base`, 🌟 `recommended`.

🔧 This rule is automatically fixable by the
[`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

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
