// Компонент экспорта/импорта хранилища
import { useState, useRef } from 'react';
import { useStore } from '../store';
import { exportVault, importVault, downloadJSON, downloadAllFiles, importFromZip, formatExportSize } from '../lib/export';
import * as db from '../lib/db';

export function SyncPanel() {
  const { theme, files, portfolios, init } = useStore();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Экспорт в JSON (всё хранилище)
  const handleExportJSON = async () => {
    setExporting(true);
    try {
      const json = await exportVault(files, portfolios);
      const filename = `myvault-backup-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(json, filename);
      setMessage({ type: 'success', text: '✅ Хранилище экспортировано!' });
    } catch (e) {
      setMessage({ type: 'error', text: '❌ Ошибка экспорта: ' + (e as Error).message });
    }
    setExporting(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Экспорт всех файлов в ZIP
  const handleExportZIP = async () => {
    setExporting(true);
    try {
      await downloadAllFiles(files);
      setMessage({ type: 'success', text: '✅ Архив создан!' });
    } catch (e) {
      setMessage({ type: 'error', text: '❌ Ошибка: ' + (e as Error).message });
    }
    setExporting(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Импорт из JSON
  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImporting(true);
    try {
      const text = await file.text();
      const data = await importVault(text);
      
      // Сохраняем в IndexedDB
      for (const f of data.files) {
        await db.saveFile(f);
      }
      for (const p of data.portfolios) {
        await db.savePortfolio(p);
      }
      
      // Перезагружаем данные
      await init();
      setMessage({ type: 'success', text: `✅ Импортировано: ${data.files.length} файлов, ${data.portfolios.length} портфолио` });
    } catch (e) {
      setMessage({ type: 'error', text: '❌ Ошибка импорта: ' + (e as Error).message });
    }
    setImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setMessage(null), 5000);
  };

  // Импорт из ZIP
  const handleImportZIP = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImporting(true);
    try {
      const data = await importFromZip(file);
      
      // Сохраняем в IndexedDB
      for (const f of data.files) {
        await db.saveFile(f);
      }
      for (const p of data.portfolios) {
        await db.savePortfolio(p);
      }
      
      // Перезагружаем данные
      await init();
      setMessage({ type: 'success', text: `✅ Импортировано из архива: ${data.files.length} файлов` });
    } catch (e) {
      setMessage({ type: 'error', text: '❌ Ошибка: ' + (e as Error).message });
    }
    setImporting(false);
    if (zipInputRef.current) zipInputRef.current.value = '';
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className={`rounded-xl border p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        🔄 Синхронизация и бэкап
      </h3>
      
      <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Экспортируйте хранилище на компьютер или импортируйте с другого устройства.
      </p>

      {/* Статистика */}
      <div className={`grid grid-cols-2 gap-3 mb-4 p-3 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
        <div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Файлов</p>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{files.length}</p>
        </div>
        <div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Размер</p>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatExportSize(files)}</p>
        </div>
      </div>

      {/* Экспорт */}
      <div className="space-y-2 mb-4">
        <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          📤 Экспорт (сохранить на компьютер)
        </p>
        <button
          onClick={handleExportJSON}
          disabled={exporting || files.length === 0}
          className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {exporting ? '⏳ Экспорт...' : '💾 Экспорт в JSON (всё хранилище)'}
        </button>
        <button
          onClick={handleExportZIP}
          disabled={exporting || files.length === 0}
          className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          } disabled:opacity-50`}
        >
          📦 Экспорт в ZIP (файлы + метаданные)
        </button>
      </div>

      {/* Импорт */}
      <div className="space-y-2">
        <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          📥 Импорт (загрузить с компьютера)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportJSON}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDark ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'
          } disabled:opacity-50`}
        >
          {importing ? '⏳ Импорт...' : '📄 Импорт из JSON'}
        </button>
        
        <input
          ref={zipInputRef}
          type="file"
          accept=".zip"
          onChange={handleImportZIP}
          className="hidden"
        />
        <button
          onClick={() => zipInputRef.current?.click()}
          disabled={importing}
          className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          } disabled:opacity-50`}
        >
          📦 Импорт из ZIP-архива
        </button>
      </div>

      {/* Сообщение */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.type === 'success'
            ? (isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700')
            : (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700')
        }`}>
          {message.text}
        </div>
      )}

      {/* Инструкция */}
      <div className={`mt-4 p-3 rounded-lg text-xs ${isDark ? 'bg-slate-700/30 text-slate-400' : 'bg-blue-50 text-blue-700'}`}>
        <p className="font-medium mb-1">💡 Как синхронизировать между устройствами:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Экспортируйте хранилище в JSON на одном устройстве</li>
          <li>Сохраните файл в облако (Dropbox, Google Drive, iCloud)</li>
          <li>На другом устройстве откройте приложение и импортируйте файл</li>
          <li>Повторяйте при необходимости синхронизации</li>
        </ol>
      </div>
    </div>
  );
}
