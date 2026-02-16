// School Management ERP - Backend API Server
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

// JWT Secret
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

// ==================== SCHEMAS ====================

// User Schema (Admin, Teacher, Student)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher', 'student', 'parent'], required: true },
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Student Schema
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

// Teacher Schema
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

// Class Schema
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

// Subject Schema
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

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'half-day'], required: true },
    remarks: String,
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    createdAt: { type: Date, default: Date.now }
});

// Exam Schema
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

// Result Schema
const resultSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    marksObtained: Number,
    grade: String,
    remarks: String,
    publishedAt: Date,
    createdAt: { type: Date, default: Date.now }
});

// Fee Schema
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

// Library Schema
const librarySchema = new mongoose.Schema({
    bookId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: String,
    isbn: String,
    publisher: String,
    category: String,
    quantity: Number,
    available: Number,
    location: String,
    addedDate: { type: Date, default: Date.now }
});

// Book Issue Schema
const bookIssueSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Library' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    issueDate: { type: Date, default: Date.now },
    dueDate: Date,
    returnDate: Date,
    fine: { type: Number, default: 0 },
    status: { type: String, enum: ['issued', 'returned', 'overdue'], default: 'issued' }
});

// Transport Schema
const transportSchema = new mongoose.Schema({
    routeNumber: { type: String, required: true },
    routeName: String,
    vehicleNumber: String,
    driverName: String,
    driverPhone: String,
    capacity: Number,
    stops: [{
        name: String,
        time: String,
        fee: Number
    }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

// Hostel Schema
const hostelSchema = new mongoose.Schema({
    hostelName: { type: String, required: true },
    type: { type: String, enum: ['boys', 'girls', 'mixed'] },
    warden: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    capacity: Number,
    occupied: Number,
    rooms: [{
        roomNumber: String,
        capacity: Number,
        occupied: Number,
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
    }],
    monthlyFee: Number,
    facilities: [String]
});

// Timetable Schema
const timetableSchema = new mongoose.Schema({
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] },
    periods: [{
        periodNumber: Number,
        startTime: String,
        endTime: String,
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
        room: String
    }],
    academicYear: String
});

// Notice Schema
const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    category: { type: String, enum: ['general', 'academic', 'event', 'urgent', 'holiday'] },
    targetAudience: [{ type: String, enum: ['all', 'students', 'teachers', 'parents'] }],
    attachments: [String],
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishedAt: Date,
    expiryDate: Date,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Event Schema
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    eventType: { type: String, enum: ['academic', 'sports', 'cultural', 'holiday', 'meeting', 'other'] },
    startDate: Date,
    endDate: Date,
    location: String,
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    images: [String],
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
    createdAt: { type: Date, default: Date.now }
});

// Expense Schema
const expenseSchema = new mongoose.Schema({
    category: { type: String, required: true },
    description: String,
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    paymentMethod: String,
    vendor: String,
    invoiceNumber: String,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

// Message Schema
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: String,
    content: { type: String, required: true },
    attachments: [String],
    isRead: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Class = mongoose.model('Class', classSchema);
const Subject = mongoose.model('Subject', subjectSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);
const Exam = mongoose.model('Exam', examSchema);
const Result = mongoose.model('Result', resultSchema);
const Fee = mongoose.model('Fee', feeSchema);
const Library = mongoose.model('Library', librarySchema);
const BookIssue = mongoose.model('BookIssue', bookIssueSchema);
const Transport = mongoose.model('Transport', transportSchema);
const Hostel = mongoose.model('Hostel', hostelSchema);
const Timetable = mongoose.model('Timetable', timetableSchema);
const Notice = mongoose.model('Notice', noticeSchema);
const Event = mongoose.model('Event', eventSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Message = mongoose.model('Message', messageSchema);

// ==================== MIDDLEWARE ====================

// Authentication Middleware
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) throw new Error();
        
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

// Role-based Authorization
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};

// ==================== AUTHENTICATION ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, role, firstName, lastName } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
            role,
            firstName,
            lastName
        });
        
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== STUDENT ROUTES ====================

