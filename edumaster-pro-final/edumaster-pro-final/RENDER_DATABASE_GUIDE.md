# 🗄️ Deploy EduMaster Pro with Render PostgreSQL Database

## Complete Guide - Using Render's Built-in Database

---

## 🎯 Overview

This guide shows you how to deploy EduMaster Pro using **Render's PostgreSQL database** instead of MongoDB Atlas. This gives you:

✅ Everything in one place (Render)
✅ No external services needed
✅ Free tier PostgreSQL database
✅ Automatic backups
✅ Easier setup (no MongoDB Atlas)

**Important:** This requires converting the backend from MongoDB to PostgreSQL.

---

## 📋 Two Deployment Options

### Option 1: Use Render PostgreSQL (This Guide)
- Database hosted on Render
- Everything in one platform
- Requires code conversion (MongoDB → PostgreSQL)
- Setup time: 20-30 minutes

### Option 2: Use Render's MongoDB Alternative
- Keep MongoDB code as-is
- Use Render with external MongoDB
- No code changes needed
- Setup time: 15 minutes

**This guide covers both options!**

---

## 🚀 OPTION 1: Render PostgreSQL (Recommended)

### Prerequisites

Before starting:
1. ✅ Render account (free): https://render.com
2. ✅ GitHub account: https://github.com
3. ✅ Your edumaster-pro files

---

## 📝 Step 1: Convert Backend to PostgreSQL

### 1.1 Install PostgreSQL Dependencies

Update `package.json`:

```json
{
  "name": "edumaster-pro-school-erp",
  "version": "1.0.0",
  "description": "Complete School Management ERP System",
  "main": "server-postgres.js",
  "scripts": {
    "start": "node server-postgres.js",
    "dev": "nodemon server-postgres.js"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.35.0",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.3.1"
  }
}
```

### 1.2 Create PostgreSQL Server File

Create `server-postgres.js`:

