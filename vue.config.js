const path = require('path')

module.exports = {
  transpileDependencies: [
    'phaidra-vue-components'
  ],
  configureWebpack: {
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
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
}
