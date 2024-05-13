import React, { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import storage from '@/storage';
import { User } from '@/const';
import remote from '@/remote';

export default () => {
  const [user, setUser] = useState<User | null>(null);

  const deleteFormSchema = z.object({
    username: z.string().refine((value) => value === user?.username),
  });

  const deleteForm = useForm<z.infer<typeof deleteFormSchema>>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: {
      username: '',
    },
  });

  const deleteFormOnSubmit = async () => {
    const token = await storage.get('token');
    await remote.deleteUser(token);
    browser.runtime.reload();
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await storage.get('user');
      setUser(storedUser);
    };

    loadUser();
  }, []);

  return (
    <Form {...deleteForm}>
      <form
        className="grid gap-4"
        onSubmit={deleteForm.handleSubmit(deleteFormOnSubmit)}
      >
        <FormField
          control={deleteForm.control}
          name="username"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>
                  Enter your username <b>{user?.username}</b> to continue:
                </FormLabel>
                <FormControl>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input id="usernameDelete" {...field} />
                    <Button type="submit">Delete my account</Button>
                  </div>
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
      </form>
    </Form>
  );
};
