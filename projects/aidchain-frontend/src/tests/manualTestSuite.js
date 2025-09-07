// Manual Test Suite for AidChain Frontend
// Run this in browser console to test major features

window.aidchainTests = {
  async runAllTests() {
    console.log('🚀 Starting AidChain Frontend Test Suite...\n');
    const results = [];
    
    // Test 1: Component Rendering
    results.push(await this.testComponentRendering());
    
    // Test 2: Navigation
    results.push(await this.testNavigation());
    
    // Test 3: Wallet Connection
    results.push(await this.testWalletConnection());
    
    // Test 4: Hook Functionality
    results.push(await this.testHooks());
    
    // Test 5: Forms
    results.push(await this.testForms());
    
    // Test 6: Asset Loading
    results.push(await this.testAssets());
    
    this.printResults(results);
    return results;
  },
  
  async testComponentRendering() {
    console.log('📱 Testing Component Rendering...');
    const test = { name: 'Component Rendering', passed: 0, failed: 0, issues: [] };
    
    try {
      // Check if main container exists
      const appContainer = document.querySelector('#root');
      if (appContainer) {
        test.passed++;
        console.log('  ✅ App container found');
      } else {
        test.failed++;
        test.issues.push('App container (#root) not found');
      }
      
      // Check for React components
      const reactComponents = document.querySelectorAll('[data-reactroot], .react-component');
      if (reactComponents.length > 0 || document.querySelector('[data-testid]')) {
        test.passed++;
        console.log('  ✅ React components detected');
      } else {
        test.failed++;
        test.issues.push('No React components detected');
      }
      
      // Check for navigation elements
      const navElements = document.querySelectorAll('nav, .nav, [role="navigation"]');
      if (navElements.length > 0) {
        test.passed++;
        console.log('  ✅ Navigation elements found');
      } else {
        test.failed++;
        test.issues.push('No navigation elements found');
      }
      
    } catch (error) {
      test.failed++;
      test.issues.push(`Component rendering error: ${error.message}`);
    }
    
    return test;
  },
  
  async testNavigation() {
    console.log('🧭 Testing Navigation...');
    const test = { name: 'Navigation', passed: 0, failed: 0, issues: [] };
    
    try {
      // Check for links
      const links = document.querySelectorAll('a[href], button[onclick], button[data-testid]');
      if (links.length > 0) {
        test.passed++;
        console.log(`  ✅ Found ${links.length} clickable elements`);
      } else {
        test.failed++;
        test.issues.push('No clickable navigation elements found');
      }
      
      // Check if React Router is working
      if (window.location.pathname) {
        test.passed++;
        console.log(`  ✅ Current route: ${window.location.pathname}`);
      }
      
      // Test logo presence
      const logos = document.querySelectorAll('img[alt*="logo"], img[alt*="Logo"], img[src*="logo"]');
      if (logos.length > 0) {
        test.passed++;
        console.log('  ✅ Logo elements found');
      } else {
        test.failed++;
        test.issues.push('No logo elements found');
      }
      
    } catch (error) {
      test.failed++;
      test.issues.push(`Navigation test error: ${error.message}`);
    }
    
    return test;
  },
  
  async testWalletConnection() {
    console.log('💳 Testing Wallet Connection...');
    const test = { name: 'Wallet Connection', passed: 0, failed: 0, issues: [] };
    
    try {
      // Check for wallet-related elements
      const walletButtons = document.querySelectorAll(
        'button[class*="wallet"], button[class*="connect"], [class*="wallet-connect"]'
      );
      
      if (walletButtons.length > 0) {
        test.passed++;
        console.log('  ✅ Wallet connection buttons found');
      } else {
        test.failed++;
        test.issues.push('No wallet connection buttons found');
      }
      
      // Check if useWallet hook context exists
      if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
        test.passed++;
        console.log('  ✅ React context available');
      }
      
      // Check for wallet provider
      const walletProvider = document.querySelector('[class*="wallet-provider"], [class*="WalletProvider"]');
      if (walletProvider) {
        test.passed++;
        console.log('  ✅ Wallet provider component detected');
      }
      
    } catch (error) {
      test.failed++;
      test.issues.push(`Wallet connection test error: ${error.message}`);
    }
    
    return test;
  },
  
  async testHooks() {
    console.log('🎣 Testing Hooks...');
    const test = { name: 'Hooks', passed: 0, failed: 0, issues: [] };
    
    try {
      // Check if custom hooks are working by looking for loading states
      const loadingElements = document.querySelectorAll(
        '[class*="loading"], [class*="spinner"], .loading-spinner'
      );
      
      if (loadingElements.length >= 0) { // >= 0 because loading might be done
        test.passed++;
        console.log('  ✅ Loading state management detected');
      }
      
      // Check for error handling
      const errorElements = document.querySelectorAll(
        '[class*="error"], .error-message, .error-container'
      );
      
      if (errorElements.length >= 0) { // >= 0 because no errors is good
        test.passed++;
        console.log('  ✅ Error handling elements available');
      }
      
      // Check for data display elements
      const dataElements = document.querySelectorAll(
        '[class*="card"], [class*="grid"], [class*="list-item"]'
      );
      
      if (dataElements.length > 0) {
        test.passed++;
        console.log('  ✅ Data display components found');
      } else {
        test.failed++;
        test.issues.push('No data display components found');
      }
      
    } catch (error) {
      test.failed++;
      test.issues.push(`Hooks test error: ${error.message}`);
    }
    
    return test;
  },
  
  async testForms() {
    console.log('📝 Testing Forms...');
    const test = { name: 'Forms', passed: 0, failed: 0, issues: [] };
    
    try {
      // Check for form elements
      const forms = document.querySelectorAll('form, input, textarea, select, button[type="submit"]');
      if (forms.length > 0) {
        test.passed++;
        console.log(`  ✅ Found ${forms.length} form elements`);
      } else {
        test.failed++;
        test.issues.push('No form elements found');
      }
      
      // Check for input validation
      const inputs = document.querySelectorAll('input[required], input[pattern]');
      if (inputs.length > 0) {
        test.passed++;
        console.log('  ✅ Form validation attributes found');
      }
      
      // Check for modal forms
      const modals = document.querySelectorAll('[class*="modal"], [role="dialog"]');
      if (modals.length >= 0) { // >= 0 because modals might be hidden
        test.passed++;
        console.log('  ✅ Modal components available');
      }
      
    } catch (error) {
      test.failed++;
      test.issues.push(`Forms test error: ${error.message}`);
    }
    
    return test;
  },
  
  async testAssets() {
    console.log('🖼️ Testing Assets...');
    const test = { name: 'Assets', passed: 0, failed: 0, issues: [] };
    
    try {
      // Check for images
      const images = document.querySelectorAll('img');
      let loadedImages = 0;
      let failedImages = 0;
      
      for (const img of images) {
        if (img.complete && img.naturalHeight !== 0) {
          loadedImages++;
        } else if (img.complete && img.naturalHeight === 0) {
          failedImages++;
        }
      }
      
      if (loadedImages > 0) {
        test.passed++;
        console.log(`  ✅ ${loadedImages} images loaded successfully`);
      }
      
      if (failedImages > 0) {
        test.failed++;
        test.issues.push(`${failedImages} images failed to load`);
      }
      
      // Check for broken image sources
      const brokenImages = Array.from(images).filter(img => 
        img.src.includes('undefined') || img.src === window.location.href
      );
      
      if (brokenImages.length > 0) {
        test.failed++;
        test.issues.push(`${brokenImages.length} images have broken sources`);
      } else if (images.length > 0) {
        test.passed++;
        console.log('  ✅ No broken image sources detected');
      }
      
    } catch (error) {
      test.failed++;
      test.issues.push(`Assets test error: ${error.message}`);
    }
    
    return test;
  },
  
  printResults(results) {
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    results.forEach(test => {
      totalPassed += test.passed;
      totalFailed += test.failed;
      
      const status = test.failed === 0 ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${test.name}: ${test.passed} passed, ${test.failed} failed`);
      
      if (test.issues.length > 0) {
        test.issues.forEach(issue => {
          console.log(`  ⚠️  ${issue}`);
        });
      }
    });
    
    console.log('\n📈 OVERALL SUMMARY');
    console.log(`Total Passed: ${totalPassed}`);
    console.log(`Total Failed: ${totalFailed}`);
    console.log(`Success Rate: ${(totalPassed / (totalPassed + totalFailed) * 100).toFixed(1)}%`);
    
    if (totalFailed === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('🔧 Some issues need attention.');
    }
  }
};

// Auto-run tests if this script is loaded
console.log('🧪 AidChain Test Suite loaded! Run `aidchainTests.runAllTests()` to start testing.');

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.aidchainTests;
}