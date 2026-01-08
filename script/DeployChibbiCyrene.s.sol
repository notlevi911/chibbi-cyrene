// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/ChibbiCyrene.sol";

contract DeployChibbiCyrene is Script {
    function run() external {
        // Read environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory baseURI = vm.envOr("BASE_URI", string("https://api.chibbi-cyrene.com/metadata/"));
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        ChibbiCyrene nftContract = new ChibbiCyrene(baseURI);

        console.log("ChibbiCyrene NFT deployed to:", address(nftContract));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Max Supply:", nftContract.MAX_SUPPLY());
        console.log("Mint Price:", nftContract.MINT_PRICE());

        vm.stopBroadcast();
    }
}