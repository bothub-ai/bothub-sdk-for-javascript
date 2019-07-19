# 记录`完成购物`事件

当用户完成购物时，触发此事件。  

## 调用
```JavaScript
BH.Event.purchase(params);
```

## 参数说明
|参数名称|类型|是否必填|默认值|描述|
|--|--|:--:|:--:|--|
|params|`object`|可选|-|事件参数|
|\|- orderNumber|`string`|必填|-|订单编号|
|\|- source|`string`|必填|-|商家来源|
|\|- currency|`string`|必填|-|商品货币单位|
|\|- totalPrice|`number`|必填|-|购物车结算总价格|
|\|- [key]|`string`|可选|-|除开上述必填属性之外，还可以任意添加其他参数，这些参数将会原封不动的发送至 Bothub 后端服务器。|

## 样例
```JavaScript
// 不带参数
BH.Event.purchase();

// 带参数
BH.Event.purchase({
    orderNumber: '10001010',
    source: 'shopify',
    currency: 'USD',
    price: 200,
});
```

## 注意
每次发送此事件时`orderNumber`字段必须不同，如果对同一个`orderNumber`多次发送此事件，那么只有最早的一次事件有效，后面发送的事件全部都会被忽略，即事件数据不会到达后端。
