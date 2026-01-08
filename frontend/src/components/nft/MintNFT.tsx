'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Minus, Plus, Loader2 } from 'lucide-react'
import { CONTRACT_ADDRESS } from '@/config/wagmi'
import { CONTRACT_ABI } from '@/types/contract'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MintNFTProps {
  mintPrice: string
  mintingActive: boolean
  remainingSupply: number
}

export function MintNFT({ mintPrice, mintingActive, remainingSupply }: MintNFTProps) {
  const [quantity, setQuantity] = useState(1)
  const { address, isConnected } = useAccount()
  
  const { 
    writeContract, 
    data: hash, 
    isPending, 
    error 
  } = useWriteContract()

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  })

  const handleMint = async () => {
    if (!CONTRACT_ADDRESS) {
      alert('Contract not deployed yet!')
      return
    }

    const value = parseEther((parseFloat(mintPrice) * quantity).toString())

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'mint',
      args: [BigInt(quantity)],
      value
    })
  }

  const totalCost = (parseFloat(mintPrice) * quantity).toFixed(4)
  const maxQuantity = Math.min(10, remainingSupply)

  if (!CONTRACT_ADDRESS) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <p className="text-yellow-600">Contract not deployed yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Mint Chibbi-Cyrene NFT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <div className="text-center">
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-center">
                Quantity (Max 10 per transaction)
              </label>
              <div className="flex items-center justify-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center justify-center w-16 h-10 border border-gray-300 rounded-md bg-white text-center font-semibold">
                  {quantity}
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center text-sm text-gray-600">
                Remaining: {remainingSupply}
              </div>
            </div>

            {/* Cost Display */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Total Cost</div>
              <div className="text-2xl font-bold">{totalCost} ETH</div>
              <div className="text-xs text-gray-500">
                {quantity} × {mintPrice} ETH
              </div>
            </div>

            {/* Mint Button */}
            <Button 
              onClick={handleMint}
              disabled={!mintingActive || isPending || isConfirming || remainingSupply === 0}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 text-lg"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isPending ? 'Confirming...' : 'Minting...'}
                </>
              ) : remainingSupply === 0 ? (
                'Sold Out'
              ) : !mintingActive ? (
                'Minting Inactive'
              ) : (
                `Mint ${quantity} NFT${quantity > 1 ? 's' : ''}`
              )}
            </Button>

            {/* Transaction Status */}
            {hash && (
              <div className="text-center space-y-2">
                {isConfirmed ? (
                  <div className="text-green-600 font-semibold">
                    ✅ Successfully minted {quantity} NFT{quantity > 1 ? 's' : ''}!
                  </div>
                ) : (
                  <div className="text-blue-600">
                    ⏳ Transaction submitted...
                  </div>
                )}
                <a 
                  href={`https://sepolia.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  View on Etherscan
                </a>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                Error: {error.message}
              </div>
            )}

            {/* Connected Wallet Info */}
            <div className="text-center text-sm text-gray-500">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}