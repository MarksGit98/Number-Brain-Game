# Deployment Guide for Web Version

This guide explains how to deploy the Digitl web version to various hosting platforms.

## Prerequisites

1. Build the web version:
   ```bash
   npm run web:build
   ```

2. The build output will be in the `web-build` directory.

## Deployment Options

### Option 1: Netlify (Recommended - Free & Easy)

1. **Sign up** at [netlify.com](https://www.netlify.com)

2. **Install Netlify CLI** (optional):
   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy via CLI**:
   ```bash
   cd web-build
   netlify deploy --prod
   ```

4. **Or deploy via Drag & Drop**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag and drop the `web-build` folder
   - Your site will be live instantly!

5. **Configure custom domain** (optional):
   - Go to Site settings → Domain management
   - Add your custom domain
   - Follow DNS configuration instructions

### Option 2: Vercel (Recommended - Free & Fast)

1. **Sign up** at [vercel.com](https://www.vercel.com)

2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Deploy**:
   ```bash
   cd web-build
   vercel --prod
   ```

4. **Or deploy via GitHub**:
   - Connect your GitHub repository
   - Vercel will auto-deploy on every push

### Option 3: GitHub Pages (Free)

1. **Create a GitHub repository** (if you haven't already)

2. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add to package.json**:
   ```json
   "scripts": {
     "deploy": "gh-pages -d web-build"
   }
   ```

4. **Deploy**:
   ```bash
   npm run web:build
   npm run deploy
   ```

5. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select `gh-pages` branch
   - Your site will be at `https://yourusername.github.io/repository-name`

### Option 4: Firebase Hosting (Free)

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase**:
   ```bash
   firebase init hosting
   ```
   - Select `web-build` as public directory
   - Configure as single-page app: **Yes**

4. **Deploy**:
   ```bash
   npm run web:build
   firebase deploy --only hosting
   ```

### Option 5: AWS S3 + CloudFront

1. **Create S3 bucket**:
   - Go to AWS Console → S3
   - Create bucket with public read access
   - Enable static website hosting

2. **Upload files**:
   ```bash
   aws s3 sync web-build/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront** (optional, for CDN):
   - Create CloudFront distribution
   - Point to S3 bucket
   - Use custom domain with SSL

### Option 6: Traditional Web Hosting (cPanel, FTP, etc.)

1. **Build the project**:
   ```bash
   npm run web:build
   ```

2. **Upload files**:
   - Connect via FTP/SFTP to your hosting
   - Upload all files from `web-build` folder
   - Upload to `public_html` or `www` directory

3. **Configure**:
   - Ensure your hosting supports Node.js/static sites
   - Set up custom domain if needed

## Environment Variables for Production

Before building, set up your Google AdSense credentials:

1. **Create `.env` file** in the root directory:
   ```
   REACT_APP_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
   REACT_APP_ADSENSE_BANNER_ID=your-banner-ad-unit-id
   REACT_APP_ADSENSE_INTERSTITIAL_ID=your-interstitial-ad-unit-id
   ```

2. **Or set in hosting platform**:
   - Netlify: Site settings → Environment variables
   - Vercel: Project settings → Environment variables
   - Firebase: Functions config

## Setting Up Google AdSense

1. **Sign up** at [Google AdSense](https://www.google.com/adsense)

2. **Get your Publisher ID**:
   - Format: `ca-pub-XXXXXXXXXXXXXXXX`
   - Found in AdSense dashboard

3. **Create ad units**:
   - Banner ad unit (for bottom of screen)
   - Interstitial ad unit (for full-screen ads)
   - Copy the ad unit IDs

4. **Update `web/adManager.ts`**:
   - Replace `ADSENSE_PUBLISHER_ID` with your publisher ID
   - Replace ad unit IDs in `AD_UNIT_IDS`

## Post-Deployment Checklist

- [ ] Test the game on desktop browser
- [ ] Test the game on mobile browser
- [ ] Verify Google AdSense ads are loading
- [ ] Check that sounds are working
- [ ] Verify localStorage is saving game progress
- [ ] Test on different screen sizes
- [ ] Set up custom domain (if needed)
- [ ] Configure HTTPS/SSL (most platforms do this automatically)
- [ ] Set up analytics (Google Analytics, etc.)

## Troubleshooting

### Ads not showing
- Verify AdSense account is approved
- Check ad unit IDs are correct
- Ensure domain is verified in AdSense
- Check browser console for errors

### Sounds not playing
- Verify sound files are in `web-build/assets/sounds/`
- Check browser autoplay policies
- Some browsers require user interaction before playing sounds

### Build errors
- Clear `web-build` folder and rebuild
- Check Node.js version (should be 14+)
- Verify all dependencies are installed

## Continuous Deployment

For automatic deployments:

1. **Netlify/Vercel**: Connect GitHub repo for auto-deploy
2. **GitHub Actions**: Create workflow file for CI/CD
3. **GitLab CI/CD**: Use `.gitlab-ci.yml` for automation

## Support

For issues or questions:
- Check Expo web documentation
- Review hosting platform documentation
- Check browser console for errors

