import React from 'react'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import styles from './ConnectWallet.module.css'

const ConnectWallet: React.FC = () => {
  const { isConnected } = useAccount()
  const { open } = useAppKit()

  if (isConnected) {
    return null
  }

  return (
    <button 
      className={styles.connectButton}
      onClick={() => open()}
    >
      Connect Wallet
    </button>
  )
}

export default ConnectWallet