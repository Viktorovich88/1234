// Компонент установки PWA и выбора папки хранения
import { useState, useEffect } from 'react';
import { useStore } from '../store';

export function InstallPWA() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Проверяем, установлено ли уже приложение
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Слушаем событие beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowInstall(false);
    }
    
    setDeferredPrompt(null);
  };

  if (isInstalled || !showInstall) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-sm rounded-xl shadow-2xl p-4 border ${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl">📲</span>
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Установить приложение
          </h3>
          <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            MyVault можно установить как обычное приложение на компьютер или телефон
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Установить
            </button>
            <button
              onClick={() => setShowInstall(false)}
              className={`px-4 py-2 rounded-lg text-sm ${
                isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } transition-colors`}
            >
              Позже
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
