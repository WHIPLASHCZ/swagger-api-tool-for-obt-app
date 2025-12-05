// import axios from "../axios.mjs";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import fs from "node:fs";
import path from "node:path";
import template from "@babel/template";
import { changeCode } from "../babelTools.mjs";
import prettier from "prettier";
import { getApiDocs } from "../../apis/index.mjs";

function filterUndefinedRefs(definitions) {
  const ret = {};
  for (const key in definitions) {
    const def = definitions[key];
    if ("additionalProperties" in def) {
      const additionalProperties = def["additionalProperties"];
      const $ref = additionalProperties["$ref"];
      const refKey = $ref ? $ref.replace("#/definitions/", "") : null;
      if (refKey && definitions[refKey] === undefined) {
        // 如果引用的定义不存在，则用空对象替代
        ret[refKey] = {
          type: "object",
          properties: {},
        };
      }
    }
    ret[key] = def;
  }
  return ret;
}

class SwaggerConverter {
  constructor() {
    this.tags = [];
    this.paths = {};
    // this.definitions = {};
  }

  async getSchemas(group, prefix = "obtFor") {
    const res = await getApiDocs({ group: `${prefix}${group}` });
    return await this.saveInfo(res);
  }

  async saveInfo(data) {
    // 处理可能报错的引用
    const editedData = {
      ...data,
      definitions: filterUndefinedRefs(data.definitions),
    };
    try {
      let schema = await $RefParser.dereference(editedData, {
        continueOnError: true,
      });
      const { tags, paths } = schema;
      this.tags = tags;
      this.paths = paths;
      // this.definitions = definitions;
    } catch (err) {
      console.error("Error parsing schema:", err);
    }
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
  // getObtApiFileContentByPathArr(paths) {
  //   let ret = [];
  //   for (const currentInfo of paths) {
  //     const [api, method] = currentInfo.split("-");
  //     const info = this.paths[api];
  //     if (!info || !info[method]) continue;
  //     const schema = info[method].parameters[1]
  //       ? info[method].parameters[1].schema
  //       : {};
  //     const paramsTemplate = schema ? schema.properties : {};
  //     const params = {};
  //     for (const key in paramsTemplate) {
  //       console.log(`paramsTemplate[key]`, paramsTemplate[key]);
  //       params[key] =
  //         paramsTemplate[key].type === "array"
  //           ? []
  //           : paramsTemplate[key].type === "object"
  //             ? {}
  //             : "";
  //     }

  //     /**
  //      * {
  //      * 	name: 'travelPolicyDetail',
  //         method: 'post',
  //         desc: '酒店差旅政策详情查询',
  //         path: '/obt/travelPolicyDetail',
  //         params: {
  //             cityId: '', // 城市等级代码
  //           },
  //         }
  //      */
  //     const fragments = api.split("/");
  //     const name = fragments[fragments.length - 1];
  //     ret.push({
  //       method,
  //       name,
  //       desc: info[method].summary,
  //       path: api,
  //       params,
  //     });
  //   }
  //   return ret;
  // }
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
      if (!info || !info[method]) continue;
      const schema = info[method].parameters[1]
        ? info[method].parameters[1].schema
        : {};
      const paramsTemplate = schema ? schema.properties : {};
      let params = `{\n`;
      for (const key in paramsTemplate) {
        const { description, type } = paramsTemplate[key];
        if (type === "array") {
          params += `${key}: [],  // ${description} \n`;
        } else if (type === "object") {
          params += `${key}: {},  // ${description} \n`;
        } else {
          params += `${key}: "",  // ${description} \n`;
        }
      }
      params += "},\n";

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
      ret.push(`{
        method:"${method}",
        name:"${name}",
        desc: "${info[method].summary}",
        path: "${api}",
        params:${params}
      }`);
    }
    return `[
    ${ret.join(",\n")}
    ]`;
  }
  /**
   *
   * @param {string} target
   * @param {string} content
   */
  async writeResultFile(target, content) {
    if (!fs.existsSync(target))
      fs.mkdirSync(path.dirname(target), { recursive: true });
    const fileContent = fs
      .readFileSync(target, "utf-8")
      .replaceAll(" ", "")
      .replaceAll("\n", "")
      .replaceAll("\r", "");
    // let finalCode = fileContent
    //   ? this.changeCodeOnOriginFileContent(target, content)
    //   : `export default ${JSON.stringify(content, undefined, 4)}`;
    let finalCode = fileContent
      ? this.changeCodeOnOriginFileContent(target, content)
      : `export default ${content}`;
    console.log(`finalCode`, finalCode);
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
            let exportDefaultDeclaration = path.node.body.find(
              item => item.type === "ExportDefaultDeclaration"
            );

            const { declaration } = exportDefaultDeclaration;
            const { elements } = declaration;

            // 把要添加的api信息转换为ast
            // const ast = template.statement(JSON.stringify(params))();

            // const ast = template.statement(params, {
            //   preserveComments: true,
            // })();
            // // 然后将它们push到默认导出的那个数组里
            // elements.push(...ast.expression.elements);

            // ✅ 用 template.program 保留多行结构
            const build = template.program(params, {
              preserveComments: true,
              sourceType: "module",
              attachComment: true,
            });

            const ast = build();

            elements.push(...ast.body[0].expression.elements);
          },
        },
      };
    }

    const code = changeCode(sourceCode, [myPlugin], path.basename(target));
    return code;
  }
}

export { SwaggerConverter };
