pragma solidity ^0.5.12;

import "./ownable.sol";
import "./safemath.sol";

contract AlienFactory is Ownable {
    using SafeMath for uint256;

    event NewAlien(uint alienId, string name, uint dna);

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;
    uint public cooldownTime = 1 days;
    uint public alienPrice = 0.01 ether;
    uint public alienCount = 0;

    struct Alien {
        string name;
        uint dna;
        uint shard;
        uint16 winCount;
        uint16 lossCount;
        uint32 level;
        uint32 readyFeedTime;
        uint32 readyAttackTime;
    }

    Alien[] public aliens;

    mapping(uint => address) public alienToOwner;
    mapping(address => uint) ownerAlienCount;
    mapping(uint => uint) public alienFeedTimes;

    // 邀请码相关
    mapping(address => string) public inviteCodes;
    mapping(string => address) public codeOwners;
    mapping(address => uint256) public points;

    // 内部创建 Alien 的函数，增加了对 shard 的处理
    function _createAlien(
        string memory _name,
        uint _dna,
        bool isInvited
    ) internal {
        uint shardAmount = isInvited ? 10 : 0; // 如果使用有效邀请码，赋予 10 个 shard
        uint id = aliens.push(Alien(_name, _dna, shardAmount, 0, 0, 1, 0, 0)) -
            1;
        alienToOwner[id] = msg.sender;
        ownerAlienCount[msg.sender] = ownerAlienCount[msg.sender].add(1);
        alienCount = alienCount.add(1);
        emit NewAlien(id, _name, _dna);
    }

    function _generateRandomDna(
        string memory _str
    ) private view returns (uint) {
        return uint(keccak256(abi.encodePacked(_str, now))) % dnaModulus;
    }

    // 创建 Alien 的函数，增加邀请码逻辑
    function createAlien(string memory _name, string memory inviteCode) public {
        require(ownerAlienCount[msg.sender] == 0);
        uint randDna = _generateRandomDna(_name);
        randDna = randDna - (randDna % 10);
        bool isInvited = _processInviteCode(inviteCode); // 处理邀请码并返回是否有效
        _createAlien(_name, randDna, isInvited);
    }

    // 处理邀请码逻辑的内部函数，返回邀请是否有效
    function _processInviteCode(
        string memory inviteCode
    ) internal returns (bool) {
        address inviter = codeOwners[inviteCode];
        if (inviter != address(0) && inviter != msg.sender) {
            points[inviter] = points[inviter].add(10); // 增加邀请者的积分
            return true; // 邀请有效
        }
        return false; // 邀请无效
    }

    function buyAlien(string memory _name) public payable {
        require(ownerAlienCount[msg.sender] > 0);
        require(msg.value >= alienPrice);
        uint randDna = _generateRandomDna(_name);
        randDna = randDna - (randDna % 10) + 1;
        _createAlien(_name, randDna, false);
    }

    // 生成邀请码的函数
    function generateInviteCode() public {
        require(
            bytes(inviteCodes[msg.sender]).length == 0,
            "Invite code already generated"
        );
        bytes32 hash = keccak256(abi.encodePacked(msg.sender));
        string memory code = substring(_toAsciiString(hash), 0, 8);
        inviteCodes[msg.sender] = code;
        codeOwners[code] = msg.sender;
    }

    // 辅助函数：将bytes32转换为ASCII字符串
    function _toAsciiString(
        bytes32 _bytes
    ) internal pure returns (string memory) {
        bytes memory s = new bytes(64);
        for (uint i = 0; i < 32; i++) {
            bytes1 b = _bytes[i];
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string(s);
    }

    // 辅助函数：将字节转换为ASCII字符
    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    // 辅助函数：截取字符串
    function substring(
        string memory str,
        uint startIndex,
        uint endIndex
    ) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }

    function setAlienPrice(uint _price) external onlyOwner {
        alienPrice = _price;
    }
}
