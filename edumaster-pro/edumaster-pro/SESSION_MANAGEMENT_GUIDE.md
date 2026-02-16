# Academic Session & Student Promotion Management Guide

## 🎓 Overview

The EduMaster Pro now includes a comprehensive Academic Session Management System that handles:
- **Academic Year Management** - Create and manage multiple sessions
- **Automatic Student Promotion** - Bulk promote students to next class/session
- **Student Transfer** - Handle inter-school transfers with TC generation
- **Academic History Tracking** - Complete student progression records
- **Performance-Based Promotion** - Set criteria for promotion eligibility
- **Graduation Management** - Manage final year students

---

## 📚 Key Features

### ✅ Academic Session Management
- Create unlimited academic sessions (2024-2025, 2025-2026, etc.)
- Set session start and end dates
- Mark current active session
- Track session statistics
- Close/Archive completed sessions

### ✅ Student Promotion System
- **Bulk Promotion** - Promote entire class at once
- **Individual Promotion** - Promote specific students
- **Criteria-Based** - Set minimum attendance and percentage
- **Auto-Detection** - Automatically detect eligible students
- **Detention Management** - Handle students who don't meet criteria
- **Progress Tracking** - Real-time promotion progress

### ✅ Transfer Management
- Transfer students to other schools
- Generate Transfer Certificate (TC)
- Track transfer history
- Approval workflow
- Document management
- Fee clearance verification

### ✅ Academic History
- Complete student progression records
- Session-wise performance data
- Attendance tracking
- Result records
- Promotion history
- Transfer details

---

## 🗂️ Database Structure

### 1. Academic Session
```javascript
{
    sessionName: "2025-2026",
    startDate: "2025-04-01",
    endDate: "2026-03-31",
    isActive: true,
    isCurrent: true,
    status: "active",  // upcoming, active, completed, archived
    admissionStartDate: "2025-01-01",
    admissionEndDate: "2025-03-31",
    metadata: {
        totalStudents: 2847,
        promotedCount: 0,
        transferredCount: 0,
        graduatedCount: 0
    }
}
```

### 2. Student Academic History
```javascript
{
    student: ObjectId,
    session: ObjectId,
    class: ObjectId,
    section: "A",
    rollNumber: 1,
    
    attendance: {
        totalDays: 200,
        presentDays: 190,
        percentage: 95
    },
    
    overallPerformance: {
        totalMarks: 500,
        marksObtained: 425,
        percentage: 85,
        grade: "A",
        rank: 5,
        status: "promoted"  // pass, fail, promoted, detained
    },
    
    sessionStatus: "promoted",  // active, promoted, detained, transferred, graduated
    
    promotedTo: {
        session: ObjectId,
        class: ObjectId,
        section: "A",
        promotedOn: Date,
        promotedBy: ObjectId
    },
    
    transferDetails: {
        transferDate: Date,
        reason: "Parent transfer",
        transferredTo: "Delhi Public School",
        transferCertificateNumber: "TC20260215001"
    }
}
```

### 3. Enhanced Student Schema
```javascript
{
    studentId: "STU00001",
    admissionNumber: "ADM2025001",
    
    // Current Academic Details
    currentSession: ObjectId,
    currentClass: ObjectId,
    currentSection: "A",
    currentRollNumber: 1,
    
    // Original Admission
    originalAdmissionDate: Date,
    admissionClass: ObjectId,
    admissionSession: ObjectId,
    
    // History References
    academicHistory: [ObjectId, ObjectId, ...],
    
    // Status
    status: "active",  // active, graduated, transferred, left, alumni
    
    // Transfer Certificate
    tcIssued: false,
    tcNumber: null,
    tcIssuedDate: null
}
```

---

## 🚀 How to Use

### 1. Create New Academic Session

**Step 1:** Go to Session Management
```
Admin Dashboard → Session Management → Create New Session
```

**Step 2:** Fill Session Details
```javascript
{
    sessionName: "2026-2027",
    startDate: "2026-04-01",
    endDate: "2027-03-31",
    admissionStartDate: "2026-01-01",
    admissionEndDate: "2026-03-31"
}
```

