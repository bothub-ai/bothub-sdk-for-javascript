import { log, warn } from 'src/lib/print';
import { addClass, removeDom, setAttributes } from 'src/lib/dom';

import { WidgetType } from '../helper';
import { BaseWidget, WidgetDataCommon } from './base';

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

/** facebook “给我们发消息”插件属性 */
export type FbCustomerchatAttrs = Omit<CustomerchatData, 'id' | 'type'>;

const fbClass = 'fb-customerchat';
const bhClass = 'bothub-customerchat';

/**
 * [顾客聊天插件](https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/)
 */
export default class Customerchat extends BaseWidget<CustomerchatData> {
    fbAttrs!: FbCustomerchatAttrs;

    constructor(data: CustomerchatData) {
        super(data);

        this.init();
        this.check();
    }

    check() {
        this.canRender = true;

        if (!this.checkRequired()) {
            this.canRender = false;
            return;
        }

        // 网页只能有一个对话插件
        if (
            !this.isRendered &&
            (
                document.getElementsByClassName(fbClass).length !== 0 ||
                document.getElementsByClassName(bhClass).length !== 0
            )
        ) {
            warn(`There are already other ${this.name} plugins in this page, skip the widget with id ${this.id}`);
            this.canRender = false;
            return;
        }
    }
    parse() {
        if ((!focus && this.isRendered) || !this.canRender) {
            log(`Skip ${this.name} with id ${this.id}`);
            return;
        }

        // 重新渲染时需要移除以前的元素
        if (this.isRendered) {
            removeDom('div[class*=fb_customer_chat]');
        }

        this.isRendered = false;

        let warpper: Element | undefined = void 0;

        if (!this.$el) {
            // 首次加载需要一个临时的包装器
            warpper = document.body.appendChild(document.createElement('div'));
            this.$el = warpper.appendChild(document.createElement('div'));
        }

        // 之后的刷新过程，这个包装器并非我们在首次加载时手动加上的
        if (!warpper) {
            warpper = this.$el.parentElement!;
        }

        addClass(this.$el, fbClass);
        addClass(this.$el, bhClass);

        setAttributes(this.$el, this.fbAttrs);

        window.FB.XFBML.parse(warpper, () => {
            log(`${this.name} Plugin with ID ${this.id} has been rendered`);
            this.isRendered = true;
            this.emit('rendered');
        });
    }
}
