import React, { Component } from 'react';
import MyWeb3 from './MyWeb3'
import AlienPreview from "./AlienPreview"
import './static/AlienPreview.css'
import moment from "moment"

class NewAlien extends Component {
    constructor(props) {
        super(props);
        const searchParams = new URLSearchParams(window.location.search)
        const id = searchParams.get('id')   
        this.state = {
            targetId:id ,
            targetAlien:{},
            myAliens:[],
            myAlien:{},
            myAlienId:'',
            active: {},
            buttonTxt:'',
            modalDisplay:'none',
            transactionHash:'',
            AttackBtn:()=>{
                return( <button className="attack-btn">
                            <span role="img" aria-label="alien">
                                CHOOSE ONE ALIEN ATTACK IT！
                            </span>
                        </button>
                )
            }
        }
        this.selectAlien = this.selectAlien.bind(this)
        this.alienAttack = this.alienAttack.bind(this)
    }
    componentDidMount(){
        let that = this
        let ethereum = window.ethereum
        if (typeof  ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.getAlien(that.state.targetId)
                that.getMyAliens()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
    
    getAlien(alienId){
        let that = this
        MyWeb3.aliens(alienId).then(function (result) {
            that.setState({targetAlien:result})
        })
    }
    getMyAliens(){
        let that = this
        MyWeb3.getAliensByOwner().then(function(aliens){
            if(aliens.length > 0){
                for(let i=0;i<aliens.length;i++){
                    MyWeb3.aliens(aliens[i]).then(function (result) {
                        let _aliens = that.state.myAliens
                        result.alienId = aliens[i]
                        if(result.readyAttackTime === 0 || moment().format('X')>result.readyAttackTime){
                            _aliens.push(result)
                        }
                        that.setState({myAliens:_aliens})
                    })
                }
            }
        })
    }
    selectAlien = index => {
        var _active = this.state.active
        var prev_active = _active[index]
        for(var i=0;i<this.state.myAliens.length;i++){
            _active[i] = 0
        }
        _active[index] = prev_active === 0 || prev_active === undefined ? 1 : 0
        this.setState({
            active:_active,buttonTxt:'USE'+this.state.myAliens[index].name,
            myAlien:this.state.myAliens[index],
            myAlienId:this.state.myAliens[index].alienId,
            AttackBtn:()=>{
                return( <button className="attack-btn" onClick={this.alienAttack}>
                            <span role="img">
                                USE {this.state.myAliens[index].name} ATTACK IT！
                            </span>
                        </button>
                )
            }
        })
    }

    alienAttack(){
        let that = this
        if(this.state.myAlien !== undefined){
            this.setState({modalDisplay:''})
            MyWeb3.attack(this.state.myAlienId,this.state.targetId)
            .then(function(transactionHash){
                that.setState({
                    transactionHash:transactionHash,
                    AttackBtn : () =>{
                    return(<div></div>)
                    }
                })
            })
        }
    }
    render() { 
        let AttackBtn = this.state.AttackBtn
        if(this.state.myAliens.length>0) {
            return ( 
                <div className="App alien-attack">
                <div
                    className="modal"
                    style={{
                        display:this.state.modalDisplay
                    }}
                >
                    <div className='battelArea'>
                        <div className='targetAlien'>
                            <AlienPreview alien={this.state.targetAlien}></AlienPreview>
                        </div>
                        <div className='vs'>
                            VS
                        </div>
                        <div className='myAlien'>
                            <AlienPreview alien={this.state.myAlien}></AlienPreview>
                        </div>
                    </div>
                    <div><h2>{this.state.transactionHash}</h2></div>
                </div>
                    <div  className="row alien-parts-bin-component" >
                        <div  className="game-card home-card target-card" >
                            <div className="alien-char">
                                <AlienPreview alien={this.state.targetAlien}></AlienPreview>
                            </div>
                        </div>
                        <div className="alien-detail">
                            <div className="flex">
                                {this.state.myAliens.map((item,index)=>{
                                    var name = item.name
                                    var level = item.level
                                    return(
                                        <div className="game-card home-card selectable" key={index} active={this.state.active[index] || 0} onClick={() => this.selectAlien(index)} >
                                            <div className="alien-char">
                                            <AlienPreview alien={item}></AlienPreview>
                                                <div className="alien-card card bg-shaded">
                                                    <div className="card-header bg-dark hide-overflow-text">
                                                        <strong>{name}</strong>
                                                    </div>
                                                    <small className="hide-overflow-text">ALIEN {level} LEVEL</small>
                                                </div>
                                            </div>
                                        </div>  
                                    )
                                })}
                            </div>
                            <AttackBtn></AttackBtn>
                        </div>
                    </div>
                </div>
            );
        }else{
            return(
                <div>NO ALIENS CAN ATTACK IT</div>
            )
        }
    }
}
 
export default NewAlien;