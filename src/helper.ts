function testCanLocalStorage(): boolean {
  const mod: string = 'modernizr'
  const localStorage: Storage = window.localStorage
  try {
    localStorage.setItem(mod, mod)
    localStorage.removeItem(mod)
    return true
  } catch (e) {
    return false
  }
}

function isType(type: string): any {
  return function(obj: any): boolean {
    let t: string = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    return Object.prototype.toString.call(obj) === `[object ${t}]`
  }
}
/**
 * useage
 *  const flag = isType('Array')([])
 */
const isArray = isType('Array')

function analysisFile(path: string): { [name: string]: string } {
  if (path) {
    let toArr = path.split('/')
    let fileName = toArr[toArr.length - 1]
    let fileNameToArr = fileName.split('.')
    let len = fileNameToArr.length
    if (fileName && fileNameToArr) {
      return {
        name: fileName,
        hash: fileNameToArr[len - 2],
        type: fileNameToArr[len - 1]
      }
    }
  }
  // if (path) {
  //     let toArr = path.split('.')
  //     return toArr[toArr.length - 1]
  // }
  return {}
}
const domUtils = {
  PREFIX: '__LS__',
  /**
   * 动态插入文件 自动判断js css
   * @Author   wangmeng
   * @DateTime 2019-08-16
   * @param    {string}   path 路径
   */
  insertFile: function(path: string): void {
    let head: Element = document.getElementsByTagName('HEAD')[0]
    let link: HTMLScriptElement | HTMLLinkElement
    let type = analysisFile(path) && analysisFile(path).type
    if (type === 'js') {
      link = document.createElement('script')
      link.type = 'text/javascript'
      link.charset = 'utf-8'
      link.id = this.PREFIX + analysisFile(path).name
      link.src = path
    } else {
      link = document.createElement('link')
      link.type = 'text/css'
      link.rel = 'stylesheet'
      link.id = this.PREFIX + analysisFile(path).name
      link.href = path
    }
    head.appendChild(link)
  },
  /**
   * 将请求的js css内容插入到模板上
   * @Author   wangmeng
   * @DateTime 2019-08-16
   * @param    {string}   url
   * @param    {string}   text
   */
  insertFileText: function(url: string, text: string): void {
    let head: Element = document.getElementsByTagName('HEAD')[0]
    let link: HTMLScriptElement | HTMLStyleElement
    let type: string = analysisFile(url) && analysisFile(url).type
    if (type === 'js') {
      link = document.createElement('script')
      link.type = 'text/javascript'
      link.id = this.PREFIX + analysisFile(url).name
      link.innerHTML = text
      // or
      // eval(text)
    } else {
      link = document.createElement('style')
      link.type = 'text/css'
      link.id = this.PREFIX + analysisFile(url).name
      link.innerHTML = text
    }
    head.appendChild(link)
  },

  /**
   * 下载文件
   * @param {string} url
   * @return {promise} promise
   */
  loadFile: function(url: string) {
    return new Promise((reslove, reject) => {
      let xhr: XMLHttpRequest
      if ((window as any).ActiveXObject) {
        // eslint-disable-next-line no-undef
        xhr = new (window as any).ActiveXObject('Microsoft.XMLHTTP')
      } else {
        xhr = new XMLHttpRequest()
      }
      if (xhr) {
        // todo
        // c.58cdn.com.cn不支持跨域-> img.58.com.cn
        xhr.open('GET', url)
        xhr.send()
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
              let text = xhr.responseText
              reslove(text)
            } else {
              reject(xhr)
            }
          }
        }
      }
    })
  }
}

export default {
  isType,
  isArray,
  testCanLocalStorage,
  domUtils
}
