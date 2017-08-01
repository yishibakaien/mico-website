'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/static/plugin/swiper-3.4.2.min.css';
import '../stylus/index';

import Swiper from 'swiper';
import wx from 'weixin-js-sdk';
// 升级版 iScroll
// import BScroll from 'better-scroll';
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
    setDataId,
    // 获取url参数
    getQueryString,
    _formatPicUrl
} from './utils/utils';
import {
    // 获取店铺花型分类 这个用于花型分类的跳转
    listProductCategory,
    // // 获取花型列表
    // listProducts,
    // 获取系统定义花型分类列表
    // listSystemProductCategory,
    // 获取自定义花型分类列表
    // listUserProductCategory,

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

    // 获取店铺花型列表
    listVistitCompanyProducts,

    // 获取简单店铺信息
    // getCompanySimpleInfo,
    // 获取详细店铺信息
    getCompanyInfo,

    // 微信授权jssdk 签名
    jsOAuth
 } from './api/api.js';

// 守均 店铺id 36444
// 宁博 店铺id 36438
// 无自定义花型 只有 [一种] 花型店铺id  36520
// 无自定义花型 有 [两种] 或以上花型的店铺id 36521
// const companyId = 36510;
const companyId = getQueryString('companyId');
const MAX_LENGTH = 6;
const activeIndex = getQueryString('activeIndex');
// 微信分享参数
var wxShareArg = {};

jsOAuth({
    url: location.href
}, function(res) {
    console.log('微信授权返回信息', res);
    wx.config({
        debug: false,
        appId: res.data.appId,
        timestamp: res.data.timestamp,
        nonceStr: res.data.noncestr,
        signature: res.data.signature,
        jsApiList: [ // 必填，需要使用的JS接口列表
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ]
    });
    // wx.ready(function() {
    //     console.log('success');
    //     // alert("jssdk注册页面成功:");
    //     // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
    //     // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
    //     // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。 
    //     var wxShareArg = {
    //         title: '蕾丝厂商微官网',
    //         link: location.href,
    //         desc: '快来我的店铺逛逛吧，这里可以快照搜花和3D试衣哦',
    //         imgUrl: 'http://zsbg.oss-cn-shenzhen.aliyuncs.com/search/332522982897352704.jpg'
    //     };
    //     wxBindFunction(wxShareArg);
    // });
});

function wxBindFunction(wxShareArg) {
    // alert("行程列表页面title: " + wxShareArg.title)
    // 微信分享到朋友圈
    wx.onMenuShareTimeline({
        title: wxShareArg.title, // 分享标题
        link: wxShareArg.link,   // 分享链接
        imgUrl: wxShareArg.imgUrl, // 分享图标
        trigger : function() {},
        success : function() { 
            // alert('分享成功');
        },
        cancel : function() {
            // alert('取消分享');
        }
    });
    // 分享给朋友
    wx.onMenuShareAppMessage({
        title: wxShareArg.title, // 分享标题
        desc: wxShareArg.desc, // 分享描述
        link: wxShareArg.link, // 分享链接
        imgUrl: wxShareArg.imgUrl, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function() { 
            // alert('分享成功');
        },
        cancel: function() {
            // alert('取消分享');
        }
    });
}

