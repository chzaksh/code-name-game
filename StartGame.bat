@echo off
title Family Codenames Server
echo =========================================
echo Starting Family Codenames Game...
echo The game will open in your browser automatically!
echo =========================================
echo.
echo Press CTRL+C in this window to stop the server.
echo.

:: התוספת -- --open אומרת לשרת לפתוח את הדפדפן ברגע שהוא עולה
call npm run dev -- --open

pause