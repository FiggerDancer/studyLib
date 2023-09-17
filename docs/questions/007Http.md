# HTTP

## HTTP/2

1. HTTP/2采用二进制格式而非HTTP/1.1的文本格式，使传输文本方便健壮
2. HTTP/2通过多路复用让所有数据流使用同一个链接，在应用层和传输层之间增加了二进制分帧提高性能，实现低延迟和高吞吐
3. 采用HPACK等算法压缩，降低传输大小，降低开销

### 最关键的特性-二进制分帧

主要修改了报文的形式，在一个TCP中复用

## HTTP长链接和短连接（属于应用层）

短连接一般就是TCP握手后，就干一件事走了，就关闭了，一般是客户端发起。一般用于频率低，数据规模小的，http请求、数据采集等

长连接一般是TCP握手后，两者就一直连着互相访问数据，直到服务器发现客户端半天没跟他联系，他会发送探针，如果客户端没响应，那就多发几次，一直不响应那就挂掉这个长连接。一般用于通信数据规模较大，在线视频等

## TCP、UDP网络模型关系 （作业帮）

TCP是个可靠的连接协议，三次握手四次挥手，UDP则是一个面向无连接的协议，数据传输前，源端和终端不建立连接，发送端尽可能将数据扔到网络上，接收端从消息队列中读取消息段，是不稳定的。

## 为什么同一个域名同时只能开启6个TCP链接？如何突破这个限制？（作业帮）

浏览器的限制，为什么要限制呢，我猜测是因为TCP协议占用服务器资源，因为TCP连接是需要服务器做标记的，如何突破限制，使用代理，把资源分配到N/6个不同域名，在DNS服务商申请多个域名指向同一个IP地址。

1. 在DNS服务商中申请多个域名，指向同一个 IP 服务。
2. 对后台返回的数据进行域名处理，对图片链接，进行域名替换。
3. 域名替换完成后，通过 localStorage 进行 key / value 保存。以使得相同图片在下一次展示时，能使用浏览器缓存，而非重复加载。

另外，为了加快DNS解析，可以进行DNS预加载

```html
<!-- 配置 Mate 进行域名预加载 -->
<!-- dns预加载 -->
<link rel="dns-prefetch" href="//node1.baidu.com" />
<link rel="dns-prefetch" href="//node2.baidu.com" />
```

## 什么是HTTP协议

超文本传输协议（HTTP）是一个用于传输超媒体文档（例如 HTML）的应用层协议。它是为 Web 浏览器与 Web 服务器之间的通信而设计的，但也可以用于其他目的。HTTP 遵循经典的客户端—服务端模型，客户端打开一个连接以发出请求，然后等待直到收到服务器端响应。HTTP 是无状态协议，这意味着服务器不会在两个请求之间保留任何数据（状态）。

HTTP是一个基于TCP/IP通信协议来传递数据的应用级协议。主要特点是简单快速，灵活，无连接，无状态，支持B/S及C/S模式。

状态码：

1xx指示信息，2xx成功，3xx重定向，4xx客户端错误，5xx服务端错误。

## 简单讲解一下http2的多路复用(网易)

在HTTP1我们一个tcp链接一般使用短连接，只能做一个请求，请求完了就关闭了，所以请求资源时可能会反复的建立tcp链接，造成性能损失，多路复用，我一个tcp链接就可以通过二进制的报文请求到足够的资源了。让所有数据流使用同一个链接，在应用层和传输层之间增加了二进制分帧提高性能，实现低延迟和高吞吐

## React 中 setState 什么时候是同步的，什么时候是异步的？（微医）

setState

## 5种HTTP数据传输方式?

### 1. url param

```plain
http://guang.zxg/person/1111
```

### 2. query

```js
const queryString = require('query-string');

queryString.stringify({
  name: '光',
  age: 20
});

// ?name=%E5%85%89&age=20
```

### 3. form-urlencoded

直接用 form 表单提交数据就是这种，它和 query 字符串的方式的区别只是放在了 body 里，然后指定下 content-type 是 application/x-www-form-urlencoded

因为内容也是 query 字符串，所以也要用 encodeURIComponent 的 api 或者 query-string 库处理下。

这种格式也很容易理解，get 是把数据拼成 query 字符串放在 url 后面，于是表单的 post 提交方式的时候就直接用相同的方式把数据放在了 body 里。

通过 & 分隔的 form-urlencoded 的方式需要对内容做 url encode，如果传递大量的数据，比如上传文件的时候就不是很合适了，因为文件 encode 一遍的话太慢了，这时候就可以用 form-data。

### 4. form-data

form data 不再是通过 & 分隔数据，而是用 --------- + 一串数字做为 boundary 分隔符。因为不是 url 的方式了，自然也不用再做 url encode。

form-data 需要指定 content type 为 multipart/form-data，然后指定 boundary 也就是分割线。

body 里面就是用 boundary 分隔符分割的内容。

很明显，这种方式适合传输文件，而且可以传输多个文件。

但是毕竟多了一些只是用来分隔的 boundary，所以请求体会增大。

### 5. json

form-urlencoded 需要对内容做 url encode，而 form data 则需要加很长的 boundary，两种方式都有一些缺点。如果只是传输 json 数据的话，不需要用这两种。

可以直接指定content type 为 application/json 就行：
