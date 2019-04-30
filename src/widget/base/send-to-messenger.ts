import { post } from 'src/lib/http';
import { log, warn } from 'src/lib/print';
import { messengerAppId } from 'src/store';
import { isFunc, isObject } from 'src/lib/assert';
import { shallowCopyExclude } from 'src/lib/object';
import { addClass, setAttributes } from 'src/lib/dom';
import { SendToMessengerEvent } from 'typings/facebook';

import { WidgetType } from '../helper';
import { BaseWidget, WidgetDataCommon } from './base';

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
     * 向后端发送的事件
     *  - 允许是常量对象也允许是函数
     *  - 内容信息将会和插件 code 合并然后经 base64 编码后发送到 facebook
     *  - 此插件发送事件是默认的，只要点击就会发送，所以即便此项为空，仍然会向 facebook 发送事件
     */
    message?: AnyObject | (() => AnyObject);
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
export default class SendToMessenger extends BaseWidget<SendToMessengerData> {
    fbAttrs!: Omit<SendToMessengerData, 'id' | 'type' | 'message' | 'click'>;

    /** 是否已经发送数据 */
    sent = false;

    constructor(data: SendToMessengerData) {
        super(data);

        this.init();
        this.check();
    }

    /** 引用编译 */
    get ref() {
        const data: AnyObject = {
            gateway: 'engagement',
            code: this.code,
        };

        const { message } = this.origin;

        if (isFunc(message)) {
            data.message = message() || {};
        }
        else if (isObject(message)) {
            data.message = message || {};
        }

        return window.btoa(JSON.stringify(data));
    }

    /** 点击事件 */
    onClick() {
        if (this.origin.click) {
            this.origin.click();
        }
    }
    /** 渲染完成事件 */
    onRendered() {
        if (this.origin.message) {
            post('tr/', this.origin.message);
        }
    }

    init() {
        this.fbAttrs = shallowCopyExclude(this.origin, ['id', 'type', 'message', 'click']);
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

        dom.setAttribute('data-ref', this.ref);
        dom.setAttribute('messenger_app_id', messengerAppId);

        window.FB.XFBML.parse(this.$el);

        // 绑定事件
        if (!alreadyRender) {
            window.FB.Event.subscribe('send_to_messenger', (ev: SendToMessengerEvent) => {
                if (!ev.ref) {
                    warn(`Can not found 'ref' attrubite in this '${this.name}' Plugin`, true);
                    return;
                }

                if (ev.ref !== this.ref) {
                    return;
                }

                if (ev.event === 'rendered') {
                    this.isRendered = true;
                    this.onRendered();
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
