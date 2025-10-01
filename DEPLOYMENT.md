# Deployment Guide - Dokploy VPS

This guide walks you through deploying the Luke Chat Platform to your Dokploy VPS.

## Prerequisites

- Dokploy instance running on your VPS
- Git repository accessible by Dokploy (GitHub, GitLab, etc.)
- Backend AI Agent service deployed and accessible
- Docker and Docker Compose installed on your VPS

## Quick Deployment Steps

### 1. Push to Git Repository

Ensure all Docker files are committed:
```bash
git add Dockerfile .dockerignore docker-compose.yml next.config.ts package.json
git commit -m "Add Docker configuration for Dokploy deployment"
git push origin main
```

### 2. Create Application in Dokploy

1. Log into your Dokploy dashboard
2. Click "Create Application"
3. Select "Docker" as the deployment type
4. Connect your Git repository

### 3. Configure Build Settings

In Dokploy application settings:

**Build Configuration:**
- **Dockerfile Path:** `Dockerfile`
- **Context Path:** `.`
- **Build Arguments:** (none needed)

**Port Configuration:**
- **Container Port:** `3000`
- **Public Port:** `80` or `443` (with SSL)

### 4. Set Environment Variables

Add these environment variables in Dokploy based on your environment:

**For Staging Deployment** (uses development backend):
```
NEXT_PUBLIC_API_BASE_URL=https://chat.alelo-luqe.fun
NODE_ENV=production
```

**For Production Deployment** (when you have production backend):
```
NEXT_PUBLIC_API_BASE_URL=https://your-production-backend-url.com
NODE_ENV=production
```

**Optional:**
```
NEXT_TELEMETRY_DISABLED=1
```

> **Note:** See `ENVIRONMENTS.md` for detailed environment configuration guide.

### 5. Deploy

Click "Deploy" in Dokploy. The build process will:
1. Pull your repository
2. Build the Docker image (takes 3-5 minutes)
3. Start the container
4. Expose on configured port

### 6. Configure Domain (Optional)

In Dokploy:
1. Go to your application settings
2. Add your domain: `chat.yourdomain.com`
3. Enable SSL (Let's Encrypt)
4. Configure DNS: Point A record to your VPS IP

## Local Testing Before Deployment

Test the Docker build locally:

```bash
# Build the image
docker build -t chat-platform .

# Run with environment variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8001 \
  chat-platform

# Or use docker-compose
docker-compose up
```

Access at `http://localhost:3000/chat`

## Deployment Architecture Options

### Option 1: Dokploy with Traefik (Current Setup)
```
Internet → Traefik (Port 443/80) → Frontend Container (Port 3000)
                                  → Backend Container (Port 8001)
```

**Domain:** `https://luqe.alelo-luqe.fun` (frontend)
**Backend:** `https://chat.alelo-luqe.fun` (backend)

Deploy backend and frontend as separate Dokploy applications. Traefik handles SSL and routing via domains.

### Option 2: Separate Containers (Alternative)
```
[Frontend Container] ←→ [Backend Container]
     (Port 3001:3000)      (Port 8001)
```

Deploy backend and frontend as separate Dokploy applications on the same VPS. Use Docker network or internal IP for communication.

### Option 3: Docker Compose Stack
```yaml
# Full stack in one docker-compose.yml
services:
  backend:
    image: your-backend-image
    ports:
      - "8001:8001"

  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://backend:8001
    depends_on:
      - backend
```

### Option 4: Custom Reverse Proxy Setup
```
Nginx/Traefik
     ├── /chat → Frontend (Port 3000)
     └── /api  → Backend (Port 8001)
```

Use Dokploy's built-in reverse proxy or configure your own.

## Troubleshooting

### Build Fails

**Error:** `npm ci` fails
```bash
# Solution: Clear Dokploy build cache and rebuild
# In Dokploy: Settings → Clear Build Cache → Deploy
```

**Error:** Turbopack issues in production
```bash
# Already handled - Dockerfile uses build:prod script
# which uses standard Next.js build
```

### Container Starts but App Not Accessible

1. Check container logs in Dokploy
2. Verify port mapping: Container 3000 → Host 80/443
3. Check firewall rules: `sudo ufw allow 3000`

### API Connection Errors

**Error:** "Unable to connect to AI assistant"

1. Verify backend is running: `curl http://backend-url:8001/api/v1/health`
2. Check `NEXT_PUBLIC_API_BASE_URL` environment variable
3. If using internal network, ensure containers are on same network
4. Check CORS settings on backend

**Check from inside container:**
```bash
docker exec -it <container-id> sh
wget -O- http://your-backend-url:8001/api/v1/health
```

### Frontend Loads but Backend Unreachable

**CORS Issue:** Backend needs to allow frontend origin
```python
# Backend CORS configuration example
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://chat.yourdomain.com"
]
```

**Network Issue:** Use Docker network name for backend URL
```
NEXT_PUBLIC_API_BASE_URL=http://backend-service:8001
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8001` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Internal port (set in Dockerfile) | `3000` |

**Important:** Only `NEXT_PUBLIC_*` variables are accessible in the browser. Backend URL must be public or accessible from the frontend container.

## Performance Optimization

### Enable Caching
Add to `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
};
```

### Use CDN for Static Assets
Configure in Dokploy:
- Enable static file serving
- Configure CDN domain if available

### Monitor Resources
In Dokploy dashboard:
- Check CPU/Memory usage
- Set resource limits if needed
- Configure auto-restart on failure

## Updating the Application

1. Push changes to git
2. In Dokploy, click "Redeploy"
3. Zero-downtime deployment (Dokploy handles gracefully)

Or use webhooks for automatic deployment on git push.

## Backup and Rollback

**Rollback to previous version:**
1. In Dokploy: Deployment History
2. Select previous deployment
3. Click "Rollback"

**Backup environment variables:**
Export from Dokploy before making changes.

## Security Checklist

- [ ] Environment variables configured (not hardcoded)
- [ ] SSL/HTTPS enabled for production domain
- [ ] CORS properly configured on backend
- [ ] Firewall rules configured (only necessary ports open)
- [ ] Container running as non-root user (handled in Dockerfile)
- [ ] Regular security updates (update base image)

## Support

If you encounter issues:
1. Check Dokploy logs: Application → Logs
2. Check container logs: `docker logs <container-id>`
3. Verify environment variables are set correctly
4. Test backend connectivity from container
5. Check CLAUDE.md for development details

## Next Steps After Deployment

1. Test both standard and streaming chat modes
2. Verify error handling with intentional failures
3. Monitor performance and resource usage
4. Set up monitoring/alerting (optional)
5. Configure automated backups (optional)
