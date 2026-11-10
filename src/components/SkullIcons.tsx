// SVG иконки в стиле черепов/скелетов для каждой категории
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Базовый череп
const SkullBase = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    {/* Череп */}
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#skullGrad)" stroke="#c4b5fd" strokeWidth="1.5" />
    {/* Глазницы */}
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    {/* Нос */}
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* Зубы */}
    <rect x="38" y="75" width="4" height="6" fill="#07060d" rx="1" />
    <rect x="44" y="75" width="4" height="6" fill="#07060d" rx="1" />
    <rect x="50" y="75" width="4" height="6" fill="#07060d" rx="1" />
    <rect x="56" y="75" width="4" height="6" fill="#07060d" rx="1" />
  </svg>
);

// Череп с неоновыми глазами (для видео)
export const SkullVideo = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="videoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <filter id="videoGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#videoGrad)" stroke="#f9a8d4" strokeWidth="1.5" />
    {/* Глаза-камеры */}
    <circle cx="38" cy="48" r="9" fill="#07060d" />
    <circle cx="62" cy="48" r="9" fill="#07060d" />
    <circle cx="38" cy="48" r="5" fill="#ec4899" filter="url(#videoGlow)" className="animate-eye-glow" />
    <circle cx="62" cy="48" r="5" fill="#ec4899" filter="url(#videoGlow)" className="animate-eye-glow" />
    {/* Play символ на лбу */}
    <path d="M46 30 L46 40 L56 35 Z" fill="#f9a8d4" filter="url(#videoGlow)" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    <rect x="38" y="75" width="4" height="6" fill="#07060d" rx="1" />
    <rect x="44" y="75" width="4" height="6" fill="#07060d" rx="1" />
    <rect x="50" y="75" width="4" height="6" fill="#07060d" rx="1" />
    <rect x="56" y="75" width="4" height="6" fill="#07060d" rx="1" />
  </svg>
);

// Череп с наушниками (аудио)
export const SkullAudio = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="audioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    {/* Наушники */}
    <path d="M15 50 C15 30 30 15 50 15 C70 15 85 30 85 50" stroke="#a78bfa" strokeWidth="4" fill="none" />
    <rect x="10" y="45" width="12" height="20" rx="4" fill="#8b5cf6" />
    <rect x="78" y="45" width="12" height="20" rx="4" fill="#8b5cf6" />
    {/* Череп */}
    <path d="M50 25 C35 25 25 37 25 52 C25 62 28 68 33 72 L33 78 L40 78 L40 84 L47 84 L47 78 L53 78 L53 84 L60 84 L60 78 L67 78 L67 72 C72 68 75 62 75 52 C75 37 65 25 50 25 Z" 
      fill="url(#audioGrad)" stroke="#c4b5fd" strokeWidth="1.5" />
    <ellipse cx="40" cy="52" rx="6" ry="7" fill="#07060d" />
    <ellipse cx="60" cy="52" rx="6" ry="7" fill="#07060d" />
    <circle cx="40" cy="52" r="3" fill="#a78bfa" />
    <circle cx="60" cy="52" r="3" fill="#a78bfa" />
    <path d="M50 62 L47 70 L53 70 Z" fill="#07060d" />
    {/* Звуковые волны */}
    <path d="M20 55 Q22 50 20 45" stroke="#a78bfa" strokeWidth="1.5" fill="none" opacity="0.6" />
    <path d="M80 55 Q78 50 80 45" stroke="#a78bfa" strokeWidth="1.5" fill="none" opacity="0.6" />
  </svg>
);

