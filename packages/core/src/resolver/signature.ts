/* -------------------------------------------------------------------

                  🗲 Storm Software - Shell Shock

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

import { isSetString } from "@stryke/type-checks/is-set-string";
import { readFile } from "node:fs/promises";
import * as ts from "typescript";

export interface CommandParameterSignature {
  name: string;
  optional: boolean;
  rest: boolean;
  typeText: string;
  typeName?: string;
  description?: string;
  defaultValue?: unknown;
  tags: Record<string, string | string[]>;
}

export interface CommandSignature {
  /**
   * The description of the command.
   */
  description?: string;

  /**
   * The parameters of the command.
   */
  parameters: CommandParameterSignature[];

  /**
   * JSDoc / declaration tags keyed by property name for a named options type.
   */
  typeMemberTags: Record<string, Record<string, string | string[]>>;
}

function getJSDocCommentText(
  comment: string | ts.NodeArray<ts.JSDocComment> | undefined
): string | undefined {
  if (!comment) {
    return undefined;
  }

  if (typeof comment === "string") {
    return comment.trim() || undefined;
  }

  const text = comment
    .map(part => ("text" in part ? part.text : ""))
    .join("")
    .trim();

  return text || undefined;
}

function getJSDocTags(node: ts.Node): Record<string, string | string[]> {
  const tags: Record<string, string | string[]> = {};

  for (const tag of ts.getJSDocTags(node)) {
    const name = tag.tagName.text;
    const value = getJSDocCommentText(tag.comment) ?? "";

    const existing = tags[name];
    if (existing === undefined) {
      tags[name] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      tags[name] = [existing, value];
    }
  }

  return tags;
}

function getNodeDescription(node: ts.Node): string | undefined {
  const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc);
  for (const doc of docs) {
    const text = getJSDocCommentText(doc.comment);
    if (text) {
      return text;
    }
  }

  return undefined;
}

function parseDefaultExpression(node: ts.Expression | undefined): unknown {
  if (!node) {
    return undefined;
  }

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }

  if (
    ts.isPrefixUnaryExpression(node) &&
    node.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(node.operand)
  ) {
    return -Number(node.operand.text);
  }

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements
      .map(element =>
        ts.isSpreadElement(element)
          ? undefined
          : parseDefaultExpression(element)
      )
      .filter(value => value !== undefined);
  }

  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) {
    return parseDefaultExpression(node.expression);
  }

  if (ts.isParenthesizedExpression(node)) {
    return parseDefaultExpression(node.expression);
  }

  return undefined;
}

function findFunctionByName(
  sourceFile: ts.SourceFile,
  name: string
):
  | ts.FunctionDeclaration
  | ts.ArrowFunction
  | ts.FunctionExpression
  | undefined {
  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name?.text === name) {
      return statement;
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name) &&
          declaration.name.text === name &&
          declaration.initializer &&
          (ts.isArrowFunction(declaration.initializer) ||
            ts.isFunctionExpression(declaration.initializer))
        ) {
          return declaration.initializer;
        }
      }
    }
  }

  return undefined;
}

function getDefaultExportFunction(
  sourceFile: ts.SourceFile
):
  | ts.FunctionDeclaration
  | ts.ArrowFunction
  | ts.FunctionExpression
  | undefined {
  for (const statement of sourceFile.statements) {
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.modifiers?.some(
        modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword
      )
    ) {
      return statement;
    }

    if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
      if (ts.isIdentifier(statement.expression)) {
        return findFunctionByName(sourceFile, statement.expression.text);
      }

      if (
        ts.isFunctionExpression(statement.expression) ||
        ts.isArrowFunction(statement.expression)
      ) {
        return statement.expression;
      }
    }
  }

  return undefined;
}

function getParamName(parameter: ts.ParameterDeclaration): string {
  if (ts.isIdentifier(parameter.name)) {
    return parameter.name.text;
  }

  return parameter.name.getText();
}

function collectTypeMemberTags(
  sourceFile: ts.SourceFile,
  typeName: string
): Record<string, Record<string, string | string[]>> {
  const result: Record<string, Record<string, string | string[]>> = {};

  for (const statement of sourceFile.statements) {
    if (
      ts.isInterfaceDeclaration(statement) &&
      statement.name.text === typeName
    ) {
      for (const member of statement.members) {
        if (
          ts.isPropertySignature(member) &&
          member.name &&
          ts.isIdentifier(member.name)
        ) {
          result[member.name.text] = getJSDocTags(member);
        }
      }
    }

    if (
      ts.isTypeAliasDeclaration(statement) &&
      statement.name.text === typeName &&
      ts.isTypeLiteralNode(statement.type)
    ) {
      for (const member of statement.type.members) {
        if (
          ts.isPropertySignature(member) &&
          member.name &&
          ts.isIdentifier(member.name)
        ) {
          result[member.name.text] = getJSDocTags(member);
        }
      }
    }
  }

  return result;
}

function getParamDescriptions(functionNode: ts.Node): Record<string, string> {
  const descriptions: Record<string, string> = {};

  for (const tag of ts.getJSDocTags(functionNode)) {
    if (
      tag.tagName.text === "param" &&
      ts.isJSDocParameterTag(tag) &&
      tag.name &&
      ts.isIdentifier(tag.name)
    ) {
      const text = getJSDocCommentText(tag.comment);
      if (text) {
        descriptions[tag.name.text] = text;
      }
    }
  }

  return descriptions;
}

/**
 * Parses the default-export command handler signature from a TypeScript source file.
 *
 * @param filePath - Absolute or relative path to the command entry file.
 * @returns The parsed command signature, or `undefined` when no default export function is found.
 */
export async function parseCommandSignature(
  filePath: string,
  sourceText?: string
): Promise<CommandSignature | undefined> {
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText ?? (await readFile(filePath, "utf8")),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  const functionNode = getDefaultExportFunction(sourceFile);
  if (!functionNode) {
    return undefined;
  }

  const paramDescriptions = getParamDescriptions(functionNode);
  const parameters: CommandParameterSignature[] = functionNode.parameters.map(
    parameter => {
      const name = getParamName(parameter);
      const typeNode = parameter.type;
      const typeName =
        typeNode && ts.isTypeReferenceNode(typeNode)
          ? typeNode.typeName.getText(sourceFile)
          : undefined;
      const tags = getJSDocTags(parameter);
      const description =
        getNodeDescription(parameter) ||
        paramDescriptions[name] ||
        (isSetString(tags.description) ? tags.description : undefined);

      return {
        name,
        optional: Boolean(parameter.questionToken ?? parameter.initializer),
        rest: Boolean(parameter.dotDotDotToken),
        typeText: typeNode?.getText(sourceFile) ?? "unknown",
        typeName,
        description,
        defaultValue: parseDefaultExpression(parameter.initializer),
        tags
      };
    }
  );

  const firstNamedType = parameters.find(
    parameter => parameter.typeName
  )?.typeName;

  return {
    description: getNodeDescription(functionNode),
    parameters,
    typeMemberTags: firstNamedType
      ? collectTypeMemberTags(sourceFile, firstNamedType)
      : {}
  };
}
