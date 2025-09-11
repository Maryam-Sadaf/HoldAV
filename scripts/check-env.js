#!/usr/bin/env node

/**
 * Environment variables checker
 * Run with: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Environment Configuration...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envTemplatePath = path.join(process.cwd(), 'env.template');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📝 Please create .env.local file:');
  console.log('   cp env.template .env.local\n');
  
  if (fs.existsSync(envTemplatePath)) {
    console.log('✅ env.template file found - you can copy it to .env.local');
  } else {
    console.log('❌ env.template file also missing!');
  }
  process.exit(1);
}

// Load environment variables
require('dotenv').config({ path: envPath });

// Check required variables
const requiredVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

const optionalVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'EMAIL_SERVER_HOST',
  'EMAIL_SERVER_USER',
  'EMAIL_SERVER_PASSWORD'
];

console.log('📋 Required Environment Variables:');
let hasAllRequired = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
    
    // Additional checks for DATABASE_URL
    if (varName === 'DATABASE_URL') {
      if (value.startsWith('mongodb+srv://')) {
        console.log('   🔗 MongoDB Atlas connection string detected');
      } else if (value.startsWith('mongodb://')) {
        console.log('   🔗 MongoDB connection string detected');
      } else {
        console.log('   ⚠️  Unusual MongoDB connection string format');
      }
      
      // Check for common placeholder values
      if (value.includes('username:password') || value.includes('your-')) {
        console.log('   ❌ Contains placeholder values - please update with real credentials');
        console.log('   📖 See MONGODB_AUTH_FIX.md for authentication troubleshooting');
        hasAllRequired = false;
      }
      
      // Check for potential authentication issues
      if (value.includes('@') && !value.includes('%40')) {
        const atCount = (value.match(/@/g) || []).length;
        if (atCount > 1) {
          console.log('   ⚠️  Password may contain @ symbol - consider URL encoding it as %40');
        }
      }
    }
    
    if (varName === 'NEXTAUTH_SECRET') {
      if (value.length < 32) {
        console.log('   ⚠️  NEXTAUTH_SECRET should be at least 32 characters long');
      }
      if (value.includes('your-') || value === 'your-nextauth-secret') {
        console.log('   ❌ Contains placeholder value - please update with a real secret');
        hasAllRequired = false;
      }
    }
  } else {
    console.log(`❌ ${varName}: Missing`);
    hasAllRequired = false;
  }
});

console.log('\n📋 Optional Environment Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value && !value.includes('your-')) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`⚪ ${varName}: Not set or using placeholder`);
  }
});

console.log('\n📊 Summary:');
if (hasAllRequired) {
  console.log('✅ All required environment variables are configured!');
  console.log('\n🚀 Next steps:');
  console.log('   1. npm run db:generate');
  console.log('   2. npm run dev');
  console.log('   3. Test registration: http://localhost:3000/api/health/database');
} else {
  console.log('❌ Some required environment variables are missing or using placeholders');
  console.log('\n📝 Please update your .env.local file with real values');
  console.log('📖 See MONGODB_SETUP_GUIDE.md for detailed instructions');
  process.exit(1);
}

console.log('\n🔧 Available commands:');
console.log('   npm run dev              - Start development server');
console.log('   npm run db:generate      - Generate Prisma client');
console.log('   npm run db:studio        - Open Prisma Studio');
console.log('   node scripts/check-env.js - Run this environment check');
