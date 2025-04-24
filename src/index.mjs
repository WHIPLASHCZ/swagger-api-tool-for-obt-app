import axios from "./tools/axios.mjs";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import fs from "node:fs";

async function test() {
  const res = await axios.get("/v2/api-docs", {
    params: { group: "obtForSms" },
  });
  // console.log(`res:`, res);
  const { data } = res;
  // console.log(`paths`, paths, definitions);
  let schema = await $RefParser.dereference(data);
  const { paths } = schema;
  const arr = convert(paths);
  console.log(arr);
  // console.log(schema.paths);
  // fs.writeFileSync("./test.json", JSON.stringify(schema.paths), {
  //   encoding: "utf-8",
  // });
}

function convert(paths, apis = ["/obt/findCorpSmsConfigList"]) {
  let ret = [];
  for (const api of apis) {
    const info = paths[api];
    // if (!info) continue;
    const paramsTemplate = info.post.parameters[1].schema.properties;

    const params = {};
    for (const key in paramsTemplate) {
      params[key] =
        paramsTemplate[key].type === "array"
          ? []
          : paramsTemplate[key].type === "object"
          ? {}
          : "";
    }
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
    for (const method in info) {
      ret.push({
        method,
        name: info[method].operationId,
        desc: info[method].summary,
        path: api,
        params,
      });
    }
  }

  return ret;
}

test();
