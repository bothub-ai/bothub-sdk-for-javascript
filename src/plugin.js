import { getPlugin, getUserRef, log } from './utils';

module.exports = class Plugin {
    constructor(parent) {
        this.parent = parent;
        this.messenger_checkbox = getPlugin('fb-messenger-checkbox');
        this.send_to_messenger = getPlugin('fb-send-to-messenger');
        this.messageus = getPlugin('fb-messengermessageus');
        this.customerchat = getPlugin('fb-customerchat');
    }

    checkboxListener(e) {
        log('messenger_checkbox event:', e);
        if (e.event === 'rendered') {
            log('Messenger plugin was rendered');
            BOTHUB.ECommerce.sendToMessenger('messenger_checkbox');
        } else if (e.event === 'checkbox') {
            const checkboxState = e.state;
            log('Checkbox state: ' + checkboxState);
        } else if (e.event === 'not_you') {
            log('User clicked not you');
        } else if (e.event === 'hidden') {
            log('Messenger plugin was hidden');
        }
    }

    sendToMessengerListener(e) {
        log('send_to_messenger event:', e);
        if (e.event === 'rendered') {
            log('Send to messenger plugin was rendered');
            BOTHUB.ECommerce.sendToMessenger('send_to_messenger');
        } else if (e.event === 'clicked') {
            log('User clicked send to messenger');
        } else if (e.event === 'not_you') {
            log('User clicked not you');
        } else if (e.event === 'hidden') {
            log('Send to messenger plugin was hidden');
        }
    }

    initMessengerCheckbox() {
        if (this.messenger_checkbox) {
            this.parent.entrance.fb_messenger_checkbox_ref = this.parent.entrance.fb_messenger_checkbox_ref || {};

            if (this.parent.ECommerce.plugin.messenger_checkbox.receipt) {
                Object.assign(this.parent.entrance.fb_messenger_checkbox_ref, {
                    receipt_id: this.parent.ECommerce.getReceiptId('messenger_checkbox'),
                });
            }

            this.parent.Messenger.user_ref = getUserRef(true);

            for (const key in this.parent.Messenger) {
                this.messenger_checkbox.setAttribute(key, this.parent.Messenger[key]);
            }
        } else {
            this.parent.Messenger.user_ref = getUserRef();
        }
    }

    initSendToMessenger() {
        if (!this.send_to_messenger) return;

        this.send_to_messenger.setAttribute('messenger_app_id', this.parent.Messenger.messenger_app_id);
        this.send_to_messenger.setAttribute('page_id', this.parent.Messenger.page_id);

        let dataRef = this.parent.entrance.fb_send_to_messenger_data_ref || {};

        if (dataRef.length) {
            dataRef = JSON.parse(atob(dataRef.replace('base64:', '')));
            delete dataRef.receipt_id;
            delete dataRef.feed_id;
        }

        if (this.parent.ECommerce.plugin.send_to_messenger.receipt) {
            dataRef.receipt_id = this.parent.ECommerce.getReceiptId('send_to_messenger');
        }

        if (!dataRef.receipt_id && this.parent.ECommerce.plugin.send_to_messenger.feed) {
            dataRef.feed_id = this.parent.ECommerce.getFeedId('send_to_messenger');
        }

        dataRef = 'base64:' + btoa(JSON.stringify(dataRef));

        // dataRef not empty {}
        if (dataRef !== 'base64:e30=') {
            this.send_to_messenger.setAttribute('data-ref', dataRef);
        }
    }

    initMessageUs() {
        if (!this.messageus) return;
        this.messageus.setAttribute('messenger_app_id', this.parent.Messenger.messenger_app_id);
        this.messageus.setAttribute('page_id', this.parent.Messenger.page_id);
    }

    initCustomerChat() {
        if (!this.customerchat) return;
        this.customerchat.setAttribute('page_id', this.parent.Messenger.page_id);
        if (this.parent.entrance.fb_customerchat_ref) {
            this.customerchat.setAttribute('ref', this.parent.entrance.fb_customerchat_ref);
        }
    }
};
