//新建server/request.js	

import axios from 'axios'	

const instance = axios.create({	
    //http://api.mtnhao.com/toplist/detail
  baseURL: 'http://api.mtnhao.com'	

})	

export default instance	