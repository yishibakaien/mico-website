'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/patterns_detail.styl';
import '../stylus/static/plugin/swiper-3.4.2.min.css';

import Swiper from 'swiper';
import {
    getCompanyInfo,
    // 获取花型详情
    getProduct
} from './api/api';
import {
    c,
    formateMoney,
    getQueryString,
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
var avatar = c('#avatar');
var tag = c('#tag');
var companyName = c('#companyName');
var companyBusiness = c('#companyBusiness');

// 花型参数
var category = c('#category');
var ingredient = c('#ingredient');
var stock = c('#stock');

var width = c('#width');
var height = c('#height');
(function() {

    // 获取简单的工厂信息介绍
    getCompanyInfo({
        id: companyId
    }, function(res) {
        console.log('获取详细工厂信息', res);
        var data = res.data;
        if (data.companyHeadIcon) {
            avatar.src = data.companyHeadIcon;
        }
        if (data.companyType === 1) {
            tag.className = 'tag factory';
        } else if (data.companyType === 2) {
            tag.className = 'tag stalls';
        }
        companyName.innerHTML = data.companyName;
        companyBusiness.innerHTML = '主营：' + data.companyExtendBO.companyBusiness;
    });
    // 获取产品信息
    getProduct({
        id: dataId
    }, function(res) {
        console.log('获取花型详情', res);
        var data = res.data;
        // 这里返回的图片是个字符串，并不是数组
        picContainer.style.backgroundImage = 'url(' + data.defaultPicUrl + ')';
        productNo.innerHTML = '#' + data.productNo;
        price.innerHTML = formateMoney(data.price, data.priceUnit);
        category.innerHTML = formateSupplyType(data.category);

        ingredient.innerHTML = data.ingredient;
        stock.innerHTML = data.stock + ' ' + formateUnit(data.stockUnit);

        width.innerHTML = (data.width ? data.width : 0) + ' cm';
        height.innerHTML = (data.height ? data.height : 0) + ' cm';
    });

    var activeNumber = document.getElementsByClassName('active-number')[0],
        dress = document.getElementsByClassName('dress')[0],
        message = document.getElementsByClassName('message')[0],
        // 查看图片详情 swiper
        pictureMask = document.getElementById('pictureMask'),
        pics = document.querySelectorAll('#topSwiper .swiper-slide'),
        swiperClose = document.querySelector('#pictureMask .close');

    // checkPhone({
    //     mobile: '18650470415'
    // }, function(res) {
    //     console.log('检查手机号码是否存在', res);
    // });
    
    /* eslint-disable no-new */
    new Swiper('.swiper-container', {
        onSlideChangeEnd: function(swiper) {
            activeNumber.innerHTML = swiper.activeIndex + 1;
        }
    });
    dress.addEventListener('click', function() {
        location.href = './dress.html?url=' + 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1491630241115&di=1114d7228a2982461277ad6f6cd0ee8a&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F13%2F52%2F65%2F17c58PIC9z8_1024.jpg';
    }, false);
    message.addEventListener('click', function() {
        location.href = './introduce.html';
    }, false);

    swiperClose.addEventListener('click', function() { hideMask(pictureMask); }, false);

    for (let i = 0; i < pics.length; i++) {
        (function(i) {
            pics[i].addEventListener('click', function() {
                pictureMask.style.display = 'block';
                /* eslint-disable no-new */
                new Swiper('#content', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true
                });
                
            }, false);
        })(i);
    }

    function hideMask(mask) {
        mask.style.display = 'none';
    }

    // function showMask(mask) {
    //     mask.style.display = 'block';
    // }
})();