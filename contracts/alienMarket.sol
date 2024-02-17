pragma solidity ^0.5.12;

import "./alienOwnership.sol";

contract AlienMarket is AlienOwnership {
    struct alienSales {
        address payable seller;
        uint price;
    }
    mapping(uint => alienSales) public alienShop;
    uint shopAlienCount;
    uint public minPrice = 1 finney;

    event SaleAlien(uint indexed alienId, address indexed seller);
    event BuyShopAlien(
        uint indexed alienId,
        address indexed buyer,
        address indexed seller
    );

    function saleMyAlien(
        uint _alienId,
        uint _price
    ) public onlyOwnerOf(_alienId) {
        uint tax = (_price * 5) / 100;
        require(_price >= minPrice + tax, "Your price must > minPrice+tax");
        alienShop[_alienId] = alienSales(msg.sender, _price);
        shopAlienCount = shopAlienCount.add(1);
        emit SaleAlien(_alienId, msg.sender);
    }

    function buyShopAlien(uint _alienId) public payable {
        require(msg.value >= alienShop[_alienId].price, "No enough money");
        uint tax = (alienShop[_alienId].price * 5) / 100;
        _transfer(alienShop[_alienId].seller, msg.sender, _alienId);
        alienShop[_alienId].seller.transfer(msg.value - tax);
        delete alienShop[_alienId];
        shopAlienCount = shopAlienCount.sub(1);
        emit BuyShopAlien(_alienId, msg.sender, alienShop[_alienId].seller);
    }

    function getShopAliens() external view returns (uint[] memory) {
        uint[] memory result = new uint[](shopAlienCount);
        uint counter = 0;
        for (uint i = 0; i < aliens.length; i++) {
            if (alienShop[i].price != 0) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function setMinPrice(uint _value) public onlyOwner {
        minPrice = _value;
    }
}
