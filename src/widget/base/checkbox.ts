import { log, warn } from 'src/lib/print';
import { getUserRef } from 'src/lib/utils';
import { messengerAppId } from 'src/store';
import { shallowCopy } from 'src/lib/object';
import { addClass, setAttributes } from 'src/lib/dom';
import { CheckboxEvent } from 'typings/facebook';

import { BaseWidget, WidgetDataCommon } from './base';
import { WidgetType, checkHiddenTime, setHiddenTime } from '../helper';

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
    size?: 'small' | 'medium' | 'standard' | 'large' | 'xlarge';
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
     * 用户勾选确认后多少天内自动隐藏
     *  - 默认为`-1`，意为不使用此功能
     */
    hideAfterChecked?: number;
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

/** facebook 确认框插件属性 */
export interface FbCheckboxAttrs extends Pick<CheckboxData, 'allowLogin' | 'size' | 'skin' | 'centerAlign'> {
    /** 插件加载网址的基域 */
    origin: string;
    /** Facebook 应用编号 */
    messengerAppId: string | number;
    /**
     * 用于指代用户的唯一参数。最多 250 个字符。
     *  - 有效字符为 `a-z` `A-Z` `0-9` `+/=-._`
     */
    userRef: string;
}

export const fbClass = 'fb-messenger-checkbox';
export const bhClass = 'bothub-messenger-checkbox';

/**
 * [确认框插件](https://developers.facebook.com/docs/messenger-platform/reference/web-plugins#checkbox)
 */
export default class Checkbox extends BaseWidget<CheckboxData> {
    fbAttrs!: FbCheckboxAttrs;
    hideAfterChecked = 0;

    /** 当前是否已经勾选 */
    isChecked = false;

    constructor(data: CheckboxData) {
        super(data);

        this.init();
        this.check();
    }

    /** “自动隐藏”存储的键名 */
    get hidenKey() {
        return `checkbox-hide:${this.id}`;
    }

    init() {
        this.hideAfterChecked = this.origin.hideAfterChecked || 0;

        this.fbAttrs = {
            ...shallowCopy(this.origin, [
                'allowLogin', 'size', 'skin',
                'pageId', 'centerAlign',
            ]),
            userRef: '',
            messengerAppId,
            origin: location.origin,
        };

        this.off();
        this.on('check', this.origin.check);
        this.on('check', () => setHiddenTime(this));
        this.on('uncheck', this.origin.unCheck);
        this.on('rendered', this.origin.rendered);
    }
    check() {
        this.canRender = true;

        if (!this.checkRequired()) {
            this.canRender = false;
            return;
        }

        this.$el = this.renderWarpperById();

        if (!this.$el) {
            this.canRender = false;
            return;
        }

        // 设置隐藏，且在隐藏时间范围内
        if (this.hideAfterChecked > 0 && !checkHiddenTime(this)) {
            this.canRender = false;
            return;
        }
    }
    parse(focus = false) {
        if ((!focus && this.isRendered) || !this.canRender || !this.$el) {
            log(`Skip ${this.name} with id ${this.id}`);
            return;
        }

        /** 是否是重复渲染 */
        const alreadyRender = this.isRendered;

        // 渲染标志位复位
        this.isRendered = false;
        // 更新 user-ref
        this.fbAttrs.userRef = getUserRef();

        const dom = this.$el.firstElementChild!;

        addClass(dom, fbClass);
        addClass(dom, bhClass);
        setAttributes(dom, this.fbAttrs);

        dom.setAttribute('data-ref', this.ref);
        dom.setAttribute('messenger_app_id', messengerAppId);

        // facebook 渲染
        window.FB.XFBML.parse(this.$el);

        // 首次渲染，需要绑定事件
        if (!alreadyRender) {
            window.FB.Event.subscribe('messenger_checkbox', (ev: CheckboxEvent) => {
                if (!ev.ref) {
                    warn(`Can not found 'ref' attrubite in '${this.name}' Plugin with id ${this.id}`, true);
                    return;
                }

                if (ev.ref !== this.ref) {
                    return;
                }

                // 渲染完成
                if (ev.event === 'rendered') {
                    log(`${this.name} Plugin with ID ${this.id} has been rendered`);
                    this.isRendered = true;
                    this.emit('rendered');
                }
                else if (ev.event === 'checkbox') {
                    if (ev.state === 'checked') {
                        this.isChecked = true;
                        this.emit('check', ev.user_ref);
                    }
                    else if (ev.state === 'unchecked') {
                        this.isChecked = false;
                        this.emit('uncheck', ev.user_ref);
                    }
                }
            });
        }
    }
}
