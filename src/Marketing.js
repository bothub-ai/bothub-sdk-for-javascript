import * as util from './util';

export default class Marketing {
    constructor(parent) {
        this.base = parent;
    }

    _logEvent(ename, value, ext = {}) {
        const event_id = util.getEventId();

        ext.page_id = this.base.msgbox_opt.page_id;
        ext.app_id = this.base.msgbox_opt.messenger_app_id;

        if (this.base.msgbox_opt.fb_user_id) {
            ext.fb_user_id = this.base.msgbox_opt.fb_user_id;
        } else if (this.base.msgbox_opt.user_ref) {
            ext.user_ref = this.base.msgbox_opt.user_ref;
        }

        const event_obj = {
            id: event_id,
            user_id: this.base.uid,
            ev: ename,
            cd: ext,
        };

        if (!event_obj.user_id) {
            return;
        }

        const q = util.urlEncode(event_obj);
        if (this.base.platforms.indexOf('facebook') >= 0) {
            ext.ref = JSON.stringify(event_obj);
            FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, ext);
        }
        if (this.base.platforms.indexOf('bothub') >= 0) {
            util.jsonp(`${this.base.api_server}webhooks/${this.base.bot_id}/analytics/events?action=store${q}`);
        }
    }

    /**
     * @param {string}  ename
     * @param {number}  value
     * @param {object}  params
     */
    logEvent(ename = '', value, params = {}) {
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
        const params = {};
        params[util.ParameterNames.CONTENT_ID] = contentId;
        params[util.ParameterNames.CONTENT_TYPE] = contentType;
        params[util.ParameterNames.CURRENCY] = currency;

        this._logEvent(util.EventNames.ADDED_TO_CART, price, params);
    }

    /**
     * This function will log AddedToWishlist App Event
     * @param {string} contentId
     * @param {string} contentType
     * @param {string} currency
     * @param {number} price
     */
    logAddedToWishlistEvent(contentId, contentType, currency, price) {
        const params = {};
        params[util.ParameterNames.CONTENT_ID] = contentId;
        params[util.ParameterNames.CONTENT_TYPE] = contentType;
        params[util.ParameterNames.CURRENCY] = currency;

        this._logEvent(util.EventNames.ADDED_TO_WISHLIST, price, params);
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
        const params = {};
        params[util.ParameterNames.CONTENT_ID] = contentId;
        params[util.ParameterNames.CONTENT_TYPE] = contentType;
        params[util.ParameterNames.NUM_ITEMS] = numItems;
        params[util.ParameterNames.PAYMENT_INFO_AVAILABLE] = paymentInfoAvailable ? 1 : 0;
        params[util.ParameterNames.CURRENCY] = currency;

        this._logEvent(util.EventNames.INITIATED_CHECKOUT, totalPrice, params);
    }
}
