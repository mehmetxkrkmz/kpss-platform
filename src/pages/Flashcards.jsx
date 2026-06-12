import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { flashcards } from '../services/flashcardsData';

export default function Flashcards() {
  const [filter, setFilter] = useState('Tümü');
  const [flippedCards, setFlippedCards] = useState({});

  // Dinamik kategorileri çıkarma
  const categories = ['Tümü', ...new Set(flashcards.map(c => c.subject))];

  // Filtreleme
  const filteredCards = filter === 'Tümü' 
    ? flashcards 
    : flashcards.filter(card => card.subject === filter);

  // Kart çevirme işlemi
  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 tracking-tight">Hap Bilgi Kartları</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">KPSS'de en çok sorulan ve ezberlenmesi gereken kritik bilgileri interaktif olarak tekrar edin. Cevabı görmek için kartların üzerine dokunun.</p>
        </div>

        {/* Filtreler */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                filter === cat 
                  ? 'bg-indigo-600 text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Kartlar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map(card => {
            const isFlipped = flippedCards[card.id];
            
            // Konuya göre renk ayarlama
            let colorFrom = "from-blue-500";
            let colorTo = "to-indigo-600";
            if (card.subject === "Tarih") { colorFrom = "from-red-500"; colorTo = "to-rose-600"; }
            if (card.subject === "Coğrafya") { colorFrom = "from-emerald-500"; colorTo = "to-green-600"; }
            if (card.subject === "Vatandaşlık") { colorFrom = "from-amber-500"; colorTo = "to-orange-600"; }
            if (card.subject === "Güncel") { colorFrom = "from-purple-500"; colorTo = "to-fuchsia-600"; }

            return (
              <div 
                key={card.id} 
                className="relative w-full h-64 cursor-pointer group"
                style={{ perspective: '1000px' }}
                onClick={() => toggleFlip(card.id)}
              >
                <div 
                  className="w-full h-full transition-transform duration-700 relative"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Kartın Ön Yüzü (Soru) */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-md border-2 border-gray-100 flex flex-col items-center justify-center p-6 text-center group-hover:shadow-xl transition-shadow"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <span className="absolute top-4 left-5 text-xs font-bold text-gray-400 uppercase tracking-widest">{card.subject}</span>
                    <p className="font-bold text-gray-800 text-lg md:text-xl leading-relaxed">{card.question}</p>
                    <div className="absolute bottom-4 text-xs text-indigo-400 font-semibold animate-pulse flex items-center gap-1">
                      <span>Cevap için dokun</span>
                    </div>
                  </div>

                  {/* Kartın Arka Yüzü (Cevap) */}
                  <div 
                    className={`absolute inset-0 w-full h-full bg-gradient-to-br ${colorFrom} ${colorTo} rounded-3xl shadow-xl flex flex-col items-center justify-center p-6 text-center`}
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                     <span className="absolute top-4 left-5 text-xs font-bold text-white/70 uppercase tracking-widest">{card.subject}</span>
                     <p className="font-black text-white text-xl md:text-2xl leading-relaxed drop-shadow-md">{card.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
