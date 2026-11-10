// Боковая панель с иконками-черепами
import { useStore } from '../store';
import { CATEGORY_INFO } from '../lib/classifier';
import { getSkullIcon } from './SkullIcons';

export function Sidebar() {
  const {
    theme, getFolders, getAllTags, files,
    filterFolder, setFilterFolder, filterType, setFilterType,
    filterFavorite, setFilterFavorite, setSidebarOpen,
  } = useStore();

  const folders = getFolders();
  const tags = getAllTags();
  
  // Группируем папки
  const folderTree: Record<string, string[]> = {};
  folders.forEach(f => {
    const parts = f.split('/').filter(Boolean);
    const root = '/' + (parts[0] || 'Другое');
    if (!folderTree[root]) folderTree[root] = [];
    if (parts.length > 1) {
      folderTree[root].push(f);
    }
  });

  // Считаем файлы по типам
  const typeCounts: Record<string, number> = {};
  files.forEach(f => {
    typeCounts[f.type] = (typeCounts[f.type] || 0) + 1;
  });

  return (
    <aside className="sidebar scrollbar-thin">
      {/* Логотип */}
      <div className="p-5 flex items-center gap-3 border-b border-purple-500/20">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-purple-500/50 rounded-full" />
          <svg width="40" height="40" viewBox="0 0 100 100" className="relative animate-neon-pulse">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
              fill="url(#logoGrad)" stroke="#c4b5fd" strokeWidth="2" />
            <ellipse cx="38" cy="48" rx="7" ry="8" fill="#07060d" />
            <ellipse cx="62" cy="48" rx="7" ry="8" fill="#07060d" />
            <circle cx="38" cy="48" r="3" fill="#ec4899" className="animate-eye-glow" />
            <circle cx="62" cy="48" r="3" fill="#ec4899" className="animate-eye-glow" />
            <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            MYVAULT
          </h1>
          <p className="text-xs text-purple-400/60 font-mono">☠ SKULL STORAGE ☠</p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-lg hover:bg-purple-500/20 text-purple-400 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Все файлы */}
      <div className="p-3">
        <button
          onClick={() => { setFilterType(''); setFilterFolder(''); }}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-all ${
            !filterType && !filterFolder
              ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200 border border-purple-500/50 glow-purple'
              : 'text-slate-300 hover:bg-purple-500/10'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
            <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
              fill="#7c3aed" stroke="#c4b5fd" strokeWidth="2" />
            <ellipse cx="38" cy="48" rx="6" ry="7" fill="#07060d" />
            <ellipse cx="62" cy="48" rx="6" ry="7" fill="#07060d" />
            <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
          </svg>
          <span className="flex-1 font-semibold">Все файлы</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {files.length}
          </span>
        </button>
      </div>

      {/* Категории */}
      <div className="px-3 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider mb-2 px-3 text-purple-400/60 font-mono">
          ☠ КАТЕГОРИИ
        </h3>
        <div className="space-y-0.5 max-h-[40vh] overflow-y-auto scrollbar-thin">
          {Object.entries(CATEGORY_INFO).map(([type, info]) => {
            const count = typeCounts[type] || 0;
            if (count === 0) return null;
            
            return (
              <button
                key={type}
                onClick={() => { setFilterType(type); setFilterFolder(''); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-3 transition-all ${
                  filterType === type
                    ? `bg-gradient-to-r ${info.color} text-white shadow-lg`
                    : 'text-slate-300 hover:bg-purple-500/10'
                }`}
                style={filterType === type ? { boxShadow: `0 0 20px ${info.neon}40` } : {}}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {getSkullIcon(type, 24)}
                </div>
                <span className="flex-1 font-medium">{info.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/30 text-white/80">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Избранное */}
      <div className="px-3 py-2">
        <button
          onClick={() => setFilterFavorite(!filterFavorite)}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-all ${
            filterFavorite
              ? 'bg-gradient-to-r from-yellow-600/30 to-amber-600/30 text-yellow-200 border border-yellow-500/50'
              : 'text-slate-300 hover:bg-purple-500/10'
          }`}
        >
          <span className="text-xl">⭐</span>
          <span className="flex-1 font-semibold">Избранное</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">
            {files.filter(f => f.isFavorite).length}
          </span>
        </button>
      </div>

      {/* Папки */}
      {folders.length > 0 && (
        <div className="px-3 py-2 border-t border-purple-500/20">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2 px-3 text-purple-400/60 font-mono">
            📂 ПАПКИ
          </h3>
          <div className="space-y-0.5 max-h-40 overflow-y-auto scrollbar-thin">
            {Object.entries(folderTree).map(([root, subs]) => (
              <div key={root}>
                <button
                  onClick={() => setFilterFolder(filterFolder === root ? '' : root)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 transition-all ${
                    filterFolder === root
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200'
                      : 'text-slate-300 hover:bg-purple-500/10'
                  }`}
                >
                  <span className="text-base">📂</span>
                  <span className="flex-1 truncate font-medium">{root}</span>
                  <span className="text-xs text-purple-400/60">
                    {filterFolder === root ? '▾' : '▸'}
                  </span>
                </button>
                {filterFolder === root && subs.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setFilterFolder(filterFolder === sub ? '' : sub)}
                    className={`w-full text-left pl-10 pr-3 py-1.5 rounded-lg text-xs transition-all ${
                      filterFolder === sub
                        ? 'text-purple-300 bg-purple-500/10'
                        : 'text-slate-400 hover:text-slate-300 hover:bg-purple-500/10'
                    }`}
                  >
                    {sub.split('/').pop()}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Теги */}
      {tags.length > 0 && (
        <div className="px-3 py-2 border-t border-purple-500/20">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2 px-3 text-purple-400/60 font-mono">
            🏷️ ТЕГИ
          </h3>
          <div className="flex flex-wrap gap-1.5 px-3 max-h-32 overflow-y-auto scrollbar-thin">
            {tags.slice(0, 30).map(tag => (
              <span
                key={tag}
                className="tag cursor-pointer hover:scale-105 transition-transform"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Нижний блок */}
      <div className="mt-auto p-3 border-t border-purple-500/20">
        <div className="text-center text-xs text-purple-400/40 font-mono">
          <p>☠ RISE FROM THE GRAVE ☠</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
