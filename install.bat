@echo off
echo Installing dependencies...

:: Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install

:: Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd ../frontend
call npm install

echo.
echo Installation completed!
echo.
echo Press any key to exit...
pause > nul 