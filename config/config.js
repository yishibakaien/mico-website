'use strict';

const env = 'dev'; // 这里配置环境

var baseURL = (function(env) {

    var baseURL;
    var urls = {
        dev: 'http://192.168.1.11:8080',
        test: 'http://192.168.1.11:8080',
        prod: ''
    };
    if (env === 'dev') {
        baseURL = urls.dev;
    }
    if (env === 'test') {
        baseURL = urls.test;
    }
    if (env === 'prod') {
        baseURL = urls.prod;
    }
    return baseURL;

})(env);

export {
    baseURL
};
