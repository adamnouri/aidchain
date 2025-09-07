// src/Home.tsx - New Aidchain Landing Page
import { useWallet } from '@txnlab/use-wallet-react'
import { AppClientProvider } from './context/AppClientContext'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import AppCalls from './components/AppCalls'

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const [openDonationForm, setOpenDonationForm] = useState<boolean>(false)
  const [currentView, setCurrentView] = useState<'landing' | 'donor' | 'about' | 'how-it-works' | 'get-involved'>('landing')
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

  const handleDonateNow = () => {
    if (!activeAddress) {
      // If wallet not connected, prompt connection first
      setOpenWalletModal(true)
    } else {
      // If wallet connected, go to donor portal
      setCurrentView('donor')
    }
  }

  // Donor Portal View - Placeholder for Figma implementation
  if (currentView === 'donor') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="navbar bg-white shadow-sm">
          <div className="navbar-start">
            <button 
              className="btn btn-ghost normal-case text-xl text-blue-600 font-bold"
              onClick={() => setCurrentView('landing')}
            >
              ■ Aidchain
            </button>
          </div>
          <div className="navbar-end">
            <button 
              className="btn btn-ghost text-blue-600"
              onClick={toggleWalletModal}
            >
              {activeAddress ? `${activeAddress.slice(0, 8)}...` : 'Connect Wallet'}
            </button>
          </div>
        </div>

        <div className="container mx-auto p-6">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Donor Dashboard</h1>
            <p className="text-gray-600 mb-8">
              This is a placeholder for your Figma donor dashboard design.
            </p>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">Ready to Implement Your Design!</h3>
              <p className="text-gray-600 mb-6">
                Once you share more Figma designs, I'll implement the donor dashboard, 
                donation forms, and all the interactive elements here.
              </p>
              <button 
                onClick={() => setOpenDonationForm(true)}
                className="btn bg-blue-600 text-white hover:bg-blue-700"
              >
                Test Donation Form (Coming Soon)
              </button>
            </div>
          </div>
        </div>

        <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      </div>
    )
  }

  // Placeholder Pages
  if (currentView === 'about') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
        <nav className="flex justify-between items-center p-6">
          <button 
            onClick={() => setCurrentView('landing')}
            className="text-white text-xl font-bold flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-black rounded"></div>
            Aidchain
          </button>
          <div className="flex gap-6">
            <button onClick={() => setCurrentView('get-involved')} className="text-white hover:text-blue-200">Get Involved</button>
            <button onClick={() => setCurrentView('how-it-works')} className="text-white hover:text-blue-200">How it works</button>
            <button onClick={() => setCurrentView('about')} className="text-white hover:text-blue-200">About Us</button>
          </div>
        </nav>
        
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-8">About Aidchain</h1>
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-8">
              <p className="text-xl mb-6">
                Aidchain revolutionizes humanitarian aid through blockchain transparency. 
                Every donation is tracked from donor to beneficiary, ensuring complete accountability.
              </p>
              <p className="text-lg">
                Built on Algorand for fast, low-cost transactions that make every token count 
                in the fight against poverty and humanitarian crises.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === 'how-it-works') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
        <nav className="flex justify-between items-center p-6">
          <button 
            onClick={() => setCurrentView('landing')}
            className="text-white text-xl font-bold flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-black rounded"></div>
            Aidchain
          </button>
          <div className="flex gap-6">
            <button onClick={() => setCurrentView('get-involved')} className="text-white hover:text-blue-200">Get Involved</button>
            <button onClick={() => setCurrentView('how-it-works')} className="text-white hover:text-blue-200">How it works</button>
            <button onClick={() => setCurrentView('about')} className="text-white hover:text-blue-200">About Us</button>
          </div>
        </nav>
        
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-8">How It Works</h1>
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-8">
              <p className="text-xl mb-8">
                Transparent humanitarian aid in three simple steps:
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <div className="text-4xl mb-4">💝</div>
                  <h3 className="text-xl font-bold mb-2">1. Donate</h3>
                  <p>Make secure donations using ALGO or USDC cryptocurrency</p>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <div className="text-4xl mb-4">🏥</div>
                  <h3 className="text-xl font-bold mb-2">2. Track</h3>
                  <p>Follow your donation's journey from NGO to beneficiary in real-time</p>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-bold mb-2">3. Impact</h3>
                  <p>See the direct impact of your contribution on real lives</p>
                </div>
              </div>
              
              <p className="mt-8 text-lg">
                <em>Content placeholder - you can provide detailed workflow information later</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === 'get-involved') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
        <nav className="flex justify-between items-center p-6">
          <button 
            onClick={() => setCurrentView('landing')}
            className="text-white text-xl font-bold flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-black rounded"></div>
            Aidchain
          </button>
          <div className="flex gap-6">
            <button onClick={() => setCurrentView('get-involved')} className="text-white hover:text-blue-200">Get Involved</button>
            <button onClick={() => setCurrentView('how-it-works')} className="text-white hover:text-blue-200">How it works</button>
            <button onClick={() => setCurrentView('about')} className="text-white hover:text-blue-200">About Us</button>
          </div>
        </nav>
        
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-8">Get Involved</h1>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">🎯 For Donors</h3>
                <p className="mb-6">Make transparent donations and track their real-world impact</p>
                <button 
                  onClick={handleDonateNow}
                  className="btn bg-white text-blue-600 border-none hover:bg-blue-50"
                >
                  Start Donating
                </button>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">🏥 For NGOs</h3>
                <p className="mb-6">Manage campaigns and distribute aid with full transparency</p>
                <button className="btn bg-white text-blue-600 border-none hover:bg-blue-50">
                  Partner With Us
                </button>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">Ready to make a difference?</h3>
              <button 
                onClick={toggleWalletModal}
                className="btn bg-white text-blue-600 border-none hover:bg-blue-50 btn-lg"
              >
                Connect Your Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Landing Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-white text-xl font-bold flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded"></div>
          Aidchain
        </div>
        <div className="flex gap-6">
          <button onClick={() => setCurrentView('get-involved')} className="text-white hover:text-blue-200 transition-colors">
            Get Involved
          </button>
          <button onClick={() => setCurrentView('how-it-works')} className="text-white hover:text-blue-200 transition-colors">
            How it works
          </button>
          <button onClick={() => setCurrentView('about')} className="text-white hover:text-blue-200 transition-colors">
            About Us
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left Content */}
          <div className="lg:w-1/2 text-white mb-12 lg:mb-0">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Every token visible,<br />
              every hand accounted for.
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={handleDonateNow}
                className="btn bg-gray-800 text-white border-none hover:bg-gray-700 btn-lg px-8"
              >
                Donate Now
              </button>
              <button 
                onClick={() => setCurrentView('about')}
                className="btn bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-white hover:bg-opacity-30 btn-lg px-8"
              >
                About Us
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <div className="text-8xl">🤝</div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
                <div className="text-2xl">✨</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white bg-opacity-10 backdrop-blur mt-16">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-12">See how it works</h2>
            
            <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-12 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-8">How does it work?</h3>
              
              <div className="text-white text-opacity-80">
                <p className="mb-6">
                  <em>This section will contain your detailed workflow content. For now, here's a placeholder:</em>
                </p>
                
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-4xl mb-4">💝</div>
                    <h4 className="font-semibold mb-2">Transparent Donations</h4>
                    <p className="text-sm">Every donation is recorded on the blockchain</p>
                  </div>
                  
                  <div>
                    <div className="text-4xl mb-4">🔍</div>
                    <h4 className="font-semibold mb-2">Real-Time Tracking</h4>
                    <p className="text-sm">Follow your contribution from donor to beneficiary</p>
                  </div>
                  
                  <div>
                    <div className="text-4xl mb-4">📊</div>
                    <h4 className="font-semibold mb-2">Impact Reporting</h4>
                    <p className="text-sm">See the measurable difference you've made</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
      <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />

      {/* Developer Tools (Hidden in bottom) */}
      <div className="fixed bottom-4 right-4 opacity-10 hover:opacity-100 transition-opacity">
        <div className="dropdown dropdown-top dropdown-end">
          <label tabIndex={0} className="btn btn-sm btn-circle bg-white text-gray-600">⚙️</label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><button onClick={toggleDemoModal}>Transaction Demo</button></li>
            <li><button onClick={toggleAppCallsModal}>Contract Demo</button></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home
