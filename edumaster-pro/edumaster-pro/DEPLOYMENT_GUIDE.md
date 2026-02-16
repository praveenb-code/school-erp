# EduMaster Pro - Deployment Guide

## Quick Start Guide

### Option 1: Local Development Setup (5 minutes)

1. **Prerequisites Check**
   ```bash
   # Check Node.js (should be v14+)
   node --version
   
   # Check MongoDB (should be v4.4+)
   mongod --version
   ```

2. **Install & Run**
   ```bash
   # Install dependencies
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Start MongoDB
   mongod
   
   # Start server
   npm start
   ```

3. **Access Application**
   - Open browser: `http://localhost:5000`
   - Or open `school-erp.html` directly

---

## Production Deployment

### Option 1: Deploy to Heroku (Easiest)

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Ubuntu
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create edumaster-school-erp
   ```

3. **Add MongoDB (MongoDB Atlas)**
   - Go to https://www.mongodb.com/atlas
   - Create free cluster
   - Get connection string
   - Add to Heroku config:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/school_erp"
   heroku config:set JWT_SECRET="your-super-secret-key"
   ```

4. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

5. **Open Application**
   ```bash
   heroku open
   ```

---

### Option 2: Deploy to AWS EC2

1. **Launch EC2 Instance**
   - AMI: Ubuntu Server 22.04 LTS
   - Instance Type: t2.medium (recommended)
   - Security Group: Open ports 22, 80, 443, 5000

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt update
   sudo apt install -y mongodb-org
   
   # Start MongoDB
   sudo systemctl start mongod
   sudo systemctl enable mongod
   
   # Install PM2 (Process Manager)
   sudo npm install -g pm2
   ```

4. **Deploy Application**
   ```bash
   # Clone/upload your code
   cd /var/www
   sudo mkdir edumaster
   cd edumaster
   
   # Upload your files or clone from git
   # git clone <your-repo-url> .
   
   # Install dependencies
   npm install
   
   # Create .env file
   nano .env
   # Add your environment variables
   
   # Start with PM2
   pm2 start server.js --name "edumaster-erp"
   pm2 save
   pm2 startup
   ```

5. **Setup Nginx (Reverse Proxy)**
   ```bash
   sudo apt install -y nginx
   
   sudo nano /etc/nginx/sites-available/edumaster
   ```
   
   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/edumaster /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL (Let's Encrypt)**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

### Option 3: Deploy to DigitalOcean

1. **Create Droplet**
   - Choose Ubuntu 22.04
   - Size: Basic ($12/month recommended)
   - Add SSH key

2. **Follow AWS EC2 steps 2-6**

3. **DigitalOcean App Platform (Alternative)**
   ```bash
   # Install doctl
   cd ~
   wget https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-amd64.tar.gz
   tar xf ~/doctl-1.94.0-linux-amd64.tar.gz
   sudo mv ~/doctl /usr/local/bin
   
   # Authenticate
   doctl auth init
   
   # Deploy app
   doctl apps create --spec app.yaml
   ```

---

### Option 4: Deploy to Google Cloud Platform

1. **Install Google Cloud SDK**
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. **Create App Engine app.yaml**
   ```yaml
   runtime: nodejs18
   
   env_variables:
     MONGODB_URI: "your-mongodb-uri"
     JWT_SECRET: "your-secret"
   
   handlers:
   - url: /.*
     script: auto
   ```

3. **Deploy**
   ```bash
   gcloud app deploy
   gcloud app browse
   ```

---

### Option 5: Deploy to Vercel (Frontend Only)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **For Backend, use separate service** (Heroku/Railway/Render)

---

## Database Options

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create Account**
   - Go to https://www.mongodb.com/atlas
   - Sign up for free

2. **Create Cluster**
   - Choose Free Tier (M0)
   - Select region closest to your users
   - Name your cluster

3. **Setup Database Access**
   - Create database user
   - Set username and password
   - Save credentials

4. **Setup Network Access**
   - Add IP: 0.0.0.0/0 (allow from anywhere)
   - Or add specific IPs for security

5. **Get Connection String**
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/school_erp?retryWrites=true&w=majority
   ```

