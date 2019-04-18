import { log } from 'src/lib/print';
import { addClass } from 'src/lib/dom';
import { messengerAppId } from 'src/store';

import {
    WidgetCommon,
    WidgetDataCommon,
    WidgetType,
    setAttributes,
    renderDom,
    getWarpperById,
} from '../helper';

/** “给我们发消息”插件 */
export interface MessageUsData extends WidgetDataCommon {
    /** “给我们发消息”插件类型 */
    type: WidgetType.MessageUs;
    /**
     * 主题颜色
     *  - 默认为`blue`
     */
    color: 'blue' | 'white';
    /**
     * 插件大小
     *  - 默认为`large`
     */
    size: 'standard' | 'large' | 'xlarge';
}

const fbClass = 'fb-messengermessageus';
const bhClass = 'bothub-messengermessageus';

/**
 * “给我们发消息”插件
 * @link https://developers.facebook.com/docs/messenger-platform/discovery/message-us-plugin
 */
export default class MessageUs implements WidgetCommon {
    id: string;
    type: WidgetType.MessageUs;
    attrs: Omit<MessageUsData, 'id' | 'type'>;

    canRender = true;
    isRendered = false;

    constructor({ id, type, ...attrs }: MessageUsData) {
        this.id = id;
        this.type = type;
        this.attrs = attrs;
    }

    render() {
        if (this.isRendered) {
            return;
        }

        const { warpper, dom } = getWarpperById('Message Us', this.id);

        if (!warpper || !dom) {
            this.canRender = false;
            return;
        }

        addClass(dom, fbClass);
        addClass(dom, bhClass);

        setAttributes(dom, this.attrs);

        dom.setAttribute('messenger_app_id', messengerAppId);

        renderDom(warpper, () => {
            log(`Message Us Plugin with ID ${this.id} has been rendered`);
            this.isRendered = true;
        });
    }
}
