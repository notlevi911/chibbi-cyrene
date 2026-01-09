import React, { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import ConnectWallet from './ConnectWallet'
import ChibbiCyreneContract from '../contracts/ChibbiCyrene.json'
import styles from './BuyPage.module.css'

const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || '0xbe871568953ba822f245343140adff5e115aa4f5') as `0x${string}`

interface ContractStats {
  totalSupply: number
  maxSupply: number
  mintPrice: string
  mintingActive: boolean
}

const BuyPage: React.FC = () => {
  const { isConnected, address } = useAccount()
  const [quantity, setQuantity] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // Contract read hooks
  const { data: totalSupply, error: totalSupplyError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ChibbiCyreneContract.abi,
    functionName: 'totalSupply',
  })

  const { data: maxSupply, error: maxSupplyError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ChibbiCyreneContract.abi,
    functionName: 'MAX_SUPPLY',
  })

  const { data: mintPrice, error: mintPriceError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ChibbiCyreneContract.abi,
    functionName: 'MINT_PRICE',
  })

  const { data: mintingActive, error: mintingActiveError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ChibbiCyreneContract.abi,
    functionName: 'mintingActive',
  })

  // Contract write hook
  const { writeContract, isPending, data: hash, error: writeError } = useWriteContract()

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}`,
  })

  // Check for contract read errors
  const contractError = totalSupplyError || maxSupplyError || mintPriceError || mintingActiveError

  // Calculate stats
  const stats: ContractStats = {
    totalSupply: Number(totalSupply || 0),
    maxSupply: Number(maxSupply || 100),
    mintPrice: mintPrice ? formatEther(mintPrice as bigint) : '0.01',
    mintingActive: mintingActive === true,
  }

  const remainingSupply = stats.maxSupply - stats.totalSupply

  // Handle mint function
  const handleMint = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet')
      return
    }

    if (!stats.mintingActive) {
      setError('Minting is not active')
      return
    }

    if (quantity > remainingSupply) {
      setError('Not enough supply remaining')
      return
    }

    if (quantity < 1 || quantity > 10) {
      setError('Quantity must be between 1 and 10')
      return
    }

    try {
      setError('')
      setIsLoading(true)

      const totalCost = parseEther((Number(stats.mintPrice) * quantity).toString())

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ChibbiCyreneContract.abi,
        functionName: 'mint',
        args: [BigInt(quantity)],
        value: totalCost,
      })
    } catch (err: any) {
      console.error('Minting error:', err)
      setError(err.message || 'Failed to mint NFT')
      setIsLoading(false)
    }
  }

  // Handle quantity change
  const adjustQuantity = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= 10 && newQuantity <= remainingSupply) {
      setQuantity(newQuantity)
    }
  }

  // Reset loading state when transaction is confirmed or fails
  useEffect(() => {
    if (writeError) {
      setError(writeError.message || 'Transaction failed')
      setIsLoading(false)
    }
    if (isConfirmed) {
      setError('')
      setIsLoading(false)
    }
    if (isPending) {
      setIsLoading(true)
    }
  }, [isConfirmed, isPending, writeError])

  const totalCost = Number(stats.mintPrice) * quantity

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.nftPreview}>
          <img 
            src="https://ipfs.io/ipfs/bafybeianfxhbsenxx2okz47x4yfjthbiqgtr2a7giuhgzlv5fcnzryukfy" 
            alt="Chibbi Cyrene NFT" 
            className={styles.nftImage}
          />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>Chibbi Cyrene NFT</h1>
          
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.label}>Price:</span>
              <span className={styles.value}>{stats.mintPrice} ETH</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Supply:</span>
              <span className={styles.value}>{remainingSupply} left</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Status:</span>
              <span className={`${styles.value} ${stats.mintingActive ? styles.active : styles.inactive}`}>
                {stats.mintingActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {!isConnected ? (
            <ConnectWallet />
          ) : contractError ? (
            <div className={styles.error}>
              Failed to load contract data. Please check your network connection.
            </div>
          ) : (
            <div className={styles.mintSection}>
              <div className={styles.quantitySelector}>
                <button 
                  className={styles.quantityButton}
                  onClick={() => adjustQuantity(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className={styles.quantity}>{quantity}</span>
                <button 
                  className={styles.quantityButton}
                  onClick={() => adjustQuantity(1)}
                  disabled={quantity >= 10 || quantity >= remainingSupply}
                >
                  +
                </button>
              </div>

              <div className={styles.totalCost}>
                Total: {totalCost.toFixed(4)} ETH
              </div>

              <button 
                className={styles.mintButton}
                onClick={handleMint}
                disabled={
                  isLoading || 
                  isPending || 
                  isConfirming || 
                  !stats.mintingActive || 
                  remainingSupply === 0
                }
              >
                {isLoading || isPending || isConfirming 
                  ? 'Minting...' 
                  : `Mint ${quantity} NFT${quantity > 1 ? 's' : ''}`
                }
              </button>

              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}

              {hash && (
                <div className={styles.success}>
                  <p>Transaction submitted!</p>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${hash}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.etherscanLink}
                  >
                    View on Etherscan
                  </a>
                </div>
              )}

              {isConfirmed && (
                <div className={styles.confirmed}>
                  <p>🎉 NFT minted successfully!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyPage