'use strict';
import '../stylus/common/common';
import '../stylus/static/reset/reset';
import '../stylus/patterns_list.styl';

import {
    getQueryString,
    formateMoney
} from './utils/utils';
import {
    listCompanyBindingProduct
} from './api/api';

// String.prototype.repeat = String.prototype.repeat || function(num) {
//     var str = '',
//         i;
//     if (typeof num !== 'number') {
//         throw new Error('argument must be an number');
//     }
//     for (i = 0; i < num; i++) {
//         str += this;
//     }
//     return str;
// };

var companyId = getQueryString('companyId');
var classId = getQueryString('classId');

var pageSize = 10;
var pageNo = 1;

var listWrapper = document.getElementById('listWrapper');
var more = document.getElementById('more');
var noMore = document.getElementById('noMore');
var noData = document.getElementById('noData');

getData();
function getData() {
    listCompanyBindingProduct({
        companyId,
        classId,
        pageSize,
        pageNo
    }, function(res) {
        console.log('分类花型列表', res);
        htmlHandler(res);
    });
}

function htmlHandler(res) {
    var list = res.data.list;
    var listStr = '';
    if (list.length === 0) {
        noData.style.display = 'block';
        return;
    }
    var div = document.createElement('div');
    for (let item of list) {
        listStr += `<div class="patterns" data-id="${item.id}">
                        <div class="img" style="background-image:url(${item.defaultPicUrl})"></div>
                        <p class="number">#${item.productNo}</p>
                        <p class="price">${formateMoney(item.price,item.priceUnit)}</p>
                    </div>`;
    }
    div.innerHTML = listStr;
    listWrapper.appendChild(div);
    // 这里有个坑  pageNo => pageNO 这个o 是大写
    if (res.data.pageSize * res.data.pageNO >= res.data.totalNum) {
        noMore.style.display = 'block';
        more.style.display = 'none';
    } else {
        more.style.display = 'block';
        noMore.style.display = 'none';
    }
    bindClickEvent(listWrapper);
}

more.onclick = function() {
    pageNo++;
    getData();
};
function bindClickEvent(ele) {
    var patterns = ele.getElementsByClassName('patterns');
    for (let item of patterns) {
        item.onclick = function() {
            var dataId = this.getAttribute('data-id');
            location.href = `./patterns_detail.html?companyId=${companyId}&dataId=${dataId}`;
        };
    }
}

// console.log('hello'.repeat(3));
(function() {
    var patterns = document.getElementsByClassName('patterns'),
        i,
        len = patterns.length;
    for (i = 0; i < len; i++) {
        (function(i) {
            patterns[i].addEventListener('click', function() {
                location.href = './patterns_detail.html';
            }, false);
        })(i);
    }
})();