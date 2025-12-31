const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Restrict watchFolders to only the project directory
config.watchFolders = [path.resolve(projectRoot)];

// Block list to ignore problematic directories (Windows paths)
// Use a function to create the blockList with proper escaping
const escapedProjectRoot = projectRoot.replace(/\\/g, '/');
config.resolver = {
  ...config.resolver,
  blockList: [
    // Block Android Studio directories
    /.*[\\/]AppData[\\/]Local[\\/]Google[\\/]AndroidStudio.*/,
    // Block common system directories that might cause permission issues
    /.*[\\/]AppData[\\/]Local[\\/]Temp.*/,
    /.*[\\/]AppData[\\/]Roaming.*/,
  ],
};

// Set project root explicitly
config.projectRoot = projectRoot;

module.exports = config;

