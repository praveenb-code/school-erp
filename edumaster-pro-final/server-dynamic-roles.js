// Enhanced School ERP - Dynamic Role & Permission Management System
// Node.js + Express + MongoDB

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect('mongodb://localhost:27017/school_erp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const JWT_SECRET = 'your-secret-key-change-in-production';

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ==================== ENHANCED SCHEMAS ====================

// Permission Schema - Defines individual permissions
const permissionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: String,
    module: { 
        type: String, 
        required: true,
        enum: [
            'students', 'teachers', 'classes', 'subjects',
            'attendance', 'exams', 'results', 'fees',
            'library', 'transport', 'hostel', 'timetable',
            'notices', 'events', 'messages', 'expenses',
            'reports', 'settings', 'users', 'dashboard',
            'payroll', 'inventory', 'accounts'
        ]
    },
    action: {
        type: String,
        required: true,
        enum: ['create', 'read', 'update', 'delete', 'manage', 'view_own', 'view_all']
    },
    createdAt: { type: Date, default: Date.now }
});

// Role Schema - Defines custom roles with permissions
const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    description: String,
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    isSystem: { type: Boolean, default: false }, // System roles cannot be deleted
    isActive: { type: Boolean, default: true },
    icon: String, // Emoji or icon for the role
    color: String, // Color theme for the role
    priority: { type: Number, default: 0 }, // Higher priority = more access
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Enhanced User Schema with dynamic roles
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String,
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    
    // Role-specific IDs
    employeeId: String,
    studentId: String,
    customId: String,
    
    // Additional permissions (beyond role)
    additionalPermissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    
    // Metadata
    department: String,
    designation: String,
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Student Schema (existing)
const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    bloodGroup: String,
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    section: String,
    rollNumber: Number,
    admissionDate: Date,
    admissionNumber: String,
    previousSchool: String,
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    guardian: {
        name: String,
        relationship: String,
        phone: String,
        email: String,
        occupation: String
    },
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    },
    medicalInfo: {
        allergies: [String],
        conditions: [String],
        medications: [String]
    },
    documents: [{
        type: String,
        url: String,
        uploadedAt: Date
    }],
    photo: String,
    status: { type: String, enum: ['active', 'inactive', 'graduated', 'transferred'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Teacher Schema (existing)
const teacherSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: Date,
    gender: String,
    email: { type: String, required: true },
    phone: String,
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    qualification: String,
    experience: Number,
    designation: String,
    department: String,
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    joiningDate: Date,
    salary: Number,
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String
    },
    documents: [{
        type: String,
        url: String
    }],
    photo: String,
    status: { type: String, enum: ['active', 'inactive', 'on-leave'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

// Other schemas remain the same (Class, Subject, Attendance, Exam, Result, Fee, etc.)
const classSchema = new mongoose.Schema({
    name: { type: String, required: true },
    grade: { type: Number, required: true },
    section: String,
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    room: String,
    capacity: Number,
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    academicYear: String,
    createdAt: { type: Date, default: Date.now }
});

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: String,
    grade: Number,
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    type: { type: String, enum: ['core', 'elective', 'lab'] },
    credits: Number,
    createdAt: { type: Date, default: Date.now }
});

const attendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'half-day'], required: true },
    remarks: String,
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const examSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['midterm', 'final', 'quiz', 'assignment'] },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    date: Date,
    duration: Number,
    totalMarks: Number,
    passingMarks: Number,
    syllabus: String,
    createdAt: { type: Date, default: Date.now }
});

const resultSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    marksObtained: Number,
    grade: String,
    remarks: String,
    publishedAt: Date,
    createdAt: { type: Date, default: Date.now }
});

const feeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    academicYear: String,
    feeType: { type: String, enum: ['tuition', 'admission', 'transport', 'library', 'hostel', 'exam', 'other'] },
    amount: { type: Number, required: true },
    dueDate: Date,
    status: { type: String, enum: ['pending', 'paid', 'overdue', 'partial'], default: 'pending' },
    paidAmount: { type: Number, default: 0 },
    paidDate: Date,
    paymentMethod: String,
    receiptNumber: String,
    remarks: String,
    createdAt: { type: Date, default: Date.now }
});

