# Site Configuration Visual Guide

## 🎯 Overview

The Site Configuration feature allows you to manage Google Tag Manager, Google Search Console, and other analytics settings directly from the admin dashboard without modifying any code.

## 📸 Admin Dashboard

When you login to the admin dashboard (`/admin`), you'll see a new "Site Configuration" tab:

```
┌─────────────────────────────────────────────────────────┐
│ Admin Dashboard                                         │
│                                                         │
│ ┌─────────────┬──────────────────┬──────────────────┐ │
│ │ Contact     │ Sell Whisky      │ ⚙️ Site          │ │
│ │ Inquiries   │ Submissions      │ Configuration    │ │
│ └─────────────┴──────────────────┴──────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Site Configuration Interface

### 1. Google Tag Manager Section

```
┌─────────────────────────────────────────────────────────┐
│ 🏷️ Google Tag Manager                        [✓] Enabled│
│                                                         │
│ Container ID                                           │
│ ┌─────────────────────────────────┐ ┌──────────┐     │
│ │ GTM-XXXXXXX                     │ │  Test    │     │
│ └─────────────────────────────────┘ └──────────┘     │
│                                                         │
│ ℹ️ Get your container ID from Google Tag Manager       │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ ℹ️ Implementation Status                         │   │
│ │ GTM will be automatically added to all pages    │   │
│ │ Container ID: GTM-XXXXXXX                       │   │
│ └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 2. Google Search Console Section

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Google Search Console                    [✓] Enabled│
│                                                         │
│ Verification Code (HTML Tag)                           │
│ ┌─────────────────────────────────────────────────┐   │
│ │ abc123def456...                                 │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ ℹ️ Only the content value from the meta tag           │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ ✅ Verification meta tag will be added:         │   │
│ │ <meta name="google-site-verification"           │   │
│ │       content="abc123def456..." />              │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ Sitemap URL:                              [📋 Copy]    │
│ ┌─────────────────────────────────────────────────┐   │
│ │ https://yourdomain.com/api/config/sitemap.xml   │   │
│ └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 3. Google Analytics 4 Section

```
┌─────────────────────────────────────────────────────────┐
│ 📊 Google Analytics 4                       [✓] Enabled│
│                                                         │
│ Measurement ID                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ G-XXXXXXXXXX                                     │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ ℹ️ Found in GA4 Admin → Data Streams                  │
└─────────────────────────────────────────────────────────┘
```

### 4. SEO Settings Section

```
┌─────────────────────────────────────────────────────────┐
│ 🌐 SEO Settings                                        │
│                                                         │
│ Default Title                                          │
│ ┌─────────────────────────────────────────────────┐   │
│ │ ViticultWhisky - Premium Cask Investment        │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ Default Description                                    │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Invest in premium Scottish whisky casks.        │   │
│ │ Secure, sustainable, and profitable             │   │
│ │ alternative investments.                        │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ robots.txt Content                         [Preview]   │
│ ┌─────────────────────────────────────────────────┐   │
│ │ User-agent: *                                   │   │
│ │ Disallow: /admin                                │   │
│ │ Disallow: /api/                                 │   │
│ │ Allow: /                                        │   │
│ │                                                 │   │
│ │ Sitemap: https://yourdomain.com/sitemap.xml    │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ ℹ️ Accessible at: /api/config/robots.txt              │
└─────────────────────────────────────────────────────────┘
```

### 5. Save Button

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                              ┌────────────────────┐    │
│                              │ Save Configuration │    │
│                              └────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 🚀 How It Works

1. **Configuration Storage**
   - All settings are stored in MongoDB
   - Single configuration document for the entire site
   - Automatically creates default config if none exists

2. **Dynamic Loading**
   - Frontend fetches config on app initialization
   - GTM script injected only if enabled
   - Search Console meta tag added dynamically
   - No hardcoded scripts needed

3. **API Endpoints**
   ```
   GET  /api/config/public      # Public config (enabled services only)
   GET  /api/config/admin       # Full config (admin only)
   PUT  /api/config/admin       # Update config (admin only)
   GET  /api/config/robots.txt  # Dynamic robots.txt
   GET  /api/config/sitemap.xml # Dynamic sitemap
   ```

4. **Security**
   - Admin routes protected with JWT authentication
   - Public endpoint only exposes necessary data
   - CSP headers configured for GTM domains

## 🎨 Features

### ✅ Google Tag Manager
- Container ID validation (GTM-XXXXXXX format)
- Test button to verify format
- Enable/disable toggle
- Automatic script injection

### ✅ Google Search Console
- HTML verification tag support
- Sitemap URL generation
- Copy-to-clipboard functionality
- Meta tag preview

### ✅ Google Analytics 4
- Measurement ID input (G-XXXXXXXXXX format)
- Integration with GTM
- Enable/disable toggle

### ✅ SEO Settings
- Default meta tags configuration
- robots.txt editor with preview
- Sitemap generation
- Keyword management

## 💡 Benefits

1. **No Code Changes Required**
   - Update analytics without deployment
   - Enable/disable services instantly
   - Change configurations on the fly

2. **Centralized Management**
   - All analytics in one place
   - Single source of truth
   - Easy to maintain

3. **Production Ready**
   - Works with CSP headers
   - Secure admin-only access
   - Validation before saving

4. **SEO Friendly**
   - Dynamic sitemap generation
   - Customizable robots.txt
   - Search Console integration

## 🔧 Technical Implementation

The system consists of:

1. **Backend Model** (`SiteConfig.js`)
   - Mongoose schema for configuration
   - Validation rules for IDs
   - Default values

2. **API Routes** (`routes/config.js`)
   - Public and admin endpoints
   - Sitemap/robots.txt generation
   - GTM validation

3. **Frontend Component** (`SiteConfigManager.tsx`)
   - React component with form inputs
   - Real-time validation
   - Save/test functionality

4. **Analytics Hook** (`useGTM.ts`)
   - Fetches config on load
   - Dynamically injects scripts
   - Handles Search Console meta tag

## 📝 Usage Example

1. Login to admin dashboard
2. Click "Site Configuration" tab
3. Enter your GTM Container ID (e.g., GTM-ABC123)
4. Click "Test" to validate
5. Check "Enabled" checkbox
6. Click "Save Configuration"
7. GTM will now load on all pages automatically!

---

This visual guide shows the complete Site Configuration interface and how to use it to manage your analytics without touching any code.