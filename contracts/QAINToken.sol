// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract QAINToken is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("QAIN Token", "QAIN") {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }

    // Function to mint more tokens (only by owner)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    



