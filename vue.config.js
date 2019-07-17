module.exports = {
  transpileDependencies: [
    'phaidra-vue-components'
  ],
  configureWebpack: {
    // Using 'npm link' to symlink the PVC library may cause webpack issues
    // like: Cannot assign to read only property 'exports' of object '#<Object>'
    // See https://github.com/vuejs/vue-cli/issues/2675
    resolve: {
      symlinks: false
    }
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  }
}