**Step 3:** Save Session
- Session is created with "upcoming" status
- Can be activated when ready

---

### 2. Activate Session

**When to Activate:**
- When the academic year starts
- Before admitting new students
- Before promoting students

**How to Activate:**
1. Click "Set Current" on the session card
2. System automatically:
   - Deactivates previous session
   - Sets new session as current
   - Updates status to "active"

---

### 3. Promote Students (Bulk)

**Step-by-Step Process:**

**Step 1: Select Sessions**
```
From Session: 2025-2026
To Session: 2026-2027
```

**Step 2: Select Classes**
```
From Class: Class 9
To Class: Class 10
```

**Step 3: Set Promotion Criteria**
```
Minimum Attendance: 75%
Minimum Percentage: 40%
```

**Step 4: Load Students**
- System loads all students from selected class
- Shows eligibility status for each student

**Step 5: Select Students**
- **Select All** - Promote everyone
- **Select Eligible** - Only students meeting criteria
- **Manual Selection** - Choose specific students

**Step 6: Review Summary**
```
Total Selected: 45
Eligible: 42
To Be Detained: 3
```

**Step 7: Execute Promotion**
- Click "Execute Promotion"
- System processes:
  - Updates old session history (marks as "promoted")
  - Creates new session history
  - Updates student current details
  - Updates class student lists
  - Updates session statistics

**Result:**
```
✅ 42 students promoted successfully
⏸️ 3 students detained
```

---

### 4. Detain Students

Students are automatically detained if they don't meet:
- Minimum attendance criteria
- Minimum percentage criteria

**What Happens:**
```javascript
{
    sessionStatus: "detained",
    remarks: "Did not meet passing criteria"
}
```

**Student stays in same class** for next session.

---

### 5. Graduate Students

For final year students (Class 12):

```http
POST /api/promotions/graduate
{
    "studentIds": ["id1", "id2", ...],
    "sessionId": "session_id"
}
```

**What Happens:**
- Student status changes to "graduated"
- Academic history marked as "graduated"
- Student becomes alumni
- Can issue completion certificate

---

### 6. Transfer Student to Another School

**Step 1: Create Transfer Request**
```
Session Management → Transfers → New Transfer Request
```

**Step 2: Fill Transfer Details**
```javascript
{
    student: "STU00045",
    transferTo: {
        schoolName: "Delhi Public School",
        schoolAddress: "Delhi",
        city: "Delhi",
        state: "Delhi",
        reason: "Parent job transfer"
    },
    transferDate: "2026-02-15"
}
```

**Step 3: Admin Approval**
- Request goes to admin for approval
- Admin reviews:
  - Student performance
  - Fee clearance status
  - Conduct record
  - Pending documents

**Step 4: Approve Transfer**
```http
POST /api/transfers/:id/approve
```

**System Generates:**
- Transfer Certificate (TC) Number
- TC Issue Date
- Complete TC document

**Step 5: Update Records**
- Student status → "transferred"
- Academic history → "transferred"
- TC issued flag → true
- Session statistics updated

---

### 7. Generate Transfer Certificate

**Automatic TC Generation:**
```javascript
{
    tcNumber: "TC20260215001",
    issueDate: "2026-02-15",
    student: {
        name: "Rahul Verma",
        admissionNumber: "ADM2025045",
        class: "Class 9-A",
        dob: "2010-05-15"
    },
    session: "2025-2026",
    lastAttendance: "2026-02-14",
    conduct: "Good",
    feesStatus: "Paid",
    remarks: "Transfer due to parent relocation",
    transferTo: "Delhi Public School"
}
```

**TC Document Includes:**
- Student details
- Academic performance
- Attendance record
- Conduct certificate
- Fee clearance
- Date of leaving
- Reason for leaving
- School seal and signature

---

## 📊 API Endpoints

### Session Management

