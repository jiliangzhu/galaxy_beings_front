pragma solidity ^0.5.12;

import "./alienHelper.sol";

contract AlienAttack is AlienHelper {
    uint randNonce = 0;

    // 新增：计算总奖励的函数
    function calculateShardReward(
        uint _attackerLevel,
        uint _defenderLevel
    ) internal pure returns (uint) {
        uint baseReward = 10; // 基础奖励
        uint levelReward = baseReward * (1 + (_attackerLevel * 2) / 100); // 等级奖励系数

        int levelDifference = int(_attackerLevel) - int(_defenderLevel);
        uint levelDifferenceBonus = levelDifference > 0
            ? 0
            : uint(-levelDifference) * 3; // 等级差异加成

        return levelReward + levelDifferenceBonus;
    }

    function randMod(uint _modulus) internal returns (uint) {
        randNonce++;
        return
            uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) %
            _modulus;
    }

    function abs(int x) internal pure returns (uint) {
        return uint(x >= 0 ? x : -x);
    }

    // 新的胜率计算函数
    function calculateVictoryProbability(
        uint _attackerLevel,
        uint _defenderLevel
    ) internal pure returns (uint) {
        int levelDifference = int(_attackerLevel) - int(_defenderLevel);

        // 简化胜率计算：每级差异增加或减少1%
        uint levelFactor = uint(abs(levelDifference)) * 1;

        // 计算胜率
        uint probability;
        if (levelDifference > 0) {
            probability = 50 + levelFactor;
        } else if (levelDifference < 0) {
            probability = 50 > levelFactor ? 50 - levelFactor : 1;
        } else {
            probability = 50;
        }

        // 确保胜率在1%到99%之间
        if (probability > 80) {
            probability = 80;
        }

        return probability;
    }

    // 攻击函数
    function attack(
        uint _alienId,
        uint _targetId
    ) external onlyOwnerOf(_alienId) returns (uint) {
        require(
            msg.sender != alienToOwner[_targetId],
            "The target alien is yours!"
        );
        Alien storage myAlien = aliens[_alienId];
        require(_isAttackReady(myAlien), "Your alien is not ready!");

        require(myAlien.lossCount < 10, "Your alien is exhausted!");
        Alien storage enemyAlien = aliens[_targetId];

        uint victoryProbability = calculateVictoryProbability(
            myAlien.level,
            enemyAlien.level
        );
        uint rand = randMod(100);
        if (rand <= victoryProbability) {
            myAlien.winCount++;
            //myAlien.level++;
            enemyAlien.lossCount++;

            // 计算并增加 Shard 奖励
            uint shardReward = calculateShardReward(
                myAlien.level,
                enemyAlien.level
            );
            myAlien.shard += shardReward;

            if (myAlien.winCount % 7 == 0) {
                multiply(_alienId, enemyAlien.dna);
            }
            _triggerAttackCooldown(myAlien);
            return _alienId;
        } else {
            myAlien.lossCount++;
            enemyAlien.winCount++;

            _triggerAttackCooldown(myAlien);
            return _targetId;
        }
    }
}
