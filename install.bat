@echo off
chcp 65001 >nul
echo.
echo 🗄️  Установка MyVault...
echo.

REM Проверка Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js не установлен!
    echo Скачайте и установите: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js установлен
echo.

REM Установка сервера
echo 📦 Установка сервера...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Ошибка установки сервера
    pause
    exit /b 1
)
cd ..

REM Установка клиента
echo 📦 Установка клиента...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Ошибка установки клиента
    pause
    exit /b 1
)

REM Сборка клиента
echo 🔨 Сборка клиента...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Ошибка сборки клиента
    pause
    exit /b 1
)
cd ..

REM Сборка сервера
echo 🔨 Сборка сервера...
cd server
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Ошибка сборки сервера
    pause
    exit /b 1
)
cd ..

echo.
echo ✅ Установка завершена!
echo.
echo 🚀 Запуск:
echo    cd server
echo    npm start
echo.
echo 📱 Затем откройте в браузере:
echo    http://localhost:3001
echo.
pause
