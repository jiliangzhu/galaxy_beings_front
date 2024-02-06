import React, { Component } from 'react'
import AlienPreview from "./AlienPreview"
import './static/AlienPreview.css'
import MyWeb3 from './MyWeb3'
import moment from "moment"
import {
    BrowserRouter as 
    Route,
    Link
  } from "react-router-dom"
  import Page from "./Page";

class Aliendetail extends Component {
    constructor(props) {
        super(props)
        const searchParams = new URLSearchParams(window.location.search)
        
        const id = searchParams.get('id')   
        this.state = {
            id:id ,
            alien:{},owner:'',
            alienFeedTimes:0,
            myPrice:0,
            minPrice:0,
            shardBuyAmount:0,
            AttackBtn: () =>{return(<div></div>)}, 
            RenameArea: () =>{return(<div></div>)},
            alienNewname:'',
            FeedArea: () =>{return(<div></div>)},
            LevelupArea: () =>{return(<div></div>)},
            SaleArea: () =>{return(<div></div>)},
            BuyArea: () =>{return(<div></div>)},
            onShop:false,
            shopInfo:{}
        }
        this.alienChangeName = this.alienChangeName.bind(this)
        this.changeName = this.changeName.bind(this)
        this.feed = this.feed.bind(this)
        this.levelUp = this.levelUp.bind(this)
        this.saleAlien = this.saleAlien.bind(this)
        this.buyShopAlien = this.buyShopAlien.bind(this)
        this.setPrice = this.setPrice.bind(this)
        this.handleShardBuyAmountChange = this.handleShardBuyAmountChange.bind(this);
        this.buyShards = this.buyShards.bind(this);
        this.activateAlien = this.activateAlien.bind(this);
    }
    handleShardBuyAmountChange = (event) => {
        this.setState({ shardBuyAmount: event.target.value });
    }
    buyShards = () => {
        MyWeb3.buyShards(this.state.id, this.state.shardBuyAmount)
            .then((transactionHash) => {
                console.log('Transaction Hash:', transactionHash);
                // 处理成功的情况
            })
            .catch((error) => {
                console.error('Error:', error);
                // 处理错误的情况
            });
    }
    // 激活方法
    activateAlien() {
        MyWeb3.activateAlien(this.state.id)
            .then(transactionHash => {
                console.log('Alien activated:', transactionHash);
                // 可以在此处添加一些 UI 反馈，如状态更新或提示用户
            })
            .catch(error => {
                console.error('Activation failed:', error);
                // 处理错误，可能是用户拒绝交易或者合约执行错误
            });
    }

