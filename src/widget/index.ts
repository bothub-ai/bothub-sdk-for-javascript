import { WidgetType } from './helper';
import { widgetData, widgets } from 'src/store';
import { log, warn } from 'src/lib/print';

// import { default as Checkbox, CheckboxData } from './base/checkbox';
// import { default as MessageUs, MessageUsData } from './base/message-us';
// import { default as ShareButton, ShareButtonData } from './base/share-button';
// import { default as Customerchat, CustomerchatData } from './base/customerchat';
// import { default as SendToMessenger, SendToMessengerData } from './base/send-to-messenger';

// export type Widget = Customerchat | MessageUs | SendToMessenger | Checkbox | ShareButton;
// export type WidgetData = CustomerchatData | MessageUsData | SendToMessengerData | CheckboxData | ShareButtonData;

import { default as Checkbox, CheckboxData } from './checkbox';
import { default as Discount, DiscountData } from './discount';

export type Widget = Checkbox | Discount;
export type WidgetData = CheckboxData | DiscountData;

/** 渲染函数 */
function render(id?: string) {
    if (!id) {
        widgetData.forEach(({ id: item }) => render(item));
        return;
    }

    // 当前插件数据
    let widget = widgets.find(({ id: item }) => id === item);

    // 插件已经存在，则跳过
    if (widget) {
        return;
    }

    // 插件还不存在，则创建
    const data = widgetData.find(({ id: item }) => item === id);

    if (!data) {
        warn(`Can not find this Widget Config: ${id}`);
        return;
    }

    switch (data.type) {
        case WidgetType.Checkbox:
            widget = new Checkbox(data);
            break;
        // case WidgetType.Customerchat:
        //     widget = new Customerchat(data);
        //     break;
        // case WidgetType.MessageUs:
        //     widget = new MessageUs(data);
        //     break;
        // case WidgetType.SendToMessenger:
        //     widget = new SendToMessenger(data);
        //     break;
        // case WidgetType.ShareButton:
        //     widget = new ShareButton(data);
        //     break;
        case WidgetType.Discount:
            widget = new Discount(data);
            break;
        default:
            log(`Invalid plugin type: ${(data as any).type}, skip`);
            return;
    }

    // 渲染
    widget.parse();

    if (widget.canRender) {
        widgets.push(widget);
    }
}

export default {
    render,
};
