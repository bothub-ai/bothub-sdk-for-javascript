import { BothubParameter, toFbParameter, logEvent } from './core';

/** 完成购物事件参数 */
interface CompletePaymentParams extends Pick<BothubParameter, 'id' | 'type' | 'currency'> {
    /** 此次购物共付款 */
    totalPrice: string;
}

/** 完成购物事件 */
export function completePayment(params: CompletePaymentParams) {
    logEvent(
        'fb_mobile_complete_payment',
        ...toFbParameter(params, 'totalPrice'),
    );
}
