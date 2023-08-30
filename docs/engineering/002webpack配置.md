# webpack配置

## 性能优化

### 构建性能优化

#### swc或者esbuild

swc-loader代替babel-loader，如果项目使用的是vue，依然需要引入babel来处理jsx文件，swc默认支持react的jsx。

通过.swcrc配置swc

速度比用babel快了6倍左右，如果使用turpopack或者rspack速度还会更快，遗憾的是turpopack不支持vue，rspack大概还能在webpack+swc基础上快一倍，但不支持分包时的name为函数，tsx文件不能引入vue，polyfill引入必须用entry,不过一般而言，webpack+swc的运行速度已经可以满足大部分要求

```js
modules: {
    rules: [
        {
            test: /\.m?[tj]s$/,
            use: [
                {
                    loader: 'swc-loader',
                }
            ]
        }
    ]
}
```

#### cache 持久化缓存

本地缓存的问题，就是有时你只改某个文件，另一个文件没改，打包时不更新，我开启了一段时间，大部分时间没啥问题，但是一有问题就很头疼，所以我最后关闭了

```js
{
  cache: {
    type: "filesystem";
  }
}
```

#### thread-loader

官方开启多进程loader，可对babel、swc解析AST时开启多线程处理，提升编译性能，遗憾的是scss不支持，然后提升的性能不算太大，远不如swc和esbuild震撼，热更新时要提前开启

```js
threadLoader.warmup(
    {},
    [
        // 子进程中需要预加载的 node 模块
        "swc-loader",
    ]
);
```

### 打包体积优化

#### 分析

webpack-bundle-analyzer插件分析各个chunk的打包体积，

stat: 每个模块初始体积  
parsed: webpack打包后的体积，terser压缩后  
gzip: 经gzip压缩后的体积  

设置环境变量开启插件

```js
process.env.ANALYZE => ANALYZE=true && npm run build
process.env.npm_config_report  => npm run build --report
```

#### JS压缩

webpack默认开启

这个过程就是

1. 去除多余字符空格、换行和注释  
2. 压缩变量名：变量名、函数名和属性名  
3. 合并声明以及布尔值简化  
4. 编译预计算  

#### TreeShaking

json也支持，尽量使用支持esm的包，因为只有esm支持摇树

#### polyfill core-js

在使用babel的时候一般我们会使用 @babel/plugin-transform-runtime 并配置 corejs为 3  useBuiltIn已经被废弃了，现在babel会默认使用usage

在swc中我们可以开启 env中coreJs，区别是需要指定具体版本，swc的corejs也是依赖babel去引用的  mode:usage 可以按需引入

对于swc和babel函数可以通过 externalHelpers: true 或者 helpers: true（默认） 分离，我在开发代码库的时候是这样做的，这样可以进一步减小代码体积  

垫片的加入包括css中autoprefixer都需要依赖browserslist这个库，这个库和canIUse是一家的可以统计不同api和css的兼容性，然后只加入不兼容的  

但browserslist并不维护数据库，由于lock文件需要你手动更新 caniuse-lite

```js
npx browserslist@latest --update-db
```

#### 高效分包

1. runtime 单独抽离

webpack(或其他构建工具) 运行时代码不容易变更，需要单独抽离出来，比如 webpack.runtime.js。由于其体积小，必要时可注入 index.html 中，减少 HTTP 请求数，优化关键请求路径

```js
{
    splitChunks: {
        // 单独抽离运行时
        runtime: true,
        cacheGroups: {

        }
    }
}
```

2. framework.runtime 单独抽离

React(Vue) 运行时代码不容易变更，且每个组件都会依赖它，可单独抽离出来 framework.runtime.js

3. 高频库

如果一个模块虽是公共模块，但是该模块体积过大，可直接 import() 引入，异步加载，单独分包，比如 echarts 等

如果公共模块数量多，导致 vendor.js 体积过大(1MB)，每个页面都会加载它，导致性能变差，此时如何分包

答：有以下两个思路

思路一: 可对 vendor.js 改变策略，比如被引用了十次以上，被当做公共模块抽离成 verdor-A.js，五次的抽离为 vendor-B.js，两次的抽离为 vendor-C.js
思路二: 控制 vendor.js 的体积，当大于 100KB 时，再次进行分包，多分几个 vendor-XXX.js，但每个 vendor.js 都不超过 100KB

