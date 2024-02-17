pragma solidity ^0.5.12;

import "./alienHelper.sol";
import "./erc721.sol";

contract AlienOwnership is AlienHelper, ERC721 {
    mapping(uint => address) alienApprovals;

    function balanceOf(address _owner) public view returns (uint256 _balance) {
        return ownerAlienCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return alienToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        ownerAlienCount[_to] = ownerAlienCount[_to].add(1);
        ownerAlienCount[_from] = ownerAlienCount[_from].sub(1);
        alienToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transfer(
        address _to,
        uint256 _tokenId
    ) public onlyOwnerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(
        address _to,
        uint256 _tokenId
    ) public onlyOwnerOf(_tokenId) {
        alienApprovals[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        require(alienApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}
