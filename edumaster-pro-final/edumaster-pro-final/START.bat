@echo off
echo ================================
echo   EduMaster Pro - School ERP
echo ================================
echo.

echo Starting MongoDB...
net start MongoDB

echo.
echo Starting Backend Server...
echo.
echo Server will start on: http://localhost:5000
echo.
echo Available HTML Files:
echo - login.html (Start here)
echo - admin-dashboard.html
echo - teacher-dashboard.html
echo - student-dashboard.html
echo.

node server-session-management.js

pause
