#!/bin/bash
# Скрипт быстрой установки MyVault

echo "🗄️  Установка MyVault..."
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен!"
    echo "Скачайте и установите: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js версии 18 или выше"
    echo "Ваша версия: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version)"
echo ""

# Установка сервера
echo "📦 Установка сервера..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки сервера"
    exit 1
fi
cd ..

# Установка клиента
echo "📦 Установка клиента..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Ошибка установки клиента"
    exit 1
fi

# Сборка клиента
echo "🔨 Сборка клиента..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки клиента"
    exit 1
fi
cd ..

# Сборка сервера
echo "🔨 Сборка сервера..."
cd server
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки сервера"
    exit 1
fi
cd ..

echo ""
echo "✅ Установка завершена!"
echo ""
echo "🚀 Запуск:"
echo "   cd server"
echo "   npm start"
echo ""
echo "📱 Затем откройте в браузере:"
echo "   http://localhost:3001"
echo ""
