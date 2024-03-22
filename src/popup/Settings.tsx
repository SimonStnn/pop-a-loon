import React, { useEffect, useRef } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Main from '@/components/Main';
import { User } from '@/const';
import storage from '@/storage';
import remote from '@/remote';

export default () => {
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (usernameRef.current) {
        usernameRef.current.value = (await storage.get('user')).username;
      }
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
            ref={usernameRef}
            type="text"
            id="username"
            placeholder="Username"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Button
            variant="default"
            onClick={async () => {
              const username = usernameRef.current?.value;
              if (username) {
                const user = await remote.putUser({ username });
                await storage.set('user', user);
              }
            }}
          >
            Save
          </Button>
        </div>
      </Main>
    </>
  );
};
