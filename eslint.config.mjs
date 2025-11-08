// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default withNuxt(
  // Your custom configs here
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierRecommended.rules,
      'prettier/prettier': 'error',
    },
  },
);
