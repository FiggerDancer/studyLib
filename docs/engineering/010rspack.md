# Rspack初体验 2023/8/21

## 结论

我使用webpack+babel时，打包速度为60+s。使用webpack+swc为8-9s。使用Rspack也为6-8s。相对简单的项目，目前的Rspack相对于webpack并无性能上的太大优势。过去使用webpack性能劣势主要也是在babel和sass-loader、postcss-loader上。当然Rspack应该还有很大的上升空间。但是现在在性能差不多的情况下，webpack的功能比Rspack更强大。Rspack目前在很多方面还不够好。以我做实验的这个简单项目来说，在tsx中引入vue3的组件会导致运行时报错，分包中的name不支持输入函数，编译降级时使用mode不能为usage，缺少zip-webpack-plugin等价插件

## 关于插件使用

官方描述鉴于webpack插件大部分使用js编写，往往成为性能瓶颈，因此内置了大部分功能。

||webpack|Rspack|
|---|---|---|
|html|html-webpack-plugin|builtins.html|
|copy|copy-webpack-plugin|builtins.copy|
|progress|progress-plugin|builtins.progress|
|clean|clean-webpack-plugin|output.clean|
|minify|terser-webpack-plugin|@rspack/plugin-minify|
|extra-css|extra-mini-css-plugin|自动|
|zip|zip-webpack-plugin|无|
|speed|speed-measure-webpack-plugin|不支持|
|analyzer|webpack-bundle-analyzer|不支持|
|unused|unused-webpack-plugin|不支持|

## 配置项变化

1. extra-css没有插件，导致导出css文件，需要在output中配置 cssFilename, cssChunkFilename  
2. 可以直接在builtins中配置presetEnv进行兼容性配置，同时设置target
3. 不支持performance 性能测算
4. splitChunks.cacheGroups.{cacheGroup}.name 不支持函数
