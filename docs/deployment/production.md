# Production Deployment

## Overview

This guide covers deploying the Modular Health System to a production environment with high availability, security, and performance.

## Server Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 50GB SSD
- **OS**: Ubuntu 20.04 LTS or CentOS 8

### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 100GB+ SSD
- **OS**: Ubuntu 22.04 LTS
- **Network**: 1Gbps connection

## Pre-deployment Setup

### 1. System Updates
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential
```

### 2. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3. Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE health_system_prod;
CREATE USER health_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE health_system_prod TO health_user;
\q
```

### 4. Install PM2
```bash
sudo npm install -g pm2
```

### 5. Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Application Deployment

### 1. Clone and Setup Application
```bash
# Create application user
sudo useradd -m -s /bin/bash healthapp
sudo su - healthapp

# Clone repository
git clone <your-repository-url> /home/healthapp/health-system
cd /home/healthapp/health-system

# Install dependencies
npm ci --only=production
```

### 2. Environment Configuration
```bash
# Create production environment file
cat > .env << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://health_user:secure_password_here@localhost:5432/health_system_prod"
JWT_SECRET="your-super-secure-jwt-secret-key-here"
JWT_EXPIRES_IN="24h"

# Security settings
CORS_ORIGIN="https://yourdomain.com"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/health-system/app.log

# Email settings (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File upload settings
UPLOAD_MAX_SIZE=10485760
UPLOAD_DEST=/home/healthapp/health-system/uploads
EOF

# Secure the environment file
chmod 600 .env
```

### 3. Database Migration
```bash
npx prisma migrate deploy
npx prisma generate
npm run seed
```

### 4. Build Application
```bash
npm run build
```

### 5. Create Log Directory
```bash
sudo mkdir -p /var/log/health-system
sudo chown healthapp:healthapp /var/log/health-system
```

## Process Management with PM2

### 1. PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'health-system',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/health-system/error.log',
    out_file: '/var/log/health-system/out.log',
    log_file: '/var/log/health-system/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'uploads'],
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### 2. Start Application
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. PM2 Monitoring
```bash
# View status
pm2 status

# View logs
pm2 logs health-system

# Monitor resources
pm2 monit

# Restart application
pm2 restart health-system

# Reload without downtime
pm2 reload health-system
```

## Nginx Configuration

### 1. Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/health-system
```

```nginx
upstream health_system {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Main application
    location / {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://health_system;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # API rate limiting
    location /api/auth/login {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://health_system;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /uploads {
        alias /home/healthapp/health-system/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        proxy_pass http://health_system;
        proxy_set_header Host $host;
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ \.(env|log)$ {
        deny all;
    }
}
```

### 2. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/health-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Database Optimization

### 1. PostgreSQL Configuration
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

```conf
# Memory settings
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# Connection settings
max_connections = 100
listen_addresses = 'localhost'

# Logging
log_statement = 'mod'
log_min_duration_statement = 1000
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '

# Performance
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

### 2. Database Backup
```bash
# Create backup script
cat > /home/healthapp/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/healthapp/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="health_system_prod"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h localhost -U health_user -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
EOF

chmod +x /home/healthapp/backup.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /home/healthapp/backup.sh
```

## Monitoring and Logging

### 1. Log Rotation
```bash
sudo nano /etc/logrotate.d/health-system
```

```
/var/log/health-system/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 healthapp healthapp
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 2. System Monitoring
```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Monitor application
pm2 monit

# Check system resources
htop
df -h
free -h
```

## Security Hardening

### 1. Firewall Configuration
```bash
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw status
```

### 2. Fail2Ban
```bash
sudo apt install -y fail2ban

# Configure Nginx protection
sudo nano /etc/fail2ban/jail.local
```

```ini
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
```

### 3. System Updates
```bash
# Enable automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Health Checks and Monitoring

### 1. Application Health Check
The application provides a health endpoint at `/health` that returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "database": "connected",
  "modules": {
    "patients": "healthy",
    "providers": "healthy",
    "billing": "healthy"
  }
}
```

### 2. External Monitoring
Set up external monitoring with services like:
- UptimeRobot
- Pingdom
- New Relic
- DataDog

## Deployment Checklist

- [ ] Server provisioned and secured
- [ ] Database installed and configured
- [ ] Application deployed and built
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Nginx configured and tested
- [ ] PM2 process manager configured
- [ ] Database backups scheduled
- [ ] Log rotation configured
- [ ] Monitoring set up
- [ ] Firewall configured
- [ ] Security hardening applied
- [ ] Health checks verified
- [ ] Performance testing completed

## Troubleshooting

### Common Issues

1. **Application won't start**
   - Check logs: `pm2 logs health-system`
   - Verify environment variables
   - Check database connectivity

2. **502 Bad Gateway**
   - Verify application is running: `pm2 status`
   - Check Nginx configuration: `sudo nginx -t`
   - Review Nginx logs: `sudo tail -f /var/log/nginx/error.log`

3. **Database connection errors**
   - Verify PostgreSQL is running: `sudo systemctl status postgresql`
   - Check database credentials
   - Test connection: `psql -h localhost -U health_user -d health_system_prod`

4. **High memory usage**
   - Monitor with: `pm2 monit`
   - Adjust PM2 memory limits
   - Optimize database queries

5. **SSL certificate issues**
   - Renew certificate: `sudo certbot renew`
   - Check certificate status: `sudo certbot certificates`