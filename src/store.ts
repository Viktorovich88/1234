// Глобальное состояние приложения — Zustand store
import { create } from 'zustand';
import type { VaultFile, Portfolio } from './lib/db';
import * as db from './lib/db';
import { classify, isImage, isTextFile } from './lib/classifier';

interface AppState {
  // Данные
  files: VaultFile[];
  portfolios: Portfolio[];
  
  // UI состояние
  selectedFileId: string | null;
  searchQuery: string;
  filterType: string;
  filterFolder: string;
  filterFavorite: boolean;
  sortBy: 'date' | 'name' | 'size';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  theme: 'dark' | 'light';
  showUpload: boolean;
  showPortfolio: boolean;
  showDetails: boolean;
  sidebarOpen: boolean;
  loading: boolean;
  
  // Действия
  init: () => Promise<void>;
  addFile: (file: File) => Promise<VaultFile>;
  addTextIdea: (text: string) => Promise<VaultFile>;
  removeFile: (id: string) => Promise<void>;
  updateFile: (id: string, updates: Partial<VaultFile>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  moveFile: (id: string, folder: string) => Promise<void>;
  
  setSelectedFile: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setFilterType: (t: string) => void;
  setFilterFolder: (f: string) => void;
  setFilterFavorite: (f: boolean) => void;
  setSortBy: (s: 'date' | 'name' | 'size') => void;
  setSortOrder: (o: 'asc' | 'desc') => void;
  setViewMode: (m: 'grid' | 'list') => void;
  toggleTheme: () => void;
  setShowUpload: (v: boolean) => void;
  setShowPortfolio: (v: boolean) => void;
  setShowDetails: (v: boolean) => void;
  setSidebarOpen: (v: boolean) => void;
  
  // Портфолио
  createPortfolio: (name: string, style: 'minimal' | 'dark' | 'bright', fileIds: string[]) => Promise<Portfolio>;
  
  // Вычисляемые
  getFilteredFiles: () => VaultFile[];
  getFolders: () => string[];
  getAllTags: () => string[];
}

export const useStore = create<AppState>((set, get) => ({
  // Начальные данные
  files: [],
  portfolios: [],
  
  // UI
  selectedFileId: null,
  searchQuery: '',
  filterType: '',
  filterFolder: '',
  filterFavorite: false,
  sortBy: 'date',
  sortOrder: 'desc',
  viewMode: 'grid',
  theme: (typeof localStorage !== 'undefined' && localStorage.getItem('myvault-theme') as 'dark' | 'light') || 'dark',
  showUpload: false,
  showPortfolio: false,
  showDetails: false,
  sidebarOpen: true,
  loading: false,
  
  // Инициализация — загрузка данных из IndexedDB
  init: async () => {
    set({ loading: true });
    try {
      const files = await db.getAllFiles();
      const portfolios = await db.getAllPortfolios();
      set({ files, portfolios, loading: false });
    } catch (e) {
      console.error('Ошибка загрузки данных:', e);
      set({ loading: false });
    }
  },
  
  // Добавление файла
  addFile: async (file: File) => {
    const id = db.generateId();
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    
    // Читаем содержимое для текстовых файлов
    let content = '';
    if (isTextFile(file.type, ext)) {
      try {
        content = await file.text();
      } catch { /* игнорируем */ }
    }
    
    // Классифицируем
    const rules = await db.getRules();
    const classification = classify({ name: file.name, mime: file.type, content }, rules);
    
    // Генерируем превью для изображений
    let previewData: string | undefined;
    if (isImage(file.type)) {
      previewData = await generateImagePreview(file);
    }
    
    // Сохраняем бинарные данные
    const blobData = await file.arrayBuffer();
    
    const vaultFile: VaultFile = {
      id,
      name: file.name.replace(/\.[^.]+$/, ''),
      originalName: file.name,
      mime: file.type || 'application/octet-stream',
      type: classification.type,
      size: file.size,
      folder: classification.folder,
      tags: classification.tags,
      description: classification.description,
      isFavorite: false,
      color: '',
      previewData,
      blobData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await db.saveFile(vaultFile);
    set(state => ({ files: [...state.files, vaultFile] }));
    return vaultFile;
  },
  
  // Добавление текстовой идеи
  addTextIdea: async (text: string) => {
    const id = db.generateId();
    const rules = await db.getRules();
    const classification = classify({ name: 'идея.txt', mime: 'text/plain', content: text }, rules);
    
    const vaultFile: VaultFile = {
      id,
      name: text.substring(0, 50).replace(/\n/g, ' '),
      originalName: 'idea.txt',
      mime: 'text/plain',
      type: 'idea',
      size: new Blob([text]).size,
      folder: '/Идеи',
      tags: [...classification.tags, 'идея'],
      description: text,
      isFavorite: false,
      color: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await db.saveFile(vaultFile);
    set(state => ({ files: [...state.files, vaultFile] }));
    return vaultFile;
  },
  
  // Удаление файла
  removeFile: async (id: string) => {
    await db.deleteFile(id);
    set(state => ({
      files: state.files.filter(f => f.id !== id),
      selectedFileId: state.selectedFileId === id ? null : state.selectedFileId,
    }));
  },
  
  // Обновление файла
  updateFile: async (id: string, updates: Partial<VaultFile>) => {
    const updated = await db.updateFile(id, updates);
    if (updated) {
      set(state => ({
        files: state.files.map(f => f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f),
      }));
    }
  },
  
  // Избранное
  toggleFavorite: async (id: string) => {
    const file = get().files.find(f => f.id === id);
    if (file) {
      await get().updateFile(id, { isFavorite: !file.isFavorite });
    }
  },
  
  // Перемещение файла
  moveFile: async (id: string, folder: string) => {
    await get().updateFile(id, { folder });
  },
  
  // UI действия
  setSelectedFile: (id) => set({ selectedFileId: id, showDetails: !!id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterType: (t) => set({ filterType: t }),
  setFilterFolder: (f) => set({ filterFolder: f }),
  setFilterFavorite: (f) => set({ filterFavorite: f }),
  setSortBy: (s) => set({ sortBy: s }),
  setSortOrder: (o) => set({ sortOrder: o }),
  setViewMode: (m) => set({ viewMode: m }),
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('myvault-theme', newTheme);
    document.documentElement.className = newTheme;
    set({ theme: newTheme });
  },
  setShowUpload: (v) => set({ showUpload: v }),
  setShowPortfolio: (v) => set({ showPortfolio: v }),
  setShowDetails: (v) => set({ showDetails: v }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  
  // Создание портфолио
  createPortfolio: async (name, style, fileIds) => {
    const id = db.generateId();
    const files = get().files.filter(f => fileIds.includes(f.id));
    const html = generatePortfolioHTML(files, name, style);
    
    const portfolio: Portfolio = {
      id,
      name,
      style,
      fileIds,
      html,
      createdAt: new Date().toISOString(),
    };
    
    await db.savePortfolio(portfolio);
    set(state => ({ portfolios: [...state.portfolios, portfolio] }));
    return portfolio;
  },
  
  // Фильтрация файлов
  getFilteredFiles: () => {
    const { files, searchQuery, filterType, filterFolder, filterFavorite, sortBy, sortOrder } = get();
    
    let filtered = [...files];
    
    // Поиск
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q)) ||
        f.originalName.toLowerCase().includes(q)
      );
    }
    
    // Фильтр по типу
    if (filterType) {
      filtered = filtered.filter(f => f.type === filterType);
    }
    
    // Фильтр по папке
    if (filterFolder) {
      filtered = filtered.filter(f => f.folder === filterFolder || f.folder.startsWith(filterFolder + '/'));
    }
    
    // Фильтр избранного
    if (filterFavorite) {
      filtered = filtered.filter(f => f.isFavorite);
    }
    
    // Сортировка
    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'date': cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); break;
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'size': cmp = a.size - b.size; break;
      }
      return sortOrder === 'desc' ? -cmp : cmp;
    });
    
