module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  plugins: ['react-hooks', 'typescript', 'prettier', 'import', 'react'],
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
  },
  settings: {
    'extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/resolver': {
      'babel-module': {},
      'node': {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    ISPRODUCTION: false,
  },
  rules: {
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
      },
    ],
    'import/no-useless-path-segments': ['off', { noUselessIndex: false }],
    'import/no-extraneous-dependencies': ['error', { peerDependencies: true }],
    'prettier/prettier': 'error',
    'no-confusing-arrow': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'react/require-default-props': 'warn',
    'react/jsx-one-expression-per-line': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'typescript/adjacent-overload-signatures': 'error',
    'typescript/class-name-casing': 'error',
    'typescript/explicit-member-accessibility': 'off',
    'typescript/interface-name-prefix': 'off',
    'typescript/no-angle-bracket-type-assertion': 'error',
    'typescript/no-array-constructor': 'error',
    'typescript/no-empty-interface': 'error',
    'typescript/no-inferrable-types': 'error',
    'typescript/no-namespace': 'error',
    'typescript/no-non-null-assertion': 'error',
    'typescript/no-parameter-properties': 'error',
    'typescript/no-triple-slash-reference': 'error',
    'typescript/no-unused-vars': 'error',
    'typescript/no-use-before-define': 'error',
    'typescript/type-annotation-spacing': 'error',
    'typescript/explicit-function-return-type': [
      'warn',
      { allowExpressions: true },
    ],
    'typescript/member-delimiter-style': [
      'error',
      { delimiter: 'semi', requireLast: true, ignoreSingleLine: false },
    ],
    'typescript/member-naming': ['error', { private: '^_' }],
  },
  overrides: [
    {
      files: ['./babel.config.js', './webpack.config.js'],
      env: {
        node: true,
      },
    },
  ],
};
