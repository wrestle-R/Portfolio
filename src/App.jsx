import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BackgroundGrid from './components/BackgroundGrid';
import Home from './pages/Home';
import Resume from './pages/Resume';

function App() {
  return (
    <Router>
      <div className="App relative">
        <BackgroundGrid />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume" element={<Resume />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;