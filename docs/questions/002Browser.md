# 浏览器

## 从URL到浏览器结束

1. 输入URL，浏览器解析URL生成DNS，对服务器请求
2. 服务器接收到请求，生成对应html、css、js内容
3. 浏览器接收到服务器返回的数据进行跳转，生成DOM结构，当遇到script脚本时会停止DOM生成，执行JS脚本
4. 建立事件队列，判断当前事件头是否有事件存在，若存在事件，执行事件处理函数，然后执行下一个事件，处理完再次判断事件头，循环往复。（先执行宏任务，执行完一个宏任务后执行所有微任务，执行完所有微任务后执行渲染线程，然后再次判断有无宏任务。不同事件处理在不同浏览器可能有不同优先级）
5. 关闭

## 网页生命周期

[网页六大生命周期](http://www.ruanyifeng.com/blog/2018/11/page_lifecycle_api.html)

## 跨域问题

### 什么是跨域

协议、域名、端口，三者有一个不相同就是跨域

### 跨域是如何产生的

客户端发送请求,服务器处理请求，响应客户端，此时客户端会判断服务器是否与客户端的页面同源，如果不同源则阻止其响应

### 如何解决跨域问题

目前业内主流的是:

1. CORS 在服务端设置响应头
2. JSONP
3. Reverse Proxy 在 nginx/traefik/haproxy 等反向代理服务器中设置为同一域名
4. 使用客户端/wx提供的接口访问服务器，可以绕过跨域问题

### JSONP原理

JSONP 基于两个原理:

动态创建 script，使用 script.src 加载请求跨过跨域
script.src 加载的脚本内容为 JSONP: 即 PADDING(JSON) 格式

从上可知，使用 JSONP 跨域同样需要服务端的支持。

在请求时，服务端生成一段脚本代码，返回给客户端，客户端以脚本的形式加载它，实际上会执行这段脚本，这段脚本往往是调用客户端注册的一个全局函数，然后把本来放到响应头的数据给到这个全局函数

```js
const http = require('http')
const url = require('url')
const qs = require('querystring')

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url)
  const params = qs.parse(query)

  const data = { msg: 'hello-world', id: params.id }

  if (params.callback) {
    str = `${params.callback}(${JSON.stringify(data)})`
    res.end(str)
  } else {
    res.end()
  }

})

server.listen(10010, () => console.log('Done'))
```

[实现JSONP](http://localhost:8080/studyLib/coding/003coding.html#jsonp)

## 你都知道哪些Observer，能用来干嘛

### IntersectionObserver

IntersectionObserver 可以监听一个元素和可视区域相交部分的比例，然后在可视比例达到某个阈值的时候触发回调。

可以用来做图片懒加载

### MutationObserver

接口提供了监视对 DOM 树所做更改的能力

1. Swiper中开启mutationObserver，添加Slide可以自动更新  
2. 文本编辑器，可以用来做自动保存  
3. monitor的用户行为轨迹功能的实现也是基于MutationObserver去记录用户客户端上DOM的改变，然后上传到服务器上

### PerformanceObserver

PerformanceObserver 用于监听记录 performance 数据的行为，一旦记录了就会触发回调，这样我们就可以在回调里把这些数据上报。

监听 mark（时间点）、measure（时间段）、resource（资源加载耗时） 这三种记录时间的行为。

可以用来判断是否存在长任务，获取渲染性能

### ResizeObserver

用来监听元素大小改变

可以用来监听元素大小变化，重新设置布局等

### ReportingObserver

ReportingObserver 可以监听过时的 api、浏览器干预等报告等的打印，在回调里上报，这些是错误监听无法监听到但对了解网页运行情况很有用的数据。

## Cookie

+ Domain
+ Path
+ Expire/MaxAge: 如果没有 maxAge，则 cookie 的有效时间为会话时间。
+ HttpOnly:是否允许被JS操作
+ Secure: 只能在HTTPS连接中配置
+ SameSite:

### Cookie的增删改查

#### 设置Cookie  

```js
document.cookie  
```

#### 删除Cookie

1. max-age 设置为-1（推荐）

    ```js
    document.cookie = 'a=3; max-age=-1'
    ```

2. expires 设为将要过期的时间  
3. cookieStore.delete(name)  

### SameSite

|SameSite值|效果|
|--|--|
|None|任何情况下都会向第三方网站请求发送 Cookie|
|Lax|只有导航到第三方网站的 Get 链接会发送 Cookie，跨域的图片、iframe、form表单都不会发送 Cookie|
|Strict|任何情况下都不会向第三方网站请求发送Cookie|

目前，主流浏览器 Same-Site 的默认值为 Lax，而在以前是 None，将会预防大部分 CSRF 攻击，如果需要手动指定 Same-Site 为 None，需要指定 Cookie 属性 Secure，即在 https 下发送

#### CSRF

跨站请求伪造。其原理是攻击者构造网站后台某个功能接口的请求地址，诱导用户去点击或者用特殊方法让该请求地址自动加载。用户在登录状态下这个请求被服务端接收后会被误以为是用户合法的操作。对于 GET 形式的接口地址可轻易被攻击，对于 POST 形式的接口地址也不是百分百安全，攻击者可诱导用户进入带 Form 表单可用POST方式提交参数的页面。

## Cache-Control

HTTP协议中关于缓存的响应头

|分类|效果|应用|
|--|--|--|
|no-cache|使用 ETag 响应头来告知客户端（浏览器、代理服务器）这个资源首先需要被检查是否在服务端修改过，在这之前不能被复用。这个意味着no-cache将会和服务器进行一次通讯，确保返回的资源没有修改过，如果没有修改过，才没有必要下载这个资源。反之，则需要重新下载。||
|no-store|资源不能缓存|隐私资源|
|public|响应资源表示允许被任何中间者缓存||
|private|不允许中间者缓存，仅允许浏览器缓存||
|max-age|告诉浏览器或者中间件多少时间内可复用|请求js，带hash，完全可以写个1年|
|s-maxage|s代表共享，只在中间件和CDN中用，会覆盖max-age和expires响应头||
|no-transform|中间代理有时会改变图片以及文件的格式，从而达到提高性能的效果。no-transform指令告诉中间代理不要改变资源的格式||

### 总结

1. 只有服务端才能开启缓存，默认是不会走缓存的
2. 走了强缓存就不会再向服务端发送请求了
3. 客户端的请求头中只有设置了cache-control为：'no-store' | 'no-cache' | 'max-age=0'才会生效（也就是客户端不想走强缓存的时候生效），除非后端对这个字段做特殊处理

## 事件机制

### [addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

addEventListener 第三个参数可以为false或者true，也可以是，false为冒泡，true为捕获。  
如果是对象，则如下

```ts
type Options = {
    capture: boolean
    once: boolean
    /**
     * 表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。可以用于改善滚屏性能
     * 
     */
    passive: boolean
    signal: AbortSignal
}
```

#### [事件监听内存问题](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#%E5%86%85%E5%AD%98%E9%97%AE%E9%A2%98)

真正影响内存的并不是没有保持函数引用，而是没有保持静态的函数引用

#### [option支持的安全检测](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#option_%E6%94%AF%E6%8C%81%E7%9A%84%E5%AE%89%E5%85%A8%E6%A3%80%E6%B5%8B)

### 事件冒泡、事件捕获

点击一个元素，首先触发事件捕获，从window到具体元素，然后发生事件冒泡，从具体元素到window

### 事件委托

事件委托指当有大量子元素触发事件时，将事件监听器绑定在父元素进行监听，此时数百个事件监听器变为了一个监听器，提升了网页性能。React 把所有事件委托在 Root Element，用以提升性能。但是vue没有这么做，vue官方也给出了解释，除非你有几百上千个节点，否则你不需要，因为每个都有自己的回调巴拉巴拉。

### e.target和e.currentTarget

Event 接口的只读属性 currentTarget 表示的，标识是当事件沿着 DOM 触发时事件的当前目标。它总是指向事件绑定的元素，而 Event.target 则是事件触发的元素。而且事件在处理完后置为空

::: warning
event.currentTarget 的值只能在事件处理过程中被使用。如果你尝试用 console.log() 在控制台打印 event 对象，你会发现 currentTarget 的值是 null。如果你想在控制台打印 currentTarget 的值，你应该使用 console.log(event.currentTarget)，或者也可以在代码中使用 debugger 语句来暂停代码的执行从而看到 event.currentTarget 的值。
:::

### e.preventDefault

+ e.preventDefault(): 取消事件  
+ e.cancelable: 事件是否可取消  

如果 addEventListener 第三个参数 { passive: true}，preventDefault 将会会无效

### input 事件

可以实时监听值的变化的事件有以下几种

+ keypress
+ keydown
+ keyup
+ input

## ClipBoard API

```js
// 是否能够有读取剪贴板的权限
// result.state == "granted" || result.state == "prompt"
const result = await navigator.permissions.query({ name: "clipboard-read" })
 
// 获取剪贴板内容
const text = await navigator.clipboard.readText()
```

禁用复制

```css
.css {
    user-select: none;
}
```

或使用 JS 如下，监听 selectstart 事件，禁止选中。

## 请求

### fetch 中 credentials

credentials 指在使用 fetch 发送请求时是否应当发送 cookie

|分类|效果|
|--|--|
|omit: |从不发送 cookie.|
|same-origin: |同源时发送 cookie (浏览器默认值)|
|include: |同源与跨域时都发送 cookie|

### 放弃请求

+ XHR 使用 xhr.abort()
+ fetch 使用 AbortController

## requestIdleCallback

为什么使用 MessageChanel 是因为其可以做到延迟0ms，尽管现在部分浏览器也支持setTimeout0ms了，但是要考虑大部分浏览器，还是使用MessageChanel

```js

```

## requestAnimationFrame

## DOM转图片

DOM -> SVG -> Canvas -> JPEG/PNG

库 html2Canvas

## 异步加载js

在正常情况下，即 `<script>` 没有任何额外属性标记的情况下，有几点共识

1. JS 的脚本分为加载、解析、执行几个步骤，简单对应到图中就是 fetch (加载) 和 execution (解析并执行)  
2. JS 的脚本加载(fetch)且执行(execution)会阻塞 DOM 的渲染，因此 JS 一般放到最后头
而 defer 与 async 的区别如下:  

    相同点: 异步加载 (fetch)  
    不同点:  
    async 加载(fetch)完成后立即执行 (execution)，因此可能会阻塞 DOM 解析；  
    defer 加载(fetch)完成后延迟到 DOM 解析完成后才会执行(execution)**，但会在事件 DomContentLoaded 之前  

## router 实现

前端路由有两种实现方式:

### history API

1. 通过 history.pushState() 跳转路由
2. 通过 popstate event 监听路由变化，但无法监听到 history.pushState() 时的路由变化

### hash

1. 通过 location.hash 跳转路由
2. 通过 hashchange event 监听路由变化

## 浏览器中读取二进制信息

+ File/Blob API
+ TypedArray/ArrayBuffer API
+ FileReader API

## 从输入URL到页面加载过程 （作业帮）

首先将url解析变成dns，通过dns找到对应的域名，通过域名获取ip。第二步，就是建立TCP协议，服务器把html、css、js等资源返回给客户端。第三步，客户端拿到html资源后开始着手构建DOM树，CSSOM树，一般js使用defer或者放在body底部最后被加载，js加载过程则是采用了解释器+编译器的模式，先通过词法解析和语法解析将js变成ast tokens,然后进一步转化为字节码，再通过页面对这些js使用的程度，将常用的js作为机器码编译存起来，不常用的丢掉。第四步，将同步任务置入执行栈中调用，将异步任务放到事件队列中，等候调用。第五步，有头，调用事件队列头，每次执行完宏任务，就将微任务队列清空。依次循环。对于不同事件鼠标键盘，不同浏览器也有不同的优先级设计。最后用户关闭。

## 怎么做点谈窗外关闭弹窗的功能 (百度)
