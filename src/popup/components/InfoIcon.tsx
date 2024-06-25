import React from 'react';
import { CircleHelp } from 'lucide-react';
import { ClassValue } from 'clsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils';

type InfoIconProps = {
  className?: ClassValue;
  children?: React.ReactNode;
};

export default (props: InfoIconProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <CircleHelp
          size={14}
          className={cn('text-muted-foreground', props.className)}
        />
      </PopoverTrigger>
      <PopoverContent>{props.children}</PopoverContent>
    </Popover>
  );
};
