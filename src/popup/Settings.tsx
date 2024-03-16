import React from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import NavigationIcon from '@components/NavigationIcon';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

export default () => {
  return (
    <>
      <header className="flex items-center justify-center bg-primary p-2 text-primary-foreground">
        <NavigationIcon to={'/'} icon={faArrowLeft} side={'left'} />
        <h1 className="text-xl font-bold">Settings</h1>
      </header>
      <main className="m-auto my-2 flex w-4/5 flex-col gap-2">
        <div className="flex flex-col justify-between">
          <label className="mb-1">Pop Volume</label>
          <Slider defaultValue={[70]} max={100} step={10} />
        </div>
        <Separator className="my-1" />
        <div className="flex flex-row justify-between">
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
