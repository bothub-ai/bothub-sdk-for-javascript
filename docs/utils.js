function getQueryString(name) {
    const reg = '(^|&)' + name + '=([^&]*)(&|$)';
    const result = window.location.search.substr(1).match(reg);

    return result ? unescape(result[2]) : null;
}
