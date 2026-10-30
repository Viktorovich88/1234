// Главный компонент приложения MyVault
import { useEffect, useState, useCallback } from 'react';
import { useStore } from './store';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { FileGrid } from './components/FileGrid';
import { FileDetails } from './components/FileDetails';
import { UploadZone } from './components/UploadZone';
import { PortfolioModal } from './components/PortfolioModal';

export default function App() {
  const { theme, init, sidebarOpen, showUpload, showPortfolio, showDetails, setShowUpload, addFile } = useStore();
  const [globalDrag, setGlobalDrag] = useState(false);

  useEffect(() => {
    // Применяем тему
    document.documentElement.className = theme;
    // Инициализируем данные
    init();
  }, []);

  // Глобальный drag & drop
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer?.types.includes('Files')) {
      setGlobalDrag(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    if (e.relatedTarget === null) {
      setGlobalDrag(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    setGlobalDrag(false);
    // Если UploadZone уже открыт — пусть он обрабатывает
    if (showUpload) return;
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      // Обрабатываем файлы напрямую при глобальном drop
      for (let i = 0; i < files.length; i++) {
        await addFile(files[i]);
      }
    }
  }, [addFile, showUpload]);

  useEffect(() => {
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      {/* Боковая панель */}
      {sidebarOpen && <Sidebar />}
      
      {/* Основная область */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <FileGrid />
        </main>
      </div>
      
      {/* Панель деталей файла */}
      {showDetails && <FileDetails />}
      
      {/* Модальные окна */}
      {showUpload && <UploadZone />}
      {showPortfolio && <PortfolioModal />}

      {/* Глобальная зона перетаскивания */}
      {globalDrag && !showUpload && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-indigo-600/20 backdrop-blur-sm border-4 border-dashed border-indigo-500 pointer-events-none">
          <div className="text-center">
            <span className="text-6xl block mb-4">📥</span>
            <p className="text-xl font-bold text-indigo-400">Отпустите файлы для загрузки</p>
          </div>
        </div>
      )}
    </div>
  );
}
