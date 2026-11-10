// Сервис генерации превью для файлов
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Генерация превью для изображения
export async function generateImagePreview(
  inputPath: string,
  outputDir: string,
  filename: string
): Promise<string> {
  try {
    const previewFilename = `preview_${filename}.jpg`;
    const previewPath = path.join(outputDir, previewFilename);
    
    await sharp(inputPath)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 70 })
      .toFile(previewPath);
    
    return previewPath;
  } catch (error) {
    console.error('Ошибка генерации превью:', error);
    return '';
  }
}

// Проверка является ли файл изображением
export function isImage(mime: string): boolean {
  return mime?.startsWith('image/') || false;
}

// Проверка является ли файл видео
export function isVideo(mime: string): boolean {
  return mime?.startsWith('video/') || false;
}

// Проверка является ли файл текстовым
export function isTextFile(mime: string, ext: string): boolean {
  if (mime?.startsWith('text/')) return true;
  const textExts = ['json', 'xml', 'yaml', 'yml', 'md', 'txt', 'html', 'css', 'js', 'ts', 'py', 'java'];
  return textExts.includes(ext);
}
