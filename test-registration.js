#!/usr/bin/env node

// Test the registration API endpoint
const axios = require('axios');

// Set the correct DATABASE_URL for the test
process.env.DATABASE_URL = "mongodb+srv://maryamsadaf2002_db_user:TestPass123@cluster0.d4uksme.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0";

async function testRegistrationAPI() {
  console.log('🧪 Testing Registration API with MongoDB Atlas...\n');
  
  try {
    const testUser = {
      email: `testuser-${Date.now()}@example.com`,
      firstname: 'John',
      lastname: 'Doe',
      password: 'testpassword123'
    };

    console.log('📤 Sending registration request...');
    console.log('User data:', { ...testUser, password: '***' });

    const response = await axios.post('http://localhost:3000/api/register', testUser, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('\n✅ Registration successful!');
    console.log('Status:', response.status);
    console.log('Response:', {
      ...response.data,
      user: response.data.user ? {
        ...response.data.user,
        hashedPassword: '***' // Hide password in output
      } : undefined
    });

    return true;
  } catch (error) {
    console.error('\n❌ Registration failed:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Server is not running. Please start the server with:');
      console.error('export DATABASE_URL="mongodb+srv://maryamsadaf2002_db_user:TestPass123@cluster0.d4uksme.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0" && npm run dev');
    } else {
      console.error('Error:', error.message);
    }
    
    return false;
  }
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get('http://localhost:3000/api/health/database', { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('⚠️  Server is not running or not accessible.');
    console.log('\n🚀 To start the server with correct environment:');
    console.log('export DATABASE_URL="mongodb+srv://maryamsadaf2002_db_user:TestPass123@cluster0.d4uksme.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0" && npm run dev');
    return;
  }

  await testRegistrationAPI();
}

main();

