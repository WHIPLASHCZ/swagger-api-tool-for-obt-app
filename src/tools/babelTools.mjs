import { transformFromAstSync } from "@babel/core";
import parser from "@babel/parser";
import template from "@babel/template";
import { isObjectExpression } from "@babel/types";

export function changeCode(sourceCode, changeCodePlugins) {
  const ast = parser.parse(sourceCode, {
    sourceType: "module",
  });

  const res = transformFromAstSync(ast, sourceCode, {
    plugins: changeCodePlugins || [],
  });

  return res ? res.code : "";
}
