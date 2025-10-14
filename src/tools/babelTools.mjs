import { transformFromAstSync } from "@babel/core";
import parser from "@babel/parser";
import template from "@babel/template";
import { isObjectExpression } from "@babel/types";

export function changeCode(sourceCode, changeCodePlugins, filename) {
  // 将代码转换为ast
  const ast = parser.parse(sourceCode, {
    sourceType: "module",
  });

  // 将ast转换回代码，并且通过插件对ast进行修改 以达到对代码的精确修改
  const res = transformFromAstSync(ast, sourceCode, {
    plugins: changeCodePlugins || [],
    filename,
  });

  return res ? res.code : "";
}