// Get all students
app.get('/api/students', authenticate, async (req, res) => {
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

// Get student by ID
app.get('/api/students/:id', authenticate, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('class')
            .populate('userId');
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create student
app.post('/api/students', authenticate, authorize('admin', 'teacher'), upload.single('photo'), async (req, res) => {
    try {
        const studentData = {
            ...req.body,
            photo: req.file ? req.file.path : null
        };
        
        // Generate unique student ID
        const count = await Student.countDocuments();
        studentData.studentId = `STU${String(count + 1).padStart(5, '0')}`;
        
        const student = new Student(studentData);
        await student.save();
        
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update student
app.put('/api/students/:id', authenticate, authorize('admin', 'teacher'), upload.single('photo'), async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.photo = req.file.path;
        }
        updates.updatedAt = Date.now();
        
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete student
app.delete('/api/students/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== TEACHER ROUTES ====================

// Get all teachers
app.get('/api/teachers', authenticate, async (req, res) => {
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

// Create teacher
app.post('/api/teachers', authenticate, authorize('admin'), upload.single('photo'), async (req, res) => {
    try {
        const teacherData = {
            ...req.body,
            photo: req.file ? req.file.path : null
        };
        
        // Generate unique employee ID
        const count = await Teacher.countDocuments();
        teacherData.employeeId = `EMP${String(count + 1).padStart(5, '0')}`;
        
        const teacher = new Teacher(teacherData);
        await teacher.save();
        
        res.status(201).json(teacher);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== ATTENDANCE ROUTES ====================

// Mark attendance
app.post('/api/attendance', authenticate, authorize('admin', 'teacher'), async (req, res) => {
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

// Get attendance
app.get('/api/attendance', authenticate, async (req, res) => {
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

// ==================== FEE ROUTES ====================

// Create fee
app.post('/api/fees', authenticate, authorize('admin'), async (req, res) => {
    try {
        const fee = new Fee(req.body);
        await fee.save();
        res.status(201).json(fee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get fees
app.get('/api/fees', authenticate, async (req, res) => {
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

// Pay fee
app.post('/api/fees/:id/pay', authenticate, async (req, res) => {
    try {
        const { amount, paymentMethod } = req.body;
        
        const fee = await Fee.findById(req.params.id);
        if (!fee) {
            return res.status(404).json({ error: 'Fee not found' });
        }
        
        fee.paidAmount += amount;
        fee.paidDate = Date.now();
        fee.paymentMethod = paymentMethod;
        fee.receiptNumber = `RCT${Date.now()}`;
        
        if (fee.paidAmount >= fee.amount) {
            fee.status = 'paid';
        } else {
            fee.status = 'partial';
        }
        
        await fee.save();
        res.json(fee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== LIBRARY ROUTES ====================

// Add book
app.post('/api/library/books', authenticate, authorize('admin'), async (req, res) => {
    try {
        const count = await Library.countDocuments();
        const book = new Library({
            ...req.body,
            bookId: `BOOK${String(count + 1).padStart(5, '0')}`,
            available: req.body.quantity
        });
        
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Issue book
app.post('/api/library/issue', authenticate, async (req, res) => {
    try {
        const { bookId, studentId } = req.body;
        
        const book = await Library.findById(bookId);
        if (!book || book.available <= 0) {
            return res.status(400).json({ error: 'Book not available' });
        }
        
        const issue = new BookIssue({
            book: bookId,
            student: studentId,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
        });
        
        await issue.save();
        
        book.available -= 1;
        await book.save();
        
        res.status(201).json(issue);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== DASHBOARD STATS ====================

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

// ==================== ADDITIONAL ROUTES ====================

// Classes
app.get('/api/classes', authenticate, async (req, res) => {
    try {
        const classes = await Class.find()
            .populate('classTeacher')
            .populate('subjects')
            .populate('students');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/classes', authenticate, authorize('admin'), async (req, res) => {
    try {
        const classData = new Class(req.body);
        await classData.save();
        res.status(201).json(classData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Subjects
app.get('/api/subjects', authenticate, async (req, res) => {
    try {
        const subjects = await Subject.find().populate('teacher');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/subjects', authenticate, authorize('admin'), async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();
        res.status(201).json(subject);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Exams
app.get('/api/exams', authenticate, async (req, res) => {
    try {
        const exams = await Exam.find()
            .populate('subject')
            .populate('class')
            .sort('-date');
        res.json(exams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/exams', authenticate, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const exam = new Exam(req.body);
        await exam.save();
        res.status(201).json(exam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Results
app.post('/api/results', authenticate, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const result = new Result(req.body);
        await result.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Notices
app.get('/api/notices', authenticate, async (req, res) => {
    try {
        const notices = await Notice.find({ isActive: true })
            .populate('publishedBy')
            .sort('-publishedAt');
        res.json(notices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/notices', authenticate, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const notice = new Notice({
            ...req.body,
            publishedBy: req.user._id,
            publishedAt: Date.now()
        });
        await notice.save();
        res.status(201).json(notice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Events
app.get('/api/events', authenticate, async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer')
            .sort('startDate');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/events', authenticate, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Messages
app.get('/api/messages', authenticate, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id },
                { recipient: req.user._id }
            ]
        })
        .populate('sender')
        .populate('recipient')
        .sort('-sentAt');
        
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/messages', authenticate, async (req, res) => {
    try {
        const message = new Message({
            ...req.body,
            sender: req.user._id
        });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Timetable
app.get('/api/timetable', authenticate, async (req, res) => {
    try {
        const { classId } = req.query;
        const timetable = await Timetable.find({ class: classId })
            .populate('class')
            .populate('periods.subject')
            .populate('periods.teacher');
        res.json(timetable);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/timetable', authenticate, authorize('admin'), async (req, res) => {
    try {
        const timetable = new Timetable(req.body);
        await timetable.save();
        res.status(201).json(timetable);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Transport
app.get('/api/transport', authenticate, async (req, res) => {
    try {
        const routes = await Transport.find().populate('students');
        res.json(routes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Hostel
app.get('/api/hostel', authenticate, async (req, res) => {
    try {
        const hostels = await Hostel.find().populate('warden');
        res.json(hostels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Expenses
app.post('/api/expenses', authenticate, authorize('admin'), async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/expenses', authenticate, authorize('admin'), async (req, res) => {
    try {
        const expenses = await Expense.find().sort('-date');
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
