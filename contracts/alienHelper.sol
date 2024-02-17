pragma solidity ^0.5.12;

import "./alienFactory.sol";

contract AlienHelper is AlienFactory {
    uint baseCost = 5;
    uint public increment = 2;

    uint public shardPrice = 0.0001 ether;

    modifier aboveLevel(uint _level, uint _alienId) {
        require(aliens[_alienId].level >= _level, "Level is not sufficient");
        _;
    }
    modifier onlyOwnerOf(uint _alienId) {
        require(msg.sender == alienToOwner[_alienId], "Alien is not yours");
        _;
    }

    function setIncrement(uint _newIncrement) external onlyOwner {
        increment = _newIncrement;
    }

    function levelUp(uint _alienId) external onlyOwnerOf(_alienId) {
        Alien storage myAlien = aliens[_alienId];
        uint level = myAlien.level;
        uint upgradeCost = baseCost + (level - 1) * increment;

        require(myAlien.shard >= upgradeCost, "Not enough shards to level up");
        myAlien.shard -= upgradeCost; // 扣除所需的 Shard
        myAlien.level++;
    }

    function setShardPrice(uint _price) external onlyOwner {
        shardPrice = _price;
    }

    function buyShards(uint _alienId) external payable onlyOwnerOf(_alienId) {
        require(msg.value >= shardPrice, "Not enough ETH sent for any shards");

        uint shardsToBuy = msg.value / shardPrice;
        uint spentAmount = shardsToBuy * shardPrice;
        uint refundAmount = msg.value - spentAmount;

        aliens[_alienId].shard += shardsToBuy;
        if (refundAmount > 0) {
            msg.sender.transfer(refundAmount);
        }
    }

    function activateAlien(uint _alienId) external onlyOwnerOf(_alienId) {
        Alien storage myAlien = aliens[_alienId];
        require(myAlien.lossCount >= 10, "Your alien is not exhausted yet!");
        require(myAlien.shard >= 10, "Not enough shards to activate alien");

        myAlien.shard -= 10;
        myAlien.lossCount = 0;
    }

    function changeName(
        uint _alienId,
        string calldata _newName
    ) external aboveLevel(2, _alienId) onlyOwnerOf(_alienId) {
        aliens[_alienId].name = _newName;
    }

    function getAliensByOwner(
        address _owner
    ) external view returns (uint[] memory) {
        uint[] memory result = new uint[](ownerAlienCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < aliens.length; i++) {
            if (alienToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function _triggerFeedCooldown(Alien storage _alien) internal {
        _alien.readyFeedTime =
            uint32(now + cooldownTime) -
            uint32((now + cooldownTime) % 1 days);
    }

    function _triggerAttackCooldown(Alien storage _alien) internal {
        _alien.readyAttackTime =
            uint32(now + cooldownTime) -
            uint32((now + cooldownTime) % 1 days);
    }

    function _isFeedReady(Alien storage _alien) internal view returns (bool) {
        return (_alien.readyFeedTime <= now);
    }

    function _isAttackReady(Alien storage _alien) internal view returns (bool) {
        return (_alien.readyAttackTime <= now);
    }

    function multiply(
        uint _alienId,
        uint _targetDna
    ) internal onlyOwnerOf(_alienId) {
        Alien storage myAlien = aliens[_alienId];
        require(_isAttackReady(myAlien), "Alien is not ready");
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myAlien.dna + _targetDna) / 2;
        newDna = newDna - (newDna % 10) + 9;
        _createAlien("NoName", newDna, false);
        _triggerAttackCooldown(myAlien);
    }
}
