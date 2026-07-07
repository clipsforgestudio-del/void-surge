@echo off
setlocal enabledelayedexpansion
title VOID SURGE - Build Installer
cls

echo ============================================
echo    VOID SURGE - Build Tool
echo    Generate .EXE Installer
echo ============================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Node.js is not installed!
    echo.
    echo Choose an option:
    echo   [1] Install Node.js automatically (recommended)
    echo   [2] Open Node.js download page manually
    echo   [3] Exit
    echo.
    set /p "choice=Enter choice (1-3): "
    
    if "!choice!"=="1" (
        echo.
        echo Downloading Node.js...
        curl -L -o "%TEMP%\node-install.msi" https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi
        
        echo Installing Node.js (this may take a moment)...
        msiexec /i "%TEMP%\node-install.msi" /qn /norestart
        
        echo Waiting for installation to complete...
        timeout /t 20 /nobreak >nul
        
        :: Refresh PATH
        set "PATH=%PATH%;C:\Program Files\nodejs\;C:\Program Files (x86)\nodejs\"
    ) else if "!choice!"=="2" (
        start https://nodejs.org/
        echo Please install Node.js, then run this script again.
        pause
        exit /b
    ) else (
        exit /b
    )
)

:: Verify Node.js is available
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found after installation.
    echo Please restart your computer, then run this script again.
    pause
    exit /b
)

echo [OK] Node.js detected:
for /f "tokens=*" %%a in ('node --version') do echo %%a
echo.

:: Install dependencies
echo [1/4] Installing build dependencies...
call npm install --save-dev electron electron-builder
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b
)
echo.

:: Generate icon
echo [2/4] Generating icons...
if not exist "assets\icon.svg" (
    cd assets
    node icon.js > icon.svg 2>nul
    cd ..
    echo Icon SVG created.
) else (
    echo Icon SVG already exists.
)

:: Create placeholder PNG if needed (will be generated at build time)
echo [3/4] Preparing assets...

:: Build the executable
echo [4/4] Building VOID SURGE executable...
echo.
echo This will create the .EXE installer in the 'dist' folder.
echo This may take several minutes on first run.
echo.
call npm run build:win

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed. Check the error messages above.
    echo Common fixes:
    echo   - Run: npm install
    echo   - Make sure you have Windows SDK installed
    echo   - Try running as Administrator
    pause
    exit /b
)

echo.
echo ============================================
echo    BUILD COMPLETE!
echo ============================================
echo.
echo Your installer is located at:
echo    void-surge\dist\VoidSurge-Setup-1.0.0.exe
echo.
echo A portable version (no install needed):
echo    void-surge\dist\VoidSurge-Portable-1.0.0.exe
echo.
echo Share these files with anyone to let them play!
echo.
echo ============================================
pause
endlocal