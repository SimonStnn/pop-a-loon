import React, { useState, useEffect } from 'react';
import { faList } from '@fortawesome/free-solid-svg-icons';
import storage from '@/storage';
import { Message } from '@const';
import NavigationIcon from '@components/NavigationIcon';
import Header from '@/components/Header';

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
      <Header
        title="Pop-a-loon"
        icons={[{ to: '/general', side: 'right', icon: faList }]}
      />
      <main className="m-auto my-2 flex w-4/5 flex-col gap-2">
        <p>Balloons Popped: {balloonCount}</p>
      </main>
    </>
  );
};

export default App;
