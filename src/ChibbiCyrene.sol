// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ChibbiCyrene is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    
    uint256 public constant MAX_SUPPLY = 100;
    uint256 public constant MINT_PRICE = 0.01 ether;
    string private _baseTokenURI;
    
    bool public mintingActive = true;
    
    event MintSuccessful(address indexed to, uint256 indexed tokenId);
    event MintingToggled(bool active);
    event BaseURIUpdated(string newBaseURI);

    constructor(
        string memory _initialBaseURI
    ) ERC721("Chibbi-Cyrene", "CHIBBI") Ownable(msg.sender) {
        _baseTokenURI = _initialBaseURI;
    }

    modifier mintingIsActive() {
        require(mintingActive, "Minting is not active");
        _;
    }

    modifier supplyAvailable(uint256 quantity) {
        require(_tokenIdCounter + quantity <= MAX_SUPPLY, "Not enough supply remaining");
        _;
    }

    function mint(uint256 quantity) 
        external 
        payable 
        nonReentrant 
        mintingIsActive 
        supplyAvailable(quantity) 
    {
        require(quantity > 0 && quantity <= 10, "Invalid quantity: must be 1-10");
        require(msg.value >= MINT_PRICE * quantity, "Insufficient payment");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;
            _safeMint(msg.sender, tokenId);
            emit MintSuccessful(msg.sender, tokenId);
        }

        // Refund excess payment
        if (msg.value > MINT_PRICE * quantity) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - (MINT_PRICE * quantity)}("");
            require(success, "Refund failed");
        }
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - _tokenIdCounter;
    }

    // Owner functions
    function toggleMinting() external onlyOwner {
        mintingActive = !mintingActive;
        emit MintingToggled(mintingActive);
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function ownerMint(address to, uint256 quantity) 
        external 
        onlyOwner 
        supplyAvailable(quantity) 
    {
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;
            _safeMint(to, tokenId);
        }
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Override functions
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}