import { BothubParameter, transformParameter, logEvent } from './core';
import { facebookReady } from 'src/lib/facebook';
import { isString } from 'src/lib/assert';
import { shallowCopyExclude } from 'src/lib/object';

/** bothub 自定义事件名称 */
export enum BhEventName {
    purchase = 'fb_mobile_purchase',
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

/** 自定义事件参数 */
interface CustomEventParams {
    name: string;
    [key: string]: string | number;
}

/** 自定义事件 */
export function logCustom(params: CustomEventParams | string) {
    facebookReady.then(() => {
        const parameter = isString(params)
            ? [params, null, {}, ''] as const
            : [params.name, null, shallowCopyExclude(params, ['name']), ''] as const;

        logEvent(...parameter);
    });
}
