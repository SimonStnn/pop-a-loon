import React, { useState, useEffect } from 'react';
import { List, Settings } from 'lucide-react';
import storage from '@/storage';
import { Message } from '@const';
import Header from '@/components/Header';
import Main from '@/components/Main';

const App: React.FC = () => {
  const [balloonCount, setBalloonCount] = useState(0);

  const fetchBalloonCount = async () => {
    const count = (await storage.get('user')).count;
    setBalloonCount(count || 0);
  };

  chrome.runtime.onMessage.addListener(
    (message: Message, sender, sendResponse) => {
      if (message.action === 'updateCounter') {
        setBalloonCount(message.balloonCount);
      }
    }
  );

  useEffect(() => {
    fetchBalloonCount();
  });

  return (
    <>
      <Header title="Pop-a-loon" />
      <Main>
        <p>Balloons Popped: {balloonCount}</p>
      </Main>
    </>
  );
};

export default App;
