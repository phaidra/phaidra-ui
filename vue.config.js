const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  pluginOptions: {
    ssr: {
      defaultTitle: 'phaidra-ui-ssr',
      favicon: './static/favicon.ico',
    }
  },
  transpileDependencies: [
    'phaidra-vue-components'
  ],
  configureWebpack: {
    /*
    plugins: [
      new ExtractTextPlugin({ filename: 'common.[chunkhash].css' })
    ],
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            extractCSS: isProduction
          }
        }
      ]
    },
    */
    resolve: {
      // Using 'npm link' to symlink the PVC library may cause webpack issues
      // like: Cannot assign to read only property 'exports' of object '#<Object>'
      // See https://github.com/vuejs/vue-cli/issues/2675
      symlinks: false,

      // Aliases for common libs ensure that we don't bundle them multiple times
      // (otherwise PVC would include them too)
      alias: {
        vue: path.resolve(path.join(__dirname, 'node_modules', 'vue')),
        vuetify: path.resolve(path.join(__dirname, 'node_modules', 'vuetify'))
      }
    },
    externals: {
      moment: 'moment'
    }
  }
}
