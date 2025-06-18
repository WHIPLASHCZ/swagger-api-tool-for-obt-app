# Swagger API 工具 for OBT App

## 🛠️ 命令功能

### `findApi` 命令
```bash
obt-api find-api <API路径>
```
- 功能：在Swagger文档中定位指定API
- 参数：
  - `<API路径>` 需要查找的API路径（如：/obt/hotel/search）
- 特性：
  - 自动打开Chrome浏览器并定位到API文档位置
  - 支持OSS/OBT两种项目类型

### `writeApis` 命令
```bash
obt-api write-api
```
- 功能：交互式生成API客户端代码
- 特性：
  - 引导式选择项目类型（OSS/OBT）
  - 支持选择业务模块和API标签
  - 生成TypeScript/JavaScript/Python客户端代码
  - 自动合并到现有文件或创建新文件

## 📋 使用示例

生成酒店搜索API客户端：
```bash
obt-api write-api
# 依次选择：
# 1. 项目类型 → obt
# 2. 业务类型 → hotel
# 3. 标签 → hotel-search
# 4. 目标路径 → ./src/api/client.js
```

查找订单详情API：
```bash
obt-api find-api /obt/order/detail
```

## ⚙️ 配置文件说明
若要使用findApi命令，需要在`settings.json`中配置chrome.exe的路径，示例：
```json
{
  "chromePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
}
```

        