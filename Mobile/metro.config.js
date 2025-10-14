const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// ✅ Watch shared folder
config.watchFolders = [
  path.resolve(projectRoot, '../shared'),
];

// ✅ Resolver
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx'];

// ✅ Asset extensions
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'svg',
];

// ✅ THÊM PROXY - Force shared imports to use Mobile's node_modules
config.resolver.extraNodeModules = new Proxy(
  {
    '@shared': path.resolve(projectRoot, '../shared'),
    '@assets': path.resolve(projectRoot, '../shared/assets'),
  },
  {
    get: (target, name) => {
      // Nếu là alias @shared hoặc @assets, return đường dẫn đã định nghĩa
      if (target[name]) {
        return target[name];
      }
      
      // Các modules khác (react, react-native, ...) lấy từ Mobile/node_modules
      return path.join(projectRoot, 'node_modules', name);
    },
  }
);

module.exports = config;