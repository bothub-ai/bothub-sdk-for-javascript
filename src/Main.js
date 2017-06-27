import "babel-polyfill";

import Cookies from 'js-cookie';
import Util from './Util';
import Marketing from './Marketing';

export default class BotHubClass {

    constructor(conf) {
        this._isins = true;

        this.uid = 0;
        this.bot_id = conf.bot_id || 0;
        this.custom_user_id = conf.custom_user_id || '';
        this.api_server = conf.api_server || 'https://t.bothub.ai/';
        this.platforms = conf.platforms || ['facebook', 'bothub'];

        this.msgbox_opt = {
            page_id: conf.facebook_page_id,
            messenger_app_id: conf.messenger_app_id || '1724119764514436',
            prechecked: "true",
            allow_login: "true",
            size: "xlarge",
            origin: location.protocol + '//' + location.host,
        };

        this.Marketing = new Marketing(this);

        this.loadUid();
        this.loadFbSdk(conf.callback);
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

    loadFbSdk(cb) {
        // alert(222);
        let box = document.getElementById('fb-messenger-checkbox');
        if (box) {
            this.msgbox_opt.user_ref = Util.getUserRef(true);
            for (let i in this.msgbox_opt) {
                box.setAttribute(i, '' + this.msgbox_opt[i]);
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

            setTimeout(() => {
                cb && cb(this);
            }, 0);
        };
    }

}