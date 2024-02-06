import React, { Component } from 'react'
import AlienCard from "./AlienCard"
import './static/AlienPreview.css'
import Page from "./Page"
import MyWeb3 from './MyWeb3'
import {
    BrowserRouter as 
    Route,
    Link
  } from "react-router-dom"

class MyAlien extends Component {
    constructor(props) {
        super(props);
        this.state = {alienCount:"",aliens:[],alienName:'',transactionHash:'',buyAreaDisp:1,createAreaDisp:1,txHashDisp:0,inviteCode: this.extractCodeFromURL()}
        this.createAlien=this.createAlien.bind(this)
        this.buyAlien=this.buyAlien.bind(this)
        this.inputChange=this.inputChange.bind(this)
    }
 
    extractCodeFromURL() {
        const urlParts = window.location.href.split('/');
        if (urlParts.length >= 3) {
            const code = urlParts[2].split('?')[0];
            console.log("invitecode",code)
            return code;
        }
        return null; // 如果 URL 格式不正确，则返回 null
    }

    componentDidMount(){
        let that = this
        let ethereum = window.ethereum
        if (typeof  ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.myAliens()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
    
    myAliens(){
        let that = this
        MyWeb3.getAliensByOwner().then(function(aliens){
            if(aliens.length > 0){
                for(let i=0;i<aliens.length;i++){
                    MyWeb3.aliens(aliens[i]).then(function (result) {
                        let _aliens = that.state.aliens
                        result.alienId = aliens[i]
                        _aliens.push(result);
                        that.setState({aliens:_aliens})
                    })
                }
            }
        })
    }
    createAlien(){
        let that = this
        let _name = this.state.alienName
        let _inviteCode = this.state.inviteCode; // 获取邀请码
        MyWeb3.createAlien(_name,_inviteCode).then(function(transactionHash){
            that.setState({
                transactionHash:transactionHash,
                createAreaDisp:0,
                txHashDisp:1
            })
        })
    }
    buyAlien(){
        let that = this
        let _name = this.state.alienName
        MyWeb3.buyAlien(_name).then(function(transactionHash){
            that.setState({
                transactionHash:transactionHash,
                buyAreaDisp:0,
                txHashDisp:1
            })
        })
    }
    inputChange(){
        this.setState({
            alienName:this.input.value
        })
    }
    
    render() {
        if(this.state.aliens.length>0) {
            return ( 
                <div className="cards">
                    {this.state.aliens.map((item,index)=>{
                        var name = item.name
                        var level = item.level
                        return(
                            <Link to={`?AlienDetail&id=`+item.alienId} key={index}>
                                <AlienCard alien={item} name={name} level={level} key={index}></AlienCard>
                            </Link>
                        )
                    })}
                    <Route path="*" component={Page}></Route>
                    <div className='buyArea' display={this.state.buyAreaDisp}>
                        <div className='alienInput'>
                            <input 
                                type="text" 
                                id='alienName' 
                                placeholder='NAME IT' 
                                ref={(input)=>{this.input=input}} 
                                value={this.state.alienName}
                                onChange={this.inputChange}>
                            </input>
                        </div>
                        <div>
                            <button className="attack-btn" onClick={this.buyAlien}>
                                <span>
                                    BUY ALIEN   
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className='transactionHash' display={this.state.txHashDisp}>{this.state.transactionHash}<br></br>waiting...</div>
                </div>
            )
        }else{
            return(<div>
                <div className='createArea' display={this.state.createAreaDisp}>
                    <div className='alienInput'>
                        <input 
                            type="text" 
                            id='alienName' 
                            placeholder='NAME IT' 
                            ref={(input)=>{this.input=input}} 
                            value={this.state.alienName}
                            onChange={this.inputChange}>
                        </input>
                    </div>
                    <div>
                        <button className="attack-btn" onClick={this.createAlien}>
                            <span>
                            ADOPT A ALIEN FREE   
                            </span>
                        </button>
                    </div>
                </div>
                <div className='transactionHash' display={this.state.txHashDisp}>{this.state.transactionHash}<br></br>waiting...</div>
            </div>)
        }
    }
}  
export default MyAlien;
