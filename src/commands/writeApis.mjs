import inquirer from "inquirer";
import { oss, ossMap, obt, obtMap } from "../constant/index.mjs";
import { SwaggerConverter } from "../tools/swaggerTools/SwaggerConverter.mjs";
import path from "node:path";
import ora from "ora";

const swaggerConverter = new SwaggerConverter();

async function getAnswers() {
  return await inquirer.prompt([
    {
      type: "select",
      name: "projectType",
      message: "选择项目类型",
      choices: ["obt", "oss"],
    },
    {
      type: "select",
      name: "businessTypeName",
      message: "选择业务类型",
      choices: (answers) => (answers === "oss" ? oss : obt), // 动态生成选项
    },
    {
      type: "select",
      name: "tag",
      message: "选择标签",
      choices: async (answers) => {
        const { businessTypeName, projectType } = answers;
        const businessType =
          projectType === "oss"
            ? ossMap[businessTypeName]
            : obtMap[businessTypeName];
        const spinner = ora("正在获取标签...\n").start();
        try {
          await swaggerConverter.getSchemas(
            businessType,
            projectType === "oss" ? "webFor" : "obtFor"
          );
        } catch(err) {
          console.error("获取标签失败:", err);
        } finally {
          spinner.stop();
        }
        return swaggerConverter.tags.map((item) => item.name);
      },
    },
    {
      type: "checkbox",
      name: "apis",
      message: "选择要使用的接口",
      choices: async (answer) => {
        const { tag } = answer;
        const paths = swaggerConverter.getPathsByTag(tag);
        return paths;
      },
    },
    {
      type: "input",
      name: "targetPath",
      message: "输入目标路径",
    },
  ]);
}

async function writeApis() {
  const answers = await getAnswers();
  const { apis, targetPath } = answers;
  const spinner = ora("正在写入文件...\n").start();
  const fileContent = swaggerConverter.getObtApiFileContentByPathArr(apis);
  await swaggerConverter.writeResultFile(
    path.resolve(process.cwd(), targetPath),
    fileContent
  );
  spinner.stop();
}

export { writeApis };
