'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/static/plugin/swiper-3.4.2.min.css';
import '../stylus/introduce';

// 还差一个生成二维码的插件
import Swiper from 'swiper';
import {
    c,
    getQueryString
} from './utils/utils';

import {
    getCompanyInfo
} from './api/api';


const NAVIGATOR_BASE_URL = 'http://apis.map.qq.com/tools/poimarker?key=AM3BZ-TXLEJ-OTKFZ-FMNHW-DQMLO-35BND&referer=sasas&type=0'; 

var companyId = getQueryString('companyId');


(function() {
    var locationIcon = document.getElementById('location'),
        qrcodeClicker = document.querySelector('.qrcode .right'),
        qrcodeContent = document.getElementsByClassName('qrc-content')[0],
        // qrcodeBody = document.getElementById('qrcodeBody'),
        QRcodeMask = document.getElementById('QRcodeMask'),
        pictureMask = document.getElementById('pictureMask'),
        pics = document.querySelectorAll('.picture .pic'),
        swiperClose = document.querySelector('#pictureMask .close'),
        qrcodeClose = document.getElementsByClassName('close')[0];
    // 页面元素的获取
    // 公司简称
    var abbr = c('#abbr');
    // 公司全称
    var companyName = c('#companyName');
    // 公司简介
    var companyProfile = c('#companyProfile');
    // 公司地址
    var address = c('#address');
    // 公司电话
    var phone = c('#phone');
    // 公司图片
    // var picWrapper = c('#picWrapper');
    getCompanyInfo({
        companyId
    }, function(res) {
        console.log('公司详细信息', res);
        var data = res.data;
        abbr.innerHTML = data.companyAbbreviation;
        companyName.innerHTML = data.companyName;
        companyProfile.innerHTML = data.companyProfile;
        address.innerHTML = data.address;
        phone.setAttribute('tel', res.data.phone);
        phone.addEventListener('click', function() {
            console.log(res.data.phone);
            location.href = 'tel:' + res.data.phone;
        }, false);
        // var picStr = '';
    });

    locationIcon.addEventListener('click', mapNavigation, false);

    qrcodeClicker.addEventListener('click', function() { showMask(QRcodeMask); }, false);

    /*阻止事件冒泡*/
    qrcodeContent.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);

    QRcodeMask.addEventListener('click', function() { hideMask(QRcodeMask); }, false);

    qrcodeClose.addEventListener('click', function() { hideMask(QRcodeMask); }, false);

    swiperClose.addEventListener('click', function() { hideMask(pictureMask); }, false);

    for (let i = 0; i < pics.length; i++) {
        (function(i) {
            pics[i].addEventListener('click', function() {
                pictureMask.style.display = 'block';
                /* eslint-disable no-new */
                new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true
                });
                
            }, false);
        })(i);
    }
    // var qrcode = new QRCode(qrcodeBody, {
    //     text: location.href,
    //     // width: 150,
    //     // height: 150,
    //     colorDark : "#000000",
    //     colorLight : "#ffffff",
    //     correctLevel : QRCode.CorrectLevel.H
    // });

    function mapNavigation() {
        location.href = NAVIGATOR_BASE_URL + '&marker=coord:25.78857,119.59904;title:长乐鲜花针织有限公司;addr:福建省长乐市松下镇龙纺工业区（西寨下）';
    }

    function hideMask(mask) {
        mask.style.display = 'none';
    }

    function showMask(mask) {
        mask.style.display = 'block';
    }
})();