import React from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/Header';
import Main from '@/components/Main';

export default () => {
  return (
    <>
      <Header
        title="Settings"
        icons={[{ to: '/general', side: 'left', icon: faArrowLeft }]}
      />
      <Main>
        <div className="flex justify-between items-center">
          <label>Reset Balloons</label>
          <button
            className="rounded-md bg-destructive px-2 py-1 text-destructive-foreground"
            onClick={() => {
              chrome.runtime.sendMessage({ action: 'resetCounter' });
            }}
          >
            Reset
          </button>
        </div>
      </Main>
    </>
  );
};
