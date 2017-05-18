'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';

import {
    getQueryString
} from './utils/utils';

import {
    // listProductCategory,
    // 店铺自定义花型分类列表
    listVisitUserProductCategory,
    // 店铺系统定义花型分类列表
    listVisitSystemProductCategory
} from './api/api';
var companyId = getQueryString('companyId');
var userClassify = document.getElementById('userClassify');
var systemClassify = document.getElementById('systemClassify');

listVisitUserProductCategory({
    companyId,
    pageSize: 100
}, function(res) {
    console.log('用户自定义分类', res);
    var data = res.data;
    handleUserData(data);
});

listVisitSystemProductCategory({
    companyId
}, function(res) {
    console.log('系统花型', res);
    var data = res.data;
    handleSystemData(data);
});

function handleSystemData(data) {
    var systemClassifyStr = '';
    data.forEach(function(item) {
        systemClassifyStr += `<div class="list">
                                <span class="text">${item.className} (${item.bindingCount}款)</span>
                                <i class="iconfont icon-back"></i>
                            </div>`;
    });
    systemClassify.innerHTML = systemClassifyStr;
}

function handleUserData(data) {
    // situation 情况(0-店铺未上传花型 1-店铺未自定义分类 2-店铺有自定义分类)
    var situation = data.situation;
    console.log('situation', situation);
    var list = data.list;
    console.log(list);
    var userClassifyStr = '';
    list.forEach(function(item) {
        userClassifyStr += `<div class="list">
                                <span class="text">${item.className} (${item.bindingCount}款)</span>
                                <i class="iconfont icon-back"></i>
                            </div>`;
    });
    userClassify.innerHTML = userClassifyStr;
}

(function() {
    var list = document.getElementsByClassName('list'),
        i;
    for (i = 0; i < list.length; i++) {
        (function(i) {
            list[i].onclick = function() {
                location.href = './patterns_list.html';
            };
        })(i);
    }
})();