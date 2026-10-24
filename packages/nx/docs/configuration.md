---
title: Configure the Nx executors
description: Executor names, forwarded options, and the inference plugin.
documentType: reference
tags: [configuration]
---

`executors.json` publishes these executors:

| Executor | Description in the manifest |
| --- | --- |
| `clean` | Run the `clean` Shell Shock command on the project |
| `prepare` | Run the `prepare` Shell Shock command on the project |
| `lint` | Run the `lint` Shell Shock command on the project |
| `build` | Run the `build` Shell Shock command on the project |
| `docs` | Run the `docs` Shell Shock command on the project |

The executor schema extends the Powerlines base executor schema from `@powerlines/nx`. This package does not add required schema fields.

The `build` and `prepare` executors forward `skipCache` and `autoInstall` from the target options into the Powerlines inline config.

Playground prepare and build targets set `mode` to `development`.

## Inference

`createNodesV2` is a `CreateNodes` function. It calls `createNxPlugin` with `framework: "shell-shock"`. The option type is `NxPluginOptions` from `@powerlines/nx`. Register the package in `nx.json` `plugins` when you want Nx to infer targets. This repository keeps targets explicit in playground `project.json` files.
