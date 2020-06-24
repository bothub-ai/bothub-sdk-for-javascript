new Vue ({
    el: '#app',
    data: () => ({
        userId: '',
        testUserId: '',
    }),
    methods: {
        setUserId() {
            localStorage.bothub_custom_user_id = this.userId;
        },
        sendReceipt() {
            if (!this.testUserId) {
                return alert('请填写要测试的 custom_user_id');
            }

            const receipt = {
                "request": {
                    "method": "send_template",
                    "id": "test_" + Math.random().toString(36).substr(2),
                    "page_id": "165848657371902",
                    "template_name": "Order Receipt Push"
                },
                "recipient": {
                    "username": this.testUserId
                },
                "params": {
                    "receipt": {
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
                }
            };

            axios.defaults.headers.common['Content-Type'] = 'application/json'
            axios.defaults.headers.common['APIKEY'] = 'bQgZ0WQ44uA4wgphwMG0S6ZUlaEmeIzRbl8AtzDdcer87qt0SrA0o3M1LHUmKar7';
            axios.post('https://api.bothub.ai/api', receipt)
                .then(() => alert('发送成功'))
                .catch(() => alert('发送失败'))
        },
        sendShippingStatus() {
            if (!this.testUserId) {
                return alert('请填写要测试的 custom_user_id');
            }

            const data = {
                "request": {
                    "method": "send_template",
                    "id": "test_" + Math.random().toString(36).substr(2),
                    "page_id": "165848657371902",
                    "template_name": "Shipping Status Update Push"
                },
                "recipient": {
                    "username": this.testUserId
                },
                "params": {
                    "package_number": "gJOGmhwD3EuF46Kt",
                    "package_status_description": "Status: enroute by UPS \n Exp. Delivery: 03, Jan, 2018",
                    "image_url": "https://unsplash.it/120/120/?random",
                    "detailed_tracking_url": "http://shop.bothub.ai",
                    "fb_first_name": "Peter",
                    "package_status": "shipped"
                }
            };

            axios.defaults.headers.common['Content-Type'] = 'application/json'
            axios.defaults.headers.common['APIKEY'] = 'bQgZ0WQ44uA4wgphwMG0S6ZUlaEmeIzRbl8AtzDdcer87qt0SrA0o3M1LHUmKar7';
            axios.post('https://api.bothub.ai/api', data)
                .then(() => alert('发送成功'))
                .catch(() => alert('发送失败'))
        },
    },
    created() {
        this.userId = localStorage.bothub_custom_user_id;
    },
});