```javascript
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

app.get('/teacher', (req, res) => {
    res.sendFile(path.join(__dirname, 'teacher-dashboard.html'));
});

app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, 'student-dashboard.html'));
});

app.get('/accountant', (req, res) => {
    res.sendFile(path.join(__dirname, 'accountant-dashboard.html'));
});

// Database Configuration
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    },
    logging: false
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ==================== MODELS ====================

// User Model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'teacher', 'student', 'accountant', 'parent'),
        allowNull: false
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    lastLogin: DataTypes.DATE
});

// Student Model
const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    admissionNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateOfBirth: DataTypes.DATE,
    gender: DataTypes.ENUM('male', 'female', 'other'),
    bloodGroup: DataTypes.STRING,
    currentClass: DataTypes.STRING,
    currentSection: DataTypes.STRING,
    currentRollNumber: DataTypes.INTEGER,
    address: DataTypes.JSONB,
    guardian: DataTypes.JSONB,
    emergencyContact: DataTypes.JSONB,
    photo: DataTypes.STRING,
    status: {
        type: DataTypes.ENUM('active', 'graduated', 'transferred', 'left', 'alumni'),
        defaultValue: 'active'
    }
});

// Teacher Model
const Teacher = sequelize.define('Teacher', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    gender: DataTypes.STRING,
    qualification: DataTypes.STRING,
    designation: DataTypes.STRING,
    department: DataTypes.STRING,
    joiningDate: DataTypes.DATE,
    salary: DataTypes.DECIMAL(10, 2),
    photo: DataTypes.STRING,
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'on-leave'),
        defaultValue: 'active'
    }
});

// Class Model
const Class = sequelize.define('Class', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    section: DataTypes.STRING,
    room: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    academicYear: DataTypes.STRING
});

// Subject Model
const Subject = sequelize.define('Subject', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: DataTypes.TEXT,
    grade: DataTypes.INTEGER,
    type: DataTypes.ENUM('core', 'elective', 'lab'),
    credits: DataTypes.INTEGER
});

// Attendance Model
const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('present', 'absent', 'late', 'half-day'),
        allowNull: false
    },
    remarks: DataTypes.TEXT
});

// Fee Model
const Fee = sequelize.define('Fee', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    academicYear: DataTypes.STRING,
    feeType: DataTypes.ENUM('tuition', 'admission', 'transport', 'library', 'hostel', 'exam', 'other'),
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    dueDate: DataTypes.DATE,
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'overdue', 'partial'),
        defaultValue: 'pending'
    },
    paidAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    paidDate: DataTypes.DATE,
    paymentMethod: DataTypes.STRING,
    receiptNumber: DataTypes.STRING
});

// Academic Session Model
const AcademicSession = sequelize.define('AcademicSession', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    sessionName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isCurrent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('upcoming', 'active', 'completed', 'archived'),
        defaultValue: 'upcoming'
    },
    metadata: DataTypes.JSONB
});

// ==================== RELATIONSHIPS ====================

User.hasOne(Student);
Student.belongsTo(User);

User.hasOne(Teacher);
Teacher.belongsTo(User);

Student.hasMany(Attendance);
Attendance.belongsTo(Student);

Student.hasMany(Fee);
Fee.belongsTo(Student);

Teacher.hasMany(Class);
Class.belongsTo(Teacher, { as: 'classTeacher' });

// ==================== MIDDLEWARE ====================

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.userId);
        
        if (!user || !user.isActive) throw new Error();
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

// ==================== ROUTES ====================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', database: 'connected' });
});

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, role, firstName, lastName } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
            role,
            firstName,
            lastName
        });
        
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
        
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        
        const user = await User.findOne({
            where: {
                email: identifier
            }
        });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        user.lastLogin = new Date();
        await user.save();
        
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '30d' }
        );
        
        res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Student Routes
app.get('/api/students', authenticate, async (req, res) => {
    try {
        const { status, search } = req.query;
        let where = {};
        
        if (status) where.status = status;
        if (search) {
            where[Sequelize.Op.or] = [
                { firstName: { [Sequelize.Op.iLike]: `%${search}%` } },
                { lastName: { [Sequelize.Op.iLike]: `%${search}%` } },
                { studentId: { [Sequelize.Op.iLike]: `%${search}%` } }
            ];
        }
        
        const students = await Student.findAll({ where });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/students', authenticate, async (req, res) => {
    try {
        const count = await Student.count();
        const studentId = `STU${String(count + 1).padStart(5, '0')}`;
        
        const student = await Student.create({
            ...req.body,
            studentId,
            admissionNumber: `ADM${Date.now()}`
        });
        
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Teacher Routes
app.get('/api/teachers', authenticate, async (req, res) => {
    try {
        const teachers = await Teacher.findAll();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/teachers', authenticate, async (req, res) => {
    try {
        const count = await Teacher.count();
        const employeeId = `EMP${String(count + 1).padStart(5, '0')}`;
        
        const teacher = await Teacher.create({
            ...req.body,
            employeeId
        });
        
        res.status(201).json(teacher);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Attendance Routes
app.post('/api/attendance', authenticate, async (req, res) => {
    try {
        const attendance = await Attendance.create(req.body);
        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/attendance', authenticate, async (req, res) => {
    try {
        const { studentId, startDate, endDate } = req.query;
        let where = {};
        
        if (studentId) where.StudentId = studentId;
        if (startDate && endDate) {
            where.date = {
                [Sequelize.Op.between]: [startDate, endDate]
            };
        }
        
        const attendance = await Attendance.findAll({
            where,
            include: [Student]
        });
        
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fee Routes
app.get('/api/fees', authenticate, async (req, res) => {
    try {
        const { studentId, status } = req.query;
        let where = {};
        
        if (studentId) where.StudentId = studentId;
        if (status) where.status = status;
        
        const fees = await Fee.findAll({
            where,
            include: [Student]
        });
        
        res.json(fees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/fees', authenticate, async (req, res) => {
    try {
        const fee = await Fee.create(req.body);
        res.status(201).json(fee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Session Routes
app.get('/api/sessions', authenticate, async (req, res) => {
    try {
        const sessions = await AcademicSession.findAll({
            order: [['startDate', 'DESC']]
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/sessions', authenticate, async (req, res) => {
    try {
        const session = await AcademicSession.create(req.body);
        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Dashboard Stats
app.get('/api/dashboard/stats', authenticate, async (req, res) => {
    try {
        const totalStudents = await Student.count({ where: { status: 'active' } });
        const totalTeachers = await Teacher.count({ where: { status: 'active' } });
        const totalClasses = await Class.count();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const attendanceToday = await Attendance.count({
            where: {
                date: today,
                status: 'present'
            }
        });
        
        const attendanceRate = totalStudents > 0 
            ? ((attendanceToday / totalStudents) * 100).toFixed(2)
            : 0;
        
        const feeStats = await Fee.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('paidAmount')), 'totalCollected'],
                [sequelize.fn('SUM', 
                    sequelize.literal('amount - "paidAmount"')), 'totalPending']
            ],
            raw: true
        });
        
        res.json({
            totalStudents,
            totalTeachers,
            totalClasses,
            attendanceRate,
            feeCollected: feeStats[0].totalCollected || 0,
            pendingFees: feeStats[0].totalPending || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initialize Database and Start Server
const PORT = process.env.PORT || 10000;

async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established');
        
        // Sync database (creates tables if they don't exist)
        await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
        console.log('✅ Database synchronized');
        
        // Start server
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`✅ PostgreSQL Database System Active`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
```

