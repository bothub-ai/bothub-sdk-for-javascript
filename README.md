# Bothub SDK for JavaScript

在网站上部署 Bothub SDK 后（以下简称SDK)，就可以轻松的在 Messenger 上进行订单回执发送、购物车提醒、优惠信息提示等再营销。  
SDK可集成在用户自行部署的各种主流电商网站上。

SDK 提供了聊天插件、事件跟踪等功能，并能够根据相关事件推送消息。事件和 Facebook Analytics 的相应事件保持了最大程度的一致以便于开发以及在 Facebook Analytics 中查看事件统计。

**浏览器最低兼容版本 IE 10，Firefox 30，Chrome 30** 

## 开发说明

### 命令行说明
```bash
# 调试
npm run dev <mode>
# 构建
npm run build <mode>
# （构建后）上传
npm run deploy <mode>
```

其中`mode`为选填，表示编译的模式，可填`uat`、`prod`。  
`dev`模式下默认为`uat`，`build`和`deploy`默认为`prod`。  

三种模式主要是`appId`以及向后端通讯的接口地址不同以及代码内部的部分差异，具体的配置可以参考：[环境变量](./build/env.ts)

### 安装证书
由于 SDK 需要运行在`https`环境下，所以在开始调试之前需要安装证书。  
使用 mkcerts 工具生成本地证书：https://github.com/FiloSottile/mkcert  

```shell
# 安装受信任的根证书
mkcert -install

# 生成域名证书
mkcert local-fe.bothub.ai localhost 127.0.0.1
```

### 代码上传
代码上传需要提供`Gcloud`的密钥，请询问项目组成员，将`gcloud.json`和`gcloud-uat.json`放置在项目根目录即可。

## 使用说明及预览

插件使用说明以及预览请见：[插件预览](https://bothub-ai.github.io/bothub-sdk-for-javascript/)

## API 文档

插件的完整 API 说明文档请见：[API 文档](./docs/api-docs/index.md)
