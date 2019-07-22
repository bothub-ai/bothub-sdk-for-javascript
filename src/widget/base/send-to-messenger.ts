import { post } from 'src/lib/http';
import { log, warn } from 'src/lib/print';
import { messengerAppId } from 'src/store';
import { SendToMessengerEvent } from 'typings/facebook';
import { addClass, setAttributes } from 'src/lib/dom';
import { shallowCopy } from 'src/lib/object';
import { isFunc, isObject } from 'src/lib/assert';

import { WidgetType } from '../helper';
import { BaseWidget, WidgetDataCommon } from './base';

import uuid from 'uuid';

/**
 * 引用编译元数据
 *  - 因为点击之后会自动将此处信息发送至 facebook
 *  - 所以这里也能理解为是向 facebook 发送的数据接口
 */
interface RefData {
    /** 数据编号 */
    id?: string;
    /** 数据类型 */
    type?: 'feed' | 'receipt';
    /** 插件事件标记 */
    gateway: 'engagement';
    /** 插件编号 */
    code: string;
}

/** 附带的元数据 */
interface MessageMeta {
    /** 数据类型 */
    type: 'feed' | 'receipt';
    /** 完整数据 */
    data: AnyObject;
}

/** Send to Messenger 事件名称 */
enum EventName {
    click = 'click',
    login = 'login',
    notYou = 'notYou',
    rendered = 'rendered',
}

/** 发送给 bothub 的完整数据 */
type BothubMessage = Required<RefData> & MessageMeta & {
    page_id: string;
};

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

    /** 附带的数据 */
    message?: MessageMeta | (() => MessageMeta);

    /** 点击事件 */
    [EventName.click]?(): void;
    /** 登录完成事件 */
    [EventName.login]?(): void;
    /** 更换当前登录账号事件 */
    [EventName.notYou]?(): void;
    /** 渲染完成事件 */
    [EventName.rendered]?(): void;
}

/** facebook “发送至 Messenger”插件属性 */
export type FbSendToMessengerAttrs = Pick<SendToMessengerData, 'color' | 'size' | 'enforceLogin' | 'ctaText' | 'pageId'>;

const fbClass = 'fb-send-to-messenger';
const bhClass = 'bothub-send-to-messenger';

/**
 * [“发送至 Messenger”插件](https://developers.facebook.com/docs/messenger-platform/discovery/send-to-messenger-plugin/)
 */
export default class SendToMessenger extends BaseWidget<SendToMessengerData> {
    fbAttrs!: FbSendToMessengerAttrs;

    /** 是否已经发送数据 */
    sent = false;
    /** 每次事件生成的唯一编号 */
    message?: BothubMessage;

    constructor(data: SendToMessengerData) {
        super(data);

        this.init();
        this.check();
    }

    /** 引用编译 */
    get ref() {
        const { code, message } = this;

        const data: RefData = {
            code,
            gateway: 'engagement',
        };

        if (message) {
            data.id = message.id;
            data.type = message.type;
        }

        return `base64:${window.btoa(JSON.stringify(data))}`;
    }

    init() {
        const { origin } = this;

        this.message = this.getMessage();
        this.fbAttrs = shallowCopy(origin, ['color', 'size', 'enforceLogin', 'ctaText', 'pageId']);

        this.off();
        this.on(EventName.click, origin[EventName.click]);
        this.on(EventName.login, origin[EventName.login]);
        this.on(EventName.notYou, origin[EventName.notYou]);
        this.on(EventName.rendered, origin[EventName.rendered]);

        // 发送消息之后，状态位赋值
        this.on('click', () => this.sent = true);
        // 如果包含有信息，则渲染完成之后发送完整信息
        this.on('rendered', () => {
            const { message } = this;

            if (message) {
                post('tr/', message).then(() => this.sent = true);
            }
        });
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

                if (ev.event === 'rendered' && !this.isRendered) {
                    log(`${this.name} Plugin with ID ${this.id} has been rendered`);
                    this.isRendered = true;
                    this.emit(EventName.rendered);
                }
                else if (ev.event === 'clicked') {
                    this.emit(EventName.click);
                }
                else if (ev.event === 'not_you') {
                    this.emit(EventName.notYou);
                }
                else if (ev.event === 'opt_in') {
                    this.emit(EventName.login);
                }
            });
        }
    }
    /** 当前插件附带的数据转换为标准格式 */
    getMessage() {
        const { message, pageId } = this.origin;

        if (!message) {
            return;
        }

        let data: MessageMeta;

        if (isFunc(message)) {
            data = message();

            if (!data) {
                return;
            }
        }
        else if (isObject(message)) {
            data = message;
        }
        else {
            return;
        }

        return {
            ...data,
            code: this.code,
            page_id: pageId as string,
            gateway: 'engagement' as const,
            id: uuid(),
        };
    }
}
