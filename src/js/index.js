'use strict';
import '../stylus/common/common';
import '../stylus/static/reset/reset';
import '../stylus/static/plugin/swiper-3.4.2.min.css';
import '../stylus/index/index';

import Swiper from 'swiper';
// 升级版 iScroll
import BScroll from 'better-scroll';
import { addActive } from './utils/utils';

(function() {
    var tabItem = document.getElementsByClassName('tab-item'),
        footerItem = document.getElementsByClassName('footer-item'),
        contentSwiper = new Swiper('#content', {
            onSlideChangeEnd: swiperControl
        }),
        supplyList = document.getElementsByClassName('supply-list'),
        moreButton = document.getElementsByClassName('more-button')[0];
    /* eslint-disable no-new */
    new BScroll(document.getElementById('wrapper1'), { click: true });
    /* eslint-disable no-new */
    new BScroll(document.getElementById('wrapper2'), { click: true });

    addActive(tabItem);
    goTo(supplyList);
    footerClick(footerItem);
    footerClick(moreButton);
    moreButton.addEventListener('click', function() {
        var url = this.getAttribute('link');
        if (url) {
            console.log(url);
            location.href = url;
            return;
        }
    }, false);
    slideControl();

    function slideControl() {
        var i,
            len = tabItem.length;
        for (i = 0; i < len; i++) {
            (function(i) {
                tabItem[i].addEventListener('click', function() {
                    // console.log(i)
                    contentSwiper.slideTo(i, 300, false);
                }, false);
            })(i);
        }
    }

    function swiperControl(swiper) {
        var i,
            len = tabItem.length;
        for (i = 0; i < len; i++) {
            tabItem[i].className = tabItem[i].className.split('active').join(' ');
        }
        tabItem[swiper.activeIndex].className += ' active';
    }

    function footerClick(eles) {
        var i,
            url,
            tel,
            len = eles.length;
        for (i = 0; i < len; i++) {
            (function(i) {
                eles[i].addEventListener('click', function() {
                    url = this.getAttribute('link');
                    tel = this.getAttribute('tel');
                    if (url) {
                        console.log(url);
                        location.href = url;
                        return;
                    }
                    if (tel) {
                        console.log(tel);
                        location.href = 'tel:' + tel;
                    }
                }, false);
            })(i);
        }
    }

    function goTo(eles) {
        var i,
            len = eles.length;
        for (i = 0; i < len; i++) {
            (function(i) {
                eles[i].addEventListener('click', function() {
                    location.href = './patterns_detail.html';
                }, false);
            })(i);
        }
    }
})();