(function() {
    // alert(companyId);
    // 页面元素的获取
    var bgPic = c('#bgPic'),
        companyHeadIcon = c('#companyHeadIcon'),
        viewCount = c('#viewCount'),
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

    // 分割器，这里来分割 自定义分类和全部花型
    var spliter = c('#spliter');

    // 花型分类按钮
    var patternsClassfiy = c('#patternsClassfiy');

    // 点击跳转搜索界面
    var searchBtn = c('#searchBtn');

    // 电话联系按钮
    var contcat = c('#contcat');

    searchBtn.onclick = function() {
        location.href = './search.html?companyId=' + companyId;
    };
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
        // alert(JSON.stringify(res));
        // 头像
        // if (res.data.companyHeadIcon) {
        //     companyHeadIcon.src = res.data.companyHeadIcon;
        //     bgPic.src = res.data.companyBanner;
        // } else {
        //     // 如果没有头像这里的 文字原本是白色的就看不见了，所以设为黑色
        //     companyBusiness.style.color = companyName.style.color = '#333';
        // }
        
        // 2017年7月4日14:47:17 修改 默认头像为公司名字第一个字，需要把index.html 中的头像图片 display 设置为 none
        if (res.data.companyHeadIcon && res.data.companyHeadIcon.indexOf('default') === -1) {
            companyHeadIcon.style.display = 'block';
            companyHeadIcon.src = res.data.companyHeadIcon;
        } else {
            console.log('头像的父级元素', companyHeadIcon.parentNode);
            companyHeadIcon.parentNode.innerHTML = res.data.companyName.charAt(0);
        }
        if (res.data.companyBanner) {
            bgPic.src = res.data.companyBanner;
        }
        // 店铺类型 厂家 or 档口，这里应该只有厂家，但还是做判断较好
        if (res.data.companyType === 1) {
            typeTag.className = 'tag factory';
        } else if (res.data.companyType === 2) {
            typeTag.className = 'tag stalls';
        }
        viewCount.innerHTML = res.data.viewCount;
        // 公司名称
        companyName.innerHTML = res.data.companyName;
        // 公司主营项目
        
        // 在本地 存储中 存入companyName 用于图片打水印 
        localStorage.companyName = res.data.companyName;

        try {
            companyBusiness.innerHTML = res.data.companyExtendBO.companyBusiness ? '主营：' + res.data.companyExtendBO.companyBusiness : '';
        } catch (e) {
            console.log(e);
        }
           
        // 联系电话
        contcat.setAttribute('tel', res.data.phone);
        console.log(res.data.phone);
        wxShareArg = {
            title: res.data.companyName,
            imgUrl: encodeURIComponent(res.data.companyHeadIcon).split('%3A').join(':').split('%2F').join('/'),
            link: location.href,
            desc: '快来我的店铺逛逛吧，这里可以快照搜花和3D试衣哦'
        };
        wx.ready(function() {
            wxBindFunction(wxShareArg);
        });
        
    });
    // 店铺供应列表
    listVisitCompanySupplys({
        companyId,
        pageNo: 1,
        pageSize: 10
    }, function(res) {
        console.log('获取店铺供应列表', res);
        var len;
        var list = res.data.list;
        var itemStr = '';
        if (list.length === 0) {
            return;
        }
        if (list.length > MAX_LENGTH) {
            len = MAX_LENGTH;
        } else {
            len = list.length;
        }
        // 这里最多只展示6条，超过部分 则点击查看全部来进行查看
        for (var i = 0; i < len; i++) {
            itemStr += `<div class="supply-list" data-id="${list[i].id}">
                            <div class="img-wrapper" style="background-image:url(${_formatPicUrl(list[i].productPicUrl, 300)})"></div>
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
        if (list.length > MAX_LENGTH) {
            itemStr += `<div class="more-button" id="moreSupplyBtn" link="./all_supply.html">
                            查看全部供应
                        </div>`;
        }
        c('#wrapper2Div').innerHTML = itemStr;
        /* eslint-disable no-new */
        // new BScroll(c('#wrapper2'), { click: true });
        var supplyList = c('.supply-list');
        for (var n = 0; n < supplyList.length; n++) {
            (function(n) {
                supplyList[n].addEventListener('click', function() {
                    console.log(this.getAttribute('data-id'));
                    var dataId = this.getAttribute('data-id');
                    location.href = `./supply_detail.html?dataId=${dataId}`;
                });
            })(n);
        }
        // 如果有查看更多供应按钮
        if (c('#moreSupplyBtn')) {
            c('#moreSupplyBtn').addEventListener('click', function() {
                // 点击跳转供应列表页
                location.href = `./supply_list.html?companyId=${companyId}`;
            });
        }
    });

    // 这里获取花型的分类信息，用于花型分类的跳转
    listProductCategory({
        companyId
    }, function(res) {
        console.log('--花型分类的跳转', res);
        var situation = res.data.situation;
        patternsClassfiy.onclick = function() {

            if (situation === 0) {
                location.href = './no_patterns.html?companyId=' + companyId;
                // alert('该店铺暂未上传花型');
            } else if (situation === 1) {
                var cateGorysArr = res.data.categorys.map(function(item) {
                    return item;
                });
                var str = cateGorysArr.join('-');
                console.log('cateGorysStr', str);
                location.href = './default_classify.html?companyId=' + companyId + '&categorys=' + str;
            } else if (situation === 2) {
                location.href = './patterns_classify.html?companyId=' + companyId;
            }
        };
    });
    // 这里获取全部花型 2017年5月23日11:50:36
    listVistitCompanyProducts({
        companyId,
        pageNo: 1,
        pageSize: 6
    }, function(res) {
        console.log('全部花型分类', res);
        var len;
        var itemList = res.data.list;
        if (itemList.length === 0) {
            return;
        }
        // 这个是 type 的 wrapper 这样做是为了方便使用appendChild
        function showFlag(num) {
            if (num === 0) {
                return ' style="display:none" ';
            }
        }
        var typeWrapper = document.createElement('div');
        typeWrapper.className = 'type clearfix';
        var listStr = `<div class="name border-bottom" ${showFlag(itemList.length)}>全部花型</div>
                    <div class="patterns-wrapper clearfix">`;
        
        if (itemList.length > MAX_LENGTH) {
            len = MAX_LENGTH;
        } else {
            len = itemList.length;
        }
        // 这里最多只展示 6 条，超过部分查看更多
        for (var i = 0; i < len; i++) {
            listStr += `<div class="patterns" data-id="${itemList[i].id}">
                            <div class="img" style="background-image:url(${_formatPicUrl(itemList[i].defaultPicUrl, 300)})"></div>
                            <p class="number">${itemList[i].productNo}</p>
                            <p class="price">${formateMoney(itemList[i].price, itemList[i].priceUnit)}</p>
                        </div>`;
        }
        listStr += '</div></div>';
        // 这里的pageNO 的 o 为大写
        if ((res.data.pageNO * res.data.pageSize) < res.data.totalNum) {
            console.log(11);
            listStr += '<div class="seemore" id="seeAllPatterns">查看全部花型</div>';
        }
        typeWrapper.innerHTML = listStr;
        document.getElementById('wrapper1Div').appendChild(typeWrapper);
        if (c('#seeAllPatterns')) {
            c('#seeAllPatterns').onclick = function() {
                // all 这个参数用于下个页面判断是否为查看全部花型
                location.href = './patterns_list.html?all=1&companyId=' + companyId;
            };
        }
        bindClick('.type .patterns');
    });
    // 2017年5月18日 新增？
    // 系统自定义花型分类列表
    listVisitSystemProductCategory({
        companyId
    }, function(res) {
        console.log('listVisitSystemProductCategory 获取系统定义花型分类（爆款、新品）', res);

        // 爆款id
        var hotPatternsDataId = res.data[0].id;
        // 新品id
        var newPatternsDataId = res.data[1].id;
        // 获取爆款列表
        listCompanyBindingProduct({
            classId: hotPatternsDataId,
            companyId
        }, function(res) {
            console.log('爆款分类', res);
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
                setBackgroundImage(top1Img, _formatPicUrl(list[0].defaultPicUrl, 300));
                console.log('爆款0', list[0].price, list[0].priceUnit);
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
                    setBackgroundImage(top2Img, _formatPicUrl(list[1].defaultPicUrl, 300));
                    console.log('爆款1', list[1].price, list[1].priceUnit);
                    top2Price.innerHTML = formateMoney(list[1].price, list[1].priceUnit); 
                } else {
                    setDataId(top2, list[1].id);
                    setBackgroundImage(top2Img, _formatPicUrl(list[1].defaultPicUrl, 300));

                    top2Price.innerHTML = formateMoney(list[1].price, list[1].priceUnit);

                    setDataId(top3, list[2].id);
                    setBackgroundImage(top3Img, _formatPicUrl(list[2].defaultPicUrl, 300));
                    top3Price.innerHTML = formateMoney(list[2].price, list[2].priceUnit); 
                }
            }
            bindClick('#hotPatterns .patterns');
        });
        // 获取新品列表
        listCompanyBindingProduct({
            classId: newPatternsDataId,
            companyId
        }, function(res) {
            console.log('新品分类', res);
            var list = res.data.list;
            var listStr = '';
            var len;
            if (list.length) {
                newPatterns.style.display = 'block';
            }
            if (list.length > MAX_LENGTH) {
                len = MAX_LENGTH;
            } else {
                len = list.length;
            }
            for (let i = 0; i < len; i++) {
                listStr += `<div class="patterns" data-id="${list[i].id}">
                                <div class="img" style="background-image:url(${_formatPicUrl(list[i].defaultPicUrl, 300)})"></div>
                                <p class="number">${list[i].productNo}</p>
                                <p class="price">${formateMoney(list[i].price, list[i].priceUnit)}</p>
                            </div>`;
            }
            if (list.length > MAX_LENGTH) {
                listStr += '<div class="seemore" id="moreNew">查看更多新品</div>';
            }
            newPatterns.getElementsByClassName('patterns-wrapper')[0].innerHTML = listStr;
            if (c('#moreNew')) {
                c('#moreNew').addEventListener('click', function() {
                    // 点击跳转供应列表页
                    location.href = `./patterns_list.html?companyId=${companyId}&classId=${newPatternsDataId}`;
                });
            }
            
            /* eslint-disable no-new */
            // new BScroll(c('#wrapper1'), { click: true });
            bindClick('#newPatterns .patterns');
        });
    });

    // 2017年5月18日 新增？
    // 用户自定义花型分类列表
    listVisitUserProductCategory({
        companyId,
        pageNo: 1,
        pageSize: 50
    }, function(res) {
        console.log('listVisitUserProductCategory 获取用户自定义花型分类', res);
        var list = res.data.list;
        list.forEach(function(item) {
            // 店铺分类绑定的花型列表
            // console.log('自定义item', item);
            listCompanyBindingProduct({
                classId: item.id,
                companyId,
                pageNo: 1,
                pageSize: 10
            }, function(res) {
                console.log('用户自定义分类', res);
                var len;
                var itemList = res.data.list;

                // 自定义分类的标题
                var listTile = item.className;

                // 这个是 type 的 wrapper 这样做是为了方便使用appendChild
                function showFlag(num) {
                    if (num === 0) {
                        return ' style="display:none" ';
                    }
                }
                var typeWrapper = document.createElement('div');
                typeWrapper.className = 'type clearfix';
                var listStr = `<div class="name border-bottom" ${showFlag(itemList.length)}>${listTile}</div>
                            <div class="patterns-wrapper clearfix">`;
                
                if (itemList.length > MAX_LENGTH) {
                    len = MAX_LENGTH;
                } else {
                    len = itemList.length;
                }
                // 这里最多只展示 6 条，超过部分查看更多
                for (var i = 0; i < len; i++) {

                    listStr += `<div class="patterns" data-id="${itemList[i].id}">
                                    <div class="img" style="background-image:url(${_formatPicUrl(itemList[i].defaultPicUrl, 300)})"></div>
                                    <p class="number">${itemList[i].productNo}</p>
                                    <p class="price">${formateMoney(itemList[i].price, itemList[i].priceUnit)}</p>
                                </div>`;
                }
                listStr += '</div></div>';
                if (itemList.length > MAX_LENGTH) {
                    listStr += `<div class="seemore seeSelfPatterns" class-id="${item.id}">查看更多${listTile}</div>`;
                }
                typeWrapper.innerHTML = listStr;
                // document.getElementById('wrapper1Div').appendChild(typeWrapper);
                document.getElementById('wrapper1Div').insertBefore(typeWrapper, spliter);
                /* eslint-disable no-new */
                // new BScroll(document.getElementById('wrapper1'), { click: true });
                var seeSelfPatterns = c('.seeSelfPatterns');
                for (var m = 0; m < seeSelfPatterns.length; m++) {
                    (function(m) {
                        seeSelfPatterns[m].onclick = function() {
                            var classId = this.getAttribute('class-id');
                            location.href = `./patterns_list.html?companyId=${companyId}&classId=${classId}`;
                        };
                    })(m);
                }
                bindClick('.type .patterns');
            });
        });
    });

    function bindClick(selector) {
        var eles = document.querySelectorAll(selector);
        for (var i = 0; i < eles.length; i++) {
            (function(i) {
                eles[i].onclick = null;
                eles[i].onclick = jump;
            })(i);
        }
        function jump() {
            var dataId = this.getAttribute('data-id');
            // alert(dataId);
            location.href = `./patterns_detail.html?companyId=${companyId}&dataId=${dataId}`;
        }
    }
    

    var tabItem = document.getElementsByClassName('tab-item');
    var footerItem = document.getElementsByClassName('footer-item');
    var contentSwiper = new Swiper('#content', {
        onSlideChangeEnd: swiperControl,
        initialSlide: activeIndex ? activeIndex : 0
    });
    addActive(tabItem);
    footerClick(footerItem);
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
})();
