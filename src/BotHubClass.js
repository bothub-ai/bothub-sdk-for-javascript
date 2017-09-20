import 'babel-polyfill';

import * as util from './util';
import Cookies from 'js-cookie';
import Marketing from './Marketing';

export default class BotHubClass {
    constructor(conf) {
        this._isins = true;

        this.uid = 0;
        this.bot_id = conf.bot_id || 0;
        this.custom_user_id = conf.custom_user_id || '';
        this.fb_user_id_key = conf.fb_user_id_key || 'fb_user_id',
        this.fb_user_id = util.getFbUserId(this.fb_user_id_key);
        this.api_server = conf.api_server || 'https://t.bothub.ai/';
        this.platforms = conf.platforms || ['facebook', 'bothub'];

        this.msgbox_opt = {
            page_id: conf.facebook_page_id,
            messenger_app_id: conf.messenger_app_id || '1724119764514436',
            fb_user_id: util.getFbUserId(),
            prechecked: 'true',
            allow_login: 'true',
            size: 'xlarge',
            origin: `${location.protocol}//${location.host}`,
        };

        this.Marketing = new Marketing(this);

        this.loadUid();

        if (this.platforms.indexOf('facebook') >= 0) {
            this.loadFbSdk(conf.callback);
        } else {
            conf.callback && conf.callback(this);
        }
    }

    loadUid() {
        this.uid = Cookies.get('__bothub_user_id');
        if (!this.uid) {
            util.jsonp(`${this.api_server}webhooks/${this.bot_id}/analytics/users?action=store&custom_user_id=${this.custom_user_id}&fb_user_id=${this.fb_user_id}`, (uid) => {
                this.uid = '' + uid;
                Cookies.set('__bothub_user_id', this.uid, { expires: 365, path: '/' });
            });
        }
    }

    loadFbSdk(cb) {
        // load check-bok
        const box = document.getElementById('fb-messenger-checkbox');
        if (box) {
            this.msgbox_opt.user_ref = util.getUserRef(true);
            for (const i in this.msgbox_opt) {
                box.setAttribute(i, '' + this.msgbox_opt[i]);
            }
        } else {
            this.msgbox_opt.user_ref = util.getUserRef();
        }

        // sdk init
        window.fbAsyncInit = () => {
            // console.info('fbAsyncInit success');
            FB.init({
                appId: this.msgbox_opt.messenger_app_id,
                xfbml: true,
                version: 'v2.6',
            });

            setTimeout(() => {
                cb && cb(this);
            });
        };

        // load sdk
        const sdkid = 'facebook-jssdk',
            js = document.createElement('script'),
            first = document.getElementsByTagName('script')[0];

        if (document.getElementById(sdkid)) {
            return;
        }

        js.id = sdkid;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        first.parentNode.insertBefore(js, first);
    }
}
