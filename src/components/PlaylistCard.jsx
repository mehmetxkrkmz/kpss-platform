import React from 'react';
import { FaPlayCircle } from 'react-icons/fa';

export default function PlaylistCard({ playlist }) {
  return (
    <a href={playlist.youtubeLink} target="_blank" rel="noopener noreferrer" className="group block h-full">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm overflow-hidden border border-white/60 hover:shadow-2xl transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1">
        
        {/* Thumbnail */}
        <div className="relative overflow-hidden aspect-video bg-gray-100">
          <img
            src={playlist.thumbnailUrl}
            alt={playlist.instructorName}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <FaPlayCircle className="text-white/90 text-6xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100 drop-shadow-2xl" />
          </div>
          
          {playlist.isRecommended && (
            <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg backdrop-blur-sm tracking-wide">
              ⭐ ÖNERİLEN
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-6 flex-grow flex flex-col justify-between bg-gradient-to-b from-transparent to-gray-50/50">
          <h4 className="font-bold text-gray-800 text-xl mb-2 line-clamp-2 leading-tight">{playlist.instructorName}</h4>
          <div className="mt-4 flex items-center text-sm text-indigo-600 font-bold group-hover:text-indigo-700 transition-colors">
            <span className="bg-indigo-50 px-4 py-1.5 rounded-full group-hover:bg-indigo-100 transition-colors shadow-sm">
              İzle & Öğren
            </span>
            <span className="ml-2 transform group-hover:translate-x-1.5 transition-transform duration-300 text-lg">&rarr;</span>
          </div>
        </div>
      </div>
    </a>
  );
}
