@echo off
chcp 65001 >nul
title MyVault Server
echo.
echo 🗄️  Запуск MyVault Server...
echo.
cd server
call npm start
pause
