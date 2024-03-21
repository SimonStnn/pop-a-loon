import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ClassValue } from 'clsx';
import { cn } from '@utils';

// React component with the option to add classNames
export type NavigationIconProps = {
  to: string;
  icon: IconProp;
  side: 'left' | 'right';
  className?: ClassValue[];
};

export default (props: NavigationIconProps) => {
  return (
    <Link
      to={props.to}
      className={cn(
        'absolute flex items-center justify-center p-3 text-primary-foreground opacity-80 hover:opacity-100',
        props.side === 'left' ? 'left-1' : 'right-1',
        props.className
      )}
    >
      <FontAwesomeIcon icon={props.icon} size="lg" />
    </Link>
  );
};
