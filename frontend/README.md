# Chibbi Cyrene NFT Frontend

A React + TypeScript frontend for minting Chibbi Cyrene NFTs on Sepolia testnet.

## Features

- 🎨 Modern React 19 with TypeScript
- 💰 Web3 wallet integration with Reown AppKit (WalletConnect)
- 🔗 Ethereum contract interaction with wagmi v2
- 📱 Fully responsive design with CSS modules
- ⚡ Fast development with Vite
- 🎯 Clean UI with animated buttons and transitions

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Web3**: wagmi v2, viem, Reown AppKit  
- **Styling**: CSS Modules, responsive design
- **Routing**: React Router DOM
- **Network**: Sepolia Testnet

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment (optional):**
   ```bash
   # Get a project ID from https://cloud.reown.com for better WalletConnect support
   # Copy .env.example to .env and update:
   VITE_REOWN_PROJECT_ID=your-project-id-here
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Contract Details

- **Contract Address**: `0xbe871568953ba822f245343140adff5e115aa4f5`
- **Network**: Sepolia Testnet
- **Price**: 0.01 ETH per NFT
- **Max Supply**: 100 NFTs
- **Max Per Transaction**: 10 NFTs

## Getting Sepolia ETH

To test the minting functionality, you'll need Sepolia ETH:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Chainlink Sepolia Faucet](https://faucets.chain.link/)

## Usage

1. **Welcome Page** (`/`): Choose if you love Cyrene (both options lead to minting)
2. **Minting Page** (`/buy`): 
   - Connect your wallet
   - Select quantity (1-10)
   - Mint your NFTs
   - View transaction on Etherscan

## Project Structure

```
src/
├── components/           # React components
│   ├── WelcomePage.tsx  # Landing page with YES/NO question
│   ├── BuyPage.tsx      # Main minting interface  
│   └── ConnectWallet.tsx # Wallet connection button
├── config/
│   └── wagmi.ts         # Web3 configuration
├── contracts/
│   └── ChibbiCyrene.json # Contract ABI
├── App.tsx              # Main app with routing
└── main.tsx            # App entry point
```

## Styling

The app uses a consistent design system:
- **Font**: Bahnschrift with fallbacks
- **Colors**: Pure black background (#000), white buttons with pink hover (#ff69b4)
- **Animations**: Transform and shadow effects on hover
- **Layout**: Fullscreen, centered, responsive

## Development

The app is configured for modern development:
- Hot module replacement
- TypeScript strict mode
- ESLint configuration
- CSS Modules for scoped styling
- Optimized production builds

## Deployment

The app is ready for deployment on platforms like:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Just run `npm run build` and deploy the `dist/` folder.