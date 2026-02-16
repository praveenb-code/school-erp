# 🚀 EduMaster Pro - Complete Setup Guide

## 📦 What's Included

This package contains a complete, production-ready School Management ERP System with:

### Frontend Files:
- `login.html` - Multi-role login page
- `admin-dashboard.html` - Complete admin interface
- `teacher-dashboard.html` - Teacher portal
- `student-dashboard.html` - Student portal
- `accountant-dashboard.html` - Accountant portal
- `role-management.html` - Role & permission management
- `session-management.html` - Academic session & promotion management

### Backend Files:
- `server.js` - Basic server with authentication
- `server-updated.js` - Enhanced server with role-based auth
- `server-dynamic-roles.js` - Complete dynamic roles system
- `server-session-management.js` - Session & promotion system

### Documentation:
- `README.md` - Project overview
- `SETUP_GUIDE.md` - This file
- `LOGIN_GUIDE.md` - Authentication system guide
- `DYNAMIC_ROLES_GUIDE.md` - Role management guide
- `SESSION_MANAGEMENT_GUIDE.md` - Session management guide
- `API_DOCUMENTATION.md` - Complete API reference
- `DEPLOYMENT_GUIDE.md` - Production deployment guide

### Configuration:
- `package.json` - Dependencies
- `.env.example` - Environment variables template

---

## 🎯 Quick Start (5 Minutes)

### Option 1: Frontend Only (No Backend Required)

**Perfect for: Testing the UI, Demonstrations, Frontend Development**

1. **Extract the ZIP file**
   ```bash
   unzip edumaster-pro.zip
   cd edumaster-pro
   ```

2. **Open in Browser**
   ```bash
   # Just double-click any HTML file!
   # Start with: login.html
   ```

3. **Demo Credentials**
   ```
   Admin: admin@school.com / admin123
   Teacher: teacher@school.com / teacher123
   Student: STU00001 / student123
   Accountant: accounts@school.com / accounts123
   ```

**That's it! The frontend works completely standalone with demo data.**

---

## 💻 Full Setup (With Backend)

### Prerequisites

Before starting, install:

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (v4.4 or higher)
   - Download: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
   - Verify: `mongod --version`

3. **Git** (optional)
   - Download: https://git-scm.com/

---

## 📝 Step-by-Step Installation

### Step 1: Extract Files

```bash
# Extract the ZIP
unzip edumaster-pro.zip
cd edumaster-pro

# Verify files
ls -la
```

You should see all HTML files, JS files, and documentation.

---

### Step 2: Install Dependencies

```bash
# Install Node.js packages
npm install
```

This will install:
- express (Web framework)
- mongoose (MongoDB driver)
- bcryptjs (Password hashing)
- jsonwebtoken (Authentication)
- cors (Cross-origin support)
- multer (File uploads)
- dotenv (Environment variables)

**Installation Time:** ~2 minutes

---

### Step 3: Setup MongoDB

#### Option A: Local MongoDB

```bash
# Start MongoDB service
# On Windows:
net start MongoDB

# On Mac:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Update in `.env` file

---

### Step 4: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file
nano .env  # or use any text editor
```

**Update these values:**

```env
PORT=5000
NODE_ENV=development

# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/school_erp

# OR MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school_erp

# Change this to a secure random string
JWT_SECRET=your-super-secret-random-key-change-this

JWT_EXPIRE=30d
```

**Important:** Change `JWT_SECRET` to a random string in production!

---

### Step 5: Choose Your Server

You have 3 server options depending on features needed:

#### Option A: Basic Server (`server.js`)
- Basic authentication
- Student/teacher management
- Attendance, fees, exams
- **Start with:** `node server.js`

#### Option B: Role-Based Server (`server-dynamic-roles.js`)
- Everything in basic +
- Dynamic role creation
- Granular permissions
- Unlimited custom roles
- **Start with:** `node server-dynamic-roles.js`

#### Option C: Complete System (`server-session-management.js`)
- Everything in role-based +
- Academic session management
- Student promotion system
- Transfer management
- Academic history
- **Start with:** `node server-session-management.js`

**Recommendation:** Start with Option C for complete functionality.

---

### Step 6: Start the Server

```bash
# Start the backend server
node server-session-management.js

# You should see:
# Server running on port 5000
# Academic Session & Promotion System Active
```

