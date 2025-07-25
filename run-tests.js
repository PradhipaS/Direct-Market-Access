const { spawn } = require('child_process');
const axios = require('axios');
const path = require('path');

let serverProcess = null;

// Wait for server to be ready
async function waitForServer(url, maxAttempts = 30, interval = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(url);
      return true;
    } catch (error) {
      if (i === maxAttempts - 1) {
        console.log(`❌ Server not responding after ${maxAttempts} attempts`);
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  return false;
}

// Start the test server
function startServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting test server...');
    
    serverProcess = spawn('node', ['test-server.js'], {
      cwd: process.cwd(),
      stdio: ['inherit', 'pipe', 'pipe']
    });
    
    let serverStarted = false;
    
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      if (output.includes('AgriToday API is live') && !serverStarted) {
        serverStarted = true;
        setTimeout(() => resolve(), 2000); // Give server 2 seconds to fully start
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error('Server Error:', data.toString());
    });
    
    serverProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
      reject(error);
    });
    
    serverProcess.on('exit', (code) => {
      if (!serverStarted) {
        reject(new Error(`Server exited with code ${code}`));
      }
    });
  });
}

// Stop the server
function stopServer() {
  if (serverProcess) {
    console.log('🛑 Stopping test server...');
    serverProcess.kill('SIGINT');
    serverProcess = null;
  }
}

// Run API tests
async function runAPITests() {
  console.log('\n📋 Running API tests...');
  
  try {
    const { runAllTests } = require('./test-api.js');
    const allPassed = await runAllTests();
    return allPassed;
  } catch (error) {
    console.error('Error running API tests:', error.message);
    return false;
  }
}

// Test frontend functionality
async function testFrontend() {
  console.log('\n🌐 Testing frontend...');
  
  try {
    // Test that frontend is served
    const response = await axios.get('http://localhost:5000');
    if (response.status === 200 && response.data.includes('AgriToday')) {
      console.log('✅ Frontend is being served correctly');
      console.log('  Status:', response.status);
      console.log('  Title found:', response.data.includes('AgriToday'));
      return true;
    } else {
      console.log('❌ Frontend test failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Frontend test failed:', error.message);
    return false;
  }
}

// Main test runner
async function runCompleteTests() {
  console.log('🔥 AgriToday Complete Test Suite');
  console.log('=' .repeat(50));
  
  try {
    // Start server
    await startServer();
    
    // Wait for server to be ready
    console.log('⏳ Waiting for server to be ready...');
    const serverReady = await waitForServer('http://localhost:5000/api/health');
    
    if (!serverReady) {
      throw new Error('Server failed to start properly');
    }
    
    console.log('✅ Server is ready!');
    
    // Run tests
    const frontendPassed = await testFrontend();
    const apiPassed = await runAPITests();
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 FINAL TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`Frontend Tests: ${frontendPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`API Tests: ${apiPassed ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (frontendPassed && apiPassed) {
      console.log('\n🎉 ALL TESTS PASSED! 🎉');
      console.log('Your AgriToday application is working correctly!');
      console.log('\n📱 You can now access your application at:');
      console.log('   http://localhost:5000');
      console.log('\n🔧 API endpoints are available at:');
      console.log('   http://localhost:5000/api/health');
      console.log('\nPress Ctrl+C to stop the server when done testing.');
      
      // Keep server running for manual testing
      console.log('\n⏳ Server will continue running for manual testing...');
      console.log('Press Ctrl+C to stop the server.');
      
      // Keep the process alive
      process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down...');
        stopServer();
        process.exit(0);
      });
      
      // Don't exit automatically
      return;
      
    } else {
      console.log('\n⚠️  SOME TESTS FAILED');
      console.log('Please check the errors above and fix them.');
    }
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  } finally {
    // Only stop server if tests failed
    if (serverProcess) {
      setTimeout(() => {
        stopServer();
        process.exit(1);
      }, 2000);
    }
  }
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  stopServer();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopServer();
  process.exit(0);
});

// Run the complete test suite
runCompleteTests();
