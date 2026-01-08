// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/ChibbiCyrene.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChibbiCyreneTest is Test {
    ChibbiCyrene public nft;
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);
    
    string constant BASE_URI = "https://api.chibbi-cyrene.com/metadata/";
    uint256 constant MINT_PRICE = 0.01 ether;
    uint256 constant MAX_SUPPLY = 100;

    event MintSuccessful(address indexed to, uint256 indexed tokenId);
    event MintingToggled(bool active);

    function setUp() public {
        vm.prank(owner);
        nft = new ChibbiCyrene(BASE_URI);
        
        // Give users some ETH for testing
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    function testInitialState() public {
        assertEq(nft.name(), "Chibbi-Cyrene");
        assertEq(nft.symbol(), "CHIBBI");
        assertEq(nft.owner(), owner);
        assertEq(nft.MAX_SUPPLY(), MAX_SUPPLY);
        assertEq(nft.MINT_PRICE(), MINT_PRICE);
        assertEq(nft.totalSupply(), 0);
        assertEq(nft.remainingSupply(), MAX_SUPPLY);
        assertTrue(nft.mintingActive());
    }

    function testMintSingle() public {
        vm.prank(user1);
        vm.expectEmit(true, true, false, true);
        emit MintSuccessful(user1, 0);
        
        nft.mint{value: MINT_PRICE}(1);
        
        assertEq(nft.balanceOf(user1), 1);
        assertEq(nft.ownerOf(0), user1);
        assertEq(nft.totalSupply(), 1);
        assertEq(nft.remainingSupply(), MAX_SUPPLY - 1);
    }

    function testMintMultiple() public {
        vm.prank(user1);
        nft.mint{value: MINT_PRICE * 3}(3);
        
        assertEq(nft.balanceOf(user1), 3);
        assertEq(nft.totalSupply(), 3);
        assertEq(nft.ownerOf(0), user1);
        assertEq(nft.ownerOf(1), user1);
        assertEq(nft.ownerOf(2), user1);
    }

    function testMintWithExcessPayment() public {
        uint256 initialBalance = user1.balance;
        uint256 excessPayment = MINT_PRICE + 0.005 ether;
        
        vm.prank(user1);
        nft.mint{value: excessPayment}(1);
        
        // Should refund the excess
        assertEq(user1.balance, initialBalance - MINT_PRICE);
        assertEq(nft.balanceOf(user1), 1);
    }

    function testMintFailsWithInsufficientPayment() public {
        vm.prank(user1);
        vm.expectRevert("Insufficient payment");
        nft.mint{value: MINT_PRICE - 1}(1);
    }

    function testMintFailsWithZeroQuantity() public {
        vm.prank(user1);
        vm.expectRevert("Invalid quantity: must be 1-10");
        nft.mint{value: MINT_PRICE}(0);
    }

    function testMintFailsWithTooLargeQuantity() public {
        vm.prank(user1);
        vm.expectRevert("Invalid quantity: must be 1-10");
        nft.mint{value: MINT_PRICE * 11}(11);
    }

    function testMintFailsWhenInactive() public {
        vm.prank(owner);
        nft.toggleMinting();
        
        vm.prank(user1);
        vm.expectRevert("Minting is not active");
        nft.mint{value: MINT_PRICE}(1);
    }

    function testMintFailsWhenSupplyExceeded() public {
        // Mint out the entire supply using owner mint
        vm.prank(owner);
        nft.ownerMint(owner, MAX_SUPPLY);
        
        vm.prank(user1);
        vm.expectRevert("Not enough supply remaining");
        nft.mint{value: MINT_PRICE}(1);
    }

    function testOwnerMint() public {
        vm.prank(owner);
        nft.ownerMint(user1, 5);
        
        assertEq(nft.balanceOf(user1), 5);
        assertEq(nft.totalSupply(), 5);
    }

    function testOwnerMintFailsForNonOwner() public {
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user1));
        nft.ownerMint(user1, 1);
    }

    function testToggleMinting() public {
        assertTrue(nft.mintingActive());
        
        vm.prank(owner);
        vm.expectEmit(false, false, false, true);
        emit MintingToggled(false);
        nft.toggleMinting();
        
        assertFalse(nft.mintingActive());
        
        vm.prank(owner);
        nft.toggleMinting();
        assertTrue(nft.mintingActive());
    }

    function testToggleMintingFailsForNonOwner() public {
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user1));
        nft.toggleMinting();
    }

    function testSetBaseURI() public {
        string memory newBaseURI = "https://new-api.chibbi-cyrene.com/metadata/";
        
        vm.prank(owner);
        nft.setBaseURI(newBaseURI);
        
        // Mint a token to test the URI
        vm.prank(user1);
        nft.mint{value: MINT_PRICE}(1);
        
        string memory expectedURI = string(abi.encodePacked(newBaseURI, "0"));
        assertEq(nft.tokenURI(0), expectedURI);
    }

    function testWithdraw() public {
        // Mint some NFTs to add funds to contract
        vm.prank(user1);
        nft.mint{value: MINT_PRICE * 5}(5);
        
        uint256 contractBalance = address(nft).balance;
        uint256 ownerInitialBalance = owner.balance;
        
        vm.prank(owner);
        nft.withdraw();
        
        assertEq(address(nft).balance, 0);
        assertEq(owner.balance, ownerInitialBalance + contractBalance);
    }

    function testWithdrawFailsWithNoFunds() public {
        vm.prank(owner);
        vm.expectRevert("No funds to withdraw");
        nft.withdraw();
    }

    function testWithdrawFailsForNonOwner() public {
        vm.prank(user1);
        nft.mint{value: MINT_PRICE}(1);
        
        vm.prank(user2);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user2));
        nft.withdraw();
    }

    function testTokenURI() public {
        vm.prank(user1);
        nft.mint{value: MINT_PRICE}(1);
        
        string memory expectedURI = string(abi.encodePacked(BASE_URI, "0"));
        assertEq(nft.tokenURI(0), expectedURI);
    }

    function testSupportsInterface() public {
        // ERC721 interface
        assertTrue(nft.supportsInterface(0x80ac58cd));
        // ERC721Metadata interface
        assertTrue(nft.supportsInterface(0x5b5e139f));
        // ERC165 interface
        assertTrue(nft.supportsInterface(0x01ffc9a7));
    }

    // Fuzz testing
    function testFuzzMint(uint8 quantity, uint256 payment) public {
        vm.assume(quantity > 0 && quantity <= 10);
        vm.assume(payment >= MINT_PRICE * quantity);
        vm.assume(quantity <= MAX_SUPPLY);
        
        vm.deal(user1, payment);
        vm.prank(user1);
        nft.mint{value: payment}(quantity);
        
        assertEq(nft.balanceOf(user1), quantity);
        assertEq(nft.totalSupply(), quantity);
    }
}