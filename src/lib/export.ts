// Утилиты для экспорта/импорта хранилища
import type { VaultFile, Portfolio } from './db';

interface ExportData {
  version: string;
  exportedAt: string;
  files: VaultFile[];
  portfolios: Portfolio[];
}

// Экспорт всего хранилища в JSON
export async function exportVault(files: VaultFile[], portfolios: Portfolio[]): Promise<string> {
  const data: ExportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    files,
    portfolios,
  };
  
  return JSON.stringify(data, null, 2);
}

// Экспорт только метаданных (без бинарных данных)
export function exportMetadata(files: VaultFile[], portfolios: Portfolio[]): string {
  const metadata = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    files: files.map(f => ({
      ...f,
      blobData: undefined, // убираем бинарные данные
      previewData: f.previewData, // оставляем превью
    })),
    portfolios,
  };
  
  return JSON.stringify(metadata, null, 2);
}

// Импорт хранилища из JSON
export async function importVault(jsonString: string): Promise<ExportData> {
  try {
    const data = JSON.parse(jsonString) as ExportData;
    
    if (!data.version || !data.files) {
      throw new Error('Неверный формат файла');
    }
    
    return data;
  } catch (e) {
    throw new Error('Ошибка чтения файла: ' + (e as Error).message);
  }
}

// Скачивание JSON-файла
export function downloadJSON(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Скачивание всех файлов как ZIP (через JSZip)
export async function downloadAllFiles(files: VaultFile[]): Promise<void> {
  // Динамический импорт JSZip
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  
  // Добавляем файлы в архив
  files.forEach(file => {
    if (file.blobData) {
      const blob = new Blob([file.blobData], { type: file.mime });
      const folder = file.folder.replace(/^\//, ''); // убираем первый /
      zip.file(`${folder}/${file.originalName}`, blob);
    }
  });
  
  // Добавляем метаданные
  const metadata = exportMetadata(files, []);
  zip.file('metadata.json', metadata);
  
  // Генерируем ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `myvault-backup-${new Date().toISOString().split('T')[0]}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Импорт из ZIP-архива
export async function importFromZip(zipFile: File): Promise<ExportData> {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(zipFile);
  
  // Ищем metadata.json
  const metadataFile = zip.file('metadata.json');
  if (!metadataFile) {
    throw new Error('Файл metadata.json не найден в архиве');
  }
  
  const metadataStr = await metadataFile.async('string');
  const metadata = JSON.parse(metadataStr) as ExportData;
  
  // Восстанавливаем бинарные данные файлов
  for (const file of metadata.files) {
    const folder = file.folder.replace(/^\//, '');
    const zipPath = `${folder}/${file.originalName}`;
    const zipEntry = zip.file(zipPath);
    
    if (zipEntry) {
      const blob = await zipEntry.async('blob');
      file.blobData = await blob.arrayBuffer();
    }
  }
  
  return metadata;
}

// Форматирование размера для отображения
export function formatExportSize(files: VaultFile[]): string {
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const kb = totalSize / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;
  
  if (gb >= 1) return `${gb.toFixed(2)} ГБ`;
  if (mb >= 1) return `${mb.toFixed(2)} МБ`;
  if (kb >= 1) return `${kb.toFixed(2)} КБ`;
  return `${totalSize} Б`;
}
