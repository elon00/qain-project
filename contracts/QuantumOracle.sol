// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract QuantumOracle is Ownable {
    uint256 public latestRandomNumber;
    uint256 public latestRandomnessTimestamp;

    event RandomNumberUpdated(uint256 newRandomNumber, uint256 timestamp);

    constructor() {
        latestRandomNumber = 0; // Start with 0
    }

    // A special function ONLY the owner (or our dragon) can call
    function setRandomNumber(uint256 _randomNumber) public onlyOwner {
        latestRandomNumber = _randomNumber;
        latestRandomnessTimestamp = block.timestamp;
        emit RandomNumberUpdated(_randomNumber, block.timestamp);
    }

    // A function for anyone to see the latest number
    function getRandomNumber() public view returns (uint256) {
        return latestRandomNumber;
    }
}
