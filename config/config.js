'use strict';

// const env = 'test'; // 开发环境
// const env = 'test_news'; // 测试环境
var env = 'prod';
var headers = {
    'x-version': '1.0',
    'x-client': '4'
};

var baseURL = (function(env) {
    var urls = {
        dev: 'http://localhost:3001',
        test: 'http://192.168.2.11:8080',
        test_new: 'http://api.tswq.wang',
        test_news: 'https://api.tswq.wang',
        prod: 'https://api.ts57.cn'
    };
    return urls[env];
})(env);

export {
    headers,
    baseURL
};
