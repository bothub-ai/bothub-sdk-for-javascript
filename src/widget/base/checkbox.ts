import { addClass } from 'src/lib/dom';
import { log, warn } from 'src/lib/print';
import { getUserRef } from 'src/lib/utils';
import { messengerAppId } from 'src/store';

import {
    WidgetCommon,
    WidgetDataCommon,
    WidgetType,
    setAttributes,
    renderDom,
    getWarpperById,
} from '../helper';

/** 确认框插件数据接口 */
export interface CheckboxData extends WidgetDataCommon {
    /** 确认框插件类型 */
    type: WidgetType.Checkbox;
    /**
     * 让用户能够在没有现有会话的情况下登录，同时启用“不是你”选项
     *  - 默认为`true`
     */
    allowLogin?: boolean;
    /**
     * 插件大小
     *  - 默认为`large`
     */
    size?: 'small' | 'medium' | 'large' | 'standard' | 'xlarge';
    /**
     * 插件内容的色彩主题
     *  - `light`：插件显示深色文本
     *  - `dark`：插件显示白色文本、透明 messenger 图标和白色闪电图标
     *  - 默认为`light`
     */
    skin?: 'light' | 'dark';
    /**
     * 插件内容是否居中对齐
     *  - 默认为`false`
     */
    centerAlign?: boolean;
    /**
     * Checkbox 点击选中事件
     * @param {string} userRef 当前用户编号
     */
    check?(userRef: string): void;
    /**
     * Checkbox 点击取消事件
     * @param {string} userRef 当前用户编号
     */
    unCheck?(userRef: string): void;
}

const fbClass = 'fb-messenger-checkbox';
const bhClass = 'bothub-messenger-checkbox';

/**
 * 确认框插件渲染
 * @link https://developers.facebook.com/docs/messenger-platform/reference/web-plugins#checkbox
 */
export default class Checkbox implements WidgetCommon {
    id: string;
    type: WidgetType.Checkbox;
    attrs: Omit<CheckboxData, 'id' | 'type' | 'check' | 'unCheck'>;

    canRender = true;
    isRendered = false;

    /**
     * Checkbox 点击选中事件
     * @param {string} userRef 当前用户编号
     */
    onCheck?(userRef: string): void;
    /**
     * Checkbox 点击取消事件
     * @param {string} userRef 当前用户编号
     */
    onUnCheck?(userRef: string): void;

    constructor({ id, type, check, unCheck, ...attrs }: CheckboxData) {
        this.id = id;
        this.type = type;
        this.onCheck = check;
        this.onUnCheck = unCheck;
        this.attrs = attrs;
    }

    render() {
        if (this.isRendered) {
            return;
        }

        const { warpper, dom } = getWarpperById('Checkbox', this.id);

        if (!warpper || !dom) {
            this.canRender = false;
            return;
        }

        addClass(dom, fbClass);
        addClass(dom, bhClass);

        dom.setAttribute('origin', location.origin);
        dom.setAttribute('user_ref', getUserRef(true));
        dom.setAttribute('data-ref', window.btoa(this.id));
        dom.setAttribute('messenger_app_id', messengerAppId);

        setAttributes(dom, this.attrs, ['pageId', 'allowLogin', 'size', 'skin', 'centerAlign']);

        renderDom(warpper);

        // 绑定事件
        window.FB.Event.subscribe('messenger_checkbox', (ev: FacebookCheckboxEvent) => {
            if (!ev.ref) {
                warn('Can not found \'ref\' attrubite in this \'Checkbox\' Plugin.', true);
                return;
            }

            const getId = window.atob(ev.ref);

            if (getId !== this.id) {
                return;
            }

            if (ev.event === 'rendered') {
                log(`Checkbox Plugin with ID ${this.id} has been rendered.'`);
                this.isRendered = true;
            }
            else if (ev.state === 'checked' && this.onCheck) {
                this.onCheck(ev.user_ref);
            }
            else if (ev.state === 'unchecked' && this.onUnCheck) {
                this.onUnCheck(ev.user_ref);
            }
        });
    }
}
