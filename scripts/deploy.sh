#!/bin/bash

# Deployment script for Chibbi-Cyrene NFT

echo "🚀 Chibbi-Cyrene NFT Deployment Script"
echo "====================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with:"
    echo "PRIVATE_KEY=your_private_key"
    echo "BASE_URI=your_metadata_base_uri"
    exit 1
fi

# Load environment variables
source .env

# Check if required variables are set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set in .env file"
    exit 1
fi

if [ -z "$BASE_URI" ]; then
    echo "⚠️  BASE_URI not set in .env file"
    echo "Using default: https://api.chibbi-cyrene.com/metadata/"
    export BASE_URI="https://api.chibbi-cyrene.com/metadata/"
fi

echo "🔍 Configuration:"
echo "Base URI: $BASE_URI"
echo ""

# Build contracts
echo "🔨 Building contracts..."
forge build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
forge test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed!"
    exit 1
fi

# Deploy to Sepolia
echo "🌐 Deploying to Sepolia..."
forge script script/DeployChibbiCyrene.s.sol --rpc-url sepolia --broadcast

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Note the contract address from the deployment output"
    echo "2. Update CONTRACT_ADDRESS in frontend/src/config/wagmi.ts"
    echo "3. Upload your images and metadata to IPFS"
    echo "4. Update the base URI using: cast send <CONTRACT_ADDRESS> 'setBaseURI(string)' <NEW_BASE_URI> --rpc-url sepolia --private-key $PRIVATE_KEY"
    echo "5. Verify contract (optional): make verify CONTRACT_ADDRESS=<address>"
else
    echo "❌ Deployment failed!"
    exit 1
fi