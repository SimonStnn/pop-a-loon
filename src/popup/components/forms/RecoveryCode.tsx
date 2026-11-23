import { AlertCircle, CheckIcon, Copy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User } from '@/const';
import storage from '@/managers/storage';
import remote from '@/remote';

export default () => {
  const [user, setUser] = useState<User | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    storage.sync.get('user').then(setUser);
  }, []);

  const generate = async () => {
    setBusy(true);
    try {
      const { code: newCode } = await remote.createRecoveryCode();
      setCode(newCode);
      setCopied(false);
      setUser(await remote.getSelf());
    } finally {
      setBusy(false);
    }
  };

  const confirmSaved = async () => {
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
            It is shown only once. Store it somewhere safe: it is the only way
            to get your account back if you lose your browser data.
          </span>
          <code className="break-all rounded bg-muted p-2 font-mono text-sm">
            {code}
          </code>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
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
            <Button type="button" className="flex-1" onClick={confirmSaved}>
              I saved it
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-3">
      <Label>Account recovery code</Label>
      <p className="text-sm text-muted-foreground">
        {user?.hasRecoveryCode
          ? 'A recovery code is set. Generating a new one invalidates the old code.'
          : 'No recovery code is set. Without one, clearing your browser data permanently loses your account.'}
      </p>
      <Button
        type="button"
        variant="outline"
        disabled={busy}
        onClick={generate}
      >
        {user?.hasRecoveryCode
          ? 'Replace recovery code'
          : 'Create recovery code'}
      </Button>
      <Button type="button" variant="link" className="h-fit p-0" asChild>
        <Link to="/recover">I already have an account</Link>
      </Button>
    </div>
  );
};
