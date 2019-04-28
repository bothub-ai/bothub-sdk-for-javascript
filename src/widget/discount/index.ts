import './style.less';

import { DiscountData, ComponentProps } from './constant';
import { overHiddenTime, bindEvent } from '../checkbox/helper';

import { log } from 'src/lib/print';
import { getUserRef } from 'src/lib/utils';
import { messengerAppId } from 'src/store';

import { componentWarpper, ComponentType } from '../helper';
import { BaseWidget, WidgetCommon } from '../base/base';

import Component from './component';

export { DiscountData };

/**
 * [优惠券插件]()
 */
export default class Discount extends BaseWidget implements WidgetCommon {
    data: ComponentProps['data'];
    fbAttrs: ComponentProps['fbAttrs'];
    hideAfterChecked: number;

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

    constructor({ id, type, bhRef, pageId, hideAfterChecked = 0, clickShowCodeBtn, clickCopyCodeBtn, ...rest }: DiscountData) {
        super(arguments[0]);

        this.data = rest;
        this.hideAfterChecked = hideAfterChecked;
        this.clickShowCodeBtn = clickShowCodeBtn;
        this.clickCopyCodeBtn = clickCopyCodeBtn;

        this.fbAttrs = {
            messengerAppId, pageId,
            origin: location.origin,
            // 强制居中
            centerAlign: true,
            // 手机界面显示 small，PC 界面显示 large
            size: window.innerWidth < 768 ? 'small' : 'large',
            userRef: '',
        };

        this.$el = document.getElementById(this.id) || undefined;

        if (!this.$el) {
            this.elNotFound();
            this.canRender = false;
            return this;
        }

        // 设置隐藏，且在隐藏时间范围内
        if (this.hideAfterChecked > 0 && !overHiddenTime(this)) {
            this.canRender = false;
            return this;
        }
    }

    /** “自动隐藏”存储的键名 */
    get hidenKey() {
        return `discount-hide:${this.id}`;
    }

    parse(focus = false) {
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
            bindEvent(this, {
                onRendered: () => this.$component!.update({ loading: false }),
                onCheck: () => this.$component!.update({ isChecked: true }),
                onUnCheck: () => this.$component!.update({ isChecked: false }),
            });
        }
    }
}
