// Главный файл сервера MyVault
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { initDB } from './db';
import filesRouter from './routes/files';

const app = express();
const PORT = process.env.PORT || 3001;

// Путь к хранилищу (можно переопределить через переменную окружения)
const STORAGE_PATH = process.env.STORAGE_PATH || path.join(process.cwd(), 'myvault-storage');
const UPLOADS_DIR = path.join(STORAGE_PATH, 'uploads');
const DB_PATH = path.join(STORAGE_PATH, 'myvault.db');

// Создаём директории если не существуют
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Инициализация БД
initDB(DB_PATH);

// Middleware
app.use(cors());
app.use(express.json());

// Сохраняем пути в app для использования в маршрутах
app.set('storagePath', STORAGE_PATH);
app.set('uploadsDir', UPLOADS_DIR);

// Статика для файлов
app.use('/uploads', express.static(UPLOADS_DIR));

// API маршруты
app.use('/api/files', filesRouter);

// Отдача клиентского приложения (собранный фронтенд)
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🗄️  MyVault Server запущен!');
  console.log('');
  console.log(`📁 Хранилище: ${STORAGE_PATH}`);
  console.log(`🗃️  База данных: ${DB_PATH}`);
  console.log(`📂 Загрузки: ${UPLOADS_DIR}`);
  console.log('');
  console.log(`🌐 Локальный доступ: http://localhost:${PORT}`);
  
  // Показываем IP для доступа с других устройств
  const os = require('os');
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`📱 Доступ с телефона: http://${iface.address}:${PORT}`);
      }
    }
  }
  console.log('');
});
