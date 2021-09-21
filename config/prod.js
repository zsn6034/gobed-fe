/*
 * @Descripttion: 
 * @Author: zhuangshunan
 * @Date: 2021-08-22 16:12:18
 * @LastEditors: zhuangshunan
 * @LastEditTime: 2021-09-21 11:56:27
 */
module.exports = {
  env: {
    NODE_ENV: '"production"',
    HTTPS_HOST: '"https://guxiaobai.top"',
    HTTPS_PORT: 9998,
    HTTP_HOST: '"http://guxiaobai.top"',
    HTTP_PORT: 9999,
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  }
}
