// src/Home.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import AppCalls from './components/AppCalls'
import DonorDashboard from './components/donor/DonorDashboard'
import DonationForm from './components/donor/DonationForm'
import NGOPortal from './components/ngo/NGOPortal'
import { detectUserRole } from './utils/humanitarian'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const [openDonationForm, setOpenDonationForm] = useState<boolean>(false)
  const [currentView, setCurrentView] = useState<'landing' | 'donor' | 'ngo'>('landing')
  const { activeAddress } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }

  const toggleAppCallsModal = () => {
    setAppCallsDemoModal(!appCallsDemoModal)
  }

  // Show different views based on selection
  if (currentView === 'donor') {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <div className="navbar bg-white shadow-sm">
            <div className="navbar-start">
              <button 
                className="btn btn-ghost normal-case text-xl"
                onClick={() => setCurrentView('landing')}
              >
                🫶 Aidchain
              </button>
            </div>
            <div className="navbar-center">
              <span className="text-lg font-semibold">Donor Portal</span>
            </div>
            <div className="navbar-end">
              <button 
                className="btn btn-ghost"
                onClick={toggleWalletModal}
              >
                {activeAddress ? `${activeAddress.slice(0, 8)}...` : 'Connect Wallet'}
              </button>
            </div>
          </div>

          <DonorDashboard onOpenDonationForm={() => setOpenDonationForm(true)} />
        </div>

        <DonationForm 
          isOpen={openDonationForm} 
          onClose={() => setOpenDonationForm(false)} 
        />
        <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      </>
    )
  }

  if (currentView === 'ngo') {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <div className="navbar bg-white shadow-sm">
            <div className="navbar-start">
              <button 
                className="btn btn-ghost normal-case text-xl"
                onClick={() => setCurrentView('landing')}
              >
                🫶 Aidchain
              </button>
            </div>
            <div className="navbar-center">
              <span className="text-lg font-semibold">NGO Portal</span>
            </div>
            <div className="navbar-end">
              <button 
                className="btn btn-ghost"
                onClick={toggleWalletModal}
              >
                {activeAddress ? `${activeAddress.slice(0, 8)}...` : 'Connect Wallet'}
              </button>
            </div>
          </div>

          <NGOPortal />
        </div>

        <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      </>
    )
  }

  // Landing page
  return (
    <div className="hero min-h-screen bg-gradient-to-br from-blue-400 via-teal-400 to-green-400">
      <div className="hero-content text-center">
        <div className="max-w-2xl bg-white rounded-xl p-8 shadow-2xl">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to <span className="text-primary">Aidchain</span> 🫶
          </h1>
          <p className="py-6 text-lg text-gray-600">
            Transparent humanitarian aid on the Algorand blockchain. Track every donation from donor to beneficiary with complete transparency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="card bg-blue-50 border border-blue-200">
              <div className="card-body">
                <h3 className="card-title text-blue-800">💝 Donors</h3>
                <p className="text-sm">Make donations and track their real-world impact</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setCurrentView('donor')}
                >
                  Enter Donor Portal
                </button>
              </div>
            </div>

            <div className="card bg-green-50 border border-green-200">
              <div className="card-body">
                <h3 className="card-title text-green-800">🏥 NGOs</h3>
                <p className="text-sm">Manage campaigns and distribute aid transparently</p>
                <button 
                  className="btn btn-success"
                  onClick={() => setCurrentView('ngo')}
                >
                  Enter NGO Portal
                </button>
              </div>
            </div>
          </div>

          <div className="divider">Original Demo Features</div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              className="btn btn-outline btn-sm"
              onClick={toggleWalletModal}
            >
              🔗 Connect Wallet
            </button>

            {activeAddress && (
              <button 
                className="btn btn-outline btn-sm"
                onClick={toggleDemoModal}
              >
                💸 Transaction Demo
              </button>
            )}

            {activeAddress && (
              <button 
                className="btn btn-outline btn-sm"
                onClick={toggleAppCallsModal}
              >
                📞 Contract Demo
              </button>
            )}
            
            <a
              className="btn btn-outline btn-sm"
              target="_blank"
              href="https://github.com/algorandfoundation/algokit-cli"
            >
              📚 AlgoKit Docs
            </a>
          </div>

          <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
          <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
          <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />
        </div>
      </div>
    </div>
  )
}

export default Home
