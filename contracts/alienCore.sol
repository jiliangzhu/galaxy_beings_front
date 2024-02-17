pragma solidity ^0.5.12;

import "./alienMarket.sol";
import "./alienFeeding.sol";
import "./alienAttack.sol";

contract AlienCore is AlienMarket, AlienFeeding, AlienAttack {
    string public constant name = "GALAXY BEINGS";
    string public constant symbol = "GABE";

    function() external payable {}

    function withdraw() external onlyOwner {
        owner.transfer(address(this).balance);
    }

    function checkBalance() external view onlyOwner returns (uint) {
        return address(this).balance;
    }
}
