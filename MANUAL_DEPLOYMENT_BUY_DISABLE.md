# Manual Deployment Guide - Disable Investment-Grade Whisky Casks Section

## What Needs to Be Done

The "Investment-Grade Whisky Casks" section on https://viticultwhisky.co.uk/buy-sell needs to be disabled. The local codebase has already been updated, but the changes need to be deployed to the live website.

## Current Status

✅ **Local Code Updated**: The buy section is commented out in the local BuySellWhisky.tsx component
✅ **Frontend Built**: The build/ directory contains the updated code with buy section disabled
❌ **Live Website**: Still showing the old version with the Investment-Grade casks

## Manual Deployment Steps

### Option 1: Upload Built Files via SSH

1. **Connect to VPS**:
   ```bash
   ssh root@31.97.57.193
   # Password: --w(7rjMOF4'nzhIOuOdPF
   ```

2. **Navigate to website directory**:
   ```bash
   cd /var/www/viticultwhisky.co.uk
   # or 
   cd /var/www/html
   # (check which directory contains the website files)
   ```

3. **Backup current files**:
   ```bash
   cp -r static/ static_backup_$(date +%Y%m%d_%H%M%S)/
   ```

4. **Upload new build files**:
   From your local machine, upload the build directory:
   ```bash
   scp -r /Users/adityapachauri/Desktop/Whisky/frontend/build/* root@31.97.57.193:/var/www/viticultwhisky.co.uk/
   ```

### Option 2: Update Source Code and Rebuild

1. **Connect to VPS and navigate to source**:
   ```bash
   ssh root@31.97.57.193
   cd /var/www/whisky/frontend/src/components/sections/
   ```

2. **Edit the BuySellWhisky.tsx file**:
   ```bash
   nano BuySellWhisky.tsx
   ```

3. **Comment out the buy section** (around line 95-98):
   ```typescript
   {/* Buy Section - TEMPORARILY DISABLED */}
   {/* 
   {activeTab === 'buy' && (
     // Buy section content commented out - will be re-enabled when requested
   )}
   */}
   ```

4. **Also ensure the buy tab is hidden** (around line 80-90):
   ```typescript
   {/* Buy Whisky tab hidden - section temporarily disabled */}
   <button
     onClick={() => setActiveTab('sell')}
     className="px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-300 bg-gradient-to-r from-antique-gold via-premium-gold to-bright-gold text-primary-black"
   >
     Sell Whisky
   </button>
   ```

5. **Rebuild the frontend**:
   ```bash
   cd /var/www/whisky/frontend
   npm run build
   ```

6. **Copy build to web directory**:
   ```bash
   cp -r build/* /var/www/viticultwhisky.co.uk/
   ```

### Option 3: Direct File Replacement

If the website is using static files, you can directly replace the JavaScript bundle:

1. **Find the main JS file on the server**:
   ```bash
   find /var/www -name "main.*.js" -type f
   ```

2. **Replace with the updated build file**:
   ```bash
   cp /Users/adityapachauri/Desktop/Whisky/frontend/build/static/js/main.*.js /path/to/website/static/js/
   ```

## Files That Have Been Updated

### Local Files Modified:
- `/Users/adityapachauri/Desktop/Whisky/frontend/src/components/sections/BuySellWhisky.tsx`
  - Buy section commented out
  - Default tab set to 'sell'
  - Buy tab hidden

- `/Users/adityapachauri/Desktop/Whisky/frontend/src/App.tsx`
  - `/buy` route redirects to `/contact`

- `/Users/adityapachauri/Desktop/Whisky/frontend/src/pages/BuySell.tsx`
  - Hero buttons updated to focus on selling

### Build Files Ready:
- `/Users/adityapachauri/Desktop/Whisky/frontend/build/` - Contains the compiled version with disabled buy section

## Verification

After deployment, check:

1. **Visit**: https://viticultwhisky.co.uk/buy-sell
2. **Verify**: The "Investment-Grade Whisky Casks" section should no longer appear
3. **Check**: Only the "Sell Whisky" tab should be visible
4. **Test**: The /buy route should redirect to /contact

## Expected Result

The buy-sell page should show:
- ✅ Hero section (unchanged)
- ✅ Only "Sell Whisky" tab (buy tab hidden)
- ❌ No "Investment-Grade Whisky Casks" section
- ✅ "Turn Your Whisky Investment Into Profit" section (sell functionality)
- ✅ "Why Trade With Us?" section focusing on selling

## Rollback Plan

If needed to restore buy functionality:
1. Uncomment the buy section in BuySellWhisky.tsx
2. Restore the buy tab
3. Remove the route redirect in App.tsx
4. Rebuild and deploy

## Contact

If you need assistance with the deployment, the files are ready and the changes are properly tested locally.