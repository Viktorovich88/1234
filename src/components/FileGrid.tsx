// Сетка/список файлов с карточками
import { useStore } from '../store';
import { getFileIcon, formatSize } from '../lib/classifier';
import type { VaultFile } from '../lib/db';

export function FileGrid() {
  const { getFilteredFiles, viewMode, theme, loading } = useStore();
  const files = getFilteredFiles();
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Загрузка...
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <span className="text-6xl">📭</span>
        <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Хранилище пусто
        </p>
        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Загрузите файлы или добавьте идею, чтобы начать
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-1">
        {files.map(file => (
          <FileListItem key={file.id} file={file} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map(file => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
}

// Карточка файла (grid view)
function FileCard({ file }: { file: VaultFile }) {
  const { setSelectedFile, toggleFavorite, theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div
      className={`file-card group ${isDark ? 'border-slate-700 bg-slate-800 hover:border-indigo-500' : 'border-slate-200 bg-white hover:border-indigo-400'}`}
      onClick={() => setSelectedFile(file.id)}
    >
      {/* Превью */}
      <div className="relative h-40 overflow-hidden">
        {file.previewData ? (
          <img src={file.previewData} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-5xl ${
            isDark ? 'bg-slate-700/50' : 'bg-slate-50'
          }`}>
            {getFileIcon(file.type)}
          </div>
        )}
        
        {/* Оверлей при наведении */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(file.id); }}
            className={`p-2 rounded-full transition-all ${file.isFavorite ? 'text-yellow-400' : 'text-white hover:bg-white/20'}`}
          >
            {file.isFavorite ? '★' : '☆'}
          </button>
        </div>

        {/* Бейдж типа */}
        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium ${
          isDark ? 'bg-black/50 text-white' : 'bg-white/80 text-slate-700'
        }`}>
          {getFileIcon(file.type)} {file.type}
        </span>

        {/* Избранное */}
        {file.isFavorite && (
          <span className="absolute top-2 right-2 text-yellow-400 text-sm">★</span>
        )}
      </div>

      {/* Информация */}
      <div className="p-3">
        <h3 className={`font-medium text-sm truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          {file.name}
        </h3>
        <p className={`text-xs mt-1 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {file.description.substring(0, 60)}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {formatSize(file.size)}
          </span>
          <div className="flex gap-1">
            {file.tags.slice(0, 2).map(tag => (
              <span key={tag} className={`tag text-[10px] ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Элемент списка (list view)
function FileListItem({ file }: { file: VaultFile }) {
  const { setSelectedFile, toggleFavorite, theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
        isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
      }`}
      onClick={() => setSelectedFile(file.id)}
    >
      <span className="text-2xl">{getFileIcon(file.type)}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          {file.name}
        </p>
        <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {file.folder} · {file.tags.slice(0, 3).join(', ')}
        </p>
      </div>
      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {formatSize(file.size)}
      </span>
      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {new Date(file.createdAt).toLocaleDateString('ru-RU')}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); toggleFavorite(file.id); }}
        className={`text-lg ${file.isFavorite ? 'text-yellow-400' : (isDark ? 'text-slate-600' : 'text-slate-300')}`}
      >
        {file.isFavorite ? '★' : '☆'}
      </button>
    </div>
  );
}
