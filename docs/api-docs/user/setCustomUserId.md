# 设置当前用户编号

该方法可以设置全局的用户编号，在这之后所有的用户事件都将使用此编号。  

## 调用
```JavaScript
BH.User.setCustomUserId(id);
```

## 参数说明
|参数名称|类型|描述|
|--|--|--|
|id|`string`|需要设置的用户编号|

## 样例
```JavaScript
BH.User.setCustomUserId('{user-id}');
```
