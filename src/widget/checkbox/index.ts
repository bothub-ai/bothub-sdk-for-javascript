import { CheckboxData, FbCheckboxAttrs, ComponentProps } from './constant';
import { overHiddenTime, bindEvent } from './helper';

import { BaseWidget } from '../base/base';
import { componentWarpper, ComponentType } from '../helper';

import { log } from 'src/lib/print';
import { getUserRef } from 'src/lib/utils';
import { messengerAppId } from 'src/store';
import { shallowCopyExclude } from 'src/lib/object';

import Component from './component';

export { CheckboxData, FbCheckboxAttrs };

/**
 * [确认框插件](https://developers.facebook.com/docs/messenger-platform/reference/web-plugins#checkbox)
 */
export default class Checkbox extends BaseWidget<CheckboxData> {
    fbAttrs!: FbCheckboxAttrs;
    hideAfterChecked = 0;

    /** 当前是否已经勾选 */
    isChecked = false;
    /** 组件渲染 */
    $component?: ComponentType<ComponentProps>;

    constructor(data: CheckboxData) {
        super(data);

        this.init();
        this.check();
    }

    /** “自动隐藏”存储的键名 */
    get hidenKey() {
        return `checkbox-hide:${this.id}`;
    }

    /**
     * Checkbox 点击选中事件
     * @param {string} userRef 当前用户编号
     */
    onCheck(userRef: string) {
        if (this.origin.check) {
            this.origin.check(userRef);
        }
    }
    /**
     * Checkbox 点击取消事件
     * @param {string} userRef 当前用户编号
     */
    onUnCheck(userRef: string) {
        if (this.origin.unCheck) {
            this.origin.unCheck(userRef);
        }
    }

    init() {
        this.hideAfterChecked = this.origin.hideAfterChecked || 0;

        this.fbAttrs = {
            ...shallowCopyExclude(this.origin, [
                'id', 'type', 'hideAfterChecked', 'check', 'unCheck',
            ]),
            userRef: '',
            messengerAppId,
            origin: location.origin,
        };
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
        if (this.hideAfterChecked > 0 && !overHiddenTime(this)) {
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

        // 渲染标志位初始化
        this.isRendered = false;

        // 生成组件
        if (!this.$component) {
            this.$component = componentWarpper(Component, this.$el, {
                id: this.id,
                loading: true,
                attrs: this.fbAttrs,
            });
        }

        // 更新 user-ref
        this.fbAttrs.userRef = getUserRef();
        // 组件初次渲染
        this.$component.update({ loading: true });

        // facebook 渲染
        window.FB.XFBML.parse(this.$el);

        // 首次渲染，需要绑定事件
        if (!alreadyRender) {
            bindEvent(this, {
                onCheck: (ev) => this.onCheck(ev),
                onUnCheck: (ev) => this.onUnCheck(ev),
                onRendered: () => this.$component!.update({ loading: false }),
            });
        }
    }
}
