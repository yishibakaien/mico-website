'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/supply_detail.styl';
import '../stylus/static/plugin/swiper-3.4.2.min.css';

import Swiper from 'swiper';

import {
    c,
    getQueryString,
    formateSupplyType,
    formateUnit,
    formatDate,
    formatPicUrl
} from './utils/utils';

// import blackTip from './utils/blackTip';
import wx from 'weixin-js-sdk';
import {
    // getCompanySimpleInfo,
    getCompanyInfo,
    // 获取花型详情
    getCompanySupply,
} from './api/api';

var id = getQueryString('dataId');

(function() {
    // 获取页面元素
    var supplyDetailPic = c('#supplyDetailPic');
    // 点击大图
    var _supplyDetailPic = c('#_supplyDetailPic');
    var supplyDetailDesc = c('#supplyDetailDesc');
    var supplyType = c('#supplyType');
    var supplyNumber = c('#supplyNumber');
    var supplyTime = c('#supplyTime');
    var pageView = c('#pageView');
    // 公司信息盒子
    var companyMessage = c('#companyMessage');
    // 公司头像
    var companyAvatar = c('#companyAvatar');
    // 公司名字
    var companyName = c('#companyName');
    // 底部电话按钮
    var phone = c('#phone');
    //var activeNumber = document.getElementsByClassName('active-number')[0],
    var dress = document.getElementsByClassName('dress')[0];
    // message = document.getElementsByClassName('message')[0],
    
    // var pictureMask = document.getElementById('pictureMask');
    // var pics = document.querySelectorAll('#topSwiper .swiper-slide');
    // var swiperClose = document.querySelector('#pictureMask .close');
    
    // 获取产品信息
    getCompanySupply({
        id
    }, function(res) {
        console.log('获取供应详情', res);
        injectData(res);
    });
    function injectData(res) {
        var _picUrl = formatPicUrl(res.data.productPicUrl);
        supplyDetailPic.style.backgroundImage =  `url(${_picUrl})`;
        _supplyDetailPic.src = _picUrl;
        pageView.innerHTML = res.data.viewCount;
        supplyDetailDesc.innerHTML = res.data.supplyDesc;
        supplyType.innerHTML = formateSupplyType(res.data.supplyType);
        supplyNumber.innerHTML = (res.data.supplyNum ? res.data.supplyNum : 0) + ' ' + formateUnit(res.data.supplyUnit);
        supplyTime.innerHTML = formatDate(res.data.createDate, 'yyyy-MM-dd');

        dress.addEventListener('click', function() {
            location.href = './dress.html?url=' + res.data.productPicUrl;
        }, false);

        var companyId = res.data.companyId;

        // 微信jssdk预览图片
        supplyDetailPic.onclick = function() {
            wx.previewImage({
                urls: [
                    _picUrl
                ]
            });
        };
        // 获取工厂信息介绍
        getCompanyInfo({
            companyId
        }, function(res) {
            if (res.data.companyHeadIcon) {
                companyAvatar.src = res.data.companyHeadIcon;
            }
            companyName.innerHTML = res.data.companyName;
            localStorage.companyName = res.data.companyName;

            companyMessage.setAttribute('company-id', res.data.id);
            console.log('获取工厂信息', res);
            phone.setAttribute('tel', res.data.phone);
        });
    }

    // checkPhone({
    //     mobile: '18650470415'
    // }, function(res) {
    //     console.log('检查手机号码是否存在', res);
    // });
    
    /* eslint-disable no-new */
    new Swiper('.swiper-container', {
        onSlideChangeEnd: function() {
            // activeNumber.innerHTML = swiper.activeIndex + 1;
        }
    });
    
    // message.addEventListener('click', function() {
    //     location.href = './introduce.html';
    // }, false);

    // swiperClose.addEventListener('click', function() { hideMask(pictureMask); }, false);
    // // 这里的双击事件好像是无效的
    // _supplyDetailPic.ondblclick = function() {
    //     blackTip({
    //         text: '双击',
    //         type: 'success',
    //         time: 200
    //     });
    //     this.style.width = '130%';
    // };
    // _supplyDetailPic.onclick = function() {
    //     console.log('单击');
    // };
    // for (let i = 0; i < pics.length; i++) {
    //     (function(i) {
    //         pics[i].addEventListener('click', function() {
    //             pictureMask.style.display = 'block';
    //             /* eslint-disable no-new */
    //             // new Swiper('#content', {
    //             //     pagination: '.swiper-pagination',
    //             //     paginationClickable: true
    //             // });
                
    //         }, false);
    //     })(i);
    // }

    companyMessage.addEventListener('click', function() {
        var id = this.getAttribute('company-id');
        // location.href = '../introduce.html?companyId=' + id;
        location.href = './index.html?activeIndex=1&companyId=' + id;
    }, false);
    phone.addEventListener('click', function() {
        var phoneNumber = this.getAttribute('tel');
        console.log(phoneNumber);
        location.href = 'tel:' + phoneNumber;
    }, false);
    
    // function hideMask(mask) {
    //     mask.style.display = 'none';
    //     _supplyDetailPic.style.width = '100%';
    // }

    // function showMask(mask) {
    //     mask.style.display = 'block';
    // }
})();