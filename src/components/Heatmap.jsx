import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Heatmap() {
  const { currentUser } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadData();
    } else {
      const local = localStorage.getItem('heatmapData');
      if (local) setData(JSON.parse(local));
      setLoading(false);
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      const docRef = doc(db, 'heatmap', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data().questions || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToday = async (e) => {
    e.preventDefault();
    if (!todayCount || isNaN(todayCount)) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newData = { ...data, [today]: parseInt(todayCount) };
    setData(newData);
    setTodayCount('');

    if (currentUser) {
      const docRef = doc(db, 'heatmap', currentUser.uid);
      await setDoc(docRef, { questions: newData }, { merge: true });
    } else {
      localStorage.setItem('heatmapData', JSON.stringify(newData));
    }
  };

  // Generate last 119 days (17 weeks x 7 days)
  const days = [];
  let current = new Date();
  current.setDate(current.getDate() - 118); // Start 119 days ago
  
  for (let i = 0; i < 119; i++) {
    const dStr = current.toISOString().split('T')[0];
    const count = data[dStr] || 0;
    days.push({
      date: dStr,
      count: count
    });
    current.setDate(current.getDate() + 1);
  }

  // Split into weeks (arrays of 7 days)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getColor = (count) => {
    if (count === 0) return 'bg-gray-100';
    if (count < 50) return 'bg-green-200';
    if (count < 150) return 'bg-green-400';
    if (count < 300) return 'bg-green-600';
    return 'bg-green-800'; // 300+ sorular
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
            🟩 Soru Çözüm Haritası
          </h3>
          <p className="text-sm text-gray-500 font-medium">Son 17 Haftalık Soru Çözüm Katkı Ağacın</p>
        </div>
        <form onSubmit={handleSaveToday} className="flex gap-2 w-full md:w-auto">
          <input 
            type="number" 
            placeholder="Bugün kaç soru çözdün?" 
            value={todayCount}
            onChange={(e) => setTodayCount(e.target.value)}
            className="flex-grow md:w-56 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
          />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
            Kaydet
          </button>
        </form>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-1.5 min-w-max">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1.5">
              {week.map((day, dIndex) => (
                <div 
                  key={dIndex} 
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-sm ${getColor(day.count)} cursor-pointer transition-transform hover:scale-125`}
                  title={`${day.date}: ${day.count} Soru`}
                ></div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-gray-400 justify-end w-full">
          <span>Az</span>
          <div className="w-3.5 h-3.5 rounded-sm bg-gray-100"></div>
          <div className="w-3.5 h-3.5 rounded-sm bg-green-200"></div>
          <div className="w-3.5 h-3.5 rounded-sm bg-green-400"></div>
          <div className="w-3.5 h-3.5 rounded-sm bg-green-600"></div>
          <div className="w-3.5 h-3.5 rounded-sm bg-green-800"></div>
          <span>Çok (300+)</span>
        </div>
      </div>
    </div>
  );
}
