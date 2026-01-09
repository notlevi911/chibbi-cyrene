import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import WelcomePage from './components/WelcomePage'
import BuyPage from './components/BuyPage'
import './App.css'

const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/buy" element={<BuyPage />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App