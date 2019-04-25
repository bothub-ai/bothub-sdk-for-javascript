import { jsonp } from 'src/lib/http';
import { messengerAppId, disableFacebook } from 'src/store';
import { getEventId, getUserRef } from 'src/lib/utils';
import { AppEventNames, AppParameterNames } from 'typings/facebook';

/** bothub 标准参数名称 */
export interface BothubParameter {
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
export function toFbParameter(params: Partial<BothubParameter>, valueToSumKey?: string) {
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
    const result: object = Object.create(null);

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            if (key === valueToSumKey) {
                valueToSum = params[key];
            }
            else {
                result[paramMap[key]] = params[key];
            }
        }
    }

    return [valueToSum, result] as const;
}

/** 发送时间 */
export function logEvent(name: string | AppEventNames, value: number | null = null, params?: object) {
    // const {
    //     EventNames: event,
    //     ParameterNames: param,
    //     logEvent: fbEvent,
    // } = window.FB.AppEvents;

    // fbEvent(name, value, params);

//     /**
//      * @param {string}  eventName
//      * @param {number}  valueToSum
//      * @param {object}  params
//      */
//     logEvent(eventName, valueToSum, params) {
//         if (!eventName) return;
//         if (!valueToSum) valueToSum = null;
//         if (!(params instanceof Object)) params = {};
//         const Messenger = this.parent.Messenger;

//         let event = {
//             id: getEventId(),
//             ev: eventName,
//             params: copy(params),
//         };

//         if (this.parent.entrance.fb_messenger_checkbox_ref) {
//             event = Object.assign(event, this.parent.entrance.fb_messenger_checkbox_ref);
//         }

//         event.custom_user_id = this.parent.custom_user_id;
//         event.user_agent = window.navigator && window.navigator.userAgent;

//         if (this.parent.fb_user_id) {
//             params.fb_user_id = this.parent.fb_user_id;
//             event.fb_user_id = this.parent.fb_user_id;
//         }

//         if (!event.user_id && !event.fb_user_id && !event.custom_user_id) {
//             return;
//         }

//         params.user_ref = getUserRef();
//         params.ref = JSON.stringify(event);

//         const MessengerParams = {
//             'app_id': Messenger.messenger_app_id,
//             'page_id': Messenger.page_id,
//             'user_ref': params.user_ref,
//             'ref': params.ref,
//         };

//         if (this.parent.platforms.indexOf('facebook') >= 0) {
//             const analyticsParams = copy(params);
//             delete analyticsParams.user_ref;
//             delete analyticsParams.ref;

//             if (eventName === 'fb_mobile_purchase') {
//                 FB.AppEvents.logPurchase(
//                     valueToSum,
//                     params[FB.AppEvents.ParameterNames.CURRENCY],
//                     analyticsParams
//                 );
//             } else {
//                 FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, MessengerParams);
//                 FB.AppEvents.logEvent(eventName, valueToSum, analyticsParams);
//                 log('FB.AppEvents.logEvent', { eventName, valueToSum, analyticsParams });
//             }
//         } else if (this.parent.platforms.indexOf('bothub') >= 0) {
//             delete MessengerParams.user_ref;
//             window.query = { cd: MessengerParams };
//             const query = urlEncode({ cd: MessengerParams });
//             jsonp(`${this.parent.api_server}analytics/events?action=store${query}`);
//         }
//     }
}
