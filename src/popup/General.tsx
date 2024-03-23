import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Leaderboard from '@/components/Leaderboard';

export default () => {
  return (
    <>
      <Header
        title="General"
        icons={[
          { to: '/', side: 'left', icon: ArrowLeft },
          { to: '/settings', side: 'right', icon: Settings },
        ]}
      />
      <Main>
        <h2 className="text-lg">Leaderboard</h2>
        <Leaderboard />
      </Main>
    </>
  );
};
