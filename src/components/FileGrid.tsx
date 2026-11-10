// Сетка/список файлов с красивыми карточками
import { useStore } from '../store';
import { getFileIcon, formatSize, CATEGORY_INFO } from '../lib/classifier';
import type { VaultFile } from '../lib/db';

export function FileGrid() {
  const { getFilteredFiles, viewMode, theme, loading } = useStore();
  const files = getFilteredFiles();
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-8xl animate-pulse">📭</div>
        <h2 className={`text-xl font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Хранилище пусто
        </h2>
        <p className={`text-sm text-center max-w-md ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Загрузите файлы или папку — они автоматически рассортируются по категориям
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Статистика */}
      <div className={`mb-4 flex items-center justify-between px-2`}>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Найдено: <span className="font-semibold text-indigo-500">{files.length}</span> файлов
        </p>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-1">
          {files.map(file => (
            <FileListItem key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {files.map(file => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}

// Карточка файла (grid view)
function FileCard({ file }: { file: VaultFile }) {
  const { setSelectedFile, toggleFavorite, theme } = useStore();
  const isDark = theme === 'dark';
  const categoryInfo = CATEGORY_INFO[file.type] || CATEGORY_INFO.other;

  return (
    <div
      className={`file-card group relative overflow-hidden ${
        isDark ? 'border-slate-700/50 bg-slate-800/50 hover:border-indigo-500/50 hover:shadow-indigo-500/10' : 'border-slate-200 bg-white hover:border-indigo-400 hover:shadow-indigo-500/20'
      } hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
      onClick={() => setSelectedFile(file.id)}
    >
      {/* Превью */}
      <div className="relative h-44 overflow-hidden">
        {file.previewData ? (
          <img 
            src={file.previewData} 
            alt={file.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${categoryInfo.color}`}>
            <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
              {categoryInfo.icon}
            </span>
          </div>
        )}
        
        {/* Градиентный оверлей */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Кнопки при наведении */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(file.id); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 ${
              file.isFavorite 
                ? 'bg-yellow-500/80 text-white' 
                : 'bg-black/30 text-white hover:bg-black/50'
            }`}
          >
            {file.isFavorite ? '★' : '☆'}
          </button>
        </div>

        {/* Бейдж категории */}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm ${
            isDark ? 'bg-black/50 text-white' : 'bg-white/80 text-slate-700'
          }`}>
            <span>{categoryInfo.icon}</span>
            <span>{categoryInfo.label}</span>
          </span>
        </div>

        {/* Индикатор избранного */}
        {file.isFavorite && (
          <div className="absolute top-3 left-3">
            <span className="text-yellow-400 text-xl drop-shadow-lg">★</span>
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="p-4">
        <h3 className={`font-semibold text-sm truncate mb-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          {file.name}
        </h3>
        <p className={`text-xs truncate mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {file.description.substring(0, 60)}
        </p>
        
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {formatSize(file.size)}
          </span>
          <div className="flex gap-1">
            {file.tags.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isDark ? 'bg-slate-700/50 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}
              >
                #{tag}
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
  const categoryInfo = CATEGORY_INFO[file.type] || CATEGORY_INFO.other;

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${
        isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
      } hover:scale-[1.01]`}
      onClick={() => setSelectedFile(file.id)}
    >
      {/* Иконка с градиентом */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${categoryInfo.color} shadow-lg`}>
        <span className="text-2xl">{categoryInfo.icon}</span>
      </div>
      
      {/* Информация */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          {file.name}
        </p>
        <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {file.folder} • {file.tags.slice(0, 3).join(', ')}
        </p>
      </div>
      
      {/* Метаданные */}
      <div className="flex items-center gap-4">
        <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {formatSize(file.size)}
        </span>
        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {new Date(file.createdAt).toLocaleDateString('ru-RU')}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(file.id); }}
          className={`text-xl transition-all hover:scale-110 ${
            file.isFavorite ? 'text-yellow-400' : (isDark ? 'text-slate-600' : 'text-slate-300')
          }`}
        >
          {file.isFavorite ? '★' : '☆'}
        </button>
      </div>
    </div>
  );
}