### next.js的分包思路

```js
{
  // Keep main and _app chunks unsplitted in webpack 5
  // as we don't need a separate vendor chunk from that
  // and all other chunk depend on them so there is no
  // duplication that need to be pulled out.
  chunks: (chunk) =>
    !/^(polyfills|main|pages\/_app)$/.test(chunk.name) &&
    !MIDDLEWARE_ROUTE.test(chunk.name),
  cacheGroups: {
    framework: {
      chunks: (chunk: webpack.compilation.Chunk) =>
        !chunk.name?.match(MIDDLEWARE_ROUTE),
      name: 'framework',
      test(module) {
        const resource =
          module.nameForCondition && module.nameForCondition()
        if (!resource) {
          return false
        }
        return topLevelFrameworkPaths.some((packagePath) =>
          resource.startsWith(packagePath)
        )
      },
      priority: 40,
      // Don't let webpack eliminate this chunk (prevents this chunk from
      // becoming a part of the commons chunk)
      enforce: true,
    },
    lib: {
      test(module: {
        size: Function
        nameForCondition: Function
      }): boolean {
        return (
          module.size() > 160000 &&
          /node_modules[/\\]/.test(module.nameForCondition() || '')
        )
      },
      name(module: {
        type: string
        libIdent?: Function
        updateHash: (hash: crypto.Hash) => void
      }): string {
        const hash = crypto.createHash('sha1')
        if (isModuleCSS(module)) {
          module.updateHash(hash)
        } else {
          if (!module.libIdent) {
            throw new Error(
              `Encountered unknown module type: ${module.type}. Please open an issue.`
            )
          }
 
          hash.update(module.libIdent({ context: dir }))
        }
 
        return hash.digest('hex').substring(0, 8)
      },
      priority: 30,
      minChunks: 1,
      reuseExistingChunk: true,
    },
    commons: {
      name: 'commons',
      minChunks: totalPages,
      priority: 20,
    },
    middleware: {
      chunks: (chunk: webpack.compilation.Chunk) =>
        chunk.name?.match(MIDDLEWARE_ROUTE),
      filename: 'server/middleware-chunks/[name].js',
      minChunks: 2,
      enforce: true,
    },
  },
  maxInitialRequests: 25,
  minSize: 20000,
}
```

### 我的最佳实践

由于我的项目是离线项目，不涉及http请求，所以我选择尽可能的分包，将所有依赖的库单独打包，如果http2也可以采用该策略,如果是http1的话，最大请求数则不应该超过30个。在rspack中name不支持函数

```js
{
    chunks: "all",
    maxInitialRequests: Infinity,
    minSize: 0,
    // 限制每个包体积不超过244KB
    maxSize: 244 * 1024 * 8,
    cacheGroups: {
        vendor: {
            priority: 100,
            test: /[\\/]node_modules[\\/]/,
            minChunks: 1,
            name(module) {
                const match = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                );
                const packageName = match ? match[1] : "other"
                if (packageName.indexOf('@up366') > -1) {
                    const match = module.context.match(
                        /[\\/]node_modules[\\/](.*?)([\\/]|$)(.*?)([\\/]|$)/
                    );
                    const packageName = match ? match[3] : "other"
                    return `npm.up366.${packageName}`;
                }
                return `npm.${packageName.replace("@", "")}`;
            },
        },
        common: {
            // 重复代码抽离分包
            minChunks: 2,
            reuseExistingChunk: true,
            priority: 10,
        },
    },
}
```

## 缓存策略

使用webpack打包器打包时生成hash，哈希分为三种，contentHash、chunkHash、hash，所以服务端对这些资源都可以设置永久缓存

通过在服务器端/网关端对资源设置以下 Response Header，进行强缓存一年时间，称为永久缓存，即 Long Term Cache。

```
Cache-Control: public,max-age=31536000,immutable
```

### 改变某个文件导致另一个文件发生变化

比如文件A， index.js.文件B， lib.js， 文件A引用文件B，当我改变文件B时会导致文件A打包后的哈希后缀发生变化，此时要想增强缓存能力，则需要开启 `chunkIds: 'deterministic'`

```
{
  optimization: {
    chunkIds: 'deterministic'
  }
}
```
