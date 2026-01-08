import { useState } from 'react'
import { useConnect, useAccount } from 'wagmi'
import styles from './ConnectWallet.module.css'

function ConnectWallet() {
  const [error, setError] = useState('')
  const { connectors, connect, status, error: connectError } = useConnect()
  const { isConnecting } = useAccount()

  const handleConnect = async () => {
    try {
      setError('')
      
      // Find injected connector (MetaMask, etc.)
      const injectedConnector = connectors.find(connector => 
        connector.type === 'injected' || connector.name === 'MetaMask'
      )
      
      if (injectedConnector) {
        await connect({ connector: injectedConnector })
      } else if (connectors.length > 0) {
        await connect({ connector: connectors[0] })
      } else {
        setError('No wallet found. Please install MetaMask.')
      }
    } catch (err) {
      console.error('Connection error:', err)
      setError('Failed to connect wallet. Please try again.')
    }
  }

  return (
    <div className={styles.walletSection}>
      <p className={styles.connectText}>
        {isConnecting ? 'Connecting...' : 'Connect your wallet to mint'}
      </p>
      
      <button 
        className={`${styles.connectButton} ${isConnecting ? styles.connecting : ''}`}
        onClick={handleConnect}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      
      {connectError && (
        <div className={styles.error}>
          {connectError.message}
        </div>
      )}
    </div>
  )
}

export default ConnectWallet