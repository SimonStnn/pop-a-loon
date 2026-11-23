import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import browser from 'webextension-polyfill';
import Main from '@/components/Main';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Message } from '@/const';
import storage from '@/managers/storage';

const App: React.FC = () => {
  const [balloonCount, setBalloonCount] = useState(0);
  const [showRecoveryReminder, setShowRecoveryReminder] = useState(false);

  const fetchBalloonCount = async () => {
    const user = await storage.sync.get('user');
    setBalloonCount(user?.count || 0);
    setShowRecoveryReminder(
      Boolean(user) &&
        !user.hasRecoveryCode &&
        !(await storage.sync.get('recoveryCodeSaved'))
    );
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
  }, []);

  return (
    <>
      <Main>
        {showRecoveryReminder && (
          <Alert>
            <AlertDescription>
              Protect your account:{' '}
              <Link className="underline" to="/settings">
                save a recovery code
              </Link>
              .
            </AlertDescription>
          </Alert>
        )}
        <section className="flex flex-grow flex-col items-center justify-center gap-2">
          <span className="flex items-center justify-center text-4xl font-bold drop-shadow">
            {balloonCount}
          </span>
          <span className="text-base">
            {balloonCount === 1 ? 'Baloon popped' : 'Balloons popped'}
          </span>
        </section>
      </Main>
    </>
  );
};

export default App;
