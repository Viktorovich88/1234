-- Схема базы данных MyVault (SQLite)

-- Таблица файлов
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  path TEXT NOT NULL,
  mime TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER NOT NULL,
  folder TEXT NOT NULL,
  tags TEXT DEFAULT '[]', -- JSON массив
  description TEXT DEFAULT '',
  is_favorite INTEGER DEFAULT 0,
  color TEXT DEFAULT '',
  preview_path TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Таблица папок
CREATE TABLE IF NOT EXISTS folders (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  parent_id TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (parent_id) REFERENCES folders(id)
);

-- Таблица портфолио
CREATE TABLE IF NOT EXISTS portfolios (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  style TEXT NOT NULL,
  file_ids TEXT NOT NULL, -- JSON массив
  html TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Таблица правил классификации
CREATE TABLE IF NOT EXISTS rules (
  id TEXT PRIMARY KEY,
  pattern TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Полнотекстовый поиск (FTS5)
CREATE VIRTUAL TABLE IF NOT EXISTS files_fts USING fts5(
  name,
  description,
  tags,
  content='files',
  content_rowid='rowid'
);

-- Триггеры для синхронизации FTS
CREATE TRIGGER IF NOT EXISTS files_ai AFTER INSERT ON files BEGIN
  INSERT INTO files_fts(rowid, name, description, tags)
  VALUES (new.rowid, new.name, new.description, new.tags);
END;

CREATE TRIGGER IF NOT EXISTS files_ad AFTER DELETE ON files BEGIN
  INSERT INTO files_fts(files_fts, rowid, name, description, tags)
  VALUES('delete', old.rowid, old.name, old.description, old.tags);
END;

CREATE TRIGGER IF NOT EXISTS files_au AFTER UPDATE ON files BEGIN
  INSERT INTO files_fts(files_fts, rowid, name, description, tags)
  VALUES('delete', old.rowid, old.name, old.description, old.tags);
  INSERT INTO files_fts(rowid, name, description, tags)
  VALUES (new.rowid, new.name, new.description, new.tags);
END;

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_files_type ON files(type);
CREATE INDEX IF NOT EXISTS idx_files_folder ON files(folder);
CREATE INDEX IF NOT EXISTS idx_files_favorite ON files(is_favorite);
CREATE INDEX IF NOT EXISTS idx_files_created ON files(created_at);
