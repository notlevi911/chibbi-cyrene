# Chibbi-Cyrene NFT Project

## Overview
A complete NFT project featuring:
- 100 total supply
- 0.01 ETH mint price per NFT
- Built with Foundry and OpenZeppelin
- Next.js frontend for minting

## Smart Contract Features
- **Name**: Chibbi-Cyrene
- **Symbol**: CHIBBI  
- **Total Supply**: 100 NFTs
- **Mint Price**: 0.01 ETH per NFT
- **Max mint per transaction**: 10 NFTs
- **Owner functions**: Toggle minting, withdraw funds, owner mint
- **Security**: ReentrancyGuard, Ownable access control

## Setup Instructions

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/)
- Sepolia testnet ETH
- Etherscan API key (optional, for verification)

### Smart Contract Setup

1. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env file with your private key and API keys
   ```

2. **Install Dependencies**
   ```bash
   forge install
   ```

3. **Run Tests**
   ```bash
   forge test
   ```

4. **Deploy to Sepolia**
   ```bash
   forge script script/DeployChibbiCyrene.s.sol --rpc-url sepolia --broadcast
   ```

5. **Verify Contract (Optional)**
   ```bash
   forge verify-contract <CONTRACT_ADDRESS> src/ChibbiCyrene.sol:ChibbiCyrene --chain sepolia
   ```

### Environment Variables

Add these to your `.env` file:

```env
PRIVATE_KEY=your_wallet_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here  
BASE_URI=https://api.chibbi-cyrene.com/metadata/
```

## Contract Addresses

- **Sepolia**: Will be updated after deployment

## Frontend

The Next.js frontend will be available at `/frontend` directory with features:
- Connect wallet
- View NFT collection info
- Mint functionality
- Display owned NFTs

## Foundry Commands

```bash
# Build contracts
forge build

# Test contracts
forge test

# Deploy to Sepolia
forge script script/DeployChibbiCyrene.s.sol --rpc-url sepolia --broadcast

# Verify contract
forge verify-contract <CONTRACT_ADDRESS> src/ChibbiCyrene.sol:ChibbiCyrene --chain sepolia

# Format code
forge fmt

# Gas snapshots
forge snapshot
```
