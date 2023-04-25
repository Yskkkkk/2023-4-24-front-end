const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  devServer: {
    port:8888,//修改前端应用的端口号（可以改为你想改的任意数字，不要与后端冲突就行）
    proxy: {
      // 配置代理，解决跨域问题
      '/api': {
        target: 'http://localhost:8080',  // 后端接口的基础 URL
        changeOrigin: true,  // 是否改变请求头中的 Origin 字段
        pathRewrite: {
          '^/api': ''  // 将请求路径中的 '/api' 替换为空字符串，去除 '/api' 前缀
        }
      }
    }
  }
});