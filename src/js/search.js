'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/search';

import {
    c,
    getQueryString,
    formateMoney
} from './utils/utils';

import blackTip from './utils/blackTip';

// AlloyTeam 图片裁剪
import AlloyCrop from './utils/crop/crop';

import uploadPictrue from './utils/uploadPictrue';

// console.log(AlloyCrop);
import {
    // 文本搜索
    search,
    // 图片搜索
    encoded,
    // 图片搜索结果轮询
    polling,
    // 通过url 搜索图片
    // urlSearch,

    // 获取图片搜索结果
    getResult,

    // 2017年5月27日10:00:23 
    // 现在要求搜索 页面 默认显示一部分 店铺已有的花型
    listVistitCompanyProducts
} from './api/api';

var DEFAULT_RESULT = 1;
var TEXT_RESULT = 2;
// var PIC_RESULT = 3;

(function() {
    var companyId = getQueryString('companyId');
    var searchBtn = c('#searchBtn');
    var searchIpt = c('#searchIpt');

    // 显示文本搜索的盒子
    var searchTextBox = c('#searchTextBox');

    var searchText = c('#searchText');

    // 操作图片搜索的盒子
    var searchPicBox = c('#searchPicBox');
    // 上传图片input
    var searchPicIpt = c('#searchPicIpt');

    // 缩略图
    var searchPic = c('#searchPic');

    // 图片搜索按钮
    var searchPicButtons = document.querySelectorAll('.search-btn-wrapper .button');

    var searchResultBox = c('#searchResultBox');
    var isSeemore = false;

    var more = c('#more');
    var noMore = c('#noMore');

    var tip = null; // 为提示预留的变量
    // var pageNo = 1; // 这个pageNo 是为默认展示的数据预留的
    // var pageSize = 10;

    searchPicIpt.onchange = function() {
        uploadPictrue(this, function(value) {
            // cropPic.src = value;
            new AlloyCrop({
                image_src: value,
                circle: false, // optional parameters , the default value is false
                width: 240,
                height: 240,
                ok: function(base64, canvas) {
                    searchPic.src = base64;
                    showPicBox();
                    bindSearchPicEvent(base64);
                    console.log(canvas);
                },
                cancel: function() {},
                // 无损伤hack 判断当ok_text 为数组时，生成多个按钮
                ok_text: '确定', // optional parameters , the default value is ok
                cancel_text: '取消' // optional parameters , the default value is cancel
            });
        });
    };

    var defaultQueryParams = {
        pageNo: 1,
        pageSize: 10,
        companyId: companyId
    };
    var textSearchQueryParams = {
        category: '', // 面料-100010，大边-100011，小边-100012，睫毛-100013
        companyId: companyId,
        dateSort: 1, // 1 升序，2降序，如果不指定，则按匹配度自然排序
        ingredient: '', // 成分
        keywords: '',
        pageNo: 1,
        pageSize: 10,
        priceSort: 1, // 1 升序，2降序，如果不指定，则按匹配度自然排序
        searchType: 1 // 1:店铺搜索 2:全局搜索
    };
    var mockData = {
        'code': 0,
        'data': {
            'list': [{
                'category': '100010',
                'companyId': 37581,
                'companyName': '长乐正源针纺',
                'defaultPicUrl': 'http://imgdev.tswq.wang/factory/正源_8590/面料/8590_578102.JPG?x-oss-process=image/watermark,g_center,image_d2F0ZXJtYXJrL2RlZl9wcm9kLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzMw',
                'id': 198372,
                'ingredient': '',
                'price': 0,
                'priceUnit': '400010',
                'productNo': '10391',
                'publishDate': null,
                'stock': 0,
                'stockUnit': 400010
            }, {
                'category': '100010',
                'companyId': 38897,
                'companyName': '长乐正源针纺有限公司',
                'defaultPicUrl': 'http://imgdev.tswq.wang/factory/正源_357/面料/357_423356.jpg?x-oss-process=image/watermark,g_center,image_d2F0ZXJtYXJrL2RlZl9wcm9kLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzMw',
                'id': 55463,
                'ingredient': '',
                'price': 0,
                'priceUnit': '400010',
                'productNo': '10391',
                'publishDate': null,
                'stock': 0,
                'stockUnit': 400010
            }, {
                'category': '100010',
                'companyId': 37699,
                'companyName': '宇阳针织',
                'defaultPicUrl': 'http://imgdev.tswq.wang/factory/宇阳_8472/面料/8472_583442.jpg?x-oss-process=image/watermark,g_center,image_d2F0ZXJtYXJrL2RlZl9wcm9kLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzMw',
                'id': 203144,
                'ingredient': '全锦',
                'price': 0,
                'priceUnit': '400010',
                'productNo': 'w224',
                'publishDate': null,
                'stock': 0,
                'stockUnit': 400010
            }, {
                'category': '100010',
                'companyId': 37698,
                'companyName': '宇阳针织',
                'defaultPicUrl': 'http://imgdev.tswq.wang/factory/宇阳_8473/面料/8473_627624.jpg?x-oss-process=image/watermark,g_center,image_d2F0ZXJtYXJrL2RlZl9wcm9kLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzMw',
                'id': 247528,
                'ingredient': '',
                'price': 0,
                'priceUnit': '400010',
                'productNo': 'w224',
                'publishDate': null,
                'stock': 0,
                'stockUnit': 400010
            }, {
                'category': '100010',
                'companyId': 37961,
                'companyName': '唐绵纺织',
                'defaultPicUrl': 'http://imgdev.tswq.wang/factory/唐绵_8172/面料/8172_525237.jpg?x-oss-process=image/watermark,g_center,image_d2F0ZXJtYXJrL2RlZl9wcm9kLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzMw',
                'id': 145483,
                'ingredient': '',
                'price': 0,
                'priceUnit': '400010',
                'productNo': 'TL231',
                'publishDate': null,
                'stock': 0,
                'stockUnit': 400010
            }, {
                'category': '100010',
                'companyId': 38132,
                'companyName': '福建轩炜针纺有限公司',
                'defaultPicUrl': 'http://imgdev.tswq.wang/factory/轩炜_7903/面料/7903_581347.jpeg?x-oss-process=image/watermark,g_center,image_d2F0ZXJtYXJrL2RlZl9wcm9kLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzMw',
                'id': 201316,
                'ingredient': '',
                'price': 0,
                'priceUnit': '400010',
                'productNo': 'image',
                'publishDate': null,
                'stock': 0,
                'stockUnit': 400010
            }, {
                'category': '100010',
                'companyId': 37147,
                'companyName': '长乐圣辉针织有限公司',
                'defaultPicUrl': 'http://imgdev.tswq.wang/factory/圣辉针织_9051/面料/9051_643354.jpg?x-oss-process=image/watermark,g_center,image_d2F0ZXJtYXJrL2RlZl9wcm9kLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzMw',
                'id': 263817,
                'ingredient': '',
                'price': 0,
                'priceUnit': '400010',
                'productNo': 'SH2008',
                'publishDate': null,
                'stock': 0,
                'stockUnit': 400010
            }, {
                'category': '100010',
                'companyId': 37125,
                'companyName': '广州东欧纺织有限公司',
                'defaultPicUrl': 'http://imgdev.tswq.wang/factory/东欧纺织_9073/面料/9073_644217.jpg?x-oss-process=image/watermark,g_center,image_d2F0ZXJtYXJrL2RlZl9wcm9kLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzMw',
                'id': 264652,
                'ingredient': '锦棉',
                'price': 18,
                'priceUnit': '400010',
                'productNo': '6860',
                'publishDate': null,
                'stock': 0,
                'stockUnit': 400010
            }, {
                'category': '100010',
                'companyId': 38105,
                'companyName': '信达针织',
                'defaultPicUrl': 'http://imgdev.tswq.wang/factory/信达_7940/面料/7940_632952.png?x-oss-process=image/watermark,g_center,image_d2F0ZXJtYXJrL2RlZl9wcm9kLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzMw',
                'id': 253444,
                'ingredient': '锦涤',
                'price': 0,
                'priceUnit': '400010',
                'productNo': '6552',
                'publishDate': null,
                'stock': 0,
                'stockUnit': 400010
            }, {
                'category': '100010',
                'companyId': 38983,
                'companyName': '瑞峰',
                'defaultPicUrl': 'http://imgdev.tswq.wang/factory/瑞峰_216/面料/216_425615.jpg?x-oss-process=image/watermark,g_center,image_d2F0ZXJtYXJrL2RlZl9wcm9kLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzMw',
                'id': 56773,
                'ingredient': '',
                'price': 0,
                'priceUnit': '400010',
                'productNo': '98225',
                'publishDate': null,
                'stock': 0,
                'stockUnit': 400010
            }],
            'pageNO': 1,
            'pageSize': 10,
            'totalNum': 0,
            'totalPage': 0
        },
        'message': ''
    };

    function bindSearchPicEvent(base64) {
        console.log(base64);
        Array.prototype.forEach.call(searchPicButtons, function(item) {
            item.onclick = function() {
                var b = blackTip({
                    time: 100000,
                    text: '正在搜索中'
                });
                var categroy = this.getAttribute('data-categroy');
                console.log('搜索的类', categroy);
                encoded({
                    category: categroy,
                    companyId,
                    encoded: base64,
                    searchType: 100
                }, function(res) {
                    console.log('搜索的key', res.data.searchKey);
                    var pollingTimer = setInterval(function() {
                        polling({
                            searchKey: res.data.searchKey
                        }, function(res) {
                            console.log(res.data);
                            if (res.data !== -1) {
                                b.remove();
                                clearInterval(pollingTimer);
                                getResult({
                                    id: res.data,
                                    pageNo: 1,
                                    pageSize: 10
                                }, function(res) {
                                    res = mockData;
                                    console.log(res);
                                });
                            }
                        });
                    }, 1000);
                });
            };
        });
    }

    // 店铺文本搜索
    searchIpt.oninput = function() {
        textSearchQueryParams.keywords = this.value;
    };
    searchBtn.onclick = function() {

        var value = textSearchQueryParams.keywords = searchIpt.value;
        if (!value.length) {
            return;
        }
        // 每次点击 搜索按钮 时清空 页面
        searchResultBox.innerHTML = '';
        console.log('关键字', value);
        tip = blackTip({
            text: '正在加载中',
            time: 100000
        });
        dosearch();
    };

    // 页面一进入 默认显示 店铺已有的一些花型
    showDefaultResult();

    function showDefaultResult() {
        listVistitCompanyProducts(defaultQueryParams, function(res) {
            console.log('默认显示搜索结果的花型', res);
            htmlHandler(res, searchResultBox, DEFAULT_RESULT);
        });
    }

    function dosearch() {
        console.log('查询参数', textSearchQueryParams);
        if (!isSeemore) {
            searchResultBox.innerHTML = '';
            isSeemore = false;
        }
        searchText.innerHTML = textSearchQueryParams.keywords;
        search(textSearchQueryParams, function(res) {
            console.log('搜索返回的结果', res);
            if (res.data.list.length === 0) {
                tip.remove();
                blackTip({
                    text: '无匹配结果',
                    type: 'info'
                });
            } else {
                tip.remove();
                blackTip({
                    type: 'success',
                    text: '已完成'
                });
            }
            htmlHandler(res, searchResultBox, TEXT_RESULT);
        });
    }

    function htmlHandler(res, ele, resultType) {
        var list = res.data.list;
        var listStr = '';
        var div = document.createElement('div');
        // if (list.length === 0) {
        //     ele.innerHTML = '<div class="on-patterns-tip">没有搜索到相应的内容</div>';
        //     return;
        // }
        for (var i = 0; i < list.length; i++) {
            listStr += `<div class="patterns" data-id="${list[i].id}">
                            <div class="img" style="background-image:url(${list[i].defaultPicUrl})"></div>
                            <p class="number">${list[i].productNo}</p>
                            <p class="price">${formateMoney(list[i].price,list[i].priceUnit)}</p>
                        </div>`;
        }
        // 这里有个坑  pageNo => pageNO 这个o 是大写
        if (res.data.pageSize * res.data.pageNO >= res.data.totalNum) {
            noMore.style.display = 'block';
            more.style.display = 'none';
        } else {
            more.style.display = 'block';
            noMore.style.display = 'none';
        }
        div.innerHTML = listStr;

        // 这里做了特殊处理，文本搜索时，如果 默认值查看过更多则清空 resultBox
        if ((resultType === 2) && (defaultQueryParams.pageNo > 1)) {
            // console.log('pageNo', pageNo);
            ele.innerHTML = '';
            defaultQueryParams.pageNo = 1;
        }
        more.onclick = function() {
            isSeemore = true;
            // 如果 不是 默认展示的数据的 更多按钮 点击
            if (resultType === 2) {
                textSearchQueryParams.pageNo++;
                console.log('点击查看更多之后的请求参数列表', textSearchQueryParams);
                // 默认展示的数据 被点击过查看更多
                dosearch();
            } else if (resultType === 1) {
                // 如果 是 默认展示数据的 更多按钮 点击
                defaultQueryParams.pageNo++;
                showDefaultResult();
            }

        };
        ele.appendChild(div);
        bindClickEvent(ele);
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

    function showPicBox() {
        searchPicBox.style.display = 'block';
        searchTextBox.style.display = 'none';
    }

    function showTextBox() {
        searchTextBox.style.display = 'block';
        searchPicBox.style.display = 'none';
    }
    console.log(showTextBox.name);
    // function hidePicBox() {
    //     searchPicBox.style.display = 'none';
    // }
})();
