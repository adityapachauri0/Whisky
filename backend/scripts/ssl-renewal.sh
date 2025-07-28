#!/bin/bash

# SSL Certificate Renewal Script
# Automatic SSL certificate renewal with Let's Encrypt

DOMAIN="viticultwhisky.co.uk"
WWW_DOMAIN="www.viticultwhisky.co.uk"
WEBROOT="/var/www/viticult-whisky/frontend/build"
EMAIL="admin@viticultwhisky.co.uk"

echo "$(date): Starting SSL certificate renewal check"

# Check if certbot is installed
if ! command -v certbot >/dev/null 2>&1; then
    echo "$(date): ERROR - certbot not installed"
    echo "To install: sudo apt-get install certbot python3-certbot-nginx"
    exit 1
fi

# Check certificate expiry
if [ -f "/etc/letsencrypt/live/$DOMAIN/cert.pem" ]; then
    EXPIRY_DATE=$(openssl x509 -in /etc/letsencrypt/live/$DOMAIN/cert.pem -noout -dates | grep notAfter | cut -d= -f2)
    EXPIRY_TIMESTAMP=$(date -d "$EXPIRY_DATE" +%s)
    CURRENT_TIMESTAMP=$(date +%s)
    DAYS_UNTIL_EXPIRY=$(( (EXPIRY_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))
    
    echo "$(date): Certificate expires in $DAYS_UNTIL_EXPIRY days"
    
    # Only renew if certificate expires in less than 30 days
    if [ $DAYS_UNTIL_EXPIRY -gt 30 ]; then
        echo "$(date): Certificate is still valid for $DAYS_UNTIL_EXPIRY days, no renewal needed"
        exit 0
    fi
else
    echo "$(date): No existing certificate found, will attempt to obtain new certificate"
    DAYS_UNTIL_EXPIRY=0
fi

# Stop nginx temporarily for standalone mode (alternative method)
# systemctl stop nginx

# Attempt certificate renewal
echo "$(date): Attempting certificate renewal..."

# Method 1: Using nginx plugin (preferred)
if certbot renew --nginx --non-interactive --agree-tos; then
    echo "$(date): ✅ Certificate renewed successfully using nginx plugin"
    RENEWAL_SUCCESS=true
else
    echo "$(date): Nginx plugin renewal failed, trying webroot method..."
    
    # Method 2: Using webroot method
    if certbot certonly --webroot -w $WEBROOT -d $DOMAIN -d $WWW_DOMAIN --non-interactive --agree-tos --email $EMAIL; then
        echo "$(date): ✅ Certificate obtained/renewed successfully using webroot method"
        RENEWAL_SUCCESS=true
    else
        echo "$(date): Webroot renewal failed, trying standalone method..."
        
        # Method 3: Standalone method (requires stopping nginx)
        systemctl stop nginx
        
        if certbot certonly --standalone -d $DOMAIN -d $WWW_DOMAIN --non-interactive --agree-tos --email $EMAIL; then
            echo "$(date): ✅ Certificate obtained/renewed successfully using standalone method"
            RENEWAL_SUCCESS=true
        else
            echo "$(date): ❌ All renewal methods failed"
            RENEWAL_SUCCESS=false
        fi
        
        # Restart nginx
        systemctl start nginx
    fi
fi

# Reload nginx if renewal was successful
if [ "$RENEWAL_SUCCESS" = true ]; then
    echo "$(date): Reloading nginx configuration..."
    
    # Test nginx configuration first
    if nginx -t; then
        systemctl reload nginx
        echo "$(date): ✅ Nginx reloaded successfully"
        
        # Verify certificate
        NEW_EXPIRY_DATE=$(openssl x509 -in /etc/letsencrypt/live/$DOMAIN/cert.pem -noout -dates | grep notAfter | cut -d= -f2)
        NEW_EXPIRY_TIMESTAMP=$(date -d "$NEW_EXPIRY_DATE" +%s)
        NEW_DAYS_UNTIL_EXPIRY=$(( (NEW_EXPIRY_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))
        
        echo "$(date): New certificate valid for $NEW_DAYS_UNTIL_EXPIRY days"
        
        # Send success notification
        # echo "SSL certificate renewed successfully. Valid for $NEW_DAYS_UNTIL_EXPIRY days." | mail -s "SSL Renewal Success" $EMAIL
        
    else
        echo "$(date): ❌ Nginx configuration test failed"
        # Send error notification
        # echo "SSL certificate renewed but nginx configuration is invalid" | mail -s "SSL Renewal Error" $EMAIL
    fi
else
    echo "$(date): ❌ Certificate renewal failed"
    
    # Send failure notification
    # echo "SSL certificate renewal failed. Manual intervention required." | mail -s "SSL Renewal FAILED" $EMAIL
    
    # If certificate is expiring soon, this is critical
    if [ $DAYS_UNTIL_EXPIRY -lt 7 ]; then
        echo "$(date): 🚨 CRITICAL: Certificate expires in $DAYS_UNTIL_EXPIRY days and renewal failed"
        # Send critical alert
        # echo "CRITICAL: SSL certificate expires in $DAYS_UNTIL_EXPIRY days and automatic renewal failed!" | mail -s "CRITICAL SSL ALERT" $EMAIL
    fi
fi

# Check if auto-renewal is set up
if ! crontab -l | grep -q "certbot renew"; then
    echo "$(date): Setting up automatic renewal in crontab"
    
    # Add certbot renewal to crontab (runs twice daily)
    (crontab -l 2>/dev/null; echo "0 */12 * * * /usr/bin/certbot renew --quiet --no-self-upgrade") | crontab -
    
    echo "$(date): ✅ Automatic renewal set up in crontab"
fi

echo "$(date): SSL certificate renewal process completed"