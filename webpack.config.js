const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const path = require('path');

// Add other static entry points if necessary
const entries = {
    'blocks': './src/blocks/index.js',
    'icons': './src/icons/index.js',
    'table': './src/table/index.js',
    'editor': './src/editor/index.js'
};

// Merge dynamic and static entries
const entry = {
    ...entries
};
module.exports = {
    ...defaultConfig,
    entry: entry,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name]/index.js',  // Output to the respective directories in the build folder
    },
    plugins: [
        ...defaultConfig.plugins,
        new WebpackShellPluginNext( {
            onBuildEnd: {
                scripts: [
                    'node src/generate-blocks.js'
                ],
                blocking: false,
                parallel: true
            }
        } )
    ]
};
