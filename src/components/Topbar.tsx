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
    <div className={`topbar ${isDark ? 'border-slate-700/50 bg-slate-900/95' : 'border-slate-200 bg-white/95'} backdrop-blur-xl`}>
      {/* Кнопка сайдбара */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={`p-2.5 rounded-xl transition-all hover:scale-105 ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Поиск */}
      <div className="flex-1 max-w-md relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          🔍
        </span>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Поиск по названию, тегам, описанию..."
          className={`w-full pl-12 pr-10 py-2.5 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 ${
            isDark
              ? 'bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-400'
              : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
          }`}
        />
        {localQuery && (
          <button
            onClick={() => { setLocalQuery(''); setSearchQuery(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-all"
          >
            ✕
          </button>
        )}
      </div>

      {/* Фильтр по типу */}
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className={`px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500/50 ${
          isDark
            ? 'bg-slate-800/50 border-slate-700 text-slate-200'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <option value="">Все типы</option>
        <option value="video">🎬 Видео</option>
        <option value="audio">🎵 Аудио</option>
        <option value="image">📷 Фото</option>
        <option value="3d">🧊 3D</option>
        <option value="docs">📄 Документы</option>
        <option value="text">📝 Текст</option>
        <option value="presentation">📊 Презентации</option>
        <option value="tables">📈 Таблицы</option>
        <option value="code">💻 Код</option>
        <option value="data">🗃️ Данные</option>
        <option value="design">🎨 Дизайн</option>
        <option value="archives">📦 Архивы</option>
        <option value="fonts">🔤 Шрифты</option>
        <option value="cad">📐 Чертежи</option>
        <option value="link">🔗 Ссылки</option>
        <option value="idea">💡 Идеи</option>
      </select>

      {/* Сортировка */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
        className={`px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500/50 ${
          isDark
            ? 'bg-slate-800/50 border-slate-700 text-slate-200'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <option value="date">По дате</option>
        <option value="name">По имени</option>
        <option value="size">По размеру</option>
      </select>

      <button
        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
        className={`p-2.5 rounded-xl transition-all hover:scale-105 ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        title={sortOrder === 'desc' ? 'По убыванию' : 'По возрастанию'}
      >
        {sortOrder === 'desc' ? '↓' : '↑'}
      </button>

      {/* Переключатель вида */}
      <div className={`flex rounded-xl border overflow-hidden ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-2 text-sm transition-all ${
            viewMode === 'grid'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
              : (isDark ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100')
          }`}
        >
          ⊞
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-2 text-sm transition-all ${
            viewMode === 'list'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
              : (isDark ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100')
          }`}
        >
          ☰
        </button>
      </div>

      {/* Кнопки действий */}
      <button
        onClick={() => setShowUpload(true)}
        className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 shadow-lg shadow-indigo-500/30 text-sm flex items-center gap-2"
      >
        <span className="text-lg">＋</span> Загрузить
      </button>
      
      <button
        onClick={() => setShowPortfolio(true)}
        className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all hover:scale-105 shadow-lg shadow-emerald-500/30 text-sm flex items-center gap-2"
      >
        <span className="text-lg">📋</span> Портфолио
      </button>

      <button
        onClick={() => setShowSync(true)}
        className={`px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 text-sm flex items-center gap-2 ${
          isDark 
            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
        }`}
      >
        <span className="text-lg">🔄</span> Синхронизация
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
