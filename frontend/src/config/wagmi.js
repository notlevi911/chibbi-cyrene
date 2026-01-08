import { http, createConfig } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { metaMask, walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

// You can get a project ID from https://cloud.walletconnect.com
const projectId = 'a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2' // Generic project ID for demo

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(), // For browser extension wallets (MetaMask, etc.)
    metaMask({
      dappMetadata: {
        name: 'Chibbi Cyrene NFT',
        url: 'https://localhost:5174',
      }
    }),
    coinbaseWallet({
      appName: 'Chibbi Cyrene NFT',
      appLogoUrl: 'https://via.placeholder.com/256x256/667eea/white?text=CC'
    }),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Chibbi Cyrene NFT',
        description: 'Mint your Chibbi Cyrene NFT',
        url: 'https://localhost:5174',
        icons: ['https://via.placeholder.com/256x256/667eea/white?text=CC']
      }
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
})

export const CONTRACT_ADDRESS = '0xbe871568953ba822f245343140adff5e115aa4f5'