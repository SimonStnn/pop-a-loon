import React from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import NavigationIcon from '@components/NavigationIcon';

export default () => {
  return (
    <>
      <header className="flex items-center justify-center bg-primary p-2 text-primary-foreground">
        <NavigationIcon to={'/'} icon={faArrowLeft} side={'left'} />
        <h1 className="text-xl font-bold">Settings</h1>
      </header>
      <main className="m-auto my-2 flex w-4/5 flex-col gap-2">
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
      </main>
    </>
  );
};
