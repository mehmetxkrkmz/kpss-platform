import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBookOpen, FaGoogle, FaSignOutAlt, FaBars, FaTimes, FaFire } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const { currentUser, loginWithGoogle, logout } = useAuth();

  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');
    let currentStreak = parseInt(localStorage.getItem('streak') || '0');

    if (lastVisit === today) {
      // Zaten bugün girmiş, seriyi koru
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastVisit === yesterday) {
        // Dün de girmiş, seriyi arttır
        currentStreak += 1;
      } else {
        // Seriyi bozmuş veya ilk girişi
        currentStreak = 1;
      }
      localStorage.setItem('lastVisit', today);
      localStorage.setItem('streak', currentStreak.toString());
    }
    setStreak(currentStreak);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 transition-transform hover:scale-105 duration-300">
            <FaBookOpen className="text-blue-600" />
            <span>EduTakip</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <div className="relative group w-64">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Ders keşfet..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-100 border border-transparent focus:bg-white focus:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all text-sm font-medium text-gray-700"
              />
            </div>

            <Link to="/" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap">Ana Sayfa</Link>
            <Link to="/playlists" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap">Eğitimler</Link>
            <Link to="/denemeler" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap">Deneme Takibi</Link>
            <Link to="/bilgi-kartlari" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-105 transition-transform whitespace-nowrap">Hap Bilgiler ⚡</Link>

            {/* 🔥 Streak / Seri Rozeti */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-1.5 rounded-full border border-orange-200 shadow-sm" title={`${streak} gündür aralıksız çalışıyorsun!`}>
              <FaFire className="text-orange-500 text-lg animate-pulse" />
              <span className="font-black text-orange-600">{streak}</span>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                <img src={currentUser.photoURL} alt="Profil" className="w-8 h-8 rounded-full border border-gray-100" />
                <span className="text-sm font-bold text-gray-700">{currentUser.displayName?.split(' ')[0]}</span>
                <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Çıkış Yap">
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <button 
                onClick={loginWithGoogle}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                <FaGoogle />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden text-gray-600 text-2xl p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4 pb-2 animate-fade-in-down">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Ders veya eğitmen keşfet..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-400 focus:outline-none transition-all font-medium text-gray-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="p-3 bg-gray-50 rounded-xl font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Ana Sayfa</Link>
              <Link to="/playlists" onClick={() => setIsMenuOpen(false)} className="p-3 bg-gray-50 rounded-xl font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Eğitimler (Oynatma Listeleri)</Link>
              <Link to="/denemeler" onClick={() => setIsMenuOpen(false)} className="p-3 bg-gray-50 rounded-xl font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Deneme Net Takibi</Link>
              <Link to="/bilgi-kartlari" onClick={() => setIsMenuOpen(false)} className="p-3 bg-amber-50 rounded-xl font-extrabold text-amber-600 hover:bg-amber-100 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Hap Bilgiler</span>
                  <span className="text-xl">⚡</span>
                </div>
                {/* Mobil 🔥 Streak Rozeti */}
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-orange-200 shadow-sm" title={`${streak} gündür aralıksız çalışıyorsun!`}>
                  <FaFire className="text-orange-500 animate-pulse" />
                  <span className="font-black text-orange-600 text-sm">{streak}</span>
                </div>
              </Link>
            </div>

            {currentUser ? (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-4 rounded-xl mt-2">
                <div className="flex items-center gap-3">
                  <img src={currentUser.photoURL} alt="Profil" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                  <div className="flex flex-col">
                    <span className="text-xs text-blue-500 font-semibold uppercase tracking-wider">Hoş Geldin</span>
                    <span className="text-base font-extrabold text-gray-800">{currentUser.displayName}</span>
                  </div>
                </div>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="p-3 bg-white text-red-600 rounded-xl shadow-sm border border-red-100 hover:bg-red-50 transition-colors">
                  <FaSignOutAlt className="text-xl" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { loginWithGoogle(); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-md mt-2"
              >
                <FaGoogle className="text-xl" />
                <span>Google ile Giriş Yap</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
