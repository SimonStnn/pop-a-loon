import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// Import stylesheet
import './style.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import log from '@/managers/log';
import storage from '@/managers/storage';
import App from '@/popup/pages/App';
import DeveloperInfo from '@/popup/pages/DeveloperInfo';
import Discovery from '@/popup/pages/Discovery';
import General from '@/popup/pages/General';
import RecoverAccount from '@/popup/pages/RecoverAccount';
import Settings from '@/popup/pages/Settings';
import Statistics from '@/popup/pages/Statistics';

(async () => {
  log.setLevel((await storage.local.get('loglevel')) ?? log.getLevel());
  const needsRecovery = await storage.sync.get('needsRecovery');

  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <div className="max-h-[600px] w-[398px] overflow-hidden">
      <Router initialEntries={[needsRecovery ? '/recover' : '/']}>
        <Header />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/general" element={<General />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/developer" element={<DeveloperInfo />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/recover" element={<RecoverAccount />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
})();
