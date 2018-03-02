import BotHub from './src/botHub';
import { isOldIE, log, loadFacebookSdk } from './src/utils';

if (typeof BOTHUB === 'object' && !BOTHUB._isins) {
    if (isOldIE()) {
        const doNothing = () => {};
        BOTHUB.Marketing = {
            logAddedToCartEvent: doNothing,
            logAddedToWishlistEvent: doNothing,
            logInitiatedCheckoutEvent: doNothing,
            logEvent: doNothing,
        };
    } else {
        window.BOTHUB = new BotHub(BOTHUB);
        initFacebook(window.BOTHUB);
        loadFacebookSdk(window.BOTHUB);
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

        FB.Event.subscribe('messenger_checkbox', function(e) {
            log('messenger_checkbox event:', e);
            if (e.event === 'rendered') {
                log('Messenger plugin was rendered');
                bothub.ECommerce.sendToMessenger('messenger_checkbox');
            } else if (e.event === 'checkbox') {
                const checkboxState = e.state;
                log('Checkbox state: ' + checkboxState);
            } else if (e.event === 'not_you') {
                log('User clicked not you');
            } else if (e.event === 'hidden') {
                log('Messenger plugin was hidden');
            }
        });

        FB.Event.subscribe('send_to_messenger', function(e) {
            log('send_to_messenger event:', e);
            if (e.event === 'rendered') {
                log('Send to messenger plugin was rendered');
                bothub.ECommerce.sendToMessenger('send_to_messenger');
            } else if (e.event === 'clicked') {
                log('User clicked send to messenger');
            } else if (e.event === 'not_you') {
                log('User clicked not you');
            } else if (e.event === 'hidden') {
                log('Send to messenger plugin was hidden');
            }
        });

        log('run callback');

        bothub.callback(bothub);
        window.bhAsyncInit && window.bhAsyncInit();
    };
}
