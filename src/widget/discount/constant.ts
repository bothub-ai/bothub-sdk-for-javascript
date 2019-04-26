import { WidgetType, WidgetDataCommon } from '../helper';
import { FbCheckboxAttrs } from '../checkbox/constant';

/** 砍价插件数据接口 */
export interface DiscountData extends WidgetDataCommon {
    /** 确认框插件类型 */
    type: WidgetType.Discount;
    /** 折扣优惠码的提示文本 */
    discountText: string;
    /** 折扣的优惠码 */
    discountCode: string;
    /** 折扣按钮文本 */
    showCodeBtnText: string;
    /** 复制按钮文本 */
    copyCodeBtnText: string;
    /** 折扣 */
    notice: string;
    /**
     * 用户勾选确认后多少天内自动隐藏
     *  - 默认为`-1`，意为不使用此功能
     */
    hideAfterChecked?: number;

    /** 复制优惠码事件 */
    clickCopyCodeBtn?(): void;
    /**
     * 点击“获取优惠码按钮”事件
     * @param {boolean} checked 此时勾选框是否被选中
     */
    clickShowCodeBtn?(checked: boolean): void;
}

/** 虚拟组件参数 */
export interface ComponentProps {
    /** 当前组件编号 */
    id: string;
    /** 等待 facebook 插件加载 */
    loading: boolean;
    /** 选择框是否被选中 */
    isChecked: boolean;
    /** 当前组件的数据 */
    data: Pick<
        DiscountData,
        'showCodeBtnText' | 'copyCodeBtnText' |
        'discountText' | 'discountCode' | 'notice'
    >;
    /** facebook 核心插件属性集合 */
    fbAttrs: FbCheckboxAttrs;
    /** 复制优惠码事件 */
    clickCopyCodeBtn: DiscountData['clickCopyCodeBtn'];
    /** 点击“获取优惠码按钮”事件 */
    clickShowCodeBtn: DiscountData['clickShowCodeBtn'];
}

export const bhClass = 'bothub-widget-discount';
