import { useState, useEffect } from 'react'
import { useAccount, useDisconnect, useWriteContract, useReadContract } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACT_ADDRESS } from '../config/wagmi'
import contractData from '../contracts/ChibbiCyrene.json'
import ConnectWallet from './ConnectWallet'
import styles from './BuyPage.module.css'

function BuyPage() {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')

  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  
  const { writeContract } = useWriteContract()

  // Clear error when connection status changes
  useEffect(() => {
    if (isConnected) {
      setError('')
    }
  }, [isConnected])

  // Read contract data
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractData.abi,
    functionName: 'totalSupply',
  })

  const { data: maxSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractData.abi,
    functionName: 'MAX_SUPPLY',
  })

  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractData.abi,
    functionName: 'MINT_PRICE',
  })

  const { data: mintingActive } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractData.abi,
    functionName: 'mintingActive',
  })

  const handleMint = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    if (!mintingActive) {
      setError('Minting is not currently active')
      return
    }

    setIsLoading(true)
    setError('')
    setTxHash('')

    try {
      const totalCost = parseEther((0.01 * quantity).toString())
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractData.abi,
        functionName: 'mint',
        args: [quantity],
        value: totalCost,
      })

      setTxHash(hash)
    } catch (error) {
      console.error('Minting error:', error)
      setError(error.message || 'Failed to mint NFT')
    } finally {
      setIsLoading(false)
    }
  }

  const connectWallet = async () => {
    try {
      setError('')
      if (connectors[0]) {
        await connect({ connector: connectors[0] })
      }
    } catch (error) {
      console.error('Connection failed:', error)
      setError('Failed to connect wallet. Please try again.')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Chibbi Cyrene NFT</h1>
        
        <div className={styles.nftPreview}>
          <img 
            src="https://ipfs.io/ipfs/bafybeianfxhbsenxx2okz47x4yfjthbiqgtr2a7giuhgzlv5fcnzryukfy" 
            alt="Chibbi Cyrene NFT" 
            className={styles.nftImage}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300/667eea/white?text=Chibbi+Cyrene+NFT'
            }}
          />
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Price</span>
            <span className={styles.statValue}>0.01 ETH</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Supply</span>
            <span className={styles.statValue}>
              {maxSupply && totalSupply ? (Number(maxSupply) - Number(totalSupply)).toString() : maxSupply?.toString() || '100'} left
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Status</span>
            <span className={`${styles.statValue} ${mintingActive ? styles.active : styles.inactive}`}>
              {mintingActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {!isConnected ? (
          <ConnectWallet />
        ) : (
          <div className={styles.mintSection}>
            <p className={styles.walletAddress}>
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            <button 
              className={styles.disconnectButton}
              onClick={() => disconnect()}
            >
              Disconnect
            </button>

            <div className={styles.quantitySelector}>
              <label className={styles.quantityLabel}>Quantity</label>
              <div className={styles.quantityControls}>
                <button 
                  className={styles.quantityButton}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button 
                  className={styles.quantityButton}
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.totalCost}>
              Total: {(0.01 * quantity).toFixed(3)} ETH
            </div>

            <button 
              className={styles.mintButton}
              onClick={handleMint}
              disabled={isLoading || !mintingActive}
            >
              {isLoading ? 'Minting...' : `Mint ${quantity} NFT${quantity > 1 ? 's' : ''}`}
            </button>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {txHash && (
          <div className={styles.success}>
            <p>✅ Minting successful!</p>
            <a 
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.txLink}
            >
              View transaction
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default BuyPage