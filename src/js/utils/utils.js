/**
 * 选择器
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function c(str) {
    var str1 = str.charAt(0);
    var strsub = str.substr(1);
    switch (str1) {
    case '#':
        return document.getElementById(strsub);
    case '.':
        return document.getElementsByClassName(strsub);
    default:
        return document.getElementsByTagName(str);
    }
}
/**
 * 获取url参数
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
function getQueryString(key) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    var result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}
/**
 * 绑定事件
 * @param  {[nodeList]} el    [元素]
 * @param  {[String]} event [事件名]
 * @param  {[type]} func  [description]
 * @return {[type]}       [description]
 */
function bind(el, event, func) {
    el.addEventListener(event, func, false);
}

export {
    bind,
    getQueryString,
    c
};
