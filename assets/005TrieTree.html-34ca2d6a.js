import{_ as n,o as s,c as a,e as p}from"./app-72993491.js";const e={},t=p(`<h1 id="前缀树" tabindex="-1"><a class="header-anchor" href="#前缀树" aria-hidden="true">#</a> 前缀树</h1><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">TrieNode</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 路过该字符的单词个数</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>pass <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token comment">// 以此字符为结尾的单词个数</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>end <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>nexts <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Trie</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>root <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">TrieNode</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token punctuation">}</span>

    <span class="token function">insert</span><span class="token punctuation">(</span><span class="token parameter">word</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>word <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">let</span> node <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>root
        <span class="token keyword">let</span> index <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> word<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            index <span class="token operator">=</span> word<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">-</span> <span class="token string">&#39;a&#39;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>nexts<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                node<span class="token punctuation">.</span>nexts<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">TrieNode</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token punctuation">}</span>
            node <span class="token operator">=</span> node<span class="token punctuation">.</span>nexts<span class="token punctuation">[</span>index<span class="token punctuation">]</span>
            node<span class="token punctuation">.</span>pass<span class="token operator">++</span>
        <span class="token punctuation">}</span>
        node<span class="token punctuation">.</span>end<span class="token operator">++</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">delete</span><span class="token punctuation">(</span>word<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">search</span><span class="token punctuation">(</span>word<span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">let</span> node <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>root
            <span class="token keyword">let</span> index <span class="token operator">=</span> <span class="token number">0</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> word<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                index <span class="token operator">=</span> word<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">-</span> <span class="token string">&#39;a&#39;</span>
                node <span class="token operator">=</span> node<span class="token punctuation">.</span>nexts<span class="token punctuation">[</span>index<span class="token punctuation">]</span>
                node<span class="token punctuation">.</span>pass<span class="token operator">--</span>
            <span class="token punctuation">}</span>
            node<span class="token punctuation">.</span>end<span class="token operator">--</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// word这个单词加入了多少次</span>
    <span class="token function">search</span><span class="token punctuation">(</span><span class="token parameter">word</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>word <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token number">0</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">let</span> node <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>root
        <span class="token keyword">let</span> index <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> word<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            index <span class="token operator">=</span> word<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">-</span> <span class="token string">&#39;a&#39;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">--</span>node<span class="token punctuation">.</span>nexts<span class="token punctuation">[</span>index<span class="token punctuation">]</span><span class="token punctuation">.</span>pass <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                node<span class="token punctuation">.</span>nexts<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">null</span>
                <span class="token comment">// 如果只有一个路过的要减的直接把这个减的一删除后面不用看了，都是这个单词的</span>
                <span class="token keyword">return</span>
            <span class="token punctuation">}</span>
            node <span class="token operator">=</span> node<span class="token punctuation">.</span>nexts<span class="token punctuation">[</span>index<span class="token punctuation">]</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> node<span class="token punctuation">.</span>end
    <span class="token punctuation">}</span>

    <span class="token comment">// 以此为前缀的单词数</span>
    <span class="token function">prefixNumber</span><span class="token punctuation">(</span><span class="token parameter">pre</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>pre <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token number">0</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">let</span> node <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>root
        <span class="token keyword">let</span> index <span class="token operator">=</span> <span class="token number">0</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> word<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            index <span class="token operator">=</span> word<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">-</span> <span class="token string">&#39;a&#39;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>nexts<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token number">0</span>
            <span class="token punctuation">}</span>
            node <span class="token operator">=</span> node<span class="token punctuation">.</span>nexts<span class="token punctuation">[</span>index<span class="token punctuation">]</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> node<span class="token punctuation">.</span>pass
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),o=[t];function c(l,i){return s(),a("div",null,o)}const r=n(e,[["render",c],["__file","005TrieTree.html.vue"]]);export{r as default};
