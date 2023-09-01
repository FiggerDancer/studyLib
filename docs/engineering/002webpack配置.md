# webpack配置

## 基本配置

### loader

#### loader调优先级

前置知识：

1. loader调用有优先级,可以通过enforce指定优先级，并且可以通过！符号在引入模块的时候定义是否要跳过某一种优先级的loader

webpack.js.org
2. loader的调用有inline的方式，并且可以结合上面说的！符号指定跳过某些loader

webpack.js.org
3. pitch阶段的调用在normal之前，并且顺序和normal相反。详细过程见文章总结
4. pitch阶段某一个loader返回了值的话，就直接中断整个流程，把pitch的返回值作为本次文件的loader结果继续编译。比如上述的style-loader返回了对原来文件./xxx/less的引用，指定了使用css-loader less-loader loader继续加载，并且用了两个!!去跳过了配置文件中的所有loader防止无限递归。这里使用picth起到了类似**虚拟节点**的作用

#### js、ts、jsx、tsx

swc、esbuild、babel

#### vue

vue-loader

VueLoaderPlugin

#### 图片、音频、字体

file-loader、url-loader

#### scss、less、css

postcss-loader、sass-loader、less-loader、css-loader

Extract-Mini-CSS、

#### html

html-loader

HTMLWebpackPlugin

#### markdown

markdown-loader

#### 加速

thread-loader、thread-loader warm机制

#### [写一个loader](https://juejin.cn/book/7115598540721618944/section/7119035404715556879?enter_from=course_center&utm_source=course_center)

资源加载，从资源输入到输出，是一个管道机制

结果要求必须是javascript代码，不然就得用另一个loader接着,比如用html-loader接着自己的markdown-loader

```js markdown-loader
module.exports = (source) => {
    console.log(source)
    return `console.log('hello ~')`
}
```

```js markdown-loader cjs
module.exports = (source) => {
    const html = marked(source)
    return `module.exports = ${JSON.stringify(html)}`
}
```

```js markdown-loader esm
module.exports = (source) => {
    const html = marked(source)
    return `export default ${JSON.stringify(html)}`
}
```

#### Loader编写说明

Loader 接收三个参数，分别为：

source：资源输入，对于第一个执行的 Loader 为资源文件的内容；后续执行的 Loader 则为前一个 Loader 的执行结果，可能是字符串，也可能是代码的 AST 结构；  
sourceMap: 可选参数，代码的 sourcemap 结构；  
data: 可选参数，其它需要在 Loader 链中传递的信息，比如 posthtml/posthtml-loader 就会通过这个参数传递额外的 AST 对象。  

需要注意，Loader 中执行的各种资源内容转译操作通常都是 CPU 密集型 —— 这放在 JavaScript 单线程架构下可能导致性能问题；又或者异步 Loader 会挂起后续的加载器队列直到异步 Loader 触发回调，稍微不注意就可能导致整个加载器链条的执行时间过长。

为此，Webpack 默认会缓存 Loader 的执行结果直到资源或资源依赖发生变化，开发者需要对此有个基本的理解，必要时可以通过 this.cachable 显式声明不作缓存：

提示：也可以在 Loader 代码中插入 debugger 语句，配合 ndb 工具启动调试模式。

代码逻辑:

1. 通过 this.getOptions 接口获取 Loader 配置对象；  
2. 使用 schema-utils 的 validate 接口校验 Loader 配置是否符合预期，配置 Schema 定义在 src/options.json 文件；  
3. 返回经过修改的内容。

##### Loader 常用接口

+ fs：Compilation 对象的 inputFileSystem 属性，我们可以通过这个对象获取更多资源文件的内容；  
+ resource：当前文件路径；  
+ resourceQuery：文件请求参数，例如 import "./a?foo=bar" 的 resourceQuery 值为 ?foo=bar；  
+ callback：可用于返回多个结果；  
+ getOptions：用于获取当前 Loader 的配置对象；  
+ async：用于声明这是一个异步 Loader，开发者需要通过 async 接口返回的 callback 函数传递处理结果；  
+ emitWarning：添加警告；  
+ emitError：添加错误信息，注意这不会中断 Webpack 运行；  
+ emitFile：用于直接写出一个产物文件，例如 file-loader 依赖该接口写出 Chunk 之外的产物；  
+ addDependency：将 dep 文件添加为编译依赖，当 dep 文件内容发生变化时，会触发当前文件的重新构建；  

