// Компонент для отображения иконки категории с кинематографическим изображением
import { useState } from 'react';
import { getSkullIcon } from './SkullIcons';

interface CategoryImageProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Маппинг типов на изображения
const CATEGORY_IMAGES: Record<string, string> = {
  audio: '/images/icon-audio.png',
  image: '/images/icon-photo.png',
  code: '/images/icon-code.png',
  idea: '/images/icon-idea.png',
  design: '/images/icon-design.png',
};

export function CategoryImage({ type, size = 'md', className = '' }: CategoryImageProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = CATEGORY_IMAGES[type];
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  // Если нет изображения или оно не загрузилось — используем SVG-череп
  if (!imageUrl || imageError) {
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center ${className}`}>
        {getSkullIcon(type, size === 'sm' ? 24 : size === 'md' ? 32 : 64)}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      <img
        src={imageUrl}
        alt={type}
        className="w-full h-full object-cover rounded-lg"
        onError={() => setImageError(true)}
      />
      {/* Неоновая рамка */}
      <div className="absolute inset-0 rounded-lg border border-purple-500/30 pointer-events-none" />
    </div>
  );
}

// Компонент для карточки файла с фоновым изображением категории
export function CategoryBackground({ type, children }: { type: string; children: React.ReactNode }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = CATEGORY_IMAGES[type];

  if (!imageUrl || imageError) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden">
      <img
        src={imageUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}
