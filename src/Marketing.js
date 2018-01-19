import {
    getEventId,
    urlEncode,
    jsonp,
    copy,
    ParameterNames,
    EventNames,
    log,
    getUserRef,
} from './utils';

module.exports = class Marketing {
    constructor(parent) {
        this.config = parent;
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
        const Messenger = this.config.Messenger;

        const event = {
            id: getEventId(),
            ev: eventName,
            params: copy(params),
        };

        if (Messenger.fb_user_id) {
            params.fb_user_id = Messenger.fb_user_id;
        }

        if (this.config.uid) {
            event.user_id = this.config.uid;
        } else if (this.config.fb_user_id) {
            event.fb_user_id = this.config.fb_user_id;
        } else if (this.config.custom_user_id) {
            event.custom_user_id = this.config.custom_user_id;
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

        if (this.config.platforms.indexOf('facebook') >= 0) {
            FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, MessengerParams);
            const analyticsParams = copy(params);
            delete analyticsParams.user_ref;
            delete analyticsParams.ref;
            if (eventName === EventNames.INITIATED_CHECKOUT) {
                FB.AppEvents.logPurchase(valueToSum, params[ParameterNames.CURRENCY], analyticsParams);
                log('FB.AppEvents.logPurchase', { valueToSum, 'fb_currency': params[ParameterNames.CURRENCY], analyticsParams });
            } else {
                FB.AppEvents.logEvent(eventName, valueToSum, analyticsParams);
                log('FB.AppEvents.logEvent', { eventName, valueToSum, analyticsParams });
            }
        } else if (this.config.platforms.indexOf('bothub') >= 0) {
            delete MessengerParams.user_ref;
            const server = this.config.api_server;
            const bot_id = this.config.bot_id;
            const query = urlEncode({ cd: MessengerParams });
            jsonp(`${server}webhooks/${bot_id}/analytics/events?action=store${query}`);
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
        params[ParameterNames.CONTENT_ID] = contentId;
        params[ParameterNames.CONTENT_TYPE] = contentType;
        params[ParameterNames.CURRENCY] = currency;
        this.logEvent(EventNames.ADDED_TO_CART, price, params);
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
        params[ParameterNames.CONTENT_ID] = contentId;
        params[ParameterNames.CONTENT_TYPE] = contentType;
        params[ParameterNames.CURRENCY] = currency;
        this.logEvent(EventNames.ADDED_TO_WISHLIST, price, params);
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
        params[ParameterNames.CONTENT_ID] = contentId;
        params[ParameterNames.CONTENT_TYPE] = contentType;
        params[ParameterNames.NUM_ITEMS] = numItems;
        params[ParameterNames.PAYMENT_INFO_AVAILABLE] = paymentInfoAvailable ? 1 : 0;
        params[ParameterNames.CURRENCY] = currency;
        this.logEvent(EventNames.INITIATED_CHECKOUT, totalPrice, params);
    }
};
