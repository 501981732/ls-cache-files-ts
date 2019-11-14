declare const LSCacheFiles: ILSCacheFiles

export interface ListConfig {
  version: number
  url: string
  type?: string
}
export interface LSConfig {
  version: number
  list: ListConfig[]
}
// 类的公共属性 方法
interface ILSCacheFiles {
  __LS__MAP: LSConfig
  init: () => void
  loadAndCacheFile: (url: string, version: string | number) => void
  checkAndCacheFile: (url: string, version: string | number) => void
  checkCanLocalStorage: boolean
  needUpdate: (flag?: boolean) => void
  checkUsedSpace: () => number | string
}
// // 混合接口
// export interface ILSCacheFilesInstance extends ILSCacheFiles {
//   (config:any): any
// }
export default LSCacheFiles
