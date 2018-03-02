import { Http, getPlugin, uuid } from './utils';

module.exports = class ECommerce {
    constructor(parent) {
        this.parent = parent;
        this.ecommerce = this.parent.ecommerce;
        this.plugin = {
            messenger_checkbox: {
                receipt: undefined,
                receipt_id: undefined,
                sent: false,
            },
            send_to_messenger: {
                receipt: undefined,
                receipt_id: undefined,
                feed: undefined,
                feed_id: undefined,
                sent: false,
            },
        };
        Object.assign(this.plugin.messenger_checkbox, this.ecommerce.messenger_checkbox);
        Object.assign(this.plugin.send_to_messenger, this.ecommerce.send_to_messenger);
    }

    getReceiptId(name) {
        if (this.plugin[name].receipt_id) return this.plugin[name].receipt_id;
        this.plugin[name].receipt_id = uuid();
        return this.plugin[name].receipt_id;
    }

    getFeedId(name) {
        if (this.plugin[name].feed_id) return this.plugin[name].feed_id;
        this.plugin[name].feed_id = uuid();
        return this.plugin[name].feed_id;
    }

    sendToMessenger(name) {
        const plugin = this.plugin[name];
        const page_id = this.parent.page_id;

        if (plugin.sent) return;

        if (plugin.receipt) {
            plugin.receipt = {
                ev: 'bh_receipt',
                receipt_id: plugin.receipt_id,
                page_id,
                data: plugin.receipt,
            };
            Http.post(this.parent.api_server + 'tr/', plugin.receipt);
            plugin.sent = true;
            return;
        }

        if (plugin.feed) {
            plugin.feed = {
                ev: 'bh_feed',
                feed_id: plugin.feed_id,
                page_id,
                data: plugin.feed,
            };
            Http.post(this.parent.api_server + 'tr/', plugin.feed);
            plugin.sent = true;
        }
    }

    resetMessengerCheckboxReceipt(data) {
        const MessengerCheckbox = getPlugin('fb-messenger-checkbox');

        if (!MessengerCheckbox) return;
        MessengerCheckbox.removeAttribute('fb-iframe-plugin-query');
        this.plugin.messenger_checkbox.receipt = data;
        this.plugin.messenger_checkbox.receipt_id = undefined;
        BOTHUB.Plugin.initMessengerCheckbox();
        window.FB.XFBML.parse();
        this.plugin.messenger_checkbox.sent = false;
    }

    resetSendToMessengerReceipt(data) {
        const type = data.ev === 'bh_receipt' ? 'receipt' : 'feed';
        const sendToMessenger = getPlugin('fb-send-to-messenger');

        if (!sendToMessenger) return;
        sendToMessenger.removeAttribute('fb-iframe-plugin-query');
        this.plugin.send_to_messenger[type] = data;
        this.plugin.send_to_messenger[type + '_id'] = undefined;
        BOTHUB.Plugin.initSendToMessenger();
        window.FB.XFBML.parse();
        this.plugin.send_to_messenger.sent = false;
    }

    resetSendToMessengerFeed(data) {
        this.plugin.send_to_messenger.receipt = undefined;
        this.plugin.send_to_messenger.receipt_id = undefined;
        this.resetSendToMessengerReceipt(data);
    }
};
