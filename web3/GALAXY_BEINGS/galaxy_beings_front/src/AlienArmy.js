import React, { Component } from 'react'
import AlienCard from "./AlienCard";
import './static/AlienPreview.css';
import MyWeb3 from './MyWeb3'
import {
    BrowserRouter as 
    // eslint-disable-next-line no-unused-vars
    Route,
    Link
  } from "react-router-dom"
// eslint-disable-next-line no-unused-vars
 import Page from "./Page";

class AlienArmy extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            aliens: [],
            currentPage: 1,
            aliensPerPage: 30 // 每页显示30个僵尸
        };
    }
        
    componentDidMount(){
        let that = this
        let ethereum = window.ethereum
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(res){
                that.alienArmy()
            })
        }else {
            alert('You have to install MetaMask !')
        }
    }
    alienArmy(){
        let that = this;
        MyWeb3.alienCount().then(function(result){
            console.log("Total aliens:", result); // 打印总僵尸数
            let promises = [];
            for(let i = 0; i < result; i++){
                promises.push(MyWeb3.aliens(i));
            }
        
            Promise.all(promises).then(results => {
                console.log("All aliens data:", results); // 打印所有僵尸数据
                const aliensWithId = results.map((alien, index) => {
                    return {...alien, alienId: index};
                });
                that.setState({ aliens: aliensWithId });
            });
        });
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

handleClick = (event) => {
    const newPage = Number(event.target.id);
    console.log("Current page:", newPage); // 打印当前点击的页码
    this.setState({
        currentPage: newPage
    });
}



render() {
    const { aliens, currentPage, aliensPerPage } = this.state;
    const indexOfLastAlien = currentPage * aliensPerPage;
    const indexOfFirstAlien = indexOfLastAlien - aliensPerPage;
    const currentAliens = aliens.slice(indexOfFirstAlien, indexOfLastAlien);
    console.log("Aliens on current page:", currentAliens); 
    const renderAliens = currentAliens.map((alien, index) => {
        return (
             <Link to={`?AlienDetail&id=${alien.alienId}`} key={alien.alienId}>
                <AlienCard alien={alien} name={alien.name} level={alien.level}></AlienCard>
            </Link>
        );
    });

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(aliens.length / aliensPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
        return (
            <li key={number} id={number} onClick={this.handleClick}>
                {number}
            </li>
        );
    });

    return (
        <div className="alien-army-container">
            <div className="cards">{renderAliens}</div>
            <div className="pagination">
                <ul className="page-numbers">{renderPageNumbers}</ul>
            </div>
        </div>
        );
    }
}
 
export default AlienArmy;
