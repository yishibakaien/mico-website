'use strict';
import '../stylus/infomation.styl';

import {
    c,
    getQueryString,
    formatDate
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

    phone.innerHTML = format(data.phone);
    phoneTip.innerHTML = '(点击拨打)';
    phone.setAttribute('tel', data.phone);
    phone.addEventListener('click', function() {
        location.href = 'tel:' + data.phone;
    }, false);
    phoneTip.setAttribute('tel', data.phone);
    phoneTip.addEventListener('click', function() {
        location.href = 'tel:' + data.phone;
    }, false);
    // 企业简介
    companyProfile.innerHTML = format(data.companyProfile);


    // registeredMoney.innerHTML = format(data.registeredMoney) === 1 ? '0-1000万' : format(data.registeredMoney) === 2 ? '1001-5000万' : format(data.registeredMoney) === 3 ? '5001-15000万' : format(data.registeredMoney) === 4 ? '1亿五千万以上' : '';
    
    var companyExtendBO = data.companyExtendBO;
    // 注册资金
    registeredMoney.innerHTML = companyExtendBO.registeredMoney;

    // 地区
    area.innerHTML = companyExtendBO.mainMarket;

    // 成立时间
    companyCreateDate.innerHTML = format(formatDate(companyExtendBO.companyCreateDate, 'yyyy-MM-dd'));

    // 企业类型
    companyType.innerHTML = format(data.companyType) === 1 ? '蕾丝生产企业' : format(data.companyType) === 2 ? '贸易企业' : format(data.companyType) === 3 ? '服装生产企业' : format(data.companyType) === 4 ? '其他企业' : '';

    // 经营模式
    businessModel.innerHTML = format(companyExtendBO.businessModel);
    
    // 文档里写的是nop
    staffNumber.innerHTML = format(companyExtendBO.nop);

    // 经营地址
    firmAddress.innerHTML = format(data.address);

    // 主要客户
    mainClient.innerHTML = format(companyExtendBO.mainClient);


    // turnover.innerHTML = format(data.turnover) === 1 ? '0-1000万' : format(data.turnover) === 2 ? '1001-5000万' : format(data.turnover) === 3 ? '5001-15000万' : format(data.turnover) === 4 ? '1亿五千万以上' : '';
    
    // 年营业额
    turnover.innerHTML = format(companyExtendBO.turnover);

    // 主营产品
    mainProduct.innerHTML = format(companyExtendBO.mainProduct);

    // 主要市场
    mainMarket.innerHTML = format(companyExtendBO.mainMarket);

    // 厂房面积
    plant.innerHTML = format(companyExtendBO.plant);

    // machineNum.innerHTML = format(data.machineNum) === 1 ? '0-10台' : format(data.machineNum) === 2 ? '11-20台' : format(data.machineNum) === 3 ? '21-50台' : format(data.machineNum) === 4 ?'51台以上' : '';
    
    // 设备数量
    machineNum.innerHTML = format(companyExtendBO.machineNum);
});

function format(str) {
    str = str || '';
    if (!str) {
        return '';
    } else {
        return str;
    }
}
