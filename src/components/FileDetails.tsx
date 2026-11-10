// Боковая панель с деталями файла — редактирование, теги, действия
import { useState } from 'react';
import { useStore } from '../store';
import { getFileIcon, formatSize, CATEGORY_INFO } from '../lib/classifier';

export function FileDetails() {
  const { selectedFileId, files, theme, setShowDetails, setSelectedFile, updateFile, removeFile, moveFile, getFolders } = useStore();
  const file = files.find(f => f.id === selectedFileId);
  const isDark = theme === 'dark';
  const folders = getFolders();

  const [editName, setEditName] = useState(false);
  const [editDesc, setEditDesc] = useState(false);
  const [editTags, setEditTags] = useState(false);
  const [name, setName] = useState(file?.name || '');
  const [desc, setDesc] = useState(file?.description || '');
  const [tagsStr, setTagsStr] = useState(file?.tags.join(', ') || '');
  const [showMove, setShowMove] = useState(false);
  const [newFolder, setNewFolder] = useState('');

  if (!file) return null;

  const categoryInfo = CATEGORY_INFO[file.type] || CATEGORY_INFO.other;

  const handleSaveName = () => {
    updateFile(file.id, { name });
    setEditName(false);
  };

  const handleSaveDesc = () => {
    updateFile(file.id, { description: desc });
    setEditDesc(false);
  };

  const handleSaveTags = () => {
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    updateFile(file.id, { tags });
    setEditTags(false);
  };

  const handleMove = () => {
    if (newFolder) {
      moveFile(file.id, newFolder);
      setShowMove(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Удалить файл из хранилища?')) {
      removeFile(file.id);
      setShowDetails(false);
      setSelectedFile(null);
    }
  };

  const handleDownload = () => {
    if (file.blobData) {
      const blob = new Blob([file.blobData], { type: file.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <aside className={`w-80 min-h-screen border-l flex flex-col overflow-y-auto scrollbar-thin ${
      isDark ? 'border-slate-700/50 bg-slate-900/95' : 'border-slate-200 bg-white/95'
    } backdrop-blur-xl`}>
      {/* Заголовок */}
      <div className={`p-4 border-b flex items-center gap-3 ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${categoryInfo.color} shadow-lg`}>
          <span className="text-xl">{categoryInfo.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Детали файла
          </h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {categoryInfo.label}
          </p>
        </div>
        <button
          onClick={() => { setShowDetails(false); setSelectedFile(null); }}
          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          ✕
        </button>
      </div>

      {/* Превью */}
      <div className="p-4">
        {file.previewData ? (
          <img src={file.previewData} alt={file.name} className="w-full rounded-xl shadow-lg" />
        ) : (
          <div className={`w-full h-40 rounded-xl flex items-center justify-center bg-gradient-to-br ${categoryInfo.color} shadow-lg`}>
            <span className="text-6xl">{categoryInfo.icon}</span>
          </div>
        )}
      </div>

      {/* Название */}
      <div className="px-4 pb-4">
        <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Название
        </label>
        {editName ? (
          <div className="flex gap-2 mt-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`flex-1 px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-800 border-slate-600 text-slate-200' : 'bg-white border-slate-300'
              }`}
              autoFocus
            />
            <button onClick={handleSaveName} className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">✓</button>
            <button onClick={() => setEditName(false)} className={`px-3 py-2 text-sm rounded-xl ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200'}`}>✕</button>
          </div>
        ) : (
          <p
            className={`text-sm font-semibold mt-1 cursor-pointer hover:underline ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
            onClick={() => setEditName(true)}
          >
            {file.name}
          </p>
        )}
      </div>

      {/* Описание */}
      <div className="px-4 pb-4">
        <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Описание
        </label>
        {editDesc ? (
          <div className="mt-2">
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 rounded-xl border text-sm resize-none outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-800 border-slate-600 text-slate-200' : 'bg-white border-slate-300'
              }`}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handleSaveDesc} className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Сохранить</button>
              <button onClick={() => setEditDesc(false)} className={`px-3 py-2 text-sm rounded-xl ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200'}`}>Отмена</button>
            </div>
          </div>
        ) : (
          <p
            className={`text-sm mt-1 cursor-pointer hover:underline line-clamp-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
            onClick={() => setEditDesc(true)}
          >
            {file.description || 'Нет описания (нажмите для добавления)'}
          </p>
        )}
      </div>

      {/* Теги */}
      <div className="px-4 pb-4">
        <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Теги
        </label>
        {editTags ? (
          <div className="mt-2">
            <input
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="через запятую"
              className={`w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-800 border-slate-600 text-slate-200' : 'bg-white border-slate-300'
              }`}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handleSaveTags} className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Сохранить</button>
              <button onClick={() => setEditTags(false)} className={`px-3 py-2 text-sm rounded-xl ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200'}`}>Отмена</button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-wrap gap-1.5 mt-2 cursor-pointer"
            onClick={() => setEditTags(true)}
          >
            {file.tags.map(tag => (
              <span key={tag} className={`tag hover:scale-105 transition-transform ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-indigo-100 text-indigo-700'}`}>
                #{tag}
              </span>
            ))}
            <span className={`tag ${isDark ? 'bg-slate-700/50 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>+</span>
          </div>
        )}
      </div>

      {/* Метаданные */}
      <div className={`px-4 pb-4 space-y-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <div className={`flex justify-between text-xs p-2 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <span className="font-medium">Тип:</span>
          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{categoryInfo.label}</span>
        </div>
        <div className={`flex justify-between text-xs p-2 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <span className="font-medium">Размер:</span>
          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{formatSize(file.size)}</span>
        </div>
        <div className={`flex justify-between text-xs p-2 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <span className="font-medium">Папка:</span>
          <span className={`truncate ml-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{file.folder}</span>
        </div>
        <div className={`flex justify-between text-xs p-2 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <span className="font-medium">Загружен:</span>
          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            {new Date(file.createdAt).toLocaleString('ru-RU')}
          </span>
        </div>
      </div>

      {/* Действия */}
      <div className={`px-4 pb-4 mt-auto space-y-2 border-t pt-4 ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
        <button
          onClick={handleDownload}
          className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/30"
        >
          📥 Скачать
        </button>
        
        <button
          onClick={() => setShowMove(!showMove)}
          className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] ${
            isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          📁 Переместить
        </button>

        {showMove && (
          <div className="flex gap-2">
            <input
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              placeholder="Путь папки"
              list="folders-list"
              className={`flex-1 px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark ? 'bg-slate-800 border-slate-600 text-slate-200' : 'bg-white border-slate-300'
              }`}
            />
            <datalist id="folders-list">
              {folders.map(f => <option key={f} value={f} />)}
            </datalist>
            <button onClick={handleMove} className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">→</button>
          </div>
        )}

        <button
          onClick={handleDelete}
          className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-red-600/20 text-red-500 hover:bg-red-600/30 transition-all hover:scale-[1.02]"
        >
          🗑️ Удалить
        </button>
      </div>
    </aside>
  );
}
