import { test, expect } from '@playwright/test'

test.describe('AidChain Visual Inspection', () => {
  test('should capture landing page screenshot and inspect KMD configuration', async ({ page }) => {
    console.log('🔍 Starting visual inspection...')
    
    // Navigate to the landing page
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000) // Give time for React to render
    
    // Take a full page screenshot
    await page.screenshot({ path: 'test-results/landing-page.png', fullPage: true })
    console.log('📸 Landing page screenshot taken')
    
    // Get page title
    const title = await page.title()
    console.log('📄 Page title:', title)
    
    // Get page content for debugging
    const bodyText = await page.locator('body').textContent()
    console.log('📝 First 200 characters of page:', bodyText?.substring(0, 200))
    
    // Check if React has loaded
    const hasReactRoot = await page.locator('#root').isVisible()
    console.log('⚛️  React root element visible:', hasReactRoot)
    
    // Look for any visible buttons
    const allButtons = page.locator('button')
    const buttonCount = await allButtons.count()
    console.log('🔘 Number of buttons found:', buttonCount)
    
    // List all button texts
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const buttonText = await allButtons.nth(i).textContent()
      console.log(`- Button ${i + 1}: "${buttonText}"`)
    }
    
    // Check for console messages
    const consoleLogs: string[] = []
    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`)
    })
    
    // Reload to capture console logs
    await page.reload()
    await page.waitForTimeout(2000)
    
    console.log('🖥️  Console logs:')
    consoleLogs.slice(-10).forEach(log => console.log(`- ${log}`))
    
    // Check for KMD configuration
    const kmdConfigFound = consoleLogs.some(log => 
      log.toLowerCase().includes('kmd') || log.toLowerCase().includes('wallet')
    )
    console.log('🔗 KMD configuration in console:', kmdConfigFound)
    
    // Check current URL
    const currentUrl = page.url()
    console.log('🌐 Current URL:', currentUrl)
    
    expect(currentUrl).toBe('http://localhost:5174/')
  })

  test('should test NGO portal page', async ({ page }) => {
    console.log('🏢 Testing NGO portal...')
    
    await page.goto('/ngo')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/ngo-portal.png', fullPage: true })
    console.log('📸 NGO portal screenshot taken')
    
    // Get page content
    const content = await page.locator('body').textContent()
    console.log('📝 NGO portal content preview:', content?.substring(0, 200))
    
    // Check if we have organization-related content
    const hasOrgContent = content?.toLowerCase().includes('organization') || 
                         content?.toLowerCase().includes('register') ||
                         content?.toLowerCase().includes('ngo')
    console.log('🏢 Has organization content:', hasOrgContent)
  })

  test('should test donation page', async ({ page }) => {
    console.log('💝 Testing donation page...')
    
    await page.goto('/donate')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/donate-page.png', fullPage: true })
    console.log('📸 Donation page screenshot taken')
    
    // Get page content
    const content = await page.locator('body').textContent()
    console.log('📝 Donation page content preview:', content?.substring(0, 200))
    
    // Look for campaign-related content
    const hasCampaignContent = content?.toLowerCase().includes('campaign') ||
                              content?.toLowerCase().includes('donate') ||
                              content?.toLowerCase().includes('afghanistan') ||
                              content?.toLowerCase().includes('cause')
    console.log('💝 Has campaign content:', hasCampaignContent)
  })

  test('should inspect browser environment', async ({ page }) => {
    console.log('🔧 Inspecting browser environment...')
    
    await page.goto('/')
    await page.waitForTimeout(2000)
    
    // Get environment information
    const envInfo = await page.evaluate(() => {
      return {
        userAgent: navigator.userAgent,
        url: window.location.href,
        hasReact: typeof (window as any).React !== 'undefined',
        hasVite: typeof (window as any).__vite !== 'undefined',
        isDev: (import.meta as any)?.env?.DEV,
        nodeEnv: (import.meta as any)?.env?.NODE_ENV,
        algodNetwork: (import.meta as any)?.env?.VITE_ALGOD_NETWORK,
        hasWallet: typeof (window as any).algorand !== 'undefined' || 
                   typeof (window as any).WalletConnect !== 'undefined',
        localStorage: Object.keys(localStorage),
        documentReady: document.readyState
      }
    })
    
    console.log('🌍 Browser Environment:')
    console.log('- User Agent:', envInfo.userAgent)
    console.log('- Current URL:', envInfo.url)
    console.log('- React loaded:', envInfo.hasReact)
    console.log('- Vite loaded:', envInfo.hasVite)
    console.log('- Development mode:', envInfo.isDev)
    console.log('- Node environment:', envInfo.nodeEnv)
    console.log('- Algod network:', envInfo.algodNetwork)
    console.log('- Wallet available:', envInfo.hasWallet)
    console.log('- LocalStorage keys:', envInfo.localStorage)
    console.log('- Document ready state:', envInfo.documentReady)
  })
})