# 🗄️ MyVault — Установка и использование

## 📋 Что это?

**MyVault** — это личное хранилище файлов, которое работает на вашем компьютере и доступно с любого устройства в локальной сети (телефон, планшет, другой компьютер).

### Как это работает:
```
📱 Телефон → загружаете фото → оно сохраняется на компьютере
💻 Другой ПК → загружаете файл → оно сохраняется на компьютере  
🖥️ Ваш компьютер → всё хранится здесь, в указанной папке
```

---

## 🚀 Установка (один раз)

### Требования:
- **Node.js** версии 18 или выше ([скачать](https://nodejs.org/))
- **Windows / macOS / Linux**

### Шаг 1: Скачайте проект

```bash
# Создайте папку для проекта
mkdir myvault
cd myvault

# Скопируйте все файлы проекта сюда
# (или скачайте архив и распакуйте)
```

### Шаг 2: Установите зависимости

```bash
# Установка сервера
cd server
npm install

# Установка клиента
cd ../client
npm install
```

### Шаг 3: Соберите клиент

```bash
cd client
npm run build
```

### Шаг 4: Запустите сервер

```bash
cd server
npm run build
npm start
```

**Готово!** Вы увидите:
```
🗄️  MyVault Server запущен!

📁 Хранилище: /путь/к/myvault-storage
🌐 Локальный доступ: http://localhost:3001
📱 Доступ с телефона: http://192.168.1.100:3001
```

---

## 📱 Использование

### С компьютера:
1. Откройте браузер
2. Перейдите на `http://localhost:3001`
3. Загружайте файлы drag & drop или через кнопку "Загрузить"

### С телефона:
1. Убедитесь, что телефон и компьютер в **одной WiFi сети**
2. Откройте браузер на телефоне
3. Перейдите по адресу, который показал сервер (например `http://192.168.1.100:3001`)
4. Загружайте файлы — они сохранятся на компьютере!

---

## 📂 Где хранятся файлы?

Все файлы хранятся в папке `myvault-storage` (создаётся автоматически):

```
myvault-storage/
├── myvault.db              # База данных (метаданные)
└── uploads/                # Все ваши файлы
    ├── Фото/
    │   └── 2024/
    │       └── 01/
    │           └── фото.jpg
    ├── Видео/
    │   └── 2024/
    │       └── 01/
    │           └── видео.mp4
    ├── Документы/
    │   └── 2024/
    │       └── документ.pdf
    ├── Код/
    │   └── JavaScript/
    │       └── script.js
    └── Идеи/
        └── ...
```

### Изменить путь хранения:

```bash
# Запуск с указанием своей папки
STORAGE_PATH=/mnt/data/myvault npm start

# Или в Windows
set STORAGE_PATH=D:\MyVault
npm start
```

---

## 🔧 Автозапуск при включении компьютера

### Windows:
1. Создайте файл `start-myvault.bat`:
```bat
@echo off
cd /d "C:\path\to\myvault\server"
npm start
```

2. Нажмите `Win+R` → `shell:startup`
3. Скопируйте `.bat` файл в открывшуюся папку

### macOS:
1. Создайте файл `~/Library/LaunchAgents/com.myvault.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.myvault</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/path/to/myvault/server/dist/index.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/path/to/myvault/server</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

2. Загрузите: `launchctl load ~/Library/LaunchAgents/com.myvault.plist`

### Linux (systemd):
1. Создайте `/etc/systemd/system/myvault.service`:
```ini
[Unit]
Description=MyVault Server
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/myvault/server
ExecStart=/usr/bin/node dist/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

2. Активируйте:
```bash
sudo systemctl enable myvault
sudo systemctl start myvault
```

---

## 🌐 Доступ из интернета (опционально)

Если хотите доступ не только из локальной сети:

### Вариант 1: Port forwarding
1. В настройках роутера пробросьте порт 3001 на компьютер
2. Используйте внешний IP для доступа

### Вариант 2: ngrok (бесплатно)
```bash
# Установите ngrok
npm install -g ngrok

# Запустите туннель
ngrok http 3001
```

Получите публичную ссылку вида `https://abc123.ngrok.io`

### Вариант 3: Cloudflare Tunnel
```bash
# Установите cloudflared
# Создайте туннель
cloudflared tunnel --url http://localhost:3001
```

---

## 🐛 Решение проблем

### "Не могу подключиться с телефона"
- Проверьте, что телефон и компьютер в **одной WiFi сети**
- Проверьте файрвол — разрешите порт 3001
- Попробуйте отключить антивирус временно

### "Файлы не сохраняются"
- Проверьте права доступа к папке `myvault-storage`
- Убедитесь, что на диске есть свободное место

### "Сервер не запускается"
- Убедитесь, что Node.js версии 18+ установлен: `node --version`
- Проверьте, что порт 3001 не занят: `netstat -ano | findstr :3001` (Windows)

---

## 📊 Резервное копирование

Вся информация хранится в папке `myvault-storage`:
- `myvault.db` — база данных (метаданные, теги, описания)
- `uploads/` — все ваши файлы

**Для бэкапа просто копируйте эту папку!**

---

## 🔒 Безопасность

- ✅ Все данные хранятся **локально на вашем компьютере**
- ✅ Нет отправки данных на внешние серверы
- ✅ Доступ только из вашей локальной сети (по умолчанию)
- ⚠️ При доступе из интернета — настройте авторизацию!

---

## 💡 Советы

1. **Используйте SSD** для папки хранения — быстрее работа с файлами
2. **Регулярно делайте бэкапы** папки `myvault-storage`
3. **Настройте автозапуск** — сервер будет работать всегда
4. **Добавьте в закладки** адрес на телефоне для быстрого доступа

---

## 📞 Поддержка

Если возникли вопросы или проблемы:
1. Проверьте логи сервера в консоли
2. Убедитесь, что все зависимости установлены (`npm install`)
3. Попробуйте перезапустить сервер

---

**Приятного использования! 🎉**