// Череп-фотограф (image)
export const SkullImage = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="imageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <radialGradient id="lensGrad">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#07060d" />
      </radialGradient>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#imageGrad)" stroke="#6ee7b7" strokeWidth="1.5" />
    {/* Глаз-объектив */}
    <circle cx="38" cy="48" r="10" fill="#07060d" stroke="#34d399" strokeWidth="2" />
    <circle cx="38" cy="48" r="6" fill="url(#lensGrad)" />
    <circle cx="38" cy="48" r="2" fill="#34d399" />
    {/* Второй глаз */}
    <circle cx="62" cy="48" r="10" fill="#07060d" stroke="#34d399" strokeWidth="2" />
    <circle cx="62" cy="48" r="6" fill="url(#lensGrad)" />
    <circle cx="62" cy="48" r="2" fill="#34d399" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    <rect x="38" y="75" width="4" height="6" fill="#07060d" rx="1" />
    <rect x="44" y="75" width="4" height="6" fill="#07060d" rx="1" />
    <rect x="50" y="75" width="4" height="6" fill="#07060d" rx="1" />
    <rect x="56" y="75" width="4" height="6" fill="#07060d" rx="1" />
  </svg>
);

// Череп-куб (3D)
export const Skull3D = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="3dGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    {/* Каркасный череп */}
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#3dGrad)" stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="3 2" />
    {/* Каркасные линии */}
    <path d="M30 30 L70 30 M30 50 L70 50 M30 70 L70 70 M30 30 L30 70 M50 30 L50 70 M70 30 L70 70" 
      stroke="#67e8f9" strokeWidth="0.5" opacity="0.5" />
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <circle cx="38" cy="48" r="3" fill="#06b6d4" />
    <circle cx="62" cy="48" r="3" fill="#06b6d4" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
  </svg>
);

// Череп с документом (docs)
export const SkullDocs = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="docsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#docsGrad)" stroke="#93c5fd" strokeWidth="1.5" />
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* Документ на лбу */}
    <rect x="42" y="22" width="16" height="18" fill="#07060d" stroke="#93c5fd" strokeWidth="1" rx="1" />
    <line x1="45" y1="27" x2="55" y2="27" stroke="#93c5fd" strokeWidth="0.8" />
    <line x1="45" y1="31" x2="55" y2="31" stroke="#93c5fd" strokeWidth="0.8" />
    <line x1="45" y1="35" x2="52" y2="35" stroke="#93c5fd" strokeWidth="0.8" />
  </svg>
);

// Череп с пером (text)
export const SkullText = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64748b" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#textGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* Перо */}
    <path d="M70 15 L55 35 L58 38 L73 18 Z" fill="#cbd5e1" />
    <path d="M55 35 L52 38 L58 38 Z" fill="#07060d" />
  </svg>
);

// Череп с презентацией
export const SkullPresentation = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="presGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#presGrad)" stroke="#fca5a5" strokeWidth="1.5" />
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* График на лбу */}
    <rect x="38" y="22" width="24" height="16" fill="#07060d" stroke="#fca5a5" strokeWidth="1" rx="1" />
    <path d="M40 34 L45 30 L50 32 L55 26 L60 28" stroke="#f97316" strokeWidth="1.5" fill="none" />
  </svg>
);

// Череп с таблицей
export const SkullTables = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="tableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#tableGrad)" stroke="#6ee7b7" strokeWidth="1.5" />
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* Таблица */}
    <rect x="38" y="22" width="24" height="16" fill="#07060d" stroke="#6ee7b7" strokeWidth="1" rx="1" />
    <line x1="38" y1="27" x2="62" y2="27" stroke="#6ee7b7" strokeWidth="0.5" />
    <line x1="38" y1="32" x2="62" y2="32" stroke="#6ee7b7" strokeWidth="0.5" />
    <line x1="46" y1="22" x2="46" y2="38" stroke="#6ee7b7" strokeWidth="0.5" />
    <line x1="54" y1="22" x2="54" y2="38" stroke="#6ee7b7" strokeWidth="0.5" />
  </svg>
);

// Череп-хакер (code)
export const SkullCode = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="codeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#codeGrad)" stroke="#c4b5fd" strokeWidth="1.5" />
    {/* Глаза с кодом */}
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <text x="35" y="51" fill="#a855f7" fontSize="8" fontFamily="monospace">&lt;/&gt;</text>
    <text x="59" y="51" fill="#a855f7" fontSize="8" fontFamily="monospace">{}</text>
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* Терминал на лбу */}
    <rect x="38" y="22" width="24" height="14" fill="#07060d" stroke="#c4b5fd" strokeWidth="1" rx="1" />
    <text x="40" y="31" fill="#a855f7" fontSize="6" fontFamily="monospace">&gt;_</text>
  </svg>
);

