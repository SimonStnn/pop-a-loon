import { AlertCircle, CheckIcon, Copy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { User } from '@/const';
import storage from '@/managers/storage';
import remote from '@/remote';

export default () => {
  const [user, setUser] = useState<User | null>(null);
  const [hasCode, setHasCode] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [storedUser, pendingCode, saved] = await Promise.all([
        storage.sync.get('user'),
        storage.local.get('pendingRecoveryCode'),
        storage.sync.get('recoveryCodeSaved'),
      ]);
      setUser(storedUser);
      // Popups close when they lose focus. Keep the code visible until the
      // user confirms they saved it.
      setCode(pendingCode ?? null);
      setHasCode(
        Boolean(pendingCode) ||
          Boolean(saved) ||
          Boolean(storedUser?.hasRecoveryCode)
      );
    })();
  }, []);

  const generate = async () => {
    setConfirmOpen(false);
    setBusy(true);
    try {
      const { code: newCode } = await remote.createRecoveryCode();
      setCode(newCode);
      setCopied(false);
      setHasCode(true);
      await storage.local.set('pendingRecoveryCode', newCode);
      setUser(await remote.getSelf());
    } finally {
      setBusy(false);
    }
  };

  const confirmSaved = async () => {
    await storage.local.remove('pendingRecoveryCode');
    await storage.sync.set('recoveryCodeSaved', true);
    setCode(null);
  };

  if (code) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Save this recovery code</AlertTitle>
        <AlertDescription className="grid gap-2">
          <span>
            Store it somewhere safe: it is the only way to get your account back
            if you lose your browser data. It stays here until you confirm you
            saved it.
          </span>
          <code className="break-all rounded bg-muted p-2 font-mono text-sm">
            {code}
          </code>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-7 flex-1 px-2 py-1"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(code);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              type="button"
              className="h-7 flex-1 px-2 py-1"
              onClick={confirmSaved}
            >
              I saved it
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4">
      <Label>Account recovery code</Label>
      <p className="text-sm text-muted-foreground">
        {hasCode
          ? 'A recovery code is set. Regenerating it invalidates the old code.'
          : 'Without a recovery code, clearing your browser data permanently loses your account.'}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-7 flex-1 px-2 py-1"
          disabled={busy}
          onClick={() => (hasCode ? setConfirmOpen(true) : generate())}
        >
          {hasCode ? 'Regenerate recovery code' : 'Create recovery code'}
        </Button>
        <Button type="button" variant="link" className="h-7 flex-1 p-0" asChild>
          <Link to="/recover">I already have an account</Link>
        </Button>
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate recovery code?</DialogTitle>
            <DialogDescription asChild>
              <Alert variant="destructive" className="text-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="w-min">Warning</AlertTitle>
                <AlertDescription>
                  Your old recovery code will stop working immediately. Save the
                  new code when it appears.
                </AlertDescription>
              </Alert>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-7 px-2 py-1"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-7 px-2 py-1"
              disabled={busy}
              onClick={generate}
            >
              Regenerate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
