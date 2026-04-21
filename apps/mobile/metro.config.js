const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the monorepo packages so Metro can resolve workspace symlinks
config.watchFolders = [workspaceRoot];

// Ensure Metro resolves node_modules from the workspace root too
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Fix: Node.js v24 on Windows — paths with ':' are invalid (e.g. node:sea, node:buffer)
// Metro tries to mkdir these paths and fails. Return empty module instead.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('node:')) {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
