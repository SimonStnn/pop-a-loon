import React from 'react';
import { CircleHelp } from 'lucide-react';
import { ClassValue } from 'clsx';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { cn } from '@/utils';

type InfoIconProps = {
  className?: ClassValue;
  children?: React.ReactNode;
};

export default (props: InfoIconProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <CircleHelp
          size={14}
          className={cn('text-muted-foreground', props.className)}
        />
      </HoverCardTrigger>
      <HoverCardContent>{props.children}</HoverCardContent>
    </HoverCard>
  );
};
