createVueComponent({
    id: 'bh-widget-example-send-to-messenger',
    type: 'SendToMessenger',
    pageId: pageId,
    color: 'blue',
    size: 'large',
    enforceLogin: false,
    ctaText: '',
    click() {
        console.log('Click the send-to-messenger');
    },
});
