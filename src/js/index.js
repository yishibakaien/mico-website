'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/static/plugin/swiper-3.4.2.min.css';
import '../stylus/index';

import Swiper from 'swiper';
// 升级版 iScroll
import BScroll from 'better-scroll';
import {
    c,
    addActive,
    formateMoney,
    // formateUnit,
    formatDate,
    formateSupplyShape,
    // 设置图片背景
    setBackgroundImage,
    // 设置data-id 属性
    setDataId
} from './utils/utils';
import {
    // 获取店铺花型分类
    // listProductCategory,
    // // 获取花型列表
    // listProducts,
    // 获取系统定义花型分类列表
    // listSystemProductCategory,
    // 获取自定义花型分类列表
    // listUserProductCategory,
    // 
    // 店铺分类绑定的花型列表
    listCompanyBindingProduct,
    // 店铺供应列表
    listVisitCompanySupplys,

    // 2017年5月18日 新增？
    // 店铺自定义花型分类列表
    listVisitUserProductCategory,

    // 2017年5月18日 新增？
    // 店铺系统定义花型分类列表
    listVisitSystemProductCategory,
    // 获取简单店铺信息
    // getCompanySimpleInfo,
    // 获取详细店铺信息
    getCompanyInfo
 } from './api/api.js';

// 守均店铺id 36444
// 
const companyId = 36444;

