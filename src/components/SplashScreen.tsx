// Заставка приложения с кинематографическим фоном
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'ready'>('loading');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Предзагрузка изображения
    const img = new Image();
    img.src = '/images/splash-bg.png';
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase('ready');
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* Кинематографический фон */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundImage: `url('/images/splash-bg.png')`,
        }}
      />
      
      {/* Fallback градиент если изображение не загрузилось */}
      <div className={`absolute inset-0 bg-skull-gradient transition-opacity duration-1000 ${imageLoaded ? 'opacity-40' : 'opacity-100'}`} />
      
      {/* Затемнение */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Фоновая сетка */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      {/* Анимированные линии */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent animate-scanline" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent animate-scanline" style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-pink-500/50 to-transparent animate-scanline" style={{ animationDelay: '2s' }} />
      </div>

      {/* Центральный контент */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Большой череп */}
        <div className="relative animate-skull-float">
          {/* Кинематографическое изображение черепа */}
          <div className="relative">
            <img 
              src="/images/splash-skull.png"
              alt="Skull"
              className="w-64 h-64 object-contain animate-neon-pulse drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]"
              onError={(e) => {
                // Fallback на SVG если изображение не загрузилось
                (e.target as HTMLImageElement).style.display = 'none';
                const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            {/* SVG fallback */}
            <svg width="256" height="256" viewBox="0 0 200 200" className="relative animate-neon-pulse hidden" style={{display: 'none'}}>
              <defs>
                <linearGradient id="mainSkullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <filter id="mainGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <radialGradient id="eyeGlow">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#a855f7" />
                </radialGradient>
              </defs>
              <path d="M100 30 C60 30 36 60 36 100 C36 124 44 140 56 150 L56 164 L72 164 L72 176 L88 176 L88 164 L112 164 L112 176 L128 176 L128 164 L144 164 L144 150 C156 140 164 124 164 100 C164 60 140 30 100 30 Z" 
                fill="url(#mainSkullGrad)" stroke="#c4b5fd" strokeWidth="2" filter="url(#mainGlow)" />
              <ellipse cx="76" cy="96" rx="16" ry="18" fill="#07060d" />
              <ellipse cx="124" cy="96" rx="16" ry="18" fill="#07060d" />
              <ellipse cx="76" cy="96" rx="10" ry="12" fill="url(#eyeGlow)" className="animate-eye-glow" />
              <ellipse cx="124" cy="96" rx="10" ry="12" fill="url(#eyeGlow)" className="animate-eye-glow" style={{ animationDelay: '0.5s' }} />
              <circle cx="76" cy="96" r="4" fill="#fff" opacity="0.8" />
              <circle cx="124" cy="96" r="4" fill="#fff" opacity="0.8" />
              <path d="M100 116 L92 136 L108 136 Z" fill="#07060d" />
              <rect x="76" y="150" width="8" height="12" fill="#07060d" rx="2" />
              <rect x="88" y="150" width="8" height="12" fill="#07060d" rx="2" />
              <rect x="100" y="150" width="8" height="12" fill="#07060d" rx="2" />
              <rect x="112" y="150" width="8" height="12" fill="#07060d" rx="2" />
            </svg>
          </div>
          
          {/* Свечение */}
          <div className="absolute inset-0 blur-3xl bg-purple-500/30 rounded-full scale-150 -z-10" />
        </div>

        {/* Название */}
        <div className="text-center">
          <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            MYVAULT
          </h1>
          <p className="text-xl text-purple-300/80 mt-3 tracking-[0.3em] uppercase font-light neon-purple">
            ☠ Хранилище Мёртвых Файлов ☠
          </p>
        </div>

        {/* Прогресс-бар */}
        <div className="w-80">
          <div className="h-1.5 bg-black/50 rounded-full overflow-hidden border border-purple-500/30 backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-100 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between mt-3 text-xs text-purple-400/60 font-mono">
            <span>{phase === 'loading' ? 'ИНИЦИАЛИЗАЦИЯ КРИПТ...' : '☠ ГОТОВО К РАБОТЕ ☠'}</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Статус */}
        <div className="text-center text-xs text-purple-400/40 font-mono space-y-1 backdrop-blur-sm bg-black/20 px-6 py-3 rounded-xl border border-purple-500/10">
          <p>☠ ЗАГРУЗКА ЧЕРЕПОВ... ✓</p>
          <p>☠ ИНИЦИАЛИЗАЦИЯ НЕОНА... ✓</p>
          <p className={progress > 50 ? 'text-purple-400/80' : ''}>
            ☠ ПОДГОТОВКА ХРАНИЛИЩА... {progress > 50 ? '✓' : '...'}
          </p>
        </div>
      </div>

      {/* Угловые декорации */}
      <div className="absolute top-6 left-6 text-purple-500/40 font-mono text-xs backdrop-blur-sm bg-black/30 px-3 py-2 rounded-lg border border-purple-500/20">
        <p>v1.0.0</p>
        <p>SKULL_OS</p>
      </div>
      <div className="absolute top-6 right-6 text-purple-500/40 font-mono text-xs text-right backdrop-blur-sm bg-black/30 px-3 py-2 rounded-lg border border-purple-500/20">
        <p>SYSTEM: ONLINE</p>
        <p>STATUS: {phase === 'ready' ? 'READY' : 'BOOTING'}</p>
      </div>
      <div className="absolute bottom-6 left-6 text-purple-500/40 font-mono text-xs backdrop-blur-sm bg-black/30 px-3 py-2 rounded-lg border border-purple-500/20">
        <p>☠ RISE FROM THE GRAVE ☠</p>
      </div>
      <div className="absolute bottom-6 right-6 text-purple-500/40 font-mono text-xs text-right backdrop-blur-sm bg-black/30 px-3 py-2 rounded-lg border border-purple-500/20">
        <p>DEAD FILES, ALIVE IDEAS</p>
      </div>
    </div>
  );
}
