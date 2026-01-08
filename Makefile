# Makefile for Chibbi-Cyrene NFT Project

.PHONY: test build deploy-sepolia verify frontend-install frontend-dev

# Default target
all: build test

# Build contracts
build:
	forge build

# Run tests
test:
	forge test -vv

# Deploy to Sepolia
deploy-sepolia:
	@echo "Deploying ChibbiCyrene to Sepolia..."
	forge script script/DeployChibbiCyrene.s.sol --rpc-url sepolia --broadcast

# Verify deployed contract (requires CONTRACT_ADDRESS)
verify:
	@if [ -z "$(CONTRACT_ADDRESS)" ]; then \
		echo "Please provide CONTRACT_ADDRESS: make verify CONTRACT_ADDRESS=0x..."; \
		exit 1; \
	fi
	forge verify-contract $(CONTRACT_ADDRESS) src/ChibbiCyrene.sol:ChibbiCyrene --chain sepolia

# Format code
fmt:
	forge fmt

# Install frontend dependencies
frontend-install:
	cd frontend && npm install

# Start frontend dev server
frontend-dev:
	cd frontend && npm run dev

# Clean build artifacts
clean:
	forge clean

# Gas snapshot
gas:
	forge snapshot