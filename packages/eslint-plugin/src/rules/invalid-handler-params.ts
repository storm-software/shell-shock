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

import { findFileName } from "@stryke/path/file-path-fns";
import type { TSESTree } from "@typescript-eslint/utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";
import { createRule } from "../helpers/create-rule";

export const RULE_NAME = "invalid-handler-params";
export type MessageIds = "invalidOptionsParam" | "invalidArgsParam";
export type Options = [];

function getTypeNode(param: TSESTree.Parameter): TSESTree.TypeNode | null {
  switch (param.type) {
    case AST_NODE_TYPES.Identifier:
      return param.typeAnnotation ? param.typeAnnotation.typeAnnotation : null;

    case AST_NODE_TYPES.AssignmentPattern: {
      const left = param.left;
      if (left.type === AST_NODE_TYPES.Identifier && left.typeAnnotation) {
        return left.typeAnnotation.typeAnnotation;
      }
      return null;
    }

    case AST_NODE_TYPES.RestElement: {
      const arg = param.argument;
      if (arg.type === AST_NODE_TYPES.Identifier && arg.typeAnnotation) {
        return arg.typeAnnotation.typeAnnotation;
      }
      return null;
    }

    case AST_NODE_TYPES.ArrayPattern:
    case AST_NODE_TYPES.ObjectPattern:
    case AST_NODE_TYPES.TSParameterProperty:
    default:
      return null;
  }
}

/**
 * Checks the validity of the command handler function's options parameters.
 *
 * @remarks
 * The first parameter should represent the command's potential options, and as a result, it must be an object type with properties.
 *
 * @param body - The body of the program, used to check for type/interface declarations when validating the options parameter.
 * @param node - The function node representing the command handler, used to access its parameters and validate their types.
 * @param context - The ESLint rule context, used to report any validation errors found in the parameters.
 */
function checkOptionsParam(
  body: TSESTree.ProgramStatement[],
  node: TSESTree.FunctionDeclaration | TSESTree.ArrowFunctionExpression,
  context: Readonly<RuleContext<"invalidOptionsParam", []>>
) {
  if (node.params.length > 0 && node.params[0]) {
    const type = getTypeNode(node.params[0]);
    if (!type) {
      context.report({
        node: node.params[0],
        messageId: "invalidOptionsParam"
      });
    }

    if (
      type!.type === AST_NODE_TYPES.TSTypeLiteral &&
      type.members.some(
        member => member.type === AST_NODE_TYPES.TSPropertySignature
      )
    ) {
      return;
    } else if (
      type!.type === AST_NODE_TYPES.TSIntersectionType &&
      type.types.some(
        type =>
          type.type === AST_NODE_TYPES.TSTypeLiteral &&
          type.members.some(
            member => member.type === AST_NODE_TYPES.TSPropertySignature
          )
      )
    ) {
      return;
    } else if (
      type!.type === AST_NODE_TYPES.TSTypeReference &&
      type.typeName.type === AST_NODE_TYPES.Identifier
    ) {
      const typeName = type.typeName.name;
      if (
        !body.some(
          localBlock =>
            (localBlock.type === AST_NODE_TYPES.TSInterfaceDeclaration &&
              localBlock.id.name === typeName) ||
            (localBlock.type === AST_NODE_TYPES.TSTypeAliasDeclaration &&
              localBlock.id.name === typeName &&
              ((localBlock.typeAnnotation.type ===
                AST_NODE_TYPES.TSTypeLiteral &&
                localBlock.typeAnnotation.members.some(
                  member => member.type === AST_NODE_TYPES.TSPropertySignature
                )) ||
                (localBlock.typeAnnotation.type ===
                  AST_NODE_TYPES.TSIntersectionType &&
                  localBlock.typeAnnotation.types.some(
                    type =>
                      type.type === AST_NODE_TYPES.TSTypeLiteral &&
                      type.members.some(
                        member =>
                          member.type === AST_NODE_TYPES.TSPropertySignature
                      )
                  ))))
        )
      ) {
        return;
      }
    }

    context.report({
      node: type!,
      messageId: "invalidOptionsParam"
    });
  }
}

