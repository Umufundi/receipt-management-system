@echo off
echo Starting deployment...

:: Start backend server
start cmd /k "cd backend && node server.js"

:: Start frontend development server
start cmd /k "cd frontend && set PORT=3001 && npm start"

echo Deployment started!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3001
echo Production: https://umufundi.github.io/receipt-management-system
echo Backend API: https://receipt-management-system.onrender.com
echo.
echo Press any key to exit...
pause > nul 