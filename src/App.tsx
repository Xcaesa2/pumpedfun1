import React, { useEffect } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import { useReferralPersistence } from './hooks/useReferralPersistence'
import Header from './components/Header';
import Hero from './components/Hero';
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReferralPageWrapper from './components/ReferralPageWrapper';

// Get projectId from environment variables
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('VITE_WALLETCONNECT_PROJECT_ID is not set. Please add it to your .env file.')
}

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true
})

// Create a client
const queryClient = new QueryClient()

function AppContent() {
  // Initialize referral persistence on app load
  useReferralPersistence()

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: '#1A1A1A' }}>
      <Header />
      <Hero />
    </div>
  )
}

function App() {
  return (
    <KindeProvider
      clientId="985cff4f5c8c424caf09494408f9ab31" // TODO: Replace with your real Kinde client ID
      domain="https://pumped.kinde.com" // TODO: Replace with your real Kinde domain
      redirectUri="http://localhost:5173"
      logoutUri="http://localhost:5173"
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/ref/:referralCode" element={<ReferralPageWrapper />} />
              <Route path="*" element={<AppContent />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </WagmiProvider>
    </KindeProvider>
  );
}

export default App;