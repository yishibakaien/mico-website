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
// 进入搜索页面按钮
var searchBtn = document.getElementById('searchBtn');

var companyId = getQueryString('companyId');
// 全部花型
var allPatterns = document.getElementById('allPatterns');
// 用户分类
var userClassify = document.getElementById('userClassify');
// 系统分类
var systemClassify = document.getElementById('systemClassify');

console.log(allPatterns);
allPatterns.onclick = function() {
    location.href = `./patterns_list.html?companyId=${companyId}&all=1`;
};
searchBtn.onclick = function() {
    location.href = './search.html?companyId=' + companyId;
};
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
        systemClassifyStr += `<div class="list" data-id="${item.id}" company-id="${item.companyId}" style="${item.className === '独家花型' ? 'display: none' : 'display: block'}">
                                <span class="text">${item.className} (${item.bindingCount}款)</span>
                                <i class="iconfont icon-back"></i>
                            </div>`;
    });
    systemClassify.innerHTML = systemClassifyStr;
    bindClickEvent(systemClassify);
}

function handleUserData(data) {
    // situation 情况(0-店铺未上传花型 1-店铺未自定义分类 2-店铺有自定义分类)
    var situation = data.situation;
    console.log('situation', situation);
    var list = data.list;
    console.log(list);
    var userClassifyStr = '';
    list.forEach(function(item) {
        userClassifyStr += `<div class="list" style="display: ${item.bindingCount == 0 ? 'none' : 'block'}" data-id="${item.id}" company-id="${item.companyId}">
                                <span class="text">${item.className} (${item.bindingCount}款)</span>
                                <i class="iconfont icon-back"></i>
                            </div>`;
    });
    userClassify.innerHTML = userClassifyStr;
    bindClickEvent(userClassify);
}

function bindClickEvent(ele) {
    var list = ele.getElementsByClassName('list'),
        i,
        dataId,
        companyId;
    for (i = 0; i < list.length; i++) {
        (function(i) {
            list[i].onclick = function() {
                dataId = this.getAttribute('data-id');
                // alert(dataId);
                companyId = this.getAttribute('company-id');
                location.href = `./patterns_list.html?companyId=${companyId}&classId=${dataId}`;
            };
        })(i);
    }
}