"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("./helper");
require("core-js/fn/promise");
var LSCacheFiles = /** @class */ (function () {
    function LSCacheFiles() {
        this.__LS__MAP = window.__LS__MAP || {};
    }
    /**
     * 检查是否需要更新 根据 配置文件来决定是否全量更新
     * @param {boolean | null} flag
     * @return booleanå
     */
    LSCacheFiles.prototype.needUpdate = function (flag) {
        if (flag !== undefined) {
            return flag;
        }
        if (this.__LS__MAP.version) {
            return JSON.parse(localStorage.getItem('__LS__version')) !== this.__LS__MAP.version;
        }
        return true;
    };
    /**
     * 请求文件并缓存
     * @param {string} url
     * @param {number} version
     */
    LSCacheFiles.prototype.loadFileAndCache = function (url, version) {
        var prefixPath = helper_1.default.domUtils.PREFIX + url;
        helper_1.default.domUtils
            .loadFile(url)
            .then(function (res) {
            helper_1.default.domUtils.insertFileText(url, res);
            localStorage.setItem(prefixPath, res);
            localStorage.setItem(prefixPath + '_version', JSON.stringify(version));
        })
            .catch(function (err) {
            console.log(err);
            // throw new Error(err)
        });
    };
    LSCacheFiles.prototype.init = function () {
        var _this = this;
        var list = this.__LS__MAP.list;
        if (list && helper_1.default.isArray(list)) {
            list.map(function (item) {
                var prefixPath = helper_1.default.domUtils.PREFIX + item.url;
                var LSValue = localStorage.getItem(prefixPath);
                // 检查localstorage是否可用 不可用 ajax加载
                if (!helper_1.default.testCanLocalStorage) {
                    console.error('sorry, you can not use this sdk!');
                    helper_1.default.domUtils.insertFile(item.url);
                }
                // 不需要更新的话 直接本地读取
                if (!_this.needUpdate()) {
                    console.log('you are useing this LS_CACHE_FILES！');
                    console.log('localstorage key:', prefixPath);
                    if (LSValue) {
                        helper_1.default.domUtils.insertFileText(item.url, LSValue);
                    }
                    else {
                        // 请求文件 缓存本地
                        _this.loadFileAndCache(item.url, item.version);
                    }
                    return;
                }
                // 判断是否存在存储文件
                // 判断当前版本
                _this.checkFileAndCache(item.url, item.version);
            });
            localStorage.setItem('__LS__version', JSON.stringify(this.__LS__MAP.version));
        }
    };
    /**
     *
     * 1.判断本地是否有存储该文件
     * 2.判断版本是否相同
     * 之后决定请求文件还是直接使用缓存
     * @param {string} url
     * @param {number} version
     */
    LSCacheFiles.prototype.checkFileAndCache = function (url, version) {
        var prefixPath = helper_1.default.domUtils.PREFIX + url;
        var LSValue = localStorage.getItem(prefixPath);
        if (!LSValue) {
            // 请求文件 缓存本地
            this.loadFileAndCache(url, version);
            return;
        }
        else {
            // 不需要更新
            if (JSON.stringify(localStorage.getItem(prefixPath + '_version') === '' + version)) {
                helper_1.default.domUtils.insertFileText(url, LSValue);
                return;
            }
            else {
                // 请求文件 更新缓存本地
                this.loadFileAndCache(url, version);
            }
        }
    };
    /**
     * 检查已经使用的localstorage容量
     * @return {number}
     */
    LSCacheFiles.prototype.checkUsedSpace = function () {
        var localStorageLength = localStorage.length;
        var localStorageSize = 0;
        for (var i = 0; i < localStorageLength; i++) {
            var key = localStorage.key(i);
            if (key) {
                localStorageSize += localStorage.getItem(key).length;
            }
        }
        return localStorageSize;
    };
    /**
     * 检查localstorage是否可用
     * @return {boolean}
     */
    LSCacheFiles.prototype.checkCanLocalStorage = function () {
        return helper_1.default.testCanLocalStorage();
    };
    return LSCacheFiles;
}());
exports.default = new LSCacheFiles();
//# sourceMappingURL=ls-cache-file.js.map