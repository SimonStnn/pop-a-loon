import React, { useEffect, useState } from 'react';
import { Separator } from '@components/ui/separator';
import { Button } from './ui/button';
import remote from '@/remote';
import { getBrowser } from '@/utils';

const chromewebstoreUrl =
  'https://chromewebstore.google.com/detail/pop-a-loon/pahcoancbdjmffpmfbnjablnabomdocp/reviews';
const firefoxAddonUrl =
  'https://addons.mozilla.org/.../firefox/addon/pop-a-loon/';

export default () => {
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    remote.isAvailable().then(setIsAvailable);
  }, []);

  return (
    <footer className="flex justify-center items-center gap-2">
      <Button
        variant="link"
        className="h-6 p-0 text-muted-foreground text-xs font-thin"
      >
        <a
          target="_blank"
          rel="noreferrer noopener"
          href="https://github.com/SimonStnn/pop-a-loon"
        >
          Github
        </a>
      </Button>
      {isAvailable && (
        <>
          <Separator orientation="vertical" className="max-h-3" />
          <Button
            variant="link"
            className="h-6 p-0 text-muted-foreground text-xs font-thin"
          >
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={
                getBrowser() === 'Firefox' ? firefoxAddonUrl : chromewebstoreUrl
              }
            >
              Leave a review
            </a>
          </Button>
        </>
      )}
    </footer>
  );
};
