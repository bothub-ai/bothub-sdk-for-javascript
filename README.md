# Bothub SDK for JavaScript

在网站上部署 Bothub SDK 后（以下简称SDK)，就可以轻松的在 Messenger 上进行订单回执发送、购物车提醒、优惠信息提示等再营销。  
SDK可集成在用户自行部署的各种主流电商网站上。

SDK 提供了聊天插件、事件跟踪等功能，并能够根据相关事件推送消息。事件和 Facebook Analytics 的相应事件保持了最大程度的一致以便于开发以及在 Facebook Analytics 中查看事件统计。

**浏览器最低兼容版本 IE 10，Firefox 30，Chrome 30** 

## 开发说明
命令行说明
```bash
# 调试
npm run dev <mode>
# 构建
npm run build <mode>
# （构建后）上传
npm run deploy <mode>
```

其中`mode`为选填，表示编译的模式，可填`uat`、`uat2`、`prod`。
`dev`模式下默认为`uat`，`build`和`deploy`默认为`prod`。
