// 全局 pageId
var pageId = getQueryString('pageId') || 374118179628713;
// 全局 appId
var appId = getQueryString('appId');

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
            window.BH && window.BH.init({
                debug: true,
                language: "en_US",
                renderImmediately: true,
                appId: appId,
                widgets: this.config,
            });
        },
    });
}
