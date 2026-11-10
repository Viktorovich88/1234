// Компонент с инструкцией по установке приложения
import { useState } from 'react';
import { useStore } from '../store';

export function InstallGuide() {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 left-4 z-40 px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105 ${
          isDark 
            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' 
            : 'bg-white text-slate-700 hover:bg-slate-50'
        } border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
      >
        <span className="text-lg mr-2">📱</span>
        <span className="text-sm font-medium">Установить на телефон</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div
        className={`max-w-2xl w-full mx-4 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto scrollbar-thin ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        } border`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              📱 Установка на телефон
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              MyVault работает как обычное приложение
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            ✕
          </button>
        </div>

        {/* Инструкции для разных платформ */}
        <div className="space-y-6">
          {/* iPhone/iPad */}
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="text-2xl">🍎</span> iPhone / iPad
            </h3>
            <ol className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Откройте этот сайт в <strong>Safari</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>Нажмите кнопку <strong>"Поделиться"</strong> (квадрат со стрелкой вверх)</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>Прокрутите вниз и выберите <strong>"На экран Домой"</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">4</span>
                <span>Нажмите <strong>"Добавить"</strong></span>
              </li>
            </ol>
            <p className={`mt-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              ✅ Готово! MyVault появится на рабочем столе как обычное приложение
            </p>
          </div>

          {/* Android */}
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="text-2xl">🤖</span> Android
            </h3>
            <ol className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Откройте этот сайт в <strong>Chrome</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>Нажмите <strong>меню</strong> (три точки ⋮ в правом верхнем углу)</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>Выберите <strong>"Установить приложение"</strong> или <strong>"Добавить на главный экран"</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">4</span>
                <span>Подтвердите установку</span>
              </li>
            </ol>
            <p className={`mt-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              ✅ Готово! MyVault появится на рабочем столе
            </p>
          </div>

          {/* Компьютер */}
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
            <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="text-2xl">💻</span> Компьютер (Windows/Mac/Linux)
            </h3>
            <ol className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Откройте этот сайт в <strong>Chrome</strong>, <strong>Edge</strong> или <strong>Opera</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>В адресной строке появится значок <strong>"Установить"</strong> (ⓘ или ⬇️)</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>Нажмите на него и выберите <strong>"Установить"</strong></span>
              </li>
            </ol>
            <p className={`mt-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              ✅ Готово! MyVault откроется в отдельном окне как обычная программа
            </p>
          </div>
        </div>

        {/* Преимущества */}
        <div className={`mt-6 p-4 rounded-xl bg-gradient-to-br ${isDark ? 'from-indigo-900/30 to-purple-900/30' : 'from-indigo-50 to-purple-50'}`}>
          <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ✨ Преимущества установки
          </h3>
          <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>Работает как обычное приложение</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>Открывается в полноэкранном режиме</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>Быстрый запуск с рабочего стола</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>Работает офлайн (после первой загрузки)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>Не занимает место в браузере</span>
            </li>
          </ul>
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={() => setIsOpen(false)}
          className="w-full mt-6 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          Понятно, закрыть
        </button>
      </div>
    </div>
  );
}
