'use client'

import { useState, useEffect } from 'react'
import { useReadContract, useWatchContractEvent } from 'wagmi'
import { formatEther } from 'viem'
import { CONTRACT_ADDRESS, MAX_SUPPLY } from '@/config/wagmi'
import { CONTRACT_ABI } from '@/types/contract'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NFTInfoProps {
  onDataChange?: (data: any) => void
}

export function NFTInfo({ onDataChange }: NFTInfoProps) {
  const [contractData, setContractData] = useState({
    name: '',
    symbol: '',
    totalSupply: 0,
    remainingSupply: MAX_SUPPLY,
    mintPrice: '0.01',
    mintingActive: true
  })

  // Read contract data
  const { data: name } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'name'
  })

  const { data: symbol } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'symbol'
  })

  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'totalSupply'
  })

  const { data: remainingSupply } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'remainingSupply'
  })

  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'MINT_PRICE'
  })

  const { data: mintingActive } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'mintingActive'
  })

  // Watch for mint events to update supply
  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    eventName: 'MintSuccessful',
    onLogs() {
      // Trigger re-fetch of contract data
      window.location.reload()
    }
  })

  useEffect(() => {
    const data = {
      name: name as string || 'Chibbi-Cyrene',
      symbol: symbol as string || 'CHIBBI',
      totalSupply: Number(totalSupply) || 0,
      remainingSupply: Number(remainingSupply) || MAX_SUPPLY,
      mintPrice: mintPrice ? formatEther(mintPrice as bigint) : '0.01',
      mintingActive: mintingActive as boolean ?? true
    }
    
    setContractData(data)
    onDataChange?.(data)
  }, [name, symbol, totalSupply, remainingSupply, mintPrice, mintingActive, onDataChange])

  if (!CONTRACT_ADDRESS) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <p className="text-yellow-600">Please deploy the contract and update the CONTRACT_ADDRESS</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          {contractData.name} ({contractData.symbol})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {/* NFT Image Placeholder */}
          <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 text-center text-white">
              <div className="text-lg font-semibold mb-2">Chibbi-Cyrene</div>
              <div className="text-sm opacity-80">Upload your image!</div>
              <div className="text-xs opacity-60 mt-2">This is a placeholder</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">Price:</span>
            <span>{contractData.mintPrice} ETH</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-semibold">Total Supply:</span>
            <span>{MAX_SUPPLY}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-semibold">Minted:</span>
            <span>{contractData.totalSupply}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-semibold">Remaining:</span>
            <span>{contractData.remainingSupply}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-semibold">Status:</span>
            <span className={contractData.mintingActive ? 'text-green-600' : 'text-red-600'}>
              {contractData.mintingActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round((contractData.totalSupply / MAX_SUPPLY) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(contractData.totalSupply / MAX_SUPPLY) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}