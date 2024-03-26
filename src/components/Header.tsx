import React from 'react';
import { useLocation } from 'react-router-dom';
import { ClassValue } from 'clsx';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowLeft, List, Settings } from 'lucide-react';

type iconProps = {
  to: string;
  icon: LucideIcon;
};

type HeaderProps = {
  title?: string;
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
  const location = useLocation();
  const navIcons = [
    { to: '/general', icon: List },
    { to: '/settings', icon: Settings },
  ];
  return (
    <header className="flex items-center justify-center bg-primary p-2 text-primary-foreground">
      <div className="absolute left-1 flex items-center justify-center">
        {location.pathname !== '/' && <HeaderIcon to="/" icon={ArrowLeft} />}
      </div>
      <h1 className="text-xl font-bold">{props.title || 'Pop-a-loon'}</h1>
      <div className="absolute right-1 flex items-center justify-center">
        {navIcons.map((Icon, index) => (
          <HeaderIcon key={index} {...Icon} />
        ))}
      </div>
    </header>
  );
};
