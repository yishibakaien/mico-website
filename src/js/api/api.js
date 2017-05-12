'use strict';

import { headers, baseURL } from '../../../config/config';

import { Ajax } from './ajax';

const API = {
    user: {
        checkPhone: '/front/user/checkPhone' // 检查手机号码是否存在
    },
    company: {
        getCompanyInfo: '/company/getCompanyInfo', // 获取档口OR工厂信息
        getCompanySimpleInfo: '/company/getCompanySimpleInfo'
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

export function checkPhone(data, cb) {
    return _fetch(METHODS.get, data, API.user.checkPhone, cb);
}

export function getCompanyInfo(data, cb) {
    return _fetch(METHODS.get, data, API.company.getCompanyInfo, cb);
}

export function getCompanySimpleInfo(data, cb) {
    return _fetch(METHODS.post, data, API.company.getCompanySimpleInfo, cb);
}
