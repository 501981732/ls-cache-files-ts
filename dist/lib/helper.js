"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function testCanLocalStorage() {
    var mod = 'modernizr';
    var localStorage = window.localStorage;
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    }
    catch (e) {
        return false;
    }
}
function isType(type) {
    return function (obj) {
        return Object.prototype.toString.call(obj) === "[object " + type + "]";
    };
}
var isArray = isType('Array');
function analysisFile(path) {
    if (path) {
        var toArr = path.split('/');
        var fileName = toArr[toArr.length - 1];
        var fileNameToArr = fileName.split('.');
        var len = fileNameToArr.length;
        if (fileName && fileNameToArr) {
            return {
                name: fileName,
                hash: fileNameToArr[len - 2],
                type: fileNameToArr[len - 1]
            };
        }
    }
    // if (path) {
    //     let toArr = path.split('.')
    //     return toArr[toArr.length - 1]
    // }
    return {};
}
var domUtils = {
    PREFIX: '__LS__',
    /**
     * 动态插入文件 自动判断js css
     * @Author   wangmeng
     * @DateTime 2019-08-16
     * @param    {string}   path 路径
     */
    insertFile: function (path) {
        var head = document.getElementsByTagName('HEAD')[0];
        var link;
        var type = analysisFile(path) && analysisFile(path).type;
        if (type === 'js') {
            link = document.createElement('script');
            link.type = 'text/javascript';
            link.charset = 'utf-8';
            link.id = this.PREFIX + analysisFile(path).name;
            link.src = path;
        }
        else {
            link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.id = this.PREFIX + analysisFile(path).name;
            link.href = path;
        }
        head.appendChild(link);
    },
    /**
     * 将请求的js css内容插入到模板上
     * @Author   wangmeng
     * @DateTime 2019-08-16
     * @param    {string}   url
     * @param    {string}   text
     */
    insertFileText: function (url, text) {
        var head = document.getElementsByTagName('HEAD')[0];
        var link;
        var type = analysisFile(url) && analysisFile(url).type;
        if (type === 'js') {
            link = document.createElement('script');
            link.type = 'text/javascript';
            link.id = this.PREFIX + analysisFile(url).name;
            link.innerHTML = text;
            // or
            // eval(text)
        }
        else {
            link = document.createElement('style');
            link.type = 'text/css';
            link.id = this.PREFIX + analysisFile(url).name;
            link.innerHTML = text;
        }
        head.appendChild(link);
    },
    /**
     * 下载文件
     * @param {string} url
     * @return {promise} promise
     */
    loadFile: function (url) {
        return new Promise(function (reslove, reject) {
            var xhr;
            if (window.ActiveXObject) {
                // eslint-disable-next-line no-undef
                xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
            }
            else {
                xhr = new XMLHttpRequest();
            }
            if (xhr) {
                // todo
                // c.58cdn.com.cn不支持跨域-> img.58.com.cn
                xhr.open('GET', url);
                xhr.send();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            var text = xhr.responseText;
                            reslove(text);
                        }
                        else {
                            reject(xhr);
                        }
                    }
                };
            }
        });
    }
};
exports.default = {
    isType: isType,
    isArray: isArray,
    testCanLocalStorage: testCanLocalStorage,
    domUtils: domUtils
};
//# sourceMappingURL=helper.js.map