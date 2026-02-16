// EduMaster Pro - PostgreSQL Version for Render
// Complete School ERP System with Render PostgreSQL Database

const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Serve HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin-dashboard.html')));
app.get('/teacher', (req, res) => res.sendFile(path.join(__dirname, 'teacher-dashboard.html')));
app.get('/student', (req, res) => res.sendFile(path.join(__dirname, 'student-dashboard.html')));
app.get('/accountant', (req, res) => res.sendFile(path.join(__dirname, 'accountant-dashboard.html')));
app.get('/role-management', (req, res) => res.sendFile(path.join(__dirname, 'role-management.html')));
app.get('/session-management', (req, res) => res.sendFile(path.join(__dirname, 'session-management.html')));

// Database Configuration
const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
});

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-key-in-production';

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
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'teacher', 'student', 'accountant', 'librarian', 'parent'),
        allowNull: false,
        defaultValue: 'student'
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    avatar: DataTypes.TEXT,
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    lastLogin: DataTypes.DATE,
    employeeId: DataTypes.STRING,
    studentId: DataTypes.STRING
}, {
    indexes: [
        { fields: ['email'] },
        { fields: ['role'] },
        { fields: ['employeeId'] },
        { fields: ['studentId'] }
    ]
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
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.JSONB,
    guardian: DataTypes.JSONB,
    emergencyContact: DataTypes.JSONB,
    medicalInfo: DataTypes.JSONB,
    photo: DataTypes.TEXT,
    status: {
        type: DataTypes.ENUM('active', 'graduated', 'transferred', 'left', 'alumni'),
        defaultValue: 'active'
    },
    tcIssued: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    tcNumber: DataTypes.STRING,
    tcIssuedDate: DataTypes.DATE
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
    address: DataTypes.JSONB,
    photo: DataTypes.TEXT,
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
    academicYear: DataTypes.STRING,
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
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
    receiptNumber: DataTypes.STRING,
    remarks: DataTypes.TEXT
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
    admissionStartDate: DataTypes.DATE,
    admissionEndDate: DataTypes.DATE,
    metadata: DataTypes.JSONB
});

// Exam Model
const Exam = sequelize.define('Exam', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: DataTypes.ENUM('midterm', 'final', 'quiz', 'assignment', 'project'),
    date: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    totalMarks: DataTypes.INTEGER,
    passingMarks: DataTypes.INTEGER,
    syllabus: DataTypes.TEXT
});

// Result Model
const Result = sequelize.define('Result', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    marksObtained: DataTypes.DECIMAL(5, 2),
    grade: DataTypes.STRING,
    remarks: DataTypes.TEXT,
    publishedAt: DataTypes.DATE
});

// Transfer Request Model
const TransferRequest = sequelize.define('TransferRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    requestType: {
        type: DataTypes.ENUM('transfer_out', 'transfer_in'),
        allowNull: false
    },
    transferTo: DataTypes.JSONB,
    transferFrom: DataTypes.JSONB,
    tcDetails: DataTypes.JSONB,
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
        defaultValue: 'pending'
    },
    reason: DataTypes.TEXT,
    approvedAt: DataTypes.DATE
});

// ==================== RELATIONSHIPS ====================

// User relationships
User.hasOne(Student, { foreignKey: 'userId' });
Student.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Teacher, { foreignKey: 'userId' });
Teacher.belongsTo(User, { foreignKey: 'userId' });

// Student relationships
Student.hasMany(Attendance, { foreignKey: 'studentId' });
Attendance.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Fee, { foreignKey: 'studentId' });
Fee.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Result, { foreignKey: 'studentId' });
Result.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(TransferRequest, { foreignKey: 'studentId' });
TransferRequest.belongsTo(Student, { foreignKey: 'studentId' });

// Teacher relationships
Teacher.hasMany(Class, { foreignKey: 'classTeacherId', as: 'classes' });
Class.belongsTo(Teacher, { foreignKey: 'classTeacherId', as: 'classTeacher' });

// Class relationships
Class.belongsTo(AcademicSession, { foreignKey: 'sessionId' });
AcademicSession.hasMany(Class, { foreignKey: 'sessionId' });

