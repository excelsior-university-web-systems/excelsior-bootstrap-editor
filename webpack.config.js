const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const fs = require('fs');

// Path to the blocks directory
const blocksDir = path.resolve(__dirname, 'src/blocks');

// Dynamically generate entries for each block
const blockEntries = fs.readdirSync(blocksDir).reduce((entries, dir) => {
    const fullPath = path.resolve(blocksDir, dir, 'index.js');
    if (fs.existsSync(fullPath)) {
        entries[`blocks/${dir}`] = fullPath;
    }
    return entries;
}, {});

// Add other static entry points if necessary
const otherEntries = {
    'icons': './src/icons/index.js'
};

// Merge dynamic and static entries
const entry = {
    ...blockEntries,
    ...otherEntries
};

module.exports = {
    ...defaultConfig,
    entry: entry,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name]/index.js',  // Output to the respective directories in the build folder
    },
};
