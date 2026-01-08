const fs = require('fs')
const path = require('path')

// Configuration
const COLLECTION_NAME = "Chibbi-Cyrene"
const COLLECTION_DESCRIPTION = "A unique Chibbi-Cyrene NFT from the exclusive 100-piece collection."
const EXTERNAL_URL = "https://chibbi-cyrene.com"
const IMAGE_BASE_URL = "https://gateway.pinata.cloud/ipfs/YOUR_IMAGES_HASH" // Update after uploading images
const TOTAL_SUPPLY = 100

// Sample traits - customize these based on your actual images
const TRAITS = {
  background: ["Purple", "Blue", "Pink", "Green", "Gold"],
  expression: ["Happy", "Wink", "Surprised", "Cool", "Sleepy"],
  accessories: ["None", "Crown", "Glasses", "Hat", "Necklace"],
  rarity: ["Common", "Rare", "Epic", "Legendary"]
}

// Function to randomly select traits
function generateTraits(tokenId) {
  // You can make this more sophisticated with rarity weights
  return [
    {
      trait_type: "Background",
      value: TRAITS.background[tokenId % TRAITS.background.length]
    },
    {
      trait_type: "Expression", 
      value: TRAITS.expression[Math.floor(tokenId / 20) % TRAITS.expression.length]
    },
    {
      trait_type: "Accessories",
      value: TRAITS.accessories[Math.floor(tokenId / 10) % TRAITS.accessories.length]
    },
    {
      trait_type: "Rarity",
      value: tokenId < 80 ? "Common" : tokenId < 95 ? "Rare" : tokenId < 99 ? "Epic" : "Legendary"
    }
  ]
}

// Generate metadata for all tokens
function generateAllMetadata() {
  // Create metadata directory
  const metadataDir = path.join(__dirname, 'metadata')
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir)
  }

  for (let tokenId = 0; tokenId < TOTAL_SUPPLY; tokenId++) {
    const metadata = {
      name: `${COLLECTION_NAME} #${tokenId}`,
      description: COLLECTION_DESCRIPTION,
      image: `${IMAGE_BASE_URL}/${tokenId}.png`,
      external_url: EXTERNAL_URL,
      attributes: generateTraits(tokenId)
    }

    const fileName = path.join(metadataDir, `${tokenId}.json`)
    fs.writeFileSync(fileName, JSON.stringify(metadata, null, 2))
    
    console.log(`Generated metadata for token ${tokenId}`)
  }

  console.log(`\n✅ Generated metadata for ${TOTAL_SUPPLY} tokens!`)
  console.log(`📁 Files saved in: ${metadataDir}`)
  console.log(`\n📋 Next steps:`)
  console.log(`1. Upload your 100 images (0.png to 99.png) to IPFS`)
  console.log(`2. Update IMAGE_BASE_URL in this script with your IPFS hash`)
  console.log(`3. Run this script again to update metadata`)
  console.log(`4. Upload the metadata folder to IPFS`)
  console.log(`5. Update BASE_URI in your .env file`)
}

// Run the generator
generateAllMetadata()