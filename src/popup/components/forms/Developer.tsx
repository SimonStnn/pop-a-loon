import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useDebugMode } from '@/popup/hooks/useDebugMode';

const formSchema = z.object({
  loglevel: z.boolean(),
});

export default () => {
  const { enabled, toggle } = useDebugMode();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loglevel: enabled,
    },
  });

  useEffect(() => {
    form.setValue('loglevel', enabled);
  }, [enabled, form]);

  return (
    <Form {...form}>
      <form className="grid gap-4">
        <FormField
          control={form.control}
          name="loglevel"
          render={() => (
            <FormItem>
              <FormLabel className="flex justify-between">
                <span>Debug logging</span>
                <FormControl className="w-auto p-0">
                  <Checkbox
                    className="size-4"
                    checked={enabled}
                    onCheckedChange={toggle}
                  />
                </FormControl>
              </FormLabel>
              <FormDescription>Enable debug logging.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
