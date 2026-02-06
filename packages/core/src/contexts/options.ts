/* -------------------------------------------------------------------

                  ⚡ Storm Software - Shell Shock

 This code was released as part of the Shell Shock project. Shell Shock
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/shell-shock.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/shell-shock
 Documentation:            https://docs.stormsoftware.com/projects/shell-shock
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { ComponentContext } from "@alloy-js/core";
import { createNamedContext, useContext } from "@alloy-js/core";
import { ReflectionKind } from "@powerlines/deepkit/vendor/type";
import { camelCase } from "@stryke/string-format/camel-case";
import { isSetString } from "@stryke/type-checks/is-set-string";
import defu from "defu";
import type {
  BooleanCommandOption,
  CommandOption,
  CommandTree
} from "../types";

/**
 * The reflection parameter context used in template rendering.
 */
export const ExistingOptionsContext: ComponentContext<string[]> =
  createNamedContext<string[]>("ExistingOptions", []);

/**
 * Hook to access the ExistingOptions context.
 *
 * @remarks
 * This context provides a list of option names that already exist on the interface definition.
 *
 * @returns A reactive version of the current reflection.
 */
export function useExistingOptions() {
  return useContext<string[]>(ExistingOptionsContext)!;
}

export function computedOptions(command: CommandTree) {
  return Object.entries(command.options).reduce(
    (ret, [name, option]) => {
      ret[camelCase(name)] ??= defu(
        {
          name: camelCase(name)
        },
        ret[name] ?? {},
        option
      ) as CommandOption;

      if (option.kind === ReflectionKind.boolean && option.isNegativeOf) {
        ret[camelCase(option.isNegativeOf)] = defu(
          {
            name: camelCase(option.isNegativeOf)
          },
          ret[option.isNegativeOf] ?? {},
          {
            ...option,
            env: isSetString(option.env) ? `NO_${option.env}` : false,
            description: `${option.description.replace(
              /\.+$/,
              ""
            )}. This property is the negative form of ${name}.`,
            isNegativeOf: camelCase(name),
            default: !option.default
          }
        ) as BooleanCommandOption;
      }

      return ret;
    },
    {} as Record<string, CommandOption>
  );
}