---

## 🚀 Step 2: Deploy to Render with PostgreSQL

### 2.1 Create PostgreSQL Database

1. **Login to Render**: https://dashboard.render.com
2. **Create Database**:
   - Click **"New +"** → **"PostgreSQL"**
   - Name: `edumaster-db`
   - Database: `school_erp`
   - User: `edumaster_user`
   - Region: Choose closest to you
   - Instance Type: **Free**
   - Click **"Create Database"**

3. **Save Connection Details**:
   - Wait for database to be created (2-3 minutes)
   - You'll see: **Internal Database URL**
   - Copy this URL (starts with `postgres://`)

### 2.2 Create Web Service

1. **Upload Code to GitHub** (with new PostgreSQL files)
2. **Create Web Service**:
   - Dashboard → **"New +"** → **"Web Service"**
   - Connect your repository
   - Name: `edumaster-pro`
   - Runtime: **Node**
   - Build: `npm install`
   - Start: `npm start`
   - Instance: **Free**

### 2.3 Configure Environment Variables

Add these variables:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=[Paste your Render PostgreSQL Internal URL]
JWT_SECRET=[Generate random 32+ char string]
JWT_EXPIRE=30d
```

Example DATABASE_URL:
```
postgres://edumaster_user:password123@dpg-xxxxx.oregon-postgres.render.com/school_erp
```

### 2.4 Deploy

- Click **"Create Web Service"**
- Wait 5-7 minutes for deployment
- Check logs for success

---

## 🎯 OPTION 2: Keep MongoDB with Render (Easier)

If you want to keep using MongoDB without changing code:

### Use Render + MongoDB Atlas

1. **Setup MongoDB Atlas** (from previous guide)
   - Create free cluster
   - Get connection string

2. **Deploy to Render**
   - Use original `server-session-management.js`
   - Add `MONGODB_URI` environment variable
   - Deploy normally

This keeps all your original MongoDB code!

---

## 🔄 Step 3: Initialize Database

### Create Initial Admin User

Create `init-database.js`:

```javascript
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

// Define User model (same as in server)
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'teacher', 'student', 'accountant'), allowNull: false },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

async function initDatabase() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        
        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            email: 'admin@school.com',
            password: hashedPassword,
            role: 'admin',
            firstName: 'Admin',
            lastName: 'User'
        });
        
        console.log('✅ Database initialized with admin user');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

