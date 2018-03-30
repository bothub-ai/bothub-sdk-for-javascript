import { getEventId, urlEncode, jsonp, copy, log, getUserRef } from './utils';

module.exports = class Marketing {
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * @param {string}  eventName
     * @param {number}  valueToSum
     * @param {object}  params
     */
    logEvent(eventName, valueToSum, params) {
        if (!eventName) return;
        if (!valueToSum) valueToSum = null;
        if (!(params instanceof Object)) params = {};
        const Messenger = this.parent.Messenger;

        let event = {
            id: getEventId(),
            ev: eventName,
            params: copy(params),
        };

        if (this.parent.entrance.fb_messenger_checkbox_ref) {
            event = Object.assign(event, this.parent.entrance.fb_messenger_checkbox_ref);
        }

        event.custom_user_id = this.parent.custom_user_id;

        if (this.parent.fb_user_id) {
            params.fb_user_id = this.parent.fb_user_id;
            event.fb_user_id = this.parent.fb_user_id;
        }

        if (!event.user_id && !event.fb_user_id && !event.custom_user_id) {
            return;
        }

        params.user_ref = getUserRef();
        params.ref = JSON.stringify(event);

        const MessengerParams = {
            'app_id': Messenger.messenger_app_id,
            'page_id': Messenger.page_id,
            'user_ref': params.user_ref,
            'ref': params.ref,
        };

        if (this.parent.platforms.indexOf('facebook') >= 0) {
            const analyticsParams = copy(params);
            delete analyticsParams.user_ref;
            delete analyticsParams.ref;

            if (eventName === 'fb_mobile_purchase') {
                FB.AppEvents.logPurchase(
                    valueToSum,
                    params[FB.AppEvents.ParameterNames.CURRENCY],
                    analyticsParams
                );
            } else {
                FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, MessengerParams);
                FB.AppEvents.logEvent(eventName, valueToSum, analyticsParams);
                log('FB.AppEvents.logEvent', { eventName, valueToSum, analyticsParams });
            }
        } else if (this.parent.platforms.indexOf('bothub') >= 0) {
            delete MessengerParams.user_ref;
            window.query = { cd: MessengerParams };
            const query = urlEncode({ cd: MessengerParams });
            jsonp(`${this.parent.api_server}analytics/events?action=store${query}`);
        }
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
        const p = FB.AppEvents.ParameterNames;
        params[p.CONTENT_ID] = contentId;
        params[p.CONTENT_TYPE] = contentType;
        params[p.CURRENCY] = currency;
        this.logEvent(FB.AppEvents.EventNames.ADDED_TO_CART, price, params);
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
        const p = FB.AppEvents.ParameterNames;
        params[p.CONTENT_ID] = contentId;
        params[p.CONTENT_TYPE] = contentType;
        params[p.CURRENCY] = currency;
        this.logEvent(FB.AppEvents.EventNames.ADDED_TO_WISHLIST, price, params);
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
        const p = FB.AppEvents.ParameterNames;
        params[p.CONTENT_ID] = contentId;
        params[p.CONTENT_TYPE] = contentType;
        params[p.NUM_ITEMS] = numItems;
        params[p.PAYMENT_INFO_AVAILABLE] = paymentInfoAvailable ? 1 : 0;
        params[p.CURRENCY] = currency;
        this.logEvent(FB.AppEvents.EventNames.INITIATED_CHECKOUT, totalPrice, params);
    }

    /**
     * This function will log purchase App Event
     * @param {string} contentId
     * @param {string} currency
     * @param {number} totalPrice
     */
    logPurchaseEvent(contentId, currency, totalPrice) {
        const params = {};
        const p = FB.AppEvents.ParameterNames;
        params[p.CONTENT_ID] = contentId;
        params[p.CURRENCY] = currency;
        params['value_to_sum'] = totalPrice;
        this.logEvent('fb_mobile_purchase', totalPrice, params);
    }
};
