import { post } from 'src/lib/http';
import { log, warn } from 'src/lib/print';
import { messengerAppId } from 'src/store';
import { isFunc, isObject } from 'src/lib/assert';
import { SendToMessengerEvent } from 'typings/facebook';
import { addClass, setAttributes } from 'src/lib/dom';
import { shallowCopyExclude } from 'src/lib/object';

import { WidgetType } from '../helper';
import { BaseWidget, WidgetDataCommon } from './base';

/** 向 Bothub 发送的数据格式 */
interface SendBhData {
    /** 数据编号 */
    id: string;
    /** 数据类型 */
    type: 'feed' | 'receipt';
    /** 当前页面在 facebook 的编号 */
    pageId: string;
    /** 完整数据 */
    data: AnyObject;
}

/** 附带的元数据 */
type MessageMeta = Omit<SendBhData, 'pageId'>;

/**
 * 引用编译元数据
 *  - 因为点击之后会自动将此处信息发送至 facebook
 *  - 所以这里也能理解为是向 facebook 发送的数据接口
 */
interface RefData extends Partial<Pick<SendBhData, 'id' | 'type'>> {
    /** 插件事件标记 */
    gateway: 'engagement';
    /** 插件编号 */
    code: string;
}

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
     * 向后端发送事件的元数据
     */
    message?: MessageMeta | (() => MessageMeta);
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

    /** 包含的发送信息 */
    get message(): SendBhData | null {
        const { message } = this.origin;

        if (!message) {
            return null;
        }

        let data: MessageMeta;

        if (isFunc(message)) {
            data = message();

            if (!data) {
                return null;
            }
        }
        else if (isObject(message)) {
            data = message;
        }
        else {
            return null;
        }

        return {
            ...data,
            pageId: this.origin.pageId,
        };
    }
    /** 引用编译 */
    get ref() {
        const { message, code } = this;

        const data: RefData = {
            code,
            gateway: 'engagement',
        };

        if (message) {
            data.id = message.id;
            data.type = message.type;
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
        if (this.message) {
            post('tr/', this.message);
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
