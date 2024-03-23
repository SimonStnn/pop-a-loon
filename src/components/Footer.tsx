import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from './ui/button';

export default () => {
  return (
    <footer className="flex justify-center items-center gap-2">
      <Button
        variant="link"
        className="h-7 p-0 text-muted-foreground text-xs font-thin"
      >
        <a target="_blank" href="https://github.com/SimonStnn/pop-a-loon">
          Github
        </a>
      </Button>
      <Separator orientation="vertical" className="max-h-3" />
      <Button
        variant="link"
        className="h-5 p-0 text-muted-foreground text-xs font-thin"
      >
        <a
          target="_blank"
          href="https://chromewebstore.google.com/detail/pop-a-loon/pahcoancbdjmffpmfbnjablnabomdocp"
        >
          Chrome Webstore
        </a>
      </Button>
    </footer>
  );
};
