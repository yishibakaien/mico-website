'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';
import '../stylus/search';

import {
    c,
    getQueryString,
    formateMoney,
    formateSupplyType,
    formatPicUrl,
    checkAndroid
} from './utils/utils';

// import blackTip from './utils/blackTip';

import Toast from './utils/Toast';

// AlloyTeam 图片裁剪
import AlloyCrop from './utils/crop/crop';

import uploadPictrue from './utils/uploadPictrue';

// 2017年7月28日17:41:59  改版的切图
import Cropper from './utils/crop2/cropper.js';
import './utils/crop2/cropper.styl';


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

var DEFAULT_RESULT = 1;
var TEXT_RESULT = 2;
var PIC_RESULT = 3;


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
    // camera 相机图标
    var camera = c('#camera');
    // 缩略图
    var searchPic = c('#searchPic');

    // 图片搜索按钮
    var searchPicButtons = document.querySelectorAll('.search-btn-wrapper .button');

    var searchResultBox = c('#searchResultBox');
    var isSeemore = false;

    var more = c('#more');
    var noMore = c('#noMore');

    var tip = null; // 为提示预留的变量

    // 2017年7月29日09:07:24  切图修改
    var image = c('#cropperImage'); // 拿来切的图
    var cropperWrapper = c('#cropperWrapper'); // 切图器DOM
    var buttons; // 用来点击切图的按钮
    var cropper; // 切图器

    // 2017年8月4日10:24:35  判断是否安卓客户端，移除 html input[type=file] 中的 capture="camera" 属性，动态添加，解决IOS端部分版本 直接打开相机而不能选择相册的BUG
    if (checkAndroid()) {
        searchPicIpt.setAttribute('captrue', 'camera');
    }

    // 点击事件转发
    camera.onclick = function() {
        searchPicIpt.click();
    };
    searchPicIpt.onchange = function() {
        uploadPictrue(this, function(base64) {
            image.src = base64;
            cropper = new Cropper(image, {
                scalable: false,
                zoomable: false
            });
            console.log('Cropper', cropper);
            // console.log('Cropper.cropper', cropper.cropper);
            cropperWrapper.style.display = 'block';
            setTimeout(function() {
                bindCropEvent();
            }, 500);
            
        });
    };

    var defaultQueryParams = {
        pageNo: 1,
        pageSize: 10,
        companyId: companyId
    };
    var textSearchQueryParams = {
        category: null, // 面料-100010，大边-100011，小边-100012，睫毛-100013
        companyId: companyId,
        // dateSort: 1, // 1 升序，2降序，如果不指定，则按匹配度自然排序
        ingredient: null, // 成分
        keywords: '',
        pageNo: 1,
        pageSize: 10,
        // priceSort: 1, // 1 升序，2降序，如果不指定，则按匹配度自然排序
        searchType: 1 // 1:店铺搜索 2:全局搜索
    };
    var picSearchQueryParams = {
        category: 100010,
        companyId: companyId,
        timeout: 60000,
        encoded: '',
        searchType: 110
    };
    var getResultQueryParams = {
        id: '',
        pageNo: 1,
        pageSize: 20
    };

    function bindCropEvent() {
        var btns = c('.btn-cell');
        console.log(btns, btns.length);
        Array.prototype.forEach.call(btns, function(item) {
            item.onclick = picCroped;
        });
    }

    function picCroped() {
        console.log(this);
        var category = this.getAttribute('category');
        var base64 = cropper.getCroppedCanvas().toDataURL('image/png');
        if (base64.length > 1000000) {
            alert('图片体积过大，您截取的图片大小需要再减少 ' + Math.floor(((base64.length / 1000000) - 1) * 100) + '% 左右');
            Toast.hide();
            return;
        };
        cropperWrapper.style.display = 'none';
        cropper.destroy();
        Toast.loading('搜索' + formateSupplyType(category) + '中');
        picSearchQueryParams.category = category;
        picSearchQueryParams.encoded = base64;
        doPicSearch();
    }
    
    // function bindSearchPicEvent(base64) {
    //     // console.log(base64);
    //     Array.prototype.forEach.call(searchPicButtons, function(item) {
    //         item.onclick = function() {
    //             tip = blackTip({
    //                 time: 10000000,
    //                 text: '正在搜索中'
    //             });
    //             var category = this.getAttribute('data-category');
    //             console.log('搜索的类', category);
    //             picSearchQueryParams.category = category;
    //             picSearchQueryParams.encoded = base64;
    //             doPicSearch();
    //         };
    //     });
    // }
    function doPicSearch() {
        // hidePicBox();
        console.log(picSearchQueryParams);
        
        encoded(picSearchQueryParams, function(res) {
            if (res.code !== 0) {
                if (res.code === 210018) {
                    Toast.error('用户未登录');
                }
            }
            console.log('encoded的res', res);
            console.log('搜索的key', res.data.searchKey);
            var pollingTimer = setInterval(function() {
                polling({
                    searchKey: res.data.searchKey
                }, function(res) {
                    console.log(res.data);
                    if (res.data !== -1) {
                        Toast.hide();
                        clearInterval(pollingTimer);
                        getResultQueryParams.id = res.data;
                        getResult(getResultQueryParams, function(res) {
                            // mockData.res = 1;
                            console.log(res);
                            if (res.data.list.length === 0) {
                                Toast.info('未找到相似花型', 2000);
                            }
                            htmlHandler(res, searchResultBox, PIC_RESULT);
                        });
                    }
                });
            }, 1000);
        });
    }
    // 店铺文本搜索
    searchIpt.oninput = function() {
        textSearchQueryParams.keywords = this.value;
    };
    searchBtn.onclick = function() {

        var value = textSearchQueryParams.keywords = searchIpt.value;
        if (!value.length) {
            return;
        }
        // 每次点击 搜索按钮 时清空 页面
        searchResultBox.innerHTML = '';
        console.log('关键字', value);
        Toast.loading('正在加载中');
        dosearch();
    };

    // 页面一进入 默认显示 店铺已有的一些花型
    showDefaultResult();

    function showDefaultResult() {
        listVistitCompanyProducts(defaultQueryParams, function(res) {
            console.log('默认显示搜索结果的花型', res);
            htmlHandler(res, searchResultBox, DEFAULT_RESULT);
        });
    }

    function dosearch() {
        console.log('查询参数', textSearchQueryParams);
        if (!isSeemore) {
            searchResultBox.innerHTML = '';
            isSeemore = false;
        }
        searchText.innerHTML = textSearchQueryParams.keywords;
        search(textSearchQueryParams, function(res) {
            console.log('搜索返回的结果', res);
            if (res.data.list.length === 0) {
                Toast.info('无匹配结果');
            } else {
                Toast.hide();
            }
            htmlHandler(res, searchResultBox, TEXT_RESULT);
        });
    }

    function htmlHandler(res, ele, resultType) {
        var list = res.data.list;
        var listStr = '';
        var div = document.createElement('div');
        // if (list.length === 0) {
        //     ele.innerHTML = '<div class="on-patterns-tip">没有搜索到相应的内容</div>';
        //     return;
        // }
        for (var i = 0; i < list.length; i++) {
            listStr += `<div class="patterns" data-id="${list[i].id}">
                            <div class="img" style="background-image:url(${formatPicUrl(list[i].defaultPicUrl, true)})"></div>
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

        // 这里做了特殊处理，文本搜索时，如果 默认值查看过更多则清空 resultBox
        if ((resultType === TEXT_RESULT) && (defaultQueryParams.pageNo > 1)) {
            // console.log('pageNo', pageNo);
            ele.innerHTML = '';
            defaultQueryParams.pageNo = 1;
        }
        if (resultType === PIC_RESULT) {
            // console.log('pageNo', pageNo);
            ele.innerHTML = '';
            defaultQueryParams.pageNo = 1;
            noMore.style.display = 'block';
            more.style.display = 'none';
        }
        more.onclick = function() {
            isSeemore = true;
            // 如果 不是 默认展示的数据的 更多按钮 点击
            if (resultType === TEXT_RESULT) {
                textSearchQueryParams.pageNo++;
                console.log('点击查看更多之后的请求参数列表', textSearchQueryParams);
                // 默认展示的数据 被点击过查看更多
                dosearch();
            } else if (resultType === DEFAULT_RESULT) {
                // 如果 是 默认展示数据的 更多按钮 点击
                defaultQueryParams.pageNo++;
                showDefaultResult();
            } else if (resultType === PIC_RESULT) {
                getResultQueryParams.pageNo++;
                getResult(getResultQueryParams, function(res) {
                    htmlHandler(res, searchResultBox, PIC_RESULT);
                });
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
        searchTextBox.style.display = 'none';
    }
    function showTextBox() {
        searchTextBox.style.display = 'block';
        searchPicBox.style.display = 'none';
    }
    console.log(showTextBox.name);
    // function hidePicBox() {
    //     searchPicBox.style.display = 'none';
    // }
    
// })();
