// Enhanced School ERP - Academic Session & Student Promotion System
// Node.js + Express + MongoDB

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect('mongodb://localhost:27017/school_erp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const JWT_SECRET = 'your-secret-key-change-in-production';

// ==================== ENHANCED SCHEMAS ====================

// Academic Session Schema
const academicSessionSchema = new mongoose.Schema({
    sessionName: { type: String, required: true, unique: true }, // "2025-2026"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
    isCurrent: { type: Boolean, default: false },
    status: { 
        type: String, 
        enum: ['upcoming', 'active', 'completed', 'archived'],
        default: 'upcoming'
    },
    admissionStartDate: Date,
    admissionEndDate: Date,
    metadata: {
        totalStudents: { type: Number, default: 0 },
        totalClasses: { type: Number, default: 0 },
        promotedCount: { type: Number, default: 0 },
        transferredCount: { type: Number, default: 0 },
        graduatedCount: { type: Number, default: 0 }
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Student Academic History Schema
const studentAcademicHistorySchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    section: String,
    rollNumber: Number,
    admissionDate: Date,
    
    // Performance Data
    attendance: {
        totalDays: { type: Number, default: 0 },
        presentDays: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
    },
    
    results: [{
        exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
        totalMarks: Number,
        marksObtained: Number,
        percentage: Number,
        grade: String,
        rank: Number
    }],
    
    overallPerformance: {
        totalMarks: Number,
        marksObtained: Number,
        percentage: Number,
        grade: String,
        rank: Number,
        status: { type: String, enum: ['pass', 'fail', 'promoted', 'detained'] }
    },
    
    // Fees
    feesData: {
        totalFees: Number,
        paidFees: Number,
        pendingFees: Number,
        status: { type: String, enum: ['paid', 'partial', 'pending'] }
    },
    
    remarks: String,
    conduct: { type: String, enum: ['excellent', 'good', 'satisfactory', 'needs improvement'] },
    
    // Session Status
    sessionStatus: {
        type: String,
        enum: ['active', 'promoted', 'detained', 'transferred', 'graduated', 'left'],
        default: 'active'
    },
    
    promotedTo: {
        session: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession' },
        class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        section: String,
        promotedOn: Date,
        promotedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    
    transferDetails: {
        transferDate: Date,
        reason: String,
        transferredTo: String, // School name
        transferCertificateNumber: String,
        documents: [String],
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Enhanced Student Schema with Session Support
const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    admissionNumber: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Personal Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    bloodGroup: String,
    nationality: String,
    religion: String,
    category: { type: String, enum: ['general', 'obc', 'sc', 'st', 'other'] },
    
    // Current Academic Details
    currentSession: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession' },
    currentClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    currentSection: String,
    currentRollNumber: Number,
    
    // Admission Information
    originalAdmissionDate: Date,
    admissionClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    admissionSession: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession' },
    
    // Contact Information
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    
    // Guardian Information
    guardian: {
        name: String,
        relationship: String,
        phone: String,
        email: String,
        occupation: String,
        annualIncome: Number
    },
    
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    },
    
    // Medical Information
    medicalInfo: {
        allergies: [String],
        conditions: [String],
        medications: [String],
        bloodGroup: String
    },
    
    // Academic History (References)
    academicHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentAcademicHistory' }],
    
    // Documents
    documents: [{
        type: String,
        name: String,
        url: String,
        uploadedAt: Date
    }],
    
    photo: String,
    
    // Status
    status: { 
        type: String, 
        enum: ['active', 'graduated', 'transferred', 'left', 'alumni'], 
        default: 'active' 
    },
    
    // Transfer Certificate
    tcIssued: { type: Boolean, default: false },
    tcNumber: String,
    tcIssuedDate: Date,
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Promotion Request Schema
const promotionRequestSchema = new mongoose.Schema({
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
    fromSession: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
    toSession: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
    
    promotionType: { 
        type: String, 
        enum: ['bulk', 'individual', 'class-wise'], 
        required: true 
    },
    
    criteria: {
        minimumAttendance: Number,
        minimumPercentage: Number,
        autoPromote: Boolean,
        detainOnFail: Boolean
    },
    
    // For bulk or class-wise promotion
    sourceClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    targetClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    
    // Students to be promoted
    students: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        fromClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        toClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        section: String,
        rollNumber: Number,
        action: { type: String, enum: ['promote', 'detain', 'graduate', 'skip'] },
        reason: String
    }],
    
    status: { 
        type: String, 
        enum: ['pending', 'in-progress', 'completed', 'failed'], 
        default: 'pending' 
    },
    
    statistics: {
        total: Number,
        promoted: Number,
        detained: Number,
        graduated: Number,
        failed: Number
    },
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    executedAt: Date,
    createdAt: { type: Date, default: Date.now }
});

// Transfer Request Schema
const transferRequestSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession' },
    
    requestType: { 
        type: String, 
        enum: ['transfer_out', 'transfer_in'], 
        required: true 
    },
    
    // Transfer Out Details
    transferTo: {
        schoolName: String,
        schoolAddress: String,
        city: String,
        state: String,
        reason: String
    },
    
    // Transfer In Details (if accepting from another school)
    transferFrom: {
        schoolName: String,
        lastClass: String,
        lastSession: String,
        tcNumber: String,
        tcDate: Date
    },
    
    // Transfer Certificate Details
    tcDetails: {
        tcNumber: String,
        issueDate: Date,
        lastAttendanceDate: Date,
        conduct: String,
        remarks: String,
        feesStatus: { type: String, enum: ['paid', 'pending', 'waived'] }
    },
    
    documents: [{
        name: String,
        url: String,
        uploadedAt: Date
    }],
    
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'completed'], 
        default: 'pending' 
    },
    
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    remarks: String,
    
    createdAt: { type: Date, default: Date.now }
});

