// Модальное окно создания портфолио — выбор работ, стиль, предпросмотр
import { useState, useRef } from 'react';
import { useStore } from '../store';
import { getFileIcon } from '../lib/classifier';

export function PortfolioModal() {
  const { theme, setShowPortfolio, files, portfolios, createPortfolio } = useStore();
  const isDark = theme === 'dark';
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [name, setName] = useState('Моё портфолио');
  const [style, setStyle] = useState<'minimal' | 'dark' | 'bright'>('minimal');
  const [generating, setGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === files.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(files.map(f => f.id));
    }
  };

  const handleGenerate = async () => {
    if (selectedIds.length === 0 || !name.trim()) return;
    setGenerating(true);
    try {
      const portfolio = await createPortfolio(name.trim(), style, selectedIds);
      setGeneratedHtml(portfolio.html);
      setPortfolioId(portfolio.id);
    } catch (e) {
      console.error('Ошибка генерации:', e);
    }
    setGenerating(false);
  };

  const handleDownload = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.print();
  };

  // Если портфолио сгенерировано — показываем предпросмотр
  if (generatedHtml) {
    return (
      <div className="modal-overlay" onClick={() => setShowPortfolio(false)}>
        <div
          className={`modal-content max-w-4xl ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: '95vh', width: '95vw' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ✅ Портфолио готово!
            </h2>
            <div className="flex gap-2">
              <button onClick={handleDownload} className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">
                📥 Скачать HTML
              </button>
              <button onClick={handlePrint} className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700">
                🖨️ Печать в PDF
              </button>
              <button
                onClick={() => { setGeneratedHtml(null); setPortfolioId(null); }}
                className={`px-4 py-2 rounded-lg text-sm ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
              >
                ← Назад
              </button>
              <button
                onClick={() => setShowPortfolio(false)}
                className={`p-2 rounded ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                ✕
              </button>
            </div>
          </div>
          <iframe
            ref={iframeRef}
            srcDoc={generatedHtml}
            className="w-full rounded-lg border"
            style={{ height: '75vh', borderColor: isDark ? '#334155' : '#e2e8f0' }}
            title="Предпросмотр портфолио"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => setShowPortfolio(false)}>
      <div
        className={`modal-content ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            📋 Собрать портфолио
          </h2>
          <button
            onClick={() => setShowPortfolio(false)}
            className={`p-1 rounded ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            ✕
          </button>
        </div>

        {/* Название */}
        <div className="mb-4">
          <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Название портфолио
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full mt-1 px-3 py-2 rounded-lg border text-sm ${
              isDark ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
            }`}
            placeholder="Моё портфолио"
          />
        </div>

        {/* Выбор стиля */}
        <div className="mb-4">
          <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Стиль оформления
          </label>
          <div className="flex gap-2 mt-2">
            {(['minimal', 'dark', 'bright'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                  style === s
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : (isDark ? 'border-slate-600 text-slate-400 hover:border-slate-500' : 'border-slate-200 text-slate-600 hover:border-slate-300')
                }`}
              >
                {s === 'minimal' && '⬜ Минимал'}
                {s === 'dark' && '🌑 Тёмный'}
                {s === 'bright' && '🌈 Яркий'}
              </button>
            ))}
          </div>
        </div>

        {/* Выбор работ */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Выберите работы ({selectedIds.length} из {files.length})
            </label>
            <button
              onClick={selectAll}
              className={`text-xs ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
            >
              {selectedIds.length === files.length ? 'Снять все' : 'Выбрать все'}
            </button>
          </div>
          <div className={`max-h-64 overflow-y-auto rounded-lg border p-2 space-y-1 scrollbar-thin ${
            isDark ? 'border-slate-600 bg-slate-700/30' : 'border-slate-200 bg-slate-50'
          }`}>
            {files.length === 0 ? (
              <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Нет файлов для выбора
              </p>
            ) : (
              files.map(file => (
                <label
                  key={file.id}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                    selectedIds.includes(file.id)
                      ? (isDark ? 'bg-indigo-600/20' : 'bg-indigo-50')
                      : (isDark ? 'hover:bg-slate-700' : 'hover:bg-white')
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(file.id)}
                    onChange={() => toggleSelect(file.id)}
                    className="rounded"
                  />
                  <span>{getFileIcon(file.type)}</span>
                  <span className={`text-sm flex-1 truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {file.name}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {file.type}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Сохранённые портфолио */}
        {portfolios.length > 0 && (
          <div className="mb-4">
            <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Сохранённые портфолио
            </label>
            <div className="mt-1 space-y-1">
              {portfolios.map(p => (
                <div key={p.id} className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm ${
                  isDark ? 'bg-slate-700/50 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  <span>📋</span>
                  <span className="flex-1">{p.name}</span>
                  <span className="text-xs opacity-60">{p.style}</span>
                  <button
                    onClick={() => { setGeneratedHtml(p.html); setPortfolioId(p.id); }}
                    className="text-xs text-indigo-500 hover:text-indigo-400"
                  >
                    Открыть
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Кнопка генерации */}
        <button
          onClick={handleGenerate}
          disabled={selectedIds.length === 0 || !name.trim() || generating}
          className="w-full px-4 py-3 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {generating ? '⏳ Генерация...' : `✨ Сгенерировать портфолио (${selectedIds.length} работ)`}
        </button>
      </div>
    </div>
  );
}
