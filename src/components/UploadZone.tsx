// Зона загрузки файлов — drag & drop, прогресс, добавление идей
import { useState, useRef, useCallback } from 'react';
import { useStore } from '../store';

export function UploadZone() {
  const { theme, setShowUpload, addFile, addTextIdea } = useStore();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ name: string; done: boolean }[]>([]);
  const [ideaText, setIdeaText] = useState('');
  const [showIdeaInput, setShowIdeaInput] = useState(false);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;
    
    setUploading(true);
    const items: { name: string; done: boolean }[] = fileList.map(f => ({ name: f.name, done: false }));
    setProgress(items);

    for (let i = 0; i < fileList.length; i++) {
      try {
        await addFile(fileList[i]);
        setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, done: true } : p));
      } catch (e) {
        console.error('Ошибка загрузки:', e);
        setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, done: true, name: p.name + ' (ошибка)' } : p));
      }
    }

    setUploading(false);
    setTimeout(() => setShowUpload(false), 1000);
  }, [addFile, setShowUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFiles(files);
  }, [handleFiles]);

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

  return (
    <div className="modal-overlay" onClick={() => !uploading && setShowUpload(false)}>
      <div
        className={`modal-content ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            📤 Загрузка файлов
          </h2>
          <button
            onClick={() => setShowUpload(false)}
            className={`p-1 rounded ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            ✕
          </button>
        </div>

        {/* Зона drag & drop */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : (isDark ? 'border-slate-600 hover:border-slate-500 bg-slate-800/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50')
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <span className="text-5xl mb-4 block">📁</span>
          <p className={`text-lg font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Перетащите файлы сюда
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            или нажмите для выбора • Поддержка: видео, фото, документы, код, архивы
          </p>
          <div className={`flex flex-wrap justify-center gap-2 mt-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-700/30">mp4</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-700/30">jpg</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-700/30">pdf</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-700/30">xlsx</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-700/30">js</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-700/30">zip</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-700/30">и др.</span>
          </div>
        </div>

        {/* Прогресс загрузки */}
        {progress.length > 0 && (
          <div className="mt-4 space-y-2">
            {progress.map((item, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                isDark ? 'bg-slate-700/50' : 'bg-slate-100'
              }`}>
                <span>{item.done ? '✅' : '⏳'}</span>
                <span className={`flex-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {item.name}
                </span>
                {item.done && <span className="text-xs text-emerald-500">Готово</span>}
              </div>
            ))}
          </div>
        )}

        {/* Добавление текстовой идеи */}
        <div className="mt-6">
          <button
            onClick={() => setShowIdeaInput(!showIdeaInput)}
            className={`text-sm font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
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
                className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${
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
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {uploading ? 'Сохранение...' : '💾 Сохранить идею'}
                </button>
                <button
                  onClick={() => setShowIdeaInput(false)}
                  className={`px-4 py-2 rounded-lg text-sm ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
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
