'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/patterns_detail.styl';
import '../stylus/static/plugin/swiper-3.4.2.min.css';

import Swiper from 'swiper';
import wx from 'weixin-js-sdk';

import {
    getCompanyInfo,
    // 获取花型详情
    getProduct
} from './api/api';
import {
    c,
    formateMoney,
    getQueryString,
    formateProduceShape,
    formateSupplyType,
    formateUnit
} from './utils/utils';

var dataId = getQueryString('dataId');
var companyId = getQueryString('companyId');
// 轮播图盒子
var picContainer = c('#picContainer');
var productNo = c('#productNo');
var price = c('#price');
// 公司信息
var companyMessage = c('#companyMessage');
var avatar = c('#avatar');
var tag = c('#tag');
var viewNum = c('#viewNum');
var companyName = c('#companyName');
var companyBusiness = c('#companyBusiness');

// 花型参数
var category = c('#category');
var ingredient = c('#ingredient');
var stock = c('#stock');
var shape = c('#shape');
var width = c('#width');
var height = c('#height');

// 3D试衣
var dress = c('#dress');
// 弹起的轮播图
var detailPic = c('#detailPic');
(function() {

    // 获取详细工厂信息介绍
    getCompanyInfo({
        companyId
    }, function(res) {
        console.log('获取详细工厂信息', res);
        var data = res.data;
        companyMessage.setAttribute('company-id', data.id);
        if (data.companyHeadIcon) {
            avatar.src = data.companyHeadIcon;
        }
        if (data.companyType === 1) {
            tag.className = 'tag factory';
        } else if (data.companyType === 2) {
            tag.className = 'tag stalls';
        }
        companyName.innerHTML = data.companyName;
        try {
            companyBusiness.innerHTML = '主营：' + data.companyExtendBO.companyBusiness ? data.companyExtendBO.companyBusiness : '';
        } catch (e) {
            console.log(e);
        }
        

        // 厂家点击事件
        companyMessage.onclick = function() {
            var _companyId = this.getAttribute('company-id');
            // alert(_companyId);
            if (_companyId) {
                location.href = './index.html?companyId=' + _companyId;
            }
        };
    });
    // 获取产品信息
    getProduct({
        id: dataId
    }, function(res) {
        console.log('获取花型详情', res);
        var data = res.data;
        // 这里返回的图片是个字符串，并不是数组
        picContainer.style.backgroundImage = 'url(' + data.defaultPicUrl + ')';
        detailPic.src = data.defaultPicUrl;
        productNo.innerHTML = data.productNo;
        price.innerHTML = formateMoney(data.price, data.priceUnit);
        viewNum.innerHTML = data.viewCount ? data.viewCount : 0;

        // 类型
        category.innerHTML = formateSupplyType(data.category);
        // 成分
        ingredient.innerHTML = data.ingredient;
        // 库存
        stock.innerHTML = (data.stock ? data.stock : '') + ' ' + formateUnit(data.stockUnit);
        // 货型
        shape.innerHTML = formateProduceShape(data.productShape);
        // 宽
        width.innerHTML = data.width;
        // 高
        height.innerHTML = data.height;

        dress.addEventListener('click', function() {
            location.href = './dress.html?url=' + data.defaultPicUrl;
        }, false);
        picContainer.onclick = function() {
            wx.previewImage({
                urls: [
                    data.defaultPicUrl
                ]
            });
        };
    });
    /* eslint-disable no-new */
    new Swiper('.swiper-container');

    // var activeNumber = document.getElementsByClassName('active-number')[0],
        // message = document.getElementsByClassName('message')[0],
        
        // 查看图片详情 swiper
        // pictureMask = document.getElementById('pictureMask'),
        // pics = document.querySelectorAll('#topSwiper .swiper-slide'),
        // swiperClose = document.querySelector('#pictureMask .close');
    
    /* eslint-disable no-new */
    // new Swiper('.swiper-container', {
    //     onSlideChangeEnd: function(swiper) {
    //         activeNumber.innerHTML = swiper.activeIndex + 1;
    //     }
    // });
    
    // swiperClose.addEventListener('click', function() { hideMask(pictureMask); }, false);

    // for (let i = 0; i < pics.length; i++) {
    //     (function(i) {
    //         pics[i].addEventListener('click', function() {
    //             pictureMask.style.display = 'block';
    //             /* eslint-disable no-new */
    //             new Swiper('#content', {
    //                 pagination: '.swiper-pagination',
    //                 paginationClickable: true
    //             });
                
    //         }, false);
    //     })(i);
    // }

    // function hideMask(mask) {
    //     mask.style.display = 'none';
    // }

    // function showMask(mask) {
    //     mask.style.display = 'block';
    // }
})();