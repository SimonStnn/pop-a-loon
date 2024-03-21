import React from 'react';
import { faArrowLeft, faGear } from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/Header';

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
      <main className="m-auto my-2 flex w-4/5 flex-col gap-2"></main>
    </>
  );
};
