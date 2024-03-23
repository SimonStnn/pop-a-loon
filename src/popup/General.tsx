import React from 'react';
import { ArrowLeft, List, Settings } from 'lucide-react';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Leaderboard from '@/components/Leaderboard';

export default () => {
  return (
    <>
      <Header title="General" />
      <Main>
        <h2 className="text-lg">Leaderboard</h2>
        <Leaderboard />
      </Main>
    </>
  );
};
