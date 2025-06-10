import axios from "../tools/axios.mjs";

const getApiDocs = async (params) => {
    const { data } = await axios.get("/v2/api-docs", {
        params,
    });
    return data;
}


export {
    getApiDocs
}