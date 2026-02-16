#!/bin/bash

echo "================================"
echo "  EduMaster Pro - School ERP"
echo "================================"
echo ""

echo "Starting MongoDB..."
# For Mac
if command -v brew &> /dev/null; then
    brew services start mongodb-community
fi

# For Linux
if command -v systemctl &> /dev/null; then
    sudo systemctl start mongod
fi

echo ""
echo "Starting Backend Server..."
echo ""
echo "Server will start on: http://localhost:5000"
echo ""
echo "Available HTML Files:"
echo "- login.html (Start here)"
echo "- admin-dashboard.html"
echo "- teacher-dashboard.html"
echo "- student-dashboard.html"
echo ""

node server-session-management.js