// 宁博 店铺id 36438
(function() {
    // 页面元素的获取
    var bgPic = c('#bgPic'),
        companyHeadIcon = c('#companyHeadIcon'),
        companyName = c('#companyName'),
        typeTag = c('#typeTag'),
        companyBusiness = c('#companyBusiness'),
        hotPatterns = c('#hotPatterns'), // 爆款
        rightHotPatternsWrapper = c('#rightHotPatternsWrapper'),
        top1 = c('#top1'),
        top1Img = c('#top1Img'),
        top1Price = c('#top1Price'),
        top2 = c('#top2'),
        top2Img = c('#top2Img'),
        top2Price = c('#top2Price'),
        top3 = c('#top3'),
        top3Img = c('#top3Img'),
        top3Price = c('#top3Price'),
        // 新品
        newPatterns = c('#newPatterns');
    // 获取简单店铺信息
    // getCompanySimpleInfo({
    //     id: companyId
    // }, function(res) {
    //     console.log('获取简单店铺信息', res);
    // });
    // 获取详细店铺信息
    getCompanyInfo({
        companyId
    }, function(res) {
        console.log('获取详细店铺信息', res);
        // 头像
        if (res.data.companyHeadIcon) {
            companyHeadIcon.src = bgPic.src = res.data.companyHeadIcon;
        }
        // 店铺类型 厂家 or 档口，这里应该只有厂家，但还是做判断较好
        if (res.data.companyType === 1) {
            typeTag.className = 'tag factory';
        } else if (res.data.companyType === 2) {
            typeTag.className = 'tag stalls';
        }
        // 公司名称
        companyName.innerHTML = res.data.companyName;
        // 公司主营项目
        if (res.data.companyExtendBO.companyBusiness) {
            companyBusiness.innerHTML = res.data.companyExtendBO.companyBusiness;
        }
    });

    // 获取系统定义花型分类列表 [爆款、新品] 的列表 id
    // listSystemProductCategory({
    //     companyId,
    //     isMy: false
    // }, function(res) {
    //     console.log('获取系统定义花型分类列表', res);
    //     // 店铺分类绑定的花型列表，这里才是获取列表
        
    //     // 爆款id
    //     var hotPatternsDataId = res.data[0].id;
    //     // 新品id
    //     var newPatternsDataId = res.data[1].id;
    //     // 获取爆款列表
    //     listCompanyBindingProduct({
    //         classId: hotPatternsDataId,
    //         companyId
    //     }, function(res) {
    //         console.log('爆款', res);
    //         var list = res.data.list;
    //         var len = list.length;
    //         console.log(len);
    //         /**
    //          * 这里为什么写的这么麻烦？因为布局需求，做到css自适应 宽高 等比例缩放，只能使用background 来填充图片，还有后台的数据过于复杂，一个列表请求 7-8次接口，涉及到众多的排序和 异步处理问题，这里面先后顺序如果处理起来 是非常乱的，更不易于理解，所以这里强行一个一个情况判断插值，利于维护和理解
    //          */
    //         if (len) {
    //             hotPatterns.style.display = 'block';
    //             // 插值data-id
    //             setDataId(top1, list[0].id);
    //             // console.log(setBackgroundImage);
    //             setBackgroundImage(top1Img, list[0].picsUrl);
    //             top1Price.innerHTML = '￥' + formateMoney(list[0].price) + ' / ' + formateUnit(list[0].priceUnit); 

    //             if (len === 1) {
    //                 rightHotPatternsWrapper.style.display = 'none';
    //             } else if (len === 2) {
    //                 // 为左边的设置 flex: 2;
    //                 rightHotPatternsWrapper.style.cssText += '-webkit-box-flex:2;flex:2;';
    //                 // 然后隐藏 top3 已达到平铺等高效果
    //                 top3.style.display = 'none';
    //                 //---------//
    //                 setDataId(top2, list[1].id);
    //                 setBackgroundImage(top2Img, list[1].picsUrl);
    //                 top2Price.innerHTML = '￥' + formateMoney(list[1].price) + ' / ' + formateUnit(list[1].priceUnit); 
    //             } else {
    //                 setDataId(top2, list[1].id);
    //                 setBackgroundImage(top2Img, list[1].picsUrl);
    //                 top2Price.innerHTML = '￥' + formateMoney(list[1].price) + ' / ' + formateUnit(list[1].priceUnit);

    //                 setDataId(top3, list[2].id);
    //                 setBackgroundImage(top3Img, list[2].picsUrl);
    //                 top3Price.innerHTML = '￥' + formateMoney(list[2].price) + ' / ' + formateUnit(list[2].priceUnit); 
    //             }
    //         }
    //     });
    //     // 获取新品列表
    //     listCompanyBindingProduct({
    //         classId: newPatternsDataId,
    //         companyId
    //     }, function(res) {
    //         console.log('新品', res);
    //         var list = res.data.list;
    //         var listStr = '';
    //         if (list.length) {
    //             newPatterns.style.display = 'block';
    //         }
    //         for (var i = 0; i < list.length; i++) {
    //             listStr += `<div class="patterns" data-id="${list[i].id}">
    //                             <div class="img" style="background-image:url(${list[i].picsUrl})"></div>
    //                             <p class="number">#${list[i].productNo}</p>
    //                             <p class="price">￥${formateMoney(list[i].price)} / ${formateUnit(list[i].priceUnit)}</p>
    //                         </div>`;
    //         }
    //         c('#newPatterns').getElementsByClassName('patterns-wrapper')[0].innerHTML = listStr;
    //         /* eslint-disable no-new */
    //         new BScroll(c('#wrapper1'), { click: true });
    //     });
    // });

    // // 获取自定义花型分类列表
    // listUserProductCategory({
    //     companyId,
    //     isMy: false
    // }, function(res) {
    //     console.log('获取自定义花型分类列表', res);

    //     var list = res.data.list;
    //     list.forEach(function(item) {
    //         // 店铺分类绑定的花型列表
    //         console.log('自定义item', item);
    //         listCompanyBindingProduct({
    //             classId: item.id,
    //             companyId,
    //             pageNo: 1,
    //             pageSize: 10
    //         }, function(res) {
    //             console.log('自定义列表', res);
    //             var len;
    //             var MAX_LENGTH = 4;
    //             var itemList = res.data.list;

    //             // 自定义分类的标题
    //             var listTile = item.className;

    //             // 这个是 type 的 wrapper 这样做是为了方便使用appendChild

    //             var typeWrapper = document.createElement('div');
    //             typeWrapper.className = 'type';
    //             var listStr = `<div class="name border-bottom">${listTile}</div>
    //                         <div class="patterns-wrapper clearfix">`;
                
    //             if (itemList.length > MAX_LENGTH) {
    //                 len = MAX_LENGTH;
    //             } else {
    //                 len = itemList.length;
    //             }
    //             // 这里最多只展示 4 条，查过部分查看更多
    //             for (var i = 0; i < len; i++) {
    //                 listStr += `<div class="patterns" data-id="${itemList[i].id}">
    //                                 <div class="img" style="background-image:url(${itemList[i].picsUrl})"></div>
    //                                 <p class="number">#${itemList[i].productNo}</p>
    //                                 <p class="price">￥${formateMoney(itemList[i].price)} / ${formateUnit(itemList[i].priceUnit)}</p>
    //                             </div>`;
    //             }
    //             listStr += '</div></div>';

    //             if (itemList.length > MAX_LENGTH) {
    //                 listStr += `<div class="seemore border-bottom">
    //                                 查看更多${listTile}
    //                             </div>`;
    //             }
    //             typeWrapper.innerHTML = listStr;
    //             document.getElementById('wrapper1Div').appendChild(typeWrapper);
    //             /* eslint-disable no-new */
    //             new BScroll(document.getElementById('wrapper1'), { click: true });
    //         });
    //     });
    // });

    // 店铺供应列表
    listVisitCompanySupplys({
        companyId,
        pageNo: 1,
        pageSize: 10
    }, function(res) {
        console.log('店铺供应列表', res);
        var len;
        var list = res.data.list;
        var itemStr = '';
        var MAX_LENGTH = 6; 
        if (list.length > MAX_LENGTH) {
            len = MAX_LENGTH;
        } else {
            len = list.length;
        }
        // 这里最多只展示6条，超过部分 则点击查看全部来进行查看
        for (var i = 0; i < len; i++) {
            itemStr += `<div class="supply-list" data-id="${list[i].id}">
                            <div class="img-wrapper" style="background-image:url(${list[i].productPicUrl})"></div>
                            <div class="content">
                                <h1 class="title">${list[i].supplyDesc
}</h1>
                                <span class="type">${formateSupplyShape(list[i].supplyShape)}</span>
                                <span class="time">${formatDate(list[i].updateDate, 'yyyy-MM-dd')}</span>
                                <i class="iconfont icon-back"></i>
                            </div>
                        </div>`;
        }
        // if (list.length > MAX_LENGTH) {
        // 这里先写3 方便测试
        if (list.length > 3) {
            itemStr += `<div class="more-button" id="moreSupplyBtn" link="./all_supply.html">
                            查看全部供应
                        </div>`;
        }
        c('#wrapper2Div').innerHTML = itemStr;
        /* eslint-disable no-new */
        new BScroll(c('#wrapper2'), { click: true });
        var supplyList = c('.supply-list');
        for (let i of supplyList) {
            i.addEventListener('click', function() {
                console.log(this.getAttribute('data-id'));
                var dataId = this.getAttribute('data-id');
                location.href = `./supply_detail.html?dataId=${dataId}`;
            });
        }
        // 如果有查看更多供应按钮
        if (c('#moreSupplyBtn')) {
            c('#moreSupplyBtn').addEventListener('click', function() {
                // 点击跳转供应列表页
                location.href = `./supply_list.html?companyId=${companyId}`;
            });
        }
    });

    // 2017年5月18日 新增？
    // 系统自定义花型分类列表
    listVisitSystemProductCategory({
        companyId
    }, function(res) {
        console.log('listVisitSystemProductCategory', res);

        // 爆款id
        var hotPatternsDataId = res.data[0].id;
        // 新品id
        var newPatternsDataId = res.data[1].id;
        // 获取爆款列表
        listCompanyBindingProduct({
            classId: hotPatternsDataId,
            companyId
        }, function(res) {
            console.log('爆款', res);
            var list = res.data.list;
            var len = list.length;
            console.log(len);
            /**
             * 这里为什么写的这么麻烦？因为布局需求，做到css自适应 宽高 等比例缩放，只能使用background 来填充图片，还有后台的数据过于复杂，一个列表请求 7-8次接口，涉及到众多的排序和 异步处理问题，这里面先后顺序如果处理起来 是非常乱的，更不易于理解，所以这里强行一个一个情况判断插值，利于维护和理解
             */
            if (len) {
                hotPatterns.style.display = 'block';
                // 插值data-id
                setDataId(top1, list[0].id);
                // console.log(setBackgroundImage);
                setBackgroundImage(top1Img, list[0].picsUrl);
                top1Price.innerHTML = formateMoney(list[0].price, list[0].priceUnit); 

                if (len === 1) {
                    rightHotPatternsWrapper.style.display = 'none';
                } else if (len === 2) {
                    // 为左边的设置 flex: 2;
                    rightHotPatternsWrapper.style.cssText += '-webkit-box-flex:2;flex:2;';
                    // 然后隐藏 top3 已达到平铺等高效果
                    top3.style.display = 'none';
                    //---------//
                    setDataId(top2, list[1].id);
                    setBackgroundImage(top2Img, list[1].picsUrl);
                    top2Price.innerHTML = formateMoney(list[1].price, list[1].priceUnit); 
                } else {
                    setDataId(top2, list[1].id);
                    setBackgroundImage(top2Img, list[1].picsUrl);
                    top2Price.innerHTML = formateMoney(list[1].price, list[1].priceUnit);

                    setDataId(top3, list[2].id);
                    setBackgroundImage(top3Img, list[2].picsUrl);
                    top3Price.innerHTML = formateMoney(list[2].price, list[2].priceUnit); 
                }
            }
        });
        // 获取新品列表
        listCompanyBindingProduct({
            classId: newPatternsDataId,
            companyId
        }, function(res) {
            console.log('新品2', res);
            var list = res.data.list;
            var listStr = '';
            if (list.length) {
                newPatterns.style.display = 'block';
            }
            for (var i = 0; i < list.length; i++) {
                listStr += `<div class="patterns" data-id="${list[i].id}">
                                <div class="img" style="background-image:url(${list[i].picsUrl})"></div>
                                <p class="number">#${list[i].productNo}</p>
                                <p class="price">${formateMoney(list[i].price, list[i].priceUnit)}</p>
                            </div>`;
            }
            c('#newPatterns').getElementsByClassName('patterns-wrapper')[0].innerHTML = listStr;
            /* eslint-disable no-new */
            new BScroll(c('#wrapper1'), { click: true });
        });
    });

    // 2017年5月18日 新增？
    // 用户自定义花型分类列表
    listVisitUserProductCategory({
        companyId,
        pageNo: 1,
        pageSize: 50
    }, function(res) {
        console.log('listVisitUserProductCategory', res);
        var list = res.data.list;
        list.forEach(function(item) {
            // 店铺分类绑定的花型列表
            console.log('自定义item', item);
            listCompanyBindingProduct({
                classId: item.id,
                companyId,
                pageNo: 1,
                pageSize: 10
            }, function(res) {
                console.log('自定义列表', res);
                var len;
                var MAX_LENGTH = 4;
                var itemList = res.data.list;

                // 自定义分类的标题
                var listTile = item.className;

                // 这个是 type 的 wrapper 这样做是为了方便使用appendChild

                var typeWrapper = document.createElement('div');
                typeWrapper.className = 'type';
                var listStr = `<div class="name border-bottom">${listTile}</div>
                            <div class="patterns-wrapper clearfix">`;
                
                if (itemList.length > MAX_LENGTH) {
                    len = MAX_LENGTH;
                } else {
                    len = itemList.length;
                }
                // 这里最多只展示 4 条，查过部分查看更多
                for (var i = 0; i < len; i++) {
                    listStr += `<div class="patterns" data-id="${itemList[i].id}">
                                    <div class="img" style="background-image:url(${itemList[i].picsUrl})"></div>
                                    <p class="number">#${itemList[i].productNo}</p>
                                    <p class="price">${formateMoney(itemList[i].price, itemList[i].priceUnit)}</p>
                                </div>`;
                }
                listStr += '</div></div>';

                if (itemList.length > MAX_LENGTH) {
                    listStr += `<div class="seemore border-bottom">
                                    查看更多${listTile}
                                </div>`;
                }
                typeWrapper.innerHTML = listStr;
                document.getElementById('wrapper1Div').appendChild(typeWrapper);
                /* eslint-disable no-new */
                new BScroll(document.getElementById('wrapper1'), { click: true });
            });
        });
    });

    var tabItem = document.getElementsByClassName('tab-item'),
        footerItem = document.getElementsByClassName('footer-item'),
        contentSwiper = new Swiper('#content', {
            onSlideChangeEnd: swiperControl
        }),
        supplyList = document.getElementsByClassName('supply-list'),
        moreButton = document.getElementsByClassName('more-button')[0];

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
                        location.href = url + '?companyId=' + companyId;
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
