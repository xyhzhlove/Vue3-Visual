import pluginVue from "eslint-plugin-vue"
import eslint from "@eslint/js"
// ts-eslint解析器，使 eslint 可以解析 ts 语法
import tseslint from "typescript-eslint"
// vue文件解析器
import vueParser from "vue-eslint-parser"
export default tseslint.config({
  // tseslint.config添加了extends扁平函数，直接用。否则是eslint9.0版本是没有extends的
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/essential"], // vue3推荐的eslint配置
  ],
  languageOptions: {
    parser: vueParser, // 使用vue解析器，这个可以识别vue文件
    parserOptions: {
      parser: tseslint.parser, // 在vue文件上使用ts解析器
      sourceType: "module",
    },
  },
  rules: {
    "semi": ["warn", "never"],
    "no-unused-vars": 2,
    "space-before-function-paren": 0,
    "generator-star-spacing": "off",
    "array-bracket-spacing": 0,
    // 控制对象间的空格
    "key-spacing": ["error", { beforeColon: false,
      afterColon: true }],
    "object-curly-spacing": ["error", "always"],
    "quote-props": ["error", "consistent-as-needed"],
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "ignore",
      },
    ],
    "object-property-newline": [
      "error",
      { allowAllPropertiesOnSameLine: false },
    ],
    "object-shorthand": ["error", "methods"],
    // 控制空行数量
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1, // 最大连续空行数为 1
        maxEOF: 1, // 文件末尾的最大空行数为 1
        maxBOF: 0, // 文件开头的最大空行数为 0
      },
    ],
    // 控制缩进
    "indent": ["error", 2],
  },
})
