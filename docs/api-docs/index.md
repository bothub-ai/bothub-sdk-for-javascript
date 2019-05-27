# Bothub SDK for JavaScript - API 文档

这里将会列举出所有的 SDK 方法和配置项。Bothub SDK 将会被挂载在全局的`BH`命名空间下，你可以通过`window.BH`来访问它。

## 核心方法

|方法|描述|
|:--|:--|
|[.init()](./core/init.md)|用于初始化和设置SDK。调用这个函数后才能调用所有其他 SDK 方法。|

## User 模块

用户的自定义编号是 Bothub 用于记录用户事件的凭据，相同的用户编号就会认为是同一个用户的操作（但是同一个用户可以有很多不同的编号）。  

|方法|描述|
|:--|:--|
|[.User.getCustomUserId()](./user/getCustomUserId.md)|获取当前的用户自定义编号。|
|[.User.setCustomUserId()](./user/setCustomUserId.md)|设置当前的用户自定义编号。|
|[.User.changeCustomUserId()](./user/changeCustomUserId.md)|变更并设置当前用户的自定义编号。|

## Event 模块

|方法|描述|
|:--|:--|
|[.Event.addedToCart()](./event/addedToCart.md)|当用户添加商品至购物车时，触发此事件。|
|[.Event.addedToWishlist()](./event/addedToCart.md)|当用户添加商品至愿望单时，触发此事件。|
|[.Event.initiatedCheckout()](./event/initiatedCheckout.md)|当用户结算购物车时，触发此事件。|
|[.Event.purchase()](./event/purchase.md)|当用户完成商品购买时，请触发该事件。|
|[.Event.logEvent()](./event/logEvent.md)|记录 Bothub 事件，例如当有人完成您的教程时。|

## Widget 模块

Bothub 提供一系列

### 方法说明
|方法|描述|
|:--|:--|
|[.Widget.setConfig()](./widget/methods/setConfig.md)|设置插件属性|
|[.Widget.render()](./widget/methods/render.md)|立即渲染插件|
|[.Widget.destroy()](./widget/methods/destroy.md)|销毁插件|

### 插件说明
|插件名称|描述|
|:--|:--|
|[聊天插件](./widget/configs/customerchat.md)|通过此插件，用户可以直接在页面上与您的 Facebook Page 聊天。|
|[“给我们发消息”插件](./widget/configs/message-us.md)|点击该插件将会立即跳转至您的 Facebook Page Messenger 页面，并开始聊天。|
|[“发送至 Messenger”插件](./widget/configs/send-to-messenger.md)|您可以通过该插件传入数据并触发相应的事件。|
|[复选框插件](./widget/configs/checkbox.md)|通过此插件，您可以在网站的表单中显示一个复选框，用户通过勾选此复选框可选择在 Messenger 中接收您的智能助手发送的消息。|
|[优惠券插件](./widget/configs/discount.md)|通过此插件，您可以在网站销售商品的表单中显示一个优惠券提示框，用户通过此插件可以得到您设置的优惠券。|
