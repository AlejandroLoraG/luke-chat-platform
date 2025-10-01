# Environment Configuration Guide

This project supports three environments: **Local Development**, **Staging**, and **Production**.

## Environment Overview

| Environment | Purpose | Build Type | Backend URL |
|------------|---------|------------|-------------|
| **Local Dev** | Local development on your machine | Development (with Turbopack) | `https://chat.alelo-luqe.fun` |
| **Staging** | Testing production builds before release | Production (optimized) | `https://chat.alelo-luqe.fun` |
| **Production** | Live production environment | Production (optimized) | Production backend URL |

---

## 1. Local Development

### Setup:
```bash
# Copy example to .env.local (already done)
cp .env.example .env.local

# Start development server
npm run dev
```

### Configuration:
- **File:** `.env.local` (gitignored)
- **Backend:** `https://chat.alelo-luqe.fun`
- **Hot reload:** Enabled with Turbopack
- **Access:** `http://localhost:3000/chat`

### Environment Variables:
```
NEXT_PUBLIC_API_BASE_URL=https://chat.alelo-luqe.fun
NODE_ENV=development
```

---

## 2. Staging Environment (Dokploy)

**Purpose:** Test production builds with development backend before going live.

### Deploy to Dokploy (Staging):

1. **Create Application in Dokploy:**
   - Name: `chat-platform-staging`
   - Type: Docker
   - Repository: Your Git repo
   - Branch: `main` or `develop`

2. **Build Settings:**
   - Dockerfile: `Dockerfile`
   - Build context: `.`

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_BASE_URL=https://chat.alelo-luqe.fun
   NODE_ENV=production
   ```

4. **Domain (optional):**
   - `staging.your-domain.com`
   - Enable SSL

5. **Deploy**

### Configuration:
- **File:** `.env.staging` (tracked in repo)
- **Backend:** `https://chat.alelo-luqe.fun` (development backend)
- **Build:** Production optimized (minified, standalone)
- **Use case:** Testing production builds, QA, demos

---

## 3. Production Environment (Dokploy)

**Purpose:** Live production environment for end users.

### Deploy to Dokploy (Production):

1. **Create Separate Application in Dokploy:**
   - Name: `chat-platform-production`
   - Type: Docker
   - Repository: Your Git repo
   - Branch: `main` (use tags/releases recommended)

2. **Build Settings:**
   - Dockerfile: `Dockerfile`
   - Build context: `.`

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-production-backend-url.com
   NODE_ENV=production
   ```
   ⚠️ **Important:** Update with actual production backend URL

4. **Domain:**
   - `chat.your-domain.com` or your production domain
   - Enable SSL (required for production)

5. **Deploy**

### Configuration:
- **File:** `.env.production` (tracked in repo as template)
- **Backend:** Production backend URL (update before deployment)
- **Build:** Production optimized
- **Use case:** Live production traffic

---

## Environment Files Summary

```
.env.local            # Local dev (gitignored, created from .env.example)
.env.example          # Template for local dev (tracked)
.env.staging          # Staging deployment config (tracked)
.env.production       # Production deployment template (tracked)
```

### What's Tracked in Git:
- ✅ `.env.example` - Local dev template
- ✅ `.env.staging` - Staging config (safe, uses dev backend)
- ✅ `.env.production` - Production template (placeholder URL)

### What's Gitignored:
- 🚫 `.env.local` - Your personal local config
- 🚫 `.env*.local` - Any local overrides

---

## Backend URLs by Environment

### Development Backend (Current):
```
https://chat.alelo-luqe.fun
```
**Used by:**
- Local development
- Staging deployment

**Endpoints:**
- `https://chat.alelo-luqe.fun/api/v1/chat`
- `https://chat.alelo-luqe.fun/api/v1/chat/stream`
- `https://chat.alelo-luqe.fun/api/v1/health`

### Production Backend (Future):
```
https://your-production-backend-url.com
```
**Used by:**
- Production deployment

⚠️ **Update `.env.production` before deploying to production**

---

## Deployment Workflow

### Recommended Flow:

```
1. Develop Locally
   ↓ (npm run dev)
   Uses: .env.local → https://chat.alelo-luqe.fun

2. Test in Staging
   ↓ (git push → Dokploy staging)
   Uses: .env.staging → https://chat.alelo-luqe.fun
   Test: All features work in production build

3. Deploy to Production
   ↓ (git tag → Dokploy production)
   Uses: .env.production → Production backend URL
   Result: Live for users
```

### Best Practices:

1. **Always test in staging first** before production deployment
2. **Use git tags** for production releases (e.g., `v1.0.0`)
3. **Never commit** actual secrets or API keys
4. **Keep production backend URL** updated in `.env.production`
5. **Test both communication modes** (standard & streaming) in each environment

---

## CORS Configuration

Your backend needs to allow requests from:

### Development:
```python
ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Staging:
```python
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://staging.your-domain.com",  # or your staging domain
]
```

### Production:
```python
ALLOWED_ORIGINS = [
    "https://chat.your-domain.com",  # your production domain
]
```

---

## Switching Between Environments Locally

### Test with staging backend:
```bash
# Already using staging backend via .env.local
npm run dev
```

### Test with production backend:
```bash
# Create temporary override
echo "NEXT_PUBLIC_API_BASE_URL=https://prod-backend-url.com" > .env.development.local
npm run dev
# Delete .env.development.local when done
```

### Test production build locally:
```bash
# Build production version
npm run build:prod

# Run production server
npm start

# Access at http://localhost:3000/chat
```

---

## Troubleshooting

### "Unable to connect to AI assistant"

**Check backend URL:**
```bash
# Test backend health
curl https://chat.alelo-luqe.fun/api/v1/health
```

**Verify environment variable:**
- Local: Check `.env.local`
- Staging/Production: Check Dokploy environment variables

### Environment variable not updating

**In development:**
```bash
# Restart dev server
# Ctrl+C then npm run dev
```

**In Dokploy:**
- Update environment variable in Dokploy
- Click "Redeploy" (rebuilds with new env vars)

### CORS errors

Backend CORS configuration must include your frontend domain.

---

## Quick Reference

```bash
# Local development
npm run dev                    # → http://localhost:3000/chat

# Test production build locally
npm run build:prod && npm start

# Deploy staging (via Dokploy)
git push origin main           # Auto-deploy if webhook configured

# Deploy production (via Dokploy)
git tag v1.0.0
git push origin v1.0.0         # Deploy specific version
```

---

## Need Help?

- **Development issues:** Check `CLAUDE.md`
- **Deployment issues:** Check `DEPLOYMENT.md`
- **Architecture questions:** Check `README.md`
