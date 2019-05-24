import { WidgetType } from '../helper';
import { WidgetDataCommon } from '../base/base';

import EventController from 'src/lib/event';

/** 优惠券插件文本设置 */
interface GetDiscountCode {
    /** 当前优惠码 */
    code: string;
    /** 错误信息 */
    message: string;
    /** 是否已经获取过 */
    isSubscribed: boolean;
}

/** 砍价插件数据接口 */
export interface DiscountData extends WidgetDataCommon {
    /** 确认框插件类型 */
    type: WidgetType.Discount;
    /**
     * 插件加载网址的基域
     */
    origin: string;
    /**
     * 用户勾选确认后多少天内自动隐藏
     *  - 默认为`-1`，意为不使用此功能
     */
    hideAfterChecked?: number;
    /**
     * 插件位置
     *  - 默认为`center`
     */
    align?: 'center' | 'left' | 'right';

    /** 标题 */
    title: string;
    /** 副标题 */
    subtitle: string;
    /** 折扣优惠码的提示文本 */
    discountText: string;
    /** 折扣的优惠码 */
    discountCode: string;
    /** 折扣按钮文本 */
    showCodeBtnText: string;
    /** 复制按钮文本 */
    copyCodeBtnText: string;
    /** 折扣数量 */
    discount: string;

    /** 获取优惠码函数 */
    getCode?(): GetDiscountCode | Promise<GetDiscountCode>;

    /** 复制优惠码事件 */
    copyCodeBtn?(): void;
    /**
     * 点击“获取优惠码按钮”事件
     * @param {boolean} checked 此时勾选框是否被选中
     */
    showCodeBtn?(checked: boolean): void;
}

/** 虚拟组件参数 */
export interface ComponentProps extends Pick<DiscountData, 'align'> {
    /** 当前组件编号 */
    id: string;
    /** checkbox 编号 */
    checkboxId: string;
    /** 等待 facebook 插件加载 */
    loading: boolean;
    /** 选择框是否被选中 */
    isChecked: boolean;
    /** 当前组件的数据 */
    data: Pick<
        DiscountData,
        'title' | 'subtitle' | 'showCodeBtnText' | 'discount' |
        'copyCodeBtnText' | 'discountText' | 'discountCode' | 'getCode'
    >;

    /** 触发事件 */
    emit: EventController['emit'];
}

export const bhClass = 'bothub-widget-discount';
