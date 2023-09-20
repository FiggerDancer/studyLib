import{_ as a,o as n,c as s,e}from"./app-72993491.js";const i={},d=e(`<h1 id="前端质量保障" tabindex="-1"><a class="header-anchor" href="#前端质量保障" aria-hidden="true">#</a> 前端质量保障</h1><h2 id="cicd" tabindex="-1"><a class="header-anchor" href="#cicd" aria-hidden="true">#</a> CICD</h2><h2 id="git-hooks" tabindex="-1"><a class="header-anchor" href="#git-hooks" aria-hidden="true">#</a> Git Hooks</h2><h2 id="audit" tabindex="-1"><a class="header-anchor" href="#audit" aria-hidden="true">#</a> Audit</h2><p>Audit，审计，检测你的所有依赖是否安全。npm audit/yarn audit 均有效。</p><p>修复该库的风险</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> audit fix
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="upgrade" tabindex="-1"><a class="header-anchor" href="#upgrade" aria-hidden="true">#</a> Upgrade</h2><p>自动发现更新,列出待更新项</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> outdated
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>自动更新版本号</p><p>--target 可以选择版本，默认是minor</p><p>-u 可自动将 package.json 中待更新版本号进行重写</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>npx npm-check-updates <span class="token parameter variable">-u</span> <span class="token parameter variable">--target</span> patch
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="修复线上的他人仓库的包" tabindex="-1"><a class="header-anchor" href="#修复线上的他人仓库的包" aria-hidden="true">#</a> 修复线上的他人仓库的包</h2><h3 id="github" tabindex="-1"><a class="header-anchor" href="#github" aria-hidden="true">#</a> Github</h3><ol><li>在 Github 提交 Pull Request，修复 Bug，等待合并</li><li>合并 PR 后，等待新版本发包</li><li>升级项目中的 lodash 依赖</li></ol><h3 id="patch-package" tabindex="-1"><a class="header-anchor" href="#patch-package" aria-hidden="true">#</a> patch-package</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 修改 lodash 的一个小问题</span>

$ <span class="token function">vim</span> node_modules/lodash/index.js

<span class="token comment"># 对 lodash 的修复生成一个 patch 文件，位于 patches/lodash+4.17.21.patch</span>

$ npx patch-package lodash

<span class="token comment"># 将修复文件提交到版本管理之中</span>

$ <span class="token function">git</span> <span class="token function">add</span> patches/lodash+4.17.21.patch
$ <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;fix: some error in lodash&quot;</span>

<span class="token comment"># 此后的命令在生产环境或 CI 中执行</span>

<span class="token comment"># 此后的命令在生产环境或 CI 中执行</span>

<span class="token comment"># 此后的命令在生产环境或 CI 中执行</span>

<span class="token comment"># 在生产环境装包</span>

$ <span class="token function">npm</span> i

<span class="token comment"># 为生产环境的 lodash 进行小修复</span>

$ npx patch-package
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它实际上是一个 diff 文件，在生产环境中可自动根据 diff 文件与版本号 (根据 patch 文件名存取) 将修复场景复原！</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">cat</span> patches/lodash+4.17.21.patch
<span class="token function">diff</span> <span class="token parameter variable">--git</span> a/node_modules/lodash/index.js b/node_modules/lodash/index.js
index 5d063e2<span class="token punctuation">..</span>fc6fa33 <span class="token number">100644</span>
--- a/node_modules/lodash/index.js
+++ b/node_modules/lodash/index.js
@@ <span class="token parameter variable">-1</span> +1,3 @@
+console.log<span class="token punctuation">(</span><span class="token string">&#39;DEBUG SOMETHING&#39;</span><span class="token punctuation">)</span>
+
 module.exports <span class="token operator">=</span> require<span class="token punctuation">(</span><span class="token string">&#39;./lodash&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">\\</span> No newline at end of <span class="token function">file</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,21),l=[d];function c(t,r){return n(),s("div",null,l)}const p=a(i,[["render",c],["__file","008前端质量保障.html.vue"]]);export{p as default};
