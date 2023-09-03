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

## 关于Loader详情

### [手写Loader](https://juejin.cn/book/7115598540721618944/section/7119035404715556879?enter_from=course_center&utm_source=course_center)

Loader 接收三个参数，分别为：

source：资源输入，对于第一个执行的 Loader 为资源文件的内容；后续执行的 Loader 则为前一个 Loader 的执行结果，可能是字符串，也可能是代码的 AST 结构；  
sourceMap: 可选参数，代码的 sourcemap 结构；  
data: 可选参数，其它需要在 Loader 链中传递的信息，比如 posthtml/posthtml-loader 就会通过这个参数传递额外的 AST 对象。  

1. 通过 this.getOptions 接口获取 Loader 配置对象；
2. 使用 schema-utils 的 validate 接口校验 Loader 配置是否符合预期，配置 Schema 定义在 src/options.json 文件；
3. 返回经过修改的内容。

```js
import { validate } from "schema-utils";
import schema from "./options.json";

export default function loader(source) {
  const { version, webpack } = this;
  // 获取配置信息
  const options = this.getOptions();
  // 数据校验
  validate(schema, options, "Loader");

  const newSource = `
  /**
   * Loader API Version: ${version}
   * Is this in "webpack mode": ${webpack}
   */
  /**
   * Original Source From Loader
   */
  ${source}`;

  return newSource;
}
```

#### 多种格式的loader

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

#### 指定loader

1. 绝对路径
2. 将 resolveLoader.modules 配置指向到 Loader 所在目录，Webpack 会在该目录查找加载器

#### Loader 常用接口

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

#### 取消Loader缓存

需要注意，Loader 中执行的各种资源内容转译操作通常都是 CPU 密集型 —— 这放在 JavaScript 单线程架构下可能导致性能问题；又或者异步 Loader 会挂起后续的加载器队列直到异步 Loader 触发回调，稍微不注意就可能导致整个加载器链条的执行时间过长。

为此，Webpack 默认会缓存 Loader 的执行结果直到资源或资源依赖发生变化，开发者需要对此有个基本的理解，必要时可以通过 this.cachable 显式声明不作缓存：

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

#### loader返回异步结果

```js
import less from "less";

async function lessLoader(source) {
  // 1. 获取异步回调函数
  const callback = this.async();
  // ...

  let result;

  try {
    // 2. 调用less 将模块内容转译为 css
    result = await (options.implementation || less).render(data, lessOptions);
  } catch (error) {
    // ...
  }

  const { css, imports } = result;

  // ...

  // 3. 转译结束，返回结果
  callback(null, css, map);
}

export default lessLoader;
```

#### 直接写出文件

```js
export default function loader(content) {
  const options = getOptions(this);

  validate(schema, options, {
    name: 'File Loader',
    baseDataPath: 'options',
  });
  // ...

  if (typeof options.emitFile === 'undefined' || options.emitFile) {
    // ...
    this.emitFile(outputPath, content, null, assetInfo);
  }

  const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true;

  return `${esModule ? 'export default' : 'module.exports ='} ${publicPath};`;
}

export const raw = true;
```

#### 日志系统

```js
export default function loader(source) {
  const logger = this.getLogger("xxx-loader");
  // 使用适当的 logging 接口
  // 支持：verbose/log/info/warn/error
  logger.info("information");

  return source;
}
```

#### loader单元测试

1. 创建在 Webpack 实例，并运行 Loader；
2. 获取 Loader 执行结果，比对、分析判断是否符合预期；
3. 判断执行过程中是否出错。

##### 方法一

有两种办法，一是在 node 环境下运行调用 Webpack 接口，用代码而非命令行执行编译，很多框架都会采用这种方式，例如 vue-loader、stylus-loader、babel-loader 等，优点是运行效果最接近最终用户，缺点是运行效率相对较低（可以忽略）。

