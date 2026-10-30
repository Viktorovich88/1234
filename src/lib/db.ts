// База данных на основе IndexedDB — хранение файлов и метаданных
import { openDB, IDBPDatabase } from 'idb';

export interface VaultFile {
  id: string;
  name: string;
  originalName: string;
  mime: string;
  type: string; // video, image, table, doc, code, link, idea, archive, other
  size: number;
  folder: string;
  tags: string[];
  description: string;
  isFavorite: boolean;
  color: string;
  previewData?: string; // base64 или data URL
  blobData?: ArrayBuffer; // бинарные данные файла
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  id: string;
  name: string;
  style: 'minimal' | 'dark' | 'bright';
  fileIds: string[];
  html: string;
  createdAt: string;
}

export interface ClassificationRule {
  id: string;
  pattern: string;
  category: string;
}

const DB_NAME = 'myvault_db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase | null = null;

export async function getDB(): Promise<IDBPDatabase> {
  if (dbInstance) return dbInstance;
  
  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Хранилище файлов
      if (!db.objectStoreNames.contains('files')) {
        const fileStore = db.createObjectStore('files', { keyPath: 'id' });
        fileStore.createIndex('folder', 'folder');
        fileStore.createIndex('type', 'type');
        fileStore.createIndex('isFavorite', 'isFavorite');
        fileStore.createIndex('createdAt', 'createdAt');
      }
      // Портфолио
      if (!db.objectStoreNames.contains('portfolios')) {
        db.createObjectStore('portfolios', { keyPath: 'id' });
      }
      // Правила классификации
      if (!db.objectStoreNames.contains('rules')) {
        db.createObjectStore('rules', { keyPath: 'id' });
      }
    },
  });
  
  return dbInstance;
}

// === Операции с файлами ===

export async function saveFile(file: VaultFile): Promise<void> {
  const db = await getDB();
  await db.put('files', file);
}

export async function getFile(id: string): Promise<VaultFile | undefined> {
  const db = await getDB();
  return db.get('files', id);
}

export async function getAllFiles(): Promise<VaultFile[]> {
  const db = await getDB();
  return db.getAll('files');
}

export async function deleteFile(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('files', id);
}

export async function updateFile(id: string, updates: Partial<VaultFile>): Promise<VaultFile | undefined> {
  const db = await getDB();
  const file = await db.get('files', id);
  if (!file) return undefined;
  const updated = { ...file, ...updates, updatedAt: new Date().toISOString() };
  await db.put('files', updated);
  return updated;
}

// === Операции с портфолио ===

export async function savePortfolio(portfolio: Portfolio): Promise<void> {
  const db = await getDB();
  await db.put('portfolios', portfolio);
}

export async function getPortfolio(id: string): Promise<Portfolio | undefined> {
  const db = await getDB();
  return db.get('portfolios', id);
}

export async function getAllPortfolios(): Promise<Portfolio[]> {
  const db = await getDB();
  return db.getAll('portfolios');
}

export async function deletePortfolio(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('portfolios', id);
}

// === Операции с правилами ===

export async function getRules(): Promise<ClassificationRule[]> {
  const db = await getDB();
  return db.getAll('rules');
}

export async function saveRule(rule: ClassificationRule): Promise<void> {
  const db = await getDB();
  await db.put('rules', rule);
}

export async function deleteRule(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('rules', id);
}

// Утилита: генерация ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
