import Marketing from './Marketing';
import {
    getUserId,
    getUserRef,
    getFacebookUserId,
    getCustomUserId,
    loadFacebookSdk,
    copy,
} from './utils';

module.exports = class BotHub {
    constructor(config) {
        const fb_user_id_key = config.fb_user_id_key || 'fb_user_id';
        const fb_user_id = getFacebookUserId(fb_user_id_key);
        window.bothubDebug = config.debug || false;
        this.debug = config.debug || false,
        this._isins = true;
        this.bot_id = config.bot_id || 0;
        this.uid = getUserId();
        this.custom_user_id = getCustomUserId();
        this.fb_user_id = fb_user_id;
        this.api_server = config.api_server || 'https://t.bothub.ai/';
        this.platforms = config.platforms || ['facebook', 'bothub'];
        this.callback = config.callback || function() {},
        this.Messenger = {
            page_id: config.facebook_page_id,
            messenger_app_id: config.messenger_app_id || '1724119764514436',
            user_ref: getUserRef(),
            fb_user_id,
            prechecked: config.messenger_prechecked || false,
            allow_login: true,
            size: 'xlarge',
            origin: `${location.protocol}//${location.host}`,
        };

        this.Marketing = new Marketing(copy(this));

        if (this.platforms.indexOf('facebook') > -1) {
            loadFacebookSdk(this);
        } else {
            this.callback(this);
        }
    }
};
