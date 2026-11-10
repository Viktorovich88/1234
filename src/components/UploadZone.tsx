// Зона загрузки в стиле Dark Neon Skull
import { useState, useRef, useCallback } from 'react';
import { useStore } from '../store';

export function UploadZone() {
  const { setShowUpload, addFile, addTextIdea } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ name: string; done: boolean; size: string }[]>([]);
  const [ideaText, setIdeaText] = useState('');
  const [showIdeaInput, setShowIdeaInput] = useState(false);
  const [stats, setStats] = useState({ total: 0, done: 0 });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
  };

  const handleFiles = useCallback(async (files: FileList | File[] | File[]) => {
    const fileList = Array.from(files as File[]).filter(f => !f.name.startsWith('.'));
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

  const readEntriesRecursive = async (entries: any[]): Promise<File[]> => {
    const files: File[] = [];
    
    const processEntry = async (entry: any, path: string = ''): Promise<void> => {
      if (entry.isFile) {
        return new Promise((resolve) => {
          entry.file((file: File) => {
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
              if (entries.length === 0) { resolve(); return; }
              for (const e of entries) {
                await processEntry(e, path ? `${path}/${entry.name}` : entry.name);
              }
              readAll();
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

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              ☠ ЗАГРУЗКА ФАЙЛОВ
            </h2>
            <p className="text-sm mt-1 text-purple-400/60 font-mono">
              ФАЙЛЫ И ПАПКИ • АВТОМАТИЧЕСКАЯ СОРТИРОВКА
            </p>
          </div>
          <button
            onClick={() => setShowUpload(false)}
            className="p-2 rounded-lg hover:bg-purple-500/20 text-purple-400"
          >
            ✕
          </button>
        </div>

        {/* Зона drag & drop */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all relative overflow-hidden ${
            isDragging
              ? 'border-purple-500 bg-purple-500/10 scale-[1.02]'
              : 'border-purple-500/30 hover:border-purple-500/60 bg-black/30'
          }`}
        >
          {/* Фоновая сетка */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          
          <div className="relative">
            <div className="text-6xl mb-4 animate-skull-float">
              <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto animate-neon-pulse">
                <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
                  fill="#7c3aed" stroke="#c4b5fd" strokeWidth="2" />
                <ellipse cx="38" cy="48" rx="7" ry="8" fill="#07060d" />
                <ellipse cx="62" cy="48" rx="7" ry="8" fill="#07060d" />
                <circle cx="38" cy="48" r="3" fill="#ec4899" className="animate-eye-glow" />
                <circle cx="62" cy="48" r="3" fill="#ec4899" className="animate-eye-glow" />
                <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
              </svg>
            </div>
            <p className="text-lg font-bold text-purple-200">
              Перетащите файлы или папки сюда
            </p>
            <p className="text-sm mt-2 text-purple-400/60">
              Можно загрузить целую папку — всё рассортируется автоматически
            </p>
          </div>
        </div>

        {/* Кнопки выбора */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-3 rounded-xl font-medium transition-all hover:scale-[1.02] bg-black/30 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
          >
            📄 Выбрать файлы
          </button>

          <input ref={folderInputRef} type="file" multiple className="hidden" onChange={(e) => {
            // @ts-ignore
            const files = e.target.files;
            if (files) handleFiles(files);
          }} />
          <button
            onClick={() => {
              if (folderInputRef.current) {
                // @ts-ignore
                folderInputRef.current.webkitdirectory = true;
                folderInputRef.current.click();
              }
            }}
            className="px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/30"
          >
            📂 Выбрать папку
          </button>
        </div>

        {/* Прогресс загрузки */}
        {progress.length > 0 && (
          <div className="mt-4">
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-300">Загрузка: {stats.done} / {stats.total}</span>
                <span className="text-purple-400 font-mono font-bold">{progressPercent}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-black/50 border border-purple-500/20">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-300 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-xl space-y-1 p-2 scrollbar-thin bg-black/30 border border-purple-500/10">
              {progress.map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-purple-500/5">
                  <span className="text-sm">{item.done ? '✅' : '⏳'}</span>
                  <span className="flex-1 truncate text-purple-200">{item.name}</span>
                  <span className="text-[10px] text-purple-400/60 font-mono">{item.size}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Добавление текстовой идеи */}
        <div className="mt-4">
          <button
            onClick={() => setShowIdeaInput(!showIdeaInput)}
            className="text-sm font-medium flex items-center gap-1 text-purple-400 hover:text-purple-300"
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
                className="input-field w-full text-sm resize-none"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleIdeaSubmit}
                  disabled={!ideaText.trim() || uploading}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all"
                >
                  💾 Сохранить идею
                </button>
                <button
                  onClick={() => setShowIdeaInput(false)}
                  className="px-4 py-2 rounded-xl text-sm bg-black/30 border border-purple-500/30 text-purple-300"
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
