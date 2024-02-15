import React, { useState, useEffect, Fragment } from 'react';
import './static/App.css';
import Page from "./Page";
import MyWeb3 from './MyWeb3'; // Ensure the path is correct
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Modal({ show, message, onClose }) {
    useEffect(() => {
        if (show) {
            setTimeout(() => onClose(), 3000); // 3秒后自动关闭`
        }
    }, [show, onClose]);

    const handleClick = (e) => {
        e.stopPropagation(); // 阻止事件冒泡
    };

    return (
        <div className={`modal ${show ? 'show' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={handleClick}>
                <div className="modal-body">{message}</div>
            </div>
        </div>
    );
}

function App() {
    const [totalPoints, setTotalPoints] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [inviteLink, setInviteLink] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [adminAreaComponent, setAdminAreaComponent] = useState(<Fragment></Fragment>); // Change to a component state

    useEffect(() => {
        const initWeb3AndCalculatePoints = async () => {
            try {
                await MyWeb3.init(); // Initialize Web3 and contract
                await calculateTotalPoints(); // Now calculate points
            } catch (error) {
                console.error("Error initializing Web3 or calculating points:", error);
            }
        };

        const setupEthereumListeners = () => {
            let ethereum = window.ethereum;
            if (typeof ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
                ethereum.on('accountsChanged', function (accounts) {
                    console.log("accountsChanged:" + accounts);
                    // window.location.reload();
                });
                ethereum.on('chainChanged', function (chainId) {
                    console.log("chainChanged:" + chainId);
                    // window.location.reload();
                });
                ethereum.on('chainChanged', function (networkVersion) {
                    console.log("chainChanged:" + networkVersion);
                    // window.location.reload();
                });
            } else {
                alert('You have to install MetaMask !');
            }
        };

        initWeb3AndCalculatePoints();
        setupEthereumListeners();
    }, []);
    

    const handleGenerateInviteCode = async () => {
        try {
            // 获取当前连接的以太坊账户地址
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const account = accounts[0];
    
            // 尝试获取现有的邀请码
            const existingCode = await MyWeb3.getInviteCode(account);
            let code;
            if (existingCode) {
                code = existingCode;
            } else {
                // 生成新的邀请码
                const transactionHash = await MyWeb3.generateInviteCode();
                console.log('Transaction Hash:', transactionHash);
                // 等待链上状态更新
                await new Promise(resolve => setTimeout(resolve, 10000)); // 延迟时间可以根据需要调整
                code = await MyWeb3.getInviteCode(account);
            }
    
            // 生成邀请链接
            const newInviteLink = `https://galaxybeings.xyz/${code}?MyAlien`;
            setInviteLink(newInviteLink);
    
            // 将链接复制到剪切板
            navigator.clipboard.writeText(newInviteLink)
                .then(() => {
                    // 链接成功复制到剪切板，并显示在弹窗中
                    setModalMessage(`Link copied to clipboard! Send it to everyone: \n\n${newInviteLink}`);
                    setShowModal(true);
                })
                .catch(err => {
                    // 无法复制链接，只显示在弹窗中
                    alert(`Could not copy the link to clipboard. Here is your invite link:\n\n${newInviteLink}`);
                    console.error('Could not copy invite link: ', err);
                });
        } catch (error) {
            console.error('Error generating or fetching invite code:', error);
        }
    };
    
    
    const calculateTotalPoints = async () => {
        try {
            const alienIds = await MyWeb3.getAliensByOwner(); // 获取用户的所有 Aliens
            let points = 0;
            const basePointsPerAlien = 100;
    
            for (const alienId of alienIds) {
                const alienDetails = await MyWeb3.aliens(alienId);
                let levelPoints = 0;
    
                // 对每个等级段进行积分计算
                for (let level = 1; level < alienDetails.level; level++) {
                    const multiplier = Math.floor((level - 1) / 10) + 1;
                    levelPoints += multiplier * 10;
                }
    
                points += basePointsPerAlien + levelPoints;
            }
    
            // 确保ethereum对象存在
            if (window.ethereum) {
                // 从智能合约获取用户的积分
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                const account = accounts[0]; // 获取第一个账户地址
                const contractPoints = await MyWeb3.getPoints(account || window.defaultAccount);
                points += parseInt(contractPoints); // 将合约中的积分加入总积分
            } else {
                console.error('Ethereum object not found');
            }
    
            setTotalPoints(points);
        } catch (error) {
            console.error('Error calculating total points:', error);
        }
    };
    

    return (
        <Fragment>
        <div className="referral-section">
            <div className="total-points">
                POINTS: {totalPoints}
            </div>
            <button 
                onClick={handleGenerateInviteCode} 
                className="referral-link-button"
            >
                {'Refer Link'}
            </button>
        </div>
        <Modal show={showModal} message={modalMessage} onClose={() => setShowModal(false)} />
            <Router>
                <section className="aliens-hero no-webp block app-block-intro pt-5 pb-0">
                    <div className="container">
                        <div className="menu">
                            <ul>
                                <li>
                                    <button className="start-course-btn">
                                        <span><Link to="?AlienArmy">ALIEN ARMY</Link></span>
                                    </button>
                                </li>
                                <li>
                                    <button className="start-course-btn">
                                        <span><Link to="?MyAlien">MY ARMY</Link></span>
                                    </button>
                                </li>
                                <li>
                                    <button className="start-course-btn">
                                        <span><Link to="?AlienMarket">MARKET</Link></span>
                                    </button>
                                </li>
                                {/* <li>
                                    <button className="start-course-btn">
                                        <span><Link to="?AlienSimulator">SIMULATOR</Link></span>
                                    </button>
                                </li> */}
                                {adminAreaComponent}
                            </ul>
                        </div>
                    </div>
                </section>
                <section className="alien-container block bg-walls no-webp">
                    <div className="container">
                        <div className="area">
                            <Route path="*" component={Page}></Route>
                        </div>
                    </div>
                </section>
            </Router>
        </Fragment>
    );
}

export default App;
