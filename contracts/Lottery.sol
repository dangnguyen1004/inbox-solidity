// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > 0.001 ether);

        players.push(msg.sender);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function random() private view returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, players)));
        return randomNumber;
    }

    function currenyBalance() private view returns (uint) {
        return address(this).balance;
    }

    function pickWiner() public {
        uint index = random() % players.length;
        address payable winner = payable(players[index]);
        winner.transfer(currenyBalance());
    }
}