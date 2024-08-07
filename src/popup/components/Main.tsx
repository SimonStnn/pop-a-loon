import { ClassValue } from 'clsx';
import React, { ReactNode } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/utils';

interface MainProps {
  className?: ClassValue;
  children?: ReactNode;
}

export default (props: MainProps) => {
  return (
    <ScrollArea>
      <main
        className={cn(
          'm-auto my-2 flex min-h-[120px] w-4/5 flex-col gap-2',
          props.className
        )}
      >
        {props.children}
      </main>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};
