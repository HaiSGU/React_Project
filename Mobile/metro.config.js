const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

//  Thêm shared folder vào watchFolders
config.watchFolders = [
  path.resolve(__dirname, '../shared'),
];

// Resolver
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx'];

config.resolver.extraNodeModules = {
  '@shared': path.resolve(__dirname, '../shared'),
  '@assets': path.resolve(__dirname, '../shared/assets'), // ✅ Trỏ đến shared/assets
};

// Thêm assetExts để Metro nhận diện file ảnh
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'svg',
];

module.exports = config;