import { log, warn } from 'src/lib/print';
import { messengerAppId } from 'src/store';
import { addClass, setAttributes } from 'src/lib/dom';
import { SendToMessengerEvent } from 'typings/facebook';

import { WidgetType } from '../helper';
import { BaseWidget, WidgetCommon, WidgetDataCommon } from './base';

/** “发送至 Messenger”插件 */
export interface SendToMessengerData extends WidgetDataCommon {
    /** “发送至 Messenger”插件类型 */
    type: WidgetType.SendToMessenger;
    /**
     * 主题颜色
     *  - 默认为`blue`
     */
    color?: 'blue' | 'white';
    /**
     * 插件大小
     *  - 默认为`large`
     */
    size?: 'standard' | 'large' | 'xlarge';
    /**
     * 如果为 true，则点击该按钮时，
     * 已登录用户必须重新登录，
     * 默认为`false`
     */
    enforceLogin?: boolean;
    /**
     * 按钮文本
     *  - 默认为空
     */
    ctaText?:
        'GET_THIS_IN_MESSENGER' | 'RECEIVE_THIS_IN_MESSENGER' | 'SEND_THIS_TO_ME' | 'GET_CUSTOMER_ASSISTANCE' |
        'GET_CUSTOMER_SERVICE' | 'GET_SUPPORT' | 'LET_US_CHAT' | 'SEND_ME_MESSAGES' | 'ALERT_ME_IN_MESSENGER' |
        'SEND_ME_UPDATES' | 'MESSAGE_ME' | 'LET_ME_KNOW' | 'KEEP_ME_UPDATED' | 'TELL_ME_MORE' | 'SUBSCRIBE_IN_MESSENGER' |
        'SUBSCRIBE_TO_UPDATES' | 'GET_MESSAGES' | 'SUBSCRIBE' | 'GET_STARTED_IN_MESSENGER' | 'LEARN_MORE_IN_MESSENGER' | 'GET_STARTED';
    /**
     * 点击事件
     */
    click?(): void;
}

const fbClass = 'fb-send-to-messenger';
const bhClass = 'bothub-send-to-messenger';

/**
 * [“发送至 Messenger”插件](https://developers.facebook.com/docs/messenger-platform/discovery/send-to-messenger-plugin/)
 */
export default class SendToMessenger extends BaseWidget implements WidgetCommon {
    fbAttrs: Omit<SendToMessengerData, 'id' | 'type' | 'bhRef' | 'click'>;

    canRender = true;
    isRendered = false;

    /** 是否已经发送数据 */
    sent = false;

    $el?: HTMLElement;

    /** 点击事件 */
    onClick?(): void;

    constructor({ id, type, bhRef, click, ...attrs }: SendToMessengerData) {
        super(arguments[0]);

        this.onClick = click;
        this.fbAttrs = attrs;

        this.$el = this.renderWarpperById();
        this.canRender = Boolean(this.$el);
    }

    parse(focus = false) {
        if ((!focus && this.isRendered) || !this.canRender || !this.$el) {
            log(`Skip ${this.name} with id ${this.id}`);
            return;
        }

        /** 是否是重复渲染 */
        const alreadyRender = this.isRendered;
        const dom = this.$el.firstElementChild!;

        this.sent = false;
        this.isRendered = false;

        addClass(dom, fbClass);
        addClass(dom, bhClass);

        setAttributes(dom, this.fbAttrs);

        dom.setAttribute('data-ref', window.btoa(this.id));
        dom.setAttribute('messenger_app_id', messengerAppId);

        window.FB.XFBML.parse(this.$el);

        // 绑定事件
        if (!alreadyRender) {
            window.FB.Event.subscribe('send_to_messenger', (ev: SendToMessengerEvent) => {
                if (!ev.ref) {
                    warn(`Can not found 'ref' attrubite in this '${this.name}' Plugin`, true);
                    return;
                }

                const getId = window.atob(ev.ref);

                if (getId !== this.id) {
                    return;
                }

                if (ev.event === 'rendered') {
                    this.isRendered = true;
                    log(`${this.name} Plugin with ID ${this.id} has been rendered`);
                }
                else if (ev.event === 'clicked' && this.onClick) {
                    this.sent = true;
                    this.onClick();
                }
            });
        }
    }
}
