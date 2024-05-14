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
const MIN_SPAWN_RATE = 0.1;
const MAX_SPAWN_RATE = 1;
const SPAWN_RATE_STEP = 0.1;

const formSchema = z.object({
  popVolume: z.number().int().min(MIN_POP_VOLUME).max(MAX_POP_VOLUME),
  spawnRate: z.number().int().min(MIN_SPAWN_RATE).max(MAX_SPAWN_RATE),
});

export default () => {
  const [popVolume, setPopVolume] = useState(0);
  const [spawnRate, setSpawnRate] = useState(0);
  const form = useForm<z.infer<typeof formSchema>>({});
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

  const onSpawnRateChange = async (spawnRate: number) => {
    // Save volume to storage
    const config = await storage.get('config');
    await storage.set('config', {
      ...config,
      spawnRate,
    });

    setSpawnRate(spawnRate);
    console.log(
      'Spawn rate changed to',
      (await storage.get('config')).spawnRate
    );
  };

  useEffect(() => {
    const loadVolume = async () => {
      const config = await storage.get('config');
      // Load volume from storage
      setPopVolume(config.popVolume);
      setSpawnRate(config.spawnRate);
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
                  value={[popVolume]}
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
        <FormField
          control={form.control}
          name="spawnRate"
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel className="flex justify-between gap-1">
                <span>Spawn Rate</span>
                <span className="flex gap-2">
                  <span className="">x{spawnRate}</span>
                  <InfoIcon>
                    <h4 className="font-medium leading-none mb-1">
                      Spawn Rate
                    </h4>
                    <p className="text-sm font-normal text-muted-foreground leading-tight">
                      The rate at which balloons spawn. A lower value means less
                      balloons will spawn.
                    </p>
                  </InfoIcon>
                </span>
              </FormLabel>
              <FormControl>
                <Slider
                  min={MIN_SPAWN_RATE}
                  max={MAX_SPAWN_RATE}
                  step={SPAWN_RATE_STEP}
                  value={[spawnRate]}
                  onValueChange={(vals) => {
                    onChange(vals[0]);
                    onSpawnRateChange(vals[0]);
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
