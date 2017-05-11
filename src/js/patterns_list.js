'use strict';
import '../stylus/common/common';
import '../stylus/static/reset/reset';
import '../stylus/patterns_list.styl';

String.prototype.repeat = String.prototype.repeat || function(num) {
    var str = '',
        i;
    if (typeof num !== 'number') {
        throw new Error('argument must be an number');
    }
    for (i = 0; i < num; i++) {
        str += this;
    }
    return str;
};
console.log('hello'.repeat(3));
(function() {
    var patterns = document.getElementsByClassName('patterns'),
        i,
        len = patterns.length;
    for (i = 0; i < len; i++) {
        (function(i) {
            patterns[i].addEventListener('click', function() {
                location.href = './patterns_detail.html';
            }, false);
        })(i);
    }
})();