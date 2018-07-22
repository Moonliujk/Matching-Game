// “__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './app/src/js/app_tmp.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/index_tmp.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "app/src/js"),
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: 'body'
    })
  ],
  devServer: {
    contentBase: "./public",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true//实时刷新
  }
};
