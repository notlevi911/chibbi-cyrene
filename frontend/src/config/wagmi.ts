import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'Chibbi-Cyrene NFT',
  projectId: 'your-walletconnect-project-id', // Get from https://cloud.walletconnect.com
  chains: [sepolia],
  ssr: true,
})

export const CONTRACT_ADDRESS = '' // Add after deployment
export const MINT_PRICE = '0.01' // ETH
export const MAX_SUPPLY = 100