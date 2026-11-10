// Зона загрузки — поддержка файлов И папок
import { useState, useRef, useCallback } from 'react';
import { useStore } from '../store';

export function UploadZone() {
  const { theme, setShowUpload, addFile, addTextIdea } = useStore();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ name: string; done: boolean; size: string }[]>([]);
  const [ideaText, setIdeaText] = useState('');
  const [showIdeaInput, setShowIdeaInput] = useState(false);
  const [stats, setStats] = useState({ total: 0, done: 0 });

  // Форматирование размера
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
  };

  const handleFiles = useCallback(async (files: FileList | File[] | File[]) => {
    const fileList = Array.from(files as File[]).filter(f => !f.name.startsWith('.')); // пропускаем скрытые
    if (fileList.length === 0) return;
    
    setUploading(true);
    setStats({ total: fileList.length, done: 0 });
    const items = fileList.map(f => ({ name: f.name, done: false, size: formatSize(f.size) }));
    setProgress(items);

    for (let i = 0; i < fileList.length; i++) {
      try {
        await addFile(fileList[i]);
        setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, done: true } : p));
        setStats(s => ({ ...s, done: s.done + 1 }));
      } catch (e) {
        console.error('Ошибка загрузки:', e);
        setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, done: true, name: p.name + ' (ошибка)' } : p));
        setStats(s => ({ ...s, done: s.done + 1 }));
      }
    }

    setUploading(false);
    setTimeout(() => setShowUpload(false), 1500);
  }, [addFile, setShowUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Проверяем есть ли элементы (включая папки)
    const items = e.dataTransfer.items;
    if (items && items.length > 0) {
      const files: File[] = [];
      const entries: any[] = [];
      
      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry?.();
        if (entry) {
          entries.push(entry);
        } else {
          const file = items[i].getAsFile();
          if (file) files.push(file);
        }
      }
      
      // Рекурсивно читаем папки
      if (entries.length > 0) {
        readEntriesRecursive(entries).then(allFiles => {
          if (allFiles.length > 0) handleFiles(allFiles);
        });
      } else if (files.length > 0) {
        handleFiles(files);
      }
    } else {
      const files = e.dataTransfer.files;
      if (files.length > 0) handleFiles(files);
    }
  }, [handleFiles]);

  // Рекурсивное чтение содержимого папок
  const readEntriesRecursive = async (entries: any[]): Promise<File[]> => {
    const files: File[] = [];
    
    const processEntry = async (entry: any, path: string = ''): Promise<void> => {
      if (entry.isFile) {
        return new Promise((resolve) => {
          entry.file((file: File) => {
            // Сохраняем путь в имени для правильной классификации
            const fileWithPath = new File([file], path ? `${path}/${file.name}` : file.name, { type: file.type });
            files.push(fileWithPath);
            resolve();
          }, () => resolve());
        });
      } else if (entry.isDirectory) {
        return new Promise((resolve) => {
          const reader = entry.createReader();
          const readAll = () => {
            reader.readEntries(async (entries: any[]) => {
              if (entries.length === 0) {
                resolve();
                return;
              }
              for (const e of entries) {
                await processEntry(e, path ? `${path}/${entry.name}` : entry.name);
              }
              readAll(); // продолжаем читать если есть ещё
            }, () => resolve());
          };
          readAll();
        });
      }
    };
    
    for (const entry of entries) {
      await processEntry(entry);
    }
    
    return files;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleIdeaSubmit = async () => {
    if (!ideaText.trim()) return;
    setUploading(true);
    await addTextIdea(ideaText.trim());
    setIdeaText('');
    setUploading(false);
    setShowIdeaInput(false);
    setShowUpload(false);
  };

  const progressPercent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="modal-overlay" onClick={() => !uploading && setShowUpload(false)}>
      <div
        className={`modal-content ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              📤 Загрузка файлов
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Файлы и папки • Автоматическая сортировка
            </p>
          </div>
          <button
            onClick={() => setShowUpload(false)}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            ✕
          </button>
        </div>

        {/* Зона drag & drop */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
              : (isDark ? 'border-slate-600 hover:border-indigo-500/50 bg-slate-800/50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50')
          }`}
        >
          <div className="text-6xl mb-4 animate-bounce">📁</div>
          <p className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Перетащите файлы или папки сюда
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Можно загрузить целую папку — всё рассортируется автоматически
          </p>
        </div>

        {/* Кнопки выбора */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`px-4 py-3 rounded-xl font-medium transition-all hover:scale-[1.02] ${
              isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            📄 Выбрать файлы
          </button>

          <input
            ref={folderInputRef}
            type="file"
            // @ts-ignore
            webkitdirectory=""
            // @ts-ignore
            directory=""
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <button
            onClick={() => folderInputRef.current?.click()}
            className="px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-[1.02]"
          >
            📂 Выбрать папку
          </button>
        </div>

        {/* Поддерживаемые форматы */}
        <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
          <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Поддерживаемые форматы:
          </p>
          <div className="flex flex-wrap gap-1">
            {[
              { label: 'Видео', ext: 'mp4, mov, webm', color: 'bg-red-500/20 text-red-400' },
              { label: 'Аудио', ext: 'mp3, wav, flac', color: 'bg-purple-500/20 text-purple-400' },
              { label: 'Фото', ext: 'jpg, png, gif, webp', color: 'bg-emerald-500/20 text-emerald-400' },
              { label: 'Документы', ext: 'pdf, docx, txt', color: 'bg-blue-500/20 text-blue-400' },
              { label: 'Код', ext: 'js, ts, py, html', color: 'bg-violet-500/20 text-violet-400' },
              { label: 'Таблицы', ext: 'xlsx, csv', color: 'bg-green-500/20 text-green-400' },
              { label: 'Дизайн', ext: 'psd, ai, fig', color: 'bg-pink-500/20 text-pink-400' },
              { label: '3D', ext: 'blend, obj, fbx', color: 'bg-cyan-500/20 text-cyan-400' },
            ].map(cat => (
              <span key={cat.label} className={`text-[10px] px-2 py-1 rounded-full ${cat.color}`}>
                {cat.label}: {cat.ext}
              </span>
            ))}
          </div>
        </div>

        {/* Прогресс загрузки */}
        {progress.length > 0 && (
          <div className="mt-4">
            {/* Прогресс-бар */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Загрузка: {stats.done} / {stats.total}
                </span>
                <span className="text-indigo-500 font-medium">{progressPercent}%</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Список файлов */}
            <div className={`max-h-48 overflow-y-auto rounded-xl space-y-1 p-2 scrollbar-thin ${
              isDark ? 'bg-slate-900/50' : 'bg-slate-50'
            }`}>
              {progress.map((item, i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                  isDark ? 'bg-slate-800/50' : 'bg-white'
                }`}>
                  <span className="text-sm">{item.done ? '✅' : '⏳'}</span>
                  <span className={`flex-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.name}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.size}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Добавление текстовой идеи */}
        <div className="mt-4">
          <button
            onClick={() => setShowIdeaInput(!showIdeaInput)}
            className={`text-sm font-medium flex items-center gap-1 ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
          >
            💡 Или записать идею текстом
          </button>
          
          {showIdeaInput && (
            <div className="mt-3">
              <textarea
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                placeholder="Опишите вашу идею, заметку, мысль..."
                rows={4}
                className={`w-full px-3 py-2 rounded-xl border text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400'
                    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
                }`}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleIdeaSubmit}
                  disabled={!ideaText.trim() || uploading}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  💾 Сохранить идею
                </button>
                <button
                  onClick={() => setShowIdeaInput(false)}
                  className={`px-4 py-2 rounded-xl text-sm ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
