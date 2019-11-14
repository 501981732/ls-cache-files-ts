// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import ILSCacheFiles, { LSConfig, ListConfig } from './types'
import helper from './helper'
import 'core-js/fn/promise'

class LSCacheFiles {
  __LS__MAP: LSConfig
  needFullUpdate: boolean // 是否全部更新
  constructor() {
    this.__LS__MAP = (window as any).__LS__MAP || {}
    this.needFullUpdate = false
  }

  /**
   * 检查是否需要更新 根据 配置文件来决定是否全量更新
   * @return boolean
   */
  needUpdate(): boolean {
    if (this.needFullUpdate) {
      return true
    }
    if (this.__LS__MAP.version) {
      return JSON.parse(localStorage.getItem('__LS__version')!) !== this.__LS__MAP.version
    }
    return true
  }
  /**
   * 请求文件并缓存
   * @param {string} url
   * @param {number} version
   */
  loadFileAndCache(url: string, version: number): void {
    const prefixPath = helper.domUtils.PREFIX + url
    helper.domUtils
      .loadFile(url)
      .then(res => {
        helper.domUtils.insertFileText(url, res as string)
        localStorage.setItem(prefixPath, res as string)
        localStorage.setItem(prefixPath + '_version', JSON.stringify(version))
      })
      .catch(err => {
        console.log(err)
        // throw new Error(err)
      })
  }
  init(options: { configMap: LSConfig; needFullUpdate: boolean }) {
    const list: ListConfig[] = this.__LS__MAP.list
    this.__LS__MAP = options.configMap || (window as any).__LS__MAP || {}
    this.needFullUpdate = options.needFullUpdate || false
    if (list && helper.isArray(list)) {
      list.map((item: ListConfig) => {
        const prefixPath: string = helper.domUtils.PREFIX + item.url
        let LSValue: string | null = localStorage.getItem(prefixPath)
        // 检查localstorage是否可用 不可用 ajax加载
        if (!this.checkCanLocalStorage()) {
          console.error('sorry, you can not use this sdk!')
          helper.domUtils.insertFile(item.url)
        }
        // 不需要更新的话 直接本地读取
        if (!this.needUpdate()) {
          console.log('you are useing this LS_CACHE_FILES！')
          console.log('localstorage key:', prefixPath)
          if (LSValue) {
            helper.domUtils.insertFileText(item.url, LSValue)
          } else {
            // 请求文件 缓存本地
            this.loadFileAndCache(item.url, item.version)
          }
          return
        }
        // 判断是否存在存储文件
        // 判断当前版本
        this.checkFileAndCache(item.url, item.version)
      })
      localStorage.setItem('__LS__version', JSON.stringify(this.__LS__MAP.version))
    }
  }
  /**
   *
   * 1.判断本地是否有存储该文件
   * 2.判断版本是否相同
   * 之后决定请求文件还是直接使用缓存
   * @param {string} url
   * @param {number} version
   */
  checkFileAndCache(url: string, version: number): void {
    const prefixPath = helper.domUtils.PREFIX + url
    let LSValue = localStorage.getItem(prefixPath)
    if (!LSValue) {
      // 请求文件 缓存本地
      this.loadFileAndCache(url, version)
      return
    } else {
      // 不需要更新
      if (JSON.stringify(localStorage.getItem(prefixPath + '_version') === '' + version)) {
        helper.domUtils.insertFileText(url, LSValue)
        return
      } else {
        // 请求文件 更新缓存本地
        this.loadFileAndCache(url, version)
      }
    }
  }
  /**
   * 检查已经使用的localstorage容量
   * @return {number}
   */
  checkUsedSpace(): number {
    let localStorageLength = localStorage.length
    let localStorageSize = 0
    for (let i = 0; i < localStorageLength; i++) {
      let key = localStorage.key(i)
      if (key) {
        localStorageSize += localStorage.getItem(key)!.length
      }
    }
    return localStorageSize
  }
  /**
   * 检查localstorage是否可用
   * @return {boolean}
   */
  checkCanLocalStorage(): boolean {
    return helper.testCanLocalStorage()
  }
}

export default new LSCacheFiles()
