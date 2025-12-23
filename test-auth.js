#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function test() {
  const prisma = new PrismaClient();

  try {
    console.log('=== Testing Authentication ===\n');

    // Check admin user
    const user = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
      select: { id: true, email: true, password: true, role: true }
    });

    console.log('Admin user found:', !!user);
    if (user) {
      console.log('- Email:', user.email);
      console.log('- Role:', user.role);
      console.log('- Password hash exists:', !!user.password);
      console.log('- Password hash (first 30 chars):', user.password?.substring(0, 30) + '...');

      // Test password verification
      const testPassword = 'admin123';
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log('\nPassword verification for "admin123":', isValid);

      if (!isValid) {
        // Try to hash and compare with new hash
        const newHash = await bcrypt.hash(testPassword, 10);
        console.log('\nNew hash created for admin123:');
        console.log(newHash);
        console.log('Can verify new hash:', await bcrypt.compare(testPassword, newHash));
      }
    } else {
      console.log('❌ Admin user not found!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
