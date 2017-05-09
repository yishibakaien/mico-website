require("../stylus/common/common");
require("../stylus/reset/reset");
require("../stylus/dress/dress");
var span = document.createElement('span');
span.innerHTML = '这个是js插入的文字about页面';
document.body.appendChild(span);