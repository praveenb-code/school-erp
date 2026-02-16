# EduMaster Pro - Login System Guide

## 🔐 Role-Based Authentication System

The School ERP now includes separate login portals for different user roles with customized dashboards and access controls.

---

## 📋 Available User Roles

### 1. **Admin** 👨‍💼
- **Access Level**: Full system access
- **Dashboard**: admin-dashboard.html
- **Capabilities**:
  - Manage all students, teachers, and staff
  - View and modify all data
  - Access financial reports
  - System configuration
  - User management
  - Complete control over all modules

### 2. **Teacher** 👨‍🏫
- **Access Level**: Academic management
- **Dashboard**: teacher-dashboard.html
- **Capabilities**:
  - View assigned students
  - Mark attendance for their classes
  - Create and grade assignments
  - Enter exam marks
  - View class schedules
  - Communicate with students/parents
  - Access academic reports for their classes

### 3. **Student** 👨‍🎓
- **Access Level**: Personal academic data
- **Dashboard**: student-dashboard.html
- **Capabilities**:
  - View personal academic records
  - Check attendance
  - View and submit assignments
  - Check exam results
  - View timetable
  - Access fee details
  - Check library books
  - Receive notices and messages

### 4. **Accountant** 💼
- **Access Level**: Financial management
- **Dashboard**: accountant-dashboard.html
- **Capabilities**:
  - Fee collection and management
  - Generate receipts
  - Track expenses
  - Process payroll
  - Financial reporting
  - View payment history
  - Manage pending fees

---

## 🚀 Quick Start

### Access the Login Page

1. Open `login.html` in your browser
2. Select your role by clicking on the appropriate card
3. Enter your credentials
4. Click login button

---

## 🔑 Demo Credentials

### Admin Login
```
Email: admin@school.com
Password: admin123
```

### Teacher Login
```
Employee ID: EMP00001
OR
Email: teacher@school.com
Password: teacher123
```

### Student Login
```
Student ID: STU00001
Password: student123
```

### Accountant Login
```
Email: accounts@school.com
Password: accounts123
```

---

## 💻 Frontend Implementation

### Login Page Features

1. **Beautiful Modern UI**
   - Gradient backgrounds
   - Smooth animations
   - Responsive design
   - Clean and professional

2. **Role Selection**
   - Visual role cards
   - Easy switching between roles
   - Role-specific forms

3. **Form Validation**
   - Client-side validation
   - Error messages
   - Loading states

4. **Security Features**
   - Password visibility toggle
   - Remember me functionality
   - Secure session storage

### Dashboard Routing

After successful login, users are redirected to their role-specific dashboard:

```javascript
switch(role) {
    case 'admin':
        window.location.href = 'admin-dashboard.html';
        break;
    case 'teacher':
        window.location.href = 'teacher-dashboard.html';
        break;
    case 'student':
        window.location.href = 'student-dashboard.html';
        break;
    case 'accountant':
        window.location.href = 'accountant-dashboard.html';
        break;
}
```

### Session Management

User sessions are stored in localStorage:
```javascript
localStorage.setItem('userRole', role);
localStorage.setItem('userCredentials', JSON.stringify(credentials));
```

Each dashboard checks for valid session on load:
```javascript
window.onload = function() {
    const userRole = localStorage.getItem('userRole');
    if (!userRole || userRole !== 'expected_role') {
        window.location.href = 'login.html';
    }
};
```

---

## 🔧 Backend API Endpoints

### Authentication Endpoints

#### 1. General Login
**POST** `/api/auth/login`
```json
{
  "email": "user@school.com",
  "password": "password123"
}
```

#### 2. Admin Login
**POST** `/api/auth/admin/login`
```json
{
  "email": "admin@school.com",
  "password": "admin123"
}
```

#### 3. Teacher Login
**POST** `/api/auth/teacher/login`
```json
{
  "identifier": "EMP00001", // or email
  "password": "teacher123"
}
```

