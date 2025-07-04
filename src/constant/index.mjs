import path from 'node:path'
import fs from 'node:fs'

export const SWAGGER_HOST = "http://192.168.0.229:13000";

export const oss = [
  "系统",
  "机票",
  "酒店",
  "火车票",
  "用车",
  "保险",
  "消息",
  "呼叫中心",
  "财务",
  "机场服务",
  "接送机",
  "代办值机",
  "差旅",
  "签证",
  "车船票",
  "BDC基础数据",
  "Singa基础数据",
  "邮寄配送",
  "运营中心",
  "打印",
  "商城",
  "旅游",
  "发票",
];

export const ossMap = {
  系统: "Sys",
  机票: "Plane",
  酒店: "Hotel",
  火车票: "Train",
  用车: "Vehicle",
  保险: "Bx",
  消息: "Sms",
  呼叫中心: "MessCenter",
  财务: "Finance",
  机场服务: "Airport",
  接送机: "Parking",
  代办值机: "Agent",
  差旅: "Travel",
  签证: "Visa",
  车船票: "Ship",
  BDC基础数据: "Bdc",
  Singa基础数据: "Singa",
  邮寄配送: "Express",
  运营中心: "Yyzx",
  打印: "Print",
  商城: "YMall",
  旅游: "Tour",
  发票: "Kp",
};

export const obt = [
  "系统",
  "机票",
  "酒店",
  "火车票",
  "用车",
  "保险",
  "消息",
  "财务",
  "差旅",
  "签证",
  "运营中心",
  "机场服务",
  "邮寄配送",
  "发票",
  "商城",
  "Singa基础数据",
];

export const obtMap = {
  系统: "Sys",
  机票: "Plane",
  酒店: "Hotel",
  火车票: "Train",
  用车: "Vehicle",
  保险: "Bx",
  消息: "Sms",
  财务: "Finance",
  差旅: "Travel",
  签证: "Visa",
  运营中心: "Yyzx",
  机场服务: "Airport",
  邮寄配送: "Express",
  发票: "Kp",
  商城: "YMall",
  Singa基础数据: "Singa",
};

// export const getChromePath = () => {
//   const settingPath = path.resolve(import.meta.dirname, '../../', 'settings.json');
//   if (!fs.existsSync(settingPath))  return null; //throw new Error('请先配置setting.json！');
//   const res = fs.readFileSync(settingPath, 'utf-8');
//   const json = JSON.parse(res);
//   if (!json.chromePath) return null;   //throw new Error('请在setting.json中配置chromePath字段！');
//   return json.chromePath
// };