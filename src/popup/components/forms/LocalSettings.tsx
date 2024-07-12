import React, { useEffect, useState } from 'react';
import browser, { manifest, type Permissions } from 'webextension-polyfill';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import InfoIcon from '@/components/InfoIcon';
import { Default as DefaultBalloon } from '@/balloons';
import storage from '@/managers/storage';
import log from '@/managers/log';
import { askOriginPermissions } from '@/utils';
import { initalConfig } from '@/const';

const MIN_POP_VOLUME = 0;
const VOLUME_STEP = 20;
const MAX_POP_VOLUME = 100;
const MIN_SPAWN_RATE = 0.1;
const MAX_SPAWN_RATE = 1;
const SPAWN_RATE_STEP = 0.1;

const formSchema = z.object({
  popVolume: z.number().int().min(MIN_POP_VOLUME).max(MAX_POP_VOLUME),
  spawnRate: z.number().int().min(MIN_SPAWN_RATE).max(MAX_SPAWN_RATE),
  fullScreenVideoSpawn: z.boolean(),
  permissions: z.object({
    origins: z.array(z.string()),
    permissions: z.array(z.string()),
  }),
});

export default () => {
  const [popVolume, setPopVolume] = useState(initalConfig.popVolume);
  const [spawnRate, setSpawnRate] = useState(initalConfig.spawnRate);
  const [fullScreenVideoSpawn, setFullScreenVideoSpawn] = useState(
    initalConfig.fullScreenVideoSpawn
  );
  const [permissions, setPermissions] = useState<Permissions.AnyPermissions>(
    {}
  );
  const form = useForm<z.infer<typeof formSchema>>({});
  const popSound = new DefaultBalloon().popSound;

  const onPopVolumeChange = async (popVolume: number) => {
    // Save volume to storage
    const config = await storage.sync.get('config');
    await storage.sync.set('config', {
      ...config,
      popVolume,
    });

    setPopVolume(popVolume);
    log.debug(
      'Pop volume changed to',
      (await storage.sync.get('config')).popVolume
    );

    // Play the pop sound
    popSound.volume = popVolume / 100;
    popSound.play();
  };

  const onSpawnRateChange = async (spawnRate: number) => {
    // Save volume to storage
    const config = await storage.sync.get('config');
    await storage.sync.set('config', {
      ...config,
      spawnRate,
    });

    setSpawnRate(spawnRate);
    log.debug(
      'Spawn rate changed to',
      (await storage.sync.get('config')).spawnRate
    );
  };

  const onFullScreenVideoSpawnChange = async (
    fullScreenVideoSpawn: boolean
  ) => {
    // Save volume to storage
    const config = await storage.sync.get('config');
    await storage.sync.set('config', {
      ...config,
      fullScreenVideoSpawn,
    });

    setFullScreenVideoSpawn(fullScreenVideoSpawn);
    log.debug(
      'Spawning in full screen video players:',
      (await storage.sync.get('config')).fullScreenVideoSpawn
    );
  };

  const onGrantOriginPermissionClick = async () => {
    await askOriginPermissions();
    setPermissions(await browser.permissions.getAll());
  };

  useEffect(() => {
    const loadVolume = async () => {
      const config = await storage.sync.get('config');
      // Load volume from storage
      setPopVolume(config.popVolume);
      setSpawnRate(config.spawnRate);
      setFullScreenVideoSpawn(config.fullScreenVideoSpawn);
      setPermissions(await browser.permissions.getAll());
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
                    <h4 className="mb-1 font-medium leading-none">
                      Pop Volume
                    </h4>
                    <p className="text-sm font-normal leading-tight text-muted-foreground">
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
                    <h4 className="mb-1 font-medium leading-none">
                      Spawn Rate
                    </h4>
                    <p className="text-sm font-normal leading-tight text-muted-foreground">
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
        <FormField
          control={form.control}
          name="fullScreenVideoSpawn"
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel className="flex justify-between gap-1">
                <span>Fullscreen video spawn</span>
                <span className="flex gap-2">
                  <FormControl>
                    <Checkbox
                      checked={fullScreenVideoSpawn}
                      onCheckedChange={(val) => {
                        onChange(val);
                        onFullScreenVideoSpawnChange(!!val);
                      }}
                    />
                  </FormControl>
                  <InfoIcon>
                    <h4 className="mb-1 font-medium leading-none">
                      Fullscreen video spawn
                    </h4>
                    <p className="text-sm font-normal leading-tight text-muted-foreground">
                      Weither or not to spawn balloons in fullscreen video
                      players, like youtube.
                    </p>
                    <p className="pt-1 text-sm font-medium leading-tight text-muted-foreground">
                      {fullScreenVideoSpawn ? (
                        <>Balloons can spawn!</>
                      ) : (
                        <>Balloons will not spawn.</>
                      )}
                    </p>
                  </InfoIcon>
                </span>
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* If the user hasn't granted the host permissions; show the grant permission button */}
        {!(permissions.origins?.length !== 0) && (
          <FormField
            control={form.control}
            name="permissions.origins"
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel className="flex justify-between gap-1">
                  <span>Host Permission</span>
                  <InfoIcon>
                    <h4 className="mb-1 font-medium leading-none">
                      Host Permission{' '}
                      <span className="text-xs text-red-500">*recommended</span>
                    </h4>
                    <p className="text-sm font-normal leading-tight text-muted-foreground">
                      Pop-a-loon requires host permissions to function properly.
                    </p>
                  </InfoIcon>
                </FormLabel>
                <FormControl>
                  <span className="flex gap-2">
                    <Button
                      className="w-full"
                      size={'sm'}
                      onClick={onGrantOriginPermissionClick}
                    >
                      Grant permission
                    </Button>
                  </span>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
};
