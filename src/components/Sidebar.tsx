// Боковая панель — дерево папок, коллекции тегов, переключатель темы
import { useStore } from '../store';
import { getFileIcon } from '../lib/classifier';

const TYPE_LABELS: Record<string, string> = {
  video: 'Видео', image: 'Фото', table: 'Таблицы', doc: 'Документы',
  code: 'Код', link: 'Сайты', idea: 'Идеи', archive: 'Архивы', other: 'Другое',
};

const TYPE_ICONS: Record<string, string> = {
  video: '🎬', image: '🖼️', table: '📊', doc: '📄',
  code: '💻', link: '🔗', idea: '💡', archive: '📦', other: '📎',
};

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
    <aside className={`sidebar scrollbar-thin ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
      {/* Логотип */}
      <div className="p-4 flex items-center gap-3 border-b border-inherit">
        <span className="text-2xl">🗄️</span>
        <div>
          <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>MyVault</h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Моё Хранилище</p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className={`ml-auto p-1 rounded ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          ✕
        </button>
      </div>

      {/* Типы файлов */}
      <div className="p-3">
        <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 px-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Типы
        </h3>
        <div className="space-y-0.5">
          <button
            onClick={() => { setFilterType(''); setFilterFolder(''); }}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              !filterType && !filterFolder
                ? (isDark ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-700')
                : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')
            }`}
          >
            <span>📁</span>
            <span className="flex-1">Все файлы</span>
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{files.length}</span>
          </button>
          {Object.entries(TYPE_LABELS).map(([type, label]) => (
            <button
              key={type}
              onClick={() => { setFilterType(type); setFilterFolder(''); }}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                filterType === type
                  ? (isDark ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-700')
                  : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')
              }`}
            >
              <span>{TYPE_ICONS[type]}</span>
              <span className="flex-1">{label}</span>
              <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{typeCounts[type] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Избранное */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setFilterFavorite(!filterFavorite)}
          className={`w-full text-left px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
            filterFavorite
              ? (isDark ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700')
              : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')
          }`}
        >
          <span>⭐</span>
          <span>Избранное</span>
          <span className={`text-xs ml-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {files.filter(f => f.isFavorite).length}
          </span>
        </button>
      </div>

      {/* Папки */}
      {folders.length > 0 && (
        <div className="p-3 border-t border-inherit">
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 px-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Папки
          </h3>
          <div className="space-y-0.5 max-h-48 overflow-y-auto scrollbar-thin">
            {Object.entries(folderTree).map(([root, subs]) => (
              <div key={root}>
                <button
                  onClick={() => setFilterFolder(filterFolder === root ? '' : root)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    filterFolder === root
                      ? (isDark ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-700')
                      : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')
                  }`}
                >
                  <span>{getFileIcon(root.replace('/', '').toLowerCase()) || '📁'}</span>
                  <span className="flex-1 truncate">{root}</span>
                </button>
                {filterFolder === root && subs.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setFilterFolder(filterFolder === sub ? '' : sub)}
                    className={`w-full text-left pl-8 pr-3 py-1 rounded-lg text-xs transition-colors ${
                      filterFolder === sub
                        ? (isDark ? 'text-indigo-400' : 'text-indigo-600')
                        : (isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')
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
        <div className="p-3 border-t border-inherit">
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 px-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Теги
          </h3>
          <div className="flex flex-wrap gap-1 px-2 max-h-32 overflow-y-auto scrollbar-thin">
            {tags.slice(0, 30).map(tag => (
              <span
                key={tag}
                className={`tag cursor-pointer hover:opacity-80 ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Переключатель темы */}
      <div className="mt-auto p-3 border-t border-inherit space-y-1">
        <button
          onClick={toggleTheme}
          className={`w-full px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
            isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>{isDark ? '☀️' : '🌙'}</span>
          <span>{isDark ? 'Светлая тема' : 'Тёмная тема'}</span>
        </button>
      </div>
    </aside>
  );
}
