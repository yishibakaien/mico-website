import '../stylus/default_classify.styl';
import '../stylus/static/plugin/swiper-3.4.2.min.css';

import Swiper from 'swiper';
import {
    addActive
} from './utils/utils';

(function() {
    var swiper = new Swiper('.swiper-container', { 
        onSlideChangeEnd: swiperControl
        // initialSlide: activeIndex ? activeIndex : 0
    });
    console.log(swiper);
    var tabItem = document.getElementsByClassName('tab-item');
    
    // 添加active 类 高亮显示
    addActive(tabItem);
    slideControl();

    function slideControl() {
        var i,
            len = tabItem.length;
        for (i = 0; i < len; i++) {
            (function(i) {
                tabItem[i].addEventListener('click', function() {
                    console.log(i);
                    swiper.slideTo(i, 300, false);
                }, false);
            })(i);
        }
    }
    function swiperControl(swiper) {
        var i,
            len = tabItem.length;
        for (i = 0; i < len; i++) {
            tabItem[i].className = tabItem[i].className.split('active').join(' ');
        }
        tabItem[swiper.activeIndex].className += ' active';
    }
})();
