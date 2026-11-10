// Главный компонент приложения MyVault
import { useEffect, useState, useCallback } from 'react';
import { useStore } from './store';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { FileGrid } from './components/FileGrid';
import { FileDetails } from './components/FileDetails';
import { UploadZone } from './components/UploadZone';
import { PortfolioModal } from './components/PortfolioModal';
import { InstallPWA } from './components/InstallPWA';
import { InstallGuide } from './components/InstallGuide';
import { SplashScreen } from './components/SplashScreen';

export default function App() {
  const { theme, init, sidebarOpen, showUpload, showPortfolio, showDetails, setShowUpload, addFile } = useStore();
  const [globalDrag, setGlobalDrag] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    document.documentElement.className = 'dark'; // Всегда тёмная тема
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
    if (showUpload) return;
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
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

  // Заставка
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-skull-gradient text-slate-200">
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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-purple-900/30 backdrop-blur-sm border-4 border-dashed border-purple-500 pointer-events-none">
          <div className="text-center">
            <div className="animate-skull-float">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="mx-auto animate-neon-pulse">
                <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
                  fill="#7c3aed" stroke="#c4b5fd" strokeWidth="2" />
                <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
                <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
                <circle cx="38" cy="48" r="4" fill="#ec4899" />
                <circle cx="62" cy="48" r="4" fill="#ec4899" />
                <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-purple-300 neon-purple mt-4">ПОГЛОЩАЕМ ФАЙЛЫ...</p>
          </div>
        </div>
      )}

      {/* Компонент установки PWA */}
      <InstallPWA />
      
      {/* Инструкция по установке на телефон */}
      <InstallGuide />
    </div>
  );
}
