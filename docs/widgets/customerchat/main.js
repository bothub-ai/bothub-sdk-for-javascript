new Vue ({
    el: '#app',
    data() {
        return {
            config: {
                id: 'bothub-widget-example-3',
                type: 'Customerchat',
                pageId: pageId,
                themeColor: '',
                loggedInGreeting: '',
                loggedOutGreeting: '',
                greetingDialogDisplay: '',
                greetingDialogDelay: '',
            },
        };
    },
    methods: {
        parseWidget() {
            const widget = window.BH.Widget;
            const data = this.config;

            widget.setConfig(data);
            widget.render(data.id);
        },
        toStringify() {
            const result = {};
            const config = this.config;

            for (var key in config) {
                if (!config[key]) {
                    continue;
                }

                result[key] = config[key];
            }

            return JSON.stringify(result, null, 2);
        }
    },
    mounted() {
        window.BH.init({
            debug: true,
            language: "en_US",
            renderImmediately: true,
            appId: appId,
            widgets: this.config,
        });
    },
});
