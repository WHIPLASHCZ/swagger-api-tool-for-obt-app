import SwaggerApiFinder from '../tools/swaggerTools/SwaggerApiFinder.mjs'
import puppeteer from 'puppeteer';
import path from 'node:path'
import { chromePath } from '../constant/index.mjs'

const swaggerApiFinder = new SwaggerApiFinder()


/**
 *
 * @param {*} version 版本号
 * @returns chromium的可执行路径
 */
const openBrowser = async () => await puppeteer.launch({
    headless: false,
    // executablePath: executablePath()
    executablePath: chromePath
});

const findApiDocLocationInPage = async (targetPath, tag, operationId) => {
    const browser = await openBrowser()
    const page = await browser.newPage();
    await page.goto(targetPath);
    await page.waitForSelector('#resources')

    const li = await page.$(`#resource_${tag}`);
    await li.scrollIntoView()

    const clickPointOfTitle = await li.$('.toggleEndpointList')
    await clickPointOfTitle.click()

    const title = await li.$(`#${tag}_${operationId}`)
    const targetA = await title.$('.toggleOperation')
    targetA && targetA.click()
}


async function findApi(targetPath) {
    const res = await swaggerApiFinder.findApi(targetPath);
    for (const method in res) {
        const current = res[method];
        const { path, tags, operationId } = current;
        const tag = tags[0]
        await findApiDocLocationInPage(path, tag, operationId);
        break;
    }
    return res
}

export { findApi }