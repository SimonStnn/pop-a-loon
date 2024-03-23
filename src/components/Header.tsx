import React from 'react';
import { ClassValue } from 'clsx';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils';

type iconProps = {
  to: string;
  side: 'left' | 'right';
  icon: LucideIcon;
};

type HeaderProps = {
  title: string;
  icons?: iconProps[];
  className?: ClassValue[];
};

export default (props: HeaderProps) => {
  console.log(props);

  return (
    <header className="flex items-center justify-center bg-primary p-2 text-primary-foreground">
      {props.icons?.map((Icon, index) => (
        <Link
          to={Icon.to}
          className={cn(
            'absolute flex items-center justify-center p-3 text-primary-foreground opacity-80 hover:opacity-100',
            Icon.side === 'left' ? 'left-1' : 'right-1',
            props.className
          )}
        >
          <Icon.icon key={index} size={20} />
        </Link>
      ))}
      <h1 className="text-xl font-bold">Pop-a-loon</h1>
    </header>
  );
};
