// Расширенная классификация файлов — больше категорий
import type { ClassificationRule } from './db';

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

// Расширенный маппинг MIME → категория
const MIME_MAP: Record<string, string> = {
  // Видео
  'video/mp4': 'video',
  'video/quicktime': 'video',
  'video/webm': 'video',
  'video/x-msvideo': 'video',
  'video/x-matroska': 'video',
  'video/avi': 'video',
  'video/x-flv': 'video',
  // Аудио
  'audio/mpeg': 'audio',
  'audio/wav': 'audio',
  'audio/ogg': 'audio',
  'audio/flac': 'audio',
  'audio/aac': 'audio',
  'audio/mp4': 'audio',
  'audio/webm': 'audio',
  'audio/x-m4a': 'audio',
  // Изображения
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'image/svg+xml': 'image',
  'image/bmp': 'image',
  'image/tiff': 'image',
  'image/x-icon': 'image',
  'image/vnd.adobe.photoshop': 'design',
  // 3D графика
  'model/gltf-binary': '3d',
  'model/obj': '3d',
  // Документы
  'application/pdf': 'docs',
  'application/msword': 'docs',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docs',
  'text/plain': 'text',
  'text/markdown': 'text',
  'text/rtf': 'docs',
  'application/rtf': 'docs',
  // Презентации
  'application/vnd.ms-powerpoint': 'presentation',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'presentation',
  // Таблицы
  'application/vnd.ms-excel': 'tables',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'tables',
  'text/csv': 'tables',
  // Дизайн
  'application/vnd.adobe.photoshop': 'design',
  'application/postscript': 'design',
  'application/vnd.adobe.illustrator': 'design',
  // Архивы
  'application/zip': 'archives',
  'application/x-rar-compressed': 'archives',
  'application/x-7z-compressed': 'archives',
  'application/gzip': 'archives',
  'application/x-tar': 'archives',
  // Шрифты
  'font/woff': 'fonts',
  'font/woff2': 'fonts',
  'font/ttf': 'fonts',
  'font/otf': 'fonts',
  // CAD / чертежи
  'application/vnd.dwg': 'cad',
  'application/dxf': 'cad',
};

// Расширенный маппинг расширений
const EXT_MAP: Record<string, string> = {
  // Видео
  mp4: 'video', mov: 'video', webm: 'video', avi: 'video', mkv: 'video', flv: 'video', wmv: 'video', m4v: 'video',
  // Аудио
  mp3: 'audio', wav: 'audio', ogg: 'audio', flac: 'audio', aac: 'audio', m4a: 'audio', wma: 'audio', mid: 'audio', midi: 'audio',
  // Фото
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image', bmp: 'image', tiff: 'image', ico: 'image', heic: 'image', heif: 'image', raw: 'image', cr2: 'image', nef: 'image',
  // 3D
  glb: '3d', gltf: '3d', obj: '3d', fbx: '3d', blend: '3d', stl: '3d',
  // Документы
  pdf: 'docs', doc: 'docs', docx: 'docs', rtf: 'docs', odt: 'docs', epub: 'docs', mobi: 'docs',
  // Текст
  txt: 'text', md: 'text', markdown: 'text', tex: 'text', log: 'text',
  // Презентации
  ppt: 'presentation', pptx: 'presentation', odp: 'presentation', key: 'presentation',
  // Таблицы
  xlsx: 'tables', xls: 'tables', csv: 'tables', ods: 'tables', numbers: 'tables', tsv: 'tables',
  // Код
  html: 'code', htm: 'code', css: 'code', scss: 'code', sass: 'code', less: 'code',
  js: 'code', mjs: 'code', cjs: 'code', ts: 'code', tsx: 'code', jsx: 'code',
  py: 'code', pyw: 'code', ipynb: 'code',
  java: 'code', kt: 'code', kts: 'code', scala: 'code',
  cpp: 'code', c: 'code', h: 'code', hpp: 'code', cs: 'code',
  go: 'code', rs: 'code', rb: 'code', php: 'code', swift: 'code',
  dart: 'code', lua: 'code', r: 'code', matlab: 'code',
  sh: 'code', bash: 'code', zsh: 'code', fish: 'code', ps1: 'code', bat: 'code', cmd: 'code',
  sql: 'code', graphql: 'code', gql: 'code',
  // Данные
  json: 'data', xml: 'data', yaml: 'data', yml: 'data', toml: 'data', ini: 'data', cfg: 'data', conf: 'data', env: 'data',
  // Дизайн
  psd: 'design', ai: 'design', sketch: 'design', fig: 'design', xd: 'design', afdesign: 'design',
  // Архивы
  zip: 'archives', rar: 'archives', '7z': 'archives', gz: 'archives', tar: 'archives', bz2: 'archives', xz: 'archives', iso: 'archives', dmg: 'archives',
  // Шрифты
  woff: 'fonts', woff2: 'fonts', ttf: 'fonts', otf: 'fonts', eot: 'fonts',
  // CAD
  dwg: 'cad', dxf: 'cad', step: 'cad', iges: 'cad',
  // Исполняемые
  exe: 'executables', msi: 'executables', app: 'executables', deb: 'executables', rpm: 'executables', apk: 'executables',
};

