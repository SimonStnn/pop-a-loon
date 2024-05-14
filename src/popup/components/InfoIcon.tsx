import React, { useState } from 'react';
import { CircleHelp } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@components/ui/hover-card';

type InfoIconProps = {
  children?: React.ReactNode;
};

export default ({ children }: InfoIconProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <CircleHelp size={14} className="text-muted-foreground" />
      </HoverCardTrigger>
      <HoverCardContent asChild>{children}</HoverCardContent>
    </HoverCard>
  );
};
