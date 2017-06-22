# Step.1 Config It

> 在`html`中添加如下代码，可以在`https://beta.bothub.ai`获得相关配置

## load 方式 1
```html
<script>
window.BOTHUB = window.BOTHUB || {
    bot_id: '<VALUE>',                      // beta.bothub.ai webhook_id
    custom_user_id: '<VALUE>',              // 网站用户id，没有则为空
    facebook_page_id: '<VALUE>',            // 以该账号发送消息给用户
    messenger_app_id: '<VALUE>',            // 可选 messenger 应用号
    api_server: 'https://xx.xx.xx/',        // 可选 messenger 后台回调url 和 messenger_app_id 配合使用
    platforms: ['facebook', 'bothub'],      // 可选 将log发送到的平台
};
</script>
<script async src="//sdk.bothub.ai/bothub.js"></script>
```

## load 方式 2
```html
<script>
window.BOTHUB = window.BOTHUB || {
    bot_id: '<VALUE>',                      // beta.bothub.ai webhook_id
    custom_user_id: '<VALUE>',              // 网站用户id，没有则为空
    facebook_page_id: '<VALUE>',            // 以该账号发送消息给用户
    messenger_app_id: '<VALUE>',            // 可选 messenger 应用号
    api_server: 'https://xx.xx.xx/',        // 可选 messenger 后台回调url 和 messenger_app_id 配合使用
    platforms: ['facebook', 'bothub'],      // 可选 将log发送到的平台
};
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//sdk.bothub.ai/bothub.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'bothub-jssdk'));
</script>
```

# Step.2 基本事件

## 商品添加到购物车

>- param {string} contentId     产品编号
>- param {string} contentType   物品类型
>- param {string} currency      币种
>- param {number} price         金额

### demo
```js
// BOTHUB.Marketing.logAddedToCartEvent('2#/1-size-s/11-color-black','product','$','26.99');

$(function() {
    $('.add-to-cart').click(function() {
        BOTHUB.Marketing.logAddedToCartEvent('<?= $product_id ?>','product','<?= $currency ?>','<?= $price ?>');
    });
});
```

## 商品添加到愿望单

>- param {string} contentId     产品编号
>- param {string} contentType   物品类型
>- param {string} currency      币种
>- param {number} price         金额

### demo
```js
// BOTHUB.Marketing.logAddedToWishlistEvent('2#/1-size-s/11-color-black','product','$','26.99');
```

## 商品进行了支付

>- param {string} contentId                 订单号
>- param {string} contentType               物品类型
>- param {number} numItems                  数量
>- param {boolean} paymentInfoAvailable     是否完成支付
>- param {string} currency                  币种
>- param {number} totalPrice                总金额

### demo
```js
// BOTHUB.Marketing.logInitiatedCheckoutEvent('JXUZPOJJX', 'product', 1, true, '$', '35.98');
```

# Step.3 自定义事件 `logEvent`

>- param {string}       事件名称
>- param {object}       参数

```js
BOTHUB.Marketing.logEvent('logined',{sex:'male',age:18});
```

# Step.4 回调设置 `addCallback`

> 由于`facebook`组件加载需要一小段时间，当需要页面打开后触发`something`时需要使用该`function`
>- param {string}     定义名字（重复定义只执行一次，避免多次触发）
>- param {funcable}    事件

```js
// 错误做法
$(function() {
    BOTHUB.Marketing.logEvent('send_one');
});

// 正确做法
BOTHUB.Marketing.addCallback('reg_test', function() {
    BOTHUB.Marketing.logEvent('send_one');
});
```
