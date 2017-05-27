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
import qrcode from './utils/qrcode.js';
// import qrcode from './utils/qrcode2';

// 生成二维码
(function() {
    // 拼接地址字符串
    // var href = location.href;
    var src = location.href.split('introduce').join('index');
    console.log(src);
    var qrNode = new qrcode({
        text: src
    });
    c('#qrcodeBody').appendChild(qrNode);
    var saveQRCode = c('#saveQRCode');
    saveQRCode.onclick = function() {
        // var image = qrNode.toDataURL('image/png').replace('image/png', 'image/octet-stream;');
        var image = qrNode.toDataURL('image/png');
        // alert(image);
        window.location.href = image;
    };
})();

// 导航的根地址
const NAVIGATOR_BASE_URL = 'http://apis.map.qq.com/tools/poimarker?key=AM3BZ-TXLEJ-OTKFZ-FMNHW-DQMLO-35BND&referer=sasas&type=0'; 

var companyId = getQueryString('companyId');

(function() {
    var locationIcon = document.getElementById('location'),
        qrcodeClicker = document.querySelector('.qrcode .right'),
        qrcodeContent = document.getElementsByClassName('qrc-content')[0],
        // qrcodeBody = document.getElementById('qrcodeBody'),
        QRcodeMask = document.getElementById('QRcodeMask'),
        pictureMask = document.getElementById('pictureMask'),
        swiperClose = document.querySelector('#pictureMask .close'),
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

        var picArr = res.data.presence;
        var eleStr = '';
        var swiperStr = '';
        picArr.forEach(function(item) {
            eleStr += `<li class="pic" style="background-image:url(${item.picUrl})"></li>`;
            swiperStr += `<div class="swiper-slide">
                            <img src="${item.picUrl}">
                        </div>`;
        });
        picWrapper.innerHTML = eleStr;
        swiperContent.innerHTML = swiperStr;
        /* eslint-disable no-new */
        new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true
        });
        var pics = document.querySelectorAll('#picWrapper .pic');

        for (var i = 0; i < pics.length; i++) {
            (function(i) {
                pics[i].addEventListener('click', function() {
                    pictureMask.style.display = 'block';
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

    swiperClose.addEventListener('click', function() { hideMask(pictureMask); }, false);

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
        location.href = NAVIGATOR_BASE_URL + `&marker=coord:${mapAddress.lat},${mapAddress.lng};title:${mapAddress.title};addr:${mapAddress.address}`;
    }

    function hideMask(mask) {
        mask.style.display = 'none';
    }

    function showMask(mask) {
        mask.style.display = 'block';
    }
})();