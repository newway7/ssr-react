
import {createStore, applyMiddleware, combineReducers} from 'redux';	

import thunk from 'redux-thunk';	

import { reducer as homeReducer } from '../containers/Home/store';	

import clientAxios from '../client/request';	

import serverAxios from '../server/request';	

const reducer = combineReducers({	

  home: homeReducer	

})	

export const getStore = () => {	

  //让thunk中间件带上serverAxios	

  return createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios)));	

}	

export const getClientStore = () => {	

  const defaultState = window.context.state;	

   //让thunk中间件带上clientAxios	

  return createStore(reducer, defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)));	

}

  
  
