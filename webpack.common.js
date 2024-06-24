const  HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader/dist/index')
const  MiniCssExtractPlugin  = require( 'mini-css-extract-plugin');
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const smp = new SpeedMeasurePlugin();
const  paths = require('./path');
module.exports ={
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
    entry:{
        index:"./main.ts"
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js','.vue'],
        alias: {
          vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
    
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use:[
                    {
                      loader: 'babel-loader',
                      options: {
                        presets: [
                          '@babel/preset-env',
                           
                        ],
                        // 其他babel-loader选项
                      },
                    },
                  {
                    loader:'ts-loader',
                    options:{
                      appendTsSuffixTo: [/\.vue$/],
                    }
                  }
                ],
                exclude: /node_modules/,
              },

          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
          
            type: 'asset/resource', // 在webpack4 中使用 file-loader   直接将资源输出到指定的目录
            // type: 'asset/inline', // 在webpack5 中使用 url-loader
          },
          {
            test: /.(woff|woff2|eot|ttf|otf)$/i,
           
            type: 'asset/resource',
          },
          {
            test: /\.css$/,
         
            use: [
              // 将 JS 字符串生成为 style 节点
              MiniCssExtractPlugin.loader,
              // 将 CSS 转化成 CommonJS 模块
              'css-loader',
            ],
          },
          {
            test: /.(scss|sass)$/,
           
            use: [
              // 将 JS 字符串生成为 style 节点
              process.env.NODE_ENV === 'production'  
              ? MiniCssExtractPlugin.loader  
              : 'style-loader', 
              // 将 CSS 转化成 CommonJS 模块
               {
                 loader: 'css-loader',
                 options: {
                   modules: true,
                   importLoaders:2
                 },
               },
               {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      [
                        // postcss-preset-env 包含 autoprefixer
                        'postcss-preset-env',
                      ],
                    ],
                  },
                },
              },
              // 将 Sass 编译成 CSS
              'sass-loader',
            ],

          },
          {
            test:/\.vue$/,
           
            loader: 'vue-loader',
            options: {
             
                loaders: {
                  
                  // Since sass-loader (weebpack 5) is deprecated we need to also configure 'sass' loader
                  scss: 'vue-style-loader!css-loader!sass-loader',
                  // Since sass-loader (weebpack 5) is deprecated we need to also configure 'sass' loader
                  sass: 'vue-style-loader!css-loader!sass-loader'
                  // other vue-loader options go here
                }
                // 
            }
          }




        ],
      },


    plugins: [
        // 生成html，自动引入所有bundle
        new HtmlWebpackPlugin({
          template:'./index.html' //得挂在模板
        }),
        new VueLoaderPlugin(),
        new  MiniCssExtractPlugin({
          filename: 'css/[contenthash].css', //将css 文件提取出来 放在指定的文件夹下面
        }),
        new ProgressBarPlugin({
          format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
        })
      ],
    optimization:{
      minimize: true,// 压缩代码
      splitChunks:{ // 代码分割 将公共的模块提取出来  splitChunks 的条件是 模块来自于node_modules 或者说 是 模块之间共享
        cacheGroups:{ // 缓存我们的第三方库
          vendors:{
            test: /[\\/]node_modules[\\/]/,
            name:"vendors",
            priority: -10,
            chunks:'all'
          },
         
        }
      }
    }
}