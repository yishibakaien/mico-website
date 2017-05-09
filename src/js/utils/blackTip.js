// create by cloud_cb on 2017/04/14.

'use strict';

var TIP_ID = '_blackTip_';
var STATE_HIDE = 0;
var STATE_SHOW = 1;

var id = 0;

function _getId() {
    return ++id;
}

function BlackTip(config) {
    this.defaults = {
        text: '',
        type: 'default',
        time: 1500,
        mask: false,
        zIndex: 999,
        complete: null
    };
    this.timer = null;
    this._init(config);
}

BlackTip.prototype._init = function(config) {
    this.eleId = _getId();
    
    if (typeof config !== 'object') {
        return;
    }

    for (var key in config) {
        if (!config.hasOwnProperty(key)) {
            continue;
        }
        this.defaults[key] = config[key];
    }

    if (!document.getElementById(TIP_ID + 'style')) {
        this._insertStyle();
    }

    this._createDom();

    this.timer = setTimeout(function() {
        this.hide();
        if (typeof this.defaults.complete === 'function') {
            this.defaults.complete();
        }
    }.bind(this), this.defaults.time);
};

BlackTip.prototype.set = function() {
    switch (this.defaults.type) {
        case 'default':
            this.icon.style.display = 'none';
            break;
        case 'info':
            this.icon.innerText = '!';
            this.icon.className += ' info';
            break;
        case 'success':
            // this.icon.innerText = '√';
            this.icon.className += ' success';
            break;
        case 'loading':
            this.icon.className += ' loading';
            break;
        default:
            this.icon.style.display = 'none';
            break;
    }
    if (!!this.defaults.text) {
        this.text.innerText = this.defaults.text;
    } else {
        this.text.display = 'none';
    }
    this.show();
};

BlackTip.prototype.show = function() {
    this.state = STATE_SHOW;
    document.body.appendChild(this.blackTip);
};

BlackTip.prototype.hide = function() {
    this.blackTip.style.display = 'none';
    this.state = STATE_HIDE;
};

BlackTip.prototype.remove = function() {
    document.body.removeChild(this.blackTip);

    // console.log(window[TIP_ID + this.eleId]);
    try {
        delete window[TIP_ID + this.eleId];
    } catch (e) {
        
    }
    // console.info(window[TIP_ID + this.eleId]);
    this.timer = null;
    clearTimeout(this.timer);
};

BlackTip.prototype._createDom = function() {
    this.blackTip = window[TIP_ID + this.eleId] = document.createElement('div', TIP_ID + this.eleId);
    this.state = STATE_SHOW;

    this.blackTip.className = TIP_ID;

    this.icon = document.createElement('div');
    this.icon.className = 'icon';

    this.text = document.createElement('p');
    this.text.className = 'text';

    this.blackTip.appendChild(this.icon);
    this.blackTip.appendChild(this.text);

    this.set();
};

