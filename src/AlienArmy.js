import React, { Component } from 'react'
import AlienCard from "./AlienCard";
import './static/AlienPreview.css';
import MyWeb3 from './MyWeb3'
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom"
// eslint-disable-next-line
import Page from "./Page";

class AlienArmy extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            aliens: [],
            totalAliens: 0,  // 总外星人数
            currentPage: 1,
            aliensPerPage: 16 // 每页显示16个外星人
        };
    }
    
    componentDidMount(){
        this.initialize();
    }

    initialize = () => {
        let that = this;
        let ethereum = window.ethereum;
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function(){
                that.loadTotalAlienCount();
            });
        } else {
            alert('You have to install MetaMask !');
        }
    }

    loadTotalAlienCount = () => {
        MyWeb3.alienCount().then(totalCount => {
            this.setState({ totalAliens: totalCount });
            this.loadAliens();
        });
    }

    loadAliens = () => {
        const { currentPage, aliensPerPage, totalAliens } = this.state;
        const startIndex = (currentPage - 1) * aliensPerPage;
        const endIndex = Math.min(startIndex + aliensPerPage, totalAliens);

        let promises = [];
        for (let i = startIndex; i < endIndex; i++) {
            promises.push(MyWeb3.aliens(i));
        }

        Promise.all(promises).then(results => {
            const aliensWithId = results.map((alien, index) => {
                return {...alien, alienId: startIndex + index};
            });
            this.setState({ aliens: aliensWithId });
        });
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    handleClick = (event) => {
        const newPage = Number(event.target.id);
        this.setState({
            currentPage: newPage
        }, () => {
            this.loadAliens();  // 在设置新页面后重新加载外星人
        });
    }

    render() {
        const { aliens } = this.state;
        const renderAliens = aliens.map(alien => {
            return (
                <Link to={`?AlienDetail&id=${alien.alienId}`} key={alien.alienId}>
                    <AlienCard alien={alien} name={alien.name} level={alien.level}></AlienCard>
                </Link>
            );
        });

        const totalAliens = this.state.totalAliens;
        const aliensPerPage = this.state.aliensPerPage;
        const lastPage = Math.ceil(totalAliens / aliensPerPage);
        const currentPage = this.state.currentPage;
        const pageNumbers = [];
    
        // 确保第一页总是显示
        pageNumbers.push(1);
    
        // 计算要显示的页码范围
        const startPage = Math.max(2, currentPage - 2);
        const endPage = Math.min(lastPage - 1, currentPage + 2);
    
        // 如果startPage大于2，则在第一页后添加省略号
        if (startPage > 2) {
            pageNumbers.push('...');
        }
    
        // 添加当前页码的前后页码
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
    
        // 如果endPage小于lastPage - 1，则在最后一页前添加省略号
        if (endPage < lastPage - 1) {
            pageNumbers.push('...');
        }
    
        // 确保最后一页总是显示
        if (lastPage !== 1) {
            pageNumbers.push(lastPage);
        }
    
        // 渲染页码
        const renderPageNumbers = pageNumbers.map(number => {
            return number === '...' ? (
                <li key={number} className="dots">{number}</li>
            ) : (
                <li key={number} id={number} onClick={this.handleClick} className={currentPage === number ? 'active' : ''}>
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
