# 综述

在网站上部署 Bothub Remarketing SDK 后（以下简称SDK)，就可以轻松的在 Messenger 上进行订单回执发送、购物车提醒、优惠信息提示等再营销。SDK可集成在用户自行部署的各种主流电商网站上。

SDK 提供了聊天插件、事件跟踪等功能，并能够根据相关事件推送消息。事件和 Facebook Analytics 的相应事件保持了最大程度的一致以便于开发以及在 Facebook Analytics 中查看事件统计。

**浏览器最低兼容版本 IE 9，Firefox 15，Chrome 15** 

# 开发说明
命令行说明
```bash
# 调试
npm run dev <project name> <mode>
# 构建
npm run build <project name> <mode>
# （构建后）上传
npm run deploy <project name> <mode>
```

其中：
1. `project name`可填`bothub`和`discount`
2. `mode`可填`uat`和`uat2`和`prod`

# 使用说明

为了更容易理解 SDK 使用方式，请参考示例代码：https://demo.bothub.ai/sdk/

# 配置

在 `<body>` 标签内最底部添加如下代码，用于配置及加载sdk

```html
<script>
window.BOTHUB = {
    facebook_page_id: 'value',         // 必选 Facebook 页面id
    custom_user_id: 'value',           // 可选 网站用户 id
    language: 'zh_CN'                  // 可选 显示语言，默认中文，可选 ['zh_CN', 'zh_TW', 'en_US']
    debug: true,                       // 可选 调试模式 开启后可在控制台查看日志
};
(function(s,id,l){s.id=id;s.src=l;window[id]||document.body.appendChild(s)})
(document.createElement('script'),'bothub-sdk','//sdk.bothub.ai/bothub.js');
</script>
```

我们的有些操作必须要在插件和`SDK`加载完成之后进行，此时我们可以定义全局的初始化完成函数，该函数将会在插件和`SDK`加载完成后自动调用：

```JavaScript
window.bhAsyncInit = function() {
  // 相关代码写在此处
}
```

SDK 初始化完成后，接下来我们将介绍几个插件的使用方式。

# Messenger Checkbox 插件

### 开始使用

在网页合适位置放入以下代码，用于显示 Messenger Checkbox：

```html
<div id="bothub-messenger-checkbox" prechecked="true" size="small"></div>
```

用户勾选后插件后，可以通过触发相关事件给用户发送不同的消息：

```html
<button onclick="BOTHUB.Marketing.logAddedToCartEvent('10001', 'T-shirt', 'USD', 26.99);">加入购物车</button>
```

注意：以下章节将只显示事件代码

### 商品添加购物车

参数说明：产品编号, 物品类型, 币种, 金额(number)

注意：货币类型请参看附录中使用声明

```js
BOTHUB.Marketing.logAddedToCartEvent('1', 'T-shirt', 'USD', 26.99);
```

### 商品添加愿望单

参数说明：产品编号,  物品类型, 币种, 金额(number)

```js
BOTHUB.Marketing.logAddedToWishlistEvent('1', '背包', 'CNY', 599);
```

### 商品发起付款

参数说明：订单号, 物品类型, 数量, 支付成功(bool), 币种, 总金额(number)

```js
BOTHUB.Marketing.logInitiatedCheckoutEvent('10001', 'music', 5, true, 'USD', 6);
```

### 商品付款成功

参数说明：订单号, 币种, 总金额(number)

```js
BOTHUB.Marketing.logPurchaseEvent('10001', 'USD', 100);
```

### 自定义事件

有些时候我们希望能够记录一些其他事件，可以使用以下方式，只需要传递事件名及相关数据即可。

参数说明：事件名, null, 用户自定义对象(object)

注意：自定义事件名称的最大长度为40个字符，它只能使用字母、数字、下划线或破折号的字符。

```js
BOTHUB.Marketing.logEvent('logined', null, { sex: 'male', age: 18 });
```

# Send To Messenger 插件

我们可以通过 send_to_messenger 或 messenger_checkbox 插件将订单信息发送给用户。

### 配置订单数据

方式一：在sdk配置中配置要发送的订单数据

