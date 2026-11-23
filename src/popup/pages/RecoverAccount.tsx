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
  const [removedPops, setRemovedPops] = useState<number | null>(null);
  const [showFreshOption, setShowFreshOption] = useState(false);

  const startFresh = async () => {
    await storage.sync.clear();
    await storage.local.remove('pendingRecoveryCode');
    browser.runtime.reload();
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const recovered = await remote.recoverAccount(code);

      // A fresh install creates a temporary account before the user can enter
      // a code. Its token is about to be replaced and it has no recovery code,
      // so it cannot be reached again — remove it even if it has pops.
      const temporaryToken = await storage.sync.get('token');
      const temporaryUser = await storage.sync.get('user');
      const isDifferentAccount =
        Boolean(temporaryToken) && temporaryUser?.id !== recovered.id;
      if (isDifferentAccount) {
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
        setRemovedPops(temporaryUser!.count);
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

  if (removedPops !== null) {
    return (
      <Main>
        <div className="grid gap-2" role="status">
          <h2 className="font-medium">Account recovered</h2>
          <p className="text-sm text-muted-foreground">
            Your account is restored. The temporary account had {removedPops}{' '}
            pops, but it had no recovery code, so it was removed.
          </p>
          <Button type="button" onClick={() => browser.runtime.reload()}>
            Continue
          </Button>
        </div>
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
      {showFreshOption ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Start over?</AlertTitle>
          <AlertDescription className="grid gap-2">
            <span>
              Without the recovery code the old account cannot be restored.
              Starting a new account leaves it behind permanently.
            </span>
            <Button type="button" variant="outline" onClick={startFresh}>
              Start a new account
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Button
          type="button"
          variant="link"
          className="h-fit p-0"
          onClick={() => setShowFreshOption(true)}
        >
          I don't have my recovery code
        </Button>
      )}
    </Main>
  );
};
