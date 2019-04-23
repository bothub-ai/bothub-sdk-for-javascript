import './style.less';

import { BaseWidget, WidgetType, ComponentType, componentWarpper, eleNotFound } from '../helper';
import { DiscountData, ComponentProps } from './constant';

import { log, warn } from 'src/lib/print';
import { getUserRef } from 'src/lib/utils';
import { messengerAppId } from 'src/store';

import Component from './component';

export { DiscountData };

/**
 * [优惠券插件]()
 */
export default class Discount implements BaseWidget {
    id: string;
    type = WidgetType.Discount;

    data: ComponentProps['data'];
    fbAttrs: ComponentProps['fbAttrs'];

    $el?: HTMLElement;
    $component?: ComponentType<ComponentProps>;

    /** 当前是否已经勾选 */
    isChecked = false;
    /** 是否可以渲染 */
    canRender = true;
    /** 是否已经完成渲染 */
    isRendered = false;

    clickShowCodeBtn: DiscountData['clickShowCodeBtn'];
    clickCopyCodeBtn: DiscountData['clickCopyCodeBtn'];

    constructor({ id, type, pageId, clickShowCodeBtn, clickCopyCodeBtn, ...rest }: DiscountData) {
        this.id = id;
        this.data = rest;
        this.clickShowCodeBtn = clickShowCodeBtn;
        this.clickCopyCodeBtn = clickCopyCodeBtn;

        this.fbAttrs = {
            messengerAppId, pageId,
            origin: location.origin,
            size: 'large',
            // 强制居中
            centerAlign: true,
            userRef: '',
        };

        this.$el = document.getElementById(this.id) || undefined;

        if (!this.$el) {
            eleNotFound('Discount', this.id);
            this.canRender = false;
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
            this.$component = componentWarpper(Component, this.$el, {
                id: this.id,
                fbAttrs: this.fbAttrs,
                data: this.data,
                loading: true,
                isChecked: false,
                clickShowCodeBtn: this.clickShowCodeBtn,
                clickCopyCodeBtn: this.clickCopyCodeBtn,
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
            window.FB.Event.subscribe('messenger_checkbox', (ev: FacebookCheckboxEvent) => {
                if (!ev.ref) {
                    warn('Can not found \'ref\' attrubite in this \'Discount\' Plugin', true);
                    return;
                }

                const getId = window.atob(ev.ref);

                if (getId !== this.id) {
                    return;
                }

                if (ev.event === 'rendered') {
                    log(`Checkbox Plugin with ID ${this.id} has been rendered`);
                    this.isRendered = true;
                    this.$component!.update({ loading: false });
                }
                else if (ev.state === 'checked') {
                    this.isChecked = true;
                    this.$component!.update({ isChecked: true });
                }
                else if (ev.state === 'unchecked') {
                    this.isChecked = false;
                    this.$component!.update({ isChecked: false });
                }
            });
        }
    }
}
