import React, { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';
import Main from '@/components/Main';
import { Message } from '@/const';
import storage from '@/managers/storage';

const App: React.FC = () => {
  const [balloonCount, setBalloonCount] = useState(0);

  const fetchBalloonCount = async () => {
    const count = (await storage.sync.get('user'))?.count;
    setBalloonCount(count || 0);
  };

  browser.runtime.onMessage.addListener(
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
      <Main>
        <section className="flex flex-col gap-2 items-center">
          <span className="flex justify-center items-center text-4xl font-bold drop-shadow">
            {balloonCount}
          </span>
          <span className="text-[16px]">
            {balloonCount === 1 ? 'Baloon popped' : 'Balloons popped'}
          </span>
        </section>
      </Main>
    </>
  );
};

export default App;
