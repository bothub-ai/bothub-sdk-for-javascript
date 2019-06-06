# 聊天插件

[使用预览](https://bothub-ai.github.io/bothub-sdk-for-javascript/widgets/send-to-messenger/)

## 参数属性说明

### 主要参数说明
|属性名称|类型|是否可选|默认值|说明|
|:--|:--|:--|:--|:--|
|id|`string`|必填|-|插件编号|
|type|`string`|必填|-|插件类型，必填`SendToMessenger`|
|pageId|`string`|选填|-|当你需要此插件和初始化时设置的页面编号不同时，填入此项|
|color|`string`|选填|`'blue'`|主题颜色，待选值为`'blue' \| 'white'`|
|size|`string`|选填|`'large'`|插件大小，待选值为`'standard' \| 'large' \| 'xlarge'`|
|enforceLogin|`boolean`|选填|`false`|如果为`true`，则点击该按钮时，已登录用户也必须重新登录|
|ctaText|`string`|选填|-|显示在按钮中的文本，具体内容见下面的列表|
|position|`function`|选填|-|插件插入页面位置，当你无法在页面中添加对应插件编号的元素时可以使用此函数来定位，插件将会添加在该函数返回元素的后面。|
|message|`object` \| 'function'|选填|-|点击按钮后向后端发送的数据|
|click|`function`|选填|-|点击按钮的回调函数|
|rendered|`function`|选填|-|渲染完成的回调函数|

### `ctaText`可填入的值列表
* GET_THIS_IN_MESSENGER
* RECEIVE_THIS_IN_MESSENGER
* SEND_THIS_TO_ME
* GET_CUSTOMER_ASSISTANCE
* GET_CUSTOMER_SERVICE
* GET_SUPPORT
* LET_US_CHAT
* SEND_ME_MESSAGES
* ALERT_ME_IN_MESSENGER
* SEND_ME_UPDATES
* MESSAGE_ME
* LET_ME_KNOW
* KEEP_ME_UPDATED
* TELL_ME_MORE
* SUBSCRIBE_IN_MESSENGER
* SUBSCRIBE_TO_UPDATES
* GET_MESSAGES
* SUBSCRIBE
* GET_STARTED_IN_MESSENGER
* LEARN_MORE_IN_MESSENGER
* GET_STARTED

## 调用示例
```javascript
// 初始化时设置插件属性
window.BH.init({
    pageId: '{your-page-id}',
    language: 'en_US',
    renderImmediately: true,
    widgets: [
        {
            "id": "bh-example-send-to-messenger",
            "type": "SendToMessenger",
            "color": "bule",
            "enforceLogin": false,
            "ctaText": "RECEIVE_THIS_IN_MESSENGER",
            "message": {
                type: "recipt",
                data: {
                    "name":"Stephane Crozatier",
                    "order_number":"12345678902",
                    "currency":"USD",
                    "payment_method":"Visa 2345",        
                    "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
                    // ..
                },
            },
        },
    ],
});

// 手动设置插件属性
window.BH.Widget.setConfig({
    "id": "bh-example-send-to-messenger",
    "type": "MessageUs",
    "color": "bule",
    message() {
        return {
            // ..
        };
    },
    position() {
        return document.querySelector('input[type=submit], button[name=add]')
    },
});
```

