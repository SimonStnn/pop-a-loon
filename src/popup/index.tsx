import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import General from './General';
import Settings from './Settings';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

// Import stylesheet
import './style.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <div className="w-[256px]">
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/general" element={<General />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  </div>
);