/**
 * Checks the validity of the command handler function's positional argument parameters.
 *
 * @remarks
 * All parameters except the first should represent the command's positional arguments, and as a result, their types must be included in the following list:
 * - string
 * - number
 * - boolean
 * - string[]
 * - number[]
 *
 * @param body - The body of the program, used to check for type/interface declarations when validating the args parameters.
 * @param node - The function node representing the command handler, used to access its parameters and validate their types.
 * @param context - The ESLint rule context, used to report any validation errors found in the parameters.
 */
function checkArgsParam(
  body: TSESTree.ProgramStatement[],
  node: TSESTree.FunctionDeclaration | TSESTree.ArrowFunctionExpression,
  context: Readonly<RuleContext<"invalidArgsParam", []>>
) {
  if (node.params.length > 1) {
    node.params.slice(1).forEach(param => {
      const type = getTypeNode(param);
      if (
        type?.type !== AST_NODE_TYPES.TSStringKeyword &&
        type?.type !== AST_NODE_TYPES.TSNumberKeyword &&
        type?.type !== AST_NODE_TYPES.TSBooleanKeyword &&
        !(
          type?.type === AST_NODE_TYPES.TSArrayType &&
          (type.elementType.type === AST_NODE_TYPES.TSStringKeyword ||
            type.elementType.type === AST_NODE_TYPES.TSNumberKeyword)
        )
      ) {
        context.report({
          node: type!,
          messageId: "invalidArgsParam"
        });
      }
    });
  }
}

export default createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "The command handler function must have a valid parameter types."
    },
    schema: [],
    messages: {
      invalidOptionsParam:
        "The command handler function's first parameter should represent the command's potential options. As a result, it must be an object type with properties.",
      invalidArgsParam:
        "All command handler function parameters except the first should represent the command's positional arguments. As a result, their types must be included in the following list: \\n- string \\n- number \\n- boolean \\n- string[] \\n- number[]"
    }
  },
  defaultOptions: [],
  create: context => {
    return {
      Program(node) {
        const fileName = context.filename ?? context.getFilename();
        if (
          findFileName(fileName, {
            withExtension: false
          }) !== "command"
        ) {
          return;
        }

        for (const block of node.body) {
          if (block.type === "ExportDefaultDeclaration") {
            // export default async function handler() {...}
            if (block.declaration?.type === "FunctionDeclaration") {
              if (block.declaration.params.length > 0) {
                checkOptionsParam(node.body, block.declaration, context);
                checkArgsParam(node.body, block.declaration, context);
              }
            } else if (block.declaration?.type === "Identifier") {
              // async function handler() {...}; export default handler;
              const targetName = block.declaration.name;
              const functionDeclaration = node.body.find(
                localBlock =>
                  (localBlock.type === "FunctionDeclaration" &&
                    localBlock.id.name === targetName) ||
                  (localBlock.type === "VariableDeclaration" &&
                    localBlock.declarations.find(
                      declaration =>
                        declaration.id?.type === "Identifier" &&
                        declaration.id.name === targetName
                    ))
              );
              if (functionDeclaration?.type === "FunctionDeclaration") {
                checkOptionsParam(node.body, functionDeclaration, context);
                checkArgsParam(node.body, functionDeclaration, context);
              } else if (functionDeclaration?.type === "VariableDeclaration") {
                const varDeclarator = functionDeclaration.declarations.find(
                  declaration =>
                    declaration.id?.type === "Identifier" &&
                    declaration.id.name === targetName
                );
                if (varDeclarator?.init?.type === "ArrowFunctionExpression") {
                  checkOptionsParam(node.body, varDeclarator.init, context);
                  checkArgsParam(node.body, varDeclarator.init, context);
                }
              }
            }
          }
        }
      }
    };
  }
});
