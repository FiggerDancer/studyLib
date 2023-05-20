import { defaultTheme, defineUserConfig } from 'vuepress'
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance"
import { copyCodePlugin } from 'vuepress-plugin-copy-code2'
import { commentPlugin } from 'vuepress-plugin-comment2'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'


export default defineUserConfig({
    head: [
        ['link', { rel: 'icon', href: '/studyLib/assets/icon.jpeg' }],
    ],
    lang: 'zh-CN',
    title: '学习资源库',
    description: '一个用于学习的 VuePress 站点',
    base: '/studyLib/',
    markdown: {},
    // port: 8000,
    theme: defaultTheme({
        // docsDir: 'docs',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdatedText: '上次更新',
        contributorsText: '贡献者',
        tip: '提示',
        warning: '注意',
        danger: '警告',
        // 404 page
        notFound: [
            '这里什么都没有',
            '我们怎么到这来了？',
            '这是一个 404 页面',
            '看起来我们进入了错误的链接',
        ],
        backToHome: '返回首页',
        // a11y
        openInNewWindow: '在新窗口打开',
        toggleSidebar: '切换侧边栏',
        navbar: [ // 配置顶部导航栏
            {
                text: '首页',
                link: '/'
            },
            {
                text: '算法',
                link: '/algorithm/',
            },
        ],
        sidebar: { // 配置侧边栏部分
            "/algorithm/": [
                {
                    text: '引导',
                    link: '/algorithm/index.md',
                },
                '/algorithm/LinkList.md',
                '/algorithm/BinaryTree.md'
            ]
        },
    }),
    plugins: [
        docsearchPlugin({
            // 配置项
            appId: '<APP_ID>',
            apiKey: '<API_KEY>',
            indexName: '<INDEX_NAME>',
            locales: {
                '/': {
                placeholder: 'Search Documentation',
                translations: {
                    button: {
                    buttonText: 'Search Documentation',
                    },
                },
                },
                '/zh/': {
                placeholder: '搜索文档',
                translations: {
                    button: {
                    buttonText: '搜索文档',
                    },
                },
                },
            },
        }),
        copyCodePlugin({
            locales: {
                '/': {
                    copy: '复制代码成功',
                    hint: '复制代码'
                }
            }
        }),
        mdEnhancePlugin({
            container: true,
            tabs: true,
            codetabs: true,
            tasklist: true,
            demo: true,
            playground: {
                // 添加预设
                presets: [
                  "ts",
                  "vue",
                  {
                    name: "playground#language",
                    component: "PlaygroundComponent",
                    propsGetter: (
                      playgroundData,
                    ): Record<string, string> => ({
                      // 交互演示属性
                    }),
                  },
                ],
                // 设置内置预设 (可选)
                config: {
                  ts: {
                    // ...
                  },
                  vue: {
                    // ...
                  },
                },
            }
        }),
        commentPlugin({
            provider: 'Giscus',
            repo: 'FiggerDancer/studyLib',
            repoId: 'R_kgDOJlRgAw',
            category: 'General',
            categoryId: 'DIC_kwDOJlRgA84CWngm',
            mapping: 'pathname'
        })
    ],
})
