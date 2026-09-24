import js from '@eslint/js'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default [
  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
  ]),

  js.configs.recommended,

  ...pluginVue.configs['flat/essential'],

  {
    name: 'app/browser-files',
    files: ['src/**/*.{vue,js,mjs,cjs}'],

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
]