import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia } from '@reown/appkit/networks'
import { http } from 'viem'
import { createConfig } from 'wagmi'

// 1. Get projectId from https://cloud.reown.com
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || 'demo-project-id'

// 2. Create a manual wagmi config with custom RPC
const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com')
  }
})

// 3. Create adapter (we pass the config via a different method)
const wagmiAdapter = new WagmiAdapter({
  networks: [sepolia],
  projectId
})

// Override the adapter's wagmiConfig with our custom one
Object.defineProperty(wagmiAdapter, 'wagmiConfig', {
  value: wagmiConfig,
  writable: false
})

// 4. Configure the modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [sepolia],
  projectId,
  metadata: {
    name: 'Chibbi Cyrene NFT',
    description: 'Mint your Chibbi Cyrene NFT',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://cyrene-nft.com',
    icons: ['https://ipfs.io/ipfs/bafybeianfxhbsenxx2okz47x4yfjthbiqgtr2a7giuhgzlv5fcnzryukfy']
  },
  features: {
    analytics: false
  }
})

// 5. Export config
export const config = wagmiConfig
export { sepolia as defaultChain }