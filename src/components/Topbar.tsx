// Верхняя панель — поиск, фильтры, кнопки загрузки и портфолио
import { useState, useCallback, useRef } from 'react';
import { useStore } from '../store';
import { SyncPanel } from './SyncPanel';

export function Topbar() {
  const {
    searchQuery, setSearchQuery, filterType, setFilterType,
    sortBy, setSortBy, sortOrder, setSortOrder, viewMode, setViewMode,
    setShowUpload, setShowPortfolio, sidebarOpen, setSidebarOpen,
    theme,
  } = useStore();
  
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showSync, setShowSync] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const isDark = theme === 'dark';

  const handleSearch = useCallback((value: string) => {
    setLocalQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
  }, [setSearchQuery]);

  return (
    <div className={`topbar ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
      {/* Кнопка сайдбара */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          ☰
        </button>
      )}

      {/* Поиск */}
      <div className="flex-1 max-w-md relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Поиск по названию, тегам, описанию..."
          className={`w-full pl-10 pr-4 py-2 rounded-lg border outline-none transition-colors focus:ring-2 focus:ring-indigo-500 ${
            isDark
              ? 'bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-400'
              : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
          }`}
        />
        {localQuery && (
          <button
            onClick={() => { setLocalQuery(''); setSearchQuery(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* Фильтр по типу */}
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className={`px-3 py-2 rounded-lg border text-sm ${
          isDark
            ? 'bg-slate-800 border-slate-600 text-slate-200'
            : 'bg-white border-slate-300 text-slate-700'
        }`}
      >
        <option value="">Все типы</option>
        <option value="video">🎬 Видео</option>
        <option value="image">🖼️ Фото</option>
        <option value="table">📊 Таблицы</option>
        <option value="doc">📄 Документы</option>
        <option value="code">💻 Код</option>
        <option value="link">🔗 Ссылки</option>
        <option value="idea">💡 Идеи</option>
        <option value="archive">📦 Архивы</option>
      </select>

      {/* Сортировка */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
        className={`px-3 py-2 rounded-lg border text-sm ${
          isDark
            ? 'bg-slate-800 border-slate-600 text-slate-200'
            : 'bg-white border-slate-300 text-slate-700'
        }`}
      >
        <option value="date">По дате</option>
        <option value="name">По имени</option>
        <option value="size">По размеру</option>
      </select>

      <button
        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
        className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        title={sortOrder === 'desc' ? 'По убыванию' : 'По возрастанию'}
      >
        {sortOrder === 'desc' ? '↓' : '↑'}
      </button>

      {/* Переключатель вида */}
      <div className={`flex rounded-lg border overflow-hidden ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-1.5 text-sm ${
            viewMode === 'grid'
              ? 'bg-indigo-600 text-white'
              : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500')
          }`}
        >
          ⊞
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-1.5 text-sm ${
            viewMode === 'list'
              ? 'bg-indigo-600 text-white'
              : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500')
          }`}
        >
          ☰
        </button>
      </div>

      {/* Кнопки действий */}
      <button
        onClick={() => setShowUpload(true)}
        className="px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors text-sm flex items-center gap-1"
      >
        <span>＋</span> Загрузить
      </button>
      
      <button
        onClick={() => setShowPortfolio(true)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-1 ${
          isDark ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
        }`}
      >
        <span>📋</span> Портфолио
      </button>

      <button
        onClick={() => setShowSync(true)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-1 ${
          isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
        }`}
      >
        <span>🔄</span> Синхронизация
      </button>

      {/* Модальное окно синхронизации */}
      {showSync && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowSync(false)}>
          <div className={`max-w-lg w-full mx-4 rounded-2xl shadow-2xl p-6 ${isDark ? 'bg-slate-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                🔄 Синхронизация
              </h2>
              <button
                onClick={() => setShowSync(false)}
                className={`p-1 rounded ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                ✕
              </button>
            </div>
            <SyncPanel />
          </div>
        </div>
      )}
    </div>
  );
}