// Models
const Permission = mongoose.model('Permission', permissionSchema);
const Role = mongoose.model('Role', roleSchema);
const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Class = mongoose.model('Class', classSchema);
const Subject = mongoose.model('Subject', subjectSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);
const Exam = mongoose.model('Exam', examSchema);
const Result = mongoose.model('Result', resultSchema);
const Fee = mongoose.model('Fee', feeSchema);

// ==================== MIDDLEWARE ====================

// Authentication Middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId)
            .populate('role')
            .populate('additionalPermissions');
        
        if (!user || !user.isActive) throw new Error();
        
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

// Permission Check Middleware
const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            
            // Get all user permissions (from role + additional)
            const rolePermissions = await Permission.find({
                _id: { $in: user.role.permissions }
            });
            
            const additionalPermissions = user.additionalPermissions || [];
            const allPermissions = [...rolePermissions, ...additionalPermissions];
            
            // Check if user has required permission
            const hasPermission = allPermissions.some(perm => 
                perm.code === requiredPermission || 
                perm.code === 'all' || 
                perm.code === 'super_admin'
            );
            
            if (!hasPermission) {
                return res.status(403).json({ 
                    error: 'Access denied. Insufficient permissions.',
                    required: requiredPermission 
                });
            }
            
            next();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
};

// ==================== PERMISSION ROUTES ====================

