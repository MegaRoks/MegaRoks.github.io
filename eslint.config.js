import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: ['node_modules/**', '.lighthouseci/**'],
    },
    js.configs.recommended,
    {
        files: ['src/js/**/*.js'],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            globals: globals.browser,
        },
        rules: {
            'no-console': 'error',
            eqeqeq: 'error',
            'prefer-const': 'error',
            'no-var': 'error',
        },
    },
    {
        files: ['tools/**/*.mjs', 'eslint.config.js'],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            globals: globals.node,
        },
    },
];
