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
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = await storage.get('user');
      if (usernameRef.current) {
        usernameRef.current.value = user.username;
      }
      if (emailRef.current) {
        emailRef.current.value = user.email || '';
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
          <Label htmlFor="email">Email</Label>
          <Input ref={emailRef} type="email" id="email" placeholder="Email" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Button
            variant="default"
            onClick={async () => {
              const username = usernameRef.current?.value;
              const email = emailRef.current?.value;
              if (username || email) {
                const user = await remote.putUser({ username, email });
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
