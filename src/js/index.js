import '../stylus/common/common';
import '../stylus/reset/reset';
import '../stylus/dress/dress';

import blackTip from '../js/utils/blackTip.js';

var bt = blackTip({
    type: 'loading',
    text: '正在加载中',
    time: 2100,
    complete: function() {
        var bt2 = blackTip({
            text: '加载完成',
            type: 'success'
        });
    }
});

const p = document.createElement('p');
const a = [1,2,3,3]
const b = new Set(a);
var c = [...b];
console.log(c);
p.innerHTML = '这个是首页';
document.body.appendChild(p);
setTimeout(() => {console.log(p);}, 500);