import { log } from 'src/lib/print';
import { addClass, setAttributes } from 'src/lib/dom';
import { messengerAppId } from 'src/store';

import {
    BaseWidget,
    WidgetDataCommon,
    WidgetType,
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
 * [“给我们发消息”插件](https://developers.facebook.com/docs/messenger-platform/discovery/message-us-plugin)
 */
export default class MessageUs implements BaseWidget {
    id: string;
    type: WidgetType.MessageUs;
    fbAttrs: Omit<MessageUsData, 'id' | 'type'>;

    canRender = true;
    isRendered = false;

    $el?: HTMLElement;

    constructor({ id, type, ...attrs }: MessageUsData) {
        this.id = id;
        this.type = type;
        this.fbAttrs = attrs;

        this.$el = getWarpperById('Message Us', this.id);
        this.canRender = Boolean(this.$el);
    }

    parse(focus = false) {
        if ((!focus && this.isRendered) || !this.canRender || !this.$el) {
            log(`Skip Message Us with id ${this.id}`);
            return;
        }

        this.isRendered = false;

        const dom = this.$el.firstElementChild!;

        addClass(dom, fbClass);
        addClass(dom, bhClass);

        setAttributes(dom, this.fbAttrs);

        dom.setAttribute('messenger_app_id', messengerAppId);

        window.FB.XFBML.parse(this.$el, () => {
            log(`Message Us Plugin with ID ${this.id} has been rendered`);
            this.isRendered = true;
        });
    }
}
