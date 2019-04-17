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

/** 获取并创建本体以及包装 */
function getWarpperById(name: string, id: string) {
    const warpper = document.getElementById(id);

    // 未找到包装的 DOM
    if (!warpper) {
        renderWarn(name, id);
        return {};
    }

    addClass(warpper, 'WarpperClassName');

    const dom = Boolean(warpper.firstElementChild)
        ? warpper.firstElementChild
        : warpper.appendChild(document.createElement('div'));

    return { warpper, dom };
}

function renderDom(...args: Parameters<FacebookSDK['XFBML']['parse']>) {
    if (window.FB) {
        window.FB.XFBML.parse(...args);
    }
}

function setAttributes<
    U extends Type.WidgetData,
    T extends keyof U
>(dom: Element, data: U, props: T[]) {
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
 * 确认框插件渲染
 * @link https://developers.facebook.com/docs/messenger-platform/reference/web-plugins#checkbox
 */
function renderCheckbox(data: Type.CheckboxData) {
    const { warpper, dom } = getWarpperById('Checkbox', data.id);

    if (!warpper || !dom) {
        return;
    }

    addClass(dom, Type.WidgetFbClass[Type.WidgetType.Checkbox]);
    addClass(dom, Type.WidgetBhClass[Type.WidgetType.Checkbox]);

    dom.setAttribute('origin', location.origin);
    dom.setAttribute('data-ref', window.btoa(data.id));
    dom.setAttribute('user_ref', Utils.getUserRef(true));
    dom.setAttribute('messenger_app_id', Store.messengerAppId);

    setAttributes(dom, data, ['pageId', 'allowLogin', 'size', 'skin', 'centerAlign']);

    renderDom(warpper);
}

/**
 * 顾客聊天插件渲染
 * @link https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/
 */
function renderCustomerchat(data: Type.CustomerchatData) {
    if (document.getElementById(data.id)) {
        Print.warn('Skip Customerchat Plugin render again.');
        return;
    }

    const warpper = document.createElement('div');
    const dom = document.createElement('div');

    warpper.appendChild(dom);
    document.body.appendChild(warpper);

    addClass(dom, Type.WidgetFbClass[Type.WidgetType.Customerchat]);
    addClass(dom, Type.WidgetBhClass[Type.WidgetType.Customerchat]);

    setAttributes(dom, data, ['pageId']);

    renderDom(warpper);
}

/**
 * “给我们发消息”插件
 * @link https://developers.facebook.com/docs/messenger-platform/discovery/message-us-plugin
 */
function renderMessageUs(data: Type.MessageUsData) {
    const warpper = document.getElementById(data.id);

    if (!warpper) {
        renderWarn('Message Us', data.id);
        return;
    }

    const dom = warpper.appendChild(document.createElement('div'));

    addClass(dom, Type.WidgetFbClass[Type.WidgetType.MessageUs]);
    addClass(dom, Type.WidgetBhClass[Type.WidgetType.MessageUs]);

    setAttributes(dom, data, ['size', 'color']);

    renderDom(warpper);
}

/**
 * “发送至 Messenger”插件渲染
 * @link https://developers.facebook.com/docs/messenger-platform/discovery/send-to-messenger-plugin/
 */
function renderSendToMessenger(data: Type.SendToMessengerData) {
    const warpper = document.getElementById(data.id);

    if (!warpper) {
        renderWarn('Send To Messenger', data.id);
        return;
    }

    const dom = warpper.appendChild(document.createElement('div'));

    addClass(dom, Type.WidgetFbClass[Type.WidgetType.SendToMessenger]);
    addClass(dom, Type.WidgetBhClass[Type.WidgetType.SendToMessenger]);

    setAttributes(dom, data, ['size', 'color', 'enforceLogin']);

    dom.setAttribute('data-ref', window.btoa(data.id));

    renderDom(warpper);
}

/**
 * 砍价插件渲染
 * @link
 */
function renderDiscount(data: Type.DiscountData) {

}

/** 渲染函数 */
function render(id?: string) {
    if (!id) {
        Store.widgets.forEach(({ id: item }) => render(item));
        return;
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
