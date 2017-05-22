'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/search';

import {
    c,
    getQueryString
} from './utils/utils';

import blackTip from './utils/blackTip';

import {
    search
} from './api/api';

(function() {
    var companyId = getQueryString('companyId');
    var searchBtn = c('#searchBtn');
    var searchIpt = c('#searchIpt');
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
        searchType: 1, // 1:店铺搜索 2:全局搜索
        stockType: '' // 0:需要开机, 1:正在开机, 2:现货
    };
    // 店铺文本搜索
    searchIpt.oninput = function() {
        queryParams.keywords = this.value;
    };
    searchBtn.onclick = function() {
        console.log(queryParams);
        var value = queryParams.keywords;
        if (!value.length) {
            return;
        }
        console.log(value);
        tip = blackTip({
            text: '正在加载中',
            time: 10000
        });
        dosearch();
    };
    function dosearch() {
        search(queryParams, function(res) {
            console.log('搜索返回的结果', res);
            tip.remove();
        });
    }
})();
