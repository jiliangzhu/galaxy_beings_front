import Web3 from "web3";
import abi from './AlienCore.json'
import ContractAddress from './ContractAddress'

const MyWeb3 ={
    init() {
        return new Promise((resolve, reject) => {
            //let currentChainId = parseInt(window.ethereum.chainId, 16)
            let ethereum = window.ethereum
            //禁止自动刷新，metamask要求写的
            ethereum.autoRefreshOnNetworkChange = false
            //开始调用metamask
            ethereum.enable().then(function (accounts) {
                //初始化provider
                let provider = window['ethereum'] || window.web3.currentProvider
                //初始化Web3
                window.web3 = new Web3(provider)
                //获取到当前以太坊网络id
                window.web3.eth.net.getId().then(function (result) {
                    let currentChainId = result
                    //设置最大监听器数量，否则出现warning
                    window.web3.currentProvider.setMaxListeners(300)
                    //从json获取到当前网络id下的合约地址
                    let currentContractAddress = ContractAddress[currentChainId]
                    if(currentContractAddress !== undefined){
                        //实例化合约
                        window.MyContract = new window.web3.eth.Contract(abi.abi,currentContractAddress)
                        //获取到当前默认的以太坊地址
                        window.defaultAccount = accounts[0].toLowerCase()
                        //that.allEvents(window.MyContract)
                        resolve(true)
                    }else{
                        reject('Unknow Your ChainId:'+currentChainId)
                    }
                })
            }).catch(function (error) {
                console.log(error)
            })
        })
    },

    //ALIEN总量
    alienCount() {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.alienCount().call().then(function(alienCount) {
                resolve(alienCount)
            })
            .catch(function(error) {
                reject(error);
            })
        })
    },
    //获得单个ALIEN数据
    aliens(alienId){
        return new Promise((resolve, reject) => {
            if(alienId>=0){
                window.MyContract.methods.aliens(alienId).call().then(function(aliens) {
                    resolve(aliens)
                })
            }
        })
    },
    //获得ALIEN拥有者地址
    alienToOwner(alienId){
        return new Promise((resolve, reject) => {
            if(alienId>=0){
                window.MyContract.methods.alienToOwner(alienId).call().then(function(aliens) {
                    resolve(aliens.toLowerCase())
                })
            }
        })
    },
    //获得当前用户的所有ALIENid
    // getAliensByOwner(){
    //     return new Promise((resolve, reject) => {
    //         window.MyContract.methods.getAliensByOwner(window.defaultAccount).call().then(function(aliens) {
    //             resolve(aliens)
    //         })
    //     })
    // },
    // 在 MyWeb3 对象内
    getAliensByOwner() {
        return new Promise((resolve, reject) => {
            if (window.MyContract) {
                window.MyContract.methods.getAliensByOwner(window.defaultAccount).call()
                    .then(aliens => resolve(aliens))
                    .catch(error => reject(error));
            } else {
                reject('Contract is not initialized');
            }
        });
    },


    //创建随机ALIEN
    createAlien(_name, _inviteCode) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.createAlien(_name, _inviteCode).send({from: window.defaultAccount})
            .on('transactionHash', function(transactionHash){
                resolve(transactionHash)
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log({confirmationNumber: confirmationNumber, receipt: receipt})
            })
            .on('receipt', function(receipt){
                console.log({receipt: receipt})
                window.location.reload()
            })
            .on('error', function(error, receipt){
                console.log({error: error, receipt: receipt})
                reject({error: error, receipt: receipt})
            });
        });
    },
    
    //购买ALIEN
    buyAlien(_name){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.alienPrice().call().then(function(alienPrice) {
                window.MyContract.methods.buyAlien(_name).send({from:window.defaultAccount,value:alienPrice})
                .on('transactionHash', function(transactionHash){
                    resolve(transactionHash)
                })
                .on('confirmation', function(confirmationNumber, receipt){
                    console.log({confirmationNumber:confirmationNumber,receipt:receipt})
                })
                .on('receipt', function(receipt){
                    console.log({receipt:receipt})
                    window.location.reload()
                })
                .on('error', function(error,receipt){
                    console.log({error:error,receipt:receipt})
                    reject({error:error,receipt:receipt})
                })
            })
        })
    },

    //ALIEN对战
    attack(_alienId,_targetId){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.attack(_alienId,_targetId).send({from:window.defaultAccount})
            .on('transactionHash', function(transactionHash){
                resolve(transactionHash)
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log({confirmationNumber:confirmationNumber,receipt:receipt})
            })
            .on('receipt', function(receipt){
                console.log({receipt:receipt})
                window.location.reload()
            })
            .on('error', function(error,receipt){
                console.log({error:error,receipt:receipt})
                reject({error:error,receipt:receipt})
            })
        })
    },
    //ALIEN改名
    changeName(_alienId,_name){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.changeName(_alienId,_name).send({from:window.defaultAccount})
            .on('transactionHash', function(transactionHash){
                resolve(transactionHash)
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log({confirmationNumber:confirmationNumber,receipt:receipt})
            })
            .on('receipt', function(receipt){
                console.log({receipt:receipt})
                window.location.reload()
            })
            .on('error', function(error,receipt){
                console.log({error:error,receipt:receipt})
                reject({error:error,receipt:receipt})
            })
        })
    },
    //ALIEN喂食
    feed(_alienId){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.feed(_alienId).send({from:window.defaultAccount})
            .on('transactionHash', function(transactionHash){
                resolve(transactionHash)
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log({confirmationNumber:confirmationNumber,receipt:receipt})
            })
            .on('receipt', function(receipt){
                console.log({receipt:receipt})
                window.location.reload()
            })
            .on('error', function(error,receipt){
                console.log({error:error,receipt:receipt})
                reject({error:error,receipt:receipt})
            })
        })
    },

    // 激活alien
    activateAlien(_alienId) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.activateAlien(_alienId).send({ from: window.defaultAccount })
                .on('transactionHash', function(transactionHash){
                    resolve(transactionHash);
                })
                .on('error', function(error, receipt) {
                    reject(error);
                });
        });
    },
    
    // ALIEN shard升级
    levelUp(_alienId){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.levelUp(_alienId).send({from:window.defaultAccount})
            .on('transactionHash', function(transactionHash){
                resolve(transactionHash)
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log({confirmationNumber:confirmationNumber,receipt:receipt})
            })
            .on('receipt', function(receipt){
                console.log({receipt:receipt})
                window.location.reload()
            })
            .on('error', function(error,receipt){
                console.log({error:error,receipt:receipt})
                reject({error:error,receipt:receipt})
            })
        })
    },

    //获取ALIEN喂食次数
    alienFeedTimes(_alienId){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.alienFeedTimes(_alienId).call().then(function(alienFeedTimes) {
                resolve(alienFeedTimes)
            })
        })
    },
    //获取最低售价
    minPrice(){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.minPrice().call().then(function(minPrice) {
                resolve(window.web3.utils.fromWei(minPrice,'ether'))
            })
        })
    },

    //出售我的ALIEN
    saleMyAlien(_alienId,_price){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.saleMyAlien(_alienId,window.web3.utils.toWei(_price.toString())).send({from:window.defaultAccount})
            .on('transactionHash', function(transactionHash){
                resolve(transactionHash)
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log({confirmationNumber:confirmationNumber,receipt:receipt})
            })
            .on('receipt', function(receipt){
                console.log({receipt:receipt})
                window.location.reload()
            })
            .on('error', function(error,receipt){
                console.log({error:error,receipt:receipt})
                reject({error:error,receipt:receipt})
            })
        })
    },
    //获得商店里ALIEN数据
    alienShop(_alienId){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.alienShop(_alienId).call().then(function(shopInfo) {
                shopInfo.price = window.web3.utils.fromWei(shopInfo.price,'ether')
                resolve(shopInfo)
            })
        })
    },
    //获得商店所有ALIEN
    getShopAliens(){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.getShopAliens().call().then(function(alienIds) {
                resolve(alienIds)
            })
        })
    },
    //购买商店里的ALIEN
    buyShopAlien(_alienId,_price){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.buyShopAlien(_alienId).send({from:window.defaultAccount,value:window.web3.utils.toWei(_price.toString())})
            .on('transactionHash', function(transactionHash){
                resolve(transactionHash)
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log({confirmationNumber:confirmationNumber,receipt:receipt})
            })
            .on('receipt', function(receipt){
                console.log({receipt:receipt})
                window.location.reload()
            })
            .on('error', function(error,receipt){
                console.log({error:error,receipt:receipt})
                reject({error:error,receipt:receipt})
            })
        })
    },

    //购买shards
    buyShards(_alienId,_price){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.buyShards(_alienId).send({from:window.defaultAccount,value:window.web3.utils.toWei(_price.toString())})
            .on('transactionHash', function(transactionHash){
                resolve(transactionHash)
            })
            .on('confirmation', function(confirmationNumber, receipt){
                console.log({confirmationNumber:confirmationNumber,receipt:receipt})
            })
            .on('receipt', function(receipt){
                console.log({receipt:receipt})
                window.location.reload()
            })
            .on('error', function(error,receipt){
                console.log({error:error,receipt:receipt})
                reject({error:error,receipt:receipt})
            })
        })
    },    

    //获得合约拥有者地址
    owner(){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.owner().call().then(function(owner) {
                resolve(owner.toLowerCase())
            })
        })
    },
    //获得合约名称
    name(){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.name().call().then(function(name) {
                resolve(name)
            })
        })
    },
    //获得合约标识
    symbol(){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.symbol().call().then(function(symbol) {
                resolve(symbol)
            })
        })
    },


    //查询余额
    checkBalance(){
        return new Promise((resolve, reject) => {
            this.owner().then(function (owner) {
                if(window.defaultAccount === owner){
                    window.MyContract.methods.checkBalance().call({from:window.defaultAccount}).then(function(balance) {
                        resolve(window.web3.utils.fromWei(balance,'ether'))
                    })
                }else{
                    reject('You are not contract owner')
                }
            })
        })
    },

    //获得shard价格
    shardPrice(){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.shardPrice().call().then(function(shardPrice) {
                resolve(window.web3.utils.fromWei(shardPrice,'ether'))
            })
        })
    },

    //设置shard价格
    setShardPrice(_price){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.setShardPrice(window.web3.utils.toWei(_price.toString())).send({from:window.defaultAccount})
            .then(function(result) {
                resolve(result)
            })
        })
    },    

    //设置最低售价
    setMinPrice(_value){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.setMinPrice(window.web3.utils.toWei(_value.toString())).send({from:window.defaultAccount})
            .then(function(result) {
                resolve(result)
            })
        })
    },
    //获得ALIEN售价
    alienPrice(){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.alienPrice().call().then(function(alienPrice) {
                resolve(window.web3.utils.fromWei(alienPrice,'ether'))
            })
        })
    },
    //设置ALIEN售价
    setAlienPrice(_value){
        return new Promise((resolve, reject) => {
            window.MyContract.methods.setAlienPrice(window.web3.utils.toWei(_value.toString())).send({from:window.defaultAccount})
            .then(function(result) {
                resolve(result)
            })
        })
    },

    // 调用智能合约生成邀请码
    generateInviteCode: function() {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.generateInviteCode().send({from: window.defaultAccount})
            .on('transactionHash', function(transactionHash){
                resolve(transactionHash);
            })
            .on('error', function(error, receipt) {
                reject(error);
            });
        });
    },

    // 获取用户的邀请码
    getInviteCode: function(userAddress) {
        return new Promise((resolve, reject) => {
            window.MyContract.methods.inviteCodes(userAddress).call()
            .then(function(inviteCode) {
                resolve(inviteCode);
            })
            .catch(function(error) {
                reject(error);
            });
        });
    },

    // 在 MyWeb3.js 中添加此函数
    getPoints: function(userAddress) {
        return new Promise((resolve, reject) => {
            if (!window.MyContract) {
                reject('Contract not initialized');
                return;
            }

            window.MyContract.methods.points(userAddress).call()
            .then(function(points) {
                resolve(points);
            })
            .catch(function(error) {
                reject(error);
            });
        });
    },


    //提款
    withdraw(){
        return new Promise((resolve, reject) => {
            this.owner().then(function (owner) {
                if(window.defaultAccount === owner){
                    window.MyContract.methods.withdraw().send({from:window.defaultAccount}).then(function(res) {
                        resolve(res)
                    })
                }else{
                    reject('You are not contract owner')
                }
            })
        })
    },
    //新ALIEN事件
    EventNewAlien(){
        return window.MyContract.events.NewAlien({},{fromBlock: 0, toBlock: 'latest'})
    },
    //出售ALIEN事件
    EventSaleAlien(){
        return new Promise((resolve, reject) => {
            window.MyContract.events.SaleAlien({fromBlock: 0, toBlock: 'latest'},function (error, event) {
                resolve(event)
            })
        })
    },
    //所有事件
    allEvents(){
        window.MyContract.events.allEvents({fromBlock: 0}, function(error, event){
            console.log({allEvents:event})
        }).on("connected", function(subscriptionId){
           console.log({connected_subscriptionId:subscriptionId})
        }).on('data', function(event){
           console.log({event_data:event})
        }).on('changed', function(event){
            console.log({event_changed:event})
        }).on('error', function(error, receipt) { 
            console.log({event_error:error,receipt:receipt})
        })
    }
}
    
export default MyWeb3;