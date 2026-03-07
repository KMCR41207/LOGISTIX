# Logistix - Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `KMCR41207/LOGISTIX`
4. Vercel will auto-detect the Vite framework
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project root:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

## Build Configuration

The project is configured with:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Environment Variables

No environment variables are required for basic deployment.

## Post-Deployment

After deployment, your app will be available at:
- Production: `https://your-project.vercel.app`
- Preview: Automatic preview URLs for each commit

## Features

- ✅ Automatic deployments on git push
- ✅ Preview deployments for pull requests
- ✅ Custom domain support
- ✅ HTTPS by default
- ✅ Global CDN
- ✅ Serverless functions ready

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `npm run build` works locally
- Check Vercel build logs for specific errors

### 404 Errors on Routes
- The `vercel.json` file handles SPA routing
- All routes redirect to `index.html`

### Assets Not Loading
- Ensure all assets are in the `public` folder
- Use relative paths starting with `/`

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Support

For issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
