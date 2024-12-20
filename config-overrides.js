const webpack = require('webpack')

module.exports = function override (config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    vm: require.resolve('vm-browserify')
  }

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ])

  // console.log(JSON.stringify(config, null, 2));

  return config
}
