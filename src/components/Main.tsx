import React, { ReactNode } from 'react';
import { cn } from '@/utils';
import { ClassValue } from 'clsx';

interface MainProps {
  className?: ClassValue;
  children?: ReactNode;
}

export default (props: MainProps) => {
  return (
    <main
      className={cn('m-auto my-2 flex w-4/5 flex-col gap-2', props.className)}
    >
      {props.children}
    </main>
  );
};
