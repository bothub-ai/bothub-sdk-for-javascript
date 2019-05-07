function getQueryString(name) {
    const reg = '(^|&)' + name + '=([^&]*)(&|$)';
    const result = window.location.search.substr(1).match(reg);

    return result ? unescape(result[2]) : null;
}

// 全局 pageId
var pageId = getQueryString('pageId') || 374118179628713;
// 全局 appId
var appId = getQueryString('appId');
