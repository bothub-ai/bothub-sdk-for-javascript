# 聊天插件

[使用预览](https://bothub-ai.github.io/bothub-sdk-for-javascript/widgets/customerchat/)

## 参数属性说明
|属性名称|类型|是否可选|默认值|说明|
|:---|:--|:--|:--|
|id|`string`|必填|-|插件编号|
|type|`string`|必填|-|插件类型，必填`customerchat`|
|pageId|`string`|必填|-|连接的`Facebook`页面编号|
|themeColor|`string`|选填|-|主题颜色，填入标准16进制颜色编码，比如`#ff6900`|
|loggedInGreeting|`string`|选填|-|对当前已登录 Facebook 的用户显示的欢迎语 ，不超过 80 个字符|
|loggedOutGreeting|`string`|选填|-|对当前未登录 Facebook 的用户显示的欢迎语，不超过 80 个字符|
|rendered|`function`|选填|-|渲染完成的回调函数|

## 调用示例
```javascript
// 初始化时设置插件属性
window.BH.init({
    pageId: '{your-page-id}',
    language: 'en_US',
    renderImmediately: true,
    widgets: [
        {
            "id": "bh-example-customerchat",
            "type": "Customerchat",
            "pageId": '{your-page-id}',
            "themeColor": "#FF9966",
        },
    ],
});

// 手动设置插件属性
window.BH.Widget.setConfig({
    "id": "bh-example-customerchat",
    "type": "Customerchat",
    "pageId": '{your-page-id}',
    "themeColor": "#FF9966",
});
```

