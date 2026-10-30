@echo off
title SeatEase — Launch All Services
echo ==============================================
echo       SeatEase — Online Seat Booking
echo ==============================================
echo Starting Backend Server and Frontend Server...

cd /d "%~dp0"

start "SeatEase Backend" cmd /k "cd backend && run.bat"
timeout /t 3 /nobreak >nul
start "SeatEase Frontend" cmd /k "cd frontend && run.bat"

echo.
echo SeatEase is starting up!
echo Backend will run on: http://localhost:8080/api
echo Frontend will run on: http://localhost:5173
echo.
pause
