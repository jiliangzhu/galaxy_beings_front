import React, { Component } from 'react';
import MyWeb3 from './MyWeb3';
import AlienCard from "./AlienCard";
import { Link } from "react-router-dom";

class AlienMarket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopAliens: [],
            currentPage: 1,
            aliensPerPage: 16,  // 每页显示的外星人数
            totalAliens: 0  // 总外星人数
        }
    }

    componentDidMount() {
        let that = this;
        let ethereum = window.ethereum;
        if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            MyWeb3.init().then(function (res) {
                that.alienShop();
            });
        } else {
            alert('You have to install MetaMask !');
        }
    }

    alienShop() {
        let that = this;
        MyWeb3.getShopAliens().then(function (alienIds) {
            that.setState({ totalAliens: alienIds.length });

            const { currentPage, aliensPerPage } = that.state;
            const startIndex = (currentPage - 1) * aliensPerPage;
            const endIndex = Math.min(startIndex + aliensPerPage, alienIds.length);

            for (var i = startIndex; i < endIndex; i++) {
                let alienId = alienIds[i];
                if (alienId >= 0) {
                    MyWeb3.aliens(alienId).then(function (aliens) {
                        let _shopAliens = that.state.shopAliens;
                        aliens.alienId = alienId;
                        _shopAliens.push(aliens);
                        that.setState({ shopAliens: _shopAliens });
                    });
                }
            }
        });
    }

    handleClick = (event) => {
        const newPage = Number(event.target.id);
        this.setState({
            currentPage: newPage,
            shopAliens: []  // 清空当前的外星人列表，为加载新页的数据做准备
        }, () => {
            this.alienShop();
        });
    }

    renderPageNumbers() {
        const { totalAliens, aliensPerPage, currentPage } = this.state;
        const pageNumbers = [];
        const lastPage = Math.ceil(totalAliens / aliensPerPage);

        pageNumbers.push(1);
        let startPage, endPage;
        if (lastPage <= 5) {
            startPage = 2;
            endPage = lastPage - 1;
        } else {
            if (currentPage <= 3) {
                startPage = 2;
                endPage = 4;
            } else if (currentPage + 2 >= lastPage) {
                startPage = lastPage - 3;
                endPage = lastPage - 1;
            } else {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
        }

        if (startPage > 2) {
            pageNumbers.push("...");
        }
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        if (endPage < lastPage - 1) {
            pageNumbers.push("...");
        }
        if (lastPage !== 1) {
            pageNumbers.push(lastPage);
        }

        return (
            <ul className="page-numbers">
                {pageNumbers.map(number => (
                    number === '...' ? 
                    <li key={number} className="dots">{number}</li> : 
                    <li key={number} id={number} onClick={this.handleClick} className={currentPage === number ? 'active' : ''}>
                        {number}
                    </li>
                ))}
            </ul>
        );
    }

    render() {
        if (this.state.shopAliens.length > 0) {
            return (
                <div>
                    <div className="cards">
                        {this.state.shopAliens.map((item, index) => (
                            <Link to={`?AlienDetail&id+item.alienId}`} key={index}>
                            <AlienCard alien={item} name={item.name} level={item.level}></AlienCard>
                        </Link>
                    ))}
                </div>
                <div className="pagination">
                    {this.renderPageNumbers()}
                </div>
            </div>
        );
    } else {
        return ( <div>Loading Aliens...</div> );
    }
}
}

export default AlienMarket;
