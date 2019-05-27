# 记录自定义事件事件

当用户完成购物时，触发此事件。  

## 调用
```JavaScript
BH.Event.logEvent(name);

BH.Event.logEvent(params);
```

## 参数说明
|参数名称|类型|是否必填|默认值|描述|
|--|--|:--:|:--:|--|
|name|`string`|可选|-|事件名称|
|params|`object`|可选|-|事件参数|
|\|- name|`string`|可选|-|事件名称|
|\|- [key]|`string`|可选|-|除开上述必填属性之外，还可以任意添加其他参数，这些参数将会原封不动的发送至 Bothub 后端服务器。|

## 样例
```JavaScript
// 不带参数
BH.Event.logEvent();

// 带事件名称
BH.Event.logEvent('bind_facebook_id');

// 带参数
BH.Event.logEvent({
    name: 'bind_facebook_id',
    facebook_id: 'test_1',
});
```
