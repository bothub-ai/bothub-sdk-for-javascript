# SDK 初始化

`BH.init()`方法用于初始化设置 SDK。必须在此之后调用所有其他SDK方法，因为它们在您执行之前不会存在。

## 调用
```JavaScript
BH.init(params);
```

## 参数说明
|参数名称|类型|是否必填|默认值|描述|
|--|--|:--:|:--:|--|
|params|`object`|必填|-|控制 SDK 设置的初始化参数|
|\|- pageId|`string`|必填|-|用户连接的 facebook 页面编号|
|\|- customUserId|`string`|可选|`''`|当前用户的自定义编号|
|\|- language|`'zh_CN' \| 'zh_TW' \| 'en_US'`|可选|`en_US`|使用的语言|
|\|- widgets|`array`|可选|`[]`|页面插件属性描述|
|\|- renderImmediately|`boolean`|可选|`true`|初始化后是否立即渲染页面插件|

## 样例
```JavaScript
BH.init({
    pageId            : '{your-page-id}',
    language          : 'en_US',
    renderImmediately : true,
});
```
