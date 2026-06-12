import React from 'react';
import { FaHeart, FaGithub, FaTwitter, FaBookOpen } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8 mt-16 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 border-b border-gray-100 pb-8">
          
          <div className="flex flex-col items-center md:items-start max-w-sm text-center md:text-left">
            <div className="flex items-center gap-2 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">
              <FaBookOpen className="text-blue-600" />
              <span>EduTakip</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              KPSS Ortaöğretim ve diğer sınavlara hazırlık sürecinizde tüm müfredatı takip edebileceğiniz, ilerlemenizi kaydedebileceğiniz modern eğitim platformu.
            </p>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col text-center md:text-left">
              <h4 className="font-bold text-gray-800 mb-4">Hızlı Linkler</h4>
              <a href="#" className="text-gray-500 hover:text-blue-600 mb-2 text-sm transition-colors">Ana Sayfa</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 mb-2 text-sm transition-colors">Dersler</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Eğitmenler</a>
            </div>
            <div className="flex flex-col text-center md:text-left">
              <h4 className="font-bold text-gray-800 mb-4">Destek</h4>
              <a href="#" className="text-gray-500 hover:text-blue-600 mb-2 text-sm transition-colors">İletişim</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 mb-2 text-sm transition-colors">S.S.S</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Gizlilik</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-sm text-gray-400 gap-4">
          <p>© 2024 EduTakip. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-2">
            <span>Türkiye'de</span>
            <FaHeart className="text-red-500" />
            <span>ile geliştirildi</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-600 transition-colors text-lg"><FaTwitter /></a>
            <a href="#" className="hover:text-gray-800 transition-colors text-lg"><FaGithub /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
