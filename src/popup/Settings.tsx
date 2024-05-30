import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { Separator } from '@components/ui/separator';
import Main from '@components/Main';
import LocalSettings from '@components/forms/LocalSettings';
import UpdateUser from '@components/forms/UpdateUser';
import DeleteUser from '@components/forms/DeleteUser';
import Developer from './components/forms/Developer';

export default () => {
  return (
    <>
      <Main className="">
        <div className="h-[286px] grid gap-4 mt-2">
          <section>
            <LocalSettings />
          </section>
          <Separator />
          <section>
            <UpdateUser />
          </section>
          <Separator />
          <section>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:text-destructive py-1 px-2 h-7 w-full"
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
          <Separator />
          <section>
            <Developer />
          </section>
        </div>
      </Main>
    </>
  );
};
