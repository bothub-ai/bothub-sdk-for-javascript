import Marketing from './Marketing';
import {
    getUserId,
    getUserRef,
    getFacebookUserId,
    getCustomUserId,
    loadFacebookSdk,
    copy,
    log,
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
        this.entrance = config.entrance || {},
        this.Messenger = {
            origin: `${location.protocol}//${location.host}`,
            page_id: config.facebook_page_id,
            messenger_app_id: config.messenger_app_id || '1724119764514436',
            user_ref: getUserRef(),
            fb_user_id,
            allow_login: true,
        };

        this.Marketing = new Marketing(copy(this));

        if (this.platforms.indexOf('facebook') > -1) {
            initPlugin(this);
            initFacebook(this);
            loadFacebookSdk(this);
        } else {
            this.callback(this);
        }
    }
};

function initPlugin(bothub) {
    const messenger_checkbox = document.getElementsByClassName('fb-messenger-checkbox')[0];
    const customerchat = document.getElementsByClassName('fb-customerchat')[0];
    const send_to_messenger = document.getElementsByClassName('fb-send-to-messenger')[0];

    if (messenger_checkbox) {
        bothub.Messenger.user_ref = getUserRef(true);
        for (const key in bothub.Messenger) {
            messenger_checkbox.setAttribute(key, bothub.Messenger[key]);
        }
    } else {
        bothub.Messenger.user_ref = getUserRef();
    }

    if (customerchat) {
        customerchat.setAttribute('page_id', bothub.Messenger.page_id);
        if (bothub.entrance.fb_customerchat_ref) {
            customerchat.setAttribute('ref', bothub.entrance.fb_customerchat_ref);
        }
    }

    if (send_to_messenger) {
        send_to_messenger.setAttribute('messenger_app_id', bothub.Messenger.messenger_app_id);
        send_to_messenger.setAttribute('page_id', bothub.Messenger.page_id);
        if (bothub.entrance.fb_send_to_messenger_data_ref) {
            send_to_messenger.setAttribute('data-ref', bothub.entrance.fb_send_to_messenger_data_ref);
        }
    }
}

function initFacebook(bothub) {
    window.fbAsyncInit = () => {
        log('facebook sdk loaded.');

        FB.init({
            appId: bothub.Messenger.messenger_app_id,
            xfbml: true,
            version: 'v2.6',
        });

        if (window.bothubDebug) {
            FB.Event.subscribe('messenger_checkbox', function(e) {
                log('messenger_checkbox event:', e);
                if (e.event === 'rendered') {
                    log('Messenger plugin was rendered');
                } else if (e.event === 'checkbox') {
                    const checkboxState = e.state;
                    log('Checkbox state: ' + checkboxState);
                } else if (e.event === 'not_you') {
                    log('User clicked not you');
                } else if (e.event === 'hidden') {
                    log('Messenger plugin was hidden');
                }
            });
        }

        log('run callback');
        bothub.callback(bothub);
    };
}
