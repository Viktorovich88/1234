// Маршруты API для работы с файлами
import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getDB } from '../db';
import { classify } from '../services/classifier';
import { generateImagePreview, isImage } from '../services/preview';

const router = Router();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = (req.app.get('uploadsDir') as string) || './uploads';
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB лимит
});

// Загрузка файла
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const db = getDB();
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    const { originalname, mimetype, size, filename, path: filePath } = req.file;
    const ext = originalname.split('.').pop()?.toLowerCase() || '';
    
    // Классификация
    const classification = classify({
      name: originalname,
      mime: mimetype,
    });

    // Генерация превью для изображений
    let previewPath = '';
    if (isImage(mimetype)) {
      const previewsDir = path.join(req.app.get('uploadsDir'), 'previews');
      if (!fs.existsSync(previewsDir)) {
        fs.mkdirSync(previewsDir, { recursive: true });
      }
      previewPath = await generateImagePreview(filePath, previewsDir, id);
    }

    // Сохранение в БД
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO files (id, name, original_name, path, mime, type, size, folder, tags, description, is_favorite, color, preview_path, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, '', ?, ?, ?)
    `).run(
      id,
      originalname.replace(/\.[^.]+$/, ''),
      originalname,
      filePath,
      mimetype,
      classification.type,
      size,
      classification.folder,
      JSON.stringify(classification.tags),
      classification.description,
      previewPath,
      now,
      now
    );

    // Создаём папку на диске если нужно
    const uploadsDir = req.app.get('uploadsDir') as string;
    const targetDir = path.join(uploadsDir, classification.folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    res.json({
      id,
      name: originalname.replace(/\.[^.]+$/, ''),
      originalName: originalname,
      mime: mimetype,
      type: classification.type,
      size,
      folder: classification.folder,
      tags: classification.tags,
      description: classification.description,
      createdAt: now,
    });
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    res.status(500).json({ error: 'Ошибка загрузки файла' });
  }
});

// Получение списка файлов
router.get('/', (req: Request, res: Response) => {
  try {
    const db = getDB();
    const { type, folder, q, fav } = req.query;
    
    let query = 'SELECT * FROM files WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (folder) {
      query += ' AND (folder = ? OR folder LIKE ?)';
      params.push(folder, folder + '/%');
    }

    if (fav === 'true') {
      query += ' AND is_favorite = 1';
    }

    if (q) {
      query += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
      const searchParam = `%${q}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    query += ' ORDER BY created_at DESC';

    const files = db.prepare(query).all(...params) as any[];
    
    // Парсим JSON поля
    const result = files.map(f => ({
      ...f,
      tags: JSON.parse(f.tags || '[]'),
      isFavorite: f.is_favorite === 1,
    }));

    res.json(result);
  } catch (error) {
    console.error('Ошибка получения файлов:', error);
    res.status(500).json({ error: 'Ошибка получения файлов' });
  }
});

// Получение одного файла
router.get('/:id', (req: Request, res: Response) => {
  try {
    const db = getDB();
    const file = db.prepare('SELECT * FROM files WHERE id = ?').get(req.params.id) as any;
    
    if (!file) {
      return res.status(404).json({ error: 'Файл не найден' });
    }

    res.json({
      ...file,
      tags: JSON.parse(file.tags || '[]'),
      isFavorite: file.is_favorite === 1,
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения файла' });
  }
});

// Обновление файла
router.patch('/:id', (req: Request, res: Response) => {
  try {
    const db = getDB();
    const { name, tags, description, folder, isFavorite } = req.body;
    
    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (tags !== undefined) {
      updates.push('tags = ?');
      params.push(JSON.stringify(tags));
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (folder !== undefined) {
      updates.push('folder = ?');
      params.push(folder);
    }
    if (isFavorite !== undefined) {
      updates.push('is_favorite = ?');
      params.push(isFavorite ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Нет данных для обновления' });
    }

    updates.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(req.params.id);

    db.prepare(`UPDATE files SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления файла' });
  }
});

// Удаление файла
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const db = getDB();
    const file = db.prepare('SELECT * FROM files WHERE id = ?').get(req.params.id) as any;
    
    if (!file) {
      return res.status(404).json({ error: 'Файл не найден' });
    }

    // Удаляем файл с диска
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Удаляем превью
    if (file.preview_path && fs.existsSync(file.preview_path)) {
      fs.unlinkSync(file.preview_path);
    }

    // Удаляем из БД
    db.prepare('DELETE FROM files WHERE id = ?').run(req.params.id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления файла' });
  }
});

export default router;
