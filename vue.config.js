
const webpack = require('webpack')
const configArgv = JSON.parse(process.env.npm_config_argv)
const original = configArgv.original
const env = original[1] ? original[1].split(':')[1] : ''

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  productionSourceMap: false,
  // css相关配置
  css: {
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
    // css预设器配置项
    loaderOptions: {
      css: {},
      postcss: {
        // options here will be passed to postcss-loader
        plugins: [require('postcss-px2rem-exclude')({
          remUnit: 16,
          // muse-ui 组件变小
          exclude: /node_modules|folder_name/i
        })]
      }
    }
  },
  parallel: require('os').cpus().length > 1,
  'devServer': {
    'proxy': {
      '/api': {
        'target': 'http://www.weyeer.com',
        'changeOrigin': true,
        'pathRewrite': {
          '^/api': '/api'
        }
      }
    },
    before: app => {}
  },
  configureWebpack: config => {
    config.plugins.push(
      new webpack.DefinePlugin({
        ENV: JSON.stringify(env) }))
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: []
    }
  }
}
