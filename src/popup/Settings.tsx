import React from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="username">Username</Label>
          <Input type="email" id="username" placeholder="Username" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Reset Balloons</Label>
          <Button
            variant={'destructive'}
            onClick={() => {
              chrome.runtime.sendMessage({ action: 'resetCounter' });
            }}
          >
            Reset
          </Button>
        </div>
      </Main>
    </>
  );
};
