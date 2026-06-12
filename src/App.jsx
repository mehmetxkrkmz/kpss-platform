import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CourseView from './pages/CourseView';
import Playlists from './pages/Playlists';
import Flashcards from './pages/Flashcards';
import ExamTracker from './pages/ExamTracker';
import SyllabusTracker from './pages/SyllabusTracker';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';
import PomodoroWidget from './components/PomodoroWidget';

export default function App() {
  return (
    <AuthProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <div className="flex flex-col min-h-screen bg-gray-50 relative">
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/course/:id" element={<CourseView />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/bilgi-kartlari" element={<Flashcards />} />
              <Route path="/denemeler" element={<ExamTracker />} />
              <Route path="/konular" element={<SyllabusTracker />} />
            </Routes>
          </div>
          <Footer />
          <PomodoroWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}