#### Loader返回多个结果

通过callback

```js
this.callback(
    // 异常信息，Loader 正常运行时传递 null 值即可
    err: Error | null,
    // 转译结果
    content: string | Buffer,
    // 源码的 sourcemap 信息
    sourceMap?: SourceMap,
    // 任意需要在 Loader 间传递的值
    // 经常用来传递 ast 对象，避免重复解析
    data?: any
);
```

### plugins

插件用来干除了打包之外的自动化工作

举例：

清除 cleanWebpackPlugin

复制 copyWebpackPlugin 一般只有生产用

打包速度 speedPlugin

压缩图片 imageminPlugin

生成html htmlWebpackPlugin

压缩文件 zipPlugin

压缩代码 terserPlugin

抽取css MiniCssExtractPlugin

体积分析插件  Analysis

进度插件 progress

定义全局变量 DefinePlugin

#### 手写一个插件

钩子机制（类似事件机制），写插件先看文档，要用什么钩子

清除注释

```js
class MyPlugin {
    apply(compiler) {
        console.log('MyPlugin 启动')

        compiler.hooks.emit.tap('MyPlugin', compilation => {
            // 可以理解为此次打包的上下文
            for (const name in compilation.assets) {
                // console.log(name)
                // console.log(compilation.assets[name].source)
                if (name.endsWith('.js')) {
                    const contents = compilation.assets[name].source()
                    const withoutComments = contents.replace(/\/\*\*+\*\/g, '')
                    compilation.assets[name] = {
                        source: () => withoutComments,
                        size: () => withoutComments.length
                    }
                }
            }
        })
    }
}
```

### watch模式

监听文件变化，自动打包 + browser-sync 自动刷新页面

### webpack-dev-server

集成自动编译和自动刷新页面。默认是把内容写在内存中

你引入的东西都可以访问，但是一些静态文件不可以访问，需要额外配置

```js
module.exports = {
    devServer: {
        /**
         * 额外资源位置
         */
        contentBase: './public',
        /**
         * 添加代理服务
         */
        proxy: {
            '/api': {
                // https://localhost:8080/api/users => https://api.github.com/api/users
                target: 'https://api.github.com',
                // https://localhost:8080/api/users => https://api.github.com/users
                pathRewrite: {
                    '^/api': ''
                },
                // 不能使用localhost:8080作为请求Github的主机名，默认会使用本机主机名请求
                changeOrigin: true,
            }
        },
    },
    ...,
}

```

### sourceMap

```map
{
    version: // sourcemap版本
    sources: 文件名
    names: 引用名称
    mappings: 映射
}
```

#### 浏览器中运行代码

```js
eval(`console.log(123) //# sourceURL=./foo/bar.js`)
```

#### 类型

eval 是否使用eval执行模块代码
cheap sourceMap是否包含行信息
module 是否能够得到Loader处理之前的源代码
inline 代码嵌入到文件中
hidden-source-map 生成文件，但是代码里不引入
nosources-source-map 看的到错误位置，但是看不到源代码(生产环境下)

eval 会将生成的代码放在eval里，不生成sourceMap只可以定位哪个文件出了错误，构建最快
cheap-eval-source-map 相较eval，有sourceMap有行信息
cheap-module-eval-source-map 最全的

开发模式 cheap-module-eval-source-map

### hmr 热更新

1. 样式文件可以直接热更新
2. js文件，框架下每种文件有规律可以自动热更新,并没有通用的替换方案

```js
module.exports = {
    devServer: {
        // hot: true,
        // 使用包装类，错误不会自动刷新
        hotOnly: true,
    },
    ...,
}

```

#### HMR API

```js
let editor = createEditor()

