import axios from "axios";

const SWAGGER_HOST = "http://192.168.0.229:13000";

// 创建实例时配置默认值
const instance = axios.create({
  baseURL: SWAGGER_HOST,
});

export default instance;
