'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/static/plugin/swiper-3.4.2.min.css';
import '../stylus/introduce';

// import Swiper from 'swiper';
import {
    c,
    getQueryString
} from './utils/utils';

import {
    getCompanyInfo
} from './api/api';
import qrcode from './utils/qrcode.js';
// import qrcode from './utils/qrcode2';
import wx from 'weixin-js-sdk';

// 二维码模块
(function() {
    // 拼接地址字符串
    var src = location.href.split('introduce').join('index');
    // 生成二维码
    var qrNode = new qrcode({
        text: src
    });

    var image = qrNode.toDataURL('image/png');
    c('#qrcodeBody').getElementsByTagName('img')[0].src = image;

    // c('#qrcodeBody').appendChild(qrNode);
    var saveQRCode = c('#saveQRCode');
    saveQRCode.onclick = function() {
        
        wx.previewImage({
            urls: [
                image
            ]
        });
    };
})();

// 导航的根地址
// 
// 2017年6月2日14:12:15 ！！ 废弃，采用百度api！！
// const NAVIGATOR_BASE_URL = 'http://apis.map.qq.com/tools/poimarker?key=AM3BZ-TXLEJ-OTKFZ-FMNHW-DQMLO-35BND&referer=sasas&type=0';
// console.log(NAVIGATOR_BASE_URL);

var companyId = getQueryString('companyId');

(function() {
    var locationIcon = document.getElementById('location'),
        qrcodeClicker = document.querySelector('.qrcode .right'),
        qrcodeContent = document.getElementsByClassName('qrc-content')[0],
        // qrcodeBody = document.getElementById('qrcodeBody'),
        QRcodeMask = document.getElementById('QRcodeMask'),
        // pictureMask = document.getElementById('pictureMask'),
        // swiperClose = document.querySelector('#pictureMask .close'),
        qrcodeClose = document.getElementsByClassName('close')[0];
    // 页面元素的获取
    // 公司简称
    var abbr = c('#abbr');
    // 公司全称
    var companyName = c('#companyName');
    // 公司头像
    var avatar = c('#avatar');
    // 名片的 名称
    var companyName_card = document.querySelector('#QRcodeMask .name');
    // 公司简介
    var companyProfile = c('#companyProfile');
    // 座机号码
    var contactTelNumber = c('#contactTelNumber');
    // 传真号码
    var faxNumber = c('#faxNumber');
    // 公司地址
    var address = c('#address');
    // 公司电话
    var phone = c('#phone');
    // 公司图片
    var picWrapper = c('#picWrapper');
    // 公司图片轮播图
    var swiperContent = c('#swiperContent');

    // 公司信息
    var infomation = c('#infomation');
    infomation.addEventListener('click', function() {
        location.href = './infomation.html?companyId=' + companyId;
    }, false);
    getCompanyInfo({
        companyId
    }, function(res) {
        console.log('公司详细信息', res);
        var data = res.data;
        if (data.companyHeadIcon) {
            avatar.src = data.companyHeadIcon;
        }
        abbr.innerHTML = data.companyAbbreviation;
        companyName.innerHTML = data.companyName;
        companyName_card.innerHTML = data.companyName;
        contactTelNumber.innerHTML = data.contactTel;
        faxNumber.innerHTML = data.fax;
        companyProfile.innerHTML = data.companyProfile;
        address.innerHTML = data.address;
        phone.setAttribute('tel', res.data.phone);
        phone.addEventListener('click', function() {
            console.log(res.data.phone);
            location.href = 'tel:' + res.data.phone;
        }, false);

        var picArr = [];
        res.data.presence.forEach(function(item) {
            picArr.push(item.picUrl);
        });
        var eleStr = '';
        var swiperStr = '';
        picArr.forEach(function(item) {
            eleStr += `<li class="pic" style="background-image:url(${item})"></li>`;
            swiperStr += `<div class="swiper-slide">
                            <img src="${item}">
                        </div>`;
        });
        picWrapper.innerHTML = eleStr;
        swiperContent.innerHTML = swiperStr;
        /* eslint-disable no-new */
        // new Swiper('.swiper-container', {
        //     pagination: '.swiper-pagination',
        //     paginationClickable: true
        // });
        var pics = document.querySelectorAll('#picWrapper .pic');

        for (var i = 0; i < pics.length; i++) {
            (function(i) {
                pics[i].addEventListener('click', function() {
                    var pic = picArr[i];
                    console.log(pic);
                    wx.previewImage({
                        current: pic,
                        urls: picArr
                    });
                }, false);
            })(i);
        }
        // 腾讯地址参数
        var mapAddress = {
            // 获取公司地址经纬度
            lat: data.lat,
            lng: data.lng,
            // 地图上显示的公司地址
            address: data.address,
            // 地图上显示的公司名称(地点名称);
            title: data.companyName
        };
        locationIcon.addEventListener('click', function() {
            mapNavigation(mapAddress);
        }, false);
    });

    qrcodeClicker.addEventListener('click', function() { showMask(QRcodeMask); }, false);

    /*阻止事件冒泡*/
    qrcodeContent.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);

    QRcodeMask.addEventListener('click', function() { hideMask(QRcodeMask); }, false);

    qrcodeClose.addEventListener('click', function() { hideMask(QRcodeMask); }, false);

    // swiperClose.addEventListener('click', function() { hideMask(pictureMask); }, false);

    // var qrcode = new QRCode(qrcodeBody, {
    //     text: location.href,
    //     // width: 150,
    //     // height: 150,
    //     colorDark : "#000000",
    //     colorLight : "#ffffff",
    //     correctLevel : QRCode.CorrectLevel.H
    // });
    // lat ：维度 （一般较小）

    function mapNavigation(mapAddress) {
        console.log('mapAddress', mapAddress);
        // ！！2017年6月2日14:13:15 废弃！！采用百度地图api
        // location.href = NAVIGATOR_BASE_URL + `&marker=coord:${mapAddress.lat},${mapAddress.lng};title:${mapAddress.title};addr:${mapAddress.address}`;
        location.href = `./mapNav.html?lat=${mapAddress.lat}&lng=${mapAddress.lng}&title=${mapAddress.title}&address=${mapAddress.address}`;
    }

    function hideMask(mask) {
        mask.style.display = 'none';
    }

    function showMask(mask) {
        mask.style.display = 'block';
    }
})();
