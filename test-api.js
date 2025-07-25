const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test Farmer',
  email: 'test@example.com',
  phone: '9876543210',
  password: 'password123',
  role: 'farmer'
};

let authToken = '';

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
}

// Test functions
async function testHealthEndpoint() {
  console.log('\n🔍 Testing Health Endpoint...');
  const result = await apiRequest('GET', '/health');
  
  if (result.success) {
    console.log('✅ Health endpoint working');
    console.log('  Status:', result.status);
    console.log('  Message:', result.data.message);
    console.log('  Database:', result.data.database);
  } else {
    console.log('❌ Health endpoint failed');
    console.log('  Error:', result.error);
  }
  
  return result.success;
}

async function testUserRegistration() {
  console.log('\n🔍 Testing User Registration...');
  const result = await apiRequest('POST', '/auth/register', testUser);
  
  if (result.success) {
    console.log('✅ User registration successful');
    console.log('  Status:', result.status);
    authToken = result.data.token;
    console.log('  Token received:', authToken ? 'Yes' : 'No');
  } else {
    console.log('❌ User registration failed');
    console.log('  Error:', result.error);
  }
  
  return result.success;
}

async function testUserLogin() {
  console.log('\n🔍 Testing User Login...');
  const loginData = {
    email: testUser.email,
    password: testUser.password
  };
  
  const result = await apiRequest('POST', '/auth/login', loginData);
  
  if (result.success) {
    console.log('✅ User login successful');
    console.log('  Status:', result.status);
    authToken = result.data.token;
    console.log('  User role:', result.data.user.role);
  } else {
    console.log('❌ User login failed');
    console.log('  Error:', result.error);
  }
  
  return result.success;
}

async function testProtectedRoute() {
  console.log('\n🔍 Testing Protected Route (Get Profile)...');
  const result = await apiRequest('GET', '/auth/me', null, authToken);
  
  if (result.success) {
    console.log('✅ Protected route working');
    console.log('  Status:', result.status);
    console.log('  User name:', result.data.user.name);
  } else {
    console.log('❌ Protected route failed');
    console.log('  Error:', result.error);
  }
  
  return result.success;
}

async function testProductsEndpoint() {
  console.log('\n🔍 Testing Products Endpoint...');
  const result = await apiRequest('GET', '/products');
  
  if (result.success) {
    console.log('✅ Products endpoint working');
    console.log('  Status:', result.status);
    console.log('  Message:', result.data.message);
  } else {
    console.log('❌ Products endpoint failed');
    console.log('  Error:', result.error);
  }
  
  return result.success;
}

async function testOrdersEndpoint() {
  console.log('\n🔍 Testing Orders Endpoint...');
  const result = await apiRequest('GET', '/orders', null, authToken);
  
  if (result.success) {
    console.log('✅ Orders endpoint working');
    console.log('  Status:', result.status);
  } else {
    console.log('❌ Orders endpoint failed');
    console.log('  Error:', result.error);
  }
  
  return result.success;
}

async function testPaymentsEndpoint() {
  console.log('\n🔍 Testing Payments Endpoint...');
  const result = await apiRequest('POST', '/payments/create-order', { amount: 4900 }, authToken);
  
  if (result.success) {
    console.log('✅ Payments endpoint working');
    console.log('  Status:', result.status);
  } else {
    console.log('❌ Payments endpoint failed');
    console.log('  Error:', result.error);
  }
  
  return result.success;
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting API Tests for AgriToday...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthEndpoint },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Protected Route', fn: testProtectedRoute },
    { name: 'Products Endpoint', fn: testProductsEndpoint },
    { name: 'Orders Endpoint', fn: testOrdersEndpoint },
    { name: 'Payments Endpoint', fn: testPaymentsEndpoint }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) passedTests++;
    } catch (error) {
      console.log(`❌ ${test.name} threw an error:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} passed`);
  console.log('='.repeat(50));
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The application is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
  
  return passedTests === totalTests;
}

// Run tests if script is executed directly
if (require.main === module) {
  runAllTests()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Test runner error:', error);
      process.exit(1);
    });
}

module.exports = { runAllTests };