**Alternative: Use nodemon for auto-restart during development**
```bash
npm install -g nodemon
nodemon server-session-management.js
```

---

### Step 7: Open the Application

```bash
# Backend is running on:
http://localhost:5000

# Frontend files can be opened directly:
# Just double-click: login.html
```

**Or use Live Server:**
```bash
# If you have VS Code with Live Server extension
# Right-click login.html → "Open with Live Server"
```

---

## 🎨 Accessing Different Dashboards

### Login Page
```
File: login.html
URL: Open directly in browser
```

**Select Role → Enter Credentials → Login**

### After Login:

**Admin Dashboard:**
```
File: admin-dashboard.html
Access: Login as Admin
Features: Full system access
```

**Teacher Dashboard:**
```
File: teacher-dashboard.html
Access: Login as Teacher
Features: Academic management
```

**Student Dashboard:**
```
File: student-dashboard.html
Access: Login as Student
Features: Personal records
```

**Accountant Dashboard:**
```
File: accountant-dashboard.html
Access: Login as Accountant
Features: Financial management
```

**Role Management:**
```
File: role-management.html
Access: Admin only
Features: Create/manage roles
```

**Session Management:**
```
File: session-management.html
Access: Admin only
Features: Sessions, promotions, transfers
```

---

## 🔐 Default Login Credentials

### Admin
```
Email: admin@school.com
Password: admin123
```

### Teacher
```
Email: teacher@school.com
Password: teacher123
OR
Employee ID: EMP00001
Password: teacher123
```

### Student
```
Student ID: STU00001
Password: student123
```

### Accountant
```
Email: accounts@school.com
Password: accounts123
```

**⚠️ Important:** Change all passwords after first login!

---

## 📊 Testing the System

### 1. Test Login
- Open `login.html`
- Try each role
- Verify correct dashboard loads

### 2. Test Admin Features
- View students list
- Add new student
- Mark attendance
- Generate reports

### 3. Test Role Management
- Open `role-management.html`
- Create new role (e.g., "Librarian")
- Assign permissions
- Create user with new role

### 4. Test Session Management
- Open `session-management.html`
- Create new academic session
- Set as current session
- Try bulk student promotion

---

## 🗄️ Database Structure

After starting the server, MongoDB will automatically create:

### Collections Created:
- `users` - All system users
- `roles` - Role definitions
- `permissions` - Permission list
- `students` - Student records
- `teachers` - Teacher records
- `classes` - Class information
- `subjects` - Subject data
- `attendance` - Attendance records
- `exams` - Exam schedules
- `results` - Exam results
- `fees` - Fee management
- `academicsessions` - Academic years
- `studentacademichistories` - Student progression
- `promotionrequests` - Promotion records
- `transferrequests` - Transfer records

**Initial Data:** Empty database - you'll add data through the UI

---

## 🔧 Common Issues & Solutions

### Issue 1: Port 5000 Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Option A: Change port in .env
PORT=3000

# Option B: Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

---

### Issue 2: MongoDB Connection Error

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
# Windows:
sc query MongoDB

# Mac:
brew services list

# Linux:
sudo systemctl status mongod

# If not running, start it:
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

---

### Issue 3: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

### Issue 4: CORS Error in Browser

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
```javascript
// Already handled in server files
// If issue persists, ensure backend is running on port 5000
```

---

### Issue 5: Login Not Working

**Problem:** Can't login with demo credentials

**Solution:**
```bash
# Frontend-only mode (no backend):
# Credentials are hardcoded in JavaScript
# Just open login.html and use demo credentials

# With backend:
# Need to create users first via API
# Or use the registration endpoint
```

---

## 📚 Directory Structure

```
edumaster-pro/
├── frontend/
│   ├── login.html
│   ├── admin-dashboard.html
│   ├── teacher-dashboard.html
│   ├── student-dashboard.html
│   ├── accountant-dashboard.html
│   ├── role-management.html
│   └── session-management.html
│
├── backend/
│   ├── server.js
│   ├── server-updated.js
│   ├── server-dynamic-roles.js
│   └── server-session-management.js
│
├── docs/
│   ├── README.md
│   ├── SETUP_GUIDE.md
│   ├── LOGIN_GUIDE.md
│   ├── DYNAMIC_ROLES_GUIDE.md
│   ├── SESSION_MANAGEMENT_GUIDE.md
│   ├── API_DOCUMENTATION.md
│   └── DEPLOYMENT_GUIDE.md
│
├── config/
│   ├── .env.example
│   └── package.json
│
└── uploads/
    ├── students/
    ├── teachers/
    └── documents/
```