```js
// posthtml-loader/test/helpers/compiler.js 文件
module.exports = function (fixture, config, options) {
  config = { /*...*/ }

  options = Object.assign({ output: false }, options)

  // 创建 Webpack 实例
  const compiler = webpack(config)

  // 以 MemoryFS 方式输出构建结果，避免写磁盘
  if (!options.output) compiler.outputFileSystem = new MemoryFS()

  // 执行，并以 promise 方式返回结果
  return new Promise((resolve, reject) => compiler.run((err, stats) => {
    if (err) reject(err)
    // 异步返回执行结果
    resolve(stats)
  }))
}
```

##### 方法二

用的少，不讲

#### pitch

Webpack 允许在 Loader 函数上挂载名为 pitch 的函数，运行时 pitch 会比 Loader 本身更早执行，例如：

```js
const loader = function (source){
    console.log('后执行')
    return source;
}

loader.pitch = function(requestString) {
    console.log('先执行')
}

module.exports = loader
```

```ts
function pitch(
    remainingRequest: string, previousRequest: string, data = {}
): void {
}
```

包含三个参数：

+ remainingRequest : 当前 loader 之后的资源请求字符串；
+ previousRequest : 在执行当前 loader 之前经历过的 loader 列表；
+ data : 与 Loader 函数的 data 相同，用于传递需要在 Loader 传播的信息。

```js
use: [
  "style-loader", "css-loader", "less-loader"
],


// css-loader 之后的 loader 列表及资源路径
remainingRequest = less-loader!./xxx.less
// css-loader 之前的 loader 列表
previousRequest = style-loader
// 默认值
data = {}
```

实现上，Loader 链条执行过程分三个阶段：pitch、解析资源、执行，设计上与 DOM 的事件模型非常相似，pitch 对应到捕获阶段；执行对应到冒泡阶段；而两个阶段之间 Webpack 会执行资源内容的读取、解析操作，对应 DOM 事件模型的 AT_TARGET 阶段：

pitch 阶段按配置顺序从左到右逐个执行 loader.pitch 函数(如果有的话)，开发者可以在 pitch 返回任意值中断后续的链路的执行.pitch的意义就在于中断

::: warning

1. loader调用有优先级,可以通过enforce指定优先级，并且可以通过！符号在引入模块的时候定义是否要跳过某一种优先级的loader

webpack.js.org
2. loader的调用有inline的方式，并且可以结合上面说的！符号指定跳过某些loader

webpack.js.org
3. pitch阶段的调用在normal之前，并且顺序和normal相反。详细过程见文章总结
4. pitch阶段某一个loader返回了值的话，就直接中断整个流程，把pitch的返回值作为本次文件的loader结果继续编译。比如上述的style-loader返回了对原来文件./xxx/less的引用，指定了使用css-loader less-loader loader继续加载，并且用了两个!!去跳过了配置文件中的所有loader防止无限递归。这里使用picth起到了类似**虚拟节点**的作用

:::

#### loader-utils

在 Webpack5 之前，loader-utils 是一个非常重要的 Loader 开发辅助工具

被裁减后的 loader-utils 仅保留了四个接口：

1. urlToRequest：用于将模块路径转换为文件路径的工具函数；
2. isUrlRequest：用于判定字符串是否为模块请求路径；
3. getHashDigest：用于计算内容 Hash 值；
4. interpolateName：用于拼接文件名的模板工具；

#### vue-loader的实现

先从结构说起，vue-loader 内部实际上包含了三个组件：

1. lib/index.js 定义的 Normal Loader，负责将 Vue SFC 不同区块转化为 JavaScript import 语句，具体逻辑下面细讲；
2. lib/loaders/pitcher.js 定义的 Pitch Loader，负责遍历的 rules 数组，拼接出完整的行内引用路径；
3. lib/plugin.js 定义的插件，负责初始化编译环境，如复制原始 rules 配置等；

vue-loader 运行过程大致上可以划分为两个阶段：

1. 预处理阶段：动态修改 Webpack 配置，注入 vue-loader 专用的一系列 module.rules；
2. 内容处理阶段：Normal Loader 配合 Pitch Loader 完成文件内容转译。