// Языки программирования
const LANG_MAP: Record<string, string> = {
  js: 'JavaScript', mjs: 'JavaScript', cjs: 'JavaScript',
  ts: 'TypeScript', tsx: 'TypeScript/React', jsx: 'JavaScript/React',
  py: 'Python', ipynb: 'Jupyter',
  java: 'Java', kt: 'Kotlin', scala: 'Scala',
  cpp: 'C++', c: 'C', h: 'C/C++', cs: 'C#',
  go: 'Go', rs: 'Rust', rb: 'Ruby', php: 'PHP',
  swift: 'Swift', dart: 'Dart', lua: 'Lua',
  html: 'HTML', htm: 'HTML', css: 'CSS', scss: 'SCSS', sass: 'Sass', less: 'Less',
  sql: 'SQL', graphql: 'GraphQL',
  sh: 'Shell', bash: 'Bash', zsh: 'Zsh', ps1: 'PowerShell', bat: 'Batch',
  r: 'R', matlab: 'MATLAB',
};

// Описания категорий (в стиле Dark Neon Skull)
export const CATEGORY_INFO: Record<string, { label: string; icon: string; color: string; neon: string }> = {
  video: { label: 'Видео', icon: '🎬', color: 'from-pink-600 to-purple-700', neon: '#ec4899' },
  audio: { label: 'Аудио', icon: '🎵', color: 'from-purple-600 to-indigo-700', neon: '#a855f7' },
  image: { label: 'Фото', icon: '📷', color: 'from-emerald-600 to-cyan-700', neon: '#10b981' },
  '3d': { label: '3D Графика', icon: '🧊', color: 'from-cyan-600 to-blue-700', neon: '#06b6d4' },
  docs: { label: 'Документы', icon: '📄', color: 'from-blue-600 to-indigo-700', neon: '#3b82f6' },
  text: { label: 'Текст', icon: '📝', color: 'from-slate-600 to-gray-700', neon: '#94a3b8' },
  presentation: { label: 'Презентации', icon: '📊', color: 'from-orange-600 to-red-700', neon: '#f97316' },
  tables: { label: 'Таблицы', icon: '📈', color: 'from-green-600 to-emerald-700', neon: '#10b981' },
  code: { label: 'Код', icon: '💻', color: 'from-violet-600 to-purple-800', neon: '#a855f7' },
  data: { label: 'Данные', icon: '🗃️', color: 'from-amber-600 to-orange-700', neon: '#f59e0b' },
  design: { label: 'Дизайн', icon: '🎨', color: 'from-pink-600 to-purple-700', neon: '#ec4899' },
  archives: { label: 'Архивы', icon: '📦', color: 'from-yellow-700 to-amber-800', neon: '#eab308' },
  fonts: { label: 'Шрифты', icon: '🔤', color: 'from-gray-600 to-slate-700', neon: '#cbd5e1' },
  cad: { label: 'Чертежи', icon: '📐', color: 'from-sky-600 to-blue-700', neon: '#0ea5e9' },
  executables: { label: 'Программы', icon: '⚙️', color: 'from-zinc-600 to-neutral-700', neon: '#a1a1aa' },
  link: { label: 'Ссылки', icon: '🔗', color: 'from-blue-500 to-cyan-600', neon: '#38bdf8' },
  idea: { label: 'Идеи', icon: '💡', color: 'from-yellow-500 to-amber-600', neon: '#fbbf24' },
  other: { label: 'Другое', icon: '📎', color: 'from-gray-500 to-slate-600', neon: '#9ca3af' },
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
export function classify(input: ClassifyInput, rules: ClassificationRule[] = []): ClassifyResult {
  const { name, mime, content } = input;
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
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
  if (name.startsWith('http://') || name.startsWith('https://')) {
    type = 'link';
  }
  
  // 5. Если ничего не определили
  if (!type) {
    type = mime?.startsWith('text/') ? 'idea' : 'other';
  }
  
  const folder = getFolderForType(type, ext, year, month);
  const tags = extractTags(name, type, ext);
  const description = generateDescription(name, content);
  
  return { type, folder, tags, description };
}

// Путь папки по типу
function getFolderForType(type: string, ext: string, year: string, month: string): string {
  switch (type) {
    case 'video': return `/Видео/${year}/${month}`;
    case 'audio': return `/Аудио/${year}/${month}`;
    case 'image': return `/Фото/${year}/${month}`;
    case '3d': return `/3D/${year}`;
    case 'docs': return `/Документы/${year}`;
    case 'text': return `/Текст/${year}`;
    case 'presentation': return `/Презентации/${year}`;
    case 'tables': return `/Таблицы/${year}`;
    case 'code': return `/Код/${LANG_MAP[ext] || 'Другое'}`;
    case 'data': return `/Данные/${year}`;
    case 'design': return `/Дизайн/${year}`;
    case 'archives': return `/Архивы/${year}`;
    case 'fonts': return `/Шрифты`;
    case 'cad': return `/Чертежи/${year}`;
    case 'executables': return `/Программы`;
    case 'link': return '/Ссылки';
    case 'idea': return '/Идеи';
    default: return '/Другое';
  }
}

// Проверки типов
export function isImage(mime: string): boolean {
  return mime?.startsWith('image/') || false;
}

export function isVideo(mime: string): boolean {
  return mime?.startsWith('video/') || false;
}

export function isAudio(mime: string): boolean {
  return mime?.startsWith('audio/') || false;
}

export function isTextFile(mime: string, ext: string): boolean {
  if (mime?.startsWith('text/')) return true;
  const textExts = ['json', 'xml', 'yaml', 'yml', 'toml', 'md', 'txt', 'html', 'css', 'js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'go', 'rs', 'rb', 'php', 'swift', 'kt', 'sql', 'sh', 'bash', 'scss', 'less', 'graphql'];
  return textExts.includes(ext);
}

// Иконка для типа
export function getFileIcon(type: string): string {
  return CATEGORY_INFO[type]?.icon || '📎';
}

// Форматирование размера
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
