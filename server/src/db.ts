// Модуль работы с базой данных SQLite
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database;

// Инициализация базы данных
export function initDB(dbPath: string): Database.Database {
  // Создаём директорию если не существует
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(dbPath);
  
  // Включаем WAL режим для лучшей производительности
  db.pragma('journal_mode = WAL');
  
  // Создаём таблицы из schema.sql
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
  
  console.log('✅ База данных инициализирована:', dbPath);
  return db;
}

// Получение экземпляра базы данных
export function getDB(): Database.Database {
  if (!db) {
    throw new Error('База данных не инициализирована. Вызовите initDB() сначала.');
  }
  return db;
}

// Закрытие соединения
export function closeDB(): void {
  if (db) {
    db.close();
  }
}
