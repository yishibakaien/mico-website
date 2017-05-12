'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/patterns_detail.styl';
import '../stylus/static/plugin/swiper-3.4.2.min.css';

import Swiper from 'swiper';
import { checkPhone, getCompanySimpleInfo } from './api/api';

(function() {
    var activeNumber = document.getElementsByClassName('active-number')[0],
        dress = document.getElementsByClassName('dress')[0],
        message = document.getElementsByClassName('message')[0],
        // 查看图片详情 swiper
        pictureMask = document.getElementById('pictureMask'),
        pics = document.querySelectorAll('#topSwiper .swiper-slide'),
        swiperClose = document.querySelector('#pictureMask .close');

    checkPhone({
        mobile: '18650470415'
    }, function(res) {
        console.log('检查手机号码是否存在', res);
    });

    getCompanySimpleInfo({
        id: '123'
    }, function(res) {
        console.log('获取简单工厂信息', res);
    });
    
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