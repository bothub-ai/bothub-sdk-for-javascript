import * as Type from './type';
import * as Store from 'src/store';

import { log } from 'src/lib/error';
export { WidgetData } from './type';

function warn(name: string, id: string) {
    console.warn(
        `(Bothub) Rendering ${name} Plugin, ` +
        `but can not find the element with ID: ${id}`,
    );
}

function renderCheckbox(data: Type.CheckboxData) {

}

function renderCustomerchat(data: Type.CustomerchatData) {
    // ..
}

function renderMessageUs(data: Type.MessageUsData) {
    const dom = document.getElementById(data.id);

    if (!dom) {
        warn('Message Us', data.id);
        return;
    }

    dom.setAttribute('size', data.size);
    dom.setAttribute('color', data.color);
}

function renderSendToMessenger(data: Type.SendToMessengerData) {

}

function renderDiscount(data: Type.DiscountData) {

}

/** 渲染函数 */
function render(id?: string) {
    if (!id) {
        Store.widgets.forEach(({ id: item }) => render(item));
    }

    const data = Store.widgets.find(({ id: item }) => item === id);

    if (!data) {
        console.warn(`(Bothub) Can not find this config by: ${id}`);
        return;
    }

    switch (data.type) {
        case Type.WidgetType.Checkbox:
            renderCheckbox(data);
            break;
        case Type.WidgetType.Customerchat:
            renderCustomerchat(data);
            break;
        case Type.WidgetType.MessageUs:
            renderMessageUs(data);
            break;
        case Type.WidgetType.SendToMessenger:
            renderSendToMessenger(data);
            break;
        case Type.WidgetType.Discount:
            renderDiscount(data);
            break;
        default:
            log(`Invalid plugin type: ${(data as any).type}, skip.`);
    }
}

export default {
    render,
};
