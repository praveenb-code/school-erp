# EduMaster Pro - Complete School Management ERP System

A comprehensive, modern, full-stack School Management System with advanced features for managing all aspects of educational institutions.

## 🚀 Features

### Academic Management
- **Student Management**
  - Complete student profiles with photos
  - Admission tracking and management
  - Student ID generation
  - Academic history
  - Medical information tracking
  - Document management
  - Guardian/parent information
  - Student search and filtering

- **Teacher Management**
  - Employee profiles and credentials
  - Qualification tracking
  - Subject and class assignments
  - Salary and payroll integration
  - Performance tracking

- **Class & Section Management**
  - Multi-grade support (K-12)
  - Section-wise student allocation
  - Class teacher assignment
  - Capacity management

- **Subject Management**
  - Core and elective subjects
  - Subject-teacher mapping
  - Credit system
  - Lab management

### Attendance System
- Daily attendance marking
- Bulk attendance entry
- Late arrival tracking
- Half-day marking
- Attendance reports (daily/monthly/yearly)
- SMS/Email notifications for absent students
- Real-time attendance statistics
- Attendance percentage tracking

### Examination & Results
- **Exam Management**
  - Multiple exam types (Midterm, Final, Quiz, Assignment)
  - Exam scheduling
  - Syllabus tracking
  - Duration and marks configuration

- **Result Management**
  - Marks entry and calculation
  - Grade computation
  - Result publishing
  - Report card generation
  - Performance analytics
  - Subject-wise analysis

### Fee Management
- **Fee Structure**
  - Multiple fee types (Tuition, Transport, Hostel, Library, Exam)
  - Academic year-wise fees
  - Custom fee categories
  - Installment support

- **Payment Processing**
  - Online and offline payments
  - Receipt generation
  - Payment history
  - Overdue tracking
  - Fine calculation
  - Fee collection reports
  - Pending fee alerts

### Library Management
- Book cataloging (ISBN, Author, Publisher)
- Book issue and return tracking
- Due date management
- Fine calculation for overdue books
- Book availability status
- Search and filter books
- Student reading history

### Transport Management
- Route management
- Bus/vehicle tracking
- Driver information
- Student route allocation
- Stop-wise fee structure
- Transport fee collection
- Real-time tracking (integration ready)

### Hostel Management
- Hostel allocation
- Room management
- Warden assignment
- Hostel fee tracking
- Facility management
- Student accommodation history

### Timetable Management
- Period-wise timetable
- Subject-teacher-room allocation
- Day-wise scheduling
- Class-specific timetables
- Conflict detection
- Teacher availability tracking

### Communication System
- **Notice Board**
  - Multi-category notices
  - Target audience selection
  - File attachments
  - Expiry management
  - Push notifications

- **Messaging**
  - Internal messaging system
  - Teacher-parent communication
  - Admin announcements
  - Attachments support

- **Events**
  - Event calendar
  - Event creation and management
  - Participant tracking
  - Image gallery
  - Event notifications

### Financial Management
- **Income Tracking**
  - Fee collection monitoring
  - Income reports
  - Category-wise breakdown

- **Expense Management**
  - Expense recording
  - Category management
  - Vendor tracking
  - Invoice management
  - Approval workflow

- **Payroll**
  - Salary calculation
  - Bank details management
  - Salary slips generation
  - Tax computation

### Reports & Analytics
- Student reports
- Attendance reports
- Academic performance reports
- Fee collection reports
- Expense reports
- Custom report generation
- Data export (Excel, PDF)
- Visual analytics with charts

### User Management
- Role-based access control (Admin, Teacher, Student, Parent)
- User authentication and authorization
- Profile management
- Password management
- Activity logs

### Advanced Features
- **Dashboard**
  - Real-time statistics
  - Quick actions
  - Recent activities
  - Alerts and notifications

- **Search & Filter**
  - Global search
  - Advanced filtering
  - Sorting options

- **Data Export**
  - Excel export
  - PDF generation
  - Bulk data operations

- **Notifications**
  - Email notifications
  - SMS integration (ready)
  - In-app notifications
  - Push notifications

- **Multi-language Support** (Ready for implementation)
- **Mobile Responsive Design**
- **Dark/Light Theme** (Extensible)

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive functionality
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Authentication & Security
- **JWT** - JSON Web Tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** (Recommended) - Security headers

### File Management
- **Multer** - File uploads
- **File storage** - Local/Cloud ready

### Additional Libraries
- **Moment.js** (Optional) - Date handling
- **Nodemailer** (Optional) - Email service
- **Chart.js** (Frontend) - Data visualization

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Modern web browser

## ⚙️ Installation

### 1. Clone or Download
```bash
# If using git
git clone <repository-url>
cd school-erp

# Or extract the downloaded files
```

### 2. Install Backend Dependencies
```bash
npm install express mongoose cors bcryptjs jsonwebtoken multer
```

