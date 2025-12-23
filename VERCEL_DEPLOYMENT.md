# Deployment ke Vercel - Panduan Lengkap

## ✅ Pre-Deployment Checklist

### 1. **Repository Setup**
- [ ] Push semua kode ke GitHub
- [ ] Pastikan `.gitignore` sudah benar (`.env.local`, `.next`, `node_modules`, `prisma/dev.db`)
- [ ] Verifikasi tidak ada file sensitif di git

### 2. **Database PostgreSQL**
Pilih salah satu provider:

#### **Option A: Supabase (Recommended)**
1. Buat project di https://supabase.com
2. Copy connection string dari "Settings" > "Database"
3. Format: `postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require`

#### **Option B: AWS RDS, Heroku Postgres, atau Railway**
- Setup database PostgreSQL Anda
- Copy connection string

### 3. **Generate AUTH_SECRET**
```bash
# Di terminal lokal Anda
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Copy hasilnya untuk `AUTH_SECRET` di Vercel environment variables.

### 4. **Environment Variables di Vercel**

1. Buka https://vercel.com dan login
2. Pilih project Anda (atau create new)
3. Pergi ke "Settings" > "Environment Variables"
4. Tambahkan semua variables:

```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

AUTH_SECRET=[hasil generate di step 3]
DATABASE_URL=[connection string PostgreSQL Anda]

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_xxxxx

RESEND_API_KEY=re_xxxxx (atau kosongkan jika tidak perlu)
EMAIL_FROM=noreply@your-domain.com

GOOGLE_CLIENT_ID=(optional)
GOOGLE_CLIENT_SECRET=(optional)
GITHUB_OAUTH_TOKEN=(optional)
```

### 5. **Deploy ke Vercel**

#### **Opsi 1: Via Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Untuk production
vercel --prod
```

#### **Opsi 2: Via GitHub Integration**
1. Connect GitHub repository ke Vercel
2. Pilih branch untuk auto-deploy
3. Vercel akan auto-build dan deploy setiap push

### 6. **Jalankan Database Migrations**

Setelah deploy, migration otomatis akan jalan, tapi Anda bisa manual:

```bash
# Option 1: Vercel Deployment
vercel env pull .env.production.local
pnpm exec prisma migrate deploy

# Option 2: Via Vercel CLI
vercel exec pnpm exec prisma migrate deploy
```

### 7. **Buat Admin User di Production**

```bash
# Pull environment variables
vercel env pull .env.production.local

# Jalankan script create-admin
DATABASE_URL="postgresql://..." node scripts/create-admin.js
```

Atau buat secara manual via SQL:
```sql
INSERT INTO users (id, email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'admin_id_here',
  'admin@yourdomain.com',
  'Admin',
  '$2a$10$hashed_password_here',
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
);
```

## 🔧 Build Configuration

### Build Settings
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `pnpm install` (default)

### Node Version
- Recommend: Node 18.x atau 20.x

## 📦 Post-Deployment Checks

1. **Health Check**
   ```bash
   curl https://your-domain.com/api/auth/callback/credentials
   ```

2. **Test Login**
   - Kunjungi https://your-domain.com/login
   - Coba login dengan admin credentials
   - Verifikasi redirects ke dashboard

3. **Check Logs**
   - Vercel Dashboard > "Functions" atau "Deployments" > View logs
   - Check untuk errors di database connection

## 🚨 Common Issues & Solutions

### Error: "Can't reach database server"
- ✅ Verify DATABASE_URL di Vercel environment variables
- ✅ Check database server is running
- ✅ Verify IP whitelist (jika ada)

### Error: "Prisma client not generated"
```bash
vercel env pull .env.production.local
pnpm exec prisma generate
vercel deploy --prod
```

### Error: "Migration failed"
```bash
# Push schema to database
vercel env pull .env.production.local
pnpm exec prisma db push
```

## 📱 Redirect URLs (untuk OAuth)

Jika menggunakan Google OAuth:
1. Buka Google Cloud Console
2. Authorized redirect URIs tambahkan:
   - `https://your-domain.com/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (untuk development)

## 🔐 Security Checklist

- [ ] AUTH_SECRET sudah di-generate secara random
- [ ] DATABASE_URL tidak di-commit ke git
- [ ] API keys (Resend, etc) tersembunyi
- [ ] HTTPS enabled (automatic di Vercel)
- [ ] CORS properly configured
- [ ] Rate limiting configured (optional)

## 📝 Monitoring & Maintenance

1. **Check Logs Regularly**
   - Vercel Dashboard > Deployments > Logs

2. **Monitor Database**
   - Supabase Dashboard > Database > Queries
   - Check untuk slow queries

3. **Update Dependencies**
   ```bash
   pnpm update
   pnpm exec prisma migrate dev
   git push
   # Vercel auto-deploys
   ```

## 🎯 Next Steps

- [ ] Custom domain setup
- [ ] Enable Vercel Analytics
- [ ] Setup error tracking (Sentry)
- [ ] Configure backups untuk database
- [ ] Setup monitoring alerts

---

**Support**: Jika ada error, check Vercel logs atau hubungi support Vercel/database provider Anda.
