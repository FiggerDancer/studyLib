import{_ as e,o as a,c as n,e as d}from"./app-72993491.js";const s={},l=d(`<h1 id="包管理工具" tabindex="-1"><a class="header-anchor" href="#包管理工具" aria-hidden="true">#</a> 包管理工具</h1><h2 id="npm" tabindex="-1"><a class="header-anchor" href="#npm" aria-hidden="true">#</a> npm</h2><h3 id="npm-cache" tabindex="-1"><a class="header-anchor" href="#npm-cache" aria-hidden="true">#</a> npm cache</h3><p>npm会把所有下载的包，保存在用户文件夹下面</p><p>默认值：~/.npm在Posix上 或 %AppData%/npm-cache在Windows上。根缓存文件夹。</p><p>npm install 之后会计算每个包的 sha1 值(PS:安全散列算法(Secure Hash Algorithm))，然后将包与他的 sha1 值关联保存在 package-lock.json 里面，下次 npm install 时，会根据 package-lock.json 里面保存的 sha1 值去文件夹里面寻找包文件，如果找到就不用重新下载安装了。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> cache verify
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>上面这个命令是重新计算，磁盘文件是否与 sha1 值匹配，如果不匹配可能删除。</p><p>要对现有缓存内容运行脱机验证，请使用 npm cache verify。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> cache clean <span class="token parameter variable">--force</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>上面这个命令是删除磁盘所有缓存文件。</p><h3 id="npm结构" tabindex="-1"><a class="header-anchor" href="#npm结构" aria-hidden="true">#</a> npm结构</h3><ol><li>寻找当前目录的 node_modules/package-hello 目录</li><li>如果未找到，寻找上一级的 ../node_modules/package-hello 目录，以此递归查找</li></ol><h4 id="npmv2-嵌套结构" tabindex="-1"><a class="header-anchor" href="#npmv2-嵌套结构" aria-hidden="true">#</a> npmV2 嵌套结构</h4><div class="language-dir line-numbers-mode" data-ext="dir"><pre class="language-dir"><code>- package-a
  - \`lodash@4.17.4\`
- package-b
  - \`lodash@4.17.4\`
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>问题：</p><ol><li>嵌套过深</li><li>占用空间过大</li></ol><h4 id="在-npmv3-后-node-modules-为平铺结构" tabindex="-1"><a class="header-anchor" href="#在-npmv3-后-node-modules-为平铺结构" aria-hidden="true">#</a> 在 npmV3 后 node_modules 为平铺结构</h4><div class="language-dir line-numbers-mode" data-ext="dir"><pre class="language-dir"><code>- package-a
  - \`lodash@^4.17.4\`
- package-b
  - \`lodash@^4.16.1\`
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-dir line-numbers-mode" data-ext="dir"><pre class="language-dir"><code>- package-a
  - \`lodash@4.0.0\`
- package-b
  - \`lodash@4.0.0\`
- package-c
  - \`lodash@3.0.0\`
- package-d
  - \`lodash@3.0.0\`
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重复的版本依赖</p><p>问题:</p><ol><li>Install Size，安装体积变大，浪费磁盘空间</li><li>Build Size，构建打包体积变大，浪费带宽，网站打开延迟，破坏用户体验 (PS: 支持 Tree Shaking 会好点)</li><li>破坏单例模式，破坏缓存，如 postcss 的许多插件将 postcss 扔进 dependencies，重复的版本将导致解析 AST 多次</li></ol><h2 id="pnpm" tabindex="-1"><a class="header-anchor" href="#pnpm" aria-hidden="true">#</a> pnpm</h2><p>假设我们有一个文件，称为 hello</p><p>通过 ln -s 创建一个软链接，通过 ln 可以创建一个硬链接。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">ln</span> <span class="token parameter variable">-s</span> hello hello-soft
<span class="token function">ln</span> hello hello-hard
 
<span class="token function">ls</span> <span class="token parameter variable">-lh</span>
<span class="token comment"># total 768</span>
<span class="token comment"># 45459612 -rw-r--r--  2 xiange  staff   153K 11 19 17:56 hello</span>
<span class="token comment"># 45459612 -rw-r--r--  2 xiange  staff   153K 11 19 17:56 hello-hard</span>
<span class="token comment"># 45463415 lrwxr-xr-x  1 xiange  staff     5B 11 19 19:40 hello-soft -&gt; hello</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>他们的区别有以下几点:</p><ol><li>软链接可理解为指向源文件的指针，它是单独的一个文件，仅仅只有几个字节，它拥有独立的 inode</li><li>硬链接与源文件同时指向一个物理地址，它与源文件共享存储数据，它俩拥有相同的 inode</li></ol><div class="language-dir line-numbers-mode" data-ext="dir"><pre class="language-dir"><code>./node_modules/package-a       -&gt;  .pnpm/package-a@1.0.0/node_modules/package-a
./node_modules/package-b       -&gt;  .pnpm/package-b@1.0.0/node_modules/package-b
./node_modules/package-c       -&gt;  .pnpm/package-c@1.0.0/node_modules/package-c
./node_modules/package-d       -&gt;  .pnpm/package-d@1.0.0/node_modules/package-d
./node_modules/.pnpm/lodash@3.0.0
./node_modules/.pnpm/lodash@4.0.0
./node_modules/.pnpm/package-a@1.0.0
./node_modules/.pnpm/package-a@1.0.0/node_modules/package-a
./node_modules/.pnpm/package-a@1.0.0/node_modules/lodash     -&gt; .pnpm/package-a@1.0.0/node_modules/lodash@4.0.0
./node_modules/.pnpm/package-b@1.0.0
./node_modules/.pnpm/package-b@1.0.0/node_modules/package-b
./node_modules/.pnpm/package-b@1.0.0/node_modules/lodash     -&gt; .pnpm/package-b@1.0.0/node_modules/lodash@4.0.0
./node_modules/.pnpm/package-c@1.0.0
./node_modules/.pnpm/package-c@1.0.0/node_modules/package-c
./node_modules/.pnpm/package-c@1.0.0/node_modules/lodash     -&gt; .pnpm/package-c@1.0.0/node_modules/lodash@3.0.0
./node_modules/.pnpm/package-d@1.0.0
./node_modules/.pnpm/package-d@1.0.0/node_modules/package-d
./node_modules/.pnpm/package-d@1.0.0/node_modules/lodash     -&gt; .pnpm/package-d@1.0.0/node_modules/lodash@3.0.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如此，依赖软链接的方式，可解决重复依赖安装 (doppelgangers) 的问题，如果一个项目占用 1000 MB，那么使用 pnpm 可能仅占用 800 MB</p><p>然而它除此之外，还有一个最大的好处，如果一个项目占用 1000 MB，传统方式十个项目占用 10000 MB，那么使用 pnpm 可能仅占用 3000 MB，而它得益于硬链接。</p><p>lodash@3.0.0 与 lodash@4.0.0 会生成一个指向全局目录(~/.pnpm-store)的硬链接，如果新项目依赖二者，则可复用存储空间。</p><div class="language-dir line-numbers-mode" data-ext="dir"><pre class="language-dir"><code>./node_modules/.pnpm/lodash@3.0.0/node_modules/lodash   -&gt; hardlink
./node_modules/.pnpm/lodash@4.0.0/node_modules/lodash   -&gt; hardlink
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="优势" tabindex="-1"><a class="header-anchor" href="#优势" aria-hidden="true">#</a> 优势</h3><ol><li>解决幽灵依赖问题：幽灵依赖就是package.json中未声明的依赖，但在项目中依然可以意外的被正确引用。</li><li>安装快速 pnpm比传统方案(yarn, npm)安装包的速度快了两倍，甚至比yarn2，pnp模式还要快</li><li>严格高效 node_modules 中的文件是从一个单一的可内容寻址的存储中链接过来的，代码无法访问任意包</li><li>天然内置支持仓库多包 monorepo</li><li>占用磁盘体积小</li></ol>`,36),i=[l];function o(p,c){return a(),n("div",null,i)}const m=e(s,[["render",o],["__file","003包管理工具.html.vue"]]);export{m as default};
