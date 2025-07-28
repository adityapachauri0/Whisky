#!/bin/bash

# Production Credentials Manager for ViticultWhisky
# Centralized tool for managing admin access

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKUP_DIR="credential-backups"
LOG_FILE="credential-manager.log"

# Create necessary directories
mkdir -p "$BACKUP_DIR"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Display menu
show_menu() {
    clear
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   ViticultWhisky Credentials Manager   ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo "1. Setup Production Credentials"
    echo "2. Reset Admin Password"
    echo "3. Generate Recovery Token"
    echo "4. Backup Current Credentials"
    echo "5. Restore from Backup"
    echo "6. View Credential Status"
    echo "7. Generate Deployment Package"
    echo "8. Emergency Access Setup"
    echo "9. Audit Access Logs"
    echo "0. Exit"
    echo ""
    echo -e "${YELLOW}Choose an option:${NC} "
}

# Setup production credentials
setup_production() {
    echo -e "${GREEN}Setting up production credentials...${NC}"
    ./setup-admin-production.sh
    log "Production credentials setup completed"
}

# Reset admin password
reset_password() {
    echo -e "${GREEN}Resetting admin password...${NC}"
    
    if [ -f "./reset-admin-password.sh" ]; then
        ./reset-admin-password.sh
        log "Admin password reset completed"
    else
        echo -e "${RED}Error: reset-admin-password.sh not found${NC}"
    fi
}

# Generate recovery token
generate_recovery() {
    echo -e "${GREEN}Generating recovery token...${NC}"
    
    local token=$(openssl rand -hex 32)
    local timestamp=$(date +%Y%m%d-%H%M%S)
    
    # Save token securely
    echo "$token" | openssl enc -aes-256-cbc -salt -pbkdf2 -out "$BACKUP_DIR/recovery-token-$timestamp.enc"
    
    echo -e "${GREEN}Recovery token generated and encrypted${NC}"
    echo -e "${YELLOW}Token saved to: $BACKUP_DIR/recovery-token-$timestamp.enc${NC}"
    
    log "Recovery token generated: $timestamp"
}

# Backup credentials
backup_credentials() {
    echo -e "${GREEN}Backing up current credentials...${NC}"
    
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local backup_file="$BACKUP_DIR/credentials-backup-$timestamp.tar.gz"
    
    # Create backup
    tar -czf "$backup_file" \
        backend/.env \
        backend/.env.production \
        production-credentials-*.enc \
        2>/dev/null || true
    
    echo -e "${GREEN}Backup created: $backup_file${NC}"
    log "Credentials backed up: $backup_file"
}

# Restore from backup
restore_backup() {
    echo -e "${YELLOW}Available backups:${NC}"
    ls -1 "$BACKUP_DIR"/credentials-backup-*.tar.gz 2>/dev/null | nl
    
    echo ""
    read -p "Enter backup number to restore (0 to cancel): " choice
    
    if [ "$choice" -eq 0 ]; then
        return
    fi
    
    local backup_file=$(ls -1 "$BACKUP_DIR"/credentials-backup-*.tar.gz 2>/dev/null | sed -n "${choice}p")
    
    if [ -z "$backup_file" ]; then
        echo -e "${RED}Invalid selection${NC}"
        return
    fi
    
    # Create restore point
    backup_credentials
    
    # Restore
    tar -xzf "$backup_file" -C .
    
    echo -e "${GREEN}Restored from: $backup_file${NC}"
    log "Credentials restored from: $backup_file"
}

# View credential status
view_status() {
    echo -e "${BLUE}=== Credential Status ===${NC}"
    echo ""
    
    # Check local environment
    if [ -f "backend/.env" ]; then
        local email=$(grep "^ADMIN_EMAIL=" backend/.env | cut -d'=' -f2)
        echo -e "Local Admin Email: ${GREEN}$email${NC}"
    else
        echo -e "Local Admin Email: ${RED}Not configured${NC}"
    fi
    
    # Check production environment
    if [ -f "backend/.env.production" ]; then
        local prod_email=$(grep "^ADMIN_EMAIL=" backend/.env.production | cut -d'=' -f2)
        echo -e "Production Admin Email: ${GREEN}$prod_email${NC}"
    else
        echo -e "Production Admin Email: ${RED}Not configured${NC}"
    fi
    
    # Check backups
    local backup_count=$(ls -1 "$BACKUP_DIR"/credentials-backup-*.tar.gz 2>/dev/null | wc -l)
    echo -e "Credential Backups: ${GREEN}$backup_count${NC}"
    
    # Check encrypted credentials
    local enc_count=$(ls -1 production-credentials-*.enc 2>/dev/null | wc -l)
    echo -e "Encrypted Credentials: ${GREEN}$enc_count${NC}"
    
    # Last update
    if [ -f "$LOG_FILE" ]; then
        local last_update=$(tail -1 "$LOG_FILE" | cut -d']' -f1 | tr -d '[')
        echo -e "Last Update: ${YELLOW}$last_update${NC}"
    fi
    
    echo ""
    read -p "Press Enter to continue..."
}

