import React, { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';
import { useLocation } from 'react-router-dom';
import { ClassValue } from 'clsx';
import { LucideIcon, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowLeft, List, Settings } from 'lucide-react';
import remote from '@/remote';
import { Button } from './ui/button';

type iconProps = {
  to: string;
  icon: LucideIcon;
};

type HeaderProps = {
  title?: string;
  icons?: iconProps[];
  className?: ClassValue[];
};

type BannerProps = {
  remoteAvailable: boolean;
};

const routeTitles: { [key: string]: string } = {
  '/settings': 'Settings',
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

const Banner = (props: BannerProps) => {
  if (!props.remoteAvailable)
    return (
      <div className="flex justify-center items-center bg-destructive text-destructive-foreground p-1">
        Remote not available
      </div>
    );

  const [alarms, setAlarms] = useState<browser.Alarms.Alarm[]>([]);

  useEffect(() => {
    const fetchAlarms = async () => {
      const alarms = await browser.alarms.getAll();
      setAlarms(alarms);
    };
    fetchAlarms();
  }, []);

  if (alarms.length === 0)
    return (
      <div className="flex justify-center items-center bg-secondary text-secondary-foreground p-1 gap-2">
        <span>Something went wrong, please restart the extension.</span>
        <Button
          className="size-3"
          variant={'ghost'}
          size={'icon'}
          onClick={() => browser.runtime.reload()}
        >
          <RotateCcw className="hover:animate-spin" />
        </Button>
      </div>
    );

  return null;
};

export default (props: HeaderProps) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const location = useLocation();
  const navIcons =
    (isAvailable && [
      { to: '/general', icon: List },
      { to: '/settings', icon: Settings },
    ]) ||
    [];

  const title = Object.keys(routeTitles).includes(location.pathname)
    ? routeTitles[location.pathname]
    : props.title || 'Pop-a-loon';

  useEffect(() => {
    remote.isAvailable().then(setIsAvailable);
  }, []);

  return (
    <>
      <header className="flex items-center justify-center bg-primary p-2 text-primary-foreground">
        <div className="absolute left-1 flex items-center justify-center">
          {location.pathname !== '/' && <HeaderIcon to="/" icon={ArrowLeft} />}
        </div>
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="absolute right-1 flex items-center justify-center">
          {navIcons.map((Icon, index) => (
            <HeaderIcon key={index} {...Icon} />
          ))}
        </div>
      </header>
      <Banner remoteAvailable={isAvailable} />
    </>
  );
};
