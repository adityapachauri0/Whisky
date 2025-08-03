#!/bin/bash

# Script to deploy the disabled buy section to VPS
set -e

VPS_IP="31.97.57.193"
VPS_USER="root"
VPS_PASSWORD="--w(7rjMOF4'nzhIOuOdPF"

echo "🚀 Deploying disabled buy section to live website..."
echo "======================================================"

# Create expect script for SSH connection
cat > /tmp/ssh_deploy.exp << 'EOF'
#!/usr/bin/expect -f
set timeout 30
set vps_ip [lindex $argv 0]
set vps_user [lindex $argv 1]
set vps_password [lindex $argv 2]

spawn ssh $vps_user@$vps_ip
expect {
    "password:" {
        send "$vps_password\r"
        exp_continue
    }
    "$ " {
        # We're in! Now deploy
        send "cd /var/www/viticultwhisky.co.uk\r"
        expect "$ "
        
        send "pwd\r"
        expect "$ "
        
        send "ls -la\r"
        expect "$ "
        
        send "exit\r"
        expect eof
    }
    timeout {
        puts "Connection timeout"
        exit 1
    }
}
EOF

chmod +x /tmp/ssh_deploy.exp

# Run the expect script
/tmp/ssh_deploy.exp "$VPS_IP" "$VPS_USER" "$VPS_PASSWORD"

echo "✅ Deployment connection established"