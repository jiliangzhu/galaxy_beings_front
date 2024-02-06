import React, { Component } from 'react';
import  AlienArmy  from "./AlienArmy"
import  MyAlien  from "./MyAlien"
import  AlienMarket  from "./AlienMarket"
import  AlienSimulator  from "./AlienSimulator"
import AlienDetail from "./AlienDetail";
import AlienAttack from "./AlienAttack";
import ContractAdmin from "./ContractAdmin"

class Page extends Component {
    constructor(props) {
        super(props)
        this.state = {page:'',id:0 }
    }
    componentDidMount(){
        let search = this.props.location.search.replace(/\?/,'').split("&")
        let page = search[0]
        this.setState({page:page})
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps!==this.props){
            this.setState({nextProps})
            let search = nextProps.location.search.replace(/\?/,'').split("&")
            let page = search[0] === '' ?  'AlienArmy' : search[0]
            this.setState({page:page})
            return true
        }else{
            return false
        }
    }
    render() { 
        switch (this.state.page){
            case 'AlienArmy':
                return(<AlienArmy></AlienArmy>)
            case 'MyAlien':
                return(<MyAlien></MyAlien>)
            case 'AlienMarket':
                return(<AlienMarket></AlienMarket>)
            case 'AlienSimulator':
                return(<AlienSimulator></AlienSimulator>)
            case 'AlienDetail':
                return(<AlienDetail></AlienDetail>)
            case 'AlienAttack':
                return(<AlienAttack></AlienAttack>)
            case 'ContractAdmin':
                return(<ContractAdmin></ContractAdmin>)
            default:
                return(<AlienArmy></AlienArmy>)
        }
    }
}
 
export default Page;