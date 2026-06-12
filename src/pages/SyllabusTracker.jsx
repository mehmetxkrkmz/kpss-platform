import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { syllabusData } from '../services/syllabusData';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaCheckCircle, FaRegCircle, FaTasks, FaLock } from 'react-icons/fa';

export default function SyllabusTracker() {
  const { currentUser } = useAuth();
  const [completedTopics, setCompletedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(syllabusData[0].id);

  useEffect(() => {
    if (currentUser) {
      loadProgress();
    } else {
      // Load from local storage for guests
      const local = localStorage.getItem('syllabusProgress');
      if (local) setCompletedTopics(JSON.parse(local));
      setLoading(false);
    }
  }, [currentUser]);

  const loadProgress = async () => {
    try {
      const docRef = doc(db, 'syllabus', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCompletedTopics(docSnap.data().completed || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = async (topicName) => {
    let newCompleted;
    if (completedTopics.includes(topicName)) {
      newCompleted = completedTopics.filter(t => t !== topicName);
    } else {
      newCompleted = [...completedTopics, topicName];
    }
    
    setCompletedTopics(newCompleted);

    if (currentUser) {
      const docRef = doc(db, 'syllabus', currentUser.uid);
      await setDoc(docRef, { completed: newCompleted }, { merge: true });
    } else {
      localStorage.setItem('syllabusProgress', JSON.stringify(newCompleted));
    }
  };

  // Calculate global progress
  const totalTopics = syllabusData.reduce((sum, subject) => sum + subject.topics.length, 0);
  const globalProgress = Math.round((completedTopics.length / totalTopics) * 100);

  const activeSubject = syllabusData.find(s => s.id === activeTab);
  const activeSubjectProgress = Math.round(
    (activeSubject.topics.filter(t => completedTopics.includes(t)).length / activeSubject.topics.length) * 100
  );

  const getColorClasses = (color, isActive, type) => {
    const colorMap = {
      amber: { bg: 'bg-amber-500', bgLight: 'bg-amber-50', text: 'text-amber-700', textLight: 'text-amber-600', border: 'border-amber-500', borderLight: 'border-amber-200' },
      emerald: { bg: 'bg-emerald-500', bgLight: 'bg-emerald-50', text: 'text-emerald-700', textLight: 'text-emerald-600', border: 'border-emerald-500', borderLight: 'border-emerald-200' },
      purple: { bg: 'bg-purple-500', bgLight: 'bg-purple-50', text: 'text-purple-700', textLight: 'text-purple-600', border: 'border-purple-500', borderLight: 'border-purple-200' },
      blue: { bg: 'bg-blue-500', bgLight: 'bg-blue-50', text: 'text-blue-700', textLight: 'text-blue-600', border: 'border-blue-500', borderLight: 'border-blue-200' },
      slate: { bg: 'bg-slate-500', bgLight: 'bg-slate-50', text: 'text-slate-700', textLight: 'text-slate-600', border: 'border-slate-500', borderLight: 'border-slate-200' },
    };
    const c = colorMap[color] || colorMap.blue;
    if (type === 'button') return isActive ? `${c.bgLight} ${c.borderLight} shadow-sm` : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200';
    if (type === 'text') return isActive ? c.text : 'text-gray-700';
    if (type === 'textLight') return isActive ? c.textLight : 'text-gray-400';
    if (type === 'bg') return c.bg;
    if (type === 'border') return c.border;
    if (type === 'badge') return `${c.bgLight} ${c.text}`;
    return '';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center gap-3">
            <FaTasks className="text-blue-600" />
            Konu Bitirme Çizelgesi
          </h1>
          <p className="text-gray-500 mt-2 font-medium max-w-2xl mx-auto">Tüm KPSS müfredatı elinizin altında. Bitirdiğiniz konuları işaretleyin, kalan konularınızı görün ve genel ilerlemenizi takip edin.</p>
        </div>

        {/* Genel İlerleme */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 max-w-3xl mx-auto">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Genel Sınav İlerlemesi</span>
              <h3 className="text-2xl font-black text-gray-800">%{globalProgress}</h3>
            </div>
            <span className="text-sm font-bold text-indigo-500">{completedTopics.length} / {totalTopics} Konu</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${globalProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
          
          {/* Sol Menü (Sekmeler) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-2">
            {syllabusData.map(subject => {
              const subjectCompleted = subject.topics.filter(t => completedTopics.includes(t)).length;
              const percent = Math.round((subjectCompleted / subject.topics.length) * 100);
              const isActive = activeTab === subject.id;
              
              return (
                <button
                  key={subject.id}
                  onClick={() => setActiveTab(subject.id)}
                  className={`p-4 rounded-2xl text-left transition-all border ${getColorClasses(subject.color, isActive, 'button')}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className={`font-bold ${getColorClasses(subject.color, isActive, 'text')}`}>
                      {subject.title}
                    </h4>
                    <span className={`text-xs font-black ${getColorClasses(subject.color, isActive, 'textLight')}`}>
                      %{percent}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className={`${getColorClasses(subject.color, isActive, 'bg')} h-1.5 rounded-full transition-all duration-500`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sağ Panel (Konular) */}
          <div className="w-full lg:w-2/3">
            <div className={`bg-white rounded-3xl p-6 border-t-4 shadow-sm ${getColorClasses(activeSubject.color, false, 'border')}`}>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-2xl font-black text-gray-800">{activeSubject.title} Konuları</h3>
                <span className={`${getColorClasses(activeSubject.color, false, 'badge')} px-3 py-1 rounded-full text-sm font-bold`}>
                  {activeSubjectProgress}% Tamamlandı
                </span>
              </div>

              {loading ? (
                <div className="text-center py-10 text-gray-400">Yükleniyor...</div>
              ) : (
                <div className="space-y-3">
                  {activeSubject.topics.map((topic, index) => {
                    const isChecked = completedTopics.includes(topic);
                    return (
                      <div 
                        key={index} 
                        onClick={() => toggleTopic(topic)}
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors border ${
                          isChecked ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <div className={`text-2xl ${isChecked ? 'text-green-500' : 'text-gray-300'}`}>
                          {isChecked ? <FaCheckCircle /> : <FaRegCircle />}
                        </div>
                        <span className={`font-semibold ${isChecked ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                          {topic}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
