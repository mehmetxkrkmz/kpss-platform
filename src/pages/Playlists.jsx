import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import PlaylistCard from '../components/PlaylistCard';

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllPlaylists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "playlists"));
        setPlaylists(querySnapshot.docs.map(doc => doc.data()));
      } catch (err) {
        console.error("Playlistler çekilirken hata:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPlaylists();
  }, []);

  const filteredPlaylists = playlists.filter(pl =>
    pl.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={setSearchTerm} />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Keşfet: Tüm Oynatma Listeleri</h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPlaylists.length > 0 ? (
              filteredPlaylists.map((playlist, index) => (
                <PlaylistCard key={index} playlist={playlist} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">Sonuç bulunamadı.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
