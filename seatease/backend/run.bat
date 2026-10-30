@echo off
title SeatEase Java Backend
echo ==============================================
echo       SeatEase Java Backend Server
echo ==============================================

cd /d "%~dp0"

if not exist "bin" mkdir bin

echo Compiling Java source files...
javac -cp "lib/*" -d bin src\main\java\com\seatease\model\*.java src\main\java\com\seatease\database\*.java src\main\java\com\seatease\dao\*.java src\main\java\com\seatease\service\*.java src\main\java\com\seatease\controller\*.java src\main\java\com\seatease\main\*.java

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Compilation failed. Please ensure JDK 17+ is installed.
    pause
    exit /b %ERRORLEVEL%
)

echo Starting SeatEase Backend Server on port 8080...
java -cp "bin;lib/*" com.seatease.main.Main
pause
