# 🚀 GitHub Upload Instructions

## Step 1: Create GitHub Repository

1. Go to **https://github.com/new**
2. **Repository name**: `whisky-investment-platform`
3. **Description**: `Enterprise-grade whisky cask investment platform with automated monitoring`
4. **Public** ✅ 
5. **Don't initialize** with README (we have one)
6. Click **"Create repository"**

## Step 2: Upload Your Code

Copy and paste these commands one by one in your terminal:

```bash
# Navigate to your project
cd /Users/adityapachauri/Desktop/Whisky

# Add your GitHub repository (REPLACE 'yourusername' with your actual GitHub username)
git remote add origin https://github.com/yourusername/whisky-investment-platform.git

# Push to GitHub
git push -u origin main
```

## Step 3: Verify Upload

Your repository will be live at:
`https://github.com/yourusername/whisky-investment-platform`

## Step 4: VPS Deployment

Once on GitHub, deploy to any VPS with:

```bash
git clone https://github.com/yourusername/whisky-investment-platform.git
cd whisky-investment-platform
chmod +x docs/scripts/deploy.sh && ./docs/scripts/deploy.sh
sudo ./backend/scripts/cron-setup.sh && sudo crontab /tmp/viticult-crontab
```

🎉 **Your enterprise whisky platform will be LIVE!**