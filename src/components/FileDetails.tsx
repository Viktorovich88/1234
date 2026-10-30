// Боковая панель с деталями файла — редактирование, теги, действия
import { useState } from 'react';
import { useStore } from '../store';
import { getFileIcon, formatSize } from '../lib/classifier';

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
      isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
    }`}>
      {/* Заголовок */}
      <div className={`p-4 border-b flex items-center gap-2 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <span className="text-xl">{getFileIcon(file.type)}</span>
        <h2 className={`font-semibold flex-1 truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          Детали файла
        </h2>
        <button
          onClick={() => { setShowDetails(false); setSelectedFile(null); }}
          className={`p-1 rounded ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          ✕
        </button>
      </div>

      {/* Превью */}
      <div className="p-4">
        {file.previewData ? (
          <img src={file.previewData} alt={file.name} className="w-full rounded-lg" />
        ) : (
          <div className={`w-full h-32 rounded-lg flex items-center justify-center text-5xl ${
            isDark ? 'bg-slate-800' : 'bg-slate-100'
          }`}>
            {getFileIcon(file.type)}
          </div>
        )}
      </div>

      {/* Название */}
      <div className="px-4 pb-3">
        <label className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Название</label>
        {editName ? (
          <div className="flex gap-1 mt-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`flex-1 px-2 py-1 rounded border text-sm ${
                isDark ? 'bg-slate-800 border-slate-600 text-slate-200' : 'bg-white border-slate-300'
              }`}
              autoFocus
            />
            <button onClick={handleSaveName} className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">✓</button>
            <button onClick={() => setEditName(false)} className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200'}`}>✕</button>
          </div>
        ) : (
          <p
            className={`text-sm font-medium cursor-pointer hover:underline ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
            onClick={() => setEditName(true)}
          >
            {file.name}
          </p>
        )}
      </div>

      {/* Описание */}
      <div className="px-4 pb-3">
        <label className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Описание</label>
        {editDesc ? (
          <div className="mt-1">
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className={`w-full px-2 py-1 rounded border text-sm resize-none ${
                isDark ? 'bg-slate-800 border-slate-600 text-slate-200' : 'bg-white border-slate-300'
              }`}
              autoFocus
            />
            <div className="flex gap-1 mt-1">
              <button onClick={handleSaveDesc} className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">Сохранить</button>
              <button onClick={() => setEditDesc(false)} className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200'}`}>Отмена</button>
            </div>
          </div>
        ) : (
          <p
            className={`text-sm cursor-pointer hover:underline line-clamp-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
            onClick={() => setEditDesc(true)}
          >
            {file.description || 'Нет описания (нажмите для добавления)'}
          </p>
        )}
      </div>

      {/* Теги */}
      <div className="px-4 pb-3">
        <label className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Теги</label>
        {editTags ? (
          <div className="mt-1">
            <input
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="через запятую"
              className={`w-full px-2 py-1 rounded border text-sm ${
                isDark ? 'bg-slate-800 border-slate-600 text-slate-200' : 'bg-white border-slate-300'
              }`}
              autoFocus
            />
            <div className="flex gap-1 mt-1">
              <button onClick={handleSaveTags} className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">Сохранить</button>
              <button onClick={() => setEditTags(false)} className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200'}`}>Отмена</button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-wrap gap-1 mt-1 cursor-pointer"
            onClick={() => setEditTags(true)}
          >
            {file.tags.map(tag => (
              <span key={tag} className={`tag ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-indigo-100 text-indigo-700'}`}>
                {tag}
              </span>
            ))}
            <span className={`tag ${isDark ? 'bg-slate-700/50 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>+</span>
          </div>
        )}
      </div>

      {/* Метаданные */}
      <div className={`px-4 pb-3 space-y-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <div className="flex justify-between text-xs">
          <span>Тип:</span>
          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{file.type}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>MIME:</span>
          <span className={`text-xs truncate ml-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{file.mime}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Размер:</span>
          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{formatSize(file.size)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Папка:</span>
          <span className={`truncate ml-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{file.folder}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Загружен:</span>
          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            {new Date(file.createdAt).toLocaleString('ru-RU')}
          </span>
        </div>
      </div>

      {/* Действия */}
      <div className={`px-4 pb-4 mt-auto space-y-2 border-t pt-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <button
          onClick={handleDownload}
          className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          📥 Скачать
        </button>
        
        <button
          onClick={() => setShowMove(!showMove)}
          className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          📁 Переместить
        </button>

        {showMove && (
          <div className="flex gap-1">
            <input
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              placeholder="Путь папки"
              list="folders-list"
              className={`flex-1 px-2 py-1 rounded border text-sm ${
                isDark ? 'bg-slate-800 border-slate-600 text-slate-200' : 'bg-white border-slate-300'
              }`}
            />
            <datalist id="folders-list">
              {folders.map(f => <option key={f} value={f} />)}
            </datalist>
            <button onClick={handleMove} className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">→</button>
          </div>
        )}

        <button
          onClick={handleDelete}
          className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-red-600/20 text-red-500 hover:bg-red-600/30 transition-colors"
        >
          🗑️ Удалить
        </button>
      </div>
    </aside>
  );
}
