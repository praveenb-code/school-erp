# Dynamic Role & Permission Management System

## 🎯 Overview

The EduMaster Pro now includes a **fully dynamic role and permission management system** that allows you to:
- Create unlimited custom roles
- Define granular permissions for each module
- Assign specific access levels to any user
- Manage permissions at both role and individual user levels

---

## 🚀 Key Features

### ✅ Unlimited Custom Roles
Create as many roles as you need:
- Librarian
- Sports Coach
- Lab Assistant
- Counselor
- Security Manager
- Hostel Warden
- Transport Manager
- Any role you can imagine!

### ✅ Granular Permissions
Control access at module and action level:
- **Modules**: Students, Teachers, Fees, Library, Transport, etc.
- **Actions**: Create, Read, Update, Delete, Manage, View Own, View All

### ✅ Permission Inheritance
- Users inherit permissions from their role
- Additional permissions can be granted to specific users
- Flexible override system

### ✅ Visual Role Management
- Beautiful admin interface for managing roles
- Drag-and-drop permission assignment
- Icon and color customization for each role

---

## 📋 Permission Structure

### Permission Modules

```javascript
const modules = [
    'students',      // Student management
    'teachers',      // Teacher management
    'classes',       // Class management
    'subjects',      // Subject management
    'attendance',    // Attendance tracking
    'exams',         // Examination system
    'results',       // Result management
    'fees',          // Fee collection
    'library',       // Library management
    'transport',     // Transport management
    'hostel',        // Hostel management
    'timetable',     // Timetable management
    'notices',       // Notice board
    'events',        // Events management
    'messages',      // Messaging system
    'expenses',      // Expense tracking
    'reports',       // Report generation
    'settings',      // System settings
    'users',         // User management
    'dashboard',     // Dashboard access
    'payroll',       // Salary management
    'inventory',     // Inventory management
    'accounts'       // Accounting
];
```

### Permission Actions

```javascript
const actions = [
    'create',       // Create new records
    'read',         // View records
    'update',       // Edit existing records
    'delete',       // Delete records
    'manage',       // Full management access
    'view_own',     // View only own records
    'view_all'      // View all records
];
```

### Permission Format

Each permission is stored as: `module.action`

Examples:
- `students.read` - Can view students
- `fees.create` - Can create fee records
- `library.manage` - Full library management
- `attendance.view_own` - Can view only own attendance

---

## 🔧 How to Create a New Role

### Step 1: Access Role Management

1. Login as Admin
2. Go to **Settings** or **Role Management**
3. Click **"Create New Role"**

### Step 2: Define Role Details

```javascript
{
    name: "librarian",                    // System name (lowercase, no spaces)
    displayName: "Librarian",             // Display name
    description: "Manages library operations and book inventory",
    icon: "📚",                           // Emoji icon
    color: "#ec4899",                     // Color theme
    priority: 3,                          // Access priority (0-10)
    isActive: true                        // Role status
}
```

### Step 3: Assign Permissions

Select permissions for the role:

**For Librarian Example:**
```javascript
permissions: [
    // Library - Full Access
    'library.create',
    'library.read',
    'library.update',
    'library.delete',
    'library.manage',
    
    // Students - Read Only (to issue books)
    'students.read',
    'students.view_all',
    
    // Reports - Limited Access
    'reports.view_own',
    'reports.generate',
    
    // Dashboard - View Access
    'dashboard.read'
]
```

### Step 4: Save and Activate

Click "Save Role" to create the new role. It will immediately be available for user assignment.

---

## 👥 Example Role Configurations

### 1. Librarian Role

**Access Needs:**
- Manage library books
- Issue/return books
- View student records (read-only)
- Generate library reports

**Permissions:**
```javascript
{
    name: "librarian",
    displayName: "Librarian",
    permissions: [
        'library.manage',
        'students.read',
        'reports.generate',
        'dashboard.read'
    ]
}
```

### 2. Sports Coach Role

**Access Needs:**
- View student information
- Mark sports attendance
- Manage sports events
- View sports-related notices

