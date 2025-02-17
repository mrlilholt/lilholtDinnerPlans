const withTM = require('next-transpile-modules')([
  'react-native-calendars',
  'react-native-swipe-gestures',
]);

module.exports = withTM({
  webpack: (config, options) => {
    // Alias react-native to react-native-web
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native': 'react-native-web',
    };

    // Force babel-loader to transpile react-native-calendars
    config.module.rules.push({
      test: /\.[jt]sx?$/,
      include: /node_modules\/react-native-calendars/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    });
    
    // Force babel-loader to transpile react-native-swipe-gestures
    config.module.rules.push({
      test: /\.[jt]sx?$/,
      include: /node_modules\/react-native-swipe-gestures/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    });

    return config;
  },
});