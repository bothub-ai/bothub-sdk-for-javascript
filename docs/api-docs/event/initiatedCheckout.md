# 记录`购物车结算`事件

当用户结算购物车时，触发此事件。  

## 调用
```JavaScript
BH.Event.initiatedCheckout(params);
```

## 参数说明
|参数名称|类型|是否必填|默认值|描述|
|--|--|:--:|:--:|--|
|params|`object`|可选|-|事件参数|
|\|- sku|`string`|必填|-|商品编号|
|\|- name|`string`|必填|-|商品名称|
|\|- currency|`string`|必填|-|商品货币单位|
|\|- quantity|`number`|必填|-|商品数量|
|\|- availablity|`'0' | '1'`|必填|-|商品是否处于可以付款的状态，`0`表示不能付款，`1`表示可以付款|
|\|- totalPrice|`number`|必填|-|购物车结算总价格|
|\|- [key]|`string`|可选|-|除开上述必填属性之外，还可以任意添加其他参数，这些参数将会原封不动的发送至 Bothub 后端服务器。|

## 样例
```JavaScript
// 不带参数
BH.Event.initiatedCheckout();

// 带参数
BH.Event.initiatedCheckout({
    sku: '1000-1',
    name: 'T-shirt',
    currency: 'USD',
    quantity: 10,
    availablity: '1'
    price: 200,
});
```
