import React, { useEffect, useState } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Main from '@/components/Main';
import { User } from '@/const';
import storage from '@/storage';

export default () => {
  const [user, setUser] = useState({} as User);

  useEffect(() => {
    const fetchData = async () => {
      setUser(await storage.get('user'));
    };

    fetchData();
  }, []);

  return (
    <>
      <Header
        title="Settings"
        icons={[{ to: '/general', side: 'left', icon: faArrowLeft }]}
      />
      <Main className="grid gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            placeholder="Username"
            value={user.username}
          />
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
