'use strict';
import '../stylus/infomation.styl';

import {
    c,
    getQueryString,
    // formateDate
} from './utils/utils';
import {
    getCompanyInfo
} from './api/api';

var companyId = getQueryString('companyId');

var phone = c('#phone');
var registeredMoney = c('#registeredMoney');

getCompanyInfo({
    companyId
}, function(res) {

    console.log('公司详细信息', res);
    var data = res.data;
    phone.innerHTML = data.phone;
    phone.setAttribute('tel', data.phone);
    phone.addEventListener('click', function() {
        location.href = 'tel:' + data.phone;
    }, false);

    registeredMoney.innerHTML = _formate(data.registeredMoney);
});
function _formate(str) {
    str = str || '';
    if (!str) {
        return '';
    } else {
        return str;
    }
}