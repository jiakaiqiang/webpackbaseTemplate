const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const fs = require('fs');



const path = require('path');
module.exports= merge(common,{
  
    output:{
       // bundle 文件名称
    filename: 'script/[name].bundle.js',
    
    // bundle 文件路径
    path: path.resolve( fs.realpathSync(process.cwd()), 'dist'),
    
    // 编译前清除目录
    clean: true,
    pathinfo: false // 去除打包文件中的注释

    },
    devtool: 'source-map',//快发环境开启 资源映射
    devServer: {
        hot: true,
        //热加载

        liveReload: true,
        //实时刷新
        // 告诉服务器从哪里提供内容，只有在你想要提供静态文件时才需要。
        static: {
            directory: path.join(__dirname, 'dist'),
          },
          compress: true,
          port: 9000,
      },
    mode:'development',
    devtool: 'eval-cheap-module-source-map',



})