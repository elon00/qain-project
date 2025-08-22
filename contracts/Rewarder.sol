// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ProofOfAI.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Rewarder is Ownable {
    IERC20 public qainToken;
    ProofOfAI public proofOfAIContract;

    // A checklist to remember who has already claimed a reward
    mapping(address => bool) public hasClaimedReward;

    event RewardDistributed(address indexed user, uint256 amount);

    // This connects our treasure chest to the other contracts
    constructor(address _qainTokenAddress, address _proofOfAIAddress) {
        qainToken = IERC20(_qainTokenAddress);
        proofOfAIContract = ProofOfAI(_proofOfAIAddress);
    }

    function claimReward() public {
        // First Guard: Checks if the user has already claimed.
        require(!hasClaimedReward[msg.sender], "Reward already claimed");

        // Second Guard: Asks the ProofOfAI contract if the user is eligible.
        require(proofOfAIContract.isEligibleForReward(msg.sender), "Not eligible for reward");

        // If both guards let you pass, you get the reward!
        uint256 rewardAmount = 100 * (10 ** 18); // A reward of 100 QAIN tokens

        hasClaimedReward[msg.sender] = true; // Mark them on the checklist
        qainToken.transfer(msg.sender, rewardAmount); // Send the tokens

        emit RewardDistributed(msg.sender, rewardAmount);
    }

    // A function for the owner to put tokens into this contract
    function depositTokens(uint256 amount) public onlyOwner {
        qainToken.transferFrom(msg.sender, address(this), amount);
    }

    // A function for the owner to withdraw extra tokens
    function withdrawExcessTokens() public onlyOwner {
        qainToken.transfer(owner(), qainToken.balanceOf(address(this)));
    }
}
