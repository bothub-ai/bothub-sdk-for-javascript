const Cookies = require('js-cookie');

import Util from './Util';
import Base from './Base';

export default class Marketing extends Base {
    constructor(parent, conf) {
        super();

        this.bot_id = conf.bot_id || 0;
        this.custom_user_id = conf.custom_user_id || '';
        this.api_server = conf.api_server || this.api_server;
        this.platforms = conf.platforms || ['facebook', 'bothub'];
        this.msgbox_opt = {
            page_id: conf.facebook_page_id,
            messenger_app_id: conf.messenger_app_id || '1724119764514436',
            prechecked: "true",
            allow_login: "true",
            size: "xlarge",
            origin: location.protocol + '//' + location.host,
        };
        this.after_fb_arr = {};
        this.loadUid();

        window.addEventListener('load', () => {
            this.loadFbSdk();
        }, false);
    }

    loadFbSdk() {
        let box = document.getElementById('fb-messenger-checkbox');
        if (box) {
            this.msgbox_opt.user_ref = Util.getUserRef(true);
            for (let i in this.msgbox_opt) {
                box.setAttribute(i, this.msgbox_opt[i]);
            }
        } else {
            this.msgbox_opt.user_ref = Util.getUserRef();
        }

        (function(d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        window.fbAsyncInit = () => {
            // console.info('fbAsyncInit success');
            FB.init({
                appId: this.msgbox_opt.messenger_app_id,
                xfbml: true,
                version: 'v2.6'
            });
            this.fbsdk_loaded = true;
            this.do_after_fb();
        };
    }

    /**
     * 注册 回调 函数 在fb init 后执行, name 需要唯一
     * @param {string} name
     * @param {function} func
     */
    addCallback(name, func) {
        this.after_fb_arr[name] = func;
        this.do_after_fb();
    }

    do_after_fb() {
        if (this.fbsdk_loaded) {
            for (let i in this.after_fb_arr) {
                if (this.after_fb_arr[i]) {
                    this.after_fb_arr[i]();
                    this.after_fb_arr[i] = null;
                }
            }
        }
    }

    loadUid() {
        this.uid = Cookies.get('__bothub_user_id');
        if (!this.uid) {
            Util.jsonp(`${this.api_server}webhooks/${this.bot_id}/analytics/users?action=store&custom_user_id=${this.custom_user_id}`, (uid) => {
                this.uid = '' + uid;
                Cookies.set('__bothub_user_id', this.uid, {expires: 365, path: '/'});
            });
        }
    }

    _logEvent(ename, value, ext = {}) {
        let event_id = Util.getEventId();

        ext.page_id = this.msgbox_opt.page_id;
        ext.app_id = this.msgbox_opt.messenger_app_id;
        ext.user_ref = this.msgbox_opt.user_ref;

        let bothub_event = {
            id: event_id,
            user_id: this.uid,
            ev: ename,
            cd: ext,
        };
        console.log(bothub_event);

        let q = Util.urlEncode(bothub_event); //$.param(bothub_event)

        if (this.platforms.indexOf('facebook') >= 0) {
            ext.ref = JSON.stringify(bothub_event);
            FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, ext);
        }
        if (this.platforms.indexOf('bothub') >= 0) {
            Util.jsonp(`${this.api_server}webhooks/${this.bot_id}/analytics/events?action=store${q}`);
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
