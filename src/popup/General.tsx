import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Main from '@/components/Main';
import Leaderboard from '@/components/Leaderboard';

export default () => {
  return (
    <>
      <Main>
        <Tabs defaultValue="all-time">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all-time">All time</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="stats">Your stats</TabsTrigger>
          </TabsList>
          <TabsContent value="all-time">
            <Leaderboard />
          </TabsContent>
          <TabsContent value="daily">
            <Leaderboard />
          </TabsContent>
          <TabsContent value="stats">Your stats here.</TabsContent>
        </Tabs>
      </Main>
    </>
  );
};