**Permissions:**
```javascript
{
    name: "sports_coach",
    displayName: "Sports Coach",
    permissions: [
        'students.read',
        'attendance.create',
        'attendance.read',
        'events.create',
        'events.read',
        'events.update',
        'notices.read',
        'dashboard.read'
    ]
}
```

### 3. Lab Assistant Role

**Access Needs:**
- View class schedules
- Manage lab inventory
- View student records
- Create lab reports

**Permissions:**
```javascript
{
    name: "lab_assistant",
    displayName: "Lab Assistant",
    permissions: [
        'classes.read',
        'timetable.read',
        'students.read',
        'inventory.manage',
        'reports.create',
        'reports.read',
        'dashboard.read'
    ]
}
```

### 4. Counselor Role

**Access Needs:**
- View all student records
- View attendance patterns
- View exam results
- Send messages to students/parents
- Access reports

**Permissions:**
```javascript
{
    name: "counselor",
    displayName: "Counselor",
    permissions: [
        'students.read',
        'students.view_all',
        'attendance.read',
        'results.read',
        'messages.create',
        'messages.read',
        'reports.view_all',
        'dashboard.read'
    ]
}
```

### 5. Transport Manager Role

**Access Needs:**
- Manage transport routes
- View student transport details
- Track vehicle maintenance
- Generate transport reports

**Permissions:**
```javascript
{
    name: "transport_manager",
    displayName: "Transport Manager",
    permissions: [
        'transport.manage',
        'students.read',
        'expenses.create',
        'expenses.read',
        'reports.generate',
        'dashboard.read'
    ]
}
```

### 6. Hostel Warden Role

**Access Needs:**
- Manage hostel accommodations
- View hostel student records
- Track hostel fees
- Manage hostel inventory

**Permissions:**
```javascript
{
    name: "hostel_warden",
    displayName: "Hostel Warden",
    permissions: [
        'hostel.manage',
        'students.read',
        'fees.read',
        'inventory.manage',
        'reports.generate',
        'dashboard.read'
    ]
}
```

### 7. Front Office Staff Role

**Access Needs:**
- Basic student information
- Visitor management
- Answer queries
- Limited access to records

**Permissions:**
```javascript
{
    name: "front_office",
    displayName: "Front Office Staff",
    permissions: [
        'students.read',
        'teachers.read',
        'notices.read',
        'events.read',
        'dashboard.read'
    ]
}
```

### 8. Exam Coordinator Role

**Access Needs:**
- Manage examinations
- Enter and publish results
- Generate mark sheets
- View student records

**Permissions:**
```javascript
{
    name: "exam_coordinator",
    displayName: "Exam Coordinator",
    permissions: [
        'exams.manage',
        'results.create',
        'results.read',
        'results.update',
        'students.read',
        'classes.read',
        'subjects.read',
        'reports.generate',
        'dashboard.read'
    ]
}
```

---

## 🔐 API Endpoints

### Role Management

#### Get All Roles
```http
GET /api/roles
Authorization: Bearer <token>
```

#### Get Active Roles (Public)
```http
GET /api/roles/active
```

#### Create Role
```http
POST /api/roles
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "librarian",
    "displayName": "Librarian",
    "description": "Manages library operations",
    "permissions": ["library.manage", "students.read"],
    "icon": "📚",
    "color": "#ec4899",
    "priority": 3,
    "isActive": true
}
```

#### Update Role
```http
PUT /api/roles/:roleId
Authorization: Bearer <token>
Content-Type: application/json

{
    "displayName": "Senior Librarian",
    "permissions": ["library.manage", "students.read", "reports.generate"]
}
```

#### Delete Role
```http
DELETE /api/roles/:roleId
Authorization: Bearer <token>
```

#### Duplicate Role
```http
POST /api/roles/:roleId/duplicate
Authorization: Bearer <token>
```

### Permission Management

#### Get All Permissions
```http
GET /api/permissions
Authorization: Bearer <token>
```

#### Get Permissions by Module
```http
GET /api/permissions/module/library
Authorization: Bearer <token>
```

