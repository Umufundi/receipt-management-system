@echo off
echo Git Operations Starting...

:: Add all changes
git add .

:: Get commit message from user
set /p commit_msg="Enter commit message: "

:: Commit changes
git commit -m "%commit_msg%"

:: Push to GitHub
git push origin main

echo.
echo Git operations completed!
echo Changes will be automatically deployed by GitHub Actions
echo.
echo Press any key to exit...
pause > nul 