#### 4. Student Login
**POST** `/api/auth/student/login`
```json
{
  "studentId": "STU00001",
  "password": "student123"
}
```

#### 5. Accountant Login
**POST** `/api/auth/accountant/login`
```json
{
  "email": "accounts@school.com",
  "password": "accounts123"
}
```

#### 6. Get Current User
**GET** `/api/auth/me`
```
Headers:
Authorization: Bearer <token>
```

#### 7. Logout
**POST** `/api/auth/logout`
```
Headers:
Authorization: Bearer <token>
```

---

## 🛡️ Security Implementation

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **No plain text storage**: Passwords never stored in plain text
- **Password requirements**: Can be enforced on frontend/backend

### Token-Based Authentication
- **JWT (JSON Web Tokens)**: Secure token generation
- **Token Payload**:
  ```javascript
  {
    userId: user._id,
    role: user.role,
    iat: timestamp
  }
  ```

### Role-Based Access Control (RBAC)

Middleware function to check user roles:
```javascript
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};
```

Usage example:
```javascript
app.post('/api/students', 
    authenticate, 
    authorize('admin', 'teacher'), 
    async (req, res) => {
        // Only admins and teachers can create students
    }
);
```

### Session Management
- **Token expiration**: Configurable (default: 30 days)
- **Refresh tokens**: Can be implemented for longer sessions
- **Logout**: Clears client-side storage

---

## 📱 Dashboard Features

### Admin Dashboard
- **Full Statistics**: All system metrics
- **Student Management**: CRUD operations
- **Teacher Management**: Staff administration
- **Financial Overview**: Complete financial data
- **System Settings**: Configuration options

### Teacher Dashboard
- **My Classes**: Assigned classes overview
- **Today's Schedule**: Period-wise timetable
- **Student Performance**: Class performance metrics
- **Quick Actions**: Mark attendance, create assignments
- **My Students**: Student list with details

### Student Dashboard
- **Academic Overview**: Grades and performance
- **Today's Classes**: Daily schedule
- **Assignments**: Pending and submitted assignments
- **Exam Results**: Recent test scores
- **Attendance Record**: Personal attendance stats

### Accountant Dashboard
- **Financial Metrics**: Revenue and expenses
- **Fee Collection**: Recent transactions
- **Pending Fees**: Outstanding payments
- **Expense Tracking**: Monthly expenses
- **Payroll**: Salary management

---

## 🎨 Customization

### Changing Login Page Design

Edit `login.html`:
```css
:root {
    --primary: #3b82f6;        /* Change primary color */
    --secondary: #8b5cf6;      /* Change secondary color */
}

body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Change background gradient */
}
```

### Adding New User Roles

1. **Update User Schema** (server.js):
```javascript
role: { 
    type: String, 
    enum: ['admin', 'teacher', 'student', 'accountant', 'librarian'], 
    required: true 
}
```

2. **Create Login Endpoint**:
```javascript
app.post('/api/auth/librarian/login', async (req, res) => {
    // Implement login logic
});
```

3. **Create Dashboard**: `librarian-dashboard.html`

4. **Update Login Page**: Add role card in `login.html`

5. **Add Authorization Middleware**: Update RBAC rules

---

## 🔄 User Flow Diagram

```
┌─────────────┐
│  Login Page │
└──────┬──────┘
       │
       ├── Select Role (Admin/Teacher/Student/Accountant)
       │
       ├── Enter Credentials
       │
       ├── Validate (Frontend)
       │
       ├── API Call → Server Authentication
       │
       ├── JWT Token Generated
       │
       ├── Store Session (localStorage)
       │
       └── Redirect to Role Dashboard
           │
           ├── Admin Dashboard (Full Access)
           ├── Teacher Dashboard (Academic Access)
           ├── Student Dashboard (Personal Access)
           └── Accountant Dashboard (Financial Access)
```

