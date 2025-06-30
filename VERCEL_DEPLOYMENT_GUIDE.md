# Vercel Deployment Guide for Glance

## Fixing Blank Screen Issues

We've made the following changes to fix the blank screen issue:

1. **Updated vercel.json**:
   - Added proper route handling with `"handle": "filesystem"` to serve static files first
   - Ensured all other routes redirect to index.html for client-side routing

2. **Fixed package.json**:
   - Simplified the build script to just use `vite build` without TypeScript checking
   - Added missing testing dependencies

3. **Added _redirects file**:
   - Created a public/_redirects file for fallback routing

4. **Updated vite.config.ts**:
   - Enabled sourcemaps for better debugging
   - Configured manual chunks for better performance

## Environment Variables

Make sure to set these environment variables in your Vercel project settings:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Deployment Steps

1. Push your changes to GitHub
2. In Vercel, connect to your GitHub repository
3. Configure the environment variables
4. Deploy the project

## Troubleshooting Blank Screen Issues

If you still encounter a blank screen:

1. **Check the Console**:
   - Open browser dev tools (F12) and check for JavaScript errors
   - Look for 404 errors on key resources

2. **Verify Build Output**:
   - Check that your build process is generating the expected files
   - Ensure index.html is in the root of your build directory

3. **Clear Browser Cache**:
   - Try opening the deployed site in an incognito/private window
   - Clear your browser cache and cookies

4. **Check Environment Variables**:
   - Verify all environment variables are correctly set in Vercel
   - Remember that environment variables are only available at build time unless prefixed with `VITE_`

5. **Try a Manual Deployment**:
   - Build locally with `npm run build`
   - Use Vercel CLI to deploy: `vercel --prod`

## Post-Deployment Checklist

- [ ] Site loads correctly (no blank screen)
- [ ] Service status shows current configuration
- [ ] Demo report generation works
- [ ] All navigation works
- [ ] Responsive design on mobile

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router with Vercel](https://vercel.com/guides/using-react-router-with-vercel)