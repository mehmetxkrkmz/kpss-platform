import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import CourseCard from '../components/CourseCard';
import Navbar from '../components/Navbar';
import { seedDatabase } from '../services/mockData';
import { flashcards } from '../services/flashcardsData';

import { FaClock, FaListOl, FaCalendarCheck, FaGraduationCap, FaLightbulb, FaQuoteLeft } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sınava Kalan Süre Mantığı (Örn: KPSS 2026 için tahmini tarih)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const targetDate = new Date("2026-09-06T10:15:00").getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Günün Hap Bilgisi & Motivasyon Sözü Mantığı
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const dailyCard = flashcards[dayOfYear % flashcards.length];
  
  const motivations = [
    "Bugün yapacağın küçük bir fedakarlık, yarın yaşayacağın büyük bir zaferin temelidir.",
    "Büyük başarıların sırrı, bıkmadan usanmadan çalışmaktır.",
    "Zorluklar seni durdurmak için değil, güçlendirmek için vardır.",
    "Zamanın en iyi yatırımı, geleceğine yaptığın eğitimdir.",
    "Hiçbir çaba karşılıksız kalmaz, bugün ek, yarın biç.",
    "Yorgunluk geçer, başarının gururu bir ömür sürer.",
    "Hayallerine ulaşmanın tek yolu uyanıp harekete geçmektir."
  ];
  const dailyMotivation = motivations[dayOfYear % motivations.length];

  // Firestore'dan dersleri çekme
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        
        // Eğer veri yoksa mock datayı yükleyelim (geliştirme amaçlı otomatik kolaylık)
        if (querySnapshot.empty) {
          console.log("Veri bulunamadı, mock veriler yükleniyor...");
          await seedDatabase();
          const newSnapshot = await getDocs(collection(db, "courses"));
          const coursesData = newSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCourses(coursesData);
        } else {
          const coursesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          // Dersleri kendi içinde rastgele gelmemesi için sıralayalım
          setCourses(coursesData.sort((a,b) => a.title.localeCompare(b.title)));
        }
      } catch (err) {
        setError("Dersler yüklenirken bir hata oluştu. Lütfen bağlantınızı kontrol edin.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Arama filtresi
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Veritabanını yeni KPSS Ortaöğretim müfredatıyla zorla güncelle
  const handleSeed = async () => {
    setLoading(true);
    await seedDatabase();
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onSearch={setSearchTerm} />

      {/* Geri Sayım Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white py-4 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              <FaClock className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide">2026 KPSS Ortaöğretim</h2>
              <p className="text-xs text-indigo-200">Zaman daralıyor, hedefine odaklan!</p>
            </div>
          </div>
          <div className="flex gap-3 text-center">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 min-w-[70px]">
              <div className="text-2xl font-black text-white">{timeLeft.days}</div>
              <div className="text-[10px] uppercase tracking-wider text-indigo-200">Gün</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 min-w-[70px]">
              <div className="text-2xl font-black text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
              <div className="text-[10px] uppercase tracking-wider text-indigo-200">Saat</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 min-w-[70px]">
              <div className="text-2xl font-black text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
              <div className="text-[10px] uppercase tracking-wider text-indigo-200">Dakika</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 min-w-[70px]">
              <div className="text-2xl font-black text-red-400">{timeLeft.seconds.toString().padStart(2, '0')}</div>
              <div className="text-[10px] uppercase tracking-wider text-red-200">Saniye</div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto p-4 md:p-8 flex-grow">
        
        {/* KPSS Bilgi Hero Bölümü */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-6 md:p-10 mb-10 mt-4 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-indigo-800 tracking-tight">KPSS Ortaöğretim Rehberi</h1>
              <p className="text-gray-500 mt-2 font-medium">Sınav formatı, süre ve soru dağılımları hakkında bilmeniz gereken her şey.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/bilgi-kartlari" className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all text-sm whitespace-nowrap flex items-center gap-2">
                Hap Bilgiler ⚡
              </Link>
              <button 
                onClick={handleSeed}
                className="px-6 py-2.5 bg-white text-indigo-600 border border-indigo-100 font-bold rounded-full shadow-sm hover:bg-indigo-50 hover:scale-105 transition-all text-sm whitespace-nowrap"
              >
                Müfredatı Güncelle
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50 flex items-start gap-4 hover:bg-blue-50 transition-colors">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl text-xl"><FaListOl /></div>
              <div>
                <h4 className="font-bold text-gray-800">120 Soru Toplam</h4>
                <p className="text-sm text-gray-600 mt-1">60 Genel Yetenek (Türkçe, Mat) ve 60 Genel Kültür (Tarih, Coğ, Vat, Güncel).</p>
              </div>
            </div>
            <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100/50 flex items-start gap-4 hover:bg-purple-50 transition-colors">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl text-xl"><FaClock /></div>
              <div>
                <h4 className="font-bold text-gray-800">130 Dakika Süre</h4>
                <p className="text-sm text-gray-600 mt-1">Her bir soru için ortalama 1 dakikadan biraz fazla süreniz bulunmaktadır.</p>
              </div>
            </div>
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100/50 flex items-start gap-4 hover:bg-amber-50 transition-colors">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl text-xl"><FaCalendarCheck /></div>
              <div>
                <h4 className="font-bold text-gray-800">2 Yıl Geçerlilik</h4>
                <p className="text-sm text-gray-600 mt-1">Ortaöğretim sınav sonuçları açıklandığı tarihten itibaren 2 yıl boyunca geçerlidir.</p>
              </div>
            </div>
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 flex items-start gap-4 hover:bg-emerald-50 transition-colors">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl text-xl"><FaGraduationCap /></div>
              <div>
                <h4 className="font-bold text-gray-800">Kimler Girebilir?</h4>
                <p className="text-sm text-gray-600 mt-1">Lise mezunu olan veya sınavın geçerlilik süresi içinde mezun olabilecek adaylar.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Günlük Seri & Motivasyon Alanı */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16 items-stretch">
          {/* Motivasyon Sözü */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 md:p-10 text-white shadow-lg relative overflow-hidden flex flex-col justify-center h-full">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 text-white/10 text-9xl pointer-events-none">
              <FaQuoteLeft />
            </div>
            <h3 className="text-xl font-bold text-indigo-200 mb-4 tracking-wider uppercase">Günün Motivasyonu</h3>
            <p className="text-2xl md:text-3xl font-bold leading-tight relative z-10">"{dailyMotivation}"</p>
          </div>

          {/* Günün Hap Bilgisi */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm relative group cursor-pointer hover:shadow-lg transition-all flex flex-col h-full overflow-hidden" onClick={() => navigate('/bilgi-kartlari')}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                <FaLightbulb />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800">Günün Hap Bilgisi</h3>
                <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">{dailyCard.subject}</span>
              </div>
            </div>
            
            <p className="text-lg font-medium text-gray-700 mb-6 flex-grow">{dailyCard.question}</p>
            
            <div className="relative overflow-hidden mt-auto">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <span className="text-sm text-gray-400 font-bold mb-1 block">Cevap:</span>
                <p className="text-indigo-600 font-bold">{dailyCard.answer}</p>
              </div>
              <div className="absolute inset-0 flex items-end text-sm text-gray-400 group-hover:opacity-0 transition-opacity duration-300 font-medium pb-2">
                Cevabı görmek için üzerine gel...
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-indigo-600">Dersler & Konu Analizleri</h2>

        {/* Yükleniyor Durumu */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
          </div>
        )}

        {/* Hata Durumu */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-center font-medium shadow-sm">
            {error}
          </div>
        )}

        {/* İçerik */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
            {filteredCourses.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">Aramanıza uygun ders bulunamadı.</p>
              </div>
            )}
          </div>
        )}

        {/* Neden Biz Bölümü */}
        {!loading && (
          <div className="mt-20 mb-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">Neden EduTakip?</h2>
              <p className="text-gray-500 mt-3">Sınava hazırlanırken size zaman kazandıran modern özellikler</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 transform rotate-3">
                  <FaListOl />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Güncel Müfredat</h3>
                <p className="text-gray-600 text-sm">2024 KPSS Ortaöğretim sistemine tam uyumlu, özenle hazırlanmış konu ve soru dağılımları.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 -rotate-3">
                  <FaCalendarCheck />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">İlerleme Takibi</h3>
                <p className="text-gray-600 text-sm">Bitirdiğiniz konuları işaretleyin, bulut tabanlı altyapımızla kaldığınız yeri asla unutmayın.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6 rotate-3">
                  <FaGraduationCap />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Seçkin Eğitmenler</h3>
                <p className="text-gray-600 text-sm">YouTube'un en çok izlenen ve başarıya ulaştıran alanında uzman hocalarının eğitim listeleri.</p>
              </div>
            </div>
          </div>
        )}

        {/* Sınav Stratejileri Bölümü */}
        {!loading && (
          <div className="mt-20 mb-10">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Ders Çalışma Stratejileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Matematik & Geometri</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Matematik formül ezberlemekten ziyade pratik yapma dersidir. Çözemediğiniz soruların video çözümlerini mutlaka izleyin ve bir soru defteri oluşturun. Sınavda zaman yönetimi açısından en kritik derstir.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-red-500">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Tarih</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tarih nankör bir derstir, çabuk unutulur. Bol soru çözerek bilgileri taze tutmalı ve olaylar arasında sebep-sonuç ilişkisi kurmalısınız. Zihin haritaları (mind map) oluşturmak çok etkilidir.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Coğrafya</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Dilsiz harita çalışmaları coğrafyanın temelidir. Dağların, göllerin, sanayi ve tarım alanlarının yerlerini harita üzerinde çalışarak görsel hafızanızı devreye sokun.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-orange-500">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Türkçe (Paragraf)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Her gün mutlaka en az 20 paragraf sorusu çözerek okuma anlama hızınızı artırın. Sözel mantık soruları için tablo kurma tekniklerini iyi öğrenin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SSS Bölümü */}
        {!loading && (
          <div className="mt-20 mb-10 bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Sıkça Sorulan Sorular</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white p-5 rounded-2xl shadow-sm">
                <h4 className="font-bold text-gray-800">İlerlememi farklı cihazlarda görebilir miyim?</h4>
                <p className="text-gray-600 text-sm mt-2">Evet, sağ üstten Google hesabınızla giriş yaptığınız sürece telefon, tablet veya bilgisayar fark etmeksizin tüm ilerlemeniz buluta kaydedilir ve senkronize çalışır.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm">
                <h4 className="font-bold text-gray-800">Sitedeki oynatma listeleri ücretli mi?</h4>
                <p className="text-gray-600 text-sm mt-2">Hayır. EduTakip, alanında uzman hocaların YouTube üzerinde tamamen ücretsiz olarak yayınladığı en kaliteli eğitimleri sizin için bir araya getiren açık bir platformdur.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm">
                <h4 className="font-bold text-gray-800">Puan Hesaplaması nasıl yapılıyor?</h4>
                <p className="text-gray-600 text-sm mt-2">KPSS'de standart sapma etkilidir. Ancak kaba bir hesapla Genel Yetenek ve Genel Kültür sorularının her biri puanınıza yaklaşık 0.5 puan etki etmektedir. Testlerin zorluk derecesine göre bu katsayı değişebilir.</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
