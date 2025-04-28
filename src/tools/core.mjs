import axios from "./axios.mjs";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import fs from "node:fs";
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
      ret.push({
        method,
        name: info[method].operationId,
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
  writeResultFile(target, content) {
    fs.writeFileSync(
      target,
      `export default ${JSON.stringify(content, undefined, 4)}`,
      {
        encoding: "utf-8",
      }
    );
  }
}

export { SwaggerConverter };
