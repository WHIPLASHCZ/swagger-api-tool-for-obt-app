import inquirer from "inquirer";
import path from "node:path";
import fs from "node:fs";

export const sleep = timeout => new Promise((r, e) => setTimeout(r, timeout));
export const getProjectPath = () =>
  path.resolve(import.meta.dirname, "../", "../");

export const getOrSetChromePath = async () => {
  const settingJsonPath = path.resolve(getProjectPath(), "./settings.json");
  if (!fs.existsSync(settingJsonPath)) fs.writeFileSync(settingJsonPath, "{}");
  const settingJson = JSON.parse(fs.readFileSync(settingJsonPath, "utf8"));
  if (settingJson.chromePath) return settingJson.chromePath;
  const res = await inquirer.prompt([
    {
      type: "input",
      name: "targetPath",
      message:
        "请输入本电脑中chrome.exe的存储路径（ctrl+v不管用的话，可以右键粘贴）",
    },
  ]);
  const { targetPath } = res;
  settingJson.chromePath = targetPath;
  fs.writeFileSync(settingJsonPath, JSON.stringify(settingJson, undefined, 4));
  return targetPath;
};
