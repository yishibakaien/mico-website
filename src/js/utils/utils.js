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
    if (typeof date === 'number') {
        date = new Date(date);
    }
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
/*格式化单位*/
function formateUnit(unit) {
    var _unit = '';
    if (unit === '400010') {
        _unit = '码';
    } else if (unit === '400011') {
        _unit = '公斤';
    } else if (unit === '400012') {
        _unit = '条';
    }
    return _unit;
}

/*格式化金额*/
function formateMoney(price) {
    // 金额以 分 作为单位
    return (price / 100).toFixed(1);
}
/*格式化供应类型*/
function formateSupplyType(str) {
    if (str === 200010) {
        return '胚布';
    } else if (str === 200011) {
        return '成品';
    } else if (str === 200012) {
        return '现货';
    } else if (str === 200013) {
        return '做货';
    } else {
        return '未分类';
    }
}

/*设置元素背景图片*/
function setBackgroundImage(ele, url) {
    console.log(ele);
    console.log(url);
    ele.style.backgroundImage = 'url(' + url +')';
}
function setDataId(ele, id) {
    ele.setAttribute('data-id', id);
}
export {
    bind,
    addActive,
    formatDate,
    formateMoney,
    formateUnit,
    formateSupplyType,
    setBackgroundImage,
    setDataId,
    getQueryString,
    c
};
