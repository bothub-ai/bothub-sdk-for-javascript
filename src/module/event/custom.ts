import { BothubParameter, transformParameter, logEvent } from './core';

/** bothub 自定义事件名称 */
export enum BhEventName {
    purchase = 'bh_purchase',
}

/** 完成购物事件参数 */
interface CompletePaymentParams extends Pick<BothubParameter, 'id' | 'currency' | 'type'> {
    /** 此次购物共付款 */
    totalPrice: string | number;
}

/** 完成购物事件 */
export function logPurchase(params?: CompletePaymentParams) {
    logEvent(
        BhEventName.purchase,
        ...transformParameter(params, 'totalPrice'),
    );
}
