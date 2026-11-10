// API клиент для связи с сервером MyVault
import type { VaultFile, Portfolio } from './lib/db';

const API_BASE = '/api';

// Загрузка файла на сервер
export async function uploadFile(file: File): Promise<VaultFile> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE}/files/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Ошибка загрузки файла');
  }
  
  return response.json();
}

// Получение списка файлов
export async function getFiles(params?: {
  type?: string;
  folder?: string;
  q?: string;
  fav?: boolean;
}): Promise<VaultFile[]> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set('type', params.type);
  if (params?.folder) searchParams.set('folder', params.folder);
  if (params?.q) searchParams.set('q', params.q);
  if (params?.fav) searchParams.set('fav', 'true');
  
  const response = await fetch(`${API_BASE}/files?${searchParams}`);
  if (!response.ok) throw new Error('Ошибка получения файлов');
  return response.json();
}

// Обновление файла
export async function updateFile(id: string, updates: Partial<VaultFile>): Promise<void> {
  const response = await fetch(`${API_BASE}/files/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Ошибка обновления');
}

// Удаление файла
export async function deleteFile(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/files/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Ошибка удаления');
}

// Получение URL для скачивания файла
export function getFileUrl(originalName: string): string {
  return `${API_BASE.replace('/api', '')}/uploads/${originalName}`;
}
