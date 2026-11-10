// Заставка приложения с анимированным черепом
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-skull-gradient overflow-hidden">
      {/* Фоновая сетка */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      {/* Анимированные линии */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent animate-scanline" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent animate-scanline" style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-pink-500/50 to-transparent animate-scanline" style={{ animationDelay: '2s' }} />
      </div>

      {/* Декоративные черепа на фоне */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-skull-float"
            style={{
              left: `${(i * 23) % 100}%`,
              top: `${(i * 37) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          >
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
              <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
                stroke="#a855f7" strokeWidth="1" />
            </svg>
          </div>
        ))}
      </div>

      {/* Центральный контент */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Большой череп */}
        <div className="relative animate-skull-float">
          {/* Свечение */}
          <div className="absolute inset-0 blur-3xl bg-purple-500/30 rounded-full scale-150" />
          <div className="absolute inset-0 blur-2xl bg-blue-500/20 rounded-full scale-125" />
          
          <svg width="200" height="200" viewBox="0 0 200 200" className="relative animate-neon-pulse">
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
            
            {/* Череп */}
            <path d="M100 30 C60 30 36 60 36 100 C36 124 44 140 56 150 L56 164 L72 164 L72 176 L88 176 L88 164 L112 164 L112 176 L128 176 L128 164 L144 164 L144 150 C156 140 164 124 164 100 C164 60 140 30 100 30 Z" 
              fill="url(#mainSkullGrad)" 
              stroke="#c4b5fd" 
              strokeWidth="2"
              filter="url(#mainGlow)" />
            
            {/* Трещины */}
            <path d="M80 50 L85 70 L78 85" stroke="#07060d" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M120 55 L115 75 L122 90" stroke="#07060d" strokeWidth="1" fill="none" opacity="0.5" />
            
            {/* Глазницы */}
            <ellipse cx="76" cy="96" rx="16" ry="18" fill="#07060d" />
            <ellipse cx="124" cy="96" rx="16" ry="18" fill="#07060d" />
            
            {/* Светящиеся глаза */}
            <ellipse cx="76" cy="96" rx="10" ry="12" fill="url(#eyeGlow)" className="animate-eye-glow" />
            <ellipse cx="124" cy="96" rx="10" ry="12" fill="url(#eyeGlow)" className="animate-eye-glow" style={{ animationDelay: '0.5s' }} />
            
            {/* Зрачки */}
            <circle cx="76" cy="96" r="4" fill="#fff" opacity="0.8" />
            <circle cx="124" cy="96" r="4" fill="#fff" opacity="0.8" />
            
            {/* Нос */}
            <path d="M100 116 L92 136 L108 136 Z" fill="#07060d" />
            
            {/* Зубы */}
            <rect x="76" y="150" width="8" height="12" fill="#07060d" rx="2" />
            <rect x="88" y="150" width="8" height="12" fill="#07060d" rx="2" />
            <rect x="100" y="150" width="8" height="12" fill="#07060d" rx="2" />
            <rect x="112" y="150" width="8" height="12" fill="#07060d" rx="2" />
            
            {/* Корона/нимб */}
            <path d="M60 35 L70 20 L80 30 L90 15 L100 28 L110 15 L120 30 L130 20 L140 35" 
              stroke="#fbbf24" 
              strokeWidth="2" 
              fill="none"
              filter="url(#mainGlow)"
              opacity="0.8" />
          </svg>
        </div>

        {/* Название */}
        <div className="text-center">
          <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent neon-purple">
            MYVAULT
          </h1>
          <p className="text-lg text-purple-300/80 mt-2 tracking-widest uppercase font-light">
            ☠ Хранилище Мёртвых Файлов ☠
          </p>
        </div>

        {/* Прогресс-бар */}
        <div className="w-64">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden border border-purple-500/30">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-100 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-purple-400/60 font-mono">
            <span>{phase === 'loading' ? 'ЗАГРУЗКА СИСТЕМЫ...' : 'ГОТОВО'}</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Статус */}
        <div className="text-center text-xs text-purple-400/40 font-mono space-y-1">
          <p>ИНИЦИАЛИЗАЦИЯ КРИПТ... ✓</p>
          <p>ЗАГРУЗКА ЧЕРЕПОВ... ✓</p>
          <p className={progress > 50 ? 'text-purple-400/80' : ''}>
            ПОДГОТОВКА ХРАНИЛИЩА... {progress > 50 ? '✓' : '...'}
          </p>
        </div>
      </div>

      {/* Угловые декорации */}
      <div className="absolute top-4 left-4 text-purple-500/30 font-mono text-xs">
        <p>v1.0.0</p>
        <p>SKULL_OS</p>
      </div>
      <div className="absolute top-4 right-4 text-purple-500/30 font-mono text-xs text-right">
        <p>SYSTEM: ONLINE</p>
        <p>STATUS: {phase === 'ready' ? 'READY' : 'BOOTING'}</p>
      </div>
      <div className="absolute bottom-4 left-4 text-purple-500/30 font-mono text-xs">
        <p>☠ RISE FROM THE GRAVE ☠</p>
      </div>
      <div className="absolute bottom-4 right-4 text-purple-500/30 font-mono text-xs text-right">
        <p>DEAD FILES, ALIVE IDEAS</p>
      </div>
    </div>
  );
}
