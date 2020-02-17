

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
    let context = { css: [] }
    res.send(render(store, routes, req,context))
  })
 });




  
})

app.listen(3000);
console.log('app started at port 3000...');



