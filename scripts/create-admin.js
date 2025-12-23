#!/usr/bin/env node
/**
 * Simple script to create or update an admin user in the database.
 * Usage:
 *  ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=admin123 node ./scripts/create-admin.js
 * Or with npm script: `pnpm run create-admin` (defaults are provided)
 */
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
      // Remove quotes
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
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const dbUrl = process.env.DATABASE_URL;
  console.log('DATABASE_URL loaded:', dbUrl ? 'Yes (length: ' + dbUrl.length + ')' : 'No');
  if (dbUrl) {
    // Print URL with masked password
    const maskedUrl = dbUrl.replace(/(:)[^@]*(@)/, '$1***@');
    console.log('Connection:', maskedUrl);
  }
  if (!process.env.DATABASE_URL) {
    console.warn('Warning: DATABASE_URL is not set in environment. Ensure your .env.local is configured.');
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Admin',
      password: hashed,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
    create: {
      email,
      name: 'Admin',
      password: hashed,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('Admin user created/updated:', { id: user.id, email: user.email });
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