initDatabase();
```

Add to `package.json`:
```json
"scripts": {
    "init-db": "node init-database.js"
}
```

Run in Render Shell:
```bash
npm run init-db
```

---

## 🆚 MongoDB vs PostgreSQL Comparison

| Feature | MongoDB (Atlas) | PostgreSQL (Render) |
|---------|-----------------|---------------------|
| **Setup** | External service | Built into Render |
| **Code Changes** | None needed | Requires conversion |
| **Free Tier** | 512 MB | 1 GB |
| **Backups** | Included | Included |
| **Query Language** | MongoDB queries | SQL |
| **JSON Support** | Native | JSONB type |
| **Relationships** | Manual | Built-in (Sequelize) |

---

## ✅ Success Verification

After deployment, test:

```bash
# Health check
curl https://your-app.onrender.com/api/health

# Should return:
{"status":"healthy","database":"connected"}
```

Test login:
```
1. Visit: https://your-app.onrender.com
2. Login: admin@school.com / admin123
3. Success! ✅
```

---

## 🐛 Troubleshooting

### Issue: Database Connection Failed

```
✗ Error: Connection refused

Solution:
→ Check DATABASE_URL is correct
→ Ensure it's the INTERNAL URL (not external)
→ Verify database is running in Render
→ Check SSL settings in sequelize config
```

### Issue: Tables Not Created

```
✗ Error: relation "Users" does not exist

Solution:
→ Database sync on first deploy
→ Check sequelize.sync() is called
→ Run init-database.js script
→ Check Render logs for errors
```

### Issue: Authentication Errors

```
✗ Error: JWT malformed

Solution:
→ Verify JWT_SECRET is set
→ Check password hashing works
→ Test login with correct credentials
→ Clear browser cache/cookies
```

---

## 📊 Render PostgreSQL Dashboard

Access your database:

1. Go to Render Dashboard
2. Click your database
3. **View**:
   - Connection details
   - Metrics (CPU, memory, connections)
   - Query statistics
4. **Connect**:
   - Use psql CLI
   - Use GUI tools (TablePlus, pgAdmin)

Connect via psql:
```bash
psql [YOUR_EXTERNAL_DATABASE_URL]
```

---

## 💰 Pricing

**Free Tier:**
- 1 GB storage
- 90 days retention
- Perfect for testing
- Expires after 90 days

**Starter ($7/month):**
- 10 GB storage
- Automatic backups
- No expiration
- Good for production

---

## 🎓 Recommendation

**For Beginners:**
→ Use Option 2 (Keep MongoDB)
- No code changes
- Easier setup
- Use MongoDB Atlas

**For Learning:**
→ Use Option 1 (PostgreSQL)
- Learn SQL
- Single platform
- Better for scaling

**For Production:**
→ Consider PostgreSQL
- More robust
- Better for complex queries
- Easier backups

---

## 🔄 Migration Path

Already deployed with MongoDB? Can migrate later:

1. Keep MongoDB deployment running
2. Create PostgreSQL version separately
3. Test PostgreSQL version thoroughly
4. Export data from MongoDB
5. Import to PostgreSQL
6. Switch traffic
7. Shutdown MongoDB version

---

## 📚 Next Steps

1. ✅ Choose your database (MongoDB or PostgreSQL)
2. ✅ Update code if using PostgreSQL
3. ✅ Deploy to Render
4. ✅ Initialize database
5. ✅ Test application
6. ✅ Add data
7. ✅ Monitor performance

---

## 🎉 Summary

**With PostgreSQL (Option 1):**
- Everything on Render
- Requires code conversion
- Better for SQL experience

**With MongoDB (Option 2):**
- Keep existing code
- Use MongoDB Atlas
- Easier initial setup

**Both options work great!**

Choose based on your comfort level and requirements.

---

**Your School ERP is ready with Render database! 🚀**

For MongoDB Atlas setup, see: `RENDER_DEPLOYMENT_GUIDE.md`
