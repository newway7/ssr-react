import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";

import { Provider } from "react-redux";
import { renderRoutes } from 'react-router-config';
import routes from "../Routes";

import {getClientStore} from "../store";

const App = () => {
  return (
    <Provider store={getClientStore()}>
      <BrowserRouter>
       
          {routes.map(route => (
            <Route {...route} />
          ))} 





       
      </BrowserRouter>
    </Provider>
  );
};

ReactDom.render(<App />, document.getElementById("root"));
