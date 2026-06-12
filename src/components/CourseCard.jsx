import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="block h-full group">
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/60 flex flex-col items-center text-center h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:bg-white overflow-hidden">
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-500 rounded-2xl shadow-sm flex items-center justify-center text-4xl mb-6 p-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          <img 
            src={course.iconUrl} 
            alt={course.title} 
            className="w-full h-full object-contain filter drop-shadow-sm" 
            onError={(e) => { e.target.style.display='none'; e.target.parentElement.innerHTML = '📚'; }} 
          />
        </div>
        
        <h3 className="text-2xl font-black text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">{course.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium">{course.description}</p>
        
        <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-5 py-2.5 rounded-full shadow-sm hover:bg-blue-100 transition-colors">
            Dersi İncele &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
