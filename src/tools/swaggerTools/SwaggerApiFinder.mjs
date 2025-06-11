import { getApiDocs } from "../../apis/index.mjs";
import { ossMap, obtMap, SWAGGER_HOST } from "../../constant/index.mjs";

class SwaggerApiFinder {
    constructor() { }

    /**
     * 
     * @param {string} targetPath 
     */
    async findApi(targetPath) {
        if (!targetPath.startsWith('/')) targetPath = '/' + targetPath
        const projectType = targetPath.split('/')[1];
        if (projectType === 'oss') {
            for (let key in ossMap) {
                const group = ossMap[key];
                const data = await getApiDocs({ group: `webFor${group}` });
                const { paths } = data;
                const result = this.findApiInPaths(paths, targetPath, group, key, projectType)
                if (result) return result
            }
        } else if (projectType === 'obt') {
            for (let key in obtMap) {
                const group = obtMap[key];
                const data = await getApiDocs({ group: `obtFor${group}` });
                const { paths } = data;
                const result = this.findApiInPaths(paths, targetPath, group, key, projectType)
                if (result) return result
            }
        } else {
            throw new Error('项目类型必须是OSS或OBT')
        }
        throw new Error('未找到目标接口！')

    }

    /**
     * 
     * @param {Record<string,any>} paths
     * @param {string} targetPath
     */
    findApiInPaths(paths, targetPath, group, groupName, projectType) {
        const prefix = projectType === 'oss' ? 'webFor' : 'obtFor'
        for (const path in paths) {
            if (path === targetPath) {
                const target = paths[path];
                let result = {};
                for (const key in target) {
                    const currentInfo = target[key];
                    result[key] = {
                        projectType,
                        group: groupName,
                        tags: currentInfo.tags,
                        path: `${SWAGGER_HOST}/static/dist/index.html?url=/v2/api-docs?group=${prefix}${group}#!/${currentInfo.summary}/${currentInfo.operationId}`,
                        operationId: currentInfo.operationId
                    }
                }
                return result
            }
        }
    }
}

export default SwaggerApiFinder