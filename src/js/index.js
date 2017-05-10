import '../stylus/common/common';
import '../stylus/reset/reset';
import '../stylus/index/index';

// import blackTip from '../js/utils/blackTip.js';

const p = document.createElement('p');
const a = [1,2,3,3];
const b = new Set(a); 
var c = [...b];
console.log(c);
p.innerHTML = '这个是首页';
document.body.appendChild(p);
setTimeout(() => {console.log(p);}, 500);