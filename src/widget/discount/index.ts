import './style.less';

import { log } from 'src/lib/print';
import { shallowCopy } from 'src/lib/object';

import { BaseWidget } from '../base/base';
import { DiscountData, ComponentProps } from './constant';
import { WidgetType, componentWarpper, ComponentType, checkHiddenTime } from '../helper';

import Component from './component';
import Checkbox from '../base/checkbox';

export { DiscountData };

/**
 * [优惠券插件]()
 */
export default class Discount extends BaseWidget<DiscountData> {
    data!: ComponentProps['data'];

    /** 内部组件 */
    widget!: Checkbox;
    /** 组件渲染 */
    $component?: ComponentType<ComponentProps>;

    /** 插件自动隐藏配置 */
    hideAfterChecked = 0;
    /** 插件对齐配置 */
    align: NonNullable<DiscountData['align']> = 'center';

    readonly requiredKeys: (keyof DiscountData)[] = [
        'id',
        'type',
        'pageId',
        'title',
        'subtitle',
        'discount',
        'showCodeBtnText',
        'copyCodeBtnText',
        'discountText',
        'discountCode',
    ];

    constructor(data: DiscountData) {
        super(data);

        this.init();
        this.check();
    }

    /** “自动隐藏”存储的键名 */
    get hidenKey() {
        return `discount-hide:${this.id}`;
    }
    /** 内部 checkbox 编号 */
    get checkboxId() {
        return `${this.id}-discount-checkbox`;
    }
    /** 当前是否已经勾选 */
    get isChecked() {
        return this.widget.isChecked;
    }

    init() {
        const { origin } = this;

        this.align = origin.align || 'center';
        this.hideAfterChecked = origin.hideAfterChecked || 0;
        this.data = shallowCopy(origin, [
            'title',
            'subtitle',
            'showCodeBtnText',
            'discount',
            'copyCodeBtnText',
            'discountText',
            'discountCode',
        ]);

        this.off();
        this.on('clickShowCodeBtn', origin.clickShowCodeBtn);
        this.on('clickCopyCodeBtn', origin.clickCopyCodeBtn);

        // checkbox 初始化
        this.widget = new Checkbox({
            type: WidgetType.Checkbox,
            id: this.checkboxId,
            pageId: this.origin.pageId,
            // 强制居中
            centerAlign: true,
            // 手机界面显示 small，PC 界面显示 large
            size: window.innerWidth < 768 ? 'small' : 'large',
        });

        // 内部器件标记
        this.widget.isInside = true;

        this.widget.on('rendered', () => {
            this.isRendered = true;
            this.$component!.update({
                loading: false,
            });
        });

        this.widget.on('check', () => {
            this.$component!.update({ isChecked: this.isChecked });
        });

        this.widget.on('uncheck', () => {
            this.$component!.update({ isChecked: this.isChecked });
        });
    }
    check() {
        this.canRender = true;

        if (!this.checkRequired()) {
            this.canRender = false;
            return;
        }

        // 网页中寻找元素
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
            log(`Skip Checkbox with id ${this.id}`);
            return;
        }

        // 渲染标志位初始化
        this.isRendered = false;

        // 生成组件
        if (!this.$component) {
            this.$component = componentWarpper(Component, this.$el, {
                id: this.id,
                data: this.data,
                align: this.align,
                checkboxId: this.checkboxId,
                loading: true,
                isChecked: false,
                emit: (name: string) => this.emit(name),
            });
        }

        // 组件初次渲染
        this.$component.update({ loading: true });

        // checkbox 渲染
        this.widget.check();
        this.widget.parse();
    }
    destroy() {
        this.widget.destroy();
        BaseWidget.prototype.destroy.call(this);
    }
}
