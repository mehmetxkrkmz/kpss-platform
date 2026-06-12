import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStop, FaClock, FaChevronDown, FaCoffee } from 'react-icons/fa';

export default function PomodoroWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Süre bittiğinde alarm çalabilir (opsiyonel)
      setIsActive(false);
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Widget Kapalıyken Gösterilecek Buton */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl font-bold text-white transition-all hover:scale-105 ${
            mode === 'work' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}
        >
          <FaClock className={isActive ? "animate-pulse" : ""} />
          <span>{formatTime(timeLeft)}</span>
        </button>
      )}

      {/* Widget Açıkken */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden w-72 animate-fade-in-up">
          <div className={`p-4 text-white flex justify-between items-center ${
            mode === 'work' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}>
            <h3 className="font-bold flex items-center gap-2">
              {mode === 'work' ? <FaClock /> : <FaCoffee />}
              {mode === 'work' ? 'Çalışma Zamanı' : 'Mola Zamanı'}
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
              <FaChevronDown />
            </button>
          </div>

          <div className="p-6 text-center">
            <div className="text-5xl font-black text-gray-800 mb-6 font-mono tracking-tighter">
              {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <button 
                onClick={toggleTimer}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl text-white shadow-lg hover:scale-105 transition-transform ${
                  mode === 'work' ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              >
                {isActive ? <FaPause /> : <FaPlay className="ml-1" />}
              </button>
              <button 
                onClick={resetTimer}
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FaStop />
              </button>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => changeMode('work')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'work' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'}`}
              >
                Pomodoro (25')
              </button>
              <button 
                onClick={() => changeMode('break')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'break' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}
              >
                Mola (5')
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
