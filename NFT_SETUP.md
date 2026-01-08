# NFT Metadata & Images Setup Guide

## Structure Required

For each NFT (0-99), you need:
- `metadata/0.json` - metadata file
- `images/0.png` - image file

## Metadata Format (ERC721 Standard)

Each metadata JSON should follow this structure:

```json
{
  "name": "Chibbi-Cyrene #0",
  "description": "A unique Chibbi-Cyrene NFT from the exclusive 100-piece collection.",
  "image": "https://your-domain.com/images/0.png",
  "external_url": "https://chibbi-cyrene.com",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Purple"
    },
    {
      "trait_type": "Expression",
      "value": "Happy"
    },
    {
      "trait_type": "Accessories",
      "value": "Crown"
    },
    {
      "trait_type": "Rarity",
      "value": "Common"
    }
  ]
}
```

## Quick Setup Steps

### 1. Prepare Your Images
- Create 100 unique images (0.png to 99.png)
- Recommended: 512x512 or 1024x1024 pixels
- Format: PNG or JPG

### 2. Create Metadata Files
- Create JSON files (0.json to 99.json) 
- Each points to its corresponding image
- Include unique attributes/traits

### 3. Upload to IPFS (Recommended)
- Upload images folder → Get IPFS hash
- Update metadata files with IPFS image URLs
- Upload metadata folder → Get IPFS hash
- Use: `https://gateway.pinata.cloud/ipfs/YOUR_METADATA_HASH/`

### 4. Update Contract
- Set the base URI to your IPFS/web URL
- Deploy with correct BASE_URI

## Example URLs After Upload

If you upload to IPFS and get hash `QmYourHashHere`:
- Metadata: `https://gateway.pinata.cloud/ipfs/QmYourHashHere/0.json`
- Images: `https://gateway.pinata.cloud/ipfs/QmYourImagesHash/0.png`

## Testing
1. Visit `https://testnets.opensea.io/`
2. Connect wallet
3. Import your contract address
4. Your NFTs should show with images!