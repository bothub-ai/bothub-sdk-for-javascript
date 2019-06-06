# 聊天插件

[使用预览](https://bothub-ai.github.io/bothub-sdk-for-javascript/widgets/checkbox/)

## 参数属性说明
|属性名称|类型|是否可选|默认值|说明|
|:--|:--|:--|:--|:--|
|id|`string`|必填|-|插件编号|
|type|`string`|必填|-|插件类型，必填`MessageUs`|
|pageId|`string`|选填|-|当你需要此插件和初始化时设置的页面编号不同时，填入此项|
|origin|`string`|必填|-|插件加载网址的基域|
|allowLogin|`boolean`|选填|`true`|让用户能够在没有现有会话的情况下登录，同时启用“不是你”选项|
|size|`string`|选填|`'large'`|插件大小，待选值为`'small' \| 'medium' \| 'standard' \| 'large' \| 'xlarge'`|
|skin|`string`|选填|`'light'`|插件内容的色彩主题，待选值为`'light' \| 'dark'`|
|centerAlign|`boolean`|选填|`false`|插件内容是否居中对齐|
|hideAfterChecked|`number`|选填|`-1`|用户勾选确认后多少天内自动隐藏，默认为`-1`，意为不使用此功能|
|position|`function`|选填|-|插件插入页面位置，当你无法在页面中添加对应插件编号的元素时可以使用此函数来定位，插件将会添加在该函数返回元素的后面。|
|check|`function`|选填|-|用户勾选复选框时的回调函数，回调函数将会把当前的`userRef`传入|
|unCheck|`function`|选填|-|用户去除选中复选框时的回调函数，回调函数将会把当前的`userRef`传入|
|hidden|`function`|选填|-|插件被隐藏时的回调，这里的隐藏可能是用户启用了`hideAfterChecked`功能，也可能是因为出错导致`facebook`拒绝显示该插件|
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
            "id": "bh-example-checkbox",
            "type": "Checkbox",
            "origin": "{site-hostname}",
        },
    ],
});

// 手动设置插件属性
window.BH.Widget.setConfig({
    "id": "bh-example-checkbox",
    "type": "Checkbox",
    "origin": "{site-hostname}",
    check(userRef) {
        console.log(userRef);
    },
    position() {
        return document.querySelector('input[type=submit], button[name=add]')
    },
});
```