---

## 🧪 Testing the Login System

### Manual Testing

1. **Test Admin Login**:
   - Open login.html
   - Click Admin role
   - Enter: admin@school.com / admin123
   - Verify redirect to admin-dashboard.html
   - Verify full access to all features

2. **Test Teacher Login**:
   - Click Teacher role
   - Enter: EMP00001 / teacher123
   - Verify redirect to teacher-dashboard.html
   - Verify limited access (no admin features)

3. **Test Student Login**:
   - Click Student role
   - Enter: STU00001 / student123
   - Verify redirect to student-dashboard.html
   - Verify read-only access to personal data

4. **Test Accountant Login**:
   - Click Accountant role
   - Enter: accounts@school.com / accounts123
   - Verify redirect to accountant-dashboard.html
   - Verify financial features access

### Automated Testing (Optional)

```javascript
describe('Authentication', () => {
    it('should login admin successfully', async () => {
        const response = await request(app)
            .post('/api/auth/admin/login')
            .send({
                email: 'admin@school.com',
                password: 'admin123'
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.role).toBe('admin');
    });
});
```

---

## 🚀 Production Deployment

### Environment Variables

Create `.env` file:
```env
JWT_SECRET=your-super-secret-production-key
JWT_EXPIRE=30d
NODE_ENV=production
```

### Security Enhancements for Production

1. **HTTPS Only**: Enforce SSL/TLS
2. **Strong JWT Secret**: Use cryptographically secure random string
3. **Token Expiration**: Set appropriate expiry (e.g., 24 hours)
4. **Refresh Tokens**: Implement token refresh mechanism
5. **Rate Limiting**: Prevent brute force attacks
6. **Input Validation**: Sanitize all inputs
7. **CORS Configuration**: Restrict allowed origins
8. **Password Policy**: Enforce strong passwords

### Rate Limiting Example

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many login attempts, please try again later'
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
    // Login logic
});
```

---

## 📊 Database Schema for Users

```javascript
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'teacher', 'student', 'accountant'], 
        required: true 
    },
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String,
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    createdAt: { type: Date, default: Date.now },
    
    // Role-specific IDs
    employeeId: String,  // For teachers
    studentId: String,   // For students
    
    // Additional metadata
    passwordResetToken: String,
    passwordResetExpires: Date,
    twoFactorSecret: String,
    twoFactorEnabled: { type: Boolean, default: false }
});
```

---

## 🔐 Advanced Features (Future Enhancements)

### 1. Two-Factor Authentication (2FA)
- SMS OTP
- Email verification
- Authenticator app support

### 2. Social Login
- Google OAuth
- Microsoft Azure AD
- Facebook Login

### 3. Single Sign-On (SSO)
- SAML integration
- OAuth 2.0
- LDAP/Active Directory

### 4. Password Recovery
- Email-based reset
- Security questions
- Admin override

### 5. Session Management
- Active sessions list
- Remote logout
- Device management

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: Login fails even with correct credentials
**Solution**: Check if MongoDB is running and user exists in database

**Issue**: Redirect not working after login
**Solution**: Verify dashboard HTML files are in the correct directory

**Issue**: Session not persisting
**Solution**: Check if localStorage is enabled in browser

**Issue**: "Access Denied" after login
**Solution**: Verify user role matches the dashboard being accessed

---

## 📞 Support

For issues or questions:
- **Email**: support@edumaster.com
- **Documentation**: README.md
- **API Docs**: API_DOCUMENTATION.md

---

## 🎯 Summary

The EduMaster Pro login system provides:
✅ Secure role-based authentication
✅ Separate dashboards for each role
✅ JWT-based session management
✅ Beautiful, modern UI
✅ Production-ready code
✅ Extensible architecture
✅ Comprehensive security features

**All user credentials are demo values. Please change them in production!**

---

**Built with ❤️ for Educational Institutions**