// Get all permissions
app.get('/api/permissions', authenticate, checkPermission('permissions.read'), async (req, res) => {
    try {
        const permissions = await Permission.find().sort('module action');
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get permissions by module
app.get('/api/permissions/module/:module', authenticate, async (req, res) => {
    try {
        const permissions = await Permission.find({ module: req.params.module });
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create permission
app.post('/api/permissions', authenticate, checkPermission('permissions.create'), async (req, res) => {
    try {
        const permission = new Permission(req.body);
        await permission.save();
        res.status(201).json(permission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Bulk create permissions (for initial setup)
app.post('/api/permissions/bulk', authenticate, checkPermission('permissions.create'), async (req, res) => {
    try {
        const permissions = await Permission.insertMany(req.body.permissions);
        res.status(201).json(permissions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update permission
app.put('/api/permissions/:id', authenticate, checkPermission('permissions.update'), async (req, res) => {
    try {
        const permission = await Permission.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(permission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete permission
app.delete('/api/permissions/:id', authenticate, checkPermission('permissions.delete'), async (req, res) => {
    try {
        await Permission.findByIdAndDelete(req.params.id);
        res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ROLE ROUTES ====================

// Get all roles
app.get('/api/roles', authenticate, async (req, res) => {
    try {
        const roles = await Role.find()
            .populate('permissions')
            .populate('createdBy', 'firstName lastName email')
            .sort('name');
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get active roles (for login page)
app.get('/api/roles/active', async (req, res) => {
    try {
        const roles = await Role.find({ isActive: true })
            .select('name displayName description icon color')
            .sort('priority name');
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get role by ID
app.get('/api/roles/:id', authenticate, async (req, res) => {
    try {
        const role = await Role.findById(req.params.id)
            .populate('permissions')
            .populate('createdBy');
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new role
app.post('/api/roles', authenticate, checkPermission('roles.create'), async (req, res) => {
    try {
        const role = new Role({
            ...req.body,
            createdBy: req.user._id
        });
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update role
app.put('/api/roles/:id', authenticate, checkPermission('roles.update'), async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        
        if (role.isSystem && !req.body.allowSystemUpdate) {
            return res.status(403).json({ 
                error: 'Cannot modify system role without explicit permission' 
            });
        }
        
        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('permissions');
        
        res.json(updatedRole);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete role
app.delete('/api/roles/:id', authenticate, checkPermission('roles.delete'), async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        
        if (role.isSystem) {
            return res.status(403).json({ error: 'Cannot delete system role' });
        }
        
        // Check if any users have this role
        const usersWithRole = await User.countDocuments({ role: req.params.id });
        if (usersWithRole > 0) {
            return res.status(400).json({ 
                error: `Cannot delete role. ${usersWithRole} user(s) still have this role.` 
            });
        }
        
        await Role.findByIdAndDelete(req.params.id);
        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Duplicate role (create a copy)
app.post('/api/roles/:id/duplicate', authenticate, checkPermission('roles.create'), async (req, res) => {
    try {
        const originalRole = await Role.findById(req.params.id);
        
        const newRole = new Role({
            name: `${originalRole.name}_copy`,
            displayName: `${originalRole.displayName} (Copy)`,
            description: originalRole.description,
            permissions: originalRole.permissions,
            icon: originalRole.icon,
            color: originalRole.color,
            priority: originalRole.priority,
            createdBy: req.user._id
        });
        
        await newRole.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== AUTHENTICATION ROUTES ====================

// Universal Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { identifier, password, roleId } = req.body;
        
        // Find user by email, employeeId, studentId, or customId
        let user = await User.findOne({
            $or: [
                { email: identifier },
                { employeeId: identifier },
                { studentId: identifier },
                { customId: identifier }
            ],
            isActive: true
        }).populate('role').populate('additionalPermissions');
        
        // If roleId provided, verify user has that role
        if (roleId && user) {
            if (user.role._id.toString() !== roleId) {
                return res.status(401).json({ error: 'Invalid credentials for selected role' });
            }
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Update last login
        user.lastLogin = Date.now();
        await user.save();
        
        const token = jwt.sign(
            { 
                userId: user._id, 
                roleId: user.role._id,
                roleName: user.role.name 
            }, 
            JWT_SECRET,
            { expiresIn: '30d' }
        );
        
        res.json({ 
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                permissions: user.role.permissions,
                additionalPermissions: user.additionalPermissions
            },
            token,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register new user with role
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, roleId, firstName, lastName, ...otherData } = req.body;
        
        // Verify role exists
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
            role: roleId,
            firstName,
            lastName,
            ...otherData
        });
        
        await user.save();
        
        const token = jwt.sign(
            { 
                userId: user._id, 
                roleId: role._id,
                roleName: role.name 
            }, 
            JWT_SECRET,
            { expiresIn: '30d' }
        );
        
        res.status(201).json({ user, token, role });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get current user with permissions
app.get('/api/auth/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('role')
            .populate('additionalPermissions')
            .select('-password');
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check user permission
app.post('/api/auth/check-permission', authenticate, async (req, res) => {
    try {
        const { permission } = req.body;
        
        const rolePermissions = await Permission.find({
            _id: { $in: req.user.role.permissions }
        });
        
        const additionalPermissions = req.user.additionalPermissions || [];
        const allPermissions = [...rolePermissions, ...additionalPermissions];
        
        const hasPermission = allPermissions.some(perm => 
            perm.code === permission || 
            perm.code === 'all' || 
            perm.code === 'super_admin'
        );
        
        res.json({ hasPermission, permission });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== USER MANAGEMENT ROUTES ====================

// Get all users
app.get('/api/users', authenticate, checkPermission('users.read'), async (req, res) => {
    try {
        const { role, status, search } = req.query;
        let query = {};
        
        if (role) query.role = role;
        if (status) query.isActive = status === 'active';
        if (search) {
            query.$or = [
                { firstName: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { employeeId: new RegExp(search, 'i') },
                { studentId: new RegExp(search, 'i') }
            ];
        }
        
        const users = await User.find(query)
            .populate('role')
            .populate('additionalPermissions')
            .select('-password')
            .sort('-createdAt');
        
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create user
app.post('/api/users', authenticate, checkPermission('users.create'), async (req, res) => {
    try {
        const { email, password, roleId, ...userData } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
            role: roleId,
            ...userData
        });
        
        await user.save();
        
        const populatedUser = await User.findById(user._id)
            .populate('role')
            .select('-password');
        
        res.status(201).json(populatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update user
app.put('/api/users/:id', authenticate, checkPermission('users.update'), async (req, res) => {
    try {
        const updates = { ...req.body, updatedAt: Date.now() };
        
        // If password is being updated, hash it
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        )
        .populate('role')
        .populate('additionalPermissions')
        .select('-password');
        
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete user
app.delete('/api/users/:id', authenticate, checkPermission('users.delete'), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Assign additional permissions to user
app.post('/api/users/:id/permissions', authenticate, checkPermission('users.update'), async (req, res) => {
    try {
        const { permissionIds } = req.body;
        
        const user = await User.findById(req.params.id);
        user.additionalPermissions = permissionIds;
        user.updatedAt = Date.now();
        await user.save();
        
        const updatedUser = await User.findById(user._id)
            .populate('role')
            .populate('additionalPermissions')
            .select('-password');
        
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== EXISTING ROUTES WITH PERMISSION CHECKS ====================

// Students
app.get('/api/students', authenticate, checkPermission('students.read'), async (req, res) => {
    try {
        const { class: classId, section, status, search } = req.query;
        let query = {};
        
        if (classId) query.class = classId;
        if (section) query.section = section;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { firstName: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { studentId: new RegExp(search, 'i') }
            ];
        }
        
        const students = await Student.find(query)
            .populate('class')
            .populate('userId')
            .sort('-createdAt');
        
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/students', authenticate, checkPermission('students.create'), upload.single('photo'), async (req, res) => {
    try {
        const studentData = {
            ...req.body,
            photo: req.file ? req.file.path : null
        };
        
        const count = await Student.countDocuments();
        studentData.studentId = `STU${String(count + 1).padStart(5, '0')}`;
        
        const student = new Student(studentData);
        await student.save();
        
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Teachers
app.get('/api/teachers', authenticate, checkPermission('teachers.read'), async (req, res) => {
    try {
        const teachers = await Teacher.find()
            .populate('subjects')
            .populate('classes')
            .sort('-createdAt');
        
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/teachers', authenticate, checkPermission('teachers.create'), upload.single('photo'), async (req, res) => {
    try {
        const teacherData = {
            ...req.body,
            photo: req.file ? req.file.path : null
        };
        
        const count = await Teacher.countDocuments();
        teacherData.employeeId = `EMP${String(count + 1).padStart(5, '0')}`;
        
        const teacher = new Teacher(teacherData);
        await teacher.save();
        
        res.status(201).json(teacher);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Attendance
app.post('/api/attendance', authenticate, checkPermission('attendance.create'), async (req, res) => {
    try {
        const attendance = new Attendance({
            ...req.body,
            markedBy: req.user._id
        });
        
        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/attendance', authenticate, checkPermission('attendance.read'), async (req, res) => {
    try {
        const { student, class: classId, startDate, endDate } = req.query;
        let query = {};
        
        if (student) query.student = student;
        if (classId) query.class = classId;
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const attendance = await Attendance.find(query)
            .populate('student')
            .populate('class')
            .populate('markedBy')
            .sort('-date');
        
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fees
app.get('/api/fees', authenticate, checkPermission('fees.read'), async (req, res) => {
    try {
        const { student, status, academicYear } = req.query;
        let query = {};
        
        if (student) query.student = student;
        if (status) query.status = status;
        if (academicYear) query.academicYear = academicYear;
        
        const fees = await Fee.find(query)
            .populate('student')
            .sort('-createdAt');
        
        res.json(fees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/fees', authenticate, checkPermission('fees.create'), async (req, res) => {
    try {
        const fee = new Fee(req.body);
        await fee.save();
        res.status(201).json(fee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Dashboard Stats
app.get('/api/dashboard/stats', authenticate, async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments({ status: 'active' });
        const totalTeachers = await Teacher.countDocuments({ status: 'active' });
        const totalClasses = await Class.countDocuments();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const attendanceToday = await Attendance.countDocuments({
            date: { $gte: today },
            status: 'present'
        });
        
        const attendanceRate = totalStudents > 0 
            ? ((attendanceToday / totalStudents) * 100).toFixed(2)
            : 0;
        
        const totalFees = await Fee.aggregate([
            { $group: { _id: null, total: { $sum: '$paidAmount' } } }
        ]);
        
        const pendingFees = await Fee.aggregate([
            { $match: { status: { $in: ['pending', 'partial', 'overdue'] } } },
            { $group: { _id: null, total: { $sum: { $subtract: ['$amount', '$paidAmount'] } } } }
        ]);
        
        res.json({
            totalStudents,
            totalTeachers,
            totalClasses,
            attendanceRate,
            feeCollected: totalFees[0]?.total || 0,
            pendingFees: pendingFees[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Dynamic Role & Permission System Active');
});

module.exports = app;
