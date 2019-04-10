import * as Type from './type';
import * as Store from 'src/store';
import * as Print from 'src/lib/print';
import * as Utils from 'src/lib/utils';

import { addClass } from 'src/lib/dom';

export * from './type';

function renderWarn(name: string, id: string) {
    Print.warn(
        `Rendering ${name} Plugin, ` +
        `but can not find the element with ID: ${id}`,
    );
}

function renderDom(...args: Parameters<FacebookSDK['XFBML']['parse']>) {
    if ((window as any).FB) {
        FB.XFBML.parse(...args);
    }
}

function setAttributes<
    U extends Type.WidgetData,
    T extends keyof U
>(dom: HTMLElement, data: U, props: T[]) {
    props.forEach((key) => {
        const name = (key as string).replace(/([A-Z])/g, (_, item1: string) => {
            return `_${item1.toLowerCase()}`;
        });

        if (data[key]) {
            dom.setAttribute(name, String(data[key]));
        }
    });
}

/**
 * Checkbox 渲染
 * @link https://developers.facebook.com/docs/messenger-platform/reference/web-plugins#checkbox
 */
function renderCheckbox(data: Type.CheckboxData) {
    const dom = document.getElementById(data.id);

    if (!dom) {
        renderWarn('Checkbox', data.id);
        return;
    }

    addClass(dom, Type.WidgetFbClass[Type.WidgetType.Checkbox]);
    addClass(dom, Type.WidgetBhClass[Type.WidgetType.Checkbox]);

    dom.setAttribute('origin', location.origin);
    dom.setAttribute('data-ref', window.btoa(data.id));
    dom.setAttribute('user_ref', Utils.getUserRef(true));
    dom.setAttribute('messenger_app_id', Store.messengerAppId);

    setAttributes(dom, data, ['pageId', 'allowLogin', 'size', 'skin', 'centerAlign']);
}

/**
 * Customerchat 渲染
 * @link https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/
 */
function renderCustomerchat(data: Type.CustomerchatData) {
    let dom = document.getElementById(data.id);

    if (!dom) {
        dom = document.createElement('div');
        document.body.appendChild(dom);
    }

    addClass(dom, Type.WidgetFbClass[Type.WidgetType.Customerchat]);
    addClass(dom, Type.WidgetBhClass[Type.WidgetType.Customerchat]);

    setAttributes(dom, data, ['pageId']);

    renderDom(dom);
}

/**
 * Message Us 渲染
 * @link https://developers.facebook.com/docs/messenger-platform/discovery/message-us-plugin
 */
function renderMessageUs(data: Type.MessageUsData) {
    const dom = document.getElementById(data.id);

    if (!dom) {
        renderWarn('Message Us', data.id);
        return;
    }

    setAttributes(dom, data, ['size', 'color']);
}

function renderSendToMessenger(data: Type.SendToMessengerData) {
    const dom = document.getElementById(data.id);

    if (!dom) {
        renderWarn('Send To Messenger', data.id);
        return;
    }

    dom.setAttribute('data-ref', window.btoa(data.id));
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
        Print.warn(`Can not find this Widget Config: ${id}`);
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
            Print.log(`Invalid plugin type: ${(data as any).type}, skip.`);
    }
}

export default {
    render,
};
