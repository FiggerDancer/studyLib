# Bundless

通过 script[type=module]，可直接在浏览器中使用原生 ESM。这也使得前端不打包 (Bundless) 成为可能。

由于前端跑在浏览器中，因此它也只能从 URL 中引入 Package

绝对路径: <https://cdn.sykpack.dev/lodash>  
相对路径: ./lib.js  

```html
<script type="module">
  import lodash from "https://cdn.skypack.dev/lodash";
</script>
```

## ImportMap

Http Import 每次都需要输入完全的 URL，相对以前的裸导入 (bare import specifiers)，很不太方便，

在 ESM 中，可通过 importmap 使得裸导入可正常工作:

```html
<script type="importmap">
  {
    "imports": {
      "lodash": "https://cdn.skypack.dev/lodash",
      "ms": "https://cdn.skypack.dev/ms"
    }
  }
</script>
```

导入子路径

```html
<script type="importmap">
  {
    "imports": {
      "lodash": "https://cdn.skypack.dev/lodash",
      "lodash/": "https://cdn.skypack.dev/lodash/"
    }
  }
</script>
<script type="module">
  import get from "lodash/get.js";
</script>
```

## ImportAssertion

通过 script[type=module]，不仅可引入 Javascript 资源，甚至可以引入 JSON/CSS，示例如下

```html
<script type="module">
  import data from "./data.json" assert { type: "json" };
 
  console.log(data);
</script>
```

## 与Bundle区别

||Bundle模式|Bundleless模式|
|---|---|---|
|项目启动|完整打包项目|启动 devServer，启动快 |
|浏览器加载|等待打包完成，加载对应bundle|直接发起请求，映射到本地文件|
|本地文件更新|重新打包bundle|重新请求单个文件|

## Bundless 优势

vite一开始就将应用中的模块分为依赖和源码，并以此改进开发服务器启动时间。

1. 依赖 大多数时间不会变动，将采用esbuild预构建（同时也是为了解决cjs，和小包多的情况。例如，lodash-es 有超过 600 个内置模块！），并缓存  
2. 源码 并不是所有源码都被同时加载，例如路由等，vite只在浏览器请求源码时进行相应的转换并按需提供源码。根据情景动态导入代码  
3. 更新缓慢 传统的webpack打包工具热更新虽然只需要替换自己这个模块，但是随着应用增大性能显著性下降，vite热更新只在esm上执行，编辑一个文件，vite只需要精准的使已编辑的模块与其最近的HMR边界之间的链失活，使得无论应用大小如何，都可以快速更新，vite同时利用http头加速整个页面的重新加载，源码模块请求根据304 Not Modified 进行协商缓存，依赖模块请求则会通过 Cache-Control:max-age=31536000,immutable 进行强缓存  

## Bundless 劣势

1. 尽管原生 ESM 现在得到了广泛支持，但由于嵌套导入会导致额外的网络往返，在生产环境中发布未打包的 ESM 仍然效率低下（即使使用 HTTP/2）。为了在生产环境中获得最佳的加载性能，最好还是将代码进行 tree-shaking、懒加载和 chunk 分割（以获得更好的缓存）。
2. 要确保开发服务器和生产环境构建之间的最优输出和行为一致并不容易。某些时候开发环境和生产环境不一致，比如因为引入一些具有副作用的包或者css，先后引入的顺序在开发环境和生产环境有时是不一致的
