import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, CheckIcon, ArrowLeft, List, Settings } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Header from '@/components/Header';
import Main from '@/components/Main';
import storage from '@/storage';
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await storage.get('user');
      form.setValue('username', storedUser.username);
      form.setValue('email', storedUser.email || '');
    };

    loadUser();
  }, []);

  const onSubmit = async ({ username, email }: z.infer<typeof formSchema>) => {
    const user = await remote.putUser({ username, email });
    await storage.set('user', user);
  };

  return (
    <>
      <Header title="Settings" />
      <Main>
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
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
      </Main>
    </>
  );
};