// Череп с базой данных (data)
export const SkullData = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="dataGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#dataGrad)" stroke="#fcd34d" strokeWidth="1.5" />
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <circle cx="38" cy="48" r="3" fill="#f59e0b" />
    <circle cx="62" cy="48" r="3" fill="#f59e0b" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* База данных */}
    <ellipse cx="50" cy="22" rx="10" ry="3" fill="none" stroke="#fcd34d" strokeWidth="1.5" />
    <path d="M40 22 L40 34 Q50 38 60 34 L60 22" fill="none" stroke="#fcd34d" strokeWidth="1.5" />
    <ellipse cx="50" cy="34" rx="10" ry="3" fill="none" stroke="#fcd34d" strokeWidth="1.5" />
  </svg>
);

// Череп-художник (design)
export const SkullDesign = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="designGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#designGrad)" stroke="#f9a8d4" strokeWidth="1.5" />
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <circle cx="38" cy="48" r="3" fill="#ec4899" />
    <circle cx="62" cy="48" r="3" fill="#a855f7" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* Кисть */}
    <path d="M70 15 L65 30 L68 32 L73 17 Z" fill="#f9a8d4" />
    <circle cx="66" cy="32" r="3" fill="#ec4899" />
  </svg>
);

// Череп в ящике (archives)
export const SkullArchives = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="archGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
    </defs>
    {/* Ящик */}
    <rect x="20" y="55" width="60" height="35" fill="#07060d" stroke="#fcd34d" strokeWidth="1.5" rx="2" />
    <line x1="20" y1="68" x2="80" y2="68" stroke="#fcd34d" strokeWidth="1" />
    <circle cx="50" cy="78" r="2" fill="#fcd34d" />
    {/* Череп сверху */}
    <path d="M50 15 C35 15 25 25 25 40 C25 50 28 55 32 58 L32 62 L38 62 L38 66 L44 66 L44 62 L56 62 L56 66 L62 66 L62 62 L68 62 L68 58 C72 55 75 50 75 40 C75 25 65 15 50 15 Z" 
      fill="url(#archGrad)" stroke="#fcd34d" strokeWidth="1.5" />
    <ellipse cx="40" cy="38" rx="6" ry="7" fill="#07060d" />
    <ellipse cx="60" cy="38" rx="6" ry="7" fill="#07060d" />
    <path d="M50 47 L47 54 L53 54 Z" fill="#07060d" />
  </svg>
);

// Череп с буквой (fonts)
export const SkullFonts = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="fontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64748b" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#fontGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* Буква A */}
    <text x="42" y="38" fill="#cbd5e1" fontSize="18" fontFamily="serif" fontWeight="bold">A</text>
  </svg>
);

// Череп с линейкой (cad)
export const SkullCad = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="cadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#cadGrad)" stroke="#7dd3fc" strokeWidth="1.5" />
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* Линейка */}
    <rect x="30" y="22" width="40" height="6" fill="#07060d" stroke="#7dd3fc" strokeWidth="1" />
    <line x1="35" y1="22" x2="35" y2="25" stroke="#7dd3fc" strokeWidth="0.5" />
    <line x1="40" y1="22" x2="40" y2="26" stroke="#7dd3fc" strokeWidth="0.5" />
    <line x1="45" y1="22" x2="45" y2="25" stroke="#7dd3fc" strokeWidth="0.5" />
    <line x1="50" y1="22" x2="50" y2="26" stroke="#7dd3fc" strokeWidth="0.5" />
    <line x1="55" y1="22" x2="55" y2="25" stroke="#7dd3fc" strokeWidth="0.5" />
    <line x1="60" y1="22" x2="60" y2="26" stroke="#7dd3fc" strokeWidth="0.5" />
    <line x1="65" y1="22" x2="65" y2="25" stroke="#7dd3fc" strokeWidth="0.5" />
  </svg>
);

