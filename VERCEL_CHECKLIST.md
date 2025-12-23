# ✅ Pre-Upload Vercel Checklist

## 🎯 PERSIAPAN UTAMA

### Environment & Configuration
- [x] SQLite setup untuk development lokal
- [x] PostgreSQL schema ready untuk production
- [x] `.env.local` configured untuk local development
- [x] `.env.production` template created
- [x] `.gitignore` configured (prisma/dev.db ignored)

### Code Quality
- [x] All linting passed ✔ No ESLint warnings or errors
- [x] No TypeScript errors
- [x] All imports resolved

### Git Setup
```bash
# Pre-upload steps:
1. git add .
2. git commit -m "Setup for Vercel deployment"
3. git push origin main
```

## 📋 CHECKLIST SEBELUM DEPLOY KE VERCEL

### 1. Database Setup ⚠️ PENTING
- [ ] Buat PostgreSQL database (Supabase/RDS/Railway/dll)
- [ ] Copy connection string
- [ ] Simpan di tempat aman

### 2. Generate Secrets
- [ ] Generate AUTH_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- [ ] Simpan nilai tersebut

### 3. Vercel Project
- [ ] Create account di vercel.com (jika belum)
- [ ] Connect GitHub repository
- [ ] Create new project

### 4. Environment Variables di Vercel
Set setiap variable ini di Vercel dashboard:

```
✓ NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
✓ AUTH_SECRET = [hasil generate]
✓ DATABASE_URL = [PostgreSQL connection string]
✓ NEXT_PUBLIC_SUPABASE_URL = [optional]
✓ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = [optional]
✓ RESEND_API_KEY = [optional - untuk email]
✓ EMAIL_FROM = noreply@yourdomain.com
✓ GOOGLE_CLIENT_ID = [optional - untuk OAuth]
✓ GOOGLE_CLIENT_SECRET = [optional]
✓ GITHUB_OAUTH_TOKEN = [optional]
```

### 5. Deploy Options
- [ ] **Option A**: GitHub Integration (recommended)
  - Connect repo → Auto-deploy on push
  - Settings: Build Command = `next build`
  
- [ ] **Option B**: Vercel CLI
  ```bash
  npm i -g vercel
  vercel login
  vercel --prod
  ```

### 6. Post-Deploy Verification
- [ ] Check deployment logs untuk errors
- [ ] Test login: admin@example.com / admin123
- [ ] Verify Android guide accessible
- [ ] Verify iOS guide accessible
- [ ] Test blurred content if not authenticated

## 📊 CURRENT STATUS

### ✅ Development Setup
- Database: SQLite local (`prisma/dev.db`)
- Admin: Created (admin@example.com / admin123)
- Linting: All passed
- Build: Ready

### ✅ Production Ready
- Schema: Updated for PostgreSQL
- ENV: Template created (`.env.production`)
- Docs: Deployment guide created (`VERCEL_DEPLOYMENT.md`)
- Code: Production-ready

## 🚀 QUICK START UNTUK VERCEL

```bash
# 1. Push ke GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main

# 2. Di Vercel Dashboard
# - Click "New Project"
# - Import GitHub repository
# - Add Environment Variables (lihat checklist di atas)
# - Click "Deploy"

# 3. Setelah deploy (optional - setup admin user)
vercel env pull .env.production.local
DATABASE_URL="..." node scripts/create-admin.js
```

## ⚠️ PENTING SEBELUM PRODUCTION

1. **Ubah AUTH_SECRET**
   - Jangan gunakan yang temporary
   - Generate baru: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

2. **Setup Database Backup**
   - Supabase: Auto-backup included
   - RDS: Configure backup retention
   - Lainnya: Setup manual backups

3. **Email Service** (jika digunakan)
   - Verify RESEND_API_KEY
   - Update EMAIL_FROM ke domain Anda

4. **Monitor Production**
   - Setup error tracking (Sentry)
   - Check Vercel logs regularly
   - Monitor database performance

## 📞 SUPPORT

Jika ada error:
1. Check Vercel deployment logs
2. Baca: `VERCEL_DEPLOYMENT.md`
3. Common issues di troubleshooting section

---

**Siap? Hubungi saya jika butuh bantuan lebih lanjut! 🚀**
