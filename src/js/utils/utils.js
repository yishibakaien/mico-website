function c(str) {
    var str1 = str.charAt(0);
    var strsub = str.substr(1);
    switch (str1) {
        case '#':
            return document.getElementById(strsub);
            break;
        case '.':
            return document.getElementsByClassName(strsub);
            break;
        default:
            return document.getElementsByTagName(str);
            break;
    }
}

function getQueryString(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}

function bind(el, event, func) {
    el.addEventListener(event, func, false);
}

export {
    bind,
    getQueryString,
    c
}
