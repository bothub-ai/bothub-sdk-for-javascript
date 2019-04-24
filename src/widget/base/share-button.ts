import { log } from 'src/lib/print';
import { addClass, setAttributes } from 'src/lib/dom';

import {
    BaseWidget,
    WidgetDataCommon,
    WidgetType,
    getWarpperById,
} from '../helper';

/** 分享按钮插件 */
export interface ShareButtonData extends Omit<WidgetDataCommon, 'pageId'> {
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
export default class ShareButton implements BaseWidget {
    id: string;
    type: WidgetType.ShareButton;
    fbAttrs: Omit<ShareButtonData, 'id' | 'type'>;

    canRender = true;
    isRendered = false;

    $el?: HTMLElement;

    constructor({ id, type, ...attrs }: ShareButtonData) {
        this.id = id;
        this.type = type;
        this.fbAttrs = attrs;

        this.$el = getWarpperById('Share Button', this.id);
        this.canRender = Boolean(this.$el);
    }

    parse(focus = false) {
        if ((!focus && this.isRendered) || !this.canRender || !this.$el) {
            log(`Skip Share Button with id ${this.id}`);
            return;
        }

        this.isRendered = false;

        const dom = this.$el.firstElementChild!;

        addClass(dom, fbClass);
        addClass(dom, bhClass);

        setAttributes(dom, this.fbAttrs, ['size', 'layout', 'href']);

        window.FB.XFBML.parse(this.$el, () => {
            log(`Share Button Plugin with ID ${this.id} has been rendered`);
            this.isRendered = true;
        });
    }
}
