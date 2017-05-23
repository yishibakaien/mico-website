import '../stylus/default_classify.styl';
import '../stylus/static/plugin/swiper-3.4.2.min.css';

import Swiper from 'swiper';
import {
    addActive,
    getQueryString,
    // 这个是拿来转义 布料分类
    formateSupplyType,
    formateMoney
} from './utils/utils';
import {
    // 获取全部花型
    listVistitCompanyProducts
} from './api/api';

(function() {
    var pageNo = 1;
    var pageSize = 10;
    var companyId = getQueryString('companyId');

    var cateGroysStr = getQueryString('categorys');
    var categorysArr = cateGroysStr.split('-');
    console.log('categorysArr', categorysArr);
    var tab = document.getElementById('tab');
    var sildeWrapper = document.getElementById('sildeWrapper');
    var tabItem = document.getElementsByClassName('tab-item');
        
    // 只有一种花型时 的 情况需要获取 花型展示盒子
    var allPatterns = document.getElementsByClassName('allPatterns')[0];

    // 如果只有一种分类则不显示tab条
    if (categorysArr.length === 1) {
        // tab.style.display = 'none';
    } else {
        tab.style.cssText += 'display:flex;display:-webkit-box;';
        var tabStr = '<div class="tab-item active"><span class="text">全部</span></div>';
        var swiperStr = '<div class="swiper-slide allPatterns"></div>';
        categorysArr.forEach(function(item) {
            tabStr += `<div class="tab-item">
                            <span class="text">${formateSupplyType(item)}</span>
                        </div>`;
            swiperStr += `<div class="swiper-slide category_${item}"></div>`;
        });
        tab.innerHTML = tabStr;
        sildeWrapper.innerHTML = swiperStr;
        allPatterns = document.getElementsByClassName('allPatterns')[0];
    }

    if (categorysArr.length > 1) {
        categorysArr.forEach(function(item) {
            listVistitCompanyProducts({
                category: item,
                companyId,
                pageNo,
                pageSize
            }, function(res) {
                console.log('请求的单独的花型分类', res);
                var ele = document.getElementsByClassName('category_' + item)[0];
                htmlHandler(res, ele);
            });
        });
    }

    // if (categorysArr.length === 1) {
    getAllData();
    // }
    function getAllData() {
        listVistitCompanyProducts({
            companyId,
            pageNo,
            pageSize
        }, function(res) {
            console.log('请求全部花型', res);
            htmlHandler(res, allPatterns);
        });
    }

    function htmlHandler(res, ele) {
        var list = res.data.list;
        var listStr = '';
        var div = document.createElement('div');
        for (var i = 0; i < list.length; i++) {
            listStr += `<div class="patterns" data-id="${list[i].id}">
                            <div class="img" style="background-image:url(${list[i].defaultPicUrl})"></div>
                            <p class="number">${list[i].productNo}</p>
                            <p class="price">${formateMoney(list[i].price,list[i].priceUnit)}</p>
                        </div>`;
        }
        // 这里有个坑  pageNo => pageNO 这个o 是大写
        if (res.data.pageSize * res.data.pageNO >= res.data.totalNum) {
            // noMore.style.display = 'block';
            // more.style.display = 'none';
            console.log('没有更多数据了');
            listStr += '<div class="more no-more">没有更多了</div>';
        } else {
            console.log('还有更多数据');
            listStr += '<div class="more has-more">查看更多</div>';
        }
        div.innerHTML = listStr;
        ele.appendChild(div);
        if (ele.getElementsByClassName('has-more').length) {
            ele.getElementsByClassName('has-more')[0].onclick = function() {
                pageNo++;
                getAllData();
            };
        }
        bindClickEvent(ele);
    }


    // 生成swiper
    var swiper = new Swiper('.swiper-container', { 
        onSlideChangeEnd: swiperControl
        // initialSlide: activeIndex ? activeIndex : 0
    });
    // 添加active 类 高亮显示
    addActive(tabItem);
    slideControl();
    function slideControl() {
        var i,
            len = tabItem.length;
        for (i = 0; i < len; i++) {
            (function(i) {
                tabItem[i].addEventListener('click', function() {
                    console.log(i);
                    swiper.slideTo(i, 300, false);
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
    function bindClickEvent(ele) {
        var patterns = ele.getElementsByClassName('patterns');
        for (var i = 0; i < patterns.length; i++) {
            (function(i) {
                patterns[i].onclick = function() {
                    var dataId = this.getAttribute('data-id');
                    location.href = `./patterns_detail.html?companyId=${companyId}&dataId=${dataId}`;
                };
            })(i);
        }
    }
})();
