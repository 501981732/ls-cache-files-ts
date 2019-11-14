import { LSConfig } from './types';
import 'core-js/fn/promise';
declare class LSCacheFiles {
    __LS__MAP: LSConfig;
    constructor();
    /**
     * 检查是否需要更新 根据 配置文件来决定是否全量更新
     * @param {boolean | null} flag
     * @return booleanå
     */
    needUpdate(flag?: boolean): boolean;
    /**
     * 请求文件并缓存
     * @param {string} url
     * @param {number} version
     */
    loadFileAndCache(url: string, version: number): void;
    init(): void;
    /**
     *
     * 1.判断本地是否有存储该文件
     * 2.判断版本是否相同
     * 之后决定请求文件还是直接使用缓存
     * @param {string} url
     * @param {number} version
     */
    checkFileAndCache(url: any, version: number): void;
    /**
     * 检查已经使用的localstorage容量
     * @return {number}
     */
    checkUsedSpace(): number;
    /**
     * 检查localstorage是否可用
     * @return {boolean}
     */
    checkCanLocalStorage(): boolean;
}
declare const _default: LSCacheFiles;
export default _default;
