// Сетка файлов с иконками-черепами и неоновыми эффектами
import { useStore } from '../store';
import { formatSize, CATEGORY_INFO } from '../lib/classifier';
import { getSkullIcon } from './SkullIcons';
import type { VaultFile } from '../lib/db';

export function FileGrid() {
  const { getFilteredFiles, viewMode, loading } = useStore();
  const files = getFilteredFiles();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-skull-float">
            <svg width="60" height="60" viewBox="0 0 100 100" className="animate-neon-pulse">
              <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
                fill="#7c3aed" stroke="#c4b5fd" strokeWidth="2" />
              <ellipse cx="38" cy="48" rx="7" ry="8" fill="#07060d" />
              <ellipse cx="62" cy="48" rx="7" ry="8" fill="#07060d" />
              <circle cx="38" cy="48" r="3" fill="#ec4899" className="animate-eye-glow" />
              <circle cx="62" cy="48" r="3" fill="#ec4899" className="animate-eye-glow" />
            </svg>
          </div>
          <p className="text-sm text-purple-400/60 font-mono">ЗАГРУЗКА ДАННЫХ...</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="animate-skull-float">
          <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-30">
            <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
              fill="#7c3aed" stroke="#c4b5fd" strokeWidth="2" />
            <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
            <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
            <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-purple-300/60">
          ХРАНИЛИЩЕ ПУСТО
        </h2>
        <p className="text-sm text-center max-w-md text-purple-400/40 font-mono">
          ЗАГРУЗИТЕ ФАЙЛЫ ИЛИ ПАПКУ — ОНИ АВТОМАТИЧЕСКИ РАССОРТИРУЮТСЯ ПО КАТЕГОРИЯМ
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Статистика */}
      <div className="mb-4 flex items-center justify-between px-2">
        <p className="text-sm text-purple-400/60 font-mono">
          НАЙДЕНО: <span className="font-bold text-purple-300">{files.length}</span> ФАЙЛОВ
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

// Карточка файла
function FileCard({ file }: { file: VaultFile }) {
  const { setSelectedFile, toggleFavorite } = useStore();
  const categoryInfo = CATEGORY_INFO[file.type] || CATEGORY_INFO.other;

  return (
    <div
      className="file-card group relative"
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
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${categoryInfo.color} relative`}>
            {/* Фоновая сетка */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              {getSkullIcon(file.type, 80)}
            </div>
            {/* Неоновое свечение */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity blur-2xl"
              style={{ background: `radial-gradient(circle, ${categoryInfo.neon} 0%, transparent 70%)` }}
            />
          </div>
        )}
        
        {/* Градиентный оверлей */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Кнопки при наведении */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(file.id); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 ${
              file.isFavorite 
                ? 'bg-yellow-500/80 text-white' 
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            {file.isFavorite ? '★' : '☆'}
          </button>
        </div>

        {/* Бейдж категории */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm bg-black/60 text-white border border-white/10">
            {getSkullIcon(file.type, 14)}
            <span>{categoryInfo.label}</span>
          </span>
        </div>

        {/* Избранное */}
        {file.isFavorite && (
          <div className="absolute top-3 left-3">
            <span className="text-yellow-400 text-xl drop-shadow-lg">★</span>
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="p-4">
        <h3 className="font-semibold text-sm truncate mb-1 text-slate-100">
          {file.name}
        </h3>
        <p className="text-xs truncate mb-3 text-purple-300/60">
          {file.description.substring(0, 60)}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-purple-400/60">
            {formatSize(file.size)}
          </span>
          <div className="flex gap-1">
            {file.tags.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className="tag text-[10px]"
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

// Элемент списка
function FileListItem({ file }: { file: VaultFile }) {
  const { setSelectedFile, toggleFavorite } = useStore();
  const categoryInfo = CATEGORY_INFO[file.type] || CATEGORY_INFO.other;

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all hover:bg-purple-500/10 hover:scale-[1.01]"
      onClick={() => setSelectedFile(file.id)}
    >
      {/* Иконка с градиентом */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${categoryInfo.color} shadow-lg relative overflow-hidden`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative">
          {getSkullIcon(file.type, 32)}
        </div>
      </div>
      
      {/* Информация */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate text-slate-200">
          {file.name}
        </p>
        <p className="text-xs truncate mt-0.5 text-purple-400/60">
          {file.folder} • {file.tags.slice(0, 3).join(', ')}
        </p>
      </div>
      
      {/* Метаданные */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-purple-400/60">
          {formatSize(file.size)}
        </span>
        <span className="text-xs text-purple-400/40">
          {new Date(file.createdAt).toLocaleDateString('ru-RU')}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(file.id); }}
          className={`text-xl transition-all hover:scale-110 ${
            file.isFavorite ? 'text-yellow-400' : 'text-slate-600'
          }`}
        >
          {file.isFavorite ? '★' : '☆'}
        </button>
      </div>
    </div>
  );
}
