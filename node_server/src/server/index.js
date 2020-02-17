

import express from 'express';
import {matchRoutes} from 'react-router-config'

import {render} from './utils.js'
import {getStore} from '../store'
import routes from '../Routes.js'

//增加如下代码	

import proxy from 'express-http-proxy';	




const app=express();
app.use(express.static('public'));



app.use('/toplist', proxy('http://api.mtnhao.com/toplist/detail'));

app.get('*', function (req,res){

const store=getStore();

const matchedRoutes=matchRoutes(routes,req.path);

const promises=[];
 matchedRoutes.forEach(item => {
   console.log(item.route.loadData)
  if(item.route.loadData){
  
promises.push(item.route.loadData(store))
  }
  Promise.all(promises).then(()=>{
    res.send(render(store, routes, req))
  })
 });




  
})

app.listen(3000);
console.log('app started at port 3000...');



// import Koa from 'koa';
// import Home from './containers/Home.js'
// import React from 'react';
// import { renderToString } from 'react-dom/server';



// import Router from 'koa-router';
// const app = new Koa();

// const content=renderToString(<Home />);
// let html =`    
// <!doctype html>
// <html>
// <head>
//   <title>hello</title>
// </head>
// <body>
//  ${content}
//  <script src="/test1.js"></script>
// </body>
// </html>`;

// const statics = require('koa-static')
// const path = require('path')
// const staticPath = './public'

// app.use(statics(
//   path.join(__dirname, staticPath)
// ))


// const router = new Router();
// router.get('/', async ( ctx,next )=>{
//     await next();
//     ctx.body = html
// })

// app.use(router.routes());


// app.listen(3000);
// console.log('app started at port 3000111...');





























