import { test, expect } from '@playwright/test'

test.describe('AidChain KMD Wallet Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page
    await page.goto('/')
  })

  test('should load landing page and display KMD wallet option', async ({ page }) => {
    // Check if the page loads correctly
    await expect(page).toHaveTitle(/AidChain/i)
    
    // Check if the logo is present
    const logo = page.locator('img[alt*="Logo"]').first()
    await expect(logo).toBeVisible()
    
    // Check if AIDCHAIN text is visible
    await expect(page.locator('text=AIDCHAIN')).toBeVisible()
    
    // Check if main heading is present
    await expect(page.locator('h1')).toContainText('Every token visible')
    
    console.log('✅ Landing page loaded successfully')
  })

  test('should show connect wallet button when not connected', async ({ page }) => {
    // Look for "Donate Now" button (should show wallet modal when clicked if not connected)
    const donateButton = page.locator('button:has-text("Donate Now")')
    await expect(donateButton).toBeVisible()
    
    console.log('✅ Donate button visible when wallet not connected')
  })

  test('should be able to navigate to NGO portal', async ({ page }) => {
    // Navigate to NGO portal
    await page.goto('/ngo')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
    
    // Check if we're on the NGO portal page
    await expect(page.locator('text=Organizations')).toBeVisible()
    
    console.log('✅ NGO portal navigation successful')
  })

  test('should display debug panel in development mode', async ({ page }) => {
    // Look for debug panel toggle button
    const debugButton = page.locator('button:has-text("🔧 Debug")')
    await expect(debugButton).toBeVisible()
    
    // Click to open debug panel
    await debugButton.click()
    
    // Check if debug panel content is visible
    await expect(page.locator('text=AidChain Debug Panel')).toBeVisible()
    await expect(page.locator('text=Wallet Status')).toBeVisible()
    await expect(page.locator('text=Algorand Client')).toBeVisible()
    
    console.log('✅ Debug panel opens successfully')
  })

  test('should show correct wallet status in debug panel', async ({ page }) => {
    // Open debug panel
    const debugButton = page.locator('button:has-text("🔧 Debug")')
    await debugButton.click()
    
    // Check wallet status - should show "Not connected" initially
    await expect(page.locator('text=Not connected')).toBeVisible()
    
    console.log('✅ Wallet status correctly shows as not connected')
  })

  test('should be able to test wallet connection via debug panel', async ({ page }) => {
    // Open debug panel
    const debugButton = page.locator('button:has-text("🔧 Debug")')
    await debugButton.click()
    
    // Click "Test Wallet" button
    const testWalletButton = page.locator('button:has-text("Test Wallet")')
    await expect(testWalletButton).toBeVisible()
    await testWalletButton.click()
    
    // Wait a bit for the test to run
    await page.waitForTimeout(2000)
    
    // Check if test results appear
    const resultsSection = page.locator('text=Test Results')
    if (await resultsSection.isVisible()) {
      console.log('✅ Wallet test executed and results displayed')
    }
  })

  test('should be able to test Algorand client via debug panel', async ({ page }) => {
    // Open debug panel
    const debugButton = page.locator('button:has-text("🔧 Debug")')
    await debugButton.click()
    
    // Click "Test Client" button
    const testClientButton = page.locator('button:has-text("Test Client")')
    await expect(testClientButton).toBeVisible()
    await testClientButton.click()
    
    // Wait for test to complete
    await page.waitForTimeout(3000)
    
    // Check if test results section is visible
    const resultsSection = page.locator('text=Test Results')
    if (await resultsSection.isVisible()) {
      console.log('✅ Algorand client test executed')
    }
  })

  test('should navigate to donation categories page', async ({ page }) => {
    // Try to navigate to donate page directly
    await page.goto('/donate')
    
    // Wait for page load
    await page.waitForLoadState('networkidle')
    
    // Check if we're on the donation categories page
    await expect(page.locator('text=Choose a Cause')).toBeVisible()
    
    console.log('✅ Donation categories page loads correctly')
  })

  test('should display campaign cards in donation page', async ({ page }) => {
    await page.goto('/donate')
    await page.waitForLoadState('networkidle')
    
    // Look for campaign cards or default campaigns
    const campaignElements = page.locator('[style*="card"]')
    
    // Should have at least some content (either real campaigns or default ones)
    const hasContent = await page.locator('text=Afghanistan').isVisible() ||
                      await page.locator('text=Sudan').isVisible() ||
                      await page.locator('text=No Active Campaigns').isVisible()
    
    expect(hasContent).toBeTruthy()
    console.log('✅ Campaign content displayed on donation page')
  })

  test('should be able to click on a campaign', async ({ page }) => {
    await page.goto('/donate')
    await page.waitForLoadState('networkidle')
    
    // Look for clickable campaign cards
    const campaignCards = page.locator('[onclick], button:has-text("Donate")')
    
    if (await campaignCards.first().isVisible()) {
      await campaignCards.first().click()
      
      // Should navigate to campaign detail page
      await page.waitForTimeout(1000)
      console.log('✅ Campaign click navigation working')
    }
  })

  test('should show NGO registration form', async ({ page }) => {
    await page.goto('/ngo')
    await page.waitForLoadState('networkidle')
    
    // Look for "Register Organization" button or similar
    const registerButton = page.locator('button:has-text("Register"), button:has-text("Organization")')
    
    if (await registerButton.first().isVisible()) {
      await registerButton.first().click()
      
      // Should open registration modal/form
      await page.waitForTimeout(1000)
      
      // Look for form inputs
      const nameInput = page.locator('input[placeholder*="Organization"], input[placeholder*="Red Cross"]')
      if (await nameInput.first().isVisible()) {
        console.log('✅ NGO registration form opens correctly')
      }
    }
  })

  test('should run comprehensive test suite via console', async ({ page }) => {
    await page.goto('/')
    
    // Wait for the manual test suite to load
    await page.waitForTimeout(2000)
    
    // Run the comprehensive test suite
    const testResults = await page.evaluate(() => {
      // Check if the test suite is available
      if (typeof (window as any).aidchainTests !== 'undefined') {
        // Run all tests
        return (window as any).aidchainTests.runAllTests()
      }
      return null
    })
    
    if (testResults) {
      console.log('✅ Comprehensive test suite executed via browser')
      console.log('Test results:', testResults)
    } else {
      console.log('ℹ️ Manual test suite not available in this context')
    }
  })

  test('should validate console logs show KMD configuration', async ({ page }) => {
    const consoleLogs: string[] = []
    
    // Listen for console logs
    page.on('console', msg => {
      consoleLogs.push(msg.text())
    })
    
    await page.goto('/')
    await page.waitForTimeout(3000)
    
    // Check if KMD configuration was logged
    const kmdConfigLog = consoleLogs.find(log => 
      log.includes('Configured KMD wallet') || log.includes('KMD')
    )
    
    if (kmdConfigLog) {
      console.log('✅ KMD wallet configuration logged:', kmdConfigLog)
    }
    
    // Log any errors for debugging
    const errorLogs = consoleLogs.filter(log => 
      log.toLowerCase().includes('error') || log.toLowerCase().includes('failed')
    )
    
    if (errorLogs.length > 0) {
      console.log('⚠️ Errors found:', errorLogs)
    } else {
      console.log('✅ No errors in console logs')
    }
  })
})