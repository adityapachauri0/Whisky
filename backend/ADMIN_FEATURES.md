# Admin Features Documentation

## Overview
This document describes the new admin features added to the ViticultWhisky backend:
1. Password change functionality
2. Excel export for form submissions

## Password Change Feature

### Endpoint
`POST /api/auth/admin/change-password`

### Headers Required
```
Authorization: Bearer <admin_token>
```

### Request Body
```json
{
  "currentPassword": "current_password_here",
  "newPassword": "new_password_here"
}
```

### Response
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Security Features
- Requires valid admin authentication token
- Validates current password before allowing change
- Minimum password length: 6 characters
- Passwords are hashed using bcrypt with salt rounds of 10
- Credentials stored in `/backend/config/admin-config.json` (auto-created)

## Excel Export Feature

### Endpoint
`GET /api/auth/admin/export-submissions`

### Headers Required
```
Authorization: Bearer <admin_token>
```

### Response
- Returns an Excel file (.xlsx) with all form submissions
- File is automatically downloaded
- Filename format: `whisky-submissions-YYYY-MM-DD.xlsx`

### Excel Sheets Included
1. **Contact Inquiries** - All contact form submissions
2. **Investment Inquiries** - All investment inquiry submissions  
3. **Sell Whisky Requests** - All sell whisky form submissions

### Data Included
Each sheet contains:
- All form fields
- Submission status
- Timestamps (created and updated)
- Formatted headers with styling

## Testing the Features

### Using the Test Script
```bash
cd backend
node test-admin-features.js
```

### Manual Testing with cURL

1. **Login as Admin**
```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@viticult.co.uk","password":"admin123"}'
```

2. **Change Password**
```bash
curl -X POST http://localhost:5000/api/auth/admin/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"currentPassword":"admin123","newPassword":"newPassword123"}'
```

3. **Export Submissions**
```bash
curl -X GET http://localhost:5000/api/auth/admin/export-submissions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -o whisky-submissions.xlsx
```

## Frontend Integration

### Change Password Form Example
```jsx
const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetch('/api/auth/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    const data = await response.json();
    if (data.success) {
      alert('Password changed successfully!');
    }
  } catch (error) {
    console.error('Password change failed:', error);
  }
};
```

### Export Button Example
```jsx
const exportSubmissions = async () => {
  try {
    const response = await fetch('/api/auth/admin/export-submissions', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whisky-submissions-${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
  } catch (error) {
    console.error('Export failed:', error);
  }
};
```

## Important Notes

1. **Default Credentials**
   - Email: `admin@viticult.co.uk`
   - Password: `admin123`
   - Change these immediately in production!

2. **Security Considerations**
   - Always use HTTPS in production
   - Implement proper session management
   - Consider adding 2FA for admin accounts
   - Regularly rotate passwords

3. **Excel Export Limitations**
   - Large datasets may take time to generate
   - Consider pagination for very large exports
   - Excel files are generated on-demand (not cached)

4. **Configuration Storage**
   - Admin credentials are stored in `/backend/config/admin-config.json`
   - This file is auto-created on first password change
   - Ensure this file is not committed to version control
   - Add to .gitignore: `/backend/config/admin-config.json`