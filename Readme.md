#### 动态导入

 import().then(res=>{}) ///动态导入

#### 缓存

  1.hash缓存
    利用contentHash 内容不便 hash值不便的原则进行缓存。
  2.利用optizimation.splitChunks.cacheGroups进行缓存(推荐)。

### 公共路径

    ```js
    publicPath:""，//当你不清楚publicPath时 你可以设置成auto webpack 会自动的根据import.meta.url，document.currentScript.src,script.src,window.location.origin 来设置
  
    plugins:[
      new webpack.DefinePlugin({  //安全的使用环境变量
        'process.env':{
          NODE_ENV:"production"
        }
      })
    ]
    ```

### 环境变量

    ```js
    plugins:[
      new webpack.DefinePlugin({
        'process.env':{
          NODE_ENV:"production"
        }
      })
    ]
    ```

### 抽离公共代码

```js
    optimization:{
        splitChunks:{  //默认抽离的是node_modules下的代码和 公用的代码
            chunks:"all",
            cacheGroups:{
                vendors:{
                    name:"vendors",
                    priority:1,
                        test:/[\\/]node_modules[\\/]/,
                        minSize:0,
                        minChunks:1,
                        enforce:true
                },
                default:{
                    name:"common",
                    priority:0,
                    minSize:0,
                    minChunks:2,
                    enforce:true
                }
            }
        }
    }
```

### 懒加载

```js
    import(/*webpackChunkName:"index"*/"./index").then(res=>{})
```

### 预加载

```js

    import(/*webpackChunkName:"index"*/"./index").then(res=>{})
    import(/*webpackPrefetch:true*/"./index").then(res=>{})
```

## 高级应用

#### devServer

   ```js
   devServer：{
       port:8080,
          open:true,
          hot:true,//开启热更新
          hotOnly:true, //更新失败后是否 重新刷新
          compress:true, //是否开启gzip压缩
          historyApiFallback:true, //解决单页面刷新问题
          liverReload:true,
          // https:true,//开启https 
        
          headers:{
            //请求头部添加标识
              "X-Custom-Header":"yes"
          },
          
  

          proxy:{//解决跨域问题
              "/api":{
                  target:"http://localhost:3000",
                  pathRewrite:{
                      "^/api":""
                  }
              }
          }
      }
   ```

#### 热更新

   ```js
   if(module.hot){
       module.hot.accept("./index.js",()=>{
           console.log("index.js更新了")
       })
   }
   ```

#### webpack模块和解析原理

 webpack天生支持的模块有 ECMAScript模块,commonjs模块 AMD模块,assets模块,WebAssemly模块
 webpack打包编译的过程其实可以理解成一个promise的过程状态分为打包前 打包中 打包后，每次打包都会创建一个compiler的对象。 所有的模块解析 都是通过compiler对象的Resolvers属性来完成的 Resolvers模块解析 是基于enhanced-resolve这个包 实现的。

##### webpack的模块解析规则

1.绝对路径
 绝对路径的话webpack 会直接使用这个路径，不会进行任何的解析
2.相对路径
  相对路径webpack会先将相对路径转换成绝对路径，然后在进行模块解析

  ```js
   //使用resolve 将相对路径解析成绝对路径
   path.resolve(__dirname,"./index.js") 
  ```

3.模块路径
  模块路径也就是我们配置的resolve.modules属性，webpack会先将模块路径转换成绝对路径，然后在进行模块解析 默认模块路径是node_modules 我们可以通过resolve.alias来修改模块路径

  ```js
   resolve.alias:{
       "@":path.resolve(__dirname,"./src")
   }
  ```

  模块路径的优先级高于别名路径

##### resolve

在resolve中设置如何被解析

```js
resolve: {
alias: { //定义别名
"@utils": path.resolve(__dirname, 'src/utils/')
},
extensions: ['.js', '.json', '.wasm'] //设置解析文件的规则 
modules: [path.resolve(__dirname, 'src'), 'node_modules'] //设置模块的查找路径
}
```

##### 外部扩展

我们将第三方库抽离或者将自己的库抽离出来通过externals属性来设置

```js
externals: {
  lodash: {
    commonjs: 'lodash',
    commonjs2: 'lodash',
    amd: 'lodash',
    root: '_'
  }
}
然后再index.html 中通过cdn 或者其他外链的方式将 第三方库引入 以减少打包中的包体积
```

##### 打包分析

    ```js
    npm install webpack-bundle-analyzer -D
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    plugins:[
        new BundleAnalyzerPlugin()
    ]
    ```

#### 扩展功能

##### PostCSS和css 模块

 postcss 是通过js工具将转换css代码的工具 可以通过postcss为css添加浏览器前缀,解析嵌套语法等

 ```js
   npm install postcss-loader postcss-preset-env -D
   module:{
       rules:[
           {
               test:/\.css$/,
               use:[
                   "style-loader",
                   "css-loader",
                   "postcss-loader"
                  
               ]
           }
       ]
   }

   // postcss.config.js
  module.exports = {
plugins: [
require('autoprefixer'),//自动添加 浏览器的兼容前缀
require('postcss-nested') //提供编写嵌套的样式语法
]
}

//解决多人开发环境下的样式冲突
module:{
  rules:[
           {
               test:/\.css$/,
               use:[
                   "style-loader",
                    {
                        loader:"css-loader",
                        options:{
                            modules:true //开启css 模块化
                             localIdentName: "[local]--[hash:base64:5]",//设置css 模块化 的命名规则
                        }
                    },
                   "postcss-loader"
                  
               ]
                    },
                   "postcss-loader"
                  
               ]
           }
       ]
}


```
#### tree-shaking

tree-shaking 是一种通过消除多余代码，减小代码体积，提高程序性能的技术。
但tree-shaking不是对于所有的文件都有效果 如一下的文件就没有效果
```js
import {add} from './math.js'
import {add as add2} from './math.js'
console.log(add(1,2))
console.log(add2(1,2))
```
因此我们可以通过设置再 package.json 中设置sideEffects的方式 进行开始或者关闭以及制定list 外的文件进行tree-shaking
```js
sideEffects:false //默认值
sideEffects:true //开启所有文件的tree-shaking
sideEffects:['*.css'] //开启所有css文件的tree-shaking
sideEffects:['*.css','./dir'] //开启所有css文件的tree-shaking 以及./dir 下的所有文件
```

#### shimming 预置依赖

shimming 是指在代码中预置一些依赖，以便在代码运行时能够正常使用这些依赖。
 ###### shimming 预置全局变量
 通常我们使用第三方的库或者使用一些垫片的时候 并不是针对于全部的情况,而是针对于某个环境,因此我们需要预置全局变量
 例如我们使用jquery的时候,我们并不需要在每个文件中都引入jquery,只需要在入口文件中引入jquery即可,然后通过window.jQuery来使用jquery
 因此我们可以通过设置webpack.ProvidePlugin来预置全局变量
 ```js
   //webpack.config.js
   const webpack = require('webpack')
   module.exports = {
       plugins:[
           new webpack.ProvidePlugin({
               $:"jquery",
               join: ['lodash', 'join'], //按需引入 某些包中特定的模块 其余的模块则通过tree-shaking进行删除
            })
            ]
    }
```
    

         
   
   当文件中使用了预设值的全局变量后 webpack才会将package 构建到使用它的模块中。
#### 模块联邦


