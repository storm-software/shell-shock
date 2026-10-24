---
title: Nx executor troubleshooting
description: Install the Nx peer and use an explicit executor when inference is off.
documentType: recipe
tags: [troubleshooting]
---

## Nx cannot resolve the executor

Install `nx` at version `22.7.0` or later. Install `@shell-shock/nx` in the application project. Set `executor` to `@shell-shock/nx:build` or another name from `executors.json`.

## Targets are missing

This workspace does not list `@shell-shock/nx` in `nx.json` plugins. Add the targets in `project.json`, or register the plugin for `createNodesV2`.

## Prepare output is missing

The playground prepare target declares output `{projectRoot}/.shell-shock`. Run `prepare` before you look for generated files. The playground build target depends on `^build`.
