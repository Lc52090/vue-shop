const prodRlugins = []
if (process.env.NODE_ENV === 'production') {
  prodRlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的插件函数
    ...prodRlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
