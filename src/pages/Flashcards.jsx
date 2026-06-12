import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { flashcards } from '../services/flashcardsData';
import { FaChevronLeft, FaChevronRight, FaUndoAlt, FaKeyboard } from 'react-icons/fa';

export default function Flashcards() {
  const [filter, setFilter] = useState('Tümü');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Dinamik kategoriler
  const categories = ['Tümü', ...new Set(flashcards.map(c => c.subject))];

  // Filtrelenmiş kartlar
  const filteredCards = filter === 'Tümü' 
    ? flashcards 
    : flashcards.filter(card => card.subject === filter);

  // Filtre değiştiğinde ilk karta dön ve yüzünü çevir
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filter]);

  // Klavye kısayolları
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCards.length]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % filteredCards.length);
    }, 150); // Çevrilme animasyonunun kapanmasını hafifçe bekle
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  if (filteredCards.length === 0) return null;

  const currentCard = filteredCards[currentIndex];

  // Renk belirleme
  let colorFrom = "from-blue-500";
  let colorTo = "to-indigo-600";
  if (currentCard.subject === "Tarih") { colorFrom = "from-red-500"; colorTo = "to-rose-600"; }
  if (currentCard.subject === "Coğrafya") { colorFrom = "from-emerald-500"; colorTo = "to-green-600"; }
  if (currentCard.subject === "Vatandaşlık") { colorFrom = "from-amber-500"; colorTo = "to-orange-600"; }
  if (currentCard.subject === "Güncel") { colorFrom = "from-purple-500"; colorTo = "to-fuchsia-600"; }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 tracking-tight">Hap Bilgi Kartları</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">KPSS kritik bilgilerini odaklanarak tekrar edin. <br className="hidden md:block"/> Yön tuşlarını kullanarak gezinebilir, boşluk (space) tuşuyla kartı çevirebilirsiniz.</p>
        </div>

        {/* Filtreler */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-3xl">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
                filter === cat 
                  ? 'bg-indigo-600 text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Odaklanmış Tek Kart Görünümü */}
        <div className="w-full max-w-3xl flex-grow flex flex-col items-center justify-center mb-10">
          
          <div 
            className="relative w-full h-80 md:h-96 cursor-pointer group mb-8"
            style={{ perspective: '1500px' }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div 
              className="w-full h-full transition-transform duration-700 relative"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Ön Yüz (Soru) */}
              <div 
                className="absolute inset-0 w-full h-full bg-white rounded-[2rem] shadow-xl border border-gray-100 flex flex-col items-center justify-center p-8 md:p-12 text-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="absolute top-6 left-8 bg-gray-100 px-4 py-1.5 rounded-full">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{currentCard.subject}</span>
                </div>
                <div className="absolute top-6 right-8 text-gray-400">
                  <FaUndoAlt className="text-xl opacity-50" />
                </div>
                <p className="font-bold text-gray-800 text-2xl md:text-3xl leading-relaxed">{currentCard.question}</p>
                <div className="absolute bottom-8 text-sm text-indigo-400 font-semibold animate-pulse">
                  Cevabı görmek için dokun
                </div>
              </div>

              {/* Arka Yüz (Cevap) */}
              <div 
                className={`absolute inset-0 w-full h-full bg-gradient-to-br ${colorFrom} ${colorTo} rounded-[2rem] shadow-2xl flex flex-col items-center justify-center p-8 md:p-12 text-center`}
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="absolute top-6 left-8 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                  <span className="text-xs font-bold text-white uppercase tracking-widest">{currentCard.subject}</span>
                </div>
                <p className="font-black text-white text-3xl md:text-4xl leading-relaxed drop-shadow-lg">{currentCard.answer}</p>
              </div>
            </div>
          </div>

          {/* Kontrol Butonları */}
          <div className="flex items-center justify-center gap-6 md:gap-10 w-full">
            <button 
              onClick={handlePrev}
              className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors hover:scale-105 active:scale-95"
            >
              <FaChevronLeft className="text-xl" />
            </button>
            
            <div className="text-center">
              <div className="text-xl font-black text-gray-800 tracking-widest">
                {currentIndex + 1} <span className="text-gray-400 font-medium">/ {filteredCards.length}</span>
              </div>
            </div>

            <button 
              onClick={handleNext}
              className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors hover:scale-105 active:scale-95"
            >
              <FaChevronRight className="text-xl" />
            </button>
          </div>

          <div className="mt-8 hidden md:flex items-center gap-2 text-xs font-medium text-gray-400 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <FaKeyboard className="text-lg" />
            <span>Klavye Kontrolü: <b>Sağ/Sol</b> Oklar ile Gezin, <b>Boşluk</b> ile Çevir</span>
          </div>

        </div>
      </main>
    </div>
  );
}
