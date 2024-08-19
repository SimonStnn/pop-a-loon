import React, { useState } from 'react';
import Main from '@/components/Main';
import Graph from '@/components/graph';

export default () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [endDate, setEndDate] = useState(new Date());

  return (
    <Main>
      <Graph {...{ startDate, endDate }} />
    </Main>
  );
};
