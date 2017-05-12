'use strict';

import { headers, baseURL } from '../../../config/config';

import { Ajax } from './ajax';

const API = {
    user: {
        checkPhone: '/front/user/checkPhone' // 检查手机号码是否存在
    },
    company: {
        getCompanyInfo: '/company/getCompanyInfo', // 获取档口OR工厂信息
        getCompanySimpleInfo: '/company/getCompanySimpleInfo' // 获取简单的公司信息
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

function _fetch(method = METHODS.get, data, url, cb) {

    let _headers = headers;
    // 由于接口问题，暂时需要 配置一个 x-token
    _headers['x-token'] = 'aa19635f5b994f34806ca081f61fdb48';

    let param = {
        method: method,
        url: baseURL + url,
        headers: _headers,
        data: _formatData(method, data),
        success: function(res) {
            typeof cb === 'function' && cb(res);
        }
    };
    Ajax(param);
}
// 检查手机号码，此接口没有跨域问题
export function checkPhone(data, cb) {
    return _fetch(METHODS.get, data, API.user.checkPhone, cb);
}
// 获取公司信息(详细)
export function getCompanyInfo(data, cb) {
    return _fetch(METHODS.get, data, API.company.getCompanyInfo, cb);
}
// 获取公司信息(简单)
export function getCompanySimpleInfo(data, cb) {
    return _fetch(METHODS.post, data, API.company.getCompanySimpleInfo, cb);
}
