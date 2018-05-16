import BotHub from './bothub';
import { log, loadFacebookSdk } from './utils';
import './polyfilll';

if (!BOTHUB._isins) {
    window.BOTHUB = new BotHub(BOTHUB);
    initFacebook(window.BOTHUB);
}

function initFacebook(bothub) {
    const prev = window.fbAsyncInit;
    window.fbAsyncInit = () => {
        log('facebook sdk loaded.');

        FB.init({
            appId: bothub.Messenger.messenger_app_id,
            xfbml: true,
            version: 'v2.6',
        });

        FB.Event.subscribe('messenger_checkbox', bothub.Plugin.checkboxListener);
        FB.Event.subscribe('send_to_messenger', bothub.Plugin.sendToMessengerListener);

        window.bhAsyncInit && window.bhAsyncInit();

        if (typeof prev === 'function') {
            eval(`window.oldCb = ${prev.toString().replace('xfbml', 'fbml')}`);
            window.oldCb();
        }
    };

    if (window.FB) window.fbAsyncInit();

    loadFacebookSdk(bothub);
}
