@echo off
setlocal enabledelayedexpansion

REM ====== DETECT SCRIPT LOCATION ======
set SCRIPT_DIR=%~dp0
set BACKEND_PROJECT_PATH=%SCRIPT_DIR%backend
set FRONTEND_PROJECT_PATH=%SCRIPT_DIR%youtrack-app
REM ====================================

REM ====== CHECK JAVA VERSION ======
for /f "tokens=3" %%v in ('java -version 2^>^&1 ^| findstr "version"') do set JAVAVER=%%v
set JAVAVER=%JAVAVER:"=%
for /f "tokens=1,2 delims=." %%a in ("%JAVAVER%") do (
    set MAJOR=%%a
    set MINOR=%%b
)

if %MAJOR% LSS 17 (
    echo Java %JAVAVER% detected. Spring Boot 3.5.6 requires Java 17 or newer.
    echo Please install JDK 17+ and update JAVA_HOME/Path.
    pause
    exit /b 1
)
echo Java %JAVAVER% is OK.
REM ====================================

echo Checking Backend dependencies...
cd /d "%BACKEND_PROJECT_PATH%"
call gradlew.bat dependencies >nul 2>&1
if %errorlevel% neq 0 (
    echo   Backend dependencies missing. Installing...
    call gradlew.bat build --refresh-dependencies
) else (
    echo   Backend dependencies are OK.
)

echo Starting Backend project...
start "Backend" cmd /c "gradlew.bat bootRun"

echo 🔍 Checking Frontend dependencies...
cd /d "%FRONTEND_PROJECT_PATH%"
if not exist node_modules (
    echo   Frontend dependencies missing. Installing...
    call pnpm install
) else (
    call pnpm list >nul 2>&1
    if %errorlevel% neq 0 (
        echo   Frontend dependencies missing. Installing...
        call pnpm install
    ) else (
        echo   Frontend dependencies are OK.
    )
)

echo Starting Frontend project...
start "Frontend" cmd /c "pnpm run dev"

echo See Webpage at:
echo http://localhost:5173
echo Both projects started. Close the extra windows or press CTRL+C in each to stop.

pause