---

## 🚀 Development Workflow

### 1. Start Development

```bash
# Terminal 1: Start backend
nodemon server-session-management.js

# Terminal 2: Start frontend (if using Live Server)
# Or just open HTML files in browser
```

### 2. Make Changes

- Edit HTML files for UI changes
- Edit server files for backend logic
- Changes reflect immediately (with nodemon)

### 3. Test

- Test in browser
- Check browser console for errors
- Check terminal for backend errors

---

## 📦 Creating Custom Builds

### Frontend Only Distribution

```bash
# Copy only HTML files
mkdir frontend-only
cp *.html frontend-only/
cp -r docs/ frontend-only/

# Distribute frontend-only folder
zip -r frontend-only.zip frontend-only/
```

### Full Stack Distribution

```bash
# Create complete package
zip -r edumaster-pro-full.zip . -x "node_modules/*" ".git/*"
```

---

## 🔄 Updating the System

### Update Backend

```bash
# Pull latest changes (if using git)
git pull origin main

# Update dependencies
npm update

# Restart server
node server-session-management.js
```

### Update Frontend

- Replace HTML files with new versions
- Clear browser cache (Ctrl + F5)
- Refresh page

---

## 📊 Monitoring & Logs

### Backend Logs

```bash
# Server logs appear in terminal
# Save logs to file:
node server-session-management.js > logs.txt 2>&1

# View logs:
tail -f logs.txt
```

### Frontend Logs

```bash
# Open browser console
# Chrome/Firefox: F12 → Console tab
# Check for JavaScript errors
```

---

## 🔒 Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Change JWT_SECRET to random string
- [ ] Enable HTTPS
- [ ] Set up firewall
- [ ] Configure MongoDB authentication
- [ ] Limit API rate limiting
- [ ] Validate all inputs
- [ ] Keep dependencies updated
- [ ] Regular backups
- [ ] Monitor logs

---

## 💾 Backup & Restore

### Backup Database

```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/school_erp" --out=backup/

# With date
mongodump --uri="mongodb://localhost:27017/school_erp" --out="backup/$(date +%Y%m%d)"
```

### Restore Database

```bash
# Restore from backup
mongorestore --uri="mongodb://localhost:27017/school_erp" backup/school_erp/
```

---

## 📞 Getting Help

### Documentation
- Check README.md for overview
- Check specific guides for detailed help
- Check API_DOCUMENTATION.md for API details

### Common Resources
- Node.js Docs: https://nodejs.org/docs
- MongoDB Docs: https://docs.mongodb.com
- Express Docs: https://expressjs.com

### Troubleshooting
1. Check browser console for errors
2. Check server terminal for errors
3. Verify MongoDB is running
4. Check network requests in browser DevTools
5. Review relevant documentation

---

## 🎓 Learning Path

### Beginners
1. Start with frontend-only (no backend)
2. Explore all dashboards
3. Try different roles
4. Understand the UI

### Intermediate
1. Install backend
2. Connect to MongoDB
3. Create users via API
4. Test authentication

### Advanced
1. Customize roles and permissions
2. Add new features
3. Integrate third-party APIs
4. Deploy to production

---

## ✅ Success Checklist

After setup, verify:

- [ ] MongoDB is running
- [ ] Backend server starts without errors
- [ ] Login page opens in browser
- [ ] Can login with demo credentials
- [ ] Redirects to correct dashboard
- [ ] Data loads in dashboard
- [ ] Can create new student
- [ ] Session management works
- [ ] Role management accessible

---

## 🎉 You're All Set!

Your School ERP is now ready to use. Start by:

1. **Opening** `login.html`
2. **Logging in** as Admin
3. **Creating** new academic session
4. **Adding** students and teachers
5. **Exploring** all features

**Enjoy your complete School Management System! 🚀**

---

## 📧 Support

For issues or questions:
- Check documentation files
- Review setup guide
- Check browser console
- Verify backend logs

**Happy Learning! 🎓**
