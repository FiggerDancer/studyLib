# 手写简单的webpack

## 仓库地址

[mini-webpack](https://github.com/lxy951101/mini-webpack/tree/main)

## 代码

```js
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import parser from '@babel/parser'
import traverse from '@babel/traverse'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { render } from 'ejs'
import { transformFromAst } from 'babel-core'
import { SyncHook } from 'tapable'
import { jsonLoader } from './jsonLoader.js'
import { MyPlugin } from './MyPlugin.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)



let chunkId = 1

function createAssets(path, options) {
    // 入口文件
    let source = readFileSync(path, {
        encoding: 'utf-8'
    })

    // loader
    const { rules } = options

    const loaderContext = {
        deps: [],
        addDeps(loader) {
            this.deps.push(loader)
        }
    }

    rules.forEach(({ test, use }) => {
        if (test.test(path)) {
            if (!Array.isArray(use)) {
                use = [use]
            }
            source = use.reverse().reduce((source, loader) => loader.bind(loaderContext)(source), source)
        }
    })

    // ast解析
    const ast = parser.parse(source, { 
        sourceType: 'module'
    })
    // 收集依赖
    const deps = []
    traverse.default(ast, {
        ImportDeclaration({ node }) {
            deps.push(node.source.value)
        }
    })

    const { code } = transformFromAst(ast, null, {
        presets: ["env"],
    })

    return {
        filePath: path,
        source,
        code: code,
        deps,
    }
}

// 构建图
function createGraph(path, options) {
    const mainDir = dirname(path)
    const mainAsset = createAssets(path, options)
    const queue = [mainAsset]
    

    for (const asset of queue) {
        const mapping = asset.mapping = {}
        asset.deps.forEach((relativePath) => {
            const childPath = resolve(mainDir, relativePath)
            const childAsset = createAssets(childPath, options)
            mapping[relativePath] = chunkId++
            queue.push(childAsset)
        })
    }
    return queue
}

// 构建
function build(options) {
    const newOptions = Object.assign({
        rules: [],
        plugins: []
    }, options)
    const {
        input,
        output,
        rules,
        plugins,
    } = newOptions
    const hooks = {
        emit: new SyncHook(['context'])
    }
    const compiler = {
        hooks
    }

    plugins.forEach((plugin) => {
        plugin.apply(compiler)
    })
    const template = readFileSync('template.ejs', {
        encoding: 'utf-8'
    })
    const entry = join(__dirname, input)
    const graph = createGraph(entry, options)
    const data = graph.map((asset, index) => {
        return {
            chunkId: asset.filePath,
            code: asset.code,
            mapping: asset.mapping,
        }
    })

    let code = render(template, {data})

    const context = {
        changeCode(newCode) {
            code = newCode
        },
        getCode() {
            return code;
        }
    }

    hooks.emit.call(context)

    ensureDir(dirname(output))
    writeFileSync(output, code)
}

function ensureDir(path) {
    const dirPath = join(__dirname, path)
    if (existsSync(dirPath)) {
        return dirPath;
    }
    return mkdirSync(dirPath)
}

build({
    input: './src/main.js',
    output: './dist/bundle.js',
    rules: [
        {
            test: /\.json$/,
            use: [
                jsonLoader
            ]
        }
    ],
    plugins: [
        new MyPlugin()
    ]
})

```

```ejs template.ejs
(() => {
    const __webpack_modules__ = [
        <% data.forEach(info => { %>
            [(module, exports, require) => {
                <%- info.code %>
            }, <%- JSON.stringify(info.mapping) %>],
        <% }) %>
    ]
    const cacheModules = {}

    const __webpack_require__ = (chunkId) => {
        
        const chunkModule = cacheModules[chunkId]
        if (chunkModule) {
            return chunkModule
        }
        const [fn, mapping] = __webpack_modules__[chunkId]
        const localRequire = (filePath) => {
            const id = mapping[filePath]
            return __webpack_require__(id)
        }
        const __webpack_exports__ = {}
        fn(__webpack_modules__, __webpack_exports__, localRequire)
        return __webpack_exports__
    }

    __webpack_require__(0)
})()
```

```js bundle.js
(() => {
    const __webpack_modules__ = [
        [(module, exports, require) => {
            "use strict";
            var _foo = require("foo.js");
            (0, _foo.foo)();
            console.log('main.js');
        }, {"foo.js":1}],
        [(module, exports, require) => {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.foo = foo;

            function foo() {
            console.log('hello World');
            }
        }, {}],
    ]
    const cacheModules = {}
    const __webpack_require__ = (chunkId) => {
        const chunkModule = cacheModules[chunkId]
        if (chunkModule) {
            return chunkModule
        }
        const [fn, mapping] = __webpack_modules__[chunkId]
        const localRequire = (filePath) => {
            const id = mapping[filePath]
            return __webpack_require__(id)
        }
        const __webpack_exports__ = {}
        fn(__webpack_modules__, __webpack_exports__, localRequire)
        return __webpack_exports__
    }
    __webpack_require__(0)
})()

```

```js MyPlugin.js
export class MyPlugin {
    apply(compiler) {
        console.log('MyPlugin 启动')

        compiler.hooks.emit.tap('MyPlugin', (context) => {
            // 可以理解为此次打包的上下文
            const code = context.getCode()
            console.log('代码体积大小:', code.length)
        })
    }
}
```

```js jsonLoader.js
export function jsonLoader(source) {
    this.addDeps('jsonLoader')
    return `export default ${JSON.stringify(source)}`
}

```
