import Cookies from 'js-cookie';

import Util from './Util';

export default class Marketing {

    constructor(parent) {
        this.base = parent;
    }

    _logEvent(ename, value, ext = {}) {
        let event_id = Util.getEventId();

        ext.page_id = this.base.msgbox_opt.page_id;
        ext.app_id = this.base.msgbox_opt.messenger_app_id;
        ext.user_ref = this.base.msgbox_opt.user_ref;

        let event_obj = {
            id: event_id,
            user_id: this.base.uid,
            ev: ename,
            cd: ext,
        };

        let q = Util.urlEncode(event_obj); //$.param(event_obj)

        if (this.base.platforms.indexOf('facebook') >= 0) {
            ext.ref = JSON.stringify(event_obj);
            FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, ext);
        }
        if (this.base.platforms.indexOf('bothub') >= 0) {
            Util.jsonp(`${this.base.api_server}webhooks/${this.base.bot_id}/analytics/events?action=store${q}`);
        }
    }

    /**
     * @param {string}  ename
     * @param {number}  value
     * @param {object}  params
     */
    logEvent(ename = '', value, params = {}) {
        console.log(this.base.msgbox_opt);
        this._logEvent(ename, value, params);
    }

    /**
     * This function will log AddedToCart App Event
     * @param {string} contentId
     * @param {string} contentType
     * @param {string} currency
     * @param {number} price
     */
    logAddedToCartEvent(contentId, contentType, currency, price) {
        let params = {};
        params[FB.AppEvents.ParameterNames.CONTENT_ID] = contentId;
        params[FB.AppEvents.ParameterNames.CONTENT_TYPE] = contentType;
        params[FB.AppEvents.ParameterNames.CURRENCY] = currency;

        this._logEvent(FB.AppEvents.EventNames.ADDED_TO_CART, price, params);
    }

    /**
     * This function will log AddedToWishlist App Event
     * @param {string} contentId
     * @param {string} contentType
     * @param {string} currency
     * @param {number} price
     */
    logAddedToWishlistEvent(contentId, contentType, currency, price) {
        let params = {};
        params[FB.AppEvents.ParameterNames.CONTENT_ID] = contentId;
        params[FB.AppEvents.ParameterNames.CONTENT_TYPE] = contentType;
        params[FB.AppEvents.ParameterNames.CURRENCY] = currency;

        this._logEvent(FB.AppEvents.EventNames.ADDED_TO_WISHLIST, price, params);
    }

    /**
     * This function will log InitiatedCheckout App Event
     * @param {string} contentId
     * @param {string} contentType
     * @param {number} numItems
     * @param {boolean} paymentInfoAvailable
     * @param {string} currency
     * @param {number} totalPrice
     */
    logInitiatedCheckoutEvent(contentId, contentType, numItems, paymentInfoAvailable, currency, totalPrice) {
        let params = {};
        params[FB.AppEvents.ParameterNames.CONTENT_ID] = contentId;
        params[FB.AppEvents.ParameterNames.CONTENT_TYPE] = contentType;
        params[FB.AppEvents.ParameterNames.NUM_ITEMS] = numItems;
        params[FB.AppEvents.ParameterNames.PAYMENT_INFO_AVAILABLE] = paymentInfoAvailable ? 1 : 0;
        params[FB.AppEvents.ParameterNames.CURRENCY] = currency;

        this._logEvent(FB.AppEvents.EventNames.INITIATED_CHECKOUT, totalPrice, params);
    }

}
