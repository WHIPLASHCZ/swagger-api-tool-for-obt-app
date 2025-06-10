#!/usr/bin/env node
import { Command } from "commander";
import { writeApis } from "./commands/writeApis.mjs";
import { findApi } from './commands/findApi.mjs'
const program = new Command();

program
  .name('obt-api-swagger-tool')
  .description('老项目的swagger工具')
  .version('1.0.0');

program.command('write-api')
  .description('将api按照惯例格式写入app项目')
  .action(() => writeApis())

program.command('find-api')
  .description('查找指定api所在位置')
  .argument('<targetPath>', 'target Path')
  .action(async (targetPath) => {
    const res = await findApi(targetPath)
    console.log(res)
  })


program.parse(process.argv);
