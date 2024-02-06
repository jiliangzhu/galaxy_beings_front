import React, { Component } from 'react';
import MyWeb3 from './MyWeb3'
import AlienCard from "./AlienCard";
import {
    BrowserRouter as 
    Route,
    Link
  } from "react-router-dom"
import Page from "./Page";

class AlienMarket extends Component {
    constructor(props) {
        super(props);
        this.state = {shopAliens:[]  }
    }
     
    componentDidMount(){
        //console.log(window.web3._extend.utils)
        let that = this
        let ethereum = window.ethereum
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.alienShop()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }

    alienShop(){
        let that = this
        MyWeb3.getShopAliens().then(function(alienIds){
            if(alienIds.length>0){
                for(var i=0;i<alienIds.length;i++){
                    let alienId = alienIds[i]
                    if(alienId>=0){
                        MyWeb3.aliens(alienId).then(function(aliens) {
                            let _shopAliens = that.state.shopAliens
                            aliens.alienId = alienId
                            _shopAliens.push(aliens);
                            that.setState({shopAliens:_shopAliens})
                        })
                    }
                }
            }
        })
    }
    
    render() { 
        if(this.state.shopAliens.length>0) {
            return ( 
                <div className="cards">
                    {this.state.shopAliens.map((item,index)=>{
                        var name = item.name
                        var level = item.level
                        return(
                            <Link to={`?AlienDetail&id=`+item.alienId} key={index}>
                                <AlienCard alien={item} name={name} level={level} key={index}></AlienCard>
                            </Link>
                        )
                    })}
                    <Route path="*" component={Page}></Route>
                </div> 
            )
        }else{
            return ( <div></div>)
        }
    }
}
 
export default AlienMarket;