'use strict';
import '../stylus/common/common';
import '../stylus/static/reset/reset';
import '../stylus/dress';
import { bind, c, getQueryString, formateMoney } from './utils/utils';
import { listVistitCompanyProducts } from './api/api';
import Toast from './utils/Toast';

// (function() { 
var modles = document.querySelectorAll('.modles-prototype img'),
    modle = c('.modle-container')[0],
    // modlePic = modle.getElementsByTagName('img')[0],
    modlePic = c('#modlePic'),
    back = c('#back'),
    iptUpload = c('#iptUpload'),
    wrapper = c('.modle-img-wrapper')[0],
    btnSwitch = c('#switch'),
    leftSideModles = c('.modles-leftside-container')[0],
    leftSideModlesImg = leftSideModles.getElementsByTagName('img'),
    range = c('#range'),
    mask = c('.mask')[0];

var choose = c('#choose'); // 选择店内花型按钮
var patterns = c('#patterns');// 花型页面
var listWrapper = document.getElementById('listWrapper');
var more = document.getElementById('more');
var noMore = document.getElementById('noMore');
var noData = document.getElementById('noData');
var goBabck = c('#goBabck');

// var imgUrl = location.search.split('?url=')[1];
var imgUrl = getQueryString('url');
var companyId = getQueryString('companyId');
console.log('图片url', imgUrl);
console.log('companyId', companyId);
var pageSize = 10;
var pageNo = 1;

// alert('获取到的location.href:' + location.href);
// alert('获取到的location.search：' + location.search);
// alert('获取到的url上传来的图片地址是:' + imgUrl);
if (imgUrl) {
    // alert('判断有图片进入设置衣服操作');
    modle.style.display = 'block';
    modlePic.onload = function() {
        // alert('执行设置衣服操作' + imgUrl);
        wrapper.style.backgroundImage = 'url(' + imgUrl + ')';
        // alert('执行设置衣服操作完毕' + imgUrl);
        modlePic.onload = null;
    };
    modlePic.onerror = function() {
        Toast.error('模特加载失败');
    };
}
if (companyId) {
    choose.style.display = 'block';
}

for (var i = 0; i < modles.length; i++) {
    (function(i) {
        bind(modles[i], 'click', function() {
            Toast.loading('正在加载');
            modlePic.onload = function() {
                Toast.hide();
                modle.style.display = 'block';
                modlePic.onload = null;
            };
            modlePic.src = this.src.split('modles_prototype').join('modles').replace('.jpg', '.png');
        });
        bind(leftSideModlesImg[i], 'click', function() {
            Toast.loading('正在加载');
            modlePic.onload = function() {
                Toast.hide();
                // modle.style.display = 'block';
                mask.style.display = 'none';
                leftSideModles.className = 'modles-leftside-container hide-slide';
                modlePic.onload = null;
            };
            modlePic.onerror = function() {
                Toast.error('模特加载失败');
            };
            modlePic.src = this.src.split('modles_prototype').join('modles').replace('.jpg', '.png');
        });
    })(i);
}
bind(back, 'click', function() {
    modle.style.display = 'none';
});

bind(iptUpload, 'change', function() {
    previewImage(this);
});

bind(range, 'input', function() {
    wrapper.style.backgroundSize = this.value + '%';
    // console.log('缩放比例', this.value);
});

bind(btnSwitch, 'click', function() {

    leftSideModles.className = 'modles-leftside-container show-slide';

    mask.style.display = 'block';
});

bind(mask, 'click', function() {
    this.style.display = 'none';
    leftSideModles.className = 'modles-leftside-container hide-slide';
});

function previewImage(file) {
    // console.log('file', file.files);
    if (file.files && file.files[0]) {
        var reader = new FileReader();
        bind(reader, 'load', function(evt) {
            wrapper.style.background = 'url(' + evt.target.result + ')';
        });
        reader.readAsDataURL(file.files[0]);
    }
}
// })();


// 花型选择
bind(choose, 'click', function() {
    patterns.style.display = 'block';
    getAllData();
    pageNo++;
});
bind(goBabck, 'click', function() {
    patterns.style.display = 'none';
});
// 请求全部花型
function getAllData() {
    Toast.loading('加载花型中');
    listVistitCompanyProducts({
        companyId,
        pageNo,
        pageSize
    }, function(res) {
        Toast.hide();
        console.log('请求全部花型', res);
        htmlHandler(res);
    }, function() {
        Toast.error('加载失败');
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
    getAllData();
};
function bindClickEvent(ele) {
    var img = ele.getElementsByClassName('img');
    console.log('花型', img);
    for (var i = 0; i < img.length; i++) {
        (function(i) {
            img[i].onclick = function() {
                var imgUrl = this.style.backgroundImage;
                wrapper.style.backgroundImage = imgUrl;
                patterns.style.display = 'none';
            };
        })(i);
    }
}
