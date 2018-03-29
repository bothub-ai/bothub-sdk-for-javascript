import Marketing from './marketing';
import ECommerce from './ecommerce';
import Plugin from './plugin';
import { getUserRef, getFacebookUserId, getCustomUserId } from './utils';

module.exports = class BotHub {
    constructor(config) {
        const fb_user_id_key = config.fb_user_id_key || 'fb_user_id';
        const fb_user_id = getFacebookUserId(fb_user_id_key);

        this.debug = config.debug || false,
        this._isins = true;
        this.page_id = config.facebook_page_id;
        this.custom_user_id = getCustomUserId();
        this.fb_user_id = fb_user_id;
        this.api_server = config.api_server || 'https://t.bothub.ai/';
        this.platforms = config.platforms || ['facebook', 'bothub'];
        this.entrance = config.entrance || {},
        this.ecommerce = config.ecommerce || {},
        this.language = config.language || 'zh_CN',

        this.Messenger = {
            origin: `${location.protocol}//${location.host}`,
            page_id: config.facebook_page_id,
            messenger_app_id: config.messenger_app_id || '985673201550272',
            user_ref: getUserRef(),
            fb_user_id,
            allow_login: true,
        };

        this.ECommerce = new ECommerce(this);
        this.Marketing = new Marketing(this);

        this.Plugin = new Plugin(this);
        this.Plugin.initMessengerCheckbox();
        this.Plugin.initSendToMessenger();
        this.Plugin.initMessageUs();
        this.Plugin.initCustomerChat();
    }
};

