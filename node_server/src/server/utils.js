import React from 'react'
import { renderToString } from 'react-dom/server';
import { StaticRouter,Route,} from 'react-router-dom'; 
import {Provider} from 'react-redux'


export const render = (store,routes,req,context) => {
  console.log(routes)
  const content = renderToString((
    <Provider  store={store}>
        <StaticRouter location={req.path} context={context}>   
          {routes.map(route=>(
  
         <Route {...route}/>
  
         ))} 
 
        </StaticRouter>
    </Provider>
  ));
  const cssStr = context.css.length ? context.css.join('') : '';
  
  return `
      <html>
        <head>
        <style>${cssStr}</style>
        </head>
        <body>
          <div id="root">${content}</div>
       <script>
       window.context={
         state:${JSON.stringify(store.getState())}
       }
       </script>
          <script src="/index.js"></script>
        </body>
      </html>
    `

};