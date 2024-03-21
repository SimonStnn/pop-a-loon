import React from 'react';
import { faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Leaderboard from '@/components/Leaderboard';

export default () => {
  return (
    <>
      <Header
        title="General"
        icons={[
          { to: '/', side: 'left', icon: faArrowLeft },
          { to: '/settings', side: 'right', icon: faGear },
        ]}
      />
      <Main>
        <h2 className="text-lg">Leaderboard</h2>
        <Leaderboard />
      </Main>
    </>
  );
};
