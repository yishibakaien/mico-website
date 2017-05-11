'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/static/plugin/swiper-3.4.2.min.css';
import '../stylus/introduce';

// 还差一个生成二维码的插件
import Swiper from 'swiper';

const NAVIGATOR_BASE_URL = 'http://apis.map.qq.com/tools/poimarker?key=AM3BZ-TXLEJ-OTKFZ-FMNHW-DQMLO-35BND&referer=sasas&type=0'; 

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