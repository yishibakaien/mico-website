'use strict';
import '../stylus/common/common';
import '../stylus/static/reset/reset';
import '../stylus/dress';
import { baseURL } from '../../config/config';
import { bind, getQueryString, c } from './utils/utils';
import blackTip from './utils/blackTip';
console.log(baseURL);

(function() { 
    var modles = document.querySelectorAll('.modles-prototype img'),
        modle = c('.modle-container')[0],
        modlePic = modle.getElementsByTagName('img')[0],
        back = c('#back'),
        iptUpload = c('#iptUpload'),
        wrapper = c('.modle-img-wrapper')[0],
        btnSwitch = c('#switch'),
        leftSideModles = c('.modles-leftside-container')[0],
        leftSideModlesImg = leftSideModles.getElementsByTagName('img'),
        range = c('#range'),
        mask = c('.mask')[0];

    //console.log(getQueryString("url"));
    if (getQueryString('url')) {
        modle.style.display = 'block';
        modlePic.onload = function() {
            wrapper.style.background = 'url(' + encodeURI(getQueryString('url')) + ')';
            modlePic.onload = null;
        };
    }
    for (var i = 0; i < modles.length; i++) {
        (function(i) {
            bind(modles[i], 'click', function() {
                var b = blackTip({
                    text: '正在加载中',
                    time: 10000
                });
                modlePic.onload = function() {
                    b.remove();
                    modle.style.display = 'block';
                    modlePic.onload = null;
                };
                modlePic.src = this.src.split('modles_prototype').join('modles').replace('.jpg', '.png');
            });
            bind(leftSideModlesImg[i], 'click', function() {
                var b = blackTip({
                    text: '正在加载中',
                    time: 10000
                });
                modlePic.onload = function() {
                    b.remove();
                    // modle.style.display = 'block';
                    mask.style.display = 'none';
                    leftSideModles.className = 'modles-leftside-container hide-slide';
                    modlePic.onload = null;
                };
                modlePic.src = this.src.split('modles_prototype').join('modles').replace('.jpg', '.png');
            });
        })(i);
    }
    bind(back, 'click', function() {
        modle.style.display = 'none';
    });

    bind(iptUpload, 'change', function() {
        previewImage(this);
    });

    bind(range, 'input', function() {
        wrapper.style.backgroundSize = this.value + '%';
        // console.log('缩放比例', this.value);
    });

    bind(btnSwitch, 'click', function() {

        leftSideModles.className = 'modles-leftside-container show-slide';

        mask.style.display = 'block';
    });

    bind(mask, 'click', function() {
        this.style.display = 'none';
        leftSideModles.className = 'modles-leftside-container hide-slide';
    });

    function previewImage(file) {
        // console.log('file', file.files);
        if (file.files && file.files[0]) {
            var reader = new FileReader();
            bind(reader, 'load', function(evt) {
                wrapper.style.background = 'url(' + evt.target.result + ')';
            });
            reader.readAsDataURL(file.files[0]);
        }
    }
})();
