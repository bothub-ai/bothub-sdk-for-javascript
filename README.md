# 综述

在网站上部署 Bothub Remarketing SDK 后（以下简称SDK)，就可以轻松的在Messenger上进行订单回执发送、购物车提醒、优惠信息提示等再营销。SDK可集成在用户自行部署的各种主流电商网站上。

SDK提供了聊天插件、事件跟踪等功能，并能够根据相关事件推送消息。事件和Facebook Analytics的相应事件保持了最大程度的一致以便于开发以及在Facebook Analytics中查看事件统计。

**浏览器最低兼容版本 IE 9，Firefox 15，Chrome 15** 

# 配置

1. 在 `<body>` 标签内最底部添加如下代码，用于配置及加载sdk

```html
<script>
  window.BOTHUB = {
    bot_id: 'value',                   // 必选 机器人id
    facebook_page_id: 'value',         // 必选 以该账号发送消息给用户
    api_server: 'https://xx.xx.xx/',   // 必选 API地址
    custom_user_id: 'value',           // 可选 网站用户id
    messenger_app_id: 'value',         // 可选 Messenger 应用号id
    platforms: ['facebook', 'bothub'], // 可选 将事件发送到的平台
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

# 使用

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



# 附录

### 示例代码

完整示例请参考源码：

https://demo.bothub.ai/analytics/

### 使用声明

1. SDK中所有函数参数若无特别声明均为 `string` 类型，使用单引号引入
2. 货币符号请参考文档 [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)
3. API详情文档请参看附录

### 与 Facebook SDK 集成

若未集成 facebook sdk 请忽略本节！如果原有网站已集成 facebook sdk 请进行以下操作：


```javascript
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



