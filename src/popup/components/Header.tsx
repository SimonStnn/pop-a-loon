import { ClassValue } from 'clsx';
import { LucideIcon, RotateCcw } from 'lucide-react';
import { ArrowLeft, List, Settings } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import browser, { type Permissions } from 'webextension-polyfill';
import { Button } from './ui/button';
import remote from '@/remote';
import { askOriginPermissions } from '@/utils';

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
  '/general': 'Leaderboard',
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
      <div className="flex items-center justify-center bg-destructive p-1 text-destructive-foreground">
        Remote not available
      </div>
    );

  const [alarms, setAlarms] = useState<browser.Alarms.Alarm[]>([]);
  const [permissions, setPermissions] = useState<Permissions.AnyPermissions>(
    {}
  );
  useEffect(() => {
    const fetchAlarms = async () => {
      const alarms = await browser.alarms.getAll();
      setAlarms(alarms);
    };
    const fetchPermissions = async () => {
      setPermissions(await browser.permissions.getAll());
    };
    fetchAlarms();
    fetchPermissions();
  }, []);

  if (alarms.length === 0)
    return (
      <div className="flex items-center justify-center gap-2 bg-secondary p-1 text-secondary-foreground">
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

  if (permissions.origins && permissions.origins.length === 0)
    return (
      <div className="flex items-center justify-center gap-2 bg-secondary p-1 text-secondary-foreground">
        <span>Pop-a-loon is missing recommended permissions.</span>
        <Button
          variant={'link'}
          className="h-fit p-0 text-xs"
          onClick={async () => {
            await askOriginPermissions();
            setPermissions(await browser.permissions.getAll());
          }}
        >
          Allow
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
      <header className="select-none bg-primary text-primary-foreground h-11">
        <h1 className="absolute w-full flex justify-center items-center text-xl font-bold h-11">
          {title}
        </h1>
        <div className="absolute flex w-full px-1">
          <div className="flex items-center justify-center">
            {location.pathname !== '/' && (
              <HeaderIcon to="/" icon={ArrowLeft} />
            )}
          </div>
          <div className="flex-grow"></div>
          <div className="flex items-center justify-center">
            {navIcons.map((Icon, index) => (
              <HeaderIcon key={index} {...Icon} />
            ))}
          </div>
        </div>
      </header>
      <Banner remoteAvailable={isAvailable} />
    </>
  );
};
