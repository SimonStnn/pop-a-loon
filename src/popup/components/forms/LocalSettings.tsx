import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Slider } from '@components/ui/slider';
import InfoIcon from '@components/InfoIcon';
import { Default as DefaultBalloon } from '@/balloons';
import storage from '@/storage';

const MIN_POP_VOLUME = 0;
const VOLUME_STEP = 20;
const MAX_POP_VOLUME = 100;

const formSchema = z.object({
  popVolume: z.number().int().min(MIN_POP_VOLUME).max(MAX_POP_VOLUME),
});

export default () => {
  const [popVolume, setPopVolume] = useState(0);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      popVolume: popVolume,
    },
  });
  const popSound = new DefaultBalloon().popSound;

  const onPopVolumeChange = async (popVolume: number) => {
    // Save volume to storage
    const config = await storage.get('config');
    await storage.set('config', {
      ...config,
      popVolume,
    });

    setPopVolume(popVolume);
    console.log(
      'Pop volume changed to',
      (await storage.get('config')).popVolume
    );

    // Play the pop sound
    popSound.volume = popVolume / 100;
    popSound.play();
  };

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
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel className="flex justify-between gap-1">
                <span>Pop Volume</span>
                <span className="flex gap-2">
                  <span className="">{popVolume}</span>
                  <InfoIcon>
                    <h4 className="font-medium leading-none mb-1">
                      Pop Volume
                    </h4>
                    <p className="text-sm font-normal text-muted-foreground leading-tight">
                      The volume of the pop sound when a balloon is popped.
                    </p>
                  </InfoIcon>
                </span>
              </FormLabel>
              <FormControl>
                <Slider
                  min={MIN_POP_VOLUME}
                  max={MAX_POP_VOLUME}
                  step={VOLUME_STEP}
                  defaultValue={[popVolume]}
                  onValueChange={(vals) => {
                    onChange(vals[0]);
                    onPopVolumeChange(vals[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