BlackTip.prototype._insertStyle = function() {
    this.style = document.createElement('style');
    this.style.id = TIP_ID + 'style';
    this.style.innerText = '._blackTip_{margin:0;padding:0;line-height:1.6;position:fixed;z-index:5000;width:7.6em;min-height:7.6em;top:180px;left:50%;margin-left:-3.8em;background:rgba(17,17,17,0.7);text-align:center;border-radius:5px;color:#fff;word-break:break-all}._blackTip_ .icon.info{display:inline-block;height:40px;line-height:40px;width:40px;margin-bottom:6px;margin-top:28px;font-size:30px;border-radius:50%;color:rgba(7,17,27,0.8);background-color:#fff}._blackTip_ .icon.loading{display:inline-block;margin-top:30px;width:38px;height:38px;-webkit-animation:blackTipLoading 1s steps(12,end) infinite;animation:blackTipLoading 1s steps(12,end) infinite;background:transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;background-size:100%}._blackTip_ .icon.success{display:inline-block;margin:22px 0 -5px 0;width:52px;height:52px;background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABHCAYAAAATBvm1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTUzMURFQjkyNTBCMTFFN0E4QTlDRUU3NTJCQjlGRjgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTUzMURFQkEyNTBCMTFFN0E4QTlDRUU3NTJCQjlGRjgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NTMxREVCNzI1MEIxMUU3QThBOUNFRTc1MkJCOUZGOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NTMxREVCODI1MEIxMUU3QThBOUNFRTc1MkJCOUZGOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ppu9szsAAANDSURBVHja7Jw/aBRBFMb39PxvY5qAFh6cCWIEC0ECgmClEoiVSkptLGJjZZNKGysLQeyCIKSIhZBGxGAnZ2GjIBgQEYyiTVJEFFFY34dPPE5j7nbf7Xu7+T742CIkmZnf7Hwzc3OTJFShStN0k3hO3BJvZYv4gdglfpP+0QKB+IA4IP6a/i0CKRACfCb9vwikABA18fW0Oy3U2WT9C2p5zIlPdvkrK2y1YoJ6LT1TeFRBQU0QwYK6Uy2C8A3q33os3sjWs19RPyCI8gU1QQQJ6lTfIIJwDmrovngDW9A3qAkiSFATRJCghmYIwj+ooWkMa2xB36AmiCBBTRBBghq6RRD+QQ3dwNBG+QY1QQQJaoIIEtTQNYLwD2poiiD8g5ogggQ1QQQJaugyQfgHNTRJEP5B7QcCHwuKB6vQCwyC2hUEXud5LcSVMu+zGAQ1dN6tU2ovaBfAbFuHQQ1NeIIYWqVQy/jZOgpqdxCbxZ/WKOCFyDliFNTuIOB7XRZ0NuLZUKOghk67djj552d7LPCieHfFgho6FaEy3zIWftyzFxkGdQwQWqnxHJW47XFc0TCo44Bo62ETOSrzUjxQwqCGjkWdm1/MUanv4qP9HrYMgxoajb5YmsxZwav9WrUbBnVsEB1ApnJW9Il4R9CgLgcIYyAr4oPBgho6VMZNtkRPPeTVpazDlnFQQyNl3n6Gbxo0Am6Q2eIY1OUG0TFMTBs0Bva99joEdTVAdACZMWqYc6tNf/sQ1JhuN5OqCV/40G/gWOiOuN7noAaIRlJVKZB5o8ZCHjT0bw6IHxJEktR6BIJ9qEfi40Hr80M8VKvV3lYehgLBEPNUfDhYXb4oiA9lHX0yrwHk0QoEBCCaAuJjmaMg8z6Srh1eiIcJwhmGAsG9es8dgVQGRG4YCmSnPF6J9xRc9iXNiKWqzFhNtrsVyGvxYIEg9gmI5SotH8w+e8B+kgIZIAhnGAoEIN6JtxNE7zK910LH76YGq7XeixtVBWH+ZrS9IQhzrILrhiD2C4jPCZUJSEP3ifJqUScIVE4gwwQRC8hIRhC8rL1PQI4QRCwgowQRC8gJgogFZIwXtMeB8a+D1gThDGRMTx7eJYhf+inAAOxjhN3z7Ta5AAAAAElFTkSuQmCC) no-repeat;background-size:100%;background-position:center}._blackTip_ .text{margin:0;padding:0 12px}@keyframes blackTipLoading{0%{transform:rotate3d(0,0,1,0deg)}100%{transform:rotate3d(0,0,1,360deg)}}@-webkit-keyframes blackTipLoading{0%{-webkit-transform:rotate3d(0,0,1,0deg)}100%{-webkit-transform:rotate3d(0,0,1,360deg)}}'
    document.head.appendChild(this.style);
};

module.exports = function(obj) {
    return new BlackTip(obj);
}
