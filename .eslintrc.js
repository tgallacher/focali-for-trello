module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  parser: 'babel-eslint',
  plugins: ['react-hooks', 'typescript', 'prettier', 'import'],
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
