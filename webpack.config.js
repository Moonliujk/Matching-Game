// “__dirname”是 node.js 中的一个全局变量，它指向当前执行脚本所在的目录
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'null',
  entry: path.resolve(__dirname, 'app/js/index.js'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name]-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg)$/i,
        use: {
          loader: 'file-loader',
          query : {
            name : '../img/[name].[ext]'
          }
        }
      },
      /*{
        test: /\.css$/,
        include: path.resolve(__dirname, "app/style"),
        use: ExtractTextPlugin.extract({
            fallback:"style-loader",
            use:"css-loader"
        })
      },*/
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, "app/style"),
        use: ExtractTextPlugin.extract({
            fallback:"style-loader",
            use:[{
                loader:"css-loader"
            },{
                loader: "postcss-loader"
            },{
                loader:"sass-loader"
            },]
        })
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: "app/index.temp.html",
      inject: 'body'
    }),
    new ExtractTextPlugin({
      filename: 'css/app.css'
    })
  ],
  devServer: {
    contentBase: "./public",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true//实时刷新
  }
};
