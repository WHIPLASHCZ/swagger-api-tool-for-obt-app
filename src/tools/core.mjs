import axios from "./axios.mjs";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import fs from "node:fs";
import path from "node:path";
import template from "@babel/template";
import { changeCode } from "./babelTools.mjs";
import prettier from "prettier";
class SwaggerConverter {
  constructor() {
    this.tags = [];
    this.paths = {};
    this.definitions = {};
  }
  async getSchemas(group) {
    const res = await axios.get("/v2/api-docs", {
      params: { group: `obtFor${group}` },
    });
    const { data } = res;
    return await this.saveInfo(data);
  }
  async saveInfo(data) {
    // $RefParser用于解析json中的引用
    let schema = await $RefParser.dereference(data);
    const { tags, paths, definitions } = schema;
    this.tags = tags;
    this.paths = paths;
    this.definitions = definitions;
  }

  /**
   *
   * @param {string} tag
   * @returns string[]
   */
  getPathsByTag(tag) {
    let paths = [];
    for (let key in this.paths) {
      const currentPath = this.paths[key];
      // if (currentPath.tags && currentPath.tags.includes(tag)) paths.push(key);
      for (const method in currentPath) {
        const currentApi = currentPath[method];
        if (currentApi.tags && currentApi.tags.includes(tag))
          paths.push(`${key}-${method}`);
      }
    }
    return paths;
  }

  /**
   *
   * @param {string[]} paths
   * @returns string
   */
  getObtApiFileContentByPathArr(paths) {
    let ret = [];
    for (const currentInfo of paths) {
      const [api, method] = currentInfo.split("-");
      const info = this.paths[api];
      if (!info) continue;
      const schema = info[method].parameters[1].schema;
      const paramsTemplate = schema ? schema.properties : {};
      const params = {};
      for (const key in paramsTemplate)
        params[key] =
          paramsTemplate[key].type === "array"
            ? []
            : paramsTemplate[key].type === "object"
              ? {}
              : "";
      /**
       * {
       * 	name: 'travelPolicyDetail',
          method: 'post',
          desc: '酒店差旅政策详情查询',
          path: '/obt/travelPolicyDetail',
          params: {
              cityId: '', // 城市等级代码
            },
          }
       */
      const fragments = api.split("/");
      const name = fragments[fragments.length - 1];
      ret.push({
        method,
        name,
        desc: info[method].summary,
        path: api,
        params,
      });
    }
    return ret;
  }

  /**
   *
   * @param {string} target
   * @param {array} content
   */
  async writeResultFile(target, content) {
    let finalCode = "";
    if (fs.existsSync(target)) {
      finalCode = this.changeCodeOnOriginFileContent(target, content);
    } else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      finalCode = `export default ${JSON.stringify(content, undefined, 4)}`;
    }

    finalCode = await prettier.format(finalCode, {
      filepath: target,
    });

    fs.writeFileSync(target, finalCode, {
      encoding: "utf-8",
    });
  }

  changeCodeOnOriginFileContent(target, params) {
    const sourceCode = fs.readFileSync(target, "utf-8");

    function myPlugin() {
      return {
        visitor: {
          Program(path) {
            // 找到默认导出的那个数组
            const exportDefaultDeclaration = path.node.body.find(
              item => item.type === "ExportDefaultDeclaration"
            );
            const { declaration } = exportDefaultDeclaration;
            const { elements } = declaration;

            // 把要添加的api信息转换为ast
            const ast = template.statement(JSON.stringify(params))();

            // 然后将它们push到默认导出的那个数组里
            elements.push(...ast.expression.elements);
          },
        },
      };
    }

    const code = changeCode(sourceCode, [myPlugin]);
    return code;
  }
}

export { SwaggerConverter };
