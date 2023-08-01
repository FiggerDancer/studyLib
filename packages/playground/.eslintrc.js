const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
    parser: "vue-eslint-parser", // 解析 .vue 文件
    parserOptions: {
      parser: "@typescript-eslint/parser", // 解析 .ts 文件
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      }
    },
    globals: {
      NetBrowser: true,
    },
    plugins: [
        "eslint-plugin-vue",
        "@typescript-eslint"
    ],
    env: {
      browser: true,
      node: true,
      commonjs: true,
      es2022: true,
      worker: true,
      jquery: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:vue/vue3-recommended",
    ],
    rules: {
        "vue/comment-directive": "off", // 禁用行内注释 https://eslint.vuejs.org/rules/comment-directive.html
    }
})
