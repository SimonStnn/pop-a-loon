import React, { useEffect, useState } from 'react';
import log from 'loglevel';
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
import { Checkbox } from '@/components/ui/checkbox';
import { sendMessage } from '@/utils';
import storage from '@/storage';

const formSchema = z.object({
  loglevel: z.boolean(),
});

export default () => {
  const [loglevel, setLoglevel] = useState(log.getLevel());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loglevel: log.getLevel() === log.levels.DEBUG,
    },
  });

  const toggleDebugLogging = async () => {
    const level =
      loglevel === log.levels.DEBUG ? log.levels.INFO : log.levels.DEBUG;
    setLoglevel(level);
    log.setLevel(level);
    await sendMessage({ action: 'setLogLevel', level });
  };

  useEffect(() => {
    const loadLoglevel = async () => {
      const level = (await storage.local.get('loglevel')) || log.levels.INFO;
      setLoglevel(level);
      form.setValue('loglevel', level === log.levels.DEBUG);
    };
    loadLoglevel();
  }, []);

  return (
    <Form {...form}>
      <form className="grid gap-4">
        <FormField
          control={form.control}
          name="loglevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                <span>Debug logging</span>
                <FormControl className="w-auto p-0">
                  <Checkbox
                    className="size-4"
                    defaultChecked={loglevel === log.levels.DEBUG}
                    {...field}
                    onCheckedChange={toggleDebugLogging}
                    value={loglevel}
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
