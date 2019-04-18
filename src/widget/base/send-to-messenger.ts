import { addClass } from 'src/lib/dom';
import { log, warn } from 'src/lib/print';
import { messengerAppId } from 'src/store';

import {
    WidgetCommon,
    WidgetDataCommon,
    WidgetType,
    setAttributes,
    renderDom,
    getWarpperById,
} from '../helper';

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
 * “发送至 Messenger”插件
 * @link https://developers.facebook.com/docs/messenger-platform/discovery/send-to-messenger-plugin/
 */
export default class SendToMessenger implements WidgetCommon {
    id: string;
    type: WidgetType.SendToMessenger;
    attrs: Omit<SendToMessengerData, 'id' | 'type' | 'click'>;

    canRender = true;
    isRendered = false;

    /** 点击事件 */
    onClick?(): void;

    constructor({ id, type, click, ...attrs }: SendToMessengerData) {
        this.id = id;
        this.type = type;
        this.onClick = click;
        this.attrs = attrs;
    }

    render() {
        if (this.isRendered) {
            return;
        }

        const { warpper, dom } = getWarpperById('Send To Messenger', this.id);

        if (!warpper || !dom) {
            this.canRender = false;
            return;
        }

        addClass(dom, fbClass);
        addClass(dom, bhClass);

        setAttributes(dom, this.attrs);

        dom.setAttribute('data-ref', window.btoa(this.id));
        dom.setAttribute('messenger_app_id', messengerAppId);

        renderDom(warpper);

        // 绑定事件
        window.FB.Event.subscribe('send_to_messenger', (ev: FacebookSendToMessengerEvent) => {
            if (!ev.ref) {
                warn('Can not found \'ref\' attrubite in this \'Send To Messenger\' Plugin.', true);
                return;
            }

            const getId = window.atob(ev.ref);

            if (getId !== this.id) {
                return;
            }

            if (ev.event === 'rendered') {
                log(`Send To Messenger Plugin with ID ${this.id} has been rendered.'`);
                this.isRendered = true;
            }
            else if (ev.event === 'clicked' && this.onClick) {
                this.onClick();
            }
        });
    }
}
