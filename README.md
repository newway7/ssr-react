## 服务端渲染之安装篇
### webpack 安装：
cnpm i webpack webpack-cli -S
因为需要在node.js下运行编译所以还需要安装 webpack-node-externals

webpack在浏览器端编译和在node环境下打包编译有一些区别，比如核心模块path在node环境下是不会被打包进去的

### babel安装篇
babel更新换代比较快，之前学到的知识分分钟过时了，比如stage-x；

每次安装babel都有点头疼，分分钟依赖包就不兼容报错了。
cnpm i babel-loader babel-loader @babel/preset-env -S
因为@babel/preset-env已经不支持stage-x，所以你如果想要同样的效果就直接安装

[
                    "@babel/plugin-proposal-function-bind",
                    "@babel/plugin-proposal-class-properties",
                   
]

                  之类的，然后放在module.rules 的匹配到js中的options.plugins中，（插件？）
babel这样还不够，会报错‘ReferenceError: regeneratorRuntime is not defined’

所以需要安装babel-polyfill，并在入口文件中引入：require("babel-polyfill");

对的，就直接这么写。

## github提交篇踩坑
如果你先git add . 看到报错才想起来需要忽略node_modules文件夹，恭喜你，你又踩坑了！
原因是.gitignore不能忽略已经被track的文件或者文件夹，哪怕你add报错了。
碰到这种情况：


git rm -r --cached .  #清除缓存

git add .

git commit -m "update .gitignore"

git push -u origin master 

在.gitignore  设置了**/node_modules/，忽略子目录下的node_modules。



鉴于每次都需要git add . git commit '' 等等

所以，创建一个sh脚本运行吧：

## 使用sh脚本


var=`date "+%Y-%m-%d-%H-%M-%S"`
echo $var

#1.
git init

#2.
git add .

#3.
git commit -m $var



#4.
git push -u origin master

然后运行 sh github.sh


### 关于ssr服务端渲染初入门尝试
我看的教程是用express，但是我个人更喜欢koa，
顺便在这里复习一下这俩的区别吧

用法的话，这俩除了在路由方面有一些区别：
#### 比如：koa是
import Router from 'koa-router'; 是一个专门的模块；

const router = new Router();
router.get('/', async ( ctx,next )=>{
    await next();
    ctx.body = html
  })
app.use(router.routes());

####  express在路由上的用法：
  const router = express.Router()
router.get('/api/test1', async(req, res, next) => { console.log('I am the router middleware => /api/test1') res.status(200).send('hello') })


app.use('/', router)

还有引入koa需要实例化，但是express不需要。。
其他的，大同小异吧。

### 他们实现原理上：


function compose (middleware) { 
    if (!Array.isArray(middleware)) 
    throw new TypeError('Middleware stack must be an array!') 
    for (const fn of middleware) { 
        if (typeof fn !== 'function') 
        throw new TypeError('Middleware must be composed of functions!') 
    } 
    
        return function (context, next) { 
            // last called middleware # 
            let index = -1 
            return dispatch(0) 
            function dispatch (i) { 
                if (i <= index) 
                return Promise.reject(new Error('next() called multiple times')) 
                index = i 
                let fn = middleware[i] 
                if (i === middleware.length) 
                fn = next if (!fn) return Promise.resolve() 
                try { 
                    return Promise.resolve(fn(context, dispatch.bind(null, i + 1))); 
                } catch (err) { 
                return Promise.reject(err) 
                } 
                
            } 
        } 
}


这个逻辑很简单，middleware是一个数组，存放中间件，调用的时候其实是利用闭包和递归的性质，依次去调用存放的中间件；
express的中间件真的好复杂（主要是我懒得看），一堆api都可以添加中间件，并且底层貌似有两种实现方式。

#### Koa和express的区别：
我简单复制一下区别吧：
Koa 的中间件采用了洋葱圈模型，所有的请求在经过中间件的时候都会执行两次，能够非常方便的执行一些后置处理逻辑。
 Express 中，响应返回时代码执行并不会回到原来的中间件，此时我们需要通过监听 response.writeHead获得响应返回的时机；

 Express 使用 Node 约定的 "error-first 回调" 处理异常，并通过中间件传播。
Koa 通过同步方式编写异步代码，可以通过 try catch 处理异常，非常自然。




#### 关于Koa发送请求的响应信息：

踩了一个坑：

如果用中间件的形式：
app.use(async (ctx, next) => {
    await next();
    
        ctx.response.type = 'html'; // 指定返回类型为 html 类型
        ctx.response.body = 'this is about page <a href="/">Go Index Page</a>';

});

如果ctx.response.body发送的是一个完整的html，会报错，个人觉得是会把发送的信息放在body标签中，如果你发送信息中写html，body标签，会报错。

所以这个时候需要引入router：

const router = new Router();
router.get('/', async ( ctx,next )=>{
    await next();
    ctx.body = html
  })
  app.use(router.routes());

 ### 关于webpack打包的一个小小的优化点
 package.json配置：

  "scripts": {
    "dev": "npm-run-all --parallel dev:**",
    "dev:build": "webpack --config webpack.server.js --watch",
    "dev:start": "nodemon --watch build --exec node \"./build/bundle.js\""
  },

dev:build中监听模块，一旦有更改，重新打包执行；
dev:start 中监听打包后的文件夹的变化，一旦改变，重新开启服务器
dev 匹配dev开头的命令，并行执行，所以只要执行npm run dev就可以'热更新'了，当然了，需要刷新浏览器（不是真正意义上的热更新）；

服务端渲染的关键点：
### 绑定事件

服务器只能提供页面html，对于绑定事件等，需要客户端渲染去完成。

### 关于后端框架问题，
我其实比较喜欢KOA，奈何遇到了一个解决了不了的问题，请求js文件报错。说找不到文件404，
。但是路径确实没有问题，如果发送简单的页面（不包含服务端渲染的代码）js可以正常获取到。
无奈之下换成了express框架。。就很顺畅地获取到了。我？？？有可能是踩了koa的某个坑。但是我不知道。

### 关于前端异步请求数据
由于我们把请求数据放在componentDidMount里面，服务端不执行这个数据，所以如果页面包含异步请求数据。需要靠服务端渲染去完成。
为了优化这一点。
需要先判断请求地址，然后获取该地址需要的ajax数据，等待数据获取完成之后，再返回给客户端html页面（这是一个异步操作）
但是这样又会存在一个问题，客户端会重新运行一遍打包后的代码，所以会出现，完整页面=》部分页面（componentDidMount之前）=>完整页面,
为了解决这个问题，服务端把ajax获取到的数据放在html页面中的script标签上（挂载在window上，客户端就可以直接获取到ajax数据）

这样会存在一个问题，就是请求数据会请求两遍，服务端一遍，客户端一遍，由于服务端渲染只渲染首屏，所以，客户端请求的时候，判断是否有数据就可以了。