// Череп с шестерёнкой (executables)
export const SkullExec = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="execGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#52525b" />
        <stop offset="100%" stopColor="#27272a" />
      </linearGradient>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#execGrad)" stroke="#a1a1aa" strokeWidth="1.5" />
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* Шестерёнка */}
    <g transform="translate(50, 28)">
      <path d="M0,-8 L2,-6 L6,-6 L6,-2 L8,0 L6,2 L6,6 L2,6 L0,8 L-2,6 L-6,6 L-6,2 L-8,0 L-6,-2 L-6,-6 L-2,-6 Z" 
        fill="#a1a1aa" stroke="#07060d" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="2" fill="#07060d" />
    </g>
  </svg>
);

// Череп с цепью (link)
export const SkullLink = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#linkGrad)" stroke="#7dd3fc" strokeWidth="1.5" />
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* Цепь */}
    <ellipse cx="45" cy="25" rx="5" ry="3" fill="none" stroke="#7dd3fc" strokeWidth="1.5" />
    <ellipse cx="55" cy="25" rx="5" ry="3" fill="none" stroke="#7dd3fc" strokeWidth="1.5" />
    <ellipse cx="50" cy="30" rx="5" ry="3" fill="none" stroke="#7dd3fc" strokeWidth="1.5" />
  </svg>
);

// Череп с лампочкой (idea)
export const SkullIdea = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="ideaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <filter id="ideaGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path d="M50 15 C30 15 18 30 18 50 C18 62 22 70 28 75 L28 82 L36 82 L36 88 L44 88 L44 82 L56 82 L56 88 L64 88 L64 82 L72 82 L72 75 C78 70 82 62 82 50 C82 30 70 15 50 15 Z" 
      fill="url(#ideaGrad)" stroke="#fcd34d" strokeWidth="1.5" />
    <ellipse cx="38" cy="48" rx="8" ry="9" fill="#07060d" />
    <ellipse cx="62" cy="48" rx="8" ry="9" fill="#07060d" />
    <circle cx="38" cy="48" r="3" fill="#fbbf24" filter="url(#ideaGlow)" />
    <circle cx="62" cy="48" r="3" fill="#fbbf24" filter="url(#ideaGlow)" />
    <path d="M50 58 L46 68 L54 68 Z" fill="#07060d" />
    {/* Лампочка */}
    <circle cx="50" cy="22" r="6" fill="#fbbf24" filter="url(#ideaGlow)" />
    <rect x="48" y="27" width="4" height="3" fill="#fcd34d" />
    {/* Лучи */}
    <line x1="50" y1="10" x2="50" y2="14" stroke="#fcd34d" strokeWidth="1" />
    <line x1="40" y1="14" x2="43" y2="17" stroke="#fcd34d" strokeWidth="1" />
    <line x1="60" y1="14" x2="57" y2="17" stroke="#fcd34d" strokeWidth="1" />
    <line x1="38" y1="22" x2="42" y2="22" stroke="#fcd34d" strokeWidth="1" />
    <line x1="62" y1="22" x2="58" y2="22" stroke="#fcd34d" strokeWidth="1" />
  </svg>
);

// Базовый череп (other)
export const SkullOther = ({ size = 24, className = '' }: IconProps) => <SkullBase size={size} className={className} />;

// Маппинг категорий на иконки
export const SKULL_ICONS: Record<string, React.FC<IconProps>> = {
  video: SkullVideo,
  audio: SkullAudio,
  image: SkullImage,
  '3d': Skull3D,
  docs: SkullDocs,
  text: SkullText,
  presentation: SkullPresentation,
  tables: SkullTables,
  code: SkullCode,
  data: SkullData,
  design: SkullDesign,
  archives: SkullArchives,
  fonts: SkullFonts,
  cad: SkullCad,
  executables: SkullExec,
  link: SkullLink,
  idea: SkullIdea,
  other: SkullOther,
};

export function getSkullIcon(type: string, size = 24, className = ''): React.ReactElement {
  const Icon = SKULL_ICONS[type] || SkullOther;
  return <Icon size={size} className={className} />;
}
