# 🚀 VPS Setup Commands

After connecting to your VPS (31.97.57.193), run these commands:

```bash
# Rename for clean URL structure
mv whisky-investment-platform viticult-whisky

# Navigate to project
cd viticult-whisky

# Check project structure
ls -la

# Make deployment script executable
chmod +x docs/scripts/deploy.sh

# Run deployment (this handles everything automatically)
./docs/scripts/deploy.sh

# Install enterprise automation scripts
sudo ./backend/scripts/cron-setup.sh

# Activate automation
sudo crontab /tmp/viticult-crontab

# Verify everything is running
pm2 status
sudo systemctl status nginx
```

## Quick Test
Once complete, your site will be live at your domain!

**Status Check:**
```bash
curl -I http://localhost:3000  # Frontend
curl -I http://localhost:5001/health  # Backend API
```

🎉 **Enterprise automation now active with 24/7 monitoring!**