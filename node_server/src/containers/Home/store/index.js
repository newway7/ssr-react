
import  {CHNAGE_LIST} from './contants'





const defaultState= {
    newsList:[],
    name:'Sara'
}


export  const reducer= (state=defaultState,action)=>{
switch(action.type){
    case CHNAGE_LIST:
        return {
            ...state,
            newsList:action.list
        }
    default:
        return state;
}
}