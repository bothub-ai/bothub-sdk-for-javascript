// 全局 pageId（Bothub Fashion）
var pageId = getQueryString('pageId') || 2312520908966205;
// 全局 appId（正式 app）
var appId = getQueryString('appId') || 985673201550272;

function getQueryString(name) {
    const reg = '(^|&)' + name + '=([^&]*)(&|$)';
    const result = window.location.search.substr(1).match(reg);

    return result ? unescape(result[2]) : null;
}

function createVueComponent(data) {
    return new Vue ({
        el: '#app',
        data: () => ({
            config: data,
        }),
        methods: {
            parseWidget() {
                const widget = window.BH.Widget;
                const data = this.config;

                widget.setConfig(data);
                widget.render(data.id);
            },
            toStringify() {
                return JSON.stringify(this.config, null, 2);
            },
            clearStorage() {
                window.localStorage.clear();
                this.parseWidget();
            },
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
}
