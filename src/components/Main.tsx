import React from 'react';

export default (props: any) => {
  return (
    <main className="m-auto my-2 flex w-4/5 flex-col gap-2">
      {props.children}
    </main>
  );
};
