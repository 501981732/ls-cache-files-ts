declare function testCanLocalStorage(): boolean;
declare function isType(type: string): any;
declare const _default: {
    isType: typeof isType;
    isArray: any;
    testCanLocalStorage: typeof testCanLocalStorage;
    domUtils: {
        PREFIX: string;
        /**
         * 动态插入文件 自动判断js css
         * @Author   wangmeng
         * @DateTime 2019-08-16
         * @param    {string}   path 路径
         */
        insertFile: (path: string) => void;
        /**
         * 将请求的js css内容插入到模板上
         * @Author   wangmeng
         * @DateTime 2019-08-16
         * @param    {string}   url
         * @param    {string}   text
         */
        insertFileText: (url: string, text: string) => void;
        /**
         * 下载文件
         * @param {string} url
         * @return {promise} promise
         */
        loadFile: (url: string) => Promise<unknown>;
    };
};
export default _default;