### 3. Create Required Directories
```bash
mkdir uploads
mkdir uploads/students
mkdir uploads/teachers
mkdir uploads/documents
```

### 4. Setup MongoDB
```bash
# Start MongoDB service
mongod

# Or use MongoDB Atlas (cloud)
# Update connection string in server.js
```

### 5. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_erp
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### 6. Start the Server
```bash
node server.js
```

### 7. Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

Or open `school-erp.html` directly in a browser for frontend-only demo.

## 🔐 Default Credentials

After first installation, create an admin user:

```javascript
// Run this in MongoDB or create via API
{
  "email": "admin@school.com",
  "password": "admin123",
  "role": "admin",
  "firstName": "Admin",
  "lastName": "User"
}
```

## 📁 Project Structure

```
school-erp/
├── server.js                 # Backend API server
├── school-erp.html          # Frontend application
├── package.json             # Dependencies
├── .env                     # Environment variables
├── README.md                # Documentation
├── uploads/                 # File uploads
│   ├── students/
│   ├── teachers/
│   └── documents/
└── models/                  # Database models (in server.js)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create new teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance` - Get attendance records

### Fees
- `GET /api/fees` - Get fee records
- `POST /api/fees` - Create fee entry
- `POST /api/fees/:id/pay` - Process payment

### Library
- `POST /api/library/books` - Add book
- `POST /api/library/issue` - Issue book
- `GET /api/library/books` - Get all books

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### And many more endpoints for complete functionality...

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `school-erp.html`:
```css
:root {
    --primary: #2563eb;      /* Primary color */
    --secondary: #10b981;    /* Secondary color */
    --accent: #f59e0b;       /* Accent color */
    /* ... */
}
```

### Adding New Features
1. Add database schema in `server.js`
2. Create API endpoints
3. Update frontend HTML/JS
4. Add navigation menu item

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation
- SQL injection prevention (NoSQL)
- XSS protection (implement with helmet)
- CSRF protection (implement with csurf)

## 📊 Database Schema

### Key Collections
- **users** - System users
- **students** - Student records
- **teachers** - Teacher records
- **classes** - Class information
- **subjects** - Subject data
- **attendance** - Attendance records
- **exams** - Examination details
- **results** - Exam results
- **fees** - Fee management
- **library** - Library books
- **bookissues** - Book transactions
- **transport** - Transport routes
- **hostel** - Hostel information
- **timetable** - Class schedules
- **notices** - Notice board
- **events** - Events calendar
- **expenses** - Expense tracking
- **messages** - Internal messaging

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
```bash
# Set production environment
export NODE_ENV=production

# Use production MongoDB (MongoDB Atlas recommended)
export MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/school_erp
```

2. **Security Enhancements**
- Use strong JWT secret
- Enable HTTPS
- Add rate limiting
- Implement helmet.js
- Enable CORS properly
- Add input sanitization

3. **Cloud Deployment Options**
- **Heroku**: Easy deployment with Git
- **AWS EC2**: Full control
- **DigitalOcean**: Droplets
- **Google Cloud**: App Engine
- **Vercel/Netlify**: Frontend hosting

4. **Database**
- MongoDB Atlas (Recommended)
- Self-hosted MongoDB
- DocumentDB (AWS)

## 📱 Mobile Application

The system is responsive and works on mobile browsers. For native apps:
- React Native wrapper
- Ionic framework
- Flutter integration
- Progressive Web App (PWA)

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb
```

**Port Already in Use**
```bash
# Change port in .env file
PORT=3000
```

**File Upload Issues**
```bash
# Check permissions
chmod 755 uploads/
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support and queries:
- Email: support@edumaster.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

## 🎯 Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered student performance predictions
- [ ] Video conferencing integration
- [ ] Online examination system
- [ ] Assignment submission portal
- [ ] Parent portal
- [ ] Alumni management
- [ ] Multi-school support
- [ ] WhatsApp integration
- [ ] Biometric attendance
- [ ] GPS tracking for buses
- [ ] Online fee payment gateway
- [ ] Automated report card generation
- [ ] SMS gateway integration
- [ ] Email campaign management

## 📸 Screenshots

### Dashboard
[Professional dashboard with real-time statistics]

### Student Management
[Complete student profile and management]

### Attendance System
[Easy attendance marking interface]

### Fee Management
[Comprehensive fee tracking and payment]

## 🌟 Key Highlights

✅ Complete ERP solution
✅ Modern, responsive UI
✅ RESTful API architecture
✅ Role-based access control
✅ Real-time notifications
✅ Comprehensive reporting
✅ Scalable architecture
✅ Production-ready code
✅ Extensive documentation
✅ Easy customization

## 📞 Contact

For enterprise solutions and customization:
- Website: www.edumaster.com
- Email: sales@edumaster.com
- Phone: +91-XXXXXXXXXX

---

**Built with ❤️ for Educational Institutions**

*Making school management simple, efficient, and modern.*
