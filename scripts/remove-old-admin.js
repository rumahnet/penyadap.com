#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      let value = valueParts.join('=').trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const { PrismaClient } = require('@prisma/client');
(async function () {
  const prisma = new PrismaClient();
  try {
    const oldEmail = process.env.OLD_ADMIN_EMAIL || 'admin@penyadap.com';
    const newEmail = process.env.ADMIN_EMAIL || 'penyadapcom@gmail.com';

    const oldUser = await prisma.user.findUnique({ where: { email: oldEmail } });
    if (!oldUser) {
      console.log('No user found with email', oldEmail);
    } else {
      // If the old user has the same id as an existing new user, skip deletion
      const newUser = await prisma.user.findUnique({ where: { email: newEmail } });
      if (newUser && newUser.id === oldUser.id) {
        console.log('Old user already updated to new email; no deletion necessary.');
      } else {
        await prisma.user.delete({ where: { email: oldEmail } });
        console.log('Deleted old user with email', oldEmail);
      }
    }

    const users = await prisma.user.findMany();
    console.log('Current users:', users.map(u => ({ id: u.id, email: u.email, role: u.role })));
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
