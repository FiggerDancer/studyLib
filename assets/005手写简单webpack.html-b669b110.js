import{_ as p,r as t,o as e,c as o,b as n,d as s,a as c,e as i}from"./app-72993491.js";const l={},u=n("h1",{id:"手写简单的webpack",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#手写简单的webpack","aria-hidden":"true"},"#"),s(" 手写简单的webpack")],-1),r=n("h2",{id:"仓库地址",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#仓库地址","aria-hidden":"true"},"#"),s(" 仓库地址")],-1),k={href:"https://github.com/lxy951101/mini-webpack/tree/main",target:"_blank",rel:"noopener noreferrer"},d=i(`<h2 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> readFileSync<span class="token punctuation">,</span> writeFileSync<span class="token punctuation">,</span> mkdirSync<span class="token punctuation">,</span> existsSync <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;fs&#39;</span>
<span class="token keyword">import</span> parser <span class="token keyword">from</span> <span class="token string">&#39;@babel/parser&#39;</span>
<span class="token keyword">import</span> traverse <span class="token keyword">from</span> <span class="token string">&#39;@babel/traverse&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> fileURLToPath <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;url&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> dirname<span class="token punctuation">,</span> join<span class="token punctuation">,</span> resolve <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;path&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> render <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;ejs&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> transformFromAst <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;babel-core&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> SyncHook <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;tapable&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> jsonLoader <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./jsonLoader.js&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> MyPlugin <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./MyPlugin.js&#39;</span>

<span class="token keyword">const</span> __filename <span class="token operator">=</span> <span class="token function">fileURLToPath</span><span class="token punctuation">(</span><span class="token keyword">import</span><span class="token punctuation">.</span>meta<span class="token punctuation">.</span>url<span class="token punctuation">)</span>
<span class="token keyword">const</span> __dirname <span class="token operator">=</span> <span class="token function">dirname</span><span class="token punctuation">(</span>__filename<span class="token punctuation">)</span>



<span class="token keyword">let</span> chunkId <span class="token operator">=</span> <span class="token number">1</span>

<span class="token keyword">function</span> <span class="token function">createAssets</span><span class="token punctuation">(</span><span class="token parameter">path<span class="token punctuation">,</span> options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 入口文件</span>
    <span class="token keyword">let</span> source <span class="token operator">=</span> <span class="token function">readFileSync</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">encoding</span><span class="token operator">:</span> <span class="token string">&#39;utf-8&#39;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token comment">// loader</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> rules <span class="token punctuation">}</span> <span class="token operator">=</span> options

    <span class="token keyword">const</span> loaderContext <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">deps</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token function">addDeps</span><span class="token punctuation">(</span><span class="token parameter">loader</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>deps<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>loader<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    rules<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> test<span class="token punctuation">,</span> use <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>test<span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>use<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                use <span class="token operator">=</span> <span class="token punctuation">[</span>use<span class="token punctuation">]</span>
            <span class="token punctuation">}</span>
            source <span class="token operator">=</span> use<span class="token punctuation">.</span><span class="token function">reverse</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">source<span class="token punctuation">,</span> loader</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">loader</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span>loaderContext<span class="token punctuation">)</span><span class="token punctuation">(</span>source<span class="token punctuation">)</span><span class="token punctuation">,</span> source<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token comment">// ast解析</span>
    <span class="token keyword">const</span> ast <span class="token operator">=</span> parser<span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>source<span class="token punctuation">,</span> <span class="token punctuation">{</span> 
        <span class="token literal-property property">sourceType</span><span class="token operator">:</span> <span class="token string">&#39;module&#39;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token comment">// 收集依赖</span>
    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    traverse<span class="token punctuation">.</span><span class="token function">default</span><span class="token punctuation">(</span>ast<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token function">ImportDeclaration</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> node <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            deps<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>source<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">const</span> <span class="token punctuation">{</span> code <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">transformFromAst</span><span class="token punctuation">(</span>ast<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">presets</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;env&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">return</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">filePath</span><span class="token operator">:</span> path<span class="token punctuation">,</span>
        source<span class="token punctuation">,</span>
        <span class="token literal-property property">code</span><span class="token operator">:</span> code<span class="token punctuation">,</span>
        deps<span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 构建图</span>
<span class="token keyword">function</span> <span class="token function">createGraph</span><span class="token punctuation">(</span><span class="token parameter">path<span class="token punctuation">,</span> options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> mainDir <span class="token operator">=</span> <span class="token function">dirname</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span>
    <span class="token keyword">const</span> mainAsset <span class="token operator">=</span> <span class="token function">createAssets</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> options<span class="token punctuation">)</span>
    <span class="token keyword">const</span> queue <span class="token operator">=</span> <span class="token punctuation">[</span>mainAsset<span class="token punctuation">]</span>
    

    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> asset <span class="token keyword">of</span> queue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> mapping <span class="token operator">=</span> asset<span class="token punctuation">.</span>mapping <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
        asset<span class="token punctuation">.</span>deps<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">relativePath</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> childPath <span class="token operator">=</span> <span class="token function">resolve</span><span class="token punctuation">(</span>mainDir<span class="token punctuation">,</span> relativePath<span class="token punctuation">)</span>
            <span class="token keyword">const</span> childAsset <span class="token operator">=</span> <span class="token function">createAssets</span><span class="token punctuation">(</span>childPath<span class="token punctuation">,</span> options<span class="token punctuation">)</span>
            mapping<span class="token punctuation">[</span>relativePath<span class="token punctuation">]</span> <span class="token operator">=</span> chunkId<span class="token operator">++</span>
            queue<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>childAsset<span class="token punctuation">)</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> queue
<span class="token punctuation">}</span>

<span class="token comment">// 构建</span>
<span class="token keyword">function</span> <span class="token function">build</span><span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> newOptions <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> options<span class="token punctuation">)</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span>
        input<span class="token punctuation">,</span>
        output<span class="token punctuation">,</span>
        rules<span class="token punctuation">,</span>
        plugins<span class="token punctuation">,</span>
    <span class="token punctuation">}</span> <span class="token operator">=</span> newOptions
    <span class="token keyword">const</span> hooks <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">emit</span><span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">SyncHook</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">&#39;context&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">const</span> compiler <span class="token operator">=</span> <span class="token punctuation">{</span>
        hooks
    <span class="token punctuation">}</span>

    plugins<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">plugin</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token function">plugin</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span>compiler<span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">const</span> template <span class="token operator">=</span> <span class="token function">readFileSync</span><span class="token punctuation">(</span><span class="token string">&#39;template.ejs&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">encoding</span><span class="token operator">:</span> <span class="token string">&#39;utf-8&#39;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">const</span> entry <span class="token operator">=</span> <span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> input<span class="token punctuation">)</span>
    <span class="token keyword">const</span> graph <span class="token operator">=</span> <span class="token function">createGraph</span><span class="token punctuation">(</span>entry<span class="token punctuation">,</span> options<span class="token punctuation">)</span>
    <span class="token keyword">const</span> data <span class="token operator">=</span> graph<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">asset<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">chunkId</span><span class="token operator">:</span> asset<span class="token punctuation">.</span>filePath<span class="token punctuation">,</span>
            <span class="token literal-property property">code</span><span class="token operator">:</span> asset<span class="token punctuation">.</span>code<span class="token punctuation">,</span>
            <span class="token literal-property property">mapping</span><span class="token operator">:</span> asset<span class="token punctuation">.</span>mapping<span class="token punctuation">,</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">let</span> code <span class="token operator">=</span> <span class="token function">render</span><span class="token punctuation">(</span>template<span class="token punctuation">,</span> <span class="token punctuation">{</span>data<span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">const</span> context <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token function">changeCode</span><span class="token punctuation">(</span><span class="token parameter">newCode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            code <span class="token operator">=</span> newCode
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token function">getCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> code<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    hooks<span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>context<span class="token punctuation">)</span>

    <span class="token function">ensureDir</span><span class="token punctuation">(</span><span class="token function">dirname</span><span class="token punctuation">(</span>output<span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token function">writeFileSync</span><span class="token punctuation">(</span>output<span class="token punctuation">,</span> code<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">ensureDir</span><span class="token punctuation">(</span><span class="token parameter">path</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> dirPath <span class="token operator">=</span> <span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> path<span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">existsSync</span><span class="token punctuation">(</span>dirPath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> dirPath<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token function">mkdirSync</span><span class="token punctuation">(</span>dirPath<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">input</span><span class="token operator">:</span> <span class="token string">&#39;./src/main.js&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">output</span><span class="token operator">:</span> <span class="token string">&#39;./dist/bundle.js&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\\.json$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
            <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span>
                jsonLoader
            <span class="token punctuation">]</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token keyword">new</span> <span class="token class-name">MyPlugin</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-ejs line-numbers-mode" data-ext="ejs"><pre class="language-ejs"><code>(() =&gt; {
    const __webpack_modules__ = [
        <span class="token ejs language-ejs"><span class="token delimiter punctuation">&lt;%</span><span class="token language-javascript"> data<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">info</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span> </span><span class="token delimiter punctuation">%&gt;</span></span>
            [(module, exports, require) =&gt; {
                <span class="token ejs language-ejs"><span class="token delimiter punctuation">&lt;%-</span><span class="token language-javascript"> info<span class="token punctuation">.</span>code </span><span class="token delimiter punctuation">%&gt;</span></span>
            }, <span class="token ejs language-ejs"><span class="token delimiter punctuation">&lt;%-</span><span class="token language-javascript"> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>info<span class="token punctuation">.</span>mapping<span class="token punctuation">)</span> </span><span class="token delimiter punctuation">%&gt;</span></span>],
        <span class="token ejs language-ejs"><span class="token delimiter punctuation">&lt;%</span><span class="token language-javascript"> <span class="token punctuation">}</span><span class="token punctuation">)</span> </span><span class="token delimiter punctuation">%&gt;</span></span>
    ]
    const cacheModules = {}

    const __webpack_require__ = (chunkId) =&gt; {
        
        const chunkModule = cacheModules[chunkId]
        if (chunkModule) {
            return chunkModule
        }
        const [fn, mapping] = __webpack_modules__[chunkId]
        const localRequire = (filePath) =&gt; {
            const id = mapping[filePath]
            return __webpack_require__(id)
        }
        const __webpack_exports__ = {}
        fn(__webpack_modules__, __webpack_exports__, localRequire)
        return __webpack_exports__
    }

    __webpack_require__(0)
})()
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> __webpack_modules__ <span class="token operator">=</span> <span class="token punctuation">[</span>
        <span class="token punctuation">[</span><span class="token punctuation">(</span><span class="token parameter">module<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> require</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token string">&quot;use strict&quot;</span><span class="token punctuation">;</span>
            <span class="token keyword">var</span> _foo <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;foo.js&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> _foo<span class="token punctuation">.</span>foo<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;main.js&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token string-property property">&quot;foo.js&quot;</span><span class="token operator">:</span><span class="token number">1</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">[</span><span class="token punctuation">(</span><span class="token parameter">module<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> require</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token string">&quot;use strict&quot;</span><span class="token punctuation">;</span>
            Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>exports<span class="token punctuation">,</span> <span class="token string">&quot;__esModule&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
                <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token boolean">true</span>
            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            exports<span class="token punctuation">.</span>foo <span class="token operator">=</span> foo<span class="token punctuation">;</span>

            <span class="token keyword">function</span> <span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;hello World&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span>
    <span class="token keyword">const</span> cacheModules <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token keyword">const</span> <span class="token function-variable function">__webpack_require__</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">chunkId</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> chunkModule <span class="token operator">=</span> cacheModules<span class="token punctuation">[</span>chunkId<span class="token punctuation">]</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>chunkModule<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> chunkModule
        <span class="token punctuation">}</span>
        <span class="token keyword">const</span> <span class="token punctuation">[</span>fn<span class="token punctuation">,</span> mapping<span class="token punctuation">]</span> <span class="token operator">=</span> __webpack_modules__<span class="token punctuation">[</span>chunkId<span class="token punctuation">]</span>
        <span class="token keyword">const</span> <span class="token function-variable function">localRequire</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">filePath</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> id <span class="token operator">=</span> mapping<span class="token punctuation">[</span>filePath<span class="token punctuation">]</span>
            <span class="token keyword">return</span> <span class="token function">__webpack_require__</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">const</span> __webpack_exports__ <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
        <span class="token function">fn</span><span class="token punctuation">(</span>__webpack_modules__<span class="token punctuation">,</span> __webpack_exports__<span class="token punctuation">,</span> localRequire<span class="token punctuation">)</span>
        <span class="token keyword">return</span> __webpack_exports__
    <span class="token punctuation">}</span>
    <span class="token function">__webpack_require__</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">MyPlugin</span> <span class="token punctuation">{</span>
    <span class="token function">apply</span><span class="token punctuation">(</span><span class="token parameter">compiler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;MyPlugin 启动&#39;</span><span class="token punctuation">)</span>

        compiler<span class="token punctuation">.</span>hooks<span class="token punctuation">.</span>emit<span class="token punctuation">.</span><span class="token function">tap</span><span class="token punctuation">(</span><span class="token string">&#39;MyPlugin&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">context</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token comment">// 可以理解为此次打包的上下文</span>
            <span class="token keyword">const</span> code <span class="token operator">=</span> context<span class="token punctuation">.</span><span class="token function">getCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;代码体积大小:&#39;</span><span class="token punctuation">,</span> code<span class="token punctuation">.</span>length<span class="token punctuation">)</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">jsonLoader</span><span class="token punctuation">(</span><span class="token parameter">source</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">addDeps</span><span class="token punctuation">(</span><span class="token string">&#39;jsonLoader&#39;</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">export default </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>source<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6);function v(m,b){const a=t("ExternalLinkIcon");return e(),o("div",null,[u,r,n("p",null,[n("a",k,[s("mini-webpack"),c(a)])]),d])}const f=p(l,[["render",v],["__file","005手写简单webpack.html.vue"]]);export{f as default};
