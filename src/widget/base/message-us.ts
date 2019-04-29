import { log } from 'src/lib/print';
import { addClass, setAttributes } from 'src/lib/dom';
import { messengerAppId } from 'src/store';

import { WidgetType } from '../helper';
import { BaseWidget, WidgetCommon, WidgetDataCommon } from './base';

/** “给我们发消息”插件 */
export interface MessageUsData extends WidgetDataCommon {
    /** “给我们发消息”插件类型 */
    type: WidgetType.MessageUs;
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
}

const fbClass = 'fb-messengermessageus';
const bhClass = 'bothub-messengermessageus';

/**
 * [“给我们发消息”插件](https://developers.facebook.com/docs/messenger-platform/discovery/message-us-plugin)
 */
export default class MessageUs extends BaseWidget<MessageUsData> implements WidgetCommon {
    fbAttrs: Omit<MessageUsData, 'id' | 'type' | 'bhRef'>;

    constructor({ id, type, bhRef, ...attrs }: MessageUsData) {
        super(arguments[0]);

        this.check();
        this.fbAttrs = attrs;
    }

    parse(focus = false) {
        if ((!focus && this.isRendered) || !this.canRender || !this.$el) {
            log(`Skip ${this.name} with id ${this.id}`);
            return;
        }

        this.isRendered = false;

        const dom = this.$el.firstElementChild!;

        addClass(dom, fbClass);
        addClass(dom, bhClass);

        setAttributes(dom, this.fbAttrs);

        dom.setAttribute('messenger_app_id', messengerAppId);

        window.FB.XFBML.parse(this.$el, () => {
            log(`${this.name} Plugin with ID ${this.id} has been rendered`);
            this.isRendered = true;
        });
    }
}
