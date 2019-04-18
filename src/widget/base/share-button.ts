import { addClass } from 'src/lib/dom';
import { log } from 'src/lib/print';

import {
    WidgetCommon,
    WidgetDataCommon,
    WidgetType,
    setAttributes,
    renderDom,
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
 * 分享按钮插件
 * @link https://developers.facebook.com/docs/plugins/share-button/
 */
export default class ShareButton implements WidgetCommon {
    id: string;
    type: WidgetType.ShareButton;
    attrs: Omit<ShareButtonData, 'id' | 'type'>;

    canRender = true;
    isRendered = false;

    constructor({ id, type, ...attrs }: ShareButtonData) {
        this.id = id;
        this.type = type;
        this.attrs = attrs;
    }

    render() {
        if (this.isRendered) {
            return;
        }

        const { warpper, dom } = getWarpperById('Share Button', this.id);

        if (!warpper || !dom) {
            this.canRender = false;
            return;
        }

        addClass(dom, fbClass);
        addClass(dom, bhClass);

        setAttributes(dom, this.attrs, ['size', 'layout', 'href']);

        renderDom(warpper, () => {
            log(`Share Button Plugin with ID ${this.id} has been rendered`);
            this.isRendered = true;
        });
    }
}
