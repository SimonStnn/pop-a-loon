import React from 'react';
import { ClassValue } from 'clsx';
import NavigationIcon, { NavigationIconProps } from './NavigationIcon';

type HeaderProps = {
  title: string;
  icons?: NavigationIconProps[];
  className?: ClassValue[];
};

export default (props: HeaderProps) => {
  return (
    <header className="flex items-center justify-center bg-primary p-2 text-primary-foreground">
      {props.icons?.map((iconProps, index) => (
        <NavigationIcon key={index} {...iconProps} />
      ))}
      <h1 className="text-xl font-bold">Pop-a-loon</h1>
    </header>
  );
};
