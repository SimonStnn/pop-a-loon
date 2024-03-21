import React from 'react';
import { faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/Header';
import Main from '@/components/Main';

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
      <Main></Main>
    </>
  );
};