##### 预处理阶段

vue-loader 插件会在 apply 函数中动态修改 Webpack 配

```js
// 初始化pitch-loader
const pitcher = {
  loader: require.resolve('./loaders/pitcher'),
  resourceQuery: query => {
    if (!query) { return false }
    const parsed = qs.parse(query.slice(1))
    return parsed.vue != null
  }
  // ...
}

// replace original rules
compiler.options.module.rules = [
  pitcher,
  ...clonedRules,
  ...rules
]
```

## 插件架构

将 Webpack 的插件架构归类为“事件/订阅”模式，我认为这种归纳有失偏颇。订阅模式是一种松耦合架构，发布器只是在特定时机发布事件消息，订阅者并不或者很少与事件直接发生交互，举例来说，我们平常在使用 HTML 事件的时候很多时候只是在这个时机触发业务逻辑，很少调用上下文操作。

而 Webpack 的插件体系是一种基于 Tapable 实现的强耦合架构，它在特定时机触发钩子时会附带上足够的上下文信息，插件定义的钩子回调中，能也只能与这些上下文背后的数据结构、接口交互产生 side effect，进而影响到编译状态和后续流程。

Tapable 是 Webpack 插件架构的核心支架，但它的代码量其实很少，本质上就是围绕着 订阅/发布 模式叠加各种特化逻辑，适配 Webpack 体系下复杂的事件源-处理器之间交互需求，比如：

+ 有些场景需要支持将前一个处理器的结果传入下一个回调处理器；  
+ 有些场景需要支持异步并行调用这些回调处理器。

## webpack执行流程

+ 初始化阶段：修整配置参数，创建 Compiler、Compilation 等基础对象，并初始化插件及若干内置工厂、工具类，并最终根据 entry 配置，找到所有入口模块；
+ 构建阶段：从 entry 文件开始，调用 loader 将模块转译为 JavaScript 代码，调用 Acorn 将代码转换为 AST 结构，遍历 AST 从中找出该模块依赖的模块；之后 递归 遍历所有依赖模块，找出依赖的依赖，直至遍历所有项目资源后，构建出完整的 模块依赖关系图；
+ 生成阶段：根据 entry 配置，将模块组装为一个个 Chunk 对象，之后调用一系列 Template 工厂类翻译 Chunk 代码并封装为 Asset，最后写出到文件系统。

## 实践：在异步模块中使用 Tree-Shaking

Webpack5 之后，我们还可以用一种特殊的备注语法，实现异步模块的 Tree-Shaking 功能，例如：

```js
import(/*webpackExports: ["foo", "default"]*/ "./foo").then((module) => {
  console.log(module.foo);
});
```

示例中，通过 `/*webpackExports: xxx*/` 备注语句，显式声明即将消费异步模块的那些导出内容，Webpack 即可借此判断模块依赖，实现 Tree-Shaking。

## 热更新实现原理

Webpack HMR 特性的执行过程并不复杂，核心：

1. 使用 webpack-dev-server （后面简称 WDS）托管静态资源，同时以 Runtime 方式注入一段处理 HMR 逻辑的客户端代码；
2. 浏览器加载页面后，与 WDS 建立 WebSocket 连接；
3. Webpack 监听到文件变化后，增量构建发生变更的模块，并通过 WebSocket 发送 hash 事件；
4. 浏览器接收到 hash 事件后，请求 manifest 资源文件，确认增量变更范围；
5. 浏览器加载发生变更的增量模块；
6. Webpack 运行时触发变更模块的 module.hot.accept 回调，执行代码变更逻辑；
7. done。

```ts
module.hot.accept(path?: string, callback?: function);
```

### accept使用注意

1. 处理失败兜底逻辑
2. 冒泡机制  底下的依赖自底向上冒泡
3. 使用无参数调用风格：作用是捕获当前文件的变更事件，并从模块第一行开始重新运行该模块的代码
