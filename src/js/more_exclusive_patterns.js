'use strict';
import '../stylus/common/common';
import '../stylus/static/reset/reset';
import '../stylus/patterns_list.styl';

import {
    getQueryString,
    formateMoney
} from './utils/utils';
import {
    listCompanyBindingProduct,
    // 获取全部花型
    listVistitCompanyProducts
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
var all = getQueryString('all');

var pageSize = 10;
var pageNo = 1;

var listWrapper = document.getElementById('listWrapper');
var more = document.getElementById('more');
var noMore = document.getElementById('noMore');
var noData = document.getElementById('noData');

getData();
function getData() {
    if (!classId) {
        return;
    }
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

// 请求全部花型
getAllData();
function getAllData() {
    if (!all) {
        return;
    }
    listVistitCompanyProducts({
        companyId,
        pageNo,
        pageSize
    }, function(res) {
        console.log('请求全部花型', res);
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
    for (var i = 0; i < list.length; i++) {
        listStr += `<div class="patterns" data-id="${list[i].id}">
                        <div class="img" style="background-image:url(${list[i].defaultPicUrl})"></div>
                        <p class="number">${list[i].productNo}</p>
                        <p class="price">${formateMoney(list[i].price,list[i].priceUnit)}</p>
                    </div>`;
    }
    div.innerHTML = listStr;
    listWrapper.appendChild(div);
    // alert('花型插入完毕', div); 
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
    if (all) {
        getAllData();
    } else {
        getData();
    }
};
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

// console.log('hello'.repeat(3));
// (function() {
//     var patterns = document.getElementsByClassName('patterns'),
//         i,
//         len = patterns.length;
//     for (i = 0; i < len; i++) {
//         (function(i) {
//             patterns[i].addEventListener('click', function() {
//                 location.href = './patterns_detail.html';
//             }, false);
//         })(i);
//     }
// })();