#!/bin/bash

echo "🚀 Chibbi-Cyrene NFT Deployment & Frontend Launcher"
echo "=================================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and add your private key."
    exit 1
fi

# Source the environment variables
source .env

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set in .env file."
    exit 1
fi

echo "✅ Environment check passed"

# Deploy smart contract
echo ""
echo "📝 Deploying smart contract to Sepolia..."
CONTRACT_OUTPUT=$(forge script script/DeployChibbiCyrene.s.sol --rpc-url sepolia --broadcast 2>&1)

if [[ $CONTRACT_OUTPUT == *"ONCHAIN EXECUTION COMPLETE & SUCCESSFUL"* ]]; then
    # Extract contract address from output
    CONTRACT_ADDRESS=$(echo "$CONTRACT_OUTPUT" | grep -E "ChibbiCyrene NFT deployed to: 0x[a-fA-F0-9]{40}" | grep -oE "0x[a-fA-F0-9]{40}")
    
    if [ ! -z "$CONTRACT_ADDRESS" ]; then
        echo "✅ Contract deployed successfully!"
        echo "📍 Contract Address: $CONTRACT_ADDRESS"
        
        # Update frontend config
        echo ""
        echo "🔧 Updating frontend configuration..."
        
        # Update the CONTRACT_ADDRESS in the frontend config
        sed -i.bak "s/export const CONTRACT_ADDRESS = ''/export const CONTRACT_ADDRESS = '$CONTRACT_ADDRESS'/" frontend/src/config/wagmi.ts
        rm frontend/src/config/wagmi.ts.bak
        
        echo "✅ Frontend configuration updated"
        
        # Start the frontend
        echo ""
        echo "🌐 Starting frontend development server..."
        cd frontend
        npm run dev &
        
        echo ""
        echo "🎉 Deployment complete!"
        echo "📍 Contract Address: $CONTRACT_ADDRESS"
        echo "🌐 Frontend URL: http://localhost:3000"
        echo "🔍 Etherscan: https://sepolia.etherscan.io/address/$CONTRACT_ADDRESS"
        echo ""
        echo "You can now:"
        echo "1. Visit http://localhost:3000 to see your NFT frontend"
        echo "2. Connect your wallet and test minting"
        echo "3. View your contract on Sepolia Etherscan"
        
    else
        echo "❌ Could not extract contract address from deployment output"
        echo "$CONTRACT_OUTPUT"
    fi
else
    echo "❌ Contract deployment failed:"
    echo "$CONTRACT_OUTPUT"
fi