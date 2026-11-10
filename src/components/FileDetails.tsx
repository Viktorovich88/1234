// Панель деталей файла в стиле Dark Neon Skull
import { useState } from 'react';
import { useStore } from '../store';
import { formatSize, CATEGORY_INFO } from '../lib/classifier';
import { getSkullIcon } from './SkullIcons';

export function FileDetails() {
  const { selectedFileId, files, setShowDetails, setSelectedFile, updateFile, removeFile, moveFile, getFolders } = useStore();
  const file = files.find(f => f.id === selectedFileId);
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

  const handleSaveName = () => { updateFile(file.id, { name }); setEditName(false); };
  const handleSaveDesc = () => { updateFile(file.id, { description: desc }); setEditDesc(false); };
  const handleSaveTags = () => {
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    updateFile(file.id, { tags });
    setEditTags(false);
  };
  const handleMove = () => { if (newFolder) { moveFile(file.id, newFolder); setShowMove(false); } };
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
    <aside className="w-80 min-h-screen border-l flex flex-col overflow-y-auto scrollbar-thin border-purple-500/20 bg-gradient-to-b from-[#0a0914] to-[#0f0b1e]">
      {/* Заголовок */}
      <div className="p-4 border-b border-purple-500/20 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${categoryInfo.color} shadow-lg relative overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="relative">{getSkullIcon(file.type, 28)}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold truncate text-purple-200">Детали файла</h2>
          <p className="text-xs text-purple-400/60">{categoryInfo.label}</p>
        </div>
        <button
          onClick={() => { setShowDetails(false); setSelectedFile(null); }}
          className="p-2 rounded-lg hover:bg-purple-500/20 text-purple-400 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Превью */}
      <div className="p-4">
        {file.previewData ? (
          <img src={file.previewData} alt={file.name} className="w-full rounded-xl shadow-lg" />
        ) : (
          <div className={`w-full h-40 rounded-xl flex items-center justify-center bg-gradient-to-br ${categoryInfo.color} shadow-lg relative overflow-hidden`}>
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="relative animate-skull-float">
              {getSkullIcon(file.type, 80)}
            </div>
            <div 
              className="absolute inset-0 blur-2xl opacity-30"
              style={{ background: `radial-gradient(circle, ${categoryInfo.neon} 0%, transparent 70%)` }}
            />
          </div>
        )}
      </div>

      {/* Название */}
      <div className="px-4 pb-4">
        <label className="text-xs font-bold uppercase tracking-wider text-purple-400/60 font-mono">Название</label>
        {editName ? (
          <div className="flex gap-2 mt-2">
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field flex-1 text-sm" autoFocus />
            <button onClick={handleSaveName} className="px-3 py-2 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700">✓</button>
            <button onClick={() => setEditName(false)} className="px-3 py-2 text-sm bg-black/30 border border-purple-500/30 text-purple-300 rounded-xl">✕</button>
          </div>
        ) : (
          <p className="text-sm font-semibold mt-1 cursor-pointer hover:text-purple-300 transition-colors text-purple-100" onClick={() => setEditName(true)}>
            {file.name}
          </p>
        )}
      </div>

      {/* Описание */}
      <div className="px-4 pb-4">
        <label className="text-xs font-bold uppercase tracking-wider text-purple-400/60 font-mono">Описание</label>
        {editDesc ? (
          <div className="mt-2">
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="input-field w-full text-sm resize-none" autoFocus />
            <div className="flex gap-2 mt-2">
              <button onClick={handleSaveDesc} className="px-3 py-2 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700">Сохранить</button>
              <button onClick={() => setEditDesc(false)} className="px-3 py-2 text-sm bg-black/30 border border-purple-500/30 text-purple-300 rounded-xl">Отмена</button>
            </div>
          </div>
        ) : (
          <p className="text-sm mt-1 cursor-pointer hover:text-purple-300 transition-colors line-clamp-3 text-purple-200/80" onClick={() => setEditDesc(true)}>
            {file.description || 'Нет описания (нажмите для добавления)'}
          </p>
        )}
      </div>

      {/* Теги */}
      <div className="px-4 pb-4">
        <label className="text-xs font-bold uppercase tracking-wider text-purple-400/60 font-mono">Теги</label>
        {editTags ? (
          <div className="mt-2">
            <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="через запятую" className="input-field w-full text-sm" autoFocus />
            <div className="flex gap-2 mt-2">
              <button onClick={handleSaveTags} className="px-3 py-2 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700">Сохранить</button>
              <button onClick={() => setEditTags(false)} className="px-3 py-2 text-sm bg-black/30 border border-purple-500/30 text-purple-300 rounded-xl">Отмена</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 mt-2 cursor-pointer" onClick={() => setEditTags(true)}>
            {file.tags.map(tag => (
              <span key={tag} className="tag hover:scale-105 transition-transform">#{tag}</span>
            ))}
            <span className="tag opacity-50">+</span>
          </div>
        )}
      </div>

      {/* Метаданные */}
      <div className="px-4 pb-4 space-y-2">
        {[
          { label: 'Тип', value: categoryInfo.label },
          { label: 'Размер', value: formatSize(file.size) },
          { label: 'Папка', value: file.folder },
          { label: 'Загружен', value: new Date(file.createdAt).toLocaleString('ru-RU') },
        ].map(item => (
          <div key={item.label} className="flex justify-between text-xs p-2 rounded-lg bg-black/30 border border-purple-500/10">
            <span className="font-mono text-purple-400/60">{item.label}:</span>
            <span className="text-purple-200 truncate ml-2">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Действия */}
      <div className="px-4 pb-4 mt-auto space-y-2 border-t border-purple-500/20 pt-4">
        <button onClick={handleDownload} className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/30">
          📥 Скачать
        </button>
        <button onClick={() => setShowMove(!showMove)} className="w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] bg-black/30 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
          📁 Переместить
        </button>
        {showMove && (
          <div className="flex gap-2">
            <input value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder="Путь папки" list="folders-list" className="input-field flex-1 text-sm" />
            <datalist id="folders-list">{folders.map(f => <option key={f} value={f} />)}</datalist>
            <button onClick={handleMove} className="px-3 py-2 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700">→</button>
          </div>
        )}
        <button onClick={handleDelete} className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all hover:scale-[1.02] border border-red-500/30">
          🗑️ Удалить
        </button>
      </div>
    </aside>
  );
}
