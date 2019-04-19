import { BaseWidget, WidgetType, ComponentType, componentWarpper, eleNotFound } from '../helper';
import { CheckboxData, CheckboxAttrs, ComponentProps } from './constant';

import { log, warn } from 'src/lib/print';
import { getUserRef } from 'src/lib/utils';
import { messengerAppId } from 'src/store';

import Component from './component';

export { CheckboxData };

/**
 * 确认框插件
 * @link https://developers.facebook.com/docs/messenger-platform/reference/web-plugins#checkbox
 */
export default class Checkbox implements BaseWidget {
    id: string;
    type: WidgetType.Checkbox;
    attrs: CheckboxAttrs;

    $el?: HTMLElement;
    $component?: ComponentType<ComponentProps>;

    /** 当前是否已经勾选 */
    isChecked = false;
    /** 是否可以渲染 */
    canRender = true;
    /** 是否已经完成渲染 */
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
        this.attrs = {
            ...attrs,
            userRef: '',
            origin: location.origin,
            messengerAppId,
        };

        this.$el = document.getElementById(this.id) || undefined;

        if (!this.$el) {
            eleNotFound('Checkbox', this.id);
            this.canRender = false;
            return this;
        }
    }

    parse(focus = false) {
        // 非强制模式且已渲染，或者是无法渲染
        if ((!focus && this.isRendered) || !this.canRender || !this.$el) {
            log(`Skip Checkbox with id ${this.id}`);
            return;
        }

        /** 是否是重复渲染 */
        const alreadyRender = this.isRendered;

        // 渲染标志位初始化
        this.isRendered = false;

        // 生成组件
        if (!this.$component) {
            this.$component = componentWarpper(Component, this.$el);
        }

        // 更新 user-ref
        this.attrs.userRef = getUserRef();
        // 更新组件
        this.$component.update({
            id: this.id,
            loading: true,
            attrs: this.attrs,
        });

        // facebook 渲染
        window.FB.XFBML.parse(this.$el);

        // 首次渲染，需要绑定事件
        if (!alreadyRender) {
            window.FB.Event.subscribe('messenger_checkbox', (ev: FacebookCheckboxEvent) => {
                if (!ev.ref) {
                    warn('Can not found \'ref\' attrubite in this \'Checkbox\' Plugin', true);
                    return;
                }

                const getId = window.atob(ev.ref);

                if (getId !== this.id) {
                    return;
                }

                if (ev.event === 'rendered') {
                    log(`Checkbox Plugin with ID ${this.id} has been rendered`);
                    // 已渲染标志位置高
                    this.isRendered = true;
                    // 隐藏 loading
                    this.$component!.update({
                        id: this.id,
                        loading: false,
                        attrs: this.attrs,
                    });
                }
                else if (ev.state === 'checked' && this.onCheck) {
                    this.isChecked = true;
                    this.onCheck(ev.user_ref);
                }
                else if (ev.state === 'unchecked' && this.onUnCheck) {
                    this.isChecked = false;
                    this.onUnCheck(ev.user_ref);
                }
            });
        }
    }
}
