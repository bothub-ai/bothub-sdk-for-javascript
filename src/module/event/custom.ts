import { BothubParameter, transformParameter, logEvent } from './core';
import { facebookReady } from 'src/lib/facebook';

/** bothub 自定义事件名称 */
export enum BhEventName {
    purchase = 'bh_purchase',
}

/** 完成购物事件参数 */
interface CompletePaymentParams {
    /** 订单号码 */
    orderNumber: BothubParameter['id'];
    /** 订单来源（平台） */
    source: BothubParameter['type'];
    /** 订单货币单位 */
    currency: BothubParameter['currency'];
    /** 此次购物共付款 */
    totalPrice: string | number;
}

/** 完成购物事件 */
export function purchase(params?: CompletePaymentParams) {
    facebookReady.then(() => logEvent(
        BhEventName.purchase,
        ...transformParameter(params, {
            orderNumber: 'id',
            source: 'type',
            totalPrice: 'valueToSumKey',
        }),
    ));
}
