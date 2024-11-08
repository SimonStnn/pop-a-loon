import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import browser, { type Permissions } from 'webextension-polyfill';
import { z } from 'zod';
import { Default as DefaultBalloon } from '@/balloons';
import InfoIcon from '@/components/InfoIcon';
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { initalConfig } from '@/const';
import log from '@/managers/log';
import storage from '@/managers/storage';
import { askOriginPermissions } from '@/utils';

const MIN_POP_VOLUME = 0;
const VOLUME_STEP = 20;
const MAX_POP_VOLUME = 100;
const MIN_SPAWN_RATE = 0.1;
const MAX_SPAWN_RATE = 1;
const SPAWN_RATE_STEP = 0.1;
const SNOOZE_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Off', value: null },
  { label: '15 minutes', value: 15 * 60 * 1000 },
  { label: '1 hour', value: 1 * 60 * 60 * 1000 },
  { label: '3 hours', value: 3 * 60 * 60 * 1000 },
  { label: '8 hours', value: 8 * 60 * 60 * 1000 },
  { label: '24 hours', value: 24 * 60 * 60 * 1000 },
  { label: 'Until I turn it back on', value: -1 },
];

const formSchema = z.object({
  popVolume: z.number().int().min(MIN_POP_VOLUME).max(MAX_POP_VOLUME),
  spawnRate: z.number().int().min(MIN_SPAWN_RATE).max(MAX_SPAWN_RATE),
  fullScreenVideoSpawn: z.boolean(),
  snooze: z.number().int().min(-1).nullable().optional(),
  permissions: z.object({
    origins: z.array(z.string()),
    permissions: z.array(z.string()),
  }),
});

export default () => {
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [popVolume, setPopVolume] = useState(initalConfig.popVolume);
  const [spawnRate, setSpawnRate] = useState(initalConfig.spawnRate);
  const [fullScreenVideoSpawn, setFullScreenVideoSpawn] = useState(
    initalConfig.fullScreenVideoSpawn
  );
  const [permissions, setPermissions] = useState<Permissions.AnyPermissions>(
    {}
  );
  const [snooze, setSnooze] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const popSound = new DefaultBalloon().popSound;

  const onPopVolumeChange = async (popVolume: number) => {
    const config = await storage.sync.get('config');
    await storage.sync.set('config', { ...config, popVolume });
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
    const config = await storage.sync.get('config');
    await storage.sync.set('config', { ...config, spawnRate });
    setSpawnRate(spawnRate);
    log.debug(
      'Spawn rate changed to',
      (await storage.sync.get('config')).spawnRate
    );
  };

  const onFullScreenVideoSpawnChange = async (
    fullScreenVideoSpawn: boolean
  ) => {
    const config = await storage.sync.get('config');
    await storage.sync.set('config', { ...config, fullScreenVideoSpawn });
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

  const updateSnooze = async (
    snoozeEnd: number | null,
    saveToStorage: boolean = true
  ) => {
    setSnooze(snoozeEnd);
    if (saveToStorage) await storage.sync.set('snooze', snoozeEnd);
    console.debug('Snooze changed to', snoozeEnd);

    const snoozeOption = SNOOZE_OPTIONS.find(
      // Can only detect off or until I turn it back on
      (option) => option.value === snoozeEnd
    );
    console.debug('Snooze option is', snoozeOption);
    form.setValue('snooze', snoozeOption?.value);
  };

  const handleSnoozeChange = async (selectedDuration: string) => {
    const duration =
      selectedDuration === 'null' ? null : Number(selectedDuration);
    const snoozeEnd =
      duration === null ? null : duration > 0 ? Date.now() + duration : -1;
    await updateSnooze(snoozeEnd);
  };

  const renderSnoozeStatus = () => {
    if (snooze !== null && snooze > 0) {
      return (
        <>
          Snoozed until{' '}
          {new Date(snooze).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
          })}
        </>
      );
    } else if (snooze === -1) {
      return <>Snoozed until you turn it back off</>;
    }
    return <>Snooze is off</>;
  };

  useEffect(() => {
    const loadConfig = async () => {
      const config = await storage.sync.get('config');

      setPopVolume(config.popVolume);
      setSpawnRate(config.spawnRate);
      setFullScreenVideoSpawn(config.fullScreenVideoSpawn);
      setPermissions(await browser.permissions.getAll());
      await updateSnooze(await storage.sync.get('snooze'), false);
      setIsConfigLoaded(true); // Set loading status to true after config is loaded
    };

    loadConfig();
  }, []);

  return (
    <Form {...form}>
      <form className="grid gap-4">
        {!isConfigLoaded ? (
          <Skeleton className="h-[62px] w-full" />
        ) : (
          <FormField
            control={form.control}
            name="snooze"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between gap-1">
                  <span>Snooze Balloon Spawn</span>
                  <InfoIcon>
                    <h4 className="mb-1 font-medium leading-none">
                      Snooze Baloon Spawn
                    </h4>
                    <p className="text-sm font-normal leading-tight text-muted-foreground">
                      Set how long to pause the balloon appearances. During this
                      snooze period, no new balloons will spawn on your screen.
                    </p>
                    <p className="pt-1 text-sm font-medium leading-tight text-muted-foreground">
                      {renderSnoozeStatus()}
                    </p>
                  </InfoIcon>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={handleSnoozeChange}
                    defaultValue={
                      snooze === null || snooze === -1
                        ? String(snooze)
                        : undefined
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          snooze !== null && snooze > 0
                            ? `Snoozed until ${new Date(
                                snooze
                              ).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                              })}`
                            : 'Select a snooze duration'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {SNOOZE_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.label}
                          value={String(option.value)}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
            <FormItem className="flex justify-between gap-1">
              <FormLabel>Full-Screen Video Spawn</FormLabel>
              <FormControl>
                <span className="flex gap-2">
                  <Checkbox
                    checked={fullScreenVideoSpawn}
                    onCheckedChange={(val) => {
                      onFullScreenVideoSpawnChange(!!val);
                      onChange(!!val);
                    }}
                  />
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
              </FormControl>
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
