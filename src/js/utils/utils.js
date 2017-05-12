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

// 添加active
function addActive(els) {
    var i,
        n,
        len = els.length;
    for (i = 0; i < len; i++) {
        (function(i) {
            els[i].onclick = function() {

                for (n = 0; n < len; n++) {
                    els[n].className = els[n].className.split('active').join(' ');
                }
                if (this.className.indexOf('active') === -1) {
                    this.className += ' active';
                }
            };
        })(i);
    }
}

/*格式化时间*/
function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            var str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : _padLeftZero(str));
        }
    }
    return fmt;

    function _padLeftZero(str) {
        return ('00' + str).substr(str.length);
    }
}

export {
    bind,
    addActive,
    formatDate,
    getQueryString,
    c
};
