import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/luxury.css';
import './styles/cinematic.css';

import { Navbar }             from './components/Navbar';
import { Footer }             from './components/Footer';
import { BackToTop }          from './components/BackToTop';
import { ScrollProgressBar }  from './components/ScrollProgressBar';
import { HomePage }           from './pages/HomePage';
import { HotelDetailPage }    from './pages/HotelDetailPage';
import { NotFoundPage }       from './pages/NotFoundPage';
import { useSmoothScroll }    from './components/useSmoothScroll';

const AppContent: React.FC = () => {
  useSmoothScroll();

  return (
    <div className="app-layout">
      {/* Vertical story-progress indicator */}
      <ScrollProgressBar />
      <Navbar />
      <Routes>
        <Route path="/"                    element={<HomePage />} />
        <Route path="/hotels/:slug"        element={<HotelDetailPage />} />
        <Route path="*"                    element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <BackToTop />
    </div>
  );
};


export const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
