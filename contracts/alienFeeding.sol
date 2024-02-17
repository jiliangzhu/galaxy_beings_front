pragma solidity ^0.5.12;

import "./alienHelper.sol";

contract AlienFeeding is AlienHelper {
    function feed(uint _alienId) public onlyOwnerOf(_alienId) {
        Alien storage myAlien = aliens[_alienId];
        require(_isFeedReady(myAlien));
        require(myAlien.lossCount < 10, "Your alien is exhausted!");
        alienFeedTimes[_alienId] = alienFeedTimes[_alienId].add(1);

        // 计算获得的 Shards 数量
        uint32 feedCycle = uint32((alienFeedTimes[_alienId] - 1) % 7);
        myAlien.shard += feedCycle + 1; // 按循环增加 Shards

        alienFeedTimes[_alienId] = alienFeedTimes[_alienId].add(1);
        _triggerFeedCooldown(myAlien);
        if (alienFeedTimes[_alienId] % 10 == 0) {
            uint newDna = myAlien.dna - (myAlien.dna % 10) + 8;
            _createAlien("alien's son", newDna, false);
        }
    }
}
