import pluginVue from 'eslint-plugin-vue'
import eslint from '@eslint/js'
// ts-eslint解析器，使 eslint 可以解析 ts 语法
import tseslint from 'typescript-eslint'
// vue文件解析器
import vueParser from 'vue-eslint-parser'
export default tseslint.config({
  // tseslint.config添加了extends扁平函数，直接用。否则是eslint9.0版本是没有extends的
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/essential'] // vue3推荐的eslint配置
  ],
  languageOptions: {
    parser: vueParser, // 使用vue解析器，这个可以识别vue文件
    parserOptions: {
      parser: tseslint.parser, // 在vue文件上使用ts解析器
      sourceType: 'module'
    }
  },
  rules: {
    'semi': ['warn', 'never'],
    "comma-dangle": ["error", "never"],
    "no-unused-vars": 2,
    'space-before-function-paren': 0,
    'generator-star-spacing': 'off',
    'object-curly-spacing': 0, // 强制在大括号中使用一致的空格
    'array-bracket-spacing': 0 ,// 方括号
    // "@typescript-eslint/no-empty-object-type": "off",
    // "@typescript-eslint/no-explicit-any":"off"
  }
})
