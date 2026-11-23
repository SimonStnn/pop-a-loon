import { AlertCircle } from 'lucide-react';
import React from 'react';
import Main from '@/components/Main';
import DeleteUser from '@/components/forms/DeleteUser';
import Developer from '@/components/forms/Developer';
import LocalSettings from '@/components/forms/LocalSettings';
import RecoveryCode from '@/components/forms/RecoveryCode';
import UpdateUser from '@/components/forms/UpdateUser';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export default () => {
  return (
    <>
      <Main className="">
        <div className="mt-2 grid h-[286px] gap-4">
          <section>
            <LocalSettings />
          </section>
          <Separator className="h-px shrink-0" />
          <section>
            <UpdateUser />
          </section>
          <Separator className="h-px shrink-0" />
          <section>
            <RecoveryCode />
          </section>
          <Separator className="h-px shrink-0" />
          <section>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-7 w-full border-destructive px-2 py-1 text-destructive hover:text-destructive"
                >
                  Delete account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete account</DialogTitle>
                  <DialogDescription asChild>
                    <Alert variant="destructive" className="text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="w-min">Danger</AlertTitle>
                      <AlertDescription>
                        This action is not reversible. Please be certain.
                      </AlertDescription>
                    </Alert>
                  </DialogDescription>
                </DialogHeader>
                <DeleteUser />
              </DialogContent>
            </Dialog>
          </section>
          <Separator className="h-px shrink-0" />
          <section>
            <Developer />
          </section>
        </div>
      </Main>
    </>
  );
};
