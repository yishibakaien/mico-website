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

var companyProfile = c('#companyProfile'),
    phone = c('#phone'),
    phoneTip = c('#phoneTip'),
    registeredMoney = c('#registeredMoney'),
    area = c('#area'),
    companyCreateDate = c('#companyCreateDate'),
    companyType = c('#companyType'),
    businessModel = c('#businessModel'),
    staffNumber = c('#staffNumber'),
    firmAddress = c('#firmAddress'),
    mainClient = c('#mainClient'),
    turnover = c('#turnover'),
    mainProduct = c('#mainProduct'),
    mainMarket = c('#mainMarket'),
    plant = c('#plant'),
    machineNum = c('#machineNum');

getCompanyInfo({
    companyId
}, function(res) {

    console.log('公司详细信息', res);
    var data = res.data;

    phone.innerHTML = _formate(data.phone);
    phoneTip.innerHTML = '(点击拨打)';
    phone.setAttribute('tel', data.phone);
    phone.addEventListener('click', function() {
        location.href = 'tel:' + data.phone;
    }, false);
    phoneTip.setAttribute('tel', data.phone);
    phoneTip.addEventListener('click', function() {
        location.href = 'tel:' + data.phone;
    }, false);

    companyProfile.innerHTML = _formate(data.companyProfile);
    registeredMoney.innerHTML = _formate(data.registeredMoney) === 1 ? '0-1000万' : _formate(data.registeredMoney) === 2 ? '1001-5000万' : _formate(data.registeredMoney) === 3 ? '5001-15000万' : _formate(data.registeredMoney) === 4 ? '1亿五千万以上' : '';
    area.innerHTML = _formate(data.area);
    companyCreateDate.innerHTML = _formate(data.companyCreateDate);
    companyType.innerHTML = _formate(data.companyType) === 1 ? '蕾丝生产企业' : _formate(data.companyType) === 2 ? '贸易企业' : _formate(data.companyType) === 3 ? '服装生产企业' : _formate(data.companyType) === 4 ? '其他企业' : '';
    businessModel.innerHTML = _formate(data.businessModel);
    // // 文档里写的是nop
    staffNumber.innerHTML = _formate(data.nop);
    firmAddress.innerHTML = _formate(data.address);
    mainClient.innerHTML = _formate(data.mainClient);
    turnover.innerHTML = _formate(data.turnover) === 1 ? '0-1000万' : _formate(data.turnover) === 2 ? '1001-5000万' : _formate(data.turnover) === 3 ? '5001-15000万' : _formate(data.turnover) === 4 ? '1亿五千万以上' : '';
    mainProduct.innerHTML = _formate(data.mainProduct);
    mainMarket.innerHTML = _formate(data.mainMarket);
    plant.innerHTML = _formate(data.plant);
    machineNum.innerHTML = _formate(data.machineNum) === 1 ? '0-10台' : _formate(data.machineNum) === 2 ? '11-20台' : _formate(data.machineNum) === 3 ? '21-50台' : _formate(data.machineNum) === 4 ?'51台以上' : '';

});

function _formate(str) {
    str = str || '';
    if (!str) {
        return '';
    } else {
        return str;
    }
}
