import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FaChartLine, FaPlus, FaTrash, FaTrophy } from 'react-icons/fa';

export default function ExamTracker() {
  const { currentUser } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [examName, setExamName] = useState('');
  const [turkish, setTurkish] = useState('');
  const [math, setMath] = useState('');
  const [history, setHistory] = useState('');
  const [geography, setGeography] = useState('');
  const [citizenship, setCitizenship] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchExams();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchExams = async () => {
    try {
      const q = query(
        collection(db, 'exams'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const examList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // İstemci tarafında tarihe göre sıralama (Index hatası almamak için)
      examList.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setExams(examList);
    } catch (error) {
      console.error("Denemeler çekilirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const t = parseFloat(turkish) || 0;
    const m = parseFloat(math) || 0;
    const h = parseFloat(history) || 0;
    const g = parseFloat(geography) || 0;
    const c = parseFloat(citizenship) || 0;
    const total = t + m + h + g + c;

    try {
      await addDoc(collection(db, 'exams'), {
        userId: currentUser.uid,
        examName: examName || `${exams.length + 1}. Deneme`,
        turkish: t,
        math: m,
        history: h,
        geography: g,
        citizenship: c,
        totalNet: total,
        createdAt: serverTimestamp()
      });
      
      setShowModal(false);
      setExamName('');
      setTurkish(''); setMath(''); setHistory(''); setGeography(''); setCitizenship('');
      fetchExams();
    } catch (error) {
      console.error("Deneme eklenirken hata:", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 flex-grow">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-gray-500 max-w-md">Deneme sınavı netlerinizi kaydetmek ve gelişiminizi takip etmek için üst menüden Google hesabınızla giriş yapmalısınız.</p>
        </div>
      </div>
    );
  }

  const bestExam = exams.length > 0 ? exams.reduce((prev, current) => (prev.totalNet > current.totalNet) ? prev : current) : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-3">
            <FaChartLine className="text-blue-600" />
            Deneme Net Takibi
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Girdiğiniz deneme sınavlarını kaydedin, gelişiminizi analiz edin.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <FaPlus /> Yeni Deneme Ekle
        </button>
      </div>

      {/* İstatistik Özetleri */}
      {exams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">
              <FaChartLine />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Çözülen Deneme</p>
              <p className="text-3xl font-black text-gray-800">{exams.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center text-2xl">
              <FaTrophy />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">En Yüksek Net</p>
              <p className="text-3xl font-black text-gray-800">{bestExam?.totalNet}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-md text-white flex items-center justify-center">
            <div className="text-center">
              <p className="text-indigo-100 font-bold uppercase tracking-wider mb-1">Hedefine Odaklan</p>
              <p className="font-medium text-sm">Her deneme bir tecrübedir. Eksiklerini gör, üzerine git!</p>
            </div>
          </div>
        </div>
      )}

      {/* Deneme Listesi */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Yükleniyor...</div>
        ) : exams.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-5xl mb-4 text-gray-300">📝</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz Deneme Eklenmemiş</h3>
            <p className="text-gray-500">İlk deneme sonucunuzu ekleyerek gelişiminizi takip etmeye başlayın.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-bold border-b border-gray-100">Deneme Adı</th>
                  <th className="p-4 font-bold border-b border-gray-100 text-center">Türkçe</th>
                  <th className="p-4 font-bold border-b border-gray-100 text-center">Matematik</th>
                  <th className="p-4 font-bold border-b border-gray-100 text-center">Tarih</th>
                  <th className="p-4 font-bold border-b border-gray-100 text-center">Coğrafya</th>
                  <th className="p-4 font-bold border-b border-gray-100 text-center">Vat. & Güncel</th>
                  <th className="p-4 font-black text-indigo-600 border-b border-gray-100 text-center">Toplam Net</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-blue-50/50 transition-colors border-b border-gray-50">
                    <td className="p-4 font-bold text-gray-800">{exam.examName}</td>
                    <td className="p-4 text-center text-gray-600">{exam.turkish}</td>
                    <td className="p-4 text-center text-gray-600">{exam.math}</td>
                    <td className="p-4 text-center text-gray-600">{exam.history}</td>
                    <td className="p-4 text-center text-gray-600">{exam.geography}</td>
                    <td className="p-4 text-center text-gray-600">{exam.citizenship}</td>
                    <td className="p-4 text-center font-black text-indigo-600 text-lg bg-indigo-50/30">{exam.totalNet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Yeni Deneme Ekle */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-down">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Yeni Deneme Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Deneme Adı / Yayın</label>
                <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="Örn: Pegem Türkiye Geneli 1" className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Türkçe (Net)</label>
                  <input type="number" step="0.25" required value={turkish} onChange={(e) => setTurkish(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Matematik (Net)</label>
                  <input type="number" step="0.25" required value={math} onChange={(e) => setMath(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tarih (Net)</label>
                  <input type="number" step="0.25" required value={history} onChange={(e) => setHistory(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Coğrafya (Net)</label>
                  <input type="number" step="0.25" required value={geography} onChange={(e) => setGeography(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Vatandaşlık & Güncel (Net)</label>
                  <input type="number" step="0.25" required value={citizenship} onChange={(e) => setCitizenship(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">İptal</button>
                <button type="submit" className="flex-1 py-3 text-white font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-lg">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