#### Create Permission
```http
POST /api/permissions
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Issue Books",
    "code": "library.issue",
    "description": "Can issue books to students",
    "module": "library",
    "action": "create"
}
```

#### Bulk Create Permissions
```http
POST /api/permissions/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
    "permissions": [
        {
            "name": "View Students",
            "code": "students.read",
            "module": "students",
            "action": "read"
        },
        {
            "name": "Create Students",
            "code": "students.create",
            "module": "students",
            "action": "create"
        }
    ]
}
```

### User Management with Roles

#### Create User with Role
```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
    "email": "librarian@school.com",
    "password": "securePassword123",
    "roleId": "65abc123...",
    "firstName": "Ramesh",
    "lastName": "Kumar",
    "employeeId": "LIB001"
}
```

#### Assign Additional Permissions to User
```http
POST /api/users/:userId/permissions
Authorization: Bearer <token>
Content-Type: application/json

{
    "permissionIds": ["65def456...", "65def789..."]
}
```

#### Login with Role
```http
POST /api/auth/login
Content-Type: application/json

{
    "identifier": "librarian@school.com",
    "password": "securePassword123",
    "roleId": "65abc123..."  // Optional: verify role
}
```

---

## 🎨 Frontend Integration

### Dynamic Login Page

The login page automatically loads all active roles:

```javascript
// Fetch active roles from API
fetch('/api/roles/active')
    .then(response => response.json())
    .then(roles => {
        // Render role selection cards
        roles.forEach(role => {
            renderRoleCard(role);
        });
    });

function renderRoleCard(role) {
    return `
        <div class="role-card" data-role-id="${role._id}">
            <div class="role-icon">${role.icon}</div>
            <h4>${role.displayName}</h4>
            <p>${role.description}</p>
        </div>
    `;
}
```

### Permission Checking in Frontend

```javascript
// Check if user has permission
async function hasPermission(permission) {
    const response = await fetch('/api/auth/check-permission', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permission })
    });
    
    const data = await response.json();
    return data.hasPermission;
}

// Usage
if (await hasPermission('students.create')) {
    showAddStudentButton();
}
```

### Conditional UI Rendering

```javascript
// Show/hide elements based on permissions
const userPermissions = JSON.parse(localStorage.getItem('permissions'));

if (userPermissions.includes('fees.create')) {
    document.getElementById('addFeeButton').style.display = 'block';
}

if (userPermissions.includes('reports.generate')) {
    document.getElementById('reportsMenu').style.display = 'block';
}
```

---

## 🔒 Backend Permission Middleware

### Using Permission Middleware

```javascript
const express = require('express');
const router = express.Router();

// Require specific permission
router.get('/students', 
    authenticate, 
    checkPermission('students.read'), 
    async (req, res) => {
        // Only users with 'students.read' permission can access
        const students = await Student.find();
        res.json(students);
    }
);

// Require multiple permissions (any)
router.post('/fees', 
    authenticate, 
    checkPermission('fees.create'), 
    async (req, res) => {
        // Only users with 'fees.create' permission
        const fee = new Fee(req.body);
        await fee.save();
        res.json(fee);
    }
);
```

### Custom Permission Logic

```javascript
// Check if user can view specific resource
router.get('/students/:id', authenticate, async (req, res) => {
    const user = req.user;
    const studentId = req.params.id;
    
    // Check permissions
    const hasViewAll = await checkUserPermission(user, 'students.view_all');
    const hasViewOwn = await checkUserPermission(user, 'students.view_own');
    
    if (hasViewAll) {
        // Can view any student
        const student = await Student.findById(studentId);
        return res.json(student);
    }
    
    if (hasViewOwn) {
        // Can only view own record
        if (user.studentId === studentId) {
            const student = await Student.findById(studentId);
            return res.json(student);
        }
        return res.status(403).json({ error: 'Can only view your own record' });
    }
    
    return res.status(403).json({ error: 'Permission denied' });
});
```

---

## 📊 Database Schema

