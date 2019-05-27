# 记录`添加至愿望单`事件

当用户添加商品至愿望单时，触发此事件。  

## 调用
```JavaScript
BH.Event.addedToWishlist(params);
```

## 参数说明
|参数名称|类型|是否必填|默认值|描述|
|--|--|:--:|:--:|--|
|params|`object`|可选|-|事件参数|
|\|- sku|`string`|必填|-|商品编号|
|\|- name|`string`|必填|-|商品名称|
|\|- currency|`string`|必填|-|商品货币单位|
|\|- price|`number`|必填|-|商品价格|
|\|- [key]|`string`|可选|-|除开上述必填属性之外，还可以任意添加其他参数，这些参数将会原封不动的发送至 Bothub 后端服务器。|

## 样例
```JavaScript
// 不带参数
BH.Event.addedToWishlist();

// 带参数
BH.Event.addedToWishlist({
    sku: '1000-1',
    name: 'T-shirt',
    currency: 'USD',
    price: 200,
});
```
