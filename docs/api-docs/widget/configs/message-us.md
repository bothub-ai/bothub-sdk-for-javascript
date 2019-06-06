# 聊天插件

[使用预览](https://bothub-ai.github.io/bothub-sdk-for-javascript/widgets/message-us/)

## 参数属性说明
|属性名称|类型|是否可选|默认值|说明|
|:--|:--|:--|:--|:--|
|id|`string`|必填|-|插件编号|
|type|`string`|必填|-|插件类型，必填`MessageUs`|
|pageId|`string`|选填|-|当你需要此插件和初始化时设置的页面编号不同时，填入此项|
|color|`string`|选填|`'blue'`|主题颜色，待选值为`'blue' \| 'white'`|
|size|`string`|选填|`'large'`|插件大小，待选值为`'standard' \| 'large' \| 'xlarge'`|
|position|`function`|选填|-|插件插入页面位置，当你无法在页面中添加对应插件编号的元素时可以使用此函数来定位，插件将会添加在该函数返回元素的后面。|
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
            "type": "MessageUs",
            "color": "bule",
        },
    ],
});

// 手动设置插件属性
window.BH.Widget.setConfig({
    "id": "bh-example-customerchat",
    "type": "MessageUs",
    "color": "bule",
    position() {
        return document.querySelector('input[type=submit], button[name=add]')
    },
});
```

