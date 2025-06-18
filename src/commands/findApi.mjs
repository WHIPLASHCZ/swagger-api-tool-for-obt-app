import SwaggerApiFinder from '../tools/swaggerTools/SwaggerApiFinder.mjs'
import puppeteer from 'puppeteer';
import path from 'node:path'
import { chromePath } from '../constant/index.mjs'
import { sleep } from '../tools/common.mjs';

const swaggerApiFinder = new SwaggerApiFinder()

const openBrowser = async () => await puppeteer.launch({
    headless: false,
    executablePath: chromePath,
    defaultViewport: {
        width: 0,
        height: 0
    }
});

const findApiDocLocationInPage = async (targetPath, tag, operationId) => {
    const browser = await openBrowser()
    const page = await browser.newPage();
    await page.goto(targetPath);
    await page.waitForSelector('#resources')

    const li = await page.$(`#resource_${tag}`);
    // await li.scrollIntoView()

    const clickPointOfTitle = await li.$('.toggleEndpointList')
    await clickPointOfTitle.click()

    const title = await li.$(`#${tag}_${operationId}`)
    const targetA = await title.$('.toggleOperation')
    if (targetA) {
        await targetA.click()
        await sleep(400);   //等待点击后触发的展开动画播放完毕
        // const boundingBox = await targetA.boundingBox();
        await page.evaluate(el => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, targetA)
    }
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