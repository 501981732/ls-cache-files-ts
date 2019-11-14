### LS CACHE

    利用浏览器缓存localStorage，缓存静态资源（目前支持css,js类型），第二次请求时，直接从本地文件中中读取资源，节约网络请求，优化性能。

1. 首次加载的情况下 会动态加载js 并将内容存到localStorage。
2. 非首次加载 会从localStorage中取出来插入到模板中。
3. 有完整的缓存更新机制，可局部更新，或全量更新已存储的文件。
4. 有良好的容错机制。
5. 每次RD同步传一份资源的配置文件(或者FE自己维护)，FE根据配置文件和缓存中的文件进行版本标识。从而决定是利用缓存还是重新请求。

### 流程
1. 根据配置文件进行初始化
2. 判断localstorage是否可用
3. 判断本地是否有存储目标文件 
4. 根据版本判断是否需要全量更新，若不需要更新，则遍历读取本地文件，若某一文件为空，则重新请求在存储
5. 判断遍历的目标文件版本是否相同 若不相同，则重新请求存储，否则使用缓存

![image](https://pic1.58cdn.com.cn/nowater/cxnomark/n_v2cd68acbc04474e2ca23309e69c019c12.png)

## useage

**模板中同步一份配置文件**

### v0.1.1配置文件

```
window.__LS__MAP = {
    'js/vue.js': 'https://j1.58cdn.com.cn/git/hrg-innovate/pc-super-employer-home/static/js/vue.chunk_v20190808162950.js'//资源地址
}
```

### v0.2.2配置文件

```
window.__LS__MAP = {
    version: 1,
    list: [{
        version: 1,
        url: 'http://c.58cdn.com.cn/git/hrg-innovate/m-super-employer/static/css/main.chunk_v20190830183911.css',//资源地址
        //type?: 'css'
    },{
        version: 1,
        url: 'http://j1.58cdn.com.cn/global_app/js/lib/zepto.min.js',//资源地址
        //type?: 'js'
    }]
}
```

### 初始化

1. 支持所有方式的加载
2. 提供 `umd`  `es5`  `es6`三种打包结果

```
npm install ls-cache-files
import LSCacheFiles from 'ls-cache-files'
LSCacheFiles.init()
```

```
<script src='https://raw.githubusercontent.com/501981732/ls-cache-files/master/lib/index.min.js'>引入
文件: https://github.com/501981732/ls-cache-files/blob/master/lib/index.min.js放入自己公司cdn或者嵌入模板html中
LSCacheFiles.init()
```

**运行成功的存储结果**

localSotrage中

key | value 
---|---
__LS__version | 1
__LS__https://c.58cdn.com.cn/git/hrg-innovate/m-super-employer/static/css/main.chunk_v20190830183911.css | 对应css
__LS__https://c.58cdn.com.cn/git/hrg-innovate/m-super-employer/static/css/main.chunk_v20190830183911.css_version | 1
__LS__http://j1.58cdn.com.cn/global_app/js/lib/zepto.min.js | 对应js
__LS__http://j1.58cdn.com.cn/global_app/js/lib/zepto.min.js_version | 1

html中

```
<style type="text/css" id="__LS__main.chunk_v20190830183911.css">...</style>
<script type="text/css" id="__LS__zepto.min.js">...</style>
```

### LSCacheFiles API
 
    需要先配置window.__LS__MAP文件，或者将__LS__MAP挂载到LSCacheFiles上面

### LSCacheFiles.__LS__MAP 

    可挂载配置文件,默认会读取全局配置文件 *window.__LS__MAP*

### LSCacheFiles.init(options:{configMap:LSConfig,needFullUpdate:boolean})

    根据__LS__MAP配置初始化缓存操作

1. configMap 配置文件，自动读取window.__LS__MAP 也可选择覆盖
2. needFullUpdate 是否全量更新缓存文件
### LSCacheFiles.checkAndCacheFile(url,version)

    请求url并缓存到本地，并且缓存当前版本
  
单独调用也会判断
1. 本地是否有存该文件
2. 版本与version是否相同
当本地没有存该文件，或者有存该文件但是version不同时会请求数据并缓存版本

```
LSCacheFiles.checkAndCacheFile('https://c.58cdn.com.cn/git/hrg-innovate/m-super-employer/static/css/main.chunk_v20190830183911.css',1)

```

存储表现为

key | value 
---|---
__LS__https://c.58cdn.com.cn/git/hrg-innovate/m-super-employer/static/css/main.chunk_v20190830183911.css | 对应css
__LS__https://c.58cdn.com.cn/git/hrg-innovate/m-super-employer/static/css/main.chunk_v20190830183911.css_version | 1

### LSCacheFiles.loadAndCacheFile(url,version)

类似checkFileAndCache功能，但是检查本地是否有改文件和版本。每次都会重新请求并缓存文件。so...没啥用

### LSCacheFiles.needFullUpdate

LSCacheFiles.needFullUpdate 自动根据配置文件__LS__MAP的version字段和localstorage字段判断是否需要全部更新缓存文件,
也可传入needFullUpdate 手动配置是否需要触发全量更新

### LSCacheFiles.checkCanLocalStorage()

判断本地存储是否可用，可以根据此字段判断是否手动开启缓存

### LSCacheFiles.checkUsedSpace()

本地localstorage剩余存储空间，可根据此字段决定是否开启缓存

### 注意

1. 不适合太大文件的存储，低版本浏览器单个localStoragekey存储能力有限
2. 支持typescript声明文件
