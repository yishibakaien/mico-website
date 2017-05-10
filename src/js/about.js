require('../stylus/common/common');
require('../stylus/static/reset/reset');
require('../stylus/about');
var span = document.createElement('span');
span.innerHTML = '这个是js插入的文字about页面';
document.body.appendChild(span);