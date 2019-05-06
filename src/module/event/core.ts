import { UA } from 'src/lib/env';
import { log, warn } from 'src/lib/print';
import { jsonp, post } from 'src/lib/http';

import * as store from 'src/store';

import { getEventId } from './utils';
import { BhEventName } from './custom';

import Checkbox from 'src/widget/base/checkbox';

import { WidgetType } from 'src/widget';
import { AppEventNames, AppParameterNames } from 'typings/facebook';

/** bothub 标准参数名称 */
export interface BothubParameter {
    /** 指向某个插件 */
    widget?: string;

    /** International Article Number (EAN) when applicable, or other product or content identifier */
    id: string;
    /** For example music, video, or product description */
    type: string;
    /** ISO 4217 code, e.g., "EUR", "USD", "JPY" */
    currency: string;
    /** A string description */
    description: string;
    /** Player's Level */
    level: string;
    /** Upper bounds of a rating scale, for example 5 on a 5 star scale */
    maxRating: number;
    /** Number of items */
    numItems: number;
    /** 1 for yes, 0 for no */
    paymentAvailable: '1' | '0';
    /** Facebook, Email, Twitter, etc. */
    registration: string;
    /** The text string that was searched for */
    searchString: string;
    /** 1 for yes, 0 for no */
    success: '1' | '0';
}

/** bothub 标准参数名称映射至 facebook */
export function transformParameter(params: Partial<BothubParameter>, valueToSumKey?: string) {
    type bothubMap = { [key in keyof BothubParameter]: AppParameterNames };

    // 这里不放在外面作为常量是因为 fb sdk 加载是异步的
    const { ParameterNames: fbParam } = window.FB.AppEvents;
    const paramMap: bothubMap = {
        id: fbParam.CONTENT_ID,
        type: fbParam.CONTENT_TYPE,
        currency: fbParam.CURRENCY,
        description: fbParam.DESCRIPTION,
        level: fbParam.LEVEL,
        maxRating: fbParam.MAX_RATING_VALUE,
        numItems: fbParam.NUM_ITEMS,
        paymentAvailable: fbParam.PAYMENT_INFO_AVAILABLE,
        registration: fbParam.REGISTRATION_METHOD,
        searchString: fbParam.SEARCH_STRING,
        success: fbParam.SUCCESS,
    };

    let valueToSum: number | null = null;
    let widget: string | undefined = void 0;

    const result: object = Object.create(null);

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            // 限定指向某个插件
            if (key === 'widget') {
                widget = params[key];
            }
            else if (key === valueToSumKey) {
                valueToSum = params[key];
            }
            else if (key in paramMap) {
                result[paramMap[key]] = params[key];
            }
            else {
                log(`The parameter named '${key}' is not a standard parameter, we will not change its name.`);
                result[key] = params[key];
            }
        }
    }

    return [valueToSum, result, widget] as const;
}

/** 记录 facebook 事件 */
function logFbEvent(name: string, value: number | null, params: object) {
    const { AppEvents } = window.FB;

    if (name === BhEventName.purchase) {
        AppEvents.logPurchase(value as number, params[AppEvents.ParameterNames.CURRENCY], params);
    }
    else {
        AppEvents.logEvent(name, value, params);
    }
}

/**
 * 记录 bothub 事件
 * @param {string} id - 对应的 bothub 插件编号
 * @param {string} name - 事件名称
 * @param {object} params - 此次 facebook 事件的参数
 */
async function logBhEvent(id: string, name: string, params: object) {
    const widget = (id.length === 0)
        ? store.widgets.find(({ type }) => type === WidgetType.Checkbox) as Checkbox
        : store.widgets.find(({ id: local, type }) => id === local && type === WidgetType.Checkbox) as Checkbox;

    // 未找到指定的 checkbox
    if (!widget) {
        // 指定了插件编号
        if (id) {
            warn(`Can not find Checkbox with id ${id}`);
        }

        return;
    }

    // 事件参数
    const event = {
        name,
        params,
        id: getEventId(),

        user_agent: UA,
        fb_user_id: store.fbUserId,
        custom_user_id: store.customUserId,
        ...(widget.message || {}),
    };

    // checkbox 确认参数
    const MessengerParams = {
        app_id: store.messengerAppId,
        page_id: widget.origin.pageId,
        user_ref: widget.fbAttrs.userRef,
        ref: JSON.stringify(event),
    };

    // 禁用 facebook 功能，则将数据发送回 bothub
    if (store.disableFacebook) {
        delete MessengerParams.user_ref;

        await jsonp('analytics/events', {
            action: 'store',
            cd: MessengerParams,
        });
    }
    else {
        // 向后端发送完整信息
        if (widget.message) {
            await post('tr/', widget.message);
        }

        // 发送 checkbox 确认事件
        await window.FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, MessengerParams);
    }
}

/**
 * 发送事件标准函数
 * @param {string} name 事件名称
 * @param {number|null} value 用于累加的数值
 * @param {object} [param] 附带的参数
 * @param {string} [widgetId] 指向某个插件的编号（注：此参数不对客户开放）
 */
export async function logEvent(name: string | AppEventNames, value: number | null = null, params: object = {}, widgetId: string = '') {
    // 发送 bothub 事件
    await logBhEvent(widgetId, name as string, params);

    // 发送 facebook 事件
    if (!store.disableFacebook) {
        await logFbEvent(name as string, value, params);
    }
}
