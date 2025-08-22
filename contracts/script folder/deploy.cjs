const hre = require("hardhat");

async function main() {
  console.log("Starting construction of the QAIN castle...");

  // 1. Build the QAIN Token contract
  const initialSupply = 1000000; // Let's create 1 million tokens to start
  const QAINToken = await hre.ethers.getContractFactory("QAINToken");
  const qainToken = await QAINToken.deploy(initialSupply);
  await qainToken.deployed();
  console.log(`- 🪙 QAINToken (Coin) constructed at: ${qainToken.address}`);

  // 2. Build the ProofOfAI contract
  const ProofOfAI = await hre.ethers.getContractFactory("ProofOfAI");
  const proofOfAI = await ProofOfAI.deploy();
  await proofOfAI.deployed();
  console.log(`- 📜 ProofOfAI (Record Book) constructed at: ${proofOfAI.address}`);

  // 3. Build the Rewarder contract
  // We need to tell it the address of the token and the record book!
  const Rewarder = await hre.ethers.getContractFactory("Rewarder");
  const rewarder = await Rewarder.deploy(qainToken.address, proofOfAI.address);
  await rewarder.deployed();
  console.log(`- 💰 Rewarder (Treasure Chest) constructed at: ${rewarder.address}`);

  // 4. Build the QuantumOracle contract
  const QuantumOracle = await hre.ethers.getContractFactory("QuantumOracle");
  const quantumOracle = await quantumOracle.deploy();
  await quantumOracle.deployed();
  console.log(`- 🔭 QuantumOracle (Telescope) constructed at: ${quantumOracle.address}`);

  console.log("\nCastle construction complete! All contracts are live.");
}

// This is a safety net to catch any errors during construction
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});