// Exam relationships
Exam.belongsTo(Subject, { foreignKey: 'subjectId' });
Subject.hasMany(Exam, { foreignKey: 'subjectId' });

Exam.belongsTo(Class, { foreignKey: 'classId' });
Class.hasMany(Exam, { foreignKey: 'classId' });

Result.belongsTo(Exam, { foreignKey: 'examId' });
Exam.hasMany(Result, { foreignKey: 'examId' });

// ==================== MIDDLEWARE ====================

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error('No token provided');
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.userId);
        
        if (!user || !user.isActive) throw new Error('User not found or inactive');
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate', message: error.message });
    }
};

const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};

// ==================== ROUTES ====================

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ 
            status: 'healthy', 
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'unhealthy', 
            database: 'disconnected',
            error: error.message
        });
    }
});

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, role, firstName, lastName } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
            role: role || 'student',
            firstName,
            lastName
        });
        
        const token = jwt.sign(
            { userId: user.id, role: user.role }, 
            JWT_SECRET,
            { expiresIn: '30d' }
        );
        
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
        const { identifier, password, email } = req.body;
        const loginId = identifier || email;
        
        if (!loginId) {
            return res.status(400).json({ error: 'Email or identifier required' });
        }
        
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: loginId },
                    { employeeId: loginId },
                    { studentId: loginId }
                ]
            }
        });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        if (!user.isActive) {
            return res.status(401).json({ error: 'Account is inactive' });
        }
        
        // Update last login
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
            token,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/auth/me', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== STUDENT ROUTES ====================

app.get('/api/students', authenticate, async (req, res) => {
    try {
        const { status, search, class: className } = req.query;
        let where = {};
        
        if (status) where.status = status;
        if (className) where.currentClass = className;
        if (search) {
            where[Op.or] = [
                { firstName: { [Op.iLike]: `%${search}%` } },
                { lastName: { [Op.iLike]: `%${search}%` } },
                { studentId: { [Op.iLike]: `%${search}%` } }
            ];
        }
        
        const students = await Student.findAll({ 
            where,
            order: [['createdAt', 'DESC']],
            limit: 100
        });
        
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/students/:id', authenticate, async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id, {
            include: [
                { model: User, attributes: { exclude: ['password'] } },
                { model: Attendance },
                { model: Fee },
                { model: Result }
            ]
        });
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/students', authenticate, checkRole('admin', 'teacher'), async (req, res) => {
    try {
        const count = await Student.count();
        const studentId = `STU${String(count + 1).padStart(5, '0')}`;
        const admissionNumber = `ADM${Date.now()}`;
        
        const student = await Student.create({
            ...req.body,
            studentId,
            admissionNumber
        });
        
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/students/:id', authenticate, checkRole('admin', 'teacher'), async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        await student.update(req.body);
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/students/:id', authenticate, checkRole('admin'), async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        await student.destroy();
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== TEACHER ROUTES ====================

app.get('/api/teachers', authenticate, async (req, res) => {
    try {
        const teachers = await Teacher.findAll({
            include: [{ model: User, attributes: { exclude: ['password'] } }],
            order: [['createdAt', 'DESC']]
        });
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/teachers', authenticate, checkRole('admin'), async (req, res) => {
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

// ==================== ATTENDANCE ROUTES ====================

app.post('/api/attendance', authenticate, checkRole('admin', 'teacher'), async (req, res) => {
    try {
        const attendance = await Attendance.create(req.body);
        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/attendance', authenticate, async (req, res) => {
    try {
        const { studentId, startDate, endDate, classId } = req.query;
        let where = {};
        
        if (studentId) where.studentId = studentId;
        if (startDate && endDate) {
            where.date = { [Op.between]: [startDate, endDate] };
        }
        
        const attendance = await Attendance.findAll({
            where,
            include: [Student],
            order: [['date', 'DESC']]
        });
        
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== FEE ROUTES ====================

app.get('/api/fees', authenticate, async (req, res) => {
    try {
        const { studentId, status, academicYear } = req.query;
        let where = {};
        
        if (studentId) where.studentId = studentId;
        if (status) where.status = status;
        if (academicYear) where.academicYear = academicYear;
        
        const fees = await Fee.findAll({
            where,
            include: [Student],
            order: [['createdAt', 'DESC']]
        });
        
        res.json(fees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/fees', authenticate, checkRole('admin', 'accountant'), async (req, res) => {
    try {
        const fee = await Fee.create(req.body);
        res.status(201).json(fee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/fees/:id/pay', authenticate, checkRole('admin', 'accountant'), async (req, res) => {
    try {
        const fee = await Fee.findByPk(req.params.id);
        if (!fee) {
            return res.status(404).json({ error: 'Fee record not found' });
        }
        
        const { amount, paymentMethod } = req.body;
        
        await fee.update({
            paidAmount: parseFloat(fee.paidAmount) + parseFloat(amount),
            paidDate: new Date(),
            paymentMethod,
            status: (parseFloat(fee.paidAmount) + parseFloat(amount)) >= parseFloat(fee.amount) ? 'paid' : 'partial',
            receiptNumber: `RCP${Date.now()}`
        });
        
        res.json(fee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== SESSION ROUTES ====================

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

app.get('/api/sessions/current', authenticate, async (req, res) => {
    try {
        const session = await AcademicSession.findOne({
            where: { isCurrent: true }
        });
        
        if (!session) {
            return res.status(404).json({ error: 'No current session found' });
        }
        
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/sessions', authenticate, checkRole('admin'), async (req, res) => {
    try {
        const session = await AcademicSession.create(req.body);
        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/sessions/:id/set-current', authenticate, checkRole('admin'), async (req, res) => {
    try {
        // Unset all current sessions
        await AcademicSession.update(
            { isCurrent: false },
            { where: {} }
        );
        
        // Set new current session
        const session = await AcademicSession.findByPk(req.params.id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        await session.update({
            isCurrent: true,
            isActive: true,
            status: 'active'
        });
        
        res.json(session);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== DASHBOARD STATS ====================

app.get('/api/dashboard/stats', authenticate, async (req, res) => {
    try {
        const totalStudents = await Student.count({ where: { status: 'active' } });
        const totalTeachers = await Teacher.count({ where: { status: 'active' } });
        const totalClasses = await Class.count({ where: { isActive: true } });
        
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
                [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('paidAmount')), 0), 'totalCollected'],
                [sequelize.fn('COALESCE', sequelize.fn('SUM', 
                    sequelize.literal('"amount" - "paidAmount"')), 0), 'totalPending']
            ],
            raw: true
        });
        
        res.json({
            totalStudents,
            totalTeachers,
            totalClasses,
            attendanceRate: parseFloat(attendanceRate),
            feeCollected: parseFloat(feeStats[0]?.totalCollected || 0),
            pendingFees: parseFloat(feeStats[0]?.totalPending || 0)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== INITIALIZE DATABASE ====================

async function initializeDatabase() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connection established');
        
        console.log('🔄 Synchronizing database models...');
        await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
        console.log('✅ Database synchronized');
        
        // Create default admin user if not exists
        const adminExists = await User.findOne({ where: { email: 'admin@school.com' } });
        
        if (!adminExists) {
            console.log('🔄 Creating default admin user...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                email: 'admin@school.com',
                password: hashedPassword,
                role: 'admin',
                firstName: 'Admin',
                lastName: 'User',
                isActive: true
            });
            console.log('✅ Default admin user created (admin@school.com / admin123)');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
}

// ==================== START SERVER ====================

const PORT = process.env.PORT || 10000;

async function startServer() {
    try {
        await initializeDatabase();
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log('═══════════════════════════════════════');
            console.log('   🎓 EDUMASTER PRO - SCHOOL ERP');
            console.log('═══════════════════════════════════════');
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`✅ Database: PostgreSQL (Render)`);
            console.log(`✅ URL: http://localhost:${PORT}`);
            console.log('═══════════════════════════════════════');
            console.log('📝 Default Login:');
            console.log('   Email: admin@school.com');
            console.log('   Password: admin123');
            console.log('═══════════════════════════════════════');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
