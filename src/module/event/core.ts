import { UA } from 'src/lib/env';
import { jsonp } from 'src/lib/http';
import { isDef } from 'src/lib/assert';
import { log, warn } from 'src/lib/print';

import * as store from 'src/store';
import * as user from 'src/module/user';

import { getEventId } from './utils';
import { BhEventName } from './custom';

import Discount from 'src/widget/discount';
import Checkbox from 'src/widget/base/checkbox';

import { WidgetType } from 'src/widget/helper';
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

/**
 * bothub 标准参数名称映射至 facebook
 * @param {AnyObject} [params] 输入参数
 * @param {AnyObject<string>} [map] 参数映射表
 */
export function transformParameter(params: AnyObject = {}, map: AnyObject<string> = {}) {
    type BothubToFb = { [key in keyof BothubParameter]: AppParameterNames };

    // 这里不放在外面作为常量是因为 fb sdk 加载是异步的
    const { ParameterNames: fbParam } = window.FB.AppEvents;
    const bhToFb: BothubToFb = {
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
            // 指向某个插件
            if (key === 'widget') {
                widget = params[key];
                continue;
            }
            // 累加值
            else if (map[key] === 'valueToSumKey') {
                valueToSum = Number(params[key]);
                continue;
            }

            // 映射到 bothub 的键名
            const mapBhKey = isDef(map[key]) ? map[key] : key;
            // 映射到 facebook 的键名
            const mapFbKey = isDef(bhToFb[mapBhKey]) ? bhToFb[mapBhKey] : mapBhKey;

            // 包装新参数对象
            result[mapFbKey] = params[key];
        }
    }

    // 事件附带自定义 id 参数
    // result['custom_user_id'] = user.getCustomUserId();

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
function logBhEvent(id: string, name: string, params: object) {
    const widget = store.widgets.find(({ id: local, type }) => {
        // 不是 discount 或者 checkbox 就跳过
        if (type !== WidgetType.Checkbox && type !== WidgetType.Discount) {
            return false;
        }

        return (!id || id === local);
    }) as undefined | Discount | Checkbox;

    // 未找到指定的 checkbox
    if (!widget) {
        // 指定了插件编号
        if (id) {
            warn(`Can not find Checkbox with id: ${id}`);
        }

        warn('Can not find any Checkbox in this page, there will not send MessengerCheckboxUserConfirmation event.');
        return;
    }

    // 插件被选中则设置隐藏
    if (widget.isChecked) {
        widget.setHiddenTime();
    }

    // checkbox 插件
    const checkbox = widget.type === WidgetType.Checkbox ? widget : widget.widget;

    // 事件参数
    const event = {
        ev: name,
        params,
        id: getEventId(),

        user_agent: UA,
        fb_user_id: user.fbUserId,
        custom_user_id: user.getCustomUserId(),

        // checkbox 参数
        gateway: 'engagement',
        code: checkbox.code,
    };

    // checkbox 确认参数
    const MessengerParams = {
        app_id: store.messengerAppId,
        page_id: checkbox.origin.pageId,
        user_ref: checkbox.fbAttrs.userRef,
        ref: JSON.stringify(event),
    };

    // 禁用 facebook 功能，则将数据发送回 bothub
    if (store.noFacebookLogEvent) {
        delete MessengerParams.user_ref;

        jsonp('analytics/events', {
            action: 'store',
            cd: MessengerParams,
        });
    }
    else {
        // 发送 checkbox 确认事件
        log(`Send MessengerCheckboxUserConfirmation Event, Params: \n${JSON.stringify(MessengerParams, null, 2)}`);
        window.FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, MessengerParams);
    }
}

/**
 * 发送事件标准函数
 * @param {string} name 事件名称
 * @param {number|null} value 用于累加的数值
 * @param {object} [param] 附带的参数
 * @param {string} [widgetId] 指向某个插件的编号（注：此参数不对客户开放）
 */
export function logEvent(name: string | AppEventNames, value: number | null = null, params: object = {}, widgetId: string = '') {
    // 发送 bothub 事件
    logBhEvent(widgetId, name as string, params);

    // 发送 facebook 事件
    if (!store.noFacebookLogEvent) {
        logFbEvent(name as string, value, params);
    }
}