module.hot.accept('./editor', () => {
    console.log('edit 模块更新了，需要手动跟新了')
    document.body.removeChild(editor.el)
    editor = createEditor()
    document.body.appendChild(editor.el)
})
```

#### 图片热更新

```js
img.src = background
module.hot.accept('./better.png', () => {
    img.src = background
})
```

### DefinePlugin

传入的js代码片段，而不是字符串

```js
new webpack.DefinePlugin({
    API: JSON.stringify('sdfsdf')
})
```

### Tree Shaking

必须使用 esmodule

dead-code 未引用代码

```js
module.exports = {
    mode: 'none',
    entry: '',
    output: {

    },
    optimization: {
        /**
         * 只导出的内容外面用的内容
         */
        usedExports: true,
        /**
         * 开启压缩，把上面那个没导出的部分给删掉
         */
        minimize: true,
        /**
         * 压缩插件
         */
        minimizer: [
            '...',
            ...,
        ],
        /**
         * 尽可能将所有函数合并到同一个模块当中，
         * 提升效率，减少代码体积
         * Scope Hoisting
         * 作用域提升
         */
        concatenateModules: true,
    }
}
```

早期babel-loader有可能将esm转化为commonjs，现在会自动判断环境使用esm，不会导致tree-shaking问题

### sideEffects

副作用，一般用于NPM标记是否有副作用

```json package.json
{
    "sideEffects": false,
}
```

```json package.json
{
    "sideEffects": [
        "./src/extend",
        "*.css"
    ],
}
```

```js
module.exports = {
    mode: 'none',
    entry: '',
    output: {

    },
    optimization: {
        /**
         * 开启后依赖的npm包如果没用就不会打包进来
         */
        sideEffects: true,
        /**
         * 只导出的内容外面用的内容
         */
        // usedExports: true,
        /**
         * 开启压缩，把上面那个没导出的部分给删掉
         */
        // minimize: true,
        /**
         * 尽可能将所有函数合并到同一个模块当中，
         * 提升效率，减少代码体积
         * Scope Hoisting
         * 作用域提升
         */
        // concatenateModules: true,
    }
}
```

### webpack hash

hash 项目级，项目有改变就改变
chunkhash chunk级 哪个chunk改了哪个变
contenthash 文件级hash

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

```js
// webpack.config.js
module.exports = {
  mode: "production",
  optimization: {
    usedExports: true,
  },
};
```

#### 使用 Scope Hoisting 合并模块

```js
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

module.exports = {
    // 方法1： 将 `mode` 设置为 production，即可开启
    mode: "production",
    // 方法2： 将 `optimization.concatenateModules` 设置为 true
    optimization: {
        concatenateModules: true,
        usedExports: true,
        providedExports: true,
    },
    // 方法3： 直接使用 `ModuleConcatenationPlugin` 插件
    plugins: [new ModuleConcatenationPlugin()]
};
```

#### external cdn

external 使用cdn引入

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

##### 为什么分包

代码太碎，http1.0响应头占用带宽、并行加载问题

代码太大，加载慢、首屏慢

分包按需加载

Code Splitting

##### 分包思路

1. runtime 单独抽离

webpack(或其他构建工具) 运行时代码不容易变更，需要单独抽离出来，比如 webpack.runtime.js。由于其体积小，必要时可注入 index.html 中，减少 HTTP 请求数，优化关键请求路径。有时注入到文件里会影响文件的hash，导致文件缓存失效

```js
{
    splitChunks: {
        // 单独抽离运行时
        runtimeChunk: true,
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

##### next.js的分包思路

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

##### 我的最佳实践

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

#### 监控产物体积

```js
module.exports = {
  // ...
  performance: {    
    // 设置所有产物体积阈值
    maxAssetSize: 172 * 1024,
    // 设置 entry 产物体积阈值
    maxEntrypointSize: 244 * 1024,
    // 报错方式，支持 `error` | `warning` | false
    hints: "error",
    // 过滤需要监控的文件类型
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith(".js");
    },
  },
};
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
