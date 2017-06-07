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
    var pageNo = 1; // 这个pageNo 是为默认展示的数据预留的
    var pageSize = 10;

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
                    hideTextBox();
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

    var queryParams = {
        category: '', // 面料-100010，大边-100011，小边-100012，睫毛-100013
        companyId: companyId,
        dateSort: 1, // 1 升序，2降序，如果不指定，则按匹配度自然排序
        ingredient: '', // 成分
        keywords: '',
        pageNo: 1,
        pageSize: pageSize,
        priceSort: 1, // 1 升序，2降序，如果不指定，则按匹配度自然排序
        searchType: 1 // 1:店铺搜索 2:全局搜索
    };

    function bindSearchPicEvent(base64) {
        Array.prototype.forEach.call(searchPicButtons, function(item) {
            item.onclick = function() {
                var b = blackTip({
                    time: 100000,
                    text: '正在搜索中'
                });
                var categroy = this.getAttribute('data-categroy');
                encoded({
                    category: categroy,
                    companyId,
                    encoded: base64,
                    searchType: 100
                }, function(res) {
                    console.log('图片搜索按钮', res);
                    var pollingTimer = setInterval(function() {
                        polling({
                            searchKey: res.data.searchKey
                        }, function(res) {
                            console.log('polling', res);
                            if (res.data !== -1) {
                                b.remove();
                                clearInterval(pollingTimer);
                                getResult({
                                    id: res.data,
                                    pageNo: 1,
                                    pageSize: 10
                                }, function(res) {
                                    console.log('图片搜索最终结果', res);
                                });
                            }
                        });
                    }, 1000);
                });
            };
        });
    }
    

    // 店铺图片搜索
    // var base64str = 'aaa';

    // 这里利用encoded 来获取阿里云 OSS url
    // encoded({
    //     category: 100010,
    //     companyId,
    //     encoded: base64str,
    //     searchType: 100
    // }, function(res) {
    //     console.log('图片搜索返回结果', res);
    //     var sourceUrl = res.data.sourceUrl;
    //     // return;
    //     urlSearch({
    //         category: 100010,
    //         companyId,
    //         url: sourceUrl,
    //         searchType: 100
    //     }, function(res) {
    //         console.log('urlSearch结果', res);
    //         var pollingTimer = setInterval(function() {
    //             polling({
    //                 searchKey: res.data.searchKey
    //             }, function(res) {
    //                 console.log('polling', res);
    //                 if (res.data !== -1) {
    //                     clearInterval(pollingTimer);
    //                 }
    //             });
    //         }, 100000);
    //     });
    // });
    // 店铺文本搜索
    searchIpt.oninput = function() {
        queryParams.keywords = this.value;
    };
    searchBtn.onclick = function() {

        var value = queryParams.keywords = searchIpt.value;
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
        listVistitCompanyProducts({
            companyId,
            pageNo,
            pageSize
        }, function(res) {
            console.log('默认显示搜索结果的花型', res);
            htmlHandler(res, searchResultBox, true);
        });
    }

    function dosearch() {
        console.log('查询参数', queryParams);
        if (!isSeemore) {
            searchResultBox.innerHTML = '';
            isSeemore = false;
        }
        searchText.innerHTML = queryParams.keywords;
        search(queryParams, function(res) {
            console.log('搜索返回的结果', res);
            tip.hide();
            htmlHandler(res, searchResultBox);
        });
    }

    function htmlHandler(res, ele, isDefaultResult) {
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

        // 这里做了特殊处理，点击搜索时，如果 默认值查看过更多则清空 resultBox
        if ((!isDefaultResult) && (pageNo > 1)) {
            console.log('pageNo', pageNo);
            ele.innerHTML = '';
            pageNo = 1;
        }
        more.onclick = function() {
            isSeemore = true;
            // 如果 不是 默认展示的数据的 更多按钮 点击
            if (!isDefaultResult) {
                queryParams.pageNo++;
                console.log('点击查看更多之后的请求参数列表', queryParams);
                // 默认展示的数据 被点击过查看更多
                dosearch();
            } else {
                // 如果 是 默认展示数据的 更多按钮 点击
                pageNo++;
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
    }
    function hideTextBox() {
        searchTextBox.style.display = 'none';
    }
    // function hidePicBox() {
    //     searchPicBox.style.display = 'none';
    // }
})();