    componentDidMount(){
        let that = this
        let ethereum = window.ethereum
        if (typeof  ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.getAlien(that.state.id)
                that.getAlienFeedTimes(that.state.id)
                that.getMinPrice()
                that.getAlienShop(that.state.id)
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
    getAlienShop(alienId){
        let that = this
        MyWeb3.alienShop(alienId).then(function (shopInfo) {
            if(shopInfo.price>0){
                that.setState({onShop:true,shopInfo:shopInfo})
            }
        })
    }

    getMinPrice(){
        let that = this
        MyWeb3.minPrice().then(function (minPrice) {
            if(minPrice>0){
                that.setState({myPrice:parseFloat(minPrice),minPrice:parseFloat(minPrice)})
            }
        })
    }


    getAlienFeedTimes(alienId){
        let that = this
        MyWeb3.alienFeedTimes(alienId).then(function (result) {
            if(result>0){
                that.setState({alienFeedTimes:result})
            }
        })
    }

    
    setPrice(event){
        this.setState({
            myPrice:event.target.value
        })
    }
    alienChangeName(event){
        this.setState({
            alienNewname:event.target.value
        })
    }
    changeName(){
        let that = this
        if(window.defaultAccount !== undefined){
            MyWeb3.changeName(this.state.id,this.state.alienNewname)
            .then(function(transactionHash){
                that.setState({RenameArea : () =>{
                    return(<div>{transactionHash}</div>)
                    }
                })
            })
        }
    }
    feed(){
        let that = this
        if(window.defaultAccount !== undefined){
            MyWeb3.feed(this.state.id)
            .then(function(transactionHash){
                that.setState({FeedArea : () =>{
                    return(<div>{transactionHash}</div>)
                    }
                })
            })
        }
    }
    levelUp(){
        let that = this
        if(window.defaultAccount !== undefined){
            MyWeb3.levelUp(this.state.id)
            .then(function(transactionHash){
                that.setState({LevelupArea : () =>{
                    return(<div>{transactionHash}</div>)
                    }
                })
            })
        }
    }
    saleAlien(){
        let that = this
        if(window.defaultAccount !== undefined 
            && this.state.myPrice*this.state.minPrice>0 
            && this.state.myPrice>=this.state.minPrice){
            MyWeb3.saleMyAlien(this.state.id,this.state.myPrice)
            .then(function(transactionHash){
                that.setState({SaleArea : () =>{
                    return(<div>{transactionHash}</div>)
                    }
                })
            })
        }
    }

    buyShopAlien(){
        let that = this
        if(window.defaultAccount !== undefined){
            MyWeb3.buyShopAlien(this.state.id,this.state.shopInfo.price)
            .then(function(transactionHash){
                that.setState({BuyArea : () =>{
                    return(<div>{transactionHash}</div>)
                    }
                })
            })
        }
    }
    getAlien(alienId){
        let that = this
        MyWeb3.aliens(alienId).then(function (result) {
            that.setState({alien:result})
            that.setState({alienNewname:result.name})
            MyWeb3.alienToOwner(alienId).then(function (alienOwner) {
                that.setState({owner:alienOwner})
                if(window.defaultAccount !== undefined &&
                    alienOwner !== window.defaultAccount){
                    that.setState({AttackBtn : () =>{
                        return(
                        <button className="attack-btn">
                            <span>
                                <Link to={`?AlienAttack&id=`+that.state.id} >ATTACK</Link>
                            </span>
                        </button>)
                        }
                    })
                    if(that.state.onShop){
                        that.setState({BuyArea : () =>{
                            return(
                                <div>
                                    <div className='alienInput'>
                                        PRICE：{that.state.shopInfo.price} ether
                                    </div>
                                    <div>
                                        <button className="pay-btn pay-btn-last" onClick={that.buyShopAlien}>
                                            <span>
                                                BUY IT
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                )
                            }
                        })
                    }
                }else{
                    that.setState({AttackBtn : () =>{return(<div></div>)}})
                    if(that.state.alien.level > 1){
                        that.setState({RenameArea : () =>{
                            return(
                                <div>
                                    <div className='alienInput'>
                                        <input 
                                            type="text" 
                                            id='alienName' 
                                            placeholder={that.state.alien.name} 
                                            value={that.state.alienNewname}
                                            onChange={that.alienChangeName}>
                                        </input>
                                    </div>
                                    <div>
                                        <button className="pay-btn pay-btn-last" onClick={that.changeName}>
                                            <span>
                                                CHANGE NAME
                                            </span>
                                        </button>
                                    </div>
                                </div>)
                            }
                        })
                    }
                    if(that.state.alien.readyFeedTime === 0 || moment().format('X')>that.state.alien.readyFeedTime){
                        that.setState({FeedArea : () =>{
                            return(
                                <div>
                                    <button className="pay-btn" onClick={that.feed}>
                                        <span>
                                            FEEDING
                                        </span>
                                    </button>
                                </div>)
                            }
                        })
                    }
                    that.setState({LevelupArea : () =>{
                        return(
                            <div>
                                <button className="pay-btn" onClick={that.levelUp}>
                                    <span>
                                        UPGRADE
                                    </span>
                                </button>
                            </div>)
                        }
                    })
                    if(!that.state.onShop){
                        that.setState({SaleArea : () =>{
                            return(
                                <div>
                                    <div className='alienInput'>
                                        <input 
                                            type="text" 
                                            id='salePrice' 
                                            placeholder={that.state.minPrice} 
                                            value={that.state.myPrice}
                                            onChange={that.setPrice}>
                                        </input>
                                    </div>
                                    <div>
                                        <button className="pay-btn pay-btn-last" onClick={that.saleAlien}>
                                            <span>
                                                SELL IT 
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                )
                            }
                        })
                    }
                } 
            })
        })
    }

    render() { 
        var readyFeedTime = 'FEEDING COOLED DOWN'                                
        if(this.state.alien.readyFeedTime !== undefined && moment().format('X')<this.state.alien.readyFeedTime){
            readyFeedTime = moment(parseInt(this.state.alien.readyFeedTime)*1000).format('YYYY-MM-DD')
        }
        var readyAttackTime = 'ATTACK COOLED DOWN'                                
        if(this.state.alien.readyAttackTime !== undefined && moment().format('X')<this.state.alien.readyAttackTime){
            readyAttackTime = moment(parseInt(this.state.alien.readyAttackTime)*1000).format('YYYY-MM-DD')
        }
        var AttackBtn = this.state.AttackBtn
        var RenameArea = this.state.RenameArea
        var FeedArea = this.state.FeedArea
        var LevelupArea = this.state.LevelupArea
        var SaleArea = this.state.SaleArea
        var BuyArea = this.state.BuyArea
        const isMyAlien = this.state.owner === window.defaultAccount;
        const canActivate = this.state.alien.lossCount >= 10 && this.state.alien.shard >= 10;
        return ( 
            <div className="App">
                <div  className="row alien-parts-bin-component" authenticated="true" lesson="1" lessonidx="1">
                    
                    <div  className="alien-preview" id="alien-preview">
                        <div className="alien-char">
                            <div className="alien-loading alien-parts" style={{display:"none"}}></div>
                                <AlienPreview alien={this.state.alien}></AlienPreview>
                            <div className="hide">
                                <div className="card-header bg-dark hide-overflow-text">
                                    <strong ></strong></div>
                                <small className="hide-overflow-text">CryptoAlien</small>
                            </div>
                        </div>
                    </div>
                    <div className="alien-detail">
                        <dl>
                            <dt>{this.state.alien.name}</dt>
                            <dt>OWNER</dt>
                            <dd>{this.state.owner}</dd>
                            <dt>LEVEL</dt>
                            <dd>{this.state.alien.level}</dd>
                            <dt>VICTORY COUNT</dt>
                            <dd>{this.state.alien.winCount}</dd>
                            <dt>DEFEAT COUNT </dt>
                            <dd>{this.state.alien.lossCount}</dd>
                            <dt>FEEDING TIME</dt>
                            <dd>{readyFeedTime}</dd>
                            <dt>ATTACK TIME</dt>
                            <dd>{readyAttackTime}</dd>                            
                            <dt>FEEDING COUNT</dt>
                            <dd>{this.state.alienFeedTimes}</dd>
                            <dt>SHARD AMOUNT</dt>
                            <dd>{this.state.alien.shard}</dd>                        
                            <dt></dt>
                        </dl>
                            <div>
                                <AttackBtn></AttackBtn>
                                <RenameArea></RenameArea>
                                <FeedArea></FeedArea>
                                <LevelupArea></LevelupArea>
                                <SaleArea></SaleArea>
                                <BuyArea></BuyArea>
                                {isMyAlien && (
                                <div>
                                <div className='alienInput'>   
                                    <input 
                                            type="text" 
                                            id='shardAmount' 
                                            value={this.state.shardBuyAmount}
                                            onChange={this.handleShardBuyAmountChange} 
                                            placeholder="Enter ETH amount to buy shards" >
                                            
                                    </input>
                                </div>
                                <button className="pay-btn pay-btn-last" onClick={this.buyShards}>
                                    <span>
                                        BUY SHARD
                                    </span>
                                </button>
                                </div>
                                )}
                               {isMyAlien && canActivate &&(
                                <button className="pay-btn pay-btn-last" onClick={this.activateAlien}>
                                    <span>
                                        Activate Alien
                                    </span>
                                </button>
                               )}
                            </div>
                    </div>
                     <Route path="*" component={Page}></Route>
                </div>
            </div>
        );
    }
}

export default Aliendetail;