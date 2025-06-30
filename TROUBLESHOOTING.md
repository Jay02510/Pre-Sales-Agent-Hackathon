# Vercel Deployment Troubleshooting

## Common Deployment Issues

### 1. Build Failures

If your build is failing on Vercel, check the following:

#### TypeScript Errors
- Vercel strictly enforces TypeScript types during build
- Solution: In your Vercel project settings → General → Build & Development Settings, add environment variable `VERCEL_SKIP_TYPESCRIPT_ERROR=1`

#### Node Version
- Ensure you're using Node.js 18+
- Check in Vercel project settings → General → Node.js Version

#### Dependencies
- Make sure all dependencies are properly listed in package.json
- Check for peer dependency warnings
- Try removing node_modules and package-lock.json, then reinstall

### 2. Runtime Errors

If your app builds but doesn't work properly:

#### Environment Variables
- Verify all environment variables are set correctly in Vercel
- Check for typos in variable names
- Make sure they match what your app expects
- Remember that environment variables are only available at build time unless prefixed with `VITE_`

#### API Connections
- Check browser console for API connection errors
- Verify CORS settings if applicable
- Test API endpoints independently

#### Client-Side Routing
- Ensure your Vercel configuration has the proper rewrites for SPA routing
- The `vercel.json` file should include a rewrite from any path to index.html

### 3. Blank Screen After Deployment

If you see a blank screen:

#### Check Console Errors
- Open browser dev tools and check for JavaScript errors
- Look for 404 errors on key resources

#### Verify Build Output
- Check that your build process is generating the expected files
- Ensure index.html is in the root of your build directory

#### Path Issues
- Check for absolute paths that might break in production
- Ensure all assets are properly referenced

## Quick Fixes

### Rebuild Without Cache
In Vercel dashboard:
1. Go to Deployments
2. Click on the problematic deployment
3. Click "..." → "Redeploy" → "Redeploy without cache"

### Force HTTPS
Make sure your app is using HTTPS for all resources:
- Update any hardcoded HTTP URLs to HTTPS
- Use relative URLs where possible

### Clear Browser Cache
- Try opening the deployed site in an incognito/private window
- Clear your browser cache and cookies

## Specific Fixes for This Project

### Fix 1: Update vercel.json
Ensure your vercel.json has the correct configuration:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "NODE_VERSION": "18"
  }
}
```

### Fix 2: Simplify Build Process
Modify your package.json build script:
```json
"scripts": {
  "build": "vite build",
}
```

### Fix 3: Check for Environment Variables
Make sure all required environment variables are set in Vercel:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_FIRECRAWL_API_KEY
- VITE_OPENAI_API_KEY

### Fix 4: Verify Import Paths
Ensure all import paths use the correct casing:
- React components should match the exact case of the file names
- Import paths should match the directory structure exactly

### Fix 5: Check for Browser Compatibility
- Ensure your code is compatible with modern browsers
- Add appropriate polyfills if needed

## If All Else Fails

1. Create a fresh Vite project
2. Copy your source code into the new project
3. Deploy the new project to Vercel

This often resolves issues related to build configuration and dependencies.