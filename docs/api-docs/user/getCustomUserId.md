# 获取当前用户编号

该方法可以获得当前用户的自定义编号。  

## 调用
```JavaScript
const id = BH.User.getCustomUserId();
```

## 说明
此接口将会返回用户编号的字符串，如果当前没有设置用户编号，将会返回`undefined`。  
