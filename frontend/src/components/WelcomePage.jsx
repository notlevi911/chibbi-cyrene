import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './WelcomePage.module.css'

function WelcomePage() {
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const navigate = useNavigate()

  const handleYes = () => {
    setMessage('yay ur awesome')
    setShowMessage(true)
    setTimeout(() => {
      navigate('/buy')
    }, 2000)
  }

  const handleNo = () => {
    setMessage('u suck')
    setShowMessage(true)
    setTimeout(() => {
      navigate('/buy')
    }, 2000)
  }

  if (showMessage) {
    return (
      <div className={styles.container}>
        <div className={styles.messageContainer}>
          <h1 className={styles.message}>{message}</h1>
          <p className={styles.redirect}>Redirecting to buy page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Do you love Cyrene?</h1>
        <div className={styles.buttons}>
          <button 
            className={`${styles.button} ${styles.yesButton}`}
            onClick={handleYes}
          >
            YES
          </button>
          <button 
            className={`${styles.button} ${styles.noButton}`}
            onClick={handleNo}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage