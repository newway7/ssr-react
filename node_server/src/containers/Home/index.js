import React,{Component} from 'react';
import { connect } from 'react-redux'
import {getHomeList} from './store/actions'

import Header from '../../components/Header'


class Home extends Component{

getList(){
    const {list}=this.props;
return list.map(item=> <div key={item.id}>{item.title}</div>)
}


    render(){
    return  <div>
        <Header />
        {this.getList()} 
  
        hello ! {this.props.name}
         <button onClick={()=>{alert('hello')}}>click</button>
        </div>   
    }
    componentDidMount(){
        if(!this.props.list.length){
            this.props.getHomeList() 
        }
     
    }
}



Home.loadData=(store)=>{
   
return store.dispatch(getHomeList())
 
}


const mapStateToProps =state=>({
    name:state.home.name,
    list:state.home.newsList
})

const mapDispatchToProps=dispatch=>({
    getHomeList(){
       dispatch(getHomeList());
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(Home);