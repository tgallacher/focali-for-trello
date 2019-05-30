module.exports = {
  presets: [
    ['@babel/preset-env', {
      // debug: process.env.NODE_ENV !== 'production',
      shippedProposals: true,
      useBuiltIns: 'usage',
      modules: false,
      corejs: 3,
    }],
    '@babel/preset-react',
    ['@babel/preset-typescript', {
      allExtensions: true,
      isTSX: true,
    }],
  ],
  plugins: [
    'babel-plugin-emotion',
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    ['babel-plugin-module-resolver', {
      root: ['./src'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }],
  ],
  env: {
    development: {
      plugins: [
        ['babel-plugin-emotion', { sourceMap: true, autoLabel: true }],
      ],
    },
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: 'current',
          },
        }],
      ],
    },
  },
};
