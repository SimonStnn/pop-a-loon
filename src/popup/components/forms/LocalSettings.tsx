import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import storage from '@/storage';

const formSchema = z.object({
  popVolume: z.number().int().min(0).max(100),
});

export default () => {
  const [popVolume, setPopVolume] = useState(0);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      popVolume: popVolume,
    },
  });

  useEffect(() => {
    const loadVolume = async () => {
      // Load volume from storage
      setPopVolume((await storage.get('config')).popVolume);
    };

    loadVolume();
  }, []);

  return (
    <Form {...form}>
      <form className="grid gap-4">
        <FormField
          control={form.control}
          name="popVolume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pop Volume</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The volume of the pop sound when a balloon is popped.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
