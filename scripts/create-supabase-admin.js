#!/usr/bin/env node
/**
 * Create an admin user in Supabase (and upsert into local Prisma user table).
 * Usage:
 *  ADMIN_EMAIL=admin@penyadap.com ADMIN_PASSWORD=admin123 node ./scripts/create-supabase-admin.js
 *
 * Attempts to use SUPABASE_SERVICE_ROLE_KEY if present (recommended).
 * Otherwise tries signUp with the publishable anon key (may fail if sign-ups are disabled).
 */

const fs = require('fs');
const path = require('path');

// Load .env.local (simple parser)
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
const bcrypt = require('bcryptjs');

(async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@penyadap.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  console.log('Creating/updating local Prisma user...');
  const prisma = new PrismaClient();
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

  console.log('Local user upserted:', { id: user.id, email: user.email });

  // Try to create user in Supabase
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL) {
    console.warn('Skipping Supabase creation: NEXT_PUBLIC_SUPABASE_URL not set.');
    await prisma.$disconnect();
    return;
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');

    if (SERVICE_ROLE) {
      console.log('Using SUPABASE_SERVICE_ROLE_KEY to create user via Admin API...');
      const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE);
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: email.toLowerCase(),
        password,
        email_confirm: true,
      });
      if (error) {
        console.warn('Supabase admin.createUser returned error:', error.message || error);
      } else {
        console.log('Supabase admin user created:', data?.id);
      }
    } else if (ANON_KEY) {
      console.log('Service role key not found. Attempting signUp using anon key (may fail if signups disabled)...');
      const supabaseClient = createClient(SUPABASE_URL, ANON_KEY);
      const { data, error } = await supabaseClient.auth.signUp({ email: email.toLowerCase(), password });
      if (error) {
        console.warn('Supabase signUp returned error:', error.message || error);
      } else {
        console.log('Supabase user signUp response:', data?.user?.id || 'OK');
      }
    } else {
      console.warn('No Supabase key available (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY). Skipping Supabase creation.');
    }
  } catch (e) {
    console.error('Error while attempting Supabase user creation:', e);
  } finally {
    await prisma.$disconnect();
  }
})();