#### Create Session
```http
POST /api/sessions
{
    "sessionName": "2026-2027",
    "startDate": "2026-04-01",
    "endDate": "2027-03-31",
    "admissionStartDate": "2026-01-01",
    "admissionEndDate": "2026-03-31"
}
```

#### Get All Sessions
```http
GET /api/sessions
```

#### Get Current Session
```http
GET /api/sessions/current
```

#### Set Current Session
```http
POST /api/sessions/:id/set-current
```

#### Close Session
```http
POST /api/sessions/:id/close
```

### Student History

#### Get Student History
```http
GET /api/students/:studentId/history
```

#### Get Session-Specific History
```http
GET /api/students/:studentId/history/:sessionId
```

### Promotion

#### Bulk Promote
```http
POST /api/promotions/bulk
{
    "fromSessionId": "session1_id",
    "toSessionId": "session2_id",
    "sourceClassId": "class9_id",
    "targetClassId": "class10_id",
    "students": [
        {
            "studentId": "student_id",
            "section": "A",
            "rollNumber": 1,
            "attendancePercentage": 95,
            "percentage": 85
        }
    ],
    "criteria": {
        "minimumAttendance": 75,
        "minimumPercentage": 40
    }
}
```

#### Individual Promote
```http
POST /api/promotions/single
{
    "studentId": "student_id",
    "fromSessionId": "session1_id",
    "toSessionId": "session2_id",
    "toClassId": "class10_id",
    "section": "A",
    "rollNumber": 5
}
```

#### Graduate Students
```http
POST /api/promotions/graduate
{
    "studentIds": ["id1", "id2", ...],
    "sessionId": "session_id"
}
```

### Transfer Management

#### Create Transfer Request
```http
POST /api/transfers
{
    "student": "student_id",
    "session": "session_id",
    "requestType": "transfer_out",
    "transferTo": {
        "schoolName": "Delhi Public School",
        "schoolAddress": "Delhi",
        "city": "Delhi",
        "state": "Delhi",
        "reason": "Parent job transfer"
    },
    "tcDetails": {
        "lastAttendanceDate": "2026-02-14",
        "conduct": "Good",
        "feesStatus": "paid"
    }
}
```

#### Approve Transfer
```http
POST /api/transfers/:id/approve
```

#### Get Transfer Certificate
```http
GET /api/transfers/:id/certificate
```

### Reports

#### Session Statistics
```http
GET /api/sessions/:id/statistics
```

Response:
```json
{
    "statistics": {
        "totalStudents": 2847,
        "active": 2800,
        "promoted": 2650,
        "detained": 150,
        "graduated": 550,
        "transferred": 47,
        "promotionRate": "95.2%",
        "retentionRate": "98.3%"
    }
}
```

#### Student Progression Report
```http
GET /api/students/:id/progression
```

Response:
```json
{
    "student": {...},
    "progression": [
        {
            "session": "2023-2024",
            "class": "Class 8",
            "section": "A",
            "attendance": 95,
            "performance": 82,
            "grade": "A",
            "status": "promoted"
        },
        {
            "session": "2024-2025",
            "class": "Class 9",
            "section": "A",
            "attendance": 93,
            "performance": 85,
            "grade": "A",
            "status": "promoted"
        }
    ]
}
```

---

## 🎯 Use Cases

### Use Case 1: Annual Promotion (End of Year)

**Scenario:** Promote all Class 9 students to Class 10

**Steps:**
1. Create new session "2026-2027"
2. Set as current session
3. Go to Promotion Wizard
4. Select: Class 9 → Class 10
5. Set criteria: 75% attendance, 40% marks
6. Load students
7. Select eligible students
8. Execute bulk promotion
9. Review detained students
10. Manually handle special cases

**Result:** 
- Eligible students promoted
- Detained students stay in Class 9
- Academic history updated

---

### Use Case 2: Mid-Year Transfer

**Scenario:** Student moving to another city

**Steps:**
1. Create transfer request
2. Fill transfer details
3. Check fee clearance
4. Get admin approval
5. Generate TC
6. Update student status
7. Hand over TC to parent

