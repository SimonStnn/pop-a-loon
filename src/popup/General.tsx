import React from 'react';
import Main from '@components/Main';
import Leaderboard from '@components/Leaderboard';

export default () => {
  return (
    <>
      <Main>
        <h2 className="text-lg">Leaderboard</h2>
        <Leaderboard />
      </Main>
    </>
  );
};
