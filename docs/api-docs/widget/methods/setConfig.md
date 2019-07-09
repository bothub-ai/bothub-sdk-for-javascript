# 设置插件属性

`BH.Widget.setConfig()`方法用来设定插件的属性。此操作并不会触发插件的重新渲染，需要用户手动调用渲染方法。
1. 如果当前设置的插件编号已经存在，则当前的属性将会和旧有的属性合并，新属性优先。
2. 如果当前设置的插件编号不存在，则当前设置的插件将会直接添加到插件列表中。

## 调用
```JavaScript
BH.Widget.setConfig(params);
```

## 参数说明
|参数名称|类型|是否必填|默认值|描述|
|--|--|:--:|:--:|--|
|params|`object`|必填|-|插件的属性|
|\|- id|`string`|必填|-|你想要设置的插件编号|
|\|- [key in param]|`any`|可选|-|插件参数，对于不同的插件会有不同的属性，详情请看插件属性说明。|

## 样例
```JavaScript
BH.Widget.setConfig({
    id: '{widget-id}',
    color : 'blue',
    rendered() {
        console.log('Widget loaded.');
    },
});
```