### Permission Schema
```javascript
{
    name: "View Students",
    code: "students.read",
    description: "Can view student records",
    module: "students",
    action: "read",
    createdAt: Date
}
```

### Role Schema
```javascript
{
    name: "librarian",
    displayName: "Librarian",
    description: "Manages library operations",
    permissions: [ObjectId, ObjectId, ...],
    isSystem: false,
    isActive: true,
    icon: "📚",
    color: "#ec4899",
    priority: 3,
    createdBy: ObjectId,
    createdAt: Date,
    updatedAt: Date
}
```

### User Schema
```javascript
{
    email: "librarian@school.com",
    password: "hashed_password",
    role: ObjectId,  // Reference to Role
    firstName: "Ramesh",
    lastName: "Kumar",
    additionalPermissions: [ObjectId, ObjectId, ...],
    isActive: true,
    lastLogin: Date,
    createdAt: Date
}
```

---

## 🚀 Quick Setup Guide

### 1. Initialize Permissions

Run this once to create all system permissions:

```javascript
POST /api/permissions/bulk
{
    "permissions": [
        { "name": "View Students", "code": "students.read", "module": "students", "action": "read" },
        { "name": "Create Students", "code": "students.create", "module": "students", "action": "create" },
        // ... add all permissions
    ]
}
```

### 2. Create System Roles

Create the default roles (Admin, Teacher, Student, Accountant):

```javascript
POST /api/roles
{
    "name": "admin",
    "displayName": "Administrator",
    "permissions": [/* all permission IDs */],
    "isSystem": true,
    "icon": "👨‍💼",
    "color": "#3b82f6"
}
```

### 3. Create Custom Roles

Add any custom roles your school needs:

```javascript
POST /api/roles
{
    "name": "librarian",
    "displayName": "Librarian",
    "permissions": [/* library-related permission IDs */],
    "icon": "📚",
    "color": "#ec4899"
}
```

### 4. Create Users

Assign roles to users:

```javascript
POST /api/users
{
    "email": "librarian@school.com",
    "password": "password123",
    "roleId": "role_id_here",
    "firstName": "Ramesh",
    "lastName": "Kumar"
}
```

---

## 🎯 Best Practices

### 1. Role Naming
- Use lowercase with underscores: `sports_coach`, `lab_assistant`
- Keep it descriptive and consistent
- Avoid special characters

### 2. Permission Granularity
- Start with broader permissions
- Add specific permissions as needed
- Group related permissions together

### 3. Priority Levels
- 10: Super Admin (full access)
- 7-9: Senior Management
- 4-6: Department Heads
- 1-3: Staff Members
- 0: Limited Access

### 4. Security
- Never give excessive permissions
- Review permissions regularly
- Use "view_own" instead of "view_all" when possible
- Audit permission changes

### 5. Testing
- Test each role thoroughly
- Verify permission inheritance
- Check edge cases
- Test with real users

---

## 📝 Checklist for Adding New Role

- [ ] Identify what access the role needs
- [ ] List all required modules
- [ ] Define specific actions for each module
- [ ] Choose appropriate icon and color
- [ ] Set priority level
- [ ] Create role via admin interface
- [ ] Assign permissions
- [ ] Test with dummy user
- [ ] Verify all features work correctly
- [ ] Document the role configuration
- [ ] Train users on their new role

---

## 🆘 Troubleshooting

**Problem**: Role not appearing on login page
**Solution**: Check if `isActive` is set to `true`

**Problem**: User can't access feature despite having role
**Solution**: Verify permissions are correctly assigned to the role

**Problem**: Permission changes not reflecting
**Solution**: User needs to logout and login again to get new token

**Problem**: Can't delete role
**Solution**: System roles cannot be deleted. Check `isSystem` flag.

**Problem**: Users complaining about insufficient access
**Solution**: Review their role permissions and add missing permissions

---

## 📞 Support

For help with role management:
- Check API_DOCUMENTATION.md for API details
- See LOGIN_GUIDE.md for authentication info
- Contact: support@edumaster.com

---

**Now you have complete control over who can access what in your School ERP! 🎉**
