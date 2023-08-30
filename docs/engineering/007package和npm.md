# 关于package和npm

## semver与版本管理

semver，Semantic Versioning 语义化版本的缩写，文档可见 <https://semver.org/> 由[major, minor, patch] 三部分组成，其中

major: 当你发了一个含有 Breaking Change 的 API  
minor: 当你新增了一个向后兼容的功能时  
patch: 当你修复了一个向后兼容的 Bug 时  

对于 ~1.2.3 而言，它的版本号范围是 >=1.2.3 <1.3.0

对于 ^1.2.3 而言，它的版本号范围是 >=1.2.3 <2.0.0

当我们 npm i 时，默认的版本号是 ^，可最大限度地在向后兼容与新特性之间做取舍，但是有些库有可能不遵循该规则，我们在项目时应当使用 yarn.lock/package-lock.json 锁定版本号。

### package-lock.json 工作流程

1. npm i webpack，此时下载最新 webpack 版本 5.58.2，在 package.json 中显示为 webpack: ^5.58.2，版本号范围是 >=5.58.2 < 6.0.0  
2. 在 package-lock.json 中全局搜索 webpack，发现 webpack 的版本是被锁定的，也是说它是确定的 webpack: 5.58.2  
3. webpack 最新版本为 5.100.0，但由于 webpack 版本在 package-lock.json 中锁死，每次上线时仍然下载 5.58.2 版本号  
4. webpack 最新版本为 6.0.0  
    4.1 分支1 但由于 webpack 版本在 package-lock.json 中锁死，且 package.json 中 webpack 版本号为 ^5.58.2，与 package-lock.json 中为一致的版本范围。每次上线时仍然下载 5.58.2 版本号  
    4.2 分支2，webpack需要进行升级，此时手动改写 package.json 中 webpack 版本号为 ^6.0.0，与 package-lock.json 中不是一致的版本范围。此时 npm i 将下载 6.0.0 最新版本号，并重写 package-lock.json 中锁定的版本号为 6.0.0  

当 package-lock.json 该 package 锁死的版本号符合 package.json 中的版本号范围时，将以 package-lock.json 锁死版本号为主。  

当 package-lock.json 该 package 锁死的版本号不符合 package.json 中的版本号范围时，将会安装该 package 符合 package.json 版本号范围的最新版本号，并重写 package-lock.json  

## 输出文件

### main

### module  

### exports

exports 可以更容易地控制子目录的访问路径，也被称为 export map

```json
{
  "type": "module",
  "exports": {
    "electron": {
      "node": {
        "development": {
          "module": "./index-electron-node-with-devtools.js",
          "import": "./wrapper-electron-node-with-devtools.js",
          "require": "./index-electron-node-with-devtools.cjs"
        },
        "production": {
          "module": "./index-electron-node-optimized.js",
          "import": "./wrapper-electron-node-optimized.js",
          "require": "./index-electron-node-optimized.cjs"
        },
        "default": "./wrapper-electron-node-process-env.cjs"
      },
      "development": "./index-electron-with-devtools.js",
      "production": "./index-electron-optimized.js",
      "default": "./index-electron-optimized.js"
    },
    "node": {
      "development": {
        "module": "./index-node-with-devtools.js",
        "import": "./wrapper-node-with-devtools.js",
        "require": "./index-node-with-devtools.cjs"
      },
      "production": {
        "module": "./index-node-optimized.js",
        "import": "./wrapper-node-optimized.js",
        "require": "./index-node-optimized.cjs"
      },
      "default": "./wrapper-node-process-env.cjs"
    },
    "development": "./index-with-devtools.js",
    "production": "./index-optimized.js",
    "default": "./index-optimized.js"
  }
}
```

## dep/devDep

当进行业务开发时，严格区分 dependencies 与 devDependencies 并无必要

对于库 (Package) 开发而言，是有严格区分的  

dependencies: 在生产环境中使用  
devDependencies: 在开发环境中使用，如 webpack/babel/eslint 等  
当在项目中安装一个依赖的 Package 时，该依赖的 dependencies 也会安装到项目中，即被下载到 node_modules 目录中。但是 devDependencies 不会  

因此当我们开发 Package 时，需要注意到我们所引用的 dependencies 会被我们的使用者一并下载，而 devDependencies 不会。  

一些 Package 宣称自己是 zero dependencies，一般就是指不依赖任何 dependencies，如 highlight  

## engines

控制宿主环境

```json
{
  "engines": {
    "node": ">=14.0.0"
  }
}
```

## script hooks

### npm script生命周期

当我们执行任意 npm run 脚本时，将自动触发 pre/post 的生命周期。

当手动执行 npm run abc 时，将在此之前自动执行 npm run preabc，在此之后自动执行 npm run postabc。

```sh
// 自动执行
npm run preabc
 
npm run abc
 
// 自动执行
npm run postabc
```

patch-package 一般会放到 postinstall 中。

```json
{
  postinstall: "patch-package";
}
```

而发包的生命周期更为复杂，当执行 npm publish，将自动执行以下脚本。

+ prepublishOnly: 最重要的一个生命周期。
+ prepack
+ prepare 最常用，比如 husky install
+ postpack
+ publish
+ postpublish

当然你无需完全记住所有的生命周期，如果你需要在发包之前自动做一些事情，如测试、构建等，请在 prepulishOnly 中完成。  

```json
{
  prepublishOnly: "npm run test && npm run build";
}
```

### 风险

假设某一个第三方库的 npm postinstall 为 rm -rf

```json
{
  postinstall: "rm -rf /";
}
```

实际上，确实有很多 npm package 被攻击后，就是通过 npm postinstall 自动执行一些事，比如挖矿等。

如果 npm 可以限制某些库的某些 hooks 执行，则可以解决这个问题。

## npm package 发包

```sh
npm login
```

```json
{
  name: 'demo',
  version: '1.0.0',
  main: './index.js',
}
```

```sh
npm publish
```

如若该包进行更新后，需要再次发包，可 npm version 控制该版本进行升级，记住需要遵守 Semver 规范

增加一个修复版本号: 1.0.1 -> 1.0.2 (自动更改 package.json 中的 version 字段)

```sh
npm version patch
```

增加一个小的版本号: 1.0.1 -> 1.1.0 (自动更改 package.json 中的 version 字段)

```sh
npm version minor
```

将更新后的包发布到 npm 中

```sh
npm publish
```

实际发包内容取决于files

```json
{
  files: ["dist"];
}
```

当你发包成功后，也可以前往 [npm devtool](https://npm.devtool.tech/vue) 查看各项数据。

## 第三方库解决潜在间接依赖不可控问题

1. 将所有依赖中的版本号在 [package.json](https://github.com/vercel/next.js/tree/canary/packages/next/package.json) 中锁死。
2. 将部分依赖直接编译后直接引入，而非通过依赖的方式，如 webpack、babel 等。可见目录 [next/compiled](https://github.com/vercel/next.js/tree/canary/packages/next/compiled)