6. **Update Environment Variables**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school_erp
   ```

### Option 2: Self-hosted MongoDB

1. **Install on Ubuntu**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt update
   sudo apt install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

2. **Secure MongoDB**
   ```bash
   mongo
   ```
   ```javascript
   use admin
   db.createUser({
     user: "admin",
     pwd: "securePassword123",
     roles: [ { role: "root", db: "admin" } ]
   })
   ```
   
   Edit config:
   ```bash
   sudo nano /etc/mongod.conf
   ```
   ```yaml
   security:
     authorization: enabled
   ```
   
   ```bash
   sudo systemctl restart mongod
   ```

---

## Performance Optimization

### 1. Enable Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Setup Redis Caching
```bash
# Install Redis
sudo apt install redis-server

# Install node-redis
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache example
app.get('/api/students', async (req, res) => {
    const cached = await client.get('students');
    if (cached) return res.json(JSON.parse(cached));
    
    const students = await Student.find();
    await client.setEx('students', 3600, JSON.stringify(students));
    res.json(students);
});
```

### 3. Database Indexing
```javascript
// Add indexes in schemas
studentSchema.index({ studentId: 1 });
studentSchema.index({ firstName: 'text', lastName: 'text' });
```

### 4. Load Balancing (Nginx)
```nginx
upstream app_servers {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}

server {
    listen 80;
    location / {
        proxy_pass http://app_servers;
    }
}
```

---

## Security Checklist

### Production Security

- [ ] Change JWT_SECRET to strong random string
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall (ufw)
      ```bash
      sudo ufw allow 22
      sudo ufw allow 80
      sudo ufw allow 443
      sudo ufw enable
      ```
- [ ] Implement rate limiting
- [ ] Use helmet.js for security headers
- [ ] Enable CORS properly
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Regular backups
- [ ] Monitor logs
- [ ] Keep dependencies updated
- [ ] Implement 2FA for admin
- [ ] Setup MongoDB authentication
- [ ] Use secure session management

---

## Monitoring & Logging

### 1. PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

### 2. Setup Winston Logger
```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
```

### 3. Setup Error Tracking (Sentry)
```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'your-sentry-dsn' });

app.use(Sentry.Handlers.errorHandler());
```

---

## Backup Strategy

### 1. Automated MongoDB Backups
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/school_erp" --out="/backups/$DATE"
find /backups -type d -mtime +7 -exec rm -rf {} \;
```

```bash
# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /path/to/backup.sh
```

### 2. AWS S3 Backup
```bash
npm install aws-sdk
```

```javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Upload backup
const uploadBackup = async (filePath) => {
    const fileContent = fs.readFileSync(filePath);
    await s3.putObject({
        Bucket: 'school-erp-backups',
        Key: `backup-${Date.now()}.tar.gz`,
        Body: fileContent
    }).promise();
};
```

---

## Scaling Strategies

### Horizontal Scaling
1. Use load balancer (Nginx/HAProxy)
2. Deploy multiple server instances
3. Use MongoDB replica sets
4. Implement Redis for sessions

### Vertical Scaling
1. Upgrade server resources (CPU/RAM)
2. Optimize database queries
3. Implement caching
4. Use CDN for static assets

---

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

**Port Already in Use**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

**Permission Errors**
```bash
# Fix file permissions
sudo chown -R $USER:$USER /var/www/edumaster
chmod -R 755 /var/www/edumaster
```

**Out of Memory**
```bash
# Check memory
free -h

# Increase swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Testing Before Production

### 1. Load Testing
```bash
npm install -g artillery

# Create test.yml
artillery quick --count 100 --num 10 http://localhost:5000/api/students

# Or detailed test
artillery run test.yml
```

### 2. Security Testing
```bash
npm install -g snyk
snyk test
```

### 3. Performance Testing
```bash
npm install -g clinic
clinic doctor -- node server.js
```

---

## Maintenance

### Regular Tasks
- Weekly: Review logs
- Weekly: Database backup verification
- Monthly: Update dependencies
- Monthly: Security audit
- Quarterly: Performance optimization
- Yearly: System upgrade

### Health Checks
```bash
# Create health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date(),
        uptime: process.uptime(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});
```

---

## Support & Resources

- **Documentation:** README.md
- **API Docs:** API_DOCUMENTATION.md
- **Issues:** support@edumaster.com
- **Community:** forum.edumaster.com

---

## Quick Reference

### Useful Commands
```bash
# Start server
npm start

# Development mode
npm run dev

# Check logs
pm2 logs

# Restart server
pm2 restart edumaster-erp

# Database backup
mongodump --uri="mongodb://localhost:27017/school_erp"

# Restore database
mongorestore --uri="mongodb://localhost:27017/school_erp" dump/

# Check server status
curl http://localhost:5000/health
```

---

**Need Help?** Contact: deploy-support@edumaster.com
