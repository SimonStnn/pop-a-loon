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

const HeaderIcon = (props: iconProps) => {
  return (
    <Link
      to={props.to}
      className="p-3 text-primary-foreground opacity-80 hover:opacity-100"
    >
      <props.icon size={20} />
    </Link>
  );
};

export default (props: HeaderProps) => {
  const leftIcons = props.icons?.filter((icon) => icon.side === 'left') || [];
  const rightIcons = props.icons?.filter((icon) => icon.side === 'right') || [];

  return (
    <header className="flex items-center justify-center bg-primary p-2 text-primary-foreground">
      <div className="absolute left-1 flex items-center justify-center">
        {leftIcons.map((Icon, index) => (
          <HeaderIcon key={index} {...Icon} />
        ))}
      </div>
      <h1 className="text-xl font-bold">Pop-a-loon</h1>
      <div className="absolute right-1 flex items-center justify-center">
        {rightIcons.map((Icon, index) => (
          <HeaderIcon key={index} {...Icon} />
        ))}
      </div>
    </header>
  );
};
