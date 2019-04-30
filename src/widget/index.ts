import { WidgetType } from './helper';
import { log, warn } from 'src/lib/print';
import { widgetData, widgets } from 'src/store';
import { isNumber, isArray, isBoolean } from 'src/lib/assert';

import { default as Checkbox, CheckboxData } from './checkbox';
import { default as Discount, DiscountData } from './discount';
import { default as MessageUs, MessageUsData } from './base/message-us';
import { default as ShareButton, ShareButtonData } from './base/share-button';
import { default as Customerchat, CustomerchatData } from './base/customerchat';
import { default as SendToMessenger, SendToMessengerData } from './base/send-to-messenger';

/** 插件类 */
export type Widget = Checkbox | Discount | MessageUs | Customerchat | SendToMessenger | ShareButton;
/** 插件标准数据 */
export type WidgetData = CheckboxData | MessageUsData | DiscountData | CustomerchatData | SendToMessengerData | ShareButtonData;
/** 插件输入数据类型 */
export type InputWidgetData = Omit<WidgetData, 'type'> & {
    type: WidgetType | keyof typeof WidgetType;
};

/** 插件类型全部映射到数字 */
const toWidgetData = (item: InputWidgetData): WidgetData => {
    return isNumber(item.type) ? item : {
        ...item,
        type: WidgetType[item.type],
    } as any;
};

/** 设置插件属性 */
export function setWidget(config: InputWidgetData | InputWidgetData[]) {
    const data = isArray(config) ? config : [config];

    data.forEach((item) => {
        // 原始数据
        const origin = widgetData.find(({ id: local }) => local === item.id);

        // 找到编号重复的插件，合并
        if (origin) {
            Object.assign(origin, toWidgetData(item));
        }
        // 未找到编号重复的插件，则添加新插件
        else {
            widgetData.push(toWidgetData(item));
        }

        // 已渲染插件
        const widget = widgets.find(({ id: local }) => local === item.id);

        if (widget) {
            widget.init();
        }
    });
}

/** 渲染函数 */
export function render(focus?: boolean): boolean;
export function render(id?: string, focus?: boolean): boolean;
export function render(id?: string | boolean, focus?: boolean) {
    // 没有输入
    if (arguments.length === 0) {
        id = undefined;
        focus = true;
    }
    // 输入一个值
    else if (arguments.length === 1) {
        if (isBoolean(id)) {
            focus = id;
            id = undefined;
        }
        else {
            focus = true;
        }
    }

    if (!id) {
        return widgetData.map(({ id: item }) => render(item, focus)).every((n) => n);
    }

    // 当前插件数据
    let widget = widgets.find(({ id: item }) => id === item);

    // 插件已经存在
    if (widget) {
        // 强制刷新
        if (focus) {
            widget.parse(true);
        }

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
        case WidgetType.Customerchat:
            widget = new Customerchat(data);
            break;
        case WidgetType.MessageUs:
            widget = new MessageUs(data);
            break;
        case WidgetType.SendToMessenger:
            widget = new SendToMessenger(data);
            break;
        case WidgetType.ShareButton:
            widget = new ShareButton(data);
            break;
        case WidgetType.Discount:
            widget = new Discount(data);
            break;
        default:
            log(`Invalid plugin type: ${(data as any).type}, skip`);
            return;
    }

    // 允许渲染
    if (widget.canRender) {
        widgets.push(widget);
        widget.parse();
    }

    return widget.canRender;
}