**Result:**
- TC issued with unique number
- Student marked as "transferred"
- Complete academic records preserved

---

### Use Case 3: Class 12 Graduation

**Scenario:** Final year students completing school

**Steps:**
1. Verify all exam results
2. Check fee clearance
3. Select graduating students
4. Execute graduation
5. Generate completion certificates
6. Update to alumni status

**Result:**
- Students marked as "graduated"
- Eligible for alumni services
- Can request documents anytime

---

## 📋 Best Practices

### 1. Session Management
- ✅ Create next session 2-3 months before current ends
- ✅ Complete all promotions before activating new session
- ✅ Archive old sessions after 2 years
- ✅ Backup data before session closure

### 2. Promotion
- ✅ Set clear promotion criteria
- ✅ Review detained students individually
- ✅ Allow grace period for improvement
- ✅ Communicate with parents beforehand
- ✅ Maintain detailed records

### 3. Transfer
- ✅ Verify fee clearance before approval
- ✅ Generate TC within 7 days
- ✅ Keep copies of all TCs issued
- ✅ Update records immediately
- ✅ Send TC copy to new school if requested

### 4. Data Management
- ✅ Regular backups
- ✅ Archive old session data
- ✅ Maintain audit logs
- ✅ Verify data integrity periodically

---

## 🔧 Admin Tasks

### Start of Academic Year
- [ ] Create new academic session
- [ ] Set admission dates
- [ ] Prepare class structures
- [ ] Assign class teachers
- [ ] Set fee structure
- [ ] Activate new session

### End of Academic Year
- [ ] Complete all examinations
- [ ] Enter all results
- [ ] Mark attendance records complete
- [ ] Clear pending fees
- [ ] Process promotions
- [ ] Handle detentions
- [ ] Generate annual reports
- [ ] Close session

### Mid-Year Tasks
- [ ] Process transfer requests
- [ ] Update student records
- [ ] Handle new admissions
- [ ] Monitor attendance
- [ ] Track performance
- [ ] Address parent queries

---

## 📊 Reports Available

### 1. Session Summary Report
- Total students
- Promotion statistics
- Detention analysis
- Transfer summary
- Graduation count

### 2. Class-wise Report
- Strength (current vs capacity)
- Promotion rate
- Average performance
- Attendance patterns
- Teacher effectiveness

### 3. Student Progression Report
- Year-over-year performance
- Attendance trends
- Grade progression
- Complete academic journey

### 4. Transfer Report
- Monthly transfer count
- Reason analysis
- Destination schools
- TC issued count

---

## 🚨 Important Notes

### ⚠️ Critical Operations

**Cannot be Undone:**
- Closing an academic session
- Graduating students
- Issuing Transfer Certificate

**Require Approval:**
- Bulk promotions (>10 students)
- Transfer requests
- Session closure
- Data deletion

**Must be Verified:**
- Fee clearance before TC
- Result completion before promotion
- Attendance records before graduation

---

## 💡 Tips & Tricks

### 1. Quick Promotion
- Use "Select Eligible" to auto-select
- Set realistic criteria
- Review edge cases manually

### 2. Detention Management
- Create improvement plans
- Set review dates
- Track progress
- Allow re-evaluation

### 3. Transfer Processing
- Maintain checklist
- Verify documents
- Clear all dues
- Issue TC promptly

### 4. Record Keeping
- Export reports regularly
- Backup before major operations
- Maintain paper copies of TCs
- Archive old session data

---

## 🆘 Troubleshooting

**Problem:** Students not appearing in promotion list
**Solution:** Check if they're assigned to correct class and session

**Problem:** Cannot close session
**Solution:** Ensure all students are promoted/transferred/graduated

**Problem:** TC generation failing
**Solution:** Verify transfer request is approved and fee clearance done

**Problem:** Promotion criteria not working
**Solution:** Check if attendance and result data is complete

---

**You now have complete control over academic sessions, student promotions, and transfers! 🎓**
