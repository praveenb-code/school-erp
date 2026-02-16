# EduMaster Pro - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication. Include JWT token in the header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "admin",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91-9876543210"
}
```

**Response:**
```json
{
  "user": {
    "_id": "65abc123...",
    "email": "user@example.com",
    "role": "admin",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "_id": "65abc123...",
    "email": "user@example.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. Student Endpoints

### Get All Students
**GET** `/students`

**Query Parameters:**
- `class` - Filter by class ID
- `section` - Filter by section (A, B, C, etc.)
- `status` - Filter by status (active, inactive, graduated)
- `search` - Search by name or student ID

**Example:**
```
GET /api/students?class=65abc123&section=A&status=active
```

**Response:**
```json
[
  {
    "_id": "65abc456...",
    "studentId": "STU00001",
    "firstName": "Aarav",
    "lastName": "Sharma",
    "class": {
      "_id": "65abc123...",
      "name": "Class 10",
      "section": "A"
    },
    "rollNumber": 1,
    "guardian": {
      "name": "Rajesh Sharma",
      "phone": "+91-9876543210"
    },
    "status": "active"
  }
]
```

### Get Student by ID
**GET** `/students/:id`

**Response:**
```json
{
  "_id": "65abc456...",
  "studentId": "STU00001",
  "firstName": "Aarav",
  "lastName": "Sharma",
  "dateOfBirth": "2008-05-15",
  "gender": "male",
  "bloodGroup": "O+",
  "class": {...},
  "section": "A",
  "rollNumber": 1,
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "guardian": {
    "name": "Rajesh Sharma",
    "phone": "+91-9876543210",
    "email": "rajesh@example.com"
  },
  "photo": "uploads/students/1234567890.jpg",
  "status": "active"
}
```

### Create Student
**POST** `/students`

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
- `firstName` (required)
- `lastName` (required)
- `dateOfBirth`
- `gender`
- `class` (required)
- `section`
- `bloodGroup`
- `address`
- `guardian.name`
- `guardian.phone`
- `guardian.email`
- `photo` (file)

**Response:**
```json
{
  "_id": "65abc789...",
  "studentId": "STU00002",
  "firstName": "Diya",
  "lastName": "Patel",
  ...
}
```

### Update Student
**PUT** `/students/:id`

**Request Body:** (Same as Create Student)

### Delete Student
**DELETE** `/students/:id`

**Response:**
```json
{
  "message": "Student deleted successfully"
}
```

---

## 3. Teacher Endpoints

### Get All Teachers
**GET** `/teachers`

**Response:**
```json
[
  {
    "_id": "65abc789...",
    "employeeId": "EMP00001",
    "firstName": "Dr. Priya",
    "lastName": "Verma",
    "email": "priya@school.com",
    "phone": "+91-9876543211",
    "designation": "Senior Teacher",
    "subjects": [...],
    "classes": [...],
    "status": "active"
  }
]
```

### Create Teacher
**POST** `/teachers`

**Request Body:**
```json
{
  "firstName": "Dr. Priya",
  "lastName": "Verma",
  "email": "priya@school.com",
  "phone": "+91-9876543211",
  "dateOfBirth": "1985-03-20",
  "designation": "Senior Teacher",
  "qualification": "M.Sc Physics, B.Ed",
  "subjects": ["65abc123..."],
  "joiningDate": "2020-07-01",
  "salary": 50000
}
```

---

## 4. Attendance Endpoints

### Mark Attendance
**POST** `/attendance`

**Request Body:**
```json
{
  "student": "65abc456...",
  "class": "65abc123...",
  "date": "2025-02-16",
  "status": "present",
  "remarks": "On time"
}
```

### Mark Bulk Attendance
**POST** `/attendance/bulk`

**Request Body:**
```json
{
  "class": "65abc123...",
  "date": "2025-02-16",
  "attendance": [
    {
      "student": "65abc456...",
      "status": "present"
    },
    {
      "student": "65abc457...",
      "status": "absent",
      "remarks": "Sick leave"
    }
  ]
}
```

### Get Attendance
**GET** `/attendance`

**Query Parameters:**
- `student` - Student ID
- `class` - Class ID
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

**Example:**
```
GET /api/attendance?student=65abc456&startDate=2025-02-01&endDate=2025-02-16
```

**Response:**
```json
[
  {
    "_id": "65abc890...",
    "student": {
      "studentId": "STU00001",
      "firstName": "Aarav"
    },
    "date": "2025-02-16",
    "status": "present",
    "markedBy": {...}
  }
]
```

---

## 5. Fee Management Endpoints

### Create Fee
**POST** `/fees`

**Request Body:**
```json
{
  "student": "65abc456...",
  "academicYear": "2025-2026",
  "feeType": "tuition",
  "amount": 50000,
  "dueDate": "2025-04-30"
}
```

### Get Fees
**GET** `/fees`

**Query Parameters:**
- `student` - Student ID
- `status` - pending, paid, overdue, partial
- `academicYear` - Academic year

### Process Fee Payment
**POST** `/fees/:id/pay`

**Request Body:**
```json
{
  "amount": 50000,
  "paymentMethod": "online",
  "transactionId": "TXN123456"
}
```

**Response:**
```json
{
  "_id": "65abc901...",
  "student": "65abc456...",
  "amount": 50000,
  "paidAmount": 50000,
  "status": "paid",
  "receiptNumber": "RCT1708080000000",
  "paidDate": "2025-02-16"
}
```

---

## 6. Exam & Result Endpoints

### Create Exam
**POST** `/exams`

**Request Body:**
```json
{
  "name": "Midterm Examination",
  "type": "midterm",
  "subject": "65abc234...",
  "class": "65abc123...",
  "date": "2025-03-15",
  "duration": 180,
  "totalMarks": 100,
  "passingMarks": 40
}
```

### Get Exams
**GET** `/exams`

**Response:**
```json
[
  {
    "_id": "65abc912...",
    "name": "Midterm Examination",
    "type": "midterm",
    "subject": {
      "name": "Mathematics",
      "code": "MATH101"
    },
    "class": {...},
    "date": "2025-03-15",
    "totalMarks": 100
  }
]
```

### Submit Results
**POST** `/results`

**Request Body:**
```json
{
  "student": "65abc456...",
  "exam": "65abc912...",
  "marksObtained": 85,
  "grade": "A",
  "remarks": "Excellent performance"
}
```

### Get Results
**GET** `/results`

**Query Parameters:**
- `student` - Student ID
- `exam` - Exam ID
- `class` - Class ID

---

## 7. Library Endpoints

### Add Book
**POST** `/library/books`

**Request Body:**
```json
{
  "title": "Introduction to Physics",
  "author": "Dr. Smith",
  "isbn": "978-3-16-148410-0",
  "publisher": "Education Press",
  "category": "Science",
  "quantity": 10
}
```

### Get All Books
**GET** `/library/books`

**Query Parameters:**
- `category` - Filter by category
- `search` - Search by title/author

### Issue Book
**POST** `/library/issue`

**Request Body:**
```json
{
  "book": "65abc923...",
  "student": "65abc456..."
}
```

### Return Book
**POST** `/library/return/:issueId`

**Response:**
```json
{
  "_id": "65abc934...",
  "book": {...},
  "student": {...},
  "issueDate": "2025-02-01",
  "returnDate": "2025-02-16",
  "fine": 0,
  "status": "returned"
}
```

---

## 8. Class Management Endpoints

### Get All Classes
**GET** `/classes`

**Response:**
```json
[
  {
    "_id": "65abc123...",
    "name": "Class 10",
    "grade": 10,
    "section": "A",
    "classTeacher": {
      "firstName": "Dr. Priya",
      "lastName": "Verma"
    },
    "room": "201",
    "capacity": 40,
    "students": [...]
  }
]
```

### Create Class
**POST** `/classes`

**Request Body:**
```json
{
  "name": "Class 10",
  "grade": 10,
  "section": "A",
  "classTeacher": "65abc789...",
  "room": "201",
  "capacity": 40,
  "academicYear": "2025-2026"
}
```

---

## 9. Subject Endpoints

### Get All Subjects
**GET** `/subjects`

### Create Subject
**POST** `/subjects`

**Request Body:**
```json
{
  "name": "Mathematics",
  "code": "MATH101",
  "grade": 10,
  "teacher": "65abc789...",
  "type": "core",
  "credits": 4
}
```

---

## 10. Notice Board Endpoints

### Get Notices
**GET** `/notices`

**Response:**
```json
[
  {
    "_id": "65abc945...",
    "title": "Winter Vacation Notice",
    "content": "School will be closed from...",
    "category": "holiday",
    "targetAudience": ["all"],
    "publishedAt": "2025-02-15",
    "expiryDate": "2025-03-01"
  }
]
```

### Create Notice
**POST** `/notices`

**Request Body:**
```json
{
  "title": "Winter Vacation Notice",
  "content": "School will be closed from December 20 to January 5",
  "category": "holiday",
  "targetAudience": ["all"],
  "expiryDate": "2025-03-01"
}
```

---

## 11. Events Endpoints

### Get Events
**GET** `/events`

### Create Event
**POST** `/events`

**Request Body:**
```json
{
  "title": "Annual Sports Day",
  "description": "Inter-school sports competition",
  "eventType": "sports",
  "startDate": "2025-03-20",
  "endDate": "2025-03-22",
  "location": "School Ground",
  "organizer": "65abc789..."
}
```

---

## 12. Messaging Endpoints

### Get Messages
**GET** `/messages`

**Response:**
```json
[
  {
    "_id": "65abc956...",
    "sender": {...},
    "recipient": {...},
    "subject": "Parent-Teacher Meeting",
    "content": "The meeting is scheduled for...",
    "isRead": false,
    "sentAt": "2025-02-16T10:30:00Z"
  }
]
```

### Send Message
**POST** `/messages`

**Request Body:**
```json
{
  "recipient": "65abc789...",
  "subject": "Parent-Teacher Meeting",
  "content": "The meeting is scheduled for next week."
}
```

---

## 13. Dashboard Endpoints

### Get Dashboard Stats
**GET** `/dashboard/stats`

**Response:**
```json
{
  "totalStudents": 2847,
  "totalTeachers": 156,
  "totalClasses": 45,
  "attendanceRate": "95.8",
  "feeCollected": 4520000,
  "pendingFees": 850000
}
```

---

## 14. Timetable Endpoints

### Get Timetable
**GET** `/timetable?classId=65abc123`

**Response:**
```json
[
  {
    "class": {...},
    "day": "monday",
    "periods": [
      {
        "periodNumber": 1,
        "startTime": "08:00",
        "endTime": "08:45",
        "subject": {
          "name": "Mathematics"
        },
        "teacher": {
          "firstName": "Dr. Priya"
        },
        "room": "201"
      }
    ]
  }
]
```

### Create Timetable
**POST** `/timetable`

---

## 15. Transport Endpoints

### Get Routes
**GET** `/transport`

### Create Route
**POST** `/transport`

**Request Body:**
```json
{
  "routeNumber": "R01",
  "routeName": "North Route",
  "vehicleNumber": "MH-12-AB-1234",
  "driverName": "Ramesh Kumar",
  "driverPhone": "+91-9876543220",
  "capacity": 40,
  "stops": [
    {
      "name": "Main Gate",
      "time": "07:00",
      "fee": 2000
    }
  ]
}
```

---

## 16. Hostel Endpoints

### Get Hostels
**GET** `/hostel`

### Create Hostel
**POST** `/hostel`

---

## 17. Expense Endpoints

### Get Expenses
**GET** `/expenses`

### Create Expense
**POST** `/expenses`

**Request Body:**
```json
{
  "category": "Maintenance",
  "description": "AC repair",
  "amount": 15000,
  "date": "2025-02-16",
  "paymentMethod": "bank transfer",
  "vendor": "Cool Air Services",
  "invoiceNumber": "INV-2025-123"
}
```

---

## Error Responses

All endpoints may return error responses:

**400 Bad Request:**
```json
{
  "error": "Invalid input data"
}
```

**401 Unauthorized:**
```json
{
  "error": "Please authenticate"
}
```

**403 Forbidden:**
```json
{
  "error": "Access denied"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Pagination

For endpoints returning lists, use pagination:

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Example:**
```
GET /api/students?page=2&limit=20
```

**Response Headers:**
```
X-Total-Count: 150
X-Page: 2
X-Per-Page: 20
```

---

## Webhooks (Future)

Configure webhooks to receive real-time notifications:
- Student admission
- Fee payment
- Attendance marked
- Exam results published

---

**For support:** api-support@edumaster.com