# Generate deployment package
generate_deployment() {
    echo -e "${GREEN}Generating deployment package...${NC}"
    
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local deploy_dir="deployment-$timestamp"
    
    # Create deployment directory
    mkdir -p "$deploy_dir"
    
    # Copy necessary files
    cp deploy-admin-update.sh "$deploy_dir/"
    cp deploy-env-*.sh "$deploy_dir/" 2>/dev/null || true
    cp EMERGENCY_ACCESS_GUIDE.md "$deploy_dir/"
    
    # Create deployment README
    cat > "$deploy_dir/README.md" <<EOF
# Deployment Package - $timestamp

## Contents
- deploy-admin-update.sh - Main deployment script
- deploy-env-*.sh - Environment configuration
- EMERGENCY_ACCESS_GUIDE.md - Emergency procedures

## Deployment Steps
1. Upload this package to your production server
2. Run: ./deploy-admin-update.sh
3. Follow the prompts
4. Verify access after deployment

## Support
Refer to EMERGENCY_ACCESS_GUIDE.md for recovery options
EOF
    
    # Create archive
    tar -czf "$deploy_dir.tar.gz" "$deploy_dir"
    rm -rf "$deploy_dir"
    
    echo -e "${GREEN}Deployment package created: $deploy_dir.tar.gz${NC}"
    log "Deployment package generated: $deploy_dir.tar.gz"
}

# Emergency access setup
emergency_setup() {
    echo -e "${YELLOW}=== Emergency Access Setup ===${NC}"
    echo ""
    
    # Generate master key
    local master_key=$(openssl rand -hex 32)
    
    echo "Generated Master Key:"
    echo -e "${RED}$master_key${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Save this key in a secure location!${NC}"
    echo ""
    
    # Save encrypted copy
    read -s -p "Enter encryption password for master key backup: " enc_pass
    echo ""
    
    echo "$master_key" | openssl enc -aes-256-cbc -salt -pbkdf2 -pass pass:"$enc_pass" -out "$BACKUP_DIR/master-key-backup.enc"
    
    echo -e "${GREEN}Encrypted backup saved to: $BACKUP_DIR/master-key-backup.enc${NC}"
    
    # Create emergency kit
    cat > "EMERGENCY_KIT.txt" <<EOF
EMERGENCY ACCESS KIT
Generated: $(date)

Master Key: [Stored separately]
Backup Location: $BACKUP_DIR/master-key-backup.enc

Recovery Endpoints:
- POST /api/recovery/request-recovery
- POST /api/recovery/emergency-access

Emergency Contacts:
- Primary: admin@viticultwhisky.co.uk
- Backup: [Add backup contact]

Instructions:
1. Try password recovery first
2. Use master key if recovery fails
3. Contact support if both fail

Security Note: Store this kit securely!
EOF
    
    echo -e "${GREEN}Emergency kit created: EMERGENCY_KIT.txt${NC}"
    log "Emergency access configured"
}

# Audit access logs
audit_logs() {
    echo -e "${BLUE}=== Access Audit ===${NC}"
    echo ""
    
    if [ -f "backend.log" ]; then
        echo "Recent login attempts:"
        grep -i "login\|auth" backend.log | tail -10
        echo ""
        
        echo "Failed attempts:"
        grep -i "failed\|denied\|401" backend.log | tail -5
    else
        echo -e "${YELLOW}No logs found${NC}"
    fi
    
    echo ""
    read -p "Press Enter to continue..."
}

# Main loop
main() {
    log "Credential manager started"
    
    while true; do
        show_menu
        read -r choice
        
        case $choice in
            1) setup_production ;;
            2) reset_password ;;
            3) generate_recovery ;;
            4) backup_credentials ;;
            5) restore_backup ;;
            6) view_status ;;
            7) generate_deployment ;;
            8) emergency_setup ;;
            9) audit_logs ;;
            0) 
                echo -e "${GREEN}Exiting...${NC}"
                log "Credential manager stopped"
                exit 0 
                ;;
            *)
                echo -e "${RED}Invalid option${NC}"
                sleep 1
                ;;
        esac
    done
}

# Run main function
main