import { defaultTheme, defineUserConfig } from 'vuepress'
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance"
import { searchPlugin } from '@vuepress/plugin-search'
import { copyCodePlugin } from 'vuepress-plugin-copy-code2'
import { commentPlugin } from 'vuepress-plugin-comment2'
// import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { globSync } from 'glob'
import { statSync } from 'node:fs'

const getDirMds = (dirName: string) => {
    const pathList = globSync(`**/${dirName}/**.md`).map((filePath) => {
        const begin = filePath.indexOf(dirName)
        return filePath.slice(begin - 1).replaceAll('\\', '/')
    })
    return pathList.reverse();
}

const getDirNames = () => {
  const pathList = globSync([`./docs/**`]).filter((filePath) => {
    return statSync(filePath).isDirectory()
  }).map((filePath) => {
    const tokens = filePath.split('/')
    const name = tokens[tokens.length - 1]
    return name
  }).filter((name) => {
    return name !== 'docs'
  })
  return pathList
}

const AlgorithmMds = getDirMds('algorithm')
const LeetCodeMds = getDirMds('LeetCode')
const EngineeringMds  = getDirMds('engineering')

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
        contributors: false,
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
                link: AlgorithmMds[0],
            },
            {
                text: 'LeetCode',
                link: LeetCodeMds[0],
            },
            {
              text: '工程化',
              link: EngineeringMds[0]
            }
        ],
        sidebar: { // 配置侧边栏部分
            "/algorithm/": AlgorithmMds,
            '/LeetCode/': LeetCodeMds,
            '/engineering/': EngineeringMds,
        },
    }),
    plugins: [
        // docsearchPlugin({
        //     // 配置项
        //     appId: '<APP_ID>',
        //     apiKey: '<API_KEY>',
        //     indexName: '<INDEX_NAME>',
        //     locales: {
        //         '/': {
        //         placeholder: 'Search Documentation',
        //         translations: {
        //             button: {
        //             buttonText: 'Search Documentation',
        //             },
        //         },
        //         },
        //         '/zh/': {
        //         placeholder: '搜索文档',
        //         translations: {
        //             button: {
        //             buttonText: '搜索文档',
        //             },
        //         },
        //         },
        //     },
        // }),
        searchPlugin({
            locales: {
              '/': {
                placeholder: 'Search',
              },
              '/zh/': {
                placeholder: '搜索',
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
            sub: true,
            // 脚标
            footnote: true,
            // 标记
            mark: true,
            // 启用 figure
            figure: true,
            // 启用图片懒加载
            imgLazyload: true,
            // 启用图片标记
            imgMark: true,
            // 启用图片大小
            imgSize: true,
            // 启用 mermaid
            mermaid: true,
            // 使用 KaTeX 启用 TeX 支持
            katex: true,
            // 使用 mathjax 启用 TeX 支持
            mathjax: true,
            tasklist: true,
            demo: true,
            // 启用 vue 交互演示
            vuePlayground: true,
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
            },
            // 启用幻灯片
            presentation: true,
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
