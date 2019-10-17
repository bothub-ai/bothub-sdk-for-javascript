# 聊天插件

[使用预览](https://bothub-ai.github.io/bothub-sdk-for-javascript/widgets/discount/)

## 参数属性说明

### 主要参数说明
|属性名称|类型|是否可选|默认值|说明|
|:--|:--|:--|:--:|:--|
|id|`string`|必填|-|插件编号|
|type|`string`|必填|-|插件类型，必填`Discount`|
|pageId|`string`|选填|-|当你需要此插件和初始化时设置的页面编号不同时，填入此项|
|title|`string`|必填|-|标题|
|subtitle|`string`|必填|-|副标题|
|discountText|`string`|必填|-|折扣优惠码的提示文本|
|discountCode|`string`|必填|-|折扣的优惠码，即便使用了`getCode`函数，也请给这个属性赋值为空字符串|
|showCodeBtnText|`string`|必填|-|折扣按钮文本|
|copyCodeBtnText|`string`|必填|-|复制按钮文本|
|discount|`string`|必填|-|折扣数量|
|origin|`string`|必填|-|插件加载网址的基域|
|align|`string`|选填|`center`|插件对齐方式，可选值`'center' \| 'left' \| 'right'`|
|hideAfterChecked|`number`|选填|`-1`|用户勾选确认后多少天内自动隐藏，默认为`-1`，意为不使用此功能|
|position|`function`|选填|-|插件插入页面位置，当你无法在页面中添加对应插件编号的元素时可以使用此函数来定位，插件将会添加在该函数返回元素的后面。|
|getCode|`function`|选填|-|获取优惠码函数，允许返回`Promise`|
|copyCodeBtn|`function`|选填|-|用户点击**复制**优惠码按钮时的事件|
|showCodeBtn|`function`|选填|-|用户点击**获取**优惠码按钮时的事件，用户此时是否勾选确认框将会作为参数传入此回调|
|rendered|`function`|选填|-|渲染完成的回调函数|

### `getCode`函数说明
`getCode`函数允许用户异步或者同步的实时的计算拿到当前用户的优惠码。  
当此函数为异步时，将会在`获取优惠码`按钮显示`loading`状态。  
这个函数需要的返回值具体格式为：
```typescript
interface GetDiscountCode {
    /** 当前优惠码 */
    code: string;
    /** 错误信息 */
    message: string;
    /** 是否为重复获取 */
    isSubscribed: boolean;
}
```

## 调用示例
```javascript
// 初始化时设置插件属性
window.BH.init({
    pageId: '{your-page-id}',
    language: 'en_US',
    renderImmediately: true,
    widgets: [
        {
            "id": "bh-example-discount",
            "type": "Discount",
            "origin": "{site-hostname}",
            "align": "center",
        },
    ],
});

// 手动设置插件属性
window.BH.Widget.setConfig({
    "id": "bh-example-discount",
    "type": "Discount",
    "origin": "{site-hostname}",
    "align": "center",
    position() {
        return document.querySelector('input[type=submit], button[name=add]')
    },
});
```
