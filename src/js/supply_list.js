'use strict';
import '../stylus/common/common';
import '../stylus/static/reset/reset';
import '../stylus/supply_list.styl';

import {
    c,
    formatDate,
    formateSupplyType,
    // 获取路径参数
    getQueryString
} from './utils/utils';
import blackTip from './utils/blackTip';

import {
    // 店铺供应列表
    listVisitCompanySupplys,
} from './api/api.js';

var companyId = getQueryString('companyId');
// 当前页码
var pageNo = 1;
// 店铺供应列表
var pageSize = 10;

// 页面元素的获取
// 查看更多按钮
var more = c('#more');
var noMore  = c('#noMore');

getSupplyList();

function getSupplyList() {
    var b = blackTip({
        type: 'loading',
        text: '正在加载中',
        time: 10000
    });
    listVisitCompanySupplys({
        companyId,
        pageNo,
        pageSize
    }, function(res) {
        b.remove();
        console.log('店铺供应列表', res);
        var totalPage = res.data.totalPage;
        var len;
        var list = res.data.list;
        var itemStr = '';
        if (list.length > pageSize) {
            len = pageSize;
        } else {
            len = list.length;
        }
        var div = document.createElement('div');
        // 这里最多只展示6条，超过部分 则点击查看全部来进行查看
        for (var i = 0; i < len; i++) {
            itemStr += `<div class="supply-list" data-id="${list[i].id}">
                            <div class="img-wrapper" style="background-image:url(${list[i].productPicUrl})"></div>
                            <div class="content">
                                <h1 class="title">${list[i].supplyDesc
    }</h1>
                                <span class="type">${formateSupplyType(list[i].supplyShape)}</span>
                                <span class="time">${formatDate(list[i].updateDate, 'yyyy-MM-dd')}</span>
                                <i class="iconfont icon-back"></i>
                            </div>
                        </div>`;
        }
        div.innerHTML = itemStr;
        c('#main').appendChild(div);

        if (pageNo < totalPage) {
            more.style.display = 'block';
        } else {
            noMore.style.display = 'block';
            more.style.display = 'none';
        }
        var supplyList = c('.supply-list');
        for (let i of supplyList) {
            i.addEventListener('click', function() {
                console.log(this.getAttribute('data-id'));
                var dataId = this.getAttribute('data-id');
                location.href = `./supply_detail.html?dataId=${dataId}`;
            });
        }
    });
}

more.addEventListener('click', function() {
    pageNo++;
    getSupplyList();
}, false);