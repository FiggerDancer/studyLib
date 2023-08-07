# webpack

## cjs 和 esm差异

1. require  import  
2. module   export  
3. __dirname  
4. __filename  
5. exports export  

### es实现 __dirname

```js
import { fileUrlToPath } from 'node:url'
import { dirname } from 'node:path'
const __dirname = dirname(fileUrlPath(import.meta.url))
```

### es实现 __filename

```js
import { fileUrlToPath } from 'node:url'
const __filename = fileUrlPath(import.meta.url)
```

## 各种loader plugins

### js、ts、jsx、tsx

swc、esbuild、babel

### vue

vue-loader

VueLoaderPlugin

### 图片、音频、字体

file-loader、url-loader

### scss、less、css

postcss-loader、sass-loader、less-loader、css-loader

Extract-Mini-CSS、

### html

html-loader

HTMLWebpackPlugin

### markdown

markdown-loader

### 加速

thread-loader、thread-loader warm机制

## 写一个loader

资源加载，从资源输入到输出，是一个管道机制

结果要求必须是javascript代码，不然就得用另一个loader接着,比如用html-loader接着自己的markdown-loader

```js markdown-loader
module.exports = (source) => {
    console.log(source)
    return `console.log('hello ~')`
}
```

```js markdown-loader
module.exports = (source) => {
    const html = marked(source)
    return `module.exports = ${JSON.stringify(html)}`
}
```

```js markdown-loader
module.exports = (source) => {
    const html = marked(source)
    return `export default ${JSON.stringify(html)}`
}
```

## plugins

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

### 手写一个插件

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

## watch模式

监听文件变化，自动打包 + browser-sync 自动刷新页面

## webpack-dev-server

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
                target: 'htps://api.github.com',
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

## sourceMap

```map
{
    version: // sourcemap版本
    sources: 文件名
    names: 引用名称
    mappings: 映射
}
```

### 浏览器中运行代码

```js
eval(`console.log(123) //# sourceURL=./foo/bar.js`)
```

### 类型

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

## hmr 热更新

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

### HMR API

```js
let editor = createEditor()

module.hot.accept('./editor', () => {
    console.log('edit 模块更新了，需要手动跟新了')
    document.body.removeChild(editor.el)
    editor = createEditor()
    document.body.appendChild(editor.el)
})
```

### 图片热更新

```js
img.src = background
module.hot.accept('./better.png', () => {
    img.src = background
})
```

## DefinePlugin

传入的js代码片段，而不是字符串

```js
new webpack.DefinePlugin({
    API: JSON.stringify('sdfsdf')
})
```

## Tree Shaking

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

## sideEffects

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

## 代码分割

代码太碎，http1.0响应头占用带宽、并行加载问题

代码太大，加载慢、首屏慢

分包按需加载

Code Splitting

## webpack hash

hash 项目级，项目有改变就改变
chunkhash chunk级 哪个chunk改了哪个变
contenthash 文件级hash
