import React, { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';
import { Loader2, CheckIcon } from 'lucide-react';
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import storage from '@/storage';
import { User } from '@/const';
import remote from '@/remote';

const formSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
    })
    .min(4)
    .max(20)
    .refine((value) => /^[a-zA-Z0-9_]+$/.test(value), {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
  email: z.string().refine((value) => value === '' || z.string().email()),
});

export default () => {
  const [user, setUser] = useState<User | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await storage.sync.get('user');
      setUser(storedUser);
      form.setValue('username', storedUser.username);
      form.setValue('email', storedUser.email || '');
    };

    loadUser();
  }, []);

  const onSubmit = async ({ username, email }: z.infer<typeof formSchema>) => {
    if (username === user?.username && email === user?.email) return;
    const newUser = await remote.putUser({ username, email });
    setUser(newUser);
    await storage.sync.set('user', newUser);
  };

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="flex flex-row gap-1">
          Save
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {form.formState.isSubmitSuccessful && (
            <CheckIcon className="mr-2 h-4 w-4" />
          )}
        </Button>
      </form>
    </Form>
  );
};
