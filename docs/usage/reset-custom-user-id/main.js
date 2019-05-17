const receiptData = {
    "recipient_name": "John Doe",
    "order_number": "U5555",
    "currency": "USD",
    "payment_method": "Visa 2345",
    "order_url": "https://storage.googleapis.com/assets.bothub.ai/bothub/templates/classic_white_shirt.jpg",
    "timestamp": 1523619550,
    "address": {
        "street_1": "UNICEF 125 Maiden Lane",
        "street_2": "11th Floor",
        "city": "New York",
        "postal_code": "10038",
        "state": "NY",
        "country": "US"
    },
    "summary": {
        "subtotal": 138.4,
        "shipping_cost": 0,
        "total_tax": 0,
        "total_cost": 138.4
    },
    "adjustments": [],
    "elements": [
        {
            "title": "Classic White Shirts",
            "subtitle": "100% Soft and Luxurious Cotton",
            "quantity": 2,
            "price": 11.99,
            "currency": "USD",
            "image_url": "https://storage.googleapis.com/assets.bothub.ai/bothub/templates/classic_white_shirt.jpg"
        },
        {
            "title": "Floral Belted Romper",
            "subtitle": "Casual romper featuring striped pattern",
            "quantity": 2,
            "price": 13.89,
            "currency": "USD",
            "image_url": "https://storage.googleapis.com/assets.bothub.ai/bothub/templates/floral_belted_romper.jpg"
        },
        {
            "title": "One Shoulder Bikini Set",
            "subtitle": "Low Waisted",
            "quantity": 2,
            "price": 14.66,
            "currency": "USD",
            "image_url": "https://storage.googleapis.com/assets.bothub.ai/bothub/templates/one_shoulder_bikini_set.jpg"
        },
        {
            "title": "Smocked Mini Dress",
            "subtitle": "Elastic waistband",
            "quantity": 2,
            "price": 15.77,
            "currency": "USD",
            "image_url": "https://storage.googleapis.com/assets.bothub.ai/bothub/templates/smocked_mini_dress.jpg"
        },
        {
            "title": "Twist Tied Top",
            "subtitle": "Easily look good to pair it with anything",
            "quantity": 2,
            "price": 12.89,
            "currency": "USD",
            "image_url": "https://storage.googleapis.com/assets.bothub.ai/bothub/templates/twisted_tied_top.jpg"
        }
    ]
}

new Vue ({
    el: '#app',
    data: () => ({
        userId: '',
    }),
    methods: {
        setUserId() {
            if (!window.BH) {
                alert('Bothub SDK 还未完全加载，请稍后再试');
            }

            window.BH.User.changeCustomUserId(this.userId).then(() => {
                alert('设置完成');
            });
        },
        sendReceipt() {
            const receipt = {
                "request": {
                    "method": "send_template",
                    "id": "test_" + Math.random().toString(36).substr(2),
                    "page_id": "275642809524516",
                    "template_name": "Order Receipt Push"
                },
                "recipient": {
                    "username": this.userId,
                },
                "params": {
                    "receipt": receiptData,
                }
            };

            axios.defaults.headers.common['Content-Type'] = 'application/json'
            axios.defaults.headers.common['APIKEY'] = 'HLl0Qb5IKoWTAa6THWFpSsEu3Nf4a7IloDQRE21EncC12Dr8SGSLK2BWmn7vrlsu';
            axios.post('https://api.uat.bothub.ai/api', receipt)
                .then(() => alert('发送成功'))
                .catch(() => alert('发送失败'))
        },
    },
    created() {
        window.bhAsyncInit.push(() => {
            this.userId = window.BH.User.getCustomUserId();
        });
    },
});
