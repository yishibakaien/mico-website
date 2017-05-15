'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/static/plugin/swiper-3.4.2.min.css';
import '../stylus/index';

import Swiper from 'swiper';
// 升级版 iScroll
import BScroll from 'better-scroll';
import { addActive } from './utils/utils';
import {
    // 获取店铺花型分类
    // listProductCategory,
    // // 获取花型列表
    // listProducts,
    // 获取系统定义花型分类列表
    listSystemProductCategory,
    // 获取自定义花型分类列表
    listUserProductCategory,
    // 店铺分类绑定的花型列表
    listCompanyBindingProduct,
    // 店铺供应列表
    listVisitCompanySupplys,
    // 获取简单店铺信息
    getCompanySimpleInfo,
    // 获取详细店铺信息
    getCompanyInfo
 } from './api/api.js';

const companyId = 36444;

(function() {
    // 获取简单店铺信息
    getCompanySimpleInfo({
        id: companyId
    }, function(res) {
        console.log('获取简单店铺信息', res);
    });
    // 获取详细店铺信息
    getCompanyInfo({
        companyId
    }, function(res) {
        console.log('获取详细店铺信息', res);
    });

    // 店铺供应列表
    listVisitCompanySupplys({
        companyId,
        pageNO: 1,
        pageSize: 6
    }, function(res) {
        console.log('店铺供应列表', res);
    });

    // 获取系统定义花型分类列表 [爆款、新品] 的列表 id
    listSystemProductCategory({
        companyId,
        isMy: false
    }, function(res) {
        console.log('获取系统定义花型分类列表', res);
        // 店铺分类绑定的花型列表，这里才是获取列表
        res.data.forEach(function(item) {
            listCompanyBindingProduct({
                classId: item.id,
                companyId
            }, function(res) {
                console.log('爆款，新品', res);
            });
        });
        
    });

    // 获取自定义花型分类列表
    listUserProductCategory({
        companyId,
        isMy: false
    }, function(res) {
        console.log('获取自定义花型分类列表', res);

        var list = res.data.list;
        list.forEach(function(item) {
            // 店铺分类绑定的花型列表
            listCompanyBindingProduct({
                classId: item.id,
                companyId,
                pageNO: 1,
                pageSize: 5
            }, function(res) {
                console.log('自定义列表', res);
            });
        });
    });

    // 获取供应列表

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
