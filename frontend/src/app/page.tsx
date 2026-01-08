'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Web3 components to prevent SSR issues
const ConnectButton = dynamic(
  () => import('@rainbow-me/rainbowkit').then(mod => ({ default: mod.ConnectButton })),
  { ssr: false, loading: () => <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" /> }
)

const NFTInfo = dynamic(
  () => import('@/components/nft/NFTInfo').then(mod => ({ default: mod.NFTInfo })),
  { ssr: false, loading: () => <div className="w-full max-w-md mx-auto h-96 bg-white rounded-xl animate-pulse" /> }
)

const MintNFT = dynamic(
  () => import('@/components/nft/MintNFT').then(mod => ({ default: mod.MintNFT })),
  { ssr: false, loading: () => <div className="w-full max-w-md mx-auto h-80 bg-white rounded-xl animate-pulse" /> }
)

export default function Home() {
  const [contractData, setContractData] = useState({
    mintPrice: '0.01',
    mintingActive: true,
    remainingSupply: 100
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Chibbi-Cyrene</h1>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* NFT Info Card */}
          <div className="flex justify-center">
            <NFTInfo onDataChange={setContractData} />
          </div>

          {/* Mint Card */}
          <div className="flex justify-center">
            <MintNFT 
              mintPrice={contractData.mintPrice}
              mintingActive={contractData.mintingActive}
              remainingSupply={contractData.remainingSupply}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-white/60">
          <p className="mb-2">Built with Foundry, Next.js, and RainbowKit</p>
          <p className="text-sm">Deployed on Sepolia Testnet</p>
        </footer>
      </main>
    </div>
  )
}