'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/search';

import {
    c,
    getQueryString,
    formateMoney,

} from './utils/utils';

import blackTip from './utils/blackTip';

import {
    search,
    // 2017年5月27日10:00:23 
    // 现在要求搜索 页面 默认显示一部分 店铺已有的花型
    listVistitCompanyProducts
} from './api/api';

(function() {
    var companyId = getQueryString('companyId');
    var searchBtn = c('#searchBtn');
    var searchIpt = c('#searchIpt');
    var searchText = c('#searchText');
    var searchResultBox = c('#searchResultBox');
    var isSeemore = false;

    var more = c('#more');
    var noMore = c('#noMore');

    var tip = null; // 为提示预留的变量
    var pageNo = 1; // 这个pageNo 是为默认展示的数据预留的
    var pageSize = 10;

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
    // 店铺文本搜索
    searchIpt.oninput = function() {
        queryParams.keywords = this.value;
    };
    searchBtn.onclick = function() {
        var value = queryParams.keywords = searchIpt.value;
        if (!value.length) {
            return;
        }
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
        more.onclick = function() {
            isSeemore = true;
            // 如果 不是 默认展示的数据的 更多按钮 点击
            if (!isDefaultResult) {
                queryParams.pageNo++;
                console.log('点击查看更多之后的请求参数列表', queryParams);
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
})();
