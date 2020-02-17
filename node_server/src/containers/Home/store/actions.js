import axios from 'axios';
import  {CHNAGE_LIST} from './contants'

const changeList = list => ({
    type: CHNAGE_LIST,
    list
  });


export const getHomeList=()=>{
    return   (dispatch, getState, axiosInstance)=>{
    return axiosInstance.get('/toplist/detail').then((res)=>{
            const list=res.data.list;
            let describeList= list.map((item,index)=>{
               return {
                title: item.description,
               id:index
               }
           })
           describeList=describeList.splice(0,5)
           dispatch(changeList(describeList))
        
        })
 
    }

}