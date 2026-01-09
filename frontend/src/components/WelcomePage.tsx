import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './WelcomePage.module.css'

const WelcomePage: React.FC = () => {
  const navigate = useNavigate()
  const [message, setMessage] = useState<string>('')
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false)

  const handleResponse = (response: 'yes' | 'no') => {
    if (isRedirecting) return

    setIsRedirecting(true)
    
    if (response === 'yes') {
      setMessage('YESSS!!!')
    } else {
      setMessage('Sadge :(')
    }

    setTimeout(() => {
      navigate('/buy')
    }, 2000)
  }

  if (isRedirecting) {
    return (
      <div className={styles.container}>
        <div className={styles.messageContainer}>
          <h1 className={styles.message}>{message}</h1>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.question}>Do you love Cyrene?</h1>
        <div className={styles.buttonContainer}>
          <button 
            className={styles.button}
            onClick={() => handleResponse('yes')}
          >
            YES
          </button>
          <button 
            className={styles.button}
            onClick={() => handleResponse('no')}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage