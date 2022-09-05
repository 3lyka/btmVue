module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true, // https://eslint.vuejs.org/user-guide/#compiler-macros-such-as-defineprops-and-defineemits-generate-no-undef-warnings
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    // console.log\console.error относятся к откладке и не должны попадать в production по умолчанию, кроме режима отладки.
    // ошибки могут логироваться в bug tracker, например sentry или показываться в интерфейсе.
    'no-console': 'off', // временно выключено
    'no-debugger': 'warn',

    '@typescript-eslint/no-unused-vars': ['warn', { args: 'after-used' }], // https://eslint.org/docs/rules/no-unused-vars#args
    '@typescript-eslint/no-empty-function': 'warn',

    'vue/multi-word-component-names': 'off',
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn',

    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};
