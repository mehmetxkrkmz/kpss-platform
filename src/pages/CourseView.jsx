import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import PlaylistCard from '../components/PlaylistCard';
import { useAuth } from '../context/AuthContext';
import { FaCheck } from 'react-icons/fa';

export default function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser } = useAuth();
  const [completedTopics, setCompletedTopics] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // 1. Dersi Getir
        const courseRef = doc(db, "courses", id);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
          setCourse({ id: courseSnap.id, ...courseSnap.data() });
        } else {
          setError("Ders bulunamadı.");
          setLoading(false);
          return;
        }

        // 2. Konuları Getir
        const topicsQuery = query(collection(db, "topics"), where("courseId", "==", id));
        const topicsSnap = await getDocs(topicsQuery);
        const fetchedTopics = topicsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        fetchedTopics.sort((a, b) => a.order - b.order);
        setTopics(fetchedTopics);

        // 3. İlgili Oynatma Listelerini Getir
        const playlistsQuery = query(collection(db, "playlists"), where("courseId", "==", id));
        const playlistsSnap = await getDocs(playlistsQuery);
        setPlaylists(playlistsSnap.docs.map(doc => doc.data()));

      } catch (err) {
        setError("Detaylar yüklenirken hata oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      const fetchProgress = async () => {
        const progressRef = doc(db, "userProgress", currentUser.uid);
        const snap = await getDoc(progressRef);
        if (snap.exists()) {
          setCompletedTopics(snap.data().completed || []);
        }
      };
      fetchProgress();
    } else {
      setCompletedTopics([]);
    }
  }, [currentUser]);

  const toggleTopic = async (topicId) => {
    if (!currentUser) {
      alert("İlerlemenizi kaydetmek için lütfen sağ üstten giriş yapın!");
      return;
    }
    const isCompleted = completedTopics.includes(topicId);
    const newCompleted = isCompleted 
      ? completedTopics.filter(id => id !== topicId) 
      : [...completedTopics, topicId];
      
    setCompletedTopics(newCompleted);

    try {
      const progressRef = doc(db, "userProgress", currentUser.uid);
      await setDoc(progressRef, { completed: newCompleted }, { merge: true });
    } catch (e) {
      console.error("İlerleme kaydedilemedi:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md text-center font-medium shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-6 md:mb-8">
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-flex items-center gap-2 transition-colors">
                ← Geri Dön
              </Link>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">{course?.title}</h1>
              <p className="text-gray-600 mt-2 md:mt-3 text-base md:text-lg leading-relaxed">{course?.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Sol Taraf: Kronolojik Konular */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-sm p-4 md:p-6 border border-gray-100 lg:sticky lg:top-24">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center justify-between">
                    <span>Müfredat Süreci</span>
                    {currentUser && <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{topics.filter(t => completedTopics.includes(t.id)).length} / {topics.length}</span>}
                  </h2>
                  {topics.length > 0 ? (
                    <ol className="relative border-l-2 border-indigo-100 ml-2 md:ml-3">
                      {topics.map((topic, index) => {
                         const isDone = completedTopics.includes(topic.id);
                         return (
                         <li key={index} className="mb-6 md:mb-8 ml-6 md:ml-8 group">
                           <button 
                             onClick={() => toggleTopic(topic.id)}
                             className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white font-bold text-sm shadow-md transition-all duration-300 transform group-hover:scale-110 cursor-pointer ${isDone ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}`}
                             title={isDone ? "Tamamlandı olarak işaretini kaldır" : "Tamamlandı olarak işaretle"}
                           >
                             {isDone ? <FaCheck /> : topic.order}
                           </button>
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 md:p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer" onClick={() => toggleTopic(topic.id)}>
                             <h3 className={`font-semibold text-base md:text-lg leading-tight mt-1 transition-all ${isDone ? 'text-gray-400 line-through' : 'text-gray-800 group-hover:text-indigo-600'}`}>{topic.title}</h3>
                             {topic.questionCount && (
                               <span className={`inline-flex items-center justify-center text-xs font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap transition-colors ${isDone ? 'bg-gray-100 text-gray-400' : 'bg-amber-100 text-amber-800'}`}>
                                 {topic.questionCount}
                               </span>
                             )}
                           </div>
                         </li>
                         );
                      })}
                    </ol>
                  ) : (
                    <p className="text-gray-500 italic">Konu listesi eklenmemiş.</p>
                  )}
                </div>
              </div>

              {/* Sağ Taraf: İlgili Playlistler */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Önerilen Eğitimler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {playlists.length > 0 ? (
                    playlists.map((playlist, index) => (
                      <PlaylistCard key={index} playlist={playlist} />
                    ))
                  ) : (
                    <div className="col-span-full bg-white p-8 rounded-2xl text-center border border-gray-100 text-gray-500">
                      Bu ders için oynatma listesi bulunamadı.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
