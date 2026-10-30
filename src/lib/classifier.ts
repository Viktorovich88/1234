// Автоматическая классификация файлов по типу, папке и тегам

import type { ClassificationRule } from './db';

interface ClassifyInput {
  name: string;
  mime: string;
  content?: string; // текстовое содержимое для анализа
}

interface ClassifyResult {
  type: string;
  folder: string;
  tags: string[];
  description: string;
}

// Маппинг MIME-типов к категориям
const MIME_MAP: Record<string, string> = {
  'video/mp4': 'video',
  'video/quicktime': 'video',
  'video/webm': 'video',
  'video/x-msvideo': 'video',
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'image/svg+xml': 'image',
  'image/bmp': 'image',
  'application/pdf': 'doc',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc',
  'text/plain': 'doc',
  'text/markdown': 'doc',
  'application/vnd.ms-excel': 'table',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'table',
  'text/csv': 'table',
  'application/zip': 'archive',
  'application/x-rar-compressed': 'archive',
  'application/x-7z-compressed': 'archive',
  'application/gzip': 'archive',
};

// Расширения файлов к категориям
const EXT_MAP: Record<string, string> = {
  // Видео
  mp4: 'video', mov: 'video', webm: 'video', avi: 'video', mkv: 'video',
  // Фото
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image', bmp: 'image',
  // Документы
  pdf: 'doc', doc: 'doc', docx: 'doc', txt: 'doc', md: 'doc', rtf: 'doc',
  // Таблицы
  xlsx: 'table', xls: 'table', csv: 'table',
  // Код
  html: 'code', css: 'code', js: 'code', ts: 'code', tsx: 'code', jsx: 'code',
  py: 'code', java: 'code', cpp: 'code', c: 'code', go: 'code', rs: 'code',
  rb: 'code', php: 'code', swift: 'code', kt: 'code', sql: 'code',
  json: 'code', xml: 'code', yaml: 'code', yml: 'code', toml: 'code',
  sh: 'code', bash: 'code', ps1: 'code',
  // Архивы
  zip: 'archive', rar: 'archive', '7z': 'archive', gz: 'archive', tar: 'archive',
};

// Языки программирования по расширению
const LANG_MAP: Record<string, string> = {
  js: 'JavaScript', ts: 'TypeScript', py: 'Python', java: 'Java',
  cpp: 'C++', c: 'C', go: 'Go', rs: 'Rust', rb: 'Ruby',
  php: 'PHP', swift: 'Swift', kt: 'Kotlin', html: 'HTML',
  css: 'CSS', sql: 'SQL', json: 'JSON', xml: 'XML',
  yaml: 'YAML', yml: 'YAML', sh: 'Shell', bash: 'Bash',
  tsx: 'React/TSX', jsx: 'React/JSX',
};

// Извлекаем год и месяц из даты
function getDatePath(date: Date): { year: string; month: string } {
  return {
    year: date.getFullYear().toString(),
    month: String(date.getMonth() + 1).padStart(2, '0'),
  };
}

// Извлекаем теги из имени файла
function extractTags(name: string, type: string, ext: string): string[] {
  const tags: string[] = [];
  
  // Разбиваем имя по разделителям
  const parts = name
    .replace(/\.[^.]+$/, '') // убираем расширение
    .split(/[-_\s.]+/)
    .filter(p => p.length > 1 && !/^\d+$/.test(p)) // убираем короткие и чисто числовые
    .map(p => p.toLowerCase());
  
  tags.push(...parts.slice(0, 5)); // максимум 5 тегов из имени
  
  // Добавляем тип и расширение
  tags.push(type);
  if (ext) tags.push(ext);
  
  // Добавляем язык если это код
  if (type === 'code' && LANG_MAP[ext]) {
    tags.push(LANG_MAP[ext].toLowerCase());
  }
  
  return [...new Set(tags)]; // уникальные
}

// Генерируем описание из имени и содержимого
function generateDescription(name: string, content?: string): string {
  if (content && content.length > 10) {
    // Берём первые 200 символов содержимого
    const snippet = content.substring(0, 200).replace(/\n/g, ' ').trim();
    return snippet + (content.length > 200 ? '...' : '');
  }
  
  // Из имени файла
  const cleanName = name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  return `Файл: ${cleanName}`;
}

// Основная функция классификации
export function classify(input: ClassifyInput, rules: ClassificationRule[] = []): ClassifyResult {
  const { name, mime, content } = input;
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const now = new Date();
  const { year, month } = getDatePath(now);
  
  // 1. Проверяем пользовательские правила
  for (const rule of rules) {
    const regex = new RegExp(rule.pattern, 'i');
    if (regex.test(name) || regex.test(mime)) {
      return {
        type: rule.category,
        folder: getFolderForType(rule.category, ext, year, month),
        tags: extractTags(name, rule.category, ext),
        description: generateDescription(name, content),
      };
    }
  }
  
  // 2. Определяем тип по MIME
  let type = MIME_MAP[mime] || '';
  
  // 3. Если MIME не дал результат — по расширению
  if (!type && ext) {
    type = EXT_MAP[ext] || '';
  }
  
  // 4. Если URL — ссылка
  if (name.startsWith('http://') || name.startsWith('https://') || mime === 'text/x-url') {
    type = 'link';
  }
  
  // 5. Если ничего не определили — идея/другое
  if (!type) {
    type = mime?.startsWith('text/') ? 'idea' : 'other';
  }
  
  // 6. Определяем папку
  const folder = getFolderForType(type, ext, year, month);
  
  // 7. Генерируем теги и описание
  const tags = extractTags(name, type, ext);
  const description = generateDescription(name, content);
  
  return { type, folder, tags, description };
}

// Определяем путь папки по типу
function getFolderForType(type: string, ext: string, year: string, month: string): string {
  switch (type) {
    case 'video': return `/Видео/${year}/${month}`;
    case 'image': return `/Фото/${year}/${month}`;
    case 'table': return `/Таблицы/${year}`;
    case 'doc': return `/Документы/${year}`;
    case 'code': return `/Код/${LANG_MAP[ext] || 'Другое'}`;
    case 'link': return '/Сайты';
    case 'idea': return '/Идеи';
    case 'archive': return '/Архивы';
    default: return '/Другое';
  }
}

// Проверка: является ли файл изображением
export function isImage(mime: string): boolean {
  return mime?.startsWith('image/') || false;
}

// Проверка: является ли файл видео
export function isVideo(mime: string): boolean {
  return mime?.startsWith('video/') || false;
}

// Проверка: является ли файл текстовым (можно прочитать содержимое)
export function isTextFile(mime: string, ext: string): boolean {
  if (mime?.startsWith('text/')) return true;
  const textExts = ['json', 'xml', 'yaml', 'yml', 'toml', 'md', 'txt', 'html', 'css', 'js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'go', 'rs', 'rb', 'php', 'swift', 'kt', 'sql', 'sh', 'bash'];
  return textExts.includes(ext);
}

// Получаем иконку для типа файла
export function getFileIcon(type: string): string {
  const icons: Record<string, string> = {
    video: '🎬',
    image: '🖼️',
    table: '📊',
    doc: '📄',
    code: '💻',
    link: '🔗',
    idea: '💡',
    archive: '📦',
    other: '📎',
  };
  return icons[type] || '📎';
}

// Форматирование размера файла
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
