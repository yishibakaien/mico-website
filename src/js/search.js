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
    search
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
    var pageNo = 1;
    var pageSize = 10;

    var queryParams = {
        category: '', // 面料-100010，大边-100011，小边-100012，睫毛-100013
        companyId: companyId,
        dateSort: 1, // 1 升序，2降序，如果不指定，则按匹配度自然排序
        ingredient: '', // 成分
        keywords: '',
        pageNo: pageNo,
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
    function dosearch() {
        console.log('查询参数', queryParams);
        if (!isSeemore) {
            searchResultBox.innerHTML = '';
            isSeemore = false;
        }
        searchText.innerHTML = queryParams.keywords;
        search(queryParams, function(res) {
            console.log('搜索返回的结果', res);
            tip.remove();
            htmlHandler(res, searchResultBox);
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
            noMore.style.display = 'block';
            more.style.display = 'none';
        } else {
            more.style.display = 'block';
            noMore.style.display = 'none';
        }
        div.innerHTML = listStr;
        more.onclick = function() {
            isSeemore = true;
            pageNo++;
            dosearch();
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
