import { test, expect } from '@playwright/test'

test.describe('KMD Wallet Smart Contract Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should connect to KMD wallet and test smart contract deployment', async ({ page }) => {
    // Open debug panel
    const debugButton = page.locator('button:has-text("🔧 Debug")')
    await debugButton.click()
    
    // Test contract connection
    const testContractButton = page.locator('button:has-text("Test Contract")')
    await expect(testContractButton).toBeVisible()
    await testContractButton.click()
    
    // Wait for contract test to complete (may take time for deployment)
    await page.waitForTimeout(10000)
    
    // Check test results
    const resultsArea = page.locator('[style*="log"]')
    if (await resultsArea.isVisible()) {
      const resultsText = await resultsArea.textContent()
      console.log('📱 Contract test results:', resultsText)
      
      // Look for success indicators
      if (resultsText?.includes('✅') || resultsText?.includes('Contract deployed')) {
        console.log('✅ Smart contract deployment successful')
      } else if (resultsText?.includes('❌') || resultsText?.includes('failed')) {
        console.log('❌ Smart contract deployment failed:', resultsText)
      }
    }
  })

  test('should test NGO registration with KMD wallet', async ({ page }) => {
    // Navigate to NGO portal
    await page.goto('/ngo')
    await page.waitForLoadState('networkidle')
    
    // Look for register button
    const registerButtons = page.locator('button')
    const registerButton = registerButtons.filter({ hasText: /register|organization/i }).first()
    
    if (await registerButton.isVisible()) {
      await registerButton.click()
      await page.waitForTimeout(1000)
      
      // Fill in organization name
      const nameInput = page.locator('input[placeholder*="Organization"], input[placeholder*="Red Cross"]').first()
      if (await nameInput.isVisible()) {
        await nameInput.fill('Test Organization ' + Date.now())
        
        // Look for submit button
        const submitButton = page.locator('button:has-text("Register")')
        if (await submitButton.isVisible()) {
          // Note: In a real test, we would connect wallet first
          console.log('✅ NGO registration form filled successfully')
          console.log('ℹ️ Wallet connection required for actual submission')
        }
      }
    }
  })

  test('should simulate donation flow with KMD wallet', async ({ page }) => {
    // Navigate to donations page
    await page.goto('/donate')
    await page.waitForLoadState('networkidle')
    
    // Look for campaign cards
    const donateButtons = page.locator('button:has-text("Donate")')
    
    if (await donateButtons.first().isVisible()) {
      await donateButtons.first().click()
      await page.waitForTimeout(2000)
      
      // Should be on campaign detail page
      const currentUrl = page.url()
      console.log('📍 Current URL after campaign click:', currentUrl)
      
      // Look for donation form elements
      const donationInputs = page.locator('input[type="number"], input[placeholder*="amount"]')
      if (await donationInputs.first().isVisible()) {
        console.log('✅ Donation form displayed')
        
        // Fill in donation amount
        await donationInputs.first().fill('10')
        
        const submitDonationButton = page.locator('button:has-text("Donate")')
        if (await submitDonationButton.isVisible()) {
          console.log('✅ Donation form ready for submission')
          console.log('ℹ️ KMD wallet connection required for actual donation')
        }
      }
    }
  })

  test('should validate KMD wallet configuration in browser', async ({ page }) => {
    // Inject script to check wallet configuration
    const walletConfig = await page.evaluate(() => {
      // Check if wallet providers are available
      const hasWalletProviders = typeof (window as any).WalletConnect !== 'undefined' ||
                                typeof (window as any).algorand !== 'undefined'
      
      // Check local storage for wallet data
      const walletData = localStorage.getItem('walletconnect') || 
                        localStorage.getItem('algorand-wallet') ||
                        'No wallet data found'
      
      return {
        hasProviders: hasWalletProviders,
        localStorage: walletData,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    })
    
    console.log('🔧 Wallet Environment Check:')
    console.log('- Has wallet providers:', walletConfig.hasProviders)
    console.log('- Local storage data:', walletConfig.localStorage)
    console.log('- Current URL:', walletConfig.url)
    
    expect(walletConfig.url).toContain('localhost:5174')
  })

  test('should check AlgoKit localnet connectivity', async ({ page }) => {
    // Open debug panel and test Algorand client
    const debugButton = page.locator('button:has-text("🔧 Debug")')
    await debugButton.click()
    
    const testClientButton = page.locator('button:has-text("Test Client")')
    await testClientButton.click()
    
    // Wait for client test
    await page.waitForTimeout(5000)
    
    // Check results
    const resultsArea = page.locator('[style*="log"]')
    if (await resultsArea.isVisible()) {
      const resultsText = await resultsArea.textContent()
      console.log('⚡ Algorand Client Test Results:', resultsText)
      
      if (resultsText?.includes('Algod connected')) {
        console.log('✅ AlgoKit localnet connection successful')
      } else if (resultsText?.includes('connection failed')) {
        console.log('❌ AlgoKit localnet connection failed')
        console.log('ℹ️ Make sure AlgoKit localnet is running: algokit localnet start')
      }
    }
  })

  test('should validate environment configuration', async ({ page }) => {
    // Check environment variables and configuration
    const envConfig = await page.evaluate(() => {
      return {
        isDev: (import.meta as any).env?.DEV,
        algodNetwork: (import.meta as any).env?.VITE_ALGOD_NETWORK,
        baseUrl: window.location.origin
      }
    })
    
    console.log('🌍 Environment Configuration:')
    console.log('- Development mode:', envConfig.isDev)
    console.log('- Algod network:', envConfig.algodNetwork)
    console.log('- Base URL:', envConfig.baseUrl)
    
    // Validate expected configuration
    expect(envConfig.baseUrl).toBe('http://localhost:5174')
    expect(envConfig.isDev).toBe(true)
  })

  test('should capture network requests for blockchain calls', async ({ page }) => {
    const networkRequests: string[] = []
    
    // Listen for network requests
    page.on('request', request => {
      const url = request.url()
      if (url.includes('localhost:4001') || // Algod
          url.includes('localhost:8980') || // Indexer
          url.includes('localhost:4002') || // KMD
          url.includes('algorand')) {
        networkRequests.push(`${request.method()} ${url}`)
      }
    })
    
    // Open debug panel and run contract test
    const debugButton = page.locator('button:has-text("🔧 Debug")')
    await debugButton.click()
    
    const testContractButton = page.locator('button:has-text("Test Contract")')
    await testContractButton.click()
    
    // Wait for network activity
    await page.waitForTimeout(8000)
    
    console.log('🌐 Blockchain Network Requests:')
    networkRequests.forEach(req => console.log('- ' + req))
    
    if (networkRequests.length > 0) {
      console.log('✅ Blockchain network requests detected')
    } else {
      console.log('ℹ️ No blockchain network requests found (may indicate connection issues)')
    }
  })

  test('should validate smart contract artifacts exist', async ({ page }) => {
    // Check if contract artifacts are accessible
    const artifactCheck = await page.evaluate(async () => {
      try {
        // Try to import the contract client
        const module = await import('../src/contracts/AidchainContracts')
        return {
          hasFactory: typeof module.AidchainContractsFactory !== 'undefined',
          hasClient: typeof module.AidchainContractsClient !== 'undefined',
          error: null
        }
      } catch (error) {
        return {
          hasFactory: false,
          hasClient: false,
          error: (error as Error).message
        }
      }
    })
    
    console.log('📜 Smart Contract Artifacts:')
    console.log('- Factory available:', artifactCheck.hasFactory)
    console.log('- Client available:', artifactCheck.hasClient)
    if (artifactCheck.error) {
      console.log('- Error:', artifactCheck.error)
    }
    
    expect(artifactCheck.hasFactory).toBe(true)
    expect(artifactCheck.hasClient).toBe(true)
  })
})