    return filtered;
  },
  
  // Получение списка папок
  getFolders: () => {
    const folders = new Set<string>();
    get().files.forEach(f => folders.add(f.folder));
    return Array.from(folders).sort();
  },
  
  // Получение всех тегов
  getAllTags: () => {
    const tags = new Set<string>();
    get().files.forEach(f => f.tags.forEach((t: string) => tags.add(t)));
    return Array.from(tags).sort();
  },
}));

// Генерация превью для изображения
async function generateImagePreview(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Создаём уменьшенную версию через canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 300;
        let w = img.width, h = img.height;
        if (w > h) { h = (h / w) * maxSize; w = maxSize; }
        else { w = (w / h) * maxSize; h = maxSize; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// Генерация HTML портфолио
function generatePortfolioHTML(files: VaultFile[], name: string, style: 'minimal' | 'dark' | 'bright'): string {
  const date = new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const styles: Record<string, string> = {
    minimal: `
      body { font-family: -apple-system, sans-serif; background: #fafafa; color: #333; }
      .card { background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; }
      .tag { background: #f0f0f0; color: #555; }
      h1 { color: #111; }
    `,
    dark: `
      body { font-family: -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; }
      .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; }
      .tag { background: #334155; color: #94a3b8; }
      h1 { color: #f1f5f9; }
    `,
    bright: `
      body { font-family: -apple-system, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; min-height: 100vh; }
      .card { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; backdrop-filter: blur(10px); }
      .tag { background: rgba(255,255,255,0.2); color: #fff; }
      h1 { color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
    `,
  };
  
  const cards = files.map(f => {
    const preview = f.previewData
      ? `<img src="${f.previewData}" alt="${f.name}" style="width:100%;height:180px;object-fit:cover;border-radius:8px 8px 0 0;" />`
      : `<div style="width:100%;height:180px;display:flex;align-items:center;justify-content:center;font-size:48px;background:rgba(128,128,128,0.1);border-radius:8px 8px 0 0;">${getTypeEmoji(f.type)}</div>`;
    
    const tags = f.tags.slice(0, 5).map((t: string) => `<span class="tag" style="display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;margin:2px;">${t}</span>`).join('');
    
    return `
      <div class="card" style="overflow:hidden;">
        ${preview}
        <div style="padding:16px;">
          <h3 style="margin:0 0 8px;font-size:16px;">${f.name}</h3>
          <p style="margin:0 0 8px;font-size:13px;opacity:0.8;">${f.description.substring(0, 120)}${f.description.length > 120 ? '...' : ''}</p>
          <div>${tags}</div>
        </div>
      </div>
    `;
  }).join('');
  
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    ${styles[style]}
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { font-size: 32px; margin-bottom: 8px; }
    .header p { opacity: 0.7; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .actions { text-align: center; margin-top: 40px; }
    .actions button { padding: 12px 24px; margin: 4px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; }
    .btn-download { background: #4f46e5; color: #fff; }
    .btn-print { background: #059669; color: #fff; }
    @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
    @media print { .actions { display: none; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${name}</h1>
      <p>Собрано: ${date} · ${files.length} работ</p>
    </div>
    <div class="grid">${cards}</div>
    <div class="actions">
      <button class="btn-download" onclick="downloadHTML()">📥 Скачать HTML</button>
      <button class="btn-print" onclick="window.print()">🖨️ Печать в PDF</button>
    </div>
  </div>
  <script>
    function downloadHTML() {
      const blob = new Blob([document.documentElement.outerHTML], {type: 'text/html'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '${name.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;
}

function getTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    video: '🎬', image: '🖼️', table: '📊', doc: '📄',
    code: '💻', link: '🔗', idea: '💡', archive: '📦', other: '📎'
  };
  return emojis[type] || '📎';
}