数据示例请参考：[数据示例](https://sdk.bothub.ai/data/ecommerce.js)

```js
window.BOTHUB = {
  // ...
  ecommerce: {
    messenger_checkbox: {
      receipt: 订单回执数据,
    },
    send_to_messenger: {
      receipt: 订单回执数据,
      feed: 商品列表数据,
    }
  }
};
```

方式二：通过接口来设置要发送的订单数据（参考附录异步调用方式）

```js
BOTHUB.ECommerce.resetMessengerCheckboxReceipt(data)
BOTHUB.ECommerce.resetSendToMessengerReceipt(data)
BOTHUB.ECommerce.resetSendToMessengerFeed(data)
```

### 使用方式：

messenger_checkbox 插件
1. 设置要发送的数据
2. 勾选 "send to messsenger" 并触发自定义事件后，用户将受到订单回执信息

send_to_messenger 插件
1. 设置要发送的数据
2. 用户点击”send to messenger“后，将会收到订单回执信息

# Customer Chat 插件

使用聊天插件可以让用户在浏览网页的同时随时和 Bot 进行对话

### 使用方式

在 `<body>` 标签里任意位置添加如下代码即可：

```html
<div id="bothub-customerchat"></div>
```

# 附录

### 使用声明

1. SDK中所有函数参数若无特别声明均为 `string` 类型，使用单引号引入
2. 货币符号请参考文档 [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)
3. API详情文档请参看附录

### 异步调用方式

有些时候当sdk尚未加载完成时需要调用sdk接口，可通过异步方式来调用：

```js
window.bhAsyncInit = function() {
  // 下面的代码sdk加载完成后会立即被调用
  BOTHUB.ECommerce.resetMessengerCheckboxReceipt(data)
}
```

### 插件样式设置

[参考这里](https://developers.facebook.com/docs/messenger-platform/discovery)

### 事件 API

商品添加到购物车

```js
logAddedToCartEvent: function(
  contentId,   /* required {string} contentId */
  contentType, /* required {string} contentType */
  currency,    /* required {string} currency */
  price        /* required {number} price */
)
```

商品添加到愿望单
```js
logAddedToWishlistEvent: function(
  contentId,   /* required {string} contentId */
  contentType, /* required {string} contentType */
  currency,    /* required {string} currency */
  price        /* required {number} price */
) 
```

商品发起付款

```js
logInitiatedCheckoutEvent: function(
  contentId,             /* required {string} contentId */
  contentType,           /* required {string} contentType */
  numItems,              /* required {number} numItems */
  paymentInfoAvailable,  /* required {boolean} paymentInfoAvailable */
  currency,              /* required {string} currency */
  totalPrice             /* required {number} totalPrice */
)
```

商品支付成功

```js
logPurchaseEvent: function(
  orderId,               /* required {string} orderId */
  currency,              /* required {string} currency */
  totalPrice             /* required {number} totalPrice */
}
```

自定义事件

```js
logEvent: function(
  eventName,   /* {string}  eventName */
  valueToSum,  /* {null}    NULL */
  params       /* {object}  params */
)
```

# 针对 GTM 部署的补充说明
如果您是使用 GTM 来部署代码的，那么就需要做一些额外的配置和修改，因为 GTM 并不支持自定义的 DOM 元素属性，所以直接将 HTML 代码放入 GTM 中是不可行的，我们需要另外做些处理。

不能再直接把 DOM 元素放至页面中，需要手动创建。以放置在页面末尾的`send-to-messenger`插件为例，部署代码应该是：

```html
<script>
(function() {
  var el = document.createElement('div');

  // 具体渲染什么元素，更改这里就行
  el.innerHTML = '<div id="bothub-send-to-messenger" color="blue" size="standard"></div>';

  // 这里将会控制该元素插入页面的哪里，在这里是放在了页面底部
  document.body.appendChild(el);
})();

window.BOTHUB = {
  facebook_page_id: 'value',         // 必选 Facebook 页面id
  custom_user_id: 'value',           // 可选 网站用户 id
  language: 'zh_CN'                  // 可选 显示语言，默认中文，可选 ['zh_CN', 'zh_TW', 'en_US']
};

(function(s,id,l){s.id=id;s.src=l;window[id]||document.body.appendChild(s)})
(document.createElement('script'),'bothub-sdk','//sdk.bothub.ai/bothub.js');
</script>
```

对于`messenger-checkbox`插件，它一般并不会插入到页面底部，而是需要插入页面中的某个位置，对于这种情况，你需要定位到它将要插入位置后方的元素，例如：

```JavaScript
(function() {
  var el = document.createElement('div');
  el.innerHTML = '<div id="bothub-messenger-checkbox" prechecked="true" size="small"></div>';

  var before = document.querySelector('#before');   // 定位至 before 元素
  before.parentElement.insertBefore(el, before);    // 插入 before 元素之前
})();
```
