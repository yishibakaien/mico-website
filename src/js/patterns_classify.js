'use strict';
import '../stylus/common/common';
import '../font/iconfont.styl';
import '../stylus/static/reset/reset';

(function() {
    var list = document.getElementsByClassName('list'),
        i;
    for (i = 0; i < list.length; i++) {
        (function(i) {
            list[i].onclick = function() {
                location.href = './patterns_list.html';
            };
        })(i);
    }
})();