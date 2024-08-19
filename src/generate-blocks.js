const fs = require('fs');
const path = require('path');

// Define the directory you want to list sub-directories from
const directoryPath = path.join(__dirname, 'blocks');

// Function to get sub-directory names
const blockDirs = fs.readdirSync(directoryPath).filter(dir => {
  // Only include directories that are actual block directories
  return fs.statSync(path.join(directoryPath, dir)).isDirectory();
});

// Create the JSON structure
const blocksJson = {
  blocks: blockDirs
};

// Path to the output JSON file
const outputPath = path.resolve(__dirname, '../build/blocks/', 'blocks.json');

// Write JSON data to the file
fs.writeFileSync(outputPath, JSON.stringify(blocksJson, null, 2), 'utf-8');