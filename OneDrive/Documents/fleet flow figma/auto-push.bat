@echo off
echo Checking for changes...

git add .
git commit -m "Auto-update: %date% %time%"
git push origin master

echo.
echo Changes pushed to GitHub!
pause
