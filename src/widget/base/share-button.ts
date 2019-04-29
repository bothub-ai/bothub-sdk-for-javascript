import { log } from 'src/lib/print';
import { addClass, setAttributes } from 'src/lib/dom';

import { WidgetType } from '../helper';
import { BaseWidget, WidgetCommon, WidgetDataCommon } from './base';

/** 分享按钮插件 */
export interface ShareButtonData extends WidgetDataCommon {
    /** 分享按钮插件类型 */
    type: WidgetType.ShareButton;
    /** 待分享页面的绝对网址 */
    href: string;
    /**
     * 按钮布局
     *  - 默认为`icon_link`
     */
    layout?: 'box_count' | 'button_count' | 'button';
    /**
     * 按钮尺寸
     *  - 默认为`small`
     */
    size?: 'large' | 'small';
}

const fbClass = 'fb-share-button';
const bhClass = 'bothub-share-button';

/**
 * [分享按钮插件](https://developers.facebook.com/docs/plugins/share-button/)
 */
export default class ShareButton extends BaseWidget<ShareButtonData> implements WidgetCommon {
    fbAttrs: Omit<ShareButtonData, 'id' | 'type' | 'bhRef'>;

    readonly requiredKeys: (keyof ShareButtonData)[] = ['id', 'type', 'href', 'bhRef'];

    constructor({ id, type, bhRef, ...attrs }: ShareButtonData) {
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

        setAttributes(dom, this.fbAttrs, ['size', 'layout', 'href']);

        window.FB.XFBML.parse(this.$el, () => {
            log(`${this.name} Plugin with ID ${this.id} has been rendered`);
            this.isRendered = true;
        });
    }
}
