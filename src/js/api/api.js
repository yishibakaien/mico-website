'use strict';

import { headers, baseURL } from '../../../config/config';

import { Ajax } from './ajax';

import blackTip from '../utils/blackTip';

const API = {
    user: {
        checkPhone: '/front/user/checkPhone' // 检查手机号码是否存在
    },
    main: {
        // 首页进来之后需要展示的信息
        // ①、[获取系统定义花型分类列表] 获取data(Array) Array[0] 爆款 Array[1] 新品 里的id 参数
        listSystemProductCategory: '/productCategory/listSystemProductCategory',
        
        // ②、[获取自定义花型分类列表] 获取data.list(Array) 获取 Array[index] 里的id 参数
        listUserProductCategory: '/productCategory/listUserProductCategory',
        
        // ③、用 ① 和 ② 获取获取到的id 到 [工厂or档口管理] 下的 [店铺分类绑定的花型列表]当做classId传参
        listCompanyBindingProduct: '/productCategoryBanding/listCompanyBindingProduct',

        // 店铺供应列表
        listVisitCompanySupplys: '/companySupply/listVisitCompanySupplys',

        // 2017年5月18日 新增？
        // 店铺系统定义花型分类列表
        listVisitSystemProductCategory: '/productCategory/listVisitSystemProductCategory',

        // 2017年5月18日 新增？
        // 店铺自定义花型分类列表
        listVisitUserProductCategory: '/productCategory/listVisitUserProductCategory'
    },
    company: {
        // 获取档口OR工厂信息
        getCompanyInfo: '/company/getCompanyInfo', 

        // 获取简单的公司信息
        getCompanySimpleInfo: '/company/getCompanySimpleInfo', 

        // 店铺花型分类
        listProductCategory: '/productCategory/listProductCategory',

        // 获取花型列表
        listProducts: '/product/listProducts',        

        // 获取分类绑定的花型列表
        listBindingProduct: '/productCategoryBanding/listBindingProduct'        
    },
    detail: {
        // 获取花型详情
        getProduct: '/product/getProduct/',

        // 获取供应详情
        getCompanySupply: '/companySupply/getCompanySupply/'
    }
};

const METHODS = {
    get: 'GET',
    post: 'POST'
};

function _formatData(method, data) {

    if (!data) {
        return '';
    }
    if (method === METHODS.get) {
        return data;
    } else if (method === METHODS.post) {
        return JSON.stringify(data);
    }
}

function _fetch(method = METHODS.get, data, url, cb, err) {

    let _headers = headers;
    // 模拟用户登录token
    _headers['x-token'] = '8f6b68291b344b869552669305378e48';

    let param = {
        method: method,
        url: baseURL + url,
        headers: _headers,
        data: _formatData(method, data),
        success: function(res) {
            if (typeof cb === 'function') {
                cb(res);
            }
        },
        error: function(res) {
            blackTip({
                text: '请检查网络',
                type: 'info'
            });
            // 待定 也blackTip 统一处理
            if (typeof err === 'function') {
                err(res);
            }
        }
    };
    Ajax(param);
}

// 检查手机号码，此接口没有跨域问题
export function checkPhone(data, cb, err) {
    return _fetch(METHODS.get, data, API.user.checkPhone, cb, err);
}

// 获取公司信息(详细)
export function getCompanyInfo(data, cb, err) {
    return _fetch(METHODS.get, data, API.company.getCompanyInfo, cb, err);
}

// 获取公司信息(简单)
export function getCompanySimpleInfo(data, cb, err) {
    return _fetch(METHODS.post, data, API.company.getCompanySimpleInfo, cb, err);
}

// 获取花型分类信息
export function listProductCategory(data, cb, err) {
    return _fetch(METHODS.get, data, API.company.listProductCategory, cb, err);
}

// 获取花型列表
export function listProducts(data, cb, err) {
    return _fetch(METHODS.post, data, API.company.listProducts, cb, err);
}

// 获取自定义花型分类列表
export function listUserProductCategory(data, cb, err) {
    return _fetch(METHODS.post, data, API.main.listUserProductCategory, cb, err);
}

// 获取系统定义花型分类列表
export function listSystemProductCategory(data, cb, err) {
    return _fetch(METHODS.get, data, API.main.listSystemProductCategory, cb, err);
}

// 获取分类绑定的花型列表
export function listBindingProduct(data, cb, err) {
    return _fetch(METHODS.get, data, API.company.listBindingProduct, cb, err);
}

// 获取花型详情
export function getProduct(data, cb, err) {
    let _data = data;
    let url = API.detail.getProduct.toString() + _data.id.toString();
    return _fetch(METHODS.get, {}, url, cb, err);
}

// 获取供应详情
export function getCompanySupply(data, cb, err) {
    let _data = data;
    let url = API.detail.getCompanySupply.toString() + _data.id.toString();
    return _fetch(METHODS.get, {}, url, cb, err);
}

// 店铺分类绑定的花型列表
export function listCompanyBindingProduct(data, cb, err) {
    return _fetch(METHODS.get, data, API.main.listCompanyBindingProduct, cb, err);
}

// 店铺供应列表
export function listVisitCompanySupplys(data, cb, err) {
    return _fetch(METHODS.get, data, API.main.listVisitCompanySupplys, cb, err);
}

// 2017年5月18日 新增？
// 店铺系统定义花型分类列表
export function listVisitSystemProductCategory(data, cb, err) {
    return _fetch(METHODS.get, data, API.main.listVisitSystemProductCategory, cb, err);
}

// 2017年5月18日 新增？
// 店铺自定义花型分类列表
export function listVisitUserProductCategory(data, cb, err) {
    return _fetch(METHODS.post, data, API.main.listVisitUserProductCategory, cb, err);
}
