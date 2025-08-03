# Transfer Sell Whisky Fix to Production

## File Changed Locally
- **File**: `frontend/src/pages/SellWhisky.tsx`
- **Line**: 31
- **Issue**: Frontend was calling `/api/api/sell-whisky` (double API path)

## Transfer Commands

```bash
# 1. Copy the fixed file to VPS
scp /Users/adityapachauri/Desktop/Whisky/frontend/src/pages/SellWhisky.tsx root@31.97.57.193:/var/www/viticultwhisky/frontend/src/pages/

# 2. SSH to VPS and rebuild frontend
ssh root@31.97.57.193
cd /var/www/viticultwhisky/frontend
npm run build

# 3. Restart services if needed
pm2 restart viticult-frontend
pm2 restart viticult-backend
```

## Verification After Transfer

1. Test the Sell Whisky form on production: https://viticultwhisky.co.uk/sell-whisky
2. Fill out the form and submit
3. Check for success message: "Thank you! We've received your submission..."
4. Login to admin dashboard and verify submission appears

## What Was Fixed

The frontend was incorrectly constructing the API URL:
- ❌ Before: `https://viticultwhisky.co.uk/api/api/sell-whisky`
- ✅ After: `https://viticultwhisky.co.uk/api/sell-whisky`

This fix ensures the Sell Whisky form submissions work correctly in production.