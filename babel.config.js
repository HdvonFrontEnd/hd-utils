module.exports = function(api) {
  api.cache(true)
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          'useBuiltIns': 'entry'
        }
      ]
    ],
    'plugins': ['dynamic-import-node'],
    env: {
      'test': {
        // 'plugins': ['istanbul'] // 注释掉这个插件，解决使用istanbul-instrumenter-loader处理js的时候报错的问题
      }
    },
    babelrcRoots: [
      '.',
      'packages/*'
    ]
  }
}
