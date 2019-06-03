const merge = require('webpack-merge');
const projWebpack = require('../webpack.config');

/**
 * Take 'full control' over Storybook's webpack config setup.
 * @param {*} storybookBaseConfig Default Storybook webpack config
 * @param {string} configType 'DEVELOPMENT' or 'PRODUCTION' - PRODUCTION is set when
 *                            building the static version of storybook
 */
module.exports = ({ config, mode }) => {
  // Remove the default JS webpack rule
  config.module.rules.shift();

  // remove storybook's file-loader config so we can use our own
  config.module.rules = config.module.rules.filter(rule =>
    'loader' in rule ? !rule.loader.includes('file-loader/dist/cjs.js') : true,
  );

  // We don't need to parse the code entrypoint for Story book.
  // The relevant pieces will be manually imported within stories.
  delete projWebpack['entry'];

  return merge.smart(config, projWebpack);
};
