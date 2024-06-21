const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const  config = require('./path.js');
module.exports= merge(common,{
    
    output:{
        // bundle 文件名称
     filename: '[name].bundle.js',
     
     // bundle 文件路径
     path: config.resolveApp('dist'),
     
     // 编译前清除目录
     clean: true
 
     },
     mode:'production',
 
}) 