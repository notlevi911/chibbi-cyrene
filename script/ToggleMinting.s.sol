// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/ChibbiCyrene.sol";

contract ToggleMinting is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address contractAddress = 0xbe871568953ba822f245343140adff5e115aa4f5;
        
        vm.startBroadcast(deployerPrivateKey);
        
        ChibbiCyrene nft = ChibbiCyrene(contractAddress);
        
        // Check current status
        bool currentStatus = nft.mintingActive();
        console.log("Current minting status:", currentStatus);
        
        // Toggle minting
        nft.toggleMinting();
        
        bool newStatus = nft.mintingActive();
        console.log("New minting status:", newStatus);
        
        vm.stopBroadcast();
    }
}