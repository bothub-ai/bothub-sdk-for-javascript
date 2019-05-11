import { WidgetType } from './helper';
import { log, warn } from 'src/lib/print';
import { widgetData, widgets, pageId } from 'src/store';
import { isDef, isNumber, isArray, isBoolean } from 'src/lib/assert';

import { default as Discount, DiscountData } from './discount';
import { default as Checkbox, CheckboxData } from './base/checkbox';
import { default as MessageUs, MessageUsData } from './base/message-us';
import { default as ShareButton, ShareButtonData } from './base/share-button';
import { default as Customerchat, CustomerchatData } from './base/customerchat';
import { default as SendToMessenger, SendToMessengerData } from './base/send-to-messenger';

// 分别导出
export {
    DiscountData,
    CheckboxData,
    MessageUsData,
    ShareButtonData,
    CustomerchatData,
    SendToMessengerData,
};

/** 插件类 */
export type Widget =
    Checkbox | Discount | MessageUs | Customerchat |
    SendToMessenger | ShareButton;

/** 插件标准数据 */
export type WidgetData =
    CheckboxData | MessageUsData | DiscountData | CustomerchatData |
    SendToMessengerData | ShareButtonData;

/** 插件输入数据类型 */
export interface InputWidgetData extends Omit<WidgetData, 'type' | 'pageId'> {
    type: WidgetType | keyof typeof WidgetType;
    pageId?: WidgetData['pageId'];
}

/** 插件类型全部映射到数字 */
const fixWidgetData = (item: InputWidgetData): WidgetData => {
    // 如果数据未填写页面编号，则使用全局编号
    if (!item.pageId) {
        item.pageId = pageId;
    }

    // 全部转换为内部数字枚举类型
    if (isDef(item.type)) {
        return isNumber(item.type) ? item : {
            ...item,
            type: WidgetType[item.type],
        } as any;
    }
    else {
        return item as any;
    }
};

/** 设置插件属性 */
export function setConfig(config: InputWidgetData | InputWidgetData[]) {
    const data = isArray(config) ? config : [config];

    data.forEach((item) => {
        // 原始数据
        const origin = widgetData.find(({ id: local }) => local === item.id);

        // 找到编号重复的插件，合并
        if (origin) {
            Object.assign(origin, fixWidgetData(item));
        }
        // 未找到编号重复的插件，则添加新插件
        else {
            widgetData.push(fixWidgetData(item));
        }

        // 已渲染插件
        const widget = widgets.find(({ id: local }) => local === item.id);

        if (widget) {
            widget.init();
            widget.check();
        }
    });
}

/** 渲染插件 */
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

/** 销毁插件 */
export function destroy(id?: string) {
    if (!id) {
        widgets.forEach(({ id: local }) => destroy(local));
        return;
    }

    // 当前插件数据
    const widget = widgets.find(({ id: local }) => id === local);

    // 插件不存在
    if (!widget) {
        warn(`Can not find this Plugin with id ${id}`);
        return;
    }

    // 销毁插件
    widget.destroy();
}
