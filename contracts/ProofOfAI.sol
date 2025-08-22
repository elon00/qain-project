// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ProofOfAI is Ownable {
    struct AIProof {
        address submitter;      // Who submitted the proof
        uint256 timestamp;      // When they submitted it
        bytes32 metadataHash;   // Fingerprint of the AI's instructions
        bytes32 outputHash;     // Fingerprint of the AI's results
        bool isValid;           // A stamp to show if it's been verified
    }

    mapping(uint256 => AIProof) public proofs;
    uint256 public proofCount;

    // Keeps track of how many valid proofs a user has
    mapping(address => uint256) public userValidProofCount;

    event ProofSubmitted(uint256 indexed proofId, address indexed submitter, bytes32 metadataHash, bytes32 outputHash);
    event ProofVerified(uint256 indexed proofId, address indexed verifier);

    constructor() {
        proofCount = 0;
    }

    function submitProof(bytes32 _metadataHash, bytes32 _outputHash) public {
        proofCount++;
        proofs[proofCount] = AIProof({
            submitter: msg.sender,
            timestamp: block.timestamp,
            metadataHash: _metadataHash,
            outputHash: _outputHash,
            isValid: false // Not verified yet!
        });
        emit ProofSubmitted(proofCount, msg.sender, _metadataHash, _outputHash);
    }

    // Only the owner can verify a proof
    function verifyProof(uint256 _proofId) public onlyOwner {
        require(_proofId > 0 && _proofId <= proofCount, "Invalid proof ID");
        AIProof storage proof = proofs[_proofId];
        require(!proof.isValid, "Proof already verified");

        proof.isValid = true;
        userValidProofCount[proof.submitter]++; // Add 1 to their valid proof count
        emit ProofVerified(_proofId, msg.sender);
    }

    // A function to check if a user should get a reward
    function isEligibleForReward(address _user) public view returns (bool) {
        return userValidProofCount[_user] > 0;
    }
}
