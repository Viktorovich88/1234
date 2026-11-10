// Сервис классификации файлов
import { getDB } from '../db';

interface ClassifyInput {
  name: string;
  mime: string;
  content?: string;
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
};

// Расширения файлов к категориям
const EXT_MAP: Record<string, string> = {
  mp4: 'video', mov: 'video', webm: 'video', avi: 'video',
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image',
  pdf: 'doc', doc: 'doc', docx: 'doc', txt: 'doc', md: 'doc',
  xlsx: 'table', xls: 'table', csv: 'table',
  html: 'code', css: 'code', js: 'code', ts: 'code', py: 'code',
  json: 'code', xml: 'code',
  zip: 'archive', rar: 'archive', '7z': 'archive',
};

// Языки программирования
const LANG_MAP: Record<string, string> = {
  js: 'JavaScript', ts: 'TypeScript', py: 'Python', java: 'Java',
  html: 'HTML', css: 'CSS', json: 'JSON', xml: 'XML',
};

// Извлечение тегов из имени файла
function extractTags(name: string, type: string, ext: string): string[] {
  const tags: string[] = [];
  
  const parts = name
    .replace(/\.[^.]+$/, '')
    .split(/[-_\s.]+/)
    .filter(p => p.length > 1 && !/^\d+$/.test(p))
    .map(p => p.toLowerCase());
  
  tags.push(...parts.slice(0, 5));
  tags.push(type);
  if (ext) tags.push(ext);
  
  if (type === 'code' && LANG_MAP[ext]) {
    tags.push(LANG_MAP[ext].toLowerCase());
  }
  
  return [...new Set(tags)];
}

// Генерация описания
function generateDescription(name: string, content?: string): string {
  if (content && content.length > 10) {
    return content.substring(0, 200).replace(/\n/g, ' ').trim();
  }
  
  const cleanName = name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ');
  
  return `Файл: ${cleanName}`;
}

// Основная функция классификации
export function classify(input: ClassifyInput): ClassifyResult {
  const { name, mime, content } = input;
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  // 1. Проверяем пользовательские правила
  try {
    const db = getDB();
    const rules = db.prepare('SELECT * FROM rules').all() as any[];
    
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
  } catch (e) {
    // Игнорируем ошибки БД
  }
  
  // 2. Определяем тип по MIME
  let type = MIME_MAP[mime] || '';
  
  // 3. Если MIME не дал результат — по расширению
  if (!type && ext) {
    type = EXT_MAP[ext] || '';
  }
  
  // 4. Если ничего не определили — идея/другое
  if (!type) {
    type = mime?.startsWith('text/') ? 'idea' : 'other';
  }
  
  // 5. Определяем папку
  const folder = getFolderForType(type, ext, year, month);
  
  // 6. Генерируем теги и описание
  const tags = extractTags(name, type, ext);
  const description = generateDescription(name, content);
  
  return { type, folder, tags, description };
}

// Определение пути папки по типу
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
