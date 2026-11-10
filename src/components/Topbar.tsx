// Верхняя панель в стиле Dark Neon Skull
import { useState, useCallback, useRef } from 'react';
import { useStore } from '../store';
import { SyncPanel } from './SyncPanel';

export function Topbar() {
  const {
    searchQuery, setSearchQuery, filterType, setFilterType,
    sortBy, setSortBy, sortOrder, setSortOrder, viewMode, setViewMode,
    setShowUpload, setShowPortfolio, sidebarOpen, setSidebarOpen,
  } = useStore();
  
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showSync, setShowSync] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = useCallback((value: string) => {
    setLocalQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
  }, [setSearchQuery]);

  return (
    <div className="topbar">
      {/* Кнопка сайдбара */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2.5 rounded-xl transition-all hover:scale-105 hover:bg-purple-500/20 text-purple-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Поиск */}
      <div className="flex-1 max-w-md relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/60 group-focus-within:text-purple-400 transition-colors">
          🔍
        </span>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Поиск по названию, тегам, описанию..."
          className="input-field w-full pl-12 pr-10"
        />
        {localQuery && (
          <button
            onClick={() => { setLocalQuery(''); setSearchQuery(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-purple-400 hover:text-purple-200 hover:bg-purple-500/20 transition-all"
          >
            ✕
          </button>
        )}
      </div>

      {/* Фильтр по типу */}
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="input-field text-sm font-medium"
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
        className="input-field text-sm font-medium"
      >
        <option value="date">По дате</option>
        <option value="name">По имени</option>
        <option value="size">По размеру</option>
      </select>

      <button
        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
        className="p-2.5 rounded-xl transition-all hover:scale-105 hover:bg-purple-500/20 text-purple-400"
        title={sortOrder === 'desc' ? 'По убыванию' : 'По возрастанию'}
      >
        {sortOrder === 'desc' ? '↓' : '↑'}
      </button>

      {/* Переключатель вида */}
      <div className="flex rounded-xl border border-purple-500/20 overflow-hidden">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-2 text-sm transition-all ${
            viewMode === 'grid'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'bg-black/30 text-purple-400 hover:bg-purple-500/20'
          }`}
        >
          ⊞
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-3 py-2 text-sm transition-all ${
            viewMode === 'list'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'bg-black/30 text-purple-400 hover:bg-purple-500/20'
          }`}
        >
          ☰
        </button>
      </div>

      {/* Кнопки действий */}
      <button
        onClick={() => setShowUpload(true)}
        className="btn-primary text-sm flex items-center gap-2"
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
        className="px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 text-sm flex items-center gap-2 bg-black/30 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
      >
        <span className="text-lg">🔄</span> Синхронизация
      </button>

      {/* Модальное окно синхронизации */}
      {showSync && (
        <div className="modal-overlay" onClick={() => setShowSync(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-200">
                🔄 Синхронизация
              </h2>
              <button
                onClick={() => setShowSync(false)}
                className="p-2 rounded-lg hover:bg-purple-500/20 text-purple-400"
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
