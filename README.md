# Todos 
使用 NEJ 开发 Todo 应用
就跟 http://todomvc.com/examples/backbone/ 这个一样

nej打包版在pub文件夹下

使用<em>npm install</em>安装server所需的相关依赖

项目使用<i>mongoDB<i>，可以随意定义一个存储位置。

开启服务器：
```linux
  node ./server/app 
```
然后在浏览器中输入 http://localhost:8080/html/app.html 

项目运行完成，若要浏览打包完成版本，请修改express静态资源位置至./pub

实现思路简介：
显示和数据交互分离，这种形式的应用，若每次都需要等待服务器的响应，则会造成不必要的延迟（点个完成的checkbox也要等上几秒是不是感觉要疯了），所以将显示和ajax请求分离，将用户的每一次操作记录下来，使用一个内部循环的操作记录栈来定时与服务端交互，批量处理一段时间的操作。基本就是这样啦，还有一些细节，具体看stack.js文件
