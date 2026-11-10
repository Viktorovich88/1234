// Боковая панель — дерево папок, коллекции тегов, переключатель темы
import { useStore } from '../store';
import { CATEGORY_INFO } from '../lib/classifier';

export function Sidebar() {
  const {
    theme, toggleTheme, getFolders, getAllTags, files,
    filterFolder, setFilterFolder, filterType, setFilterType,
    filterFavorite, setFilterFavorite, setSidebarOpen,
  } = useStore();

  const folders = getFolders();
  const tags = getAllTags();
  
  // Группируем папки по корневой категории
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

  const isDark = theme === 'dark';

  return (
    <aside className={`sidebar scrollbar-thin ${isDark ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-slate-200'} backdrop-blur-xl`}>
      {/* Логотип */}
      <div className={`p-5 flex items-center gap-3 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
          🗄️
        </div>
        <div className="flex-1">
          <h1 className={`text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent`}>
            MyVault
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Моё Хранилище</p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
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
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30'
              : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')
          }`}
        >
          <span className="text-lg">📁</span>
          <span className="flex-1 font-medium">Все файлы</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-600'
          }`}>{files.length}</span>
        </button>
      </div>

      {/* Категории */}
      <div className="px-3 pb-2">
        <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 px-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Категории
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
                    ? `bg-gradient-to-r ${info.color} bg-opacity-20 text-white shadow-lg`
                    : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')
                }`}
              >
                <span className="text-lg">{info.icon}</span>
                <span className="flex-1 font-medium">{info.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-600'
                }`}>{count}</span>
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
              ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30'
              : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')
          }`}
        >
          <span className="text-lg">⭐</span>
          <span className="flex-1 font-medium">Избранное</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-600'
          }`}>
            {files.filter(f => f.isFavorite).length}
          </span>
        </button>
      </div>

      {/* Папки */}
      {folders.length > 0 && (
        <div className={`px-3 py-2 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 px-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Папки
          </h3>
          <div className="space-y-0.5 max-h-40 overflow-y-auto scrollbar-thin">
            {Object.entries(folderTree).map(([root, subs]) => (
              <div key={root}>
                <button
                  onClick={() => setFilterFolder(filterFolder === root ? '' : root)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 transition-all ${
                    filterFolder === root
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400'
                      : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')
                  }`}
                >
                  <span className="text-base">📂</span>
                  <span className="flex-1 truncate font-medium">{root}</span>
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {filterFolder === root ? '▾' : '▸'}
                  </span>
                </button>
                {filterFolder === root && subs.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setFilterFolder(filterFolder === sub ? '' : sub)}
                    className={`w-full text-left pl-10 pr-3 py-1.5 rounded-lg text-xs transition-all ${
                      filterFolder === sub
                        ? (isDark ? 'text-indigo-400 bg-indigo-500/10' : 'text-indigo-600 bg-indigo-50')
                        : (isDark ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50')
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
        <div className={`px-3 py-2 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 px-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Теги
          </h3>
          <div className="flex flex-wrap gap-1.5 px-3 max-h-32 overflow-y-auto scrollbar-thin">
            {tags.slice(0, 30).map(tag => (
              <span
                key={tag}
                className={`tag cursor-pointer hover:scale-105 transition-transform ${
                  isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Переключатель темы */}
      <div className={`mt-auto p-3 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
        <button
          onClick={toggleTheme}
          className={`w-full px-3 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-all ${
            isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
          <span className="font-medium">{isDark ? 'Светлая тема' : 'Тёмная тема'}</span>
        </button>
      </div>
    </aside>
  );
}
