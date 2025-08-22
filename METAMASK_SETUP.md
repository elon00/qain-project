# 🔗 MetaMask Wallet Integration Guide for QAIN Project

## 🚀 **LIVE PREVIEW LINKS**

### **Frontend Interface**

**URL:** https://qain-frontend.loca.lt
**Status:** ✅ Live & Ready for MetaMask Connection

### **Backend Services**

- **Yellow Adapter:** https://qain-yellow-adapter.loca.lt
- **Quantum Service:** https://qain-quantum-service.loca.lt

---

## 📱 **Step 1: Install MetaMask**

1. **Download MetaMask Extension:**

   - Visit [metamask.io](https://metamask.io)
   - Click "Download" and install for your browser
   - Create a new wallet or import existing one

2. **Secure Your Wallet:**
   - Write down your 12-word seed phrase
   - Store it safely offline
   - Set a strong password

---

## 🔧 **Step 2: Configure Network for Yellow Network**

### **Option A: Add Yellow Network Manually**

1. Open MetaMask
2. Click the network dropdown (usually shows "Ethereum Mainnet")
3. Select "Add Network" → "Add Network Manually"
4. Fill in these details:

```
Network Name: Yellow Network
New RPC URL: https://rpc.yellow.org (or your testnet RPC)
Chain ID: 1234 (update with actual Yellow Network ID)
Currency Symbol: YELLOW
Block Explorer URL: https://explorer.yellow.org
```

### **Option B: Use Testnet (Recommended for Hackathon)**

1. In MetaMask, switch to "Sepolia" or "Goerli" testnet
2. Get test ETH from a faucet
3. Use these networks for development

---

## 💰 **Step 3: Get Test Tokens**

### **For Testnets:**

- **Sepolia Faucet:** [sepoliafaucet.com](https://sepoliafaucet.com)
- **Goerli Faucet:** [goerlifaucet.com](https://goerlifaucet.com)

### **For Yellow Network:**

- Check Yellow Network documentation for faucet
- Or ask in the community: [t.me/+EJ7VlpuqmfZkYmVl](https://t.me/+EJ7VlpuqmfZkYmVl)

---

## 🌐 **Step 4: Connect to QAIN Frontend**

1. **Open the Frontend:**

   - Visit: https://qain-frontend.loca.lt
   - You'll see the QAIN interface

2. **Connect MetaMask:**

   - Click "Connect MetaMask" button
   - MetaMask will pop up asking for permission
   - Click "Connect" to approve

3. **Verify Connection:**
   - Your wallet address should appear
   - Network information should display
   - ETH balance should show

---

## 🤖 **Step 5: Interact with Smart Contracts**

### **Before You Start:**

You need to deploy your smart contracts and update the addresses in the frontend:

1. **Deploy Contracts:**

   ```bash
   cd contracts
   npx hardhat compile
   npx hardhat deploy --network yellow
   ```

2. **Update Frontend:**
   - Open `index.html`
   - Find `CONTRACT_ADDRESSES` section
   - Replace placeholder addresses with deployed ones

### **Available Actions:**

#### **Submit AI Proof:**

1. Generate a quantum random number using the button
2. Enter AI instructions hash (32 bytes)
3. Click "Submit Proof"
4. Confirm transaction in MetaMask

#### **Check Balances:**

1. Click "Check Balance" to see:
   - QAIN token balance
   - Valid proof count
   - Reward eligibility

#### **Claim Rewards:**

1. Ensure you have valid proofs
2. Click "Claim Reward"
3. Confirm transaction in MetaMask

---

## 🔍 **Step 6: Troubleshooting**

### **Common Issues:**

#### **"MetaMask not installed"**

- Install MetaMask browser extension
- Refresh the page

#### **"Wrong network"**

- Switch to correct network in MetaMask
- Add Yellow Network if not available

#### **"Transaction failed"**

- Check gas fees
- Ensure sufficient balance
- Verify network connection

#### **"Contract not found"**

- Deploy contracts first
- Update contract addresses in frontend
- Check network compatibility

---

## 🎯 **Step 7: Advanced Features**

### **ERC-7824 Integration:**

Your project uses the ERC-7824 standard for AI proofs:

```javascript
// Example: Submit AI proof
const metadataHash = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("AI instructions here")
);
const outputHash = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("AI output here")
);

await proofOfAIContract.submitProof(metadataHash, outputHash);
```

### **Quantum Integration:**

- Generate quantum random numbers
- Use them for proof generation
- Ensure cryptographic security

---

## 🚀 **Step 8: Deploy to Production**

### **For Yellow Network Mainnet:**

1. Ensure contracts are audited
2. Test thoroughly on testnet
3. Update RPC URLs and contract addresses
4. Deploy with sufficient gas

### **For Other Networks:**

1. Update network configuration
2. Modify contract addresses
3. Test cross-chain compatibility

---

## 📚 **Additional Resources**

- **Yellow Network Docs:** [docs.yellow.org](https://docs.yellow.org)
- **ERC-7824 Standard:** [erc7824.org](https://erc7824.org)
- **MetaMask Docs:** [docs.metamask.io](https://docs.metamask.io)
- **Community:** [t.me/+EJ7VlpuqmfZkYmVl](https://t.me/+EJ7VlpuqmfZkYmVl)

---

## 🎉 **You're Ready!**

Your QAIN project is now fully integrated with MetaMask and ready for:

- ✅ Wallet connections
- ✅ Smart contract interactions
- ✅ AI proof submissions
- ✅ Token rewards
- ✅ Quantum number generation

**Happy hacking! 🚀**
