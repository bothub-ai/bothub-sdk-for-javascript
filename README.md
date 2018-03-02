# 综述

在网站上部署 Bothub Remarketing SDK 后（以下简称SDK)，就可以轻松的在Messenger上进行订单回执发送、购物车提醒、优惠信息提示等再营销。SDK可集成在用户自行部署的各种主流电商网站上。

SDK提供了聊天插件、事件跟踪等功能，并能够根据相关事件推送消息。事件和Facebook Analytics的相应事件保持了最大程度的一致以便于开发以及在Facebook Analytics中查看事件统计。

**浏览器最低兼容版本 IE 9，Firefox 15，Chrome 15** 

# 配置

1. 在 `<body>` 标签内最底部添加如下代码，用于配置及加载sdk

```html
<script>
  window.BOTHUB = {
    facebook_page_id: 'value',         // 必选 Facebook 页面id
    custom_user_id: 'value',           // 可选 网站用户id
    language: 'zh_CN'                  // 可选 显示语言，默认中文，可选 ['zh_CN', 'zh_TW', 'en_US']
    debug: true,                       // 可选 调试模式 开启后可在控制台查看日志
    callback: function(self) {}        // 可选 后续动作
  };
  (function(s,id,l){s.id=id;s.src=l;window[id]||document.body.appendChild(s)})
  (document.createElement('script'),'bothub-sdk','//sdk.bothub.ai/bothub.js');
</script>
```

根据需要在 `<body>` 标签里合适位置添加如下代码：

```html
<!-- 如果需要发送Messenger消息给用户 添加这段代码 -->
<div class="fb-messenger-checkbox" prechecked="true" size="small"></div>

<!-- 如果需要在网页中集成聊天插件 添加这段代码 -->
<div class="fb-customerchat"></div>

<!-- 如果需要将指定消息发送给Messenger 添加这段代码 -->
<div class="fb-send-to-messenger" color="blue" size="standard"></div>
```

# 基本使用

### 使用方法

在 html 标签中添加 onclick="事件代码" 即可：
```html
<button onclick="BOTHUB.Marketing.logEvent('login', null, {})">加入购物车</button>
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

### 商品支付

参数说明：订单号, 物品类型, 数量, 支付成功(bool), 币种, 总金额(number)

```js
BOTHUB.Marketing.logInitiatedCheckoutEvent('1', 'music', 5, true, 'USD', 6);
```

### 自定义事件

有些时候我们希望能够记录一些其他事件，可以使用以下方式，只需要传递事件名及相关数据即可。

参数说明：事件名, null, 用户自定义对象(object)

注意：自定义事件名称的最大长度为40个字符，它只能使用字母、数字、下划线或破折号的字符。

```js
BOTHUB.Marketing.logEvent('logined', null, { sex: 'male', age: 18 });
```

# 电商

配置商品信息后可通过 messenger_checkbox 或 send_to_messenger 插件将订单信息发送到用户Messenger

### 配置方式

```js
window.BOTHUB = {
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

数据示例请参考：[数据示例](https://sdk.bothub.ai/data/ecommerce.js)

注：messenger_checkbox 只允许配置 receipt 数据，send_to_messenger 只允许配置 receipt 或 feed 其中一种

使用步骤：

messenger_checkbox 插件
1. 配置 BOTHUB.ecommerce.messenger_checkbox.receipt
2. 勾选 "send to messsenger" 并触发自定义事件后，用户将受到订单回执信息

send_to_messenger 插件
1. 配置 BOTHUB.ecommerce.send_to_messenger.receipt
2. 用户点击”send to messenger“后，将会收到订单回执信息

当商品信息更新后可通过以下接口重置插件（sdk初始化完成之后才能调用，请不要在sdk未加载完时调用）

```js
BOTHUB.ECommerce.resetMessengerCheckboxReceipt(data)
BOTHUB.ECommerce.resetSendToMessengerReceipt(data)
BOTHUB.ECommerce.resetSendToMessengerFeed(data)
```

# 附录

### 示例代码

完整示例请参考源码：

https://demo.bothub.ai/sdk/

### 使用声明

1. SDK中所有函数参数若无特别声明均为 `string` 类型，使用单引号引入
2. 货币符号请参考文档 [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)
3. API详情文档请参看附录

### 与 Facebook SDK 集成

若未集成 facebook sdk 请忽略本节！如果原有网站已集成 facebook sdk 请进行以下操作：


```js
// 删除这段
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// 删除这段
window.fbAsyncInit = function() {
  FB.init({
    appId: '<messenger_app_id>',
    xfbml: true,
    version: 'v2.6'
  });
}

window.BOTHUB = window.BOTHUB || {
  callback: function(self) {
    /* 
     * 将上面函数中 FB.init() 部分之外的代码放到这 
     */
  }
};
```

### 异步调用方式

有些时候当sdk尚未加载完成时需要调用sdk接口，可通过异步方式来调用：

```js
window.bhAsyncInit = function() {
  // 下面的代码sdk加载完成后会立即被调用
  BOTHUB.ECommerce.resetMessengerCheckboxReceipt(data)
}
```

### API 参考文档

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

商品进行了支付

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

自定义事件

```js
logEvent: function(
  eventName,   /* {string}  eventName */
  valueToSum,  /* {null}    NULL */
  params       /* {object}  params */
)
```

插件样式设置

[参考这里](https://developers.facebook.com/docs/messenger-platform/discovery)