// Class Structure for Session
const classSchema = new mongoose.Schema({
    name: { type: String, required: true },
    grade: { type: Number, required: true },
    section: String,
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession' },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    room: String,
    capacity: Number,
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Models
const AcademicSession = mongoose.model('AcademicSession', academicSessionSchema);
const StudentAcademicHistory = mongoose.model('StudentAcademicHistory', studentAcademicHistorySchema);
const Student = mongoose.model('Student', studentSchema);
const PromotionRequest = mongoose.model('PromotionRequest', promotionRequestSchema);
const TransferRequest = mongoose.model('TransferRequest', transferRequestSchema);
const Class = mongoose.model('Class', classSchema);

// ==================== AUTHENTICATION MIDDLEWARE ====================

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = { _id: decoded.userId }; // Simplified for this example
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

// ==================== ACADEMIC SESSION ROUTES ====================

// Get all sessions
app.get('/api/sessions', authenticate, async (req, res) => {
    try {
        const sessions = await AcademicSession.find()
            .populate('createdBy', 'firstName lastName')
            .sort('-startDate');
        
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current active session
app.get('/api/sessions/current', authenticate, async (req, res) => {
    try {
        const currentSession = await AcademicSession.findOne({ isCurrent: true });
        
        if (!currentSession) {
            return res.status(404).json({ error: 'No active session found' });
        }
        
        res.json(currentSession);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new session
app.post('/api/sessions', authenticate, async (req, res) => {
    try {
        const session = new AcademicSession({
            ...req.body,
            createdBy: req.user._id
        });
        
        await session.save();
        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update session
app.put('/api/sessions/:id', authenticate, async (req, res) => {
    try {
        const session = await AcademicSession.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        res.json(session);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Set current session
app.post('/api/sessions/:id/set-current', authenticate, async (req, res) => {
    try {
        // Unset all current sessions
        await AcademicSession.updateMany({}, { isCurrent: false });
        
        // Set new current session
        const session = await AcademicSession.findByIdAndUpdate(
            req.params.id,
            { 
                isCurrent: true, 
                isActive: true,
                status: 'active',
                updatedAt: Date.now() 
            },
            { new: true }
        );
        
        res.json(session);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Close/Archive session
app.post('/api/sessions/:id/close', authenticate, async (req, res) => {
    try {
        const session = await AcademicSession.findByIdAndUpdate(
            req.params.id,
            { 
                isActive: false,
                isCurrent: false,
                status: 'completed',
                updatedAt: Date.now() 
            },
            { new: true }
        );
        
        res.json(session);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== STUDENT ACADEMIC HISTORY ROUTES ====================

// Get student academic history
app.get('/api/students/:studentId/history', authenticate, async (req, res) => {
    try {
        const history = await StudentAcademicHistory.find({ 
            student: req.params.studentId 
        })
        .populate('session')
        .populate('class')
        .populate('promotedTo.session')
        .populate('promotedTo.class')
        .sort('-session');
        
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get history for specific session
app.get('/api/students/:studentId/history/:sessionId', authenticate, async (req, res) => {
    try {
        const history = await StudentAcademicHistory.findOne({
            student: req.params.studentId,
            session: req.params.sessionId
        })
        .populate('session')
        .populate('class')
        .populate('results.exam');
        
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create/Update academic history entry
app.post('/api/students/:studentId/history', authenticate, async (req, res) => {
    try {
        const history = new StudentAcademicHistory({
            student: req.params.studentId,
            ...req.body
        });
        
        await history.save();
        
        // Update student's academic history array
        await Student.findByIdAndUpdate(
            req.params.studentId,
            { $push: { academicHistory: history._id } }
        );
        
        res.status(201).json(history);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== PROMOTION ROUTES ====================

// Create promotion request
app.post('/api/promotions', authenticate, async (req, res) => {
    try {
        const promotion = new PromotionRequest({
            ...req.body,
            createdBy: req.user._id
        });
        
        await promotion.save();
        res.status(201).json(promotion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all promotion requests
app.get('/api/promotions', authenticate, async (req, res) => {
    try {
        const { session, status } = req.query;
        let query = {};
        
        if (session) query.session = session;
        if (status) query.status = status;
        
        const promotions = await PromotionRequest.find(query)
            .populate('fromSession')
            .populate('toSession')
            .populate('sourceClass')
            .populate('targetClass')
            .populate('students.student')
            .sort('-createdAt');
        
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bulk promote students
app.post('/api/promotions/bulk', authenticate, async (req, res) => {
    try {
        const { 
            fromSessionId, 
            toSessionId, 
            sourceClassId, 
            targetClassId,
            students,
            criteria 
        } = req.body;
        
        const results = {
            total: students.length,
            promoted: 0,
            detained: 0,
            failed: 0,
            errors: []
        };
        
        for (const studentData of students) {
            try {
                const student = await Student.findById(studentData.studentId);
                
                if (!student) {
                    results.errors.push({ 
                        studentId: studentData.studentId, 
                        error: 'Student not found' 
                    });
                    results.failed++;
                    continue;
                }
                
                // Check promotion criteria
                if (criteria.minimumAttendance && 
                    studentData.attendancePercentage < criteria.minimumAttendance) {
                    results.detained++;
                    
                    // Update history with detained status
                    await StudentAcademicHistory.findOneAndUpdate(
                        { student: student._id, session: fromSessionId },
                        { sessionStatus: 'detained', remarks: 'Low attendance' }
                    );
                    continue;
                }
                
                if (criteria.minimumPercentage && 
                    studentData.percentage < criteria.minimumPercentage) {
                    results.detained++;
                    
                    await StudentAcademicHistory.findOneAndUpdate(
                        { student: student._id, session: fromSessionId },
                        { sessionStatus: 'detained', remarks: 'Did not meet passing criteria' }
                    );
                    continue;
                }
                
                // Promote student
                // 1. Update old session history
                await StudentAcademicHistory.findOneAndUpdate(
                    { student: student._id, session: fromSessionId },
                    {
                        sessionStatus: 'promoted',
                        'promotedTo.session': toSessionId,
                        'promotedTo.class': targetClassId,
                        'promotedTo.section': studentData.section,
                        'promotedTo.promotedOn': Date.now(),
                        'promotedTo.promotedBy': req.user._id
                    }
                );
                
                // 2. Create new session history
                const newHistory = new StudentAcademicHistory({
                    student: student._id,
                    session: toSessionId,
                    class: targetClassId,
                    section: studentData.section,
                    rollNumber: studentData.rollNumber,
                    sessionStatus: 'active'
                });
                
                await newHistory.save();
                
                // 3. Update student current details
                await Student.findByIdAndUpdate(student._id, {
                    currentSession: toSessionId,
                    currentClass: targetClassId,
                    currentSection: studentData.section,
                    currentRollNumber: studentData.rollNumber,
                    $push: { academicHistory: newHistory._id },
                    updatedAt: Date.now()
                });
                
                // 4. Update class student lists
                await Class.findByIdAndUpdate(sourceClassId, {
                    $pull: { students: student._id }
                });
                
                await Class.findByIdAndUpdate(targetClassId, {
                    $push: { students: student._id }
                });
                
                results.promoted++;
                
            } catch (error) {
                results.errors.push({ 
                    studentId: studentData.studentId, 
                    error: error.message 
                });
                results.failed++;
            }
        }
        
        // Update session metadata
        await AcademicSession.findByIdAndUpdate(toSessionId, {
            $inc: { 'metadata.promotedCount': results.promoted }
        });
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Promote single student
app.post('/api/promotions/single', authenticate, async (req, res) => {
    try {
        const { 
            studentId, 
            fromSessionId, 
            toSessionId, 
            toClassId, 
            section, 
            rollNumber 
        } = req.body;
        
        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        // Update old session history
        await StudentAcademicHistory.findOneAndUpdate(
            { student: studentId, session: fromSessionId },
            {
                sessionStatus: 'promoted',
                'promotedTo.session': toSessionId,
                'promotedTo.class': toClassId,
                'promotedTo.section': section,
                'promotedTo.promotedOn': Date.now(),
                'promotedTo.promotedBy': req.user._id
            }
        );
        
        // Create new session history
        const newHistory = new StudentAcademicHistory({
            student: studentId,
            session: toSessionId,
            class: toClassId,
            section: section,
            rollNumber: rollNumber,
            sessionStatus: 'active'
        });
        
        await newHistory.save();
        
        // Update student
        await Student.findByIdAndUpdate(studentId, {
            currentSession: toSessionId,
            currentClass: toClassId,
            currentSection: section,
            currentRollNumber: rollNumber,
            $push: { academicHistory: newHistory._id },
            updatedAt: Date.now()
        });
        
        res.json({ 
            success: true, 
            message: 'Student promoted successfully',
            student: student
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Graduate students
app.post('/api/promotions/graduate', authenticate, async (req, res) => {
    try {
        const { studentIds, sessionId } = req.body;
        
        const results = {
            total: studentIds.length,
            graduated: 0,
            failed: 0,
            errors: []
        };
        
        for (const studentId of studentIds) {
            try {
                // Update history
                await StudentAcademicHistory.findOneAndUpdate(
                    { student: studentId, session: sessionId },
                    { sessionStatus: 'graduated' }
                );
                
                // Update student status
                await Student.findByIdAndUpdate(studentId, {
                    status: 'graduated',
                    updatedAt: Date.now()
                });
                
                results.graduated++;
            } catch (error) {
                results.errors.push({ studentId, error: error.message });
                results.failed++;
            }
        }
        
        // Update session metadata
        await AcademicSession.findByIdAndUpdate(sessionId, {
            $inc: { 'metadata.graduatedCount': results.graduated }
        });
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== TRANSFER ROUTES ====================

// Create transfer request
app.post('/api/transfers', authenticate, async (req, res) => {
    try {
        const transfer = new TransferRequest({
            ...req.body,
            requestedBy: req.user._id
        });
        
        await transfer.save();
        res.status(201).json(transfer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all transfer requests
app.get('/api/transfers', authenticate, async (req, res) => {
    try {
        const { status, type } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (type) query.requestType = type;
        
        const transfers = await TransferRequest.find(query)
            .populate('student')
            .populate('session')
            .populate('requestedBy', 'firstName lastName')
            .populate('approvedBy', 'firstName lastName')
            .sort('-createdAt');
        
        res.json(transfers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve transfer request
app.post('/api/transfers/:id/approve', authenticate, async (req, res) => {
    try {
        const transfer = await TransferRequest.findById(req.params.id);
        
        if (!transfer) {
            return res.status(404).json({ error: 'Transfer request not found' });
        }
        
        // Generate TC number
        const tcNumber = `TC${Date.now()}`;
        
        // Update transfer request
        transfer.status = 'approved';
        transfer.approvedBy = req.user._id;
        transfer.approvedAt = Date.now();
        transfer.tcDetails.tcNumber = tcNumber;
        transfer.tcDetails.issueDate = Date.now();
        await transfer.save();
        
        // Update student history
        await StudentAcademicHistory.findOneAndUpdate(
            { student: transfer.student, session: transfer.session },
            {
                sessionStatus: 'transferred',
                'transferDetails.transferDate': Date.now(),
                'transferDetails.reason': transfer.transferTo.reason,
                'transferDetails.transferredTo': transfer.transferTo.schoolName,
                'transferDetails.transferCertificateNumber': tcNumber,
                'transferDetails.approvedBy': req.user._id
            }
        );
        
        // Update student
        await Student.findByIdAndUpdate(transfer.student, {
            status: 'transferred',
            tcIssued: true,
            tcNumber: tcNumber,
            tcIssuedDate: Date.now(),
            updatedAt: Date.now()
        });
        
        // Update session metadata
        await AcademicSession.findByIdAndUpdate(transfer.session, {
            $inc: { 'metadata.transferredCount': 1 }
        });
        
        res.json({ 
            success: true, 
            message: 'Transfer approved and TC issued',
            transfer,
            tcNumber
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate Transfer Certificate
app.get('/api/transfers/:id/certificate', authenticate, async (req, res) => {
    try {
        const transfer = await TransferRequest.findById(req.params.id)
            .populate('student')
            .populate('session');
        
        if (!transfer || transfer.status !== 'approved') {
            return res.status(404).json({ error: 'Approved transfer not found' });
        }
        
        const tcData = {
            tcNumber: transfer.tcDetails.tcNumber,
            issueDate: transfer.tcDetails.issueDate,
            student: {
                name: `${transfer.student.firstName} ${transfer.student.lastName}`,
                admissionNumber: transfer.student.admissionNumber,
                class: transfer.student.currentClass,
                dob: transfer.student.dateOfBirth
            },
            session: transfer.session.sessionName,
            lastAttendance: transfer.tcDetails.lastAttendanceDate,
            conduct: transfer.tcDetails.conduct,
            feesStatus: transfer.tcDetails.feesStatus,
            remarks: transfer.tcDetails.remarks,
            transferTo: transfer.transferTo.schoolName
        };
        
        res.json(tcData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== REPORTS & ANALYTICS ====================

// Session-wise statistics
app.get('/api/sessions/:id/statistics', authenticate, async (req, res) => {
    try {
        const session = await AcademicSession.findById(req.params.id);
        
        const totalStudents = await StudentAcademicHistory.countDocuments({ 
            session: req.params.id 
        });
        
        const promoted = await StudentAcademicHistory.countDocuments({ 
            session: req.params.id, 
            sessionStatus: 'promoted' 
        });
        
        const detained = await StudentAcademicHistory.countDocuments({ 
            session: req.params.id, 
            sessionStatus: 'detained' 
        });
        
        const graduated = await StudentAcademicHistory.countDocuments({ 
            session: req.params.id, 
            sessionStatus: 'graduated' 
        });
        
        const transferred = await StudentAcademicHistory.countDocuments({ 
            session: req.params.id, 
            sessionStatus: 'transferred' 
        });
        
        const active = await StudentAcademicHistory.countDocuments({ 
            session: req.params.id, 
            sessionStatus: 'active' 
        });
        
        res.json({
            session,
            statistics: {
                totalStudents,
                active,
                promoted,
                detained,
                graduated,
                transferred,
                promotionRate: totalStudents > 0 ? ((promoted / totalStudents) * 100).toFixed(2) : 0,
                retentionRate: totalStudents > 0 ? (((totalStudents - transferred) / totalStudents) * 100).toFixed(2) : 0
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Student progression report
app.get('/api/students/:id/progression', authenticate, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        const history = await StudentAcademicHistory.find({ student: req.params.id })
            .populate('session')
            .populate('class')
            .sort('session');
        
        const progression = history.map(h => ({
            session: h.session.sessionName,
            class: h.class.name,
            section: h.section,
            rollNumber: h.rollNumber,
            attendance: h.attendance.percentage,
            performance: h.overallPerformance.percentage,
            grade: h.overallPerformance.grade,
            status: h.sessionStatus,
            promoted: h.sessionStatus === 'promoted',
            promotedTo: h.promotedTo
        }));
        
        res.json({
            student,
            progression
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Academic Session & Promotion System Active');
});

module.exports = app;
