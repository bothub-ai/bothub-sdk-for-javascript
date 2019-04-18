import { addClass } from 'src/lib/dom';
import { log, warn } from 'src/lib/print';

import {
    WidgetCommon,
    WidgetDataCommon,
    WidgetType,
    setAttributes,
    renderDom,
} from '../helper';

/** 顾客聊天插件数据接口 */
export interface CustomerchatData extends WidgetDataCommon {
    /** 聊天插件类型 */
    type: WidgetType.Customerchat;
    /** 主题颜色 */
    themeColor?: string;
    /**
     * 对当前已登录 Facebook 的用户显示的欢迎语
     * 不超过 80 个字符
     */
    loggedInGreeting?: string;
    /**
     * 对当前未登录 Facebook 的用户显示的欢迎语
     * 不超过 80 个字符
     */
    loggedOutGreeting?: string;
    /**
     * 设置欢迎对话框的显示方式，支持下列值：
     *  - `show`：通过 greeting_dialog_delay 属性设置延迟多少秒才在桌面端和移动端显示欢迎对话框，并保持开启
     *  - `hide`：欢迎对话框将一直隐藏，除非用户在桌面端和移动端点击插件才会显示
     *  - `fade`：通过 greeting_dialog_delay 属性设置延迟多少秒才短暂显示欢迎对话框，之后使其淡出，并在桌面端隐藏。对话框会在移动端隐藏
     */
    greetingDialogDisplay?: 'show' | 'hide' | 'fade';
    /** 设置插件加载后延迟多少秒才显示欢迎对话框 */
    greetingDialogDelay?: number;
}

const fbClass = 'fb-customerchat';
const bhClass = 'bothub-customerchat';

/**
 * 顾客聊天插件渲染
 * @link https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/
 */
export default class Customerchat implements WidgetCommon {
    id: string;
    type: WidgetType.Customerchat;
    attrs: Omit<CustomerchatData, 'id' | 'type'>;

    canRender = true;
    isRendered = false;

    constructor({ id, type, ...attrs }: CustomerchatData) {
        this.id = id;
        this.type = type;
        this.attrs = attrs;
    }

    render() {
        if (this.isRendered) {
            return;
        }

        if (document.getElementById(this.id)) {
            warn('Customerchat Plugin was already rendered, skip.');
            this.canRender = false;
            return;
        }

        const warpper = document.createElement('div');
        const dom = document.createElement('div');

        warpper.appendChild(dom);
        document.body.appendChild(warpper);

        addClass(dom, fbClass);
        addClass(dom, bhClass);

        setAttributes(dom, this.attrs);

        renderDom(warpper, () => {
            log(`Customerchat Plugin with ID ${this.id} has been rendered.'`);
            this.isRendered = true;
        });
    }
}
