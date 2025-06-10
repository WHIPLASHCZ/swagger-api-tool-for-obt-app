import axios from "axios";
import { SWAGGER_HOST } from '../constant/index.mjs'

// 创建实例时配置默认值
const instance = axios.create({
  baseURL: SWAGGER_HOST,
});

export default instance;
