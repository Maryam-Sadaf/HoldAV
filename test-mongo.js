#!/usr/bin/env node

// Test MongoDB Atlas connectivity with Prisma
const { PrismaClient } = require('@prisma/client');

// Set the correct DATABASE_URL
process.env.DATABASE_URL = "mongodb+srv://maryamsadaf2002_db_user:TestPass123@cluster0.d4uksme.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0";

const prisma = new PrismaClient();

async function testMongoDB() {
  console.log('🔍 Testing MongoDB Atlas connection with Prisma...\n');
  
  try {
    // Test 1: Connection
    console.log('1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('✅ Connected to MongoDB Atlas successfully!\n');

    // Test 2: Read operation
    console.log('2️⃣ Testing read operation...');
    const userCount = await prisma.user.count();
    console.log(`✅ Read test passed! Current user count: ${userCount}\n`);

    // Test 3: Write operation (create a test user)
    console.log('3️⃣ Testing write operation...');
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        firstname: 'Test',
        lastname: 'User',
        hashedPassword: 'test-password-hash',
        role: 'user'
      }
    });
    console.log(`✅ Write test passed! Created user with ID: ${testUser.id}\n`);

    // Test 4: Update operation
    console.log('4️⃣ Testing update operation...');
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { firstname: 'Updated Test' }
    });
    console.log(`✅ Update test passed! Updated user firstname to: ${updatedUser.firstname}\n`);

    // Test 5: Delete operation (cleanup)
    console.log('5️⃣ Testing delete operation...');
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('✅ Delete test passed! Test user cleaned up\n');

    // Test 6: Relation test (if companies exist)
    console.log('6️⃣ Testing relations...');
    const companies = await prisma.company.findMany({
      include: {
        user: true,
        rooms: true
      },
      take: 1
    });
    console.log(`✅ Relations test passed! Found ${companies.length} companies with relations\n`);

    console.log('🎉 All tests passed! Your MongoDB Atlas setup is working perfectly!');
    console.log('\n📋 Summary:');
    console.log('✅ Database connection: Working');
    console.log('✅ Read operations: Working');
    console.log('✅ Write operations: Working');
    console.log('✅ Update operations: Working');
    console.log('✅ Delete operations: Working');
    console.log('✅ Relations: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your MongoDB Atlas credentials');
    console.error('2. Verify user permissions in Database Access');
    console.error('3. Check Network Access (IP whitelist)');
    console.error('4. Ensure cluster is active');
  } finally {
    await prisma.$disconnect();
  }
}

testMongoDB();

