import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import browser from 'webextension-polyfill';
import Main from '@/components/Main';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import log from '@/managers/log';
import storage from '@/managers/storage';
import remote from '@/remote';

export default () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [preservedPops, setPreservedPops] = useState<number | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const recovered = await remote.recoverAccount(code);

      // A fresh install creates a temporary account before the user can enter
      // a code. Remove it when it is empty; never discard progress silently.
      const temporaryToken = await storage.sync.get('token');
      const temporaryUser = await storage.sync.get('user');
      const isDifferentAccount =
        Boolean(temporaryToken) && temporaryUser?.id !== recovered.id;
      if (isDifferentAccount && temporaryUser?.count === 0) {
        try {
          await remote.deleteUser(temporaryToken);
        } catch (e) {
          log.warn('Could not remove the temporary account', e);
        }
      }

      await storage.sync.set('token', recovered.token);
      await storage.sync.set('user', recovered);
      await storage.sync.set('accountInitialized', true);
      await storage.sync.set('needsRecovery', false);
      await storage.sync.set('recoveryCodeSaved', true);

      if (isDifferentAccount && (temporaryUser?.count ?? 0) > 0) {
        setPreservedPops(temporaryUser!.count);
        return;
      }
      browser.runtime.reload();
    } catch (e) {
      setError(
        'Could not recover the account. Check the code and your connection.'
      );
    } finally {
      setBusy(false);
    }
  };

  if (preservedPops !== null) {
    return (
      <Main>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Account recovered</AlertTitle>
          <AlertDescription className="grid gap-2">
            <span>
              Your account is restored. The temporary account had{' '}
              {preservedPops} pops, so it was kept instead of being deleted.
            </span>
            <Button type="button" onClick={() => browser.runtime.reload()}>
              Continue
            </Button>
          </AlertDescription>
        </Alert>
      </Main>
    );
  }

  return (
    <Main>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <Label htmlFor="recovery-code">Recovery code</Label>
        <AlertDescription className="text-sm text-muted-foreground">
          Enter the code you saved to restore your original account.
        </AlertDescription>
        <Input
          id="recovery-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
          autoComplete="off"
        />
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={busy || code.trim() === ''}>
          Recover account
        </Button>
      </form>
    </Main>
  );
};
