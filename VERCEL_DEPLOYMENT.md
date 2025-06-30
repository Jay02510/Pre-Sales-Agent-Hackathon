# Vercel Deployment Guide

## Quick Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Connect your GitHub repository
4. Vercel will auto-detect the build settings from `vercel.json`

### 3. Configure Environment Variables
In Vercel dashboard → Project settings → Environment variables, add:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 4. Deploy
- Vercel will automatically build and deploy your app
- Your app will be live at your Vercel deployment URL

## Troubleshooting Deployment Issues

### Common Issues

#### Build Failures
- Check build logs for specific errors
- Ensure all dependencies are properly listed in package.json
- Verify TypeScript configuration is correct

#### Environment Variables
- Double-check that all environment variables are correctly set in Vercel
- Remember that environment variables are only available at build time unless prefixed with `VITE_`

#### Routing Issues
- Ensure the `rewrites` configuration in vercel.json is correct
- This handles client-side routing for SPAs

#### API Connection Issues
- Check CORS settings if connecting to external APIs
- Verify API keys and endpoints are correct

### Quick Fixes

#### Force Clean Rebuild
In Vercel dashboard:
1. Go to Deployments
2. Click on the problematic deployment
3. Click "..." → "Redeploy" → "Redeploy without cache"

#### Check Logs
- Review build logs and function logs for specific errors
- Look for any missing dependencies or configuration issues

## App Features in Production

### ✅ Works Without Configuration
- Demo mode with mock data
- Example reports and UI
- Cost optimization features
- Service status checking

### ✅ Enhanced with Configuration
- **Supabase**: User authentication + report persistence
- **Firecrawl**: Real web scraping
- **OpenAI**: Real AI analysis
- **All Services**: Full functionality

## Service Configuration Status

The app intelligently detects which services are configured:

- 🟢 **Configured**: Uses live data
- 🟡 **Not Configured**: Uses enhanced mock data
- 🔵 **Mixed**: Partial live functionality

## Post-Deployment Checklist

1. ✅ Site loads correctly
2. ✅ Service status shows current configuration
3. ✅ Demo report generation works
4. ✅ Cost monitor displays properly
5. ✅ All navigation works
6. ✅ Responsive design on mobile

## Optional: Custom Domain
1. In Vercel: Project settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

Your app is production-ready! 